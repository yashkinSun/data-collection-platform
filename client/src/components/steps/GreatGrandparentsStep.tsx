import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface GreatGrandparentsStepProps {
  form: UseFormReturn<any>;
}

export function GreatGrandparentsStep({ form }: GreatGrandparentsStepProps) {
  const { register, watch, setValue } = form;

  const hasInfo = watch("greatGrandparents.hasInfo");
  const list = watch("greatGrandparents.list") || [];

  const addGreatGrandparent = () => {
    setValue("greatGrandparents.list", [
      ...list,
      {
        names: {},
        lifeYears: { birthDate: {}, birthPlace: {} },
        socialStatus: {},
        profession: {},
        education: "",
        militaryService: "",
        warParticipation: "",
        repressions: "",
        achievements: "",
        character: "",
        additionalInfo: "",
      },
    ]);
  };

  const removeGreatGrandparent = (index: number) => {
    setValue(
      "greatGrandparents.list",
      list.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
        <p className="text-sm text-purple-800">
          <span className="font-semibold">Подсказка:</span> Если у вас есть информация о более старших 
          предках (прадедушки/прабабушки и ранее) или о близких родственниках не попавших в предыдущие разделы, укажите её здесь. Чем больше подробностей - тем лучше.
		  Любые воспоминания ценны!
        </p>
      </div>

      {/* Вопрос о наличии информации */}
      <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50/30">
        <Label className="text-lg font-semibold mb-4 block">
          Есть ли у вас воспоминания и/или информация о более старших предках (прадедушки/прабабушки и ранее) или родственниках НЕ попавших в предыдущие разделы?
        </Label>
        
        <RadioGroup
          value={hasInfo}
          onValueChange={(value) => setValue("greatGrandparents.hasInfo", value)}
        >
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="yes" id="great-yes" />
            <Label htmlFor="great-yes" className="cursor-pointer text-base">
              Да
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="great-no" />
            <Label htmlFor="great-no" className="cursor-pointer text-base">
              Нет
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Если есть информация */}
      {hasInfo === "yes" && (
        <div className="space-y-6">
          {list.map((item: any, index: number) => (
            <div
              key={index}
              className="border-2 border-amber-200 rounded-lg p-6 bg-amber-50/30 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeGreatGrandparent(index)}
              >
                <X className="w-4 h-4" />
              </Button>

              <h4 className="font-semibold text-lg mb-4 text-amber-900">
                Предок {index + 1}
              </h4>

              {/* ФИО */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor={`greatGrandparents.list.${index}.names.lastName`}>Фамилия</Label>
                  <Input
                    id={`greatGrandparents.list.${index}.names.lastName`}
                    {...register(`greatGrandparents.list.${index}.names.lastName`)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor={`greatGrandparents.list.${index}.names.maidenName`}>
                    Девичья фамилия (если применимо)
                  </Label>
                  <Input
                    id={`greatGrandparents.list.${index}.names.maidenName`}
                    {...register(`greatGrandparents.list.${index}.names.maidenName`)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor={`greatGrandparents.list.${index}.names.firstName`}>Имя</Label>
                  <Input
                    id={`greatGrandparents.list.${index}.names.firstName`}
                    {...register(`greatGrandparents.list.${index}.names.firstName`)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor={`greatGrandparents.list.${index}.names.middleName`}>Отчество</Label>
                  <Input
                    id={`greatGrandparents.list.${index}.names.middleName`}
                    {...register(`greatGrandparents.list.${index}.names.middleName`)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Степень родства */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.relationship`}>
                  Степень родства
                </Label>
                <Input
                  id={`greatGrandparents.list.${index}.relationship`}
                  {...register(`greatGrandparents.list.${index}.relationship`)}
                  placeholder="Укажите степень родства и ветвь, например - прадедушка по отцовской линии"
                  className="mt-2"
                />
              </div>

              {/* Годы жизни */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`greatGrandparents.list.${index}.lifeYears.birthDate.date`}>
                    Дата рождения
                  </Label>
                  <Input
                    id={`greatGrandparents.list.${index}.lifeYears.birthDate.date`}
                    type="date"
                    {...register(`greatGrandparents.list.${index}.lifeYears.birthDate.date`)}
                    className="mt-2"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id={`greatGrandparents.list.${index}.lifeYears.birthDate.isApproximate`}
                      checked={watch(`greatGrandparents.list.${index}.lifeYears.birthDate.isApproximate`)}
                      onCheckedChange={(checked) =>
                        setValue(`greatGrandparents.list.${index}.lifeYears.birthDate.isApproximate`, checked)
                      }
                    />
                    <Label
                      htmlFor={`greatGrandparents.list.${index}.lifeYears.birthDate.isApproximate`}
                      className="text-sm cursor-pointer"
                    >
                      Примерная
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`greatGrandparents.list.${index}.lifeYears.birthPlace.historicalName`}>
                    Место рождения
                  </Label>
                  <Input
                    id={`greatGrandparents.list.${index}.lifeYears.birthPlace.historicalName`}
                    {...register(`greatGrandparents.list.${index}.lifeYears.birthPlace.historicalName`)}
                    placeholder="Город, село"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Образование */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.education`}>Образование</Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.education`}
                  {...register(`greatGrandparents.list.${index}.education`)}
                  placeholder="Если известно, укажите школу, техникум, вуз или иное образование"
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Сословие */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.socialStatus.estate`}>Сословие</Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.socialStatus.estate`}
                  {...register(`greatGrandparents.list.${index}.socialStatus.estate`)}
                  placeholder="Крестьяне, мещане, дворяне...Чем больше подробностей - тем лучше."
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Профессия */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.profession.mainOccupation`}>Профессия</Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.profession.mainOccupation`}
                  {...register(`greatGrandparents.list.${index}.profession.mainOccupation`)}
                  placeholder="Род занятий, карьерный путь"
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Военная служба */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.militaryService`}>Военная служба</Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.militaryService`}
                  {...register(`greatGrandparents.list.${index}.militaryService`)}
                  placeholder="Годы службы, части, звания..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Участие в войнах */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.warParticipation`}>Участие в войнах</Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.warParticipation`}
                  {...register(`greatGrandparents.list.${index}.warParticipation`)}
                  placeholder="Какие войны, в каком качестве, награды..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Репрессии */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.repressions`}>Репрессии</Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.repressions`}
                  {...register(`greatGrandparents.list.${index}.repressions`)}
                  placeholder="Информация о репрессиях, если известно..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Достижения */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.achievements`}>Достижения</Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.achievements`}
                  {...register(`greatGrandparents.list.${index}.achievements`)}
                  placeholder="Важные достижения, награды, успехи..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Семейные истории */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.character`}>
                  Семейные истории и воспоминания
                </Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.character`}
                  {...register(`greatGrandparents.list.${index}.character`)}
                  placeholder="Что известно, семейные легенды, особенности..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Наличие документов */}
              <div className="mb-4">
                <Label htmlFor={`greatGrandparents.list.${index}.documents`}>
                  Наличие документов, архивов, фотографий
                </Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.documents`}
                  {...register(`greatGrandparents.list.${index}.documents`)}
                  placeholder="Опишите, какие документы, фотографии, видео, аудио или иные материалы сохранились и могут быть предоставлены для ознакомления если имеются"
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Дополнительная информация */}
              <div>
                <Label htmlFor={`greatGrandparents.list.${index}.additionalInfo`}>
                  Дополнительная информация (в свободной форме)
                </Label>
                <Textarea
                  id={`greatGrandparents.list.${index}.additionalInfo`}
                  {...register(`greatGrandparents.list.${index}.additionalInfo`)}
                  placeholder="Любая известная вам дополнительная информация, которая не отражена в предыдущих полях и которая может быть интересна - Детство, Хобби, Жизненные истории, мудрости, цитаты, интересные факты"
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addGreatGrandparent}
            className="w-full border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить предка
          </Button>

          {list.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Нажмите кнопку выше, чтобы добавить информацию о предке</p>
            </div>
          )}
        </div>
      )}

      {hasInfo === "no" && (
        <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg border-2 border-gray-200">
          <p className="text-lg">Раздел завершён. Вы можете перейти к следующему шагу.</p>
        </div>
      )}
    </div>
  );
}

