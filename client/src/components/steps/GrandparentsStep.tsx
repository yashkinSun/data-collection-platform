import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface GrandparentsStepProps {
  form: UseFormReturn<any>;
}

export function GrandparentsStep({ form }: GrandparentsStepProps) {
  const { register, watch, setValue } = form;

  const grandparents = [
    { key: "paternalGrandfather", title: "Дедушка по отцу", color: "blue", isGrandmother: false },
    { key: "paternalGrandmother", title: "Бабушка по отцу", color: "pink", isGrandmother: true },
    { key: "maternalGrandfather", title: "Дедушка по матери", color: "green", isGrandmother: false },
    { key: "maternalGrandmother", title: "Бабушка по матери", color: "purple", isGrandmother: true },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Подсказка:</span> Заполните информацию о ваших бабушках и дедушках. 
          Любая информация ценна, даже если она неполная. Чем больше подробностей - тем лучше.
        </p>
      </div>

      {grandparents.map(({ key, title, color, isGrandmother }) => (
        <div key={key} className={`border-2 border-${color}-200 rounded-lg p-6 bg-${color}-50/30`}>
          <h3 className={`text-xl font-bold text-${color}-900 mb-4`}>{title}</h3>

          {/* ФИО */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor={`grandparents.${key}.names.lastName`}>Фамилия</Label>
              <Input
                id={`grandparents.${key}.names.lastName`}
                {...register(`grandparents.${key}.names.lastName`)}
                className="mt-2"
              />
            </div>
            {isGrandmother && (
              <div>
                <Label htmlFor={`grandparents.${key}.names.maidenName`}>Девичья фамилия</Label>
                <Input
                  id={`grandparents.${key}.names.maidenName`}
                  {...register(`grandparents.${key}.names.maidenName`)}
                  className="mt-2"
                />
              </div>
            )}
            <div>
              <Label htmlFor={`grandparents.${key}.names.firstName`}>Имя</Label>
              <Input
                id={`grandparents.${key}.names.firstName`}
                {...register(`grandparents.${key}.names.firstName`)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor={`grandparents.${key}.names.middleName`}>Отчество</Label>
              <Input
                id={`grandparents.${key}.names.middleName`}
                {...register(`grandparents.${key}.names.middleName`)}
                className="mt-2"
              />
            </div>
          </div>

          {/* Годы жизни */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`grandparents.${key}.lifeYears.birthDate.date`}>Дата рождения</Label>
              <Input
                id={`grandparents.${key}.lifeYears.birthDate.date`}
                type="date"
                {...register(`grandparents.${key}.lifeYears.birthDate.date`)}
                className="mt-2"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id={`grandparents.${key}.lifeYears.birthDate.isApproximate`}
                  checked={watch(`grandparents.${key}.lifeYears.birthDate.isApproximate`)}
                  onCheckedChange={(checked) => setValue(`grandparents.${key}.lifeYears.birthDate.isApproximate`, checked)}
                />
                <Label htmlFor={`grandparents.${key}.lifeYears.birthDate.isApproximate`} className="text-sm cursor-pointer">
                  Примерная
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor={`grandparents.${key}.lifeYears.birthPlace.historicalName`}>Место рождения</Label>
              <Input
                id={`grandparents.${key}.lifeYears.birthPlace.historicalName`}
                {...register(`grandparents.${key}.lifeYears.birthPlace.historicalName`)}
                placeholder="Город, село"
                className="mt-2"
              />
            </div>
          </div>

          {/* Образование */}
          <div className="mb-4">
            <Label htmlFor={`grandparents.${key}.education`}>Образование</Label>
            <Textarea
              id={`grandparents.${key}.education`}
              {...register(`grandparents.${key}.education`)}
              placeholder="Если известно, укажите школу, техникум, вуз или иное образование"
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Сословие и профессия */}
          <div className="space-y-4 mb-4">
            <div>
              <Label htmlFor={`grandparents.${key}.socialStatus.estate`}>Сословие</Label>
              <Textarea
                id={`grandparents.${key}.socialStatus.estate`}
                {...register(`grandparents.${key}.socialStatus.estate`)}
                placeholder="Крестьяне, мещане, дворяне...Чем больше подробностей - тем лучше."
                className="mt-2"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor={`grandparents.${key}.profession.mainOccupation`}>Профессия</Label>
              <Textarea
                id={`grandparents.${key}.profession.mainOccupation`}
                {...register(`grandparents.${key}.profession.mainOccupation`)}
                placeholder="Род занятий и карьерный путь"
                className="mt-2"
                rows={2}
              />
            </div>
          </div>

          {/* Военная служба */}
          <div className="mb-4">
            <Label htmlFor={`grandparents.${key}.militaryService`}>Военная служба</Label>
            <Textarea
              id={`grandparents.${key}.militaryService`}
              {...register(`grandparents.${key}.militaryService`)}
              placeholder="Годы службы, части, звания..."
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Участие в войнах */}
          <div className="mb-4">
            <Label htmlFor={`grandparents.${key}.warParticipation`}>Участие в войнах</Label>
            <Textarea
              id={`grandparents.${key}.warParticipation`}
              {...register(`grandparents.${key}.warParticipation`)}
              placeholder="Какие войны, в каком качестве, награды..."
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Репрессии */}
          <div className="mb-4">
            <Label htmlFor={`grandparents.${key}.repressions`}>Репрессии</Label>
            <Textarea
              id={`grandparents.${key}.repressions`}
              {...register(`grandparents.${key}.repressions`)}
              placeholder="Информация о репрессиях, если известно..."
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Достижения */}
          <div className="mb-4">
            <Label htmlFor={`grandparents.${key}.achievements`}>Достижения</Label>
            <Textarea
              id={`grandparents.${key}.achievements`}
              {...register(`grandparents.${key}.achievements`)}
              placeholder="Важные достижения, награды, успехи..."
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Семейные истории */}
          <div className="mb-4">
            <Label htmlFor={`grandparents.${key}.character`}>Семейные истории и воспоминания</Label>
            <Textarea
              id={`grandparents.${key}.character`}
              {...register(`grandparents.${key}.character`)}
              placeholder="Что известно, семейные легенды, особенности..."
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Наличие документов */}
          <div className="mb-4">
            <Label htmlFor={`grandparents.${key}.documents`}>
              Наличие документов, архивов, фотографий
            </Label>
            <Textarea
              id={`grandparents.${key}.documents`}
              {...register(`grandparents.${key}.documents`)}
              placeholder="Опишите, какие документы, фотографии, видео, аудио или иные материалы сохранились и могут быть предоставлены для ознакомления если имеются"
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Дополнительная информация */}
          <div>
            <Label htmlFor={`grandparents.${key}.additionalInfo`}>Дополнительная информация</Label>
            <Textarea
              id={`grandparents.${key}.additionalInfo`}
              {...register(`grandparents.${key}.additionalInfo`)}
              placeholder="Любая известная вам дополнительная информация, которая не отражена в предыдущих полях и которая может быть интересна - Детство, Хобби, Жизненные истории, мудрости, цитаты, интересные факты"
              className="mt-2"
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

