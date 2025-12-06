import { useAuth } from "@/_core/hooks/useAuth";
import { AdditionalInfoStep } from "@/components/steps/AdditionalInfoStep";
import { ConsentStep } from "@/components/steps/ConsentStep";
import { GrandparentsStep } from "@/components/steps/GrandparentsStep";
import { GreatGrandparentsStep } from "@/components/steps/GreatGrandparentsStep";
import { ParentsStep } from "@/components/steps/ParentsStep";
import { PlacesStep } from "@/components/steps/PlacesStep";
import { RespondentStep } from "@/components/steps/RespondentStep";
import { ReviewStep } from "@/components/steps/ReviewStep";
import { SiblingsStep } from "@/components/steps/SiblingsStep";
import { TraditionsStep } from "@/components/steps/TraditionsStep";
import { Step, StepWizard } from "@/components/StepWizard";
import { Button } from "@/components/ui/button";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";

// Упрощенная схема для начала (полная схема будет добавлена позже)
const questionnaireSchema = z.object({
  consent: z.object({
    fullName: z.string().min(1, "ФИО обязательно"),
    agreeToProcess: z.boolean().refine(val => val === true, { message: "Согласие обязательно" }),
    agreeToPublishFamilyBook: z.boolean().optional(),
    agreeToShareFamilyMembers: z.boolean().optional(),
    agreeToPublishText: z.boolean().optional(),
    agreeToPublishPhotos: z.boolean().optional(),
    privacyLevel: z.enum(["только для семьи", "для книги", "можно публиковать открыто"]).optional(),
    specialRestrictions: z.string().optional(),
  }),
  respondent: z.object({
    lastName: z.string().min(1, "Фамилия обязательна"),
    firstName: z.string().min(1, "Имя обязательно"),
    middleName: z.string().min(1, "Отчество обязательно"),
    maidenName: z.string().optional(),
    nicknames: z.array(z.string()).optional(),
    birthDate: z.object({
      date: z.string().min(1, "Дата рождения обязательна"),
      isApproximate: z.boolean().optional(),
      dateRange: z.string().optional(),
    }),
    birthPlace: z.object({
      settlementType: z.string().optional(),
      historicalName: z.string().min(1, "Название населённого пункта обязательно"),
      region: z.string().optional(),
      countryAtTime: z.string().min(1, "Страна обязательна"),
    }),
    contact: z.object({
      phone: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
    }).optional(),
  }),
  parents: z.any().optional(),
  siblings: z.any().optional(),
  grandparents: z.any().optional(),
  greatGrandparents: z.any().optional(),
  places: z.any().optional(),
  traditions: z.any().optional(),
  additionalInfo: z.any().optional(),
});

type QuestionnaireData = z.infer<typeof questionnaireSchema>;

