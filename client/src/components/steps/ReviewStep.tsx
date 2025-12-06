import { Button } from "@/components/ui/button";
import { getBilingualFieldLabel } from "@/lib/fieldTranslations";
import { CheckCircle2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ReviewStepProps {
  form: UseFormReturn<any>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({ form, onSubmit, isSubmitting }: ReviewStepProps) {
  const data = form.getValues();

  const renderSection = (title: string, content: any, color: string = "blue") => {
    if (!content || Object.keys(content).length === 0) return null;

    return (
      <div className={`border-2 border-${color}-200 rounded-lg p-6 bg-${color}-50/30`}>
        <h3 className={`text-xl font-bold text-${color}-900 mb-4`}>{title}</h3>
        <div className="space-y-2 text-sm">
          {Object.entries(content).map(([key, value]) => {
            if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) return null;
            
            return (
              <div key={key} className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-700">
                  {getBilingualFieldLabel(key)}:
                </span>
                <span className="col-span-2 text-gray-900">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <p className="text-sm text-green-800">
          <span className="font-semibold">Проверьте данные перед отправкой.</span> Вы можете вернуться 
          к любому шагу и внести изменения. После отправки данные будут сохранены. Формат данных в предпросмотре может казаться непривычным, это нормально, 
		  так как такой формат впоследствии используется для программной обработки и саммаризации собранных данных. 
		  <strong> Рекомендуем </strong> для удобства перепроверять данные путем переключения между шагами в верхнем меню.
		  Если вы вспомните, что что-то упустили после отправки опросника - <strong>пожалуйста</strong>, свяжитесь с организатором проекта: hs-mixen@yandex.com
        </p>
      </div>

      <div className="space-y-6">
        {data.consent && renderSection("Согласие на обработку данных", data.consent, "blue")}
        {data.respondent && renderSection("Сведения о респонденте", data.respondent, "indigo")}
        {data.parents && (
          <>
            {data.parents.father && renderSection("Отец", data.parents.father, "blue")}
            {data.parents.mother && renderSection("Мать", data.parents.mother, "pink")}
          </>
        )}
        {data.siblings && renderSection("Братья и Сёстры", data.siblings, "cyan")}
        {data.grandparents && (
          <>
            {data.grandparents.paternalGrandfather && renderSection("Дедушка по отцу", data.grandparents.paternalGrandfather, "blue")}
            {data.grandparents.paternalGrandmother && renderSection("Бабушка по отцу", data.grandparents.paternalGrandmother, "pink")}
            {data.grandparents.maternalGrandfather && renderSection("Дедушка по матери", data.grandparents.maternalGrandfather, "green")}
            {data.grandparents.maternalGrandmother && renderSection("Бабушка по матери", data.grandparents.maternalGrandmother, "purple")}
          </>
        )}
        {data.greatGrandparents && renderSection("Другие родственники", data.greatGrandparents, "teal")}
        {data.places && renderSection("Места проживания", data.places, "purple")}
        {data.traditions && renderSection("Семейные традиции", data.traditions, "amber")}
        {data.additionalInfo && renderSection("Дополнительная информация", data.additionalInfo, "gray")}
      </div>

      <div className="border-t-2 pt-6 mt-8">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Что произойдёт после отправки?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Ваши данные будут сохранены в базе данных</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Будут созданы файлы экспорта в форматах JSON и CSV</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Вы сможете скачать PDF-версию опросника</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Данные будут использованы для составления семейной родословной</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Мы попросим Вас поделиться копиями имеющихся документов или фотографий, если таковые были указаны в опроснике</span>
            </li>
          </ul>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className="w-full text-lg py-6"
        >
          {isSubmitting ? "Отправка..." : "Отправить опросник"}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Нажимая кнопку, вы подтверждаете правильность введённых данных
        </p>
      </div>
    </div>
  );
}