export default function Questionnaire() {
  const { user, loading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [token, setToken] = useState<string | null>(null);

  // Загрузка черновика пользователя
  const { data: draftData, isLoading: draftLoading } = trpc.questionnaire.getMyDraft.useQuery(
    undefined,
    { enabled: !!user && !authLoading }
  );
  const saveMutation = trpc.questionnaire.save.useMutation();

  const form = useForm<QuestionnaireData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      consent: {
        agreeToProcess: false,
        agreeToPublishFamilyBook: false,
        agreeToShareFamilyMembers: false,
        agreeToPublishText: false,
        agreeToPublishPhotos: false,
      },
      respondent: {
        nicknames: [],
        birthDate: {
          isApproximate: false,
        },
        birthPlace: {},
        contact: {},
      },
      parents: {
        father: {},
        mother: {},
      },
      siblings: {},
      grandparents: {},
      greatGrandparents: {},
      places: {
        migrationPlaces: [],
      },
      traditions: {},
      additionalInfo: {
        freeText: "",
      },
    },
  });

  // Инициализация: загрузить черновик пользователя
  useEffect(() => {
    if (draftData && !token) {
      setToken(draftData.token);
      if (draftData.data && Object.keys(draftData.data).length > 0) {
        form.reset(draftData.data);
      }
    }
  }, [draftData]);

  // Автосохранение при изменении данных
  useEffect(() => {
    if (!token) return;

    const subscription = form.watch((data) => {
      const timeoutId = setTimeout(() => {
        saveMutation.mutate({
          token,
          data: data as any,
        });
      }, 2000); // Debounce 2 секунды

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [token, form.watch]);

  const submitMutation = trpc.questionnaire.submit.useMutation({
    onSuccess: () => {
      setLocation(`/success?token=${token}`);
    },
    onError: (error) => {
      alert("Ошибка при отправке: " + error.message);
    },
  });

  const handleSubmit = () => {
    form.handleSubmit((data) => {
      if (!token) return;

      submitMutation.mutate({
        token,
        data,
      });
    })();
  };

  const steps: Step[] = [
    {
      id: "consent",
      title: "Согласие на обработку данных",
      description: "Пожалуйста, ознакомьтесь с условиями и дайте согласие",
      category: "general",
      component: <ConsentStep form={form} />,
    },
    {
      id: "respondent",
      title: "Сведения о Вас",
      description: "Основная информация о респонденте",
      category: "family",
      component: <RespondentStep form={form} />,
    },
    {
      id: "parents",
      title: "Родители",
      description: "Информация о ваших родителях",
      category: "family",
      component: <ParentsStep form={form} />,
    },
    {
      id: "siblings",
      title: "Братья и сёстры",
      description: "Информация о ваших братьях и сёстрах",
      category: "family",
      component: <SiblingsStep form={form} />,
    },
    {
      id: "grandparents",
      title: "Бабушки и дедушки",
      description: "Информация о ваших бабушках и дедушках",
      category: "family",
      component: <GrandparentsStep form={form} />,
    },
    {
      id: "greatGrandparents",
      title: "Другие родственники",
      description: "Информация о более старших предках или близких родственниках не попавших в прошлые разделы",
      category: "family",
      component: <GreatGrandparentsStep form={form} />,
    },
    {
      id: "places",
      title: "Места проживания",
      description: "География семьи: миграции и переезды",
      category: "migration",
      component: <PlacesStep form={form} />,
    },
    {
      id: "traditions",
      title: "Семейные традиции",
      description: "Культура, традиции и особенности семьи",
      category: "traditions",
      component: <TraditionsStep form={form} />,
    },
    {
      id: "additionalInfo",
      title: "Дополнительная информация",
      description: "Любая дополнительная информация",
      category: "general",
      component: <AdditionalInfoStep form={form} />,
    },
    {
      id: "review",
      title: "Проверка и отправка",
      description: "Проверьте введённые данные перед отправкой",
      category: "general",
      component: <ReviewStep form={form} onSubmit={handleSubmit} isSubmitting={submitMutation.isPending} />,
    },
  ];

  const handleNext = async () => {
    const currentStepId = steps[currentStep].id;
    const isValid = await form.trigger(currentStepId as any);

    if (isValid) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Финальная отправка
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {APP_TITLE}
          </h1>
          <p className="text-gray-600 mb-6">
            Для заполнения опросника необходимо войти в систему
          </p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            size="lg"
            className="w-full"
          >
            Войти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Семейный опросник
          </h1>
          <p className="text-gray-600">
            Сохраним память о наших предках для будущих поколений
          </p>
          <p className={`text-sm text-blue-600 mt-2 ${
            saveMutation.isPending ? 'visible' : 'invisible'
          }`}>
            Сохранение...
          </p>
        </div>

        <StepWizard
          steps={steps}
          currentStep={currentStep}
          onNext={handleNext}
          onPrev={handlePrev}
          onGoToStep={handleGoToStep}
          canGoNext={true}
          canGoPrev={currentStep > 0}
          completedSteps={completedSteps}
        />
      </div>
    </div>
  );
}

