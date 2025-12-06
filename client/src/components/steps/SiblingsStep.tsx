import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface SiblingsStepProps {
  form: UseFormReturn<any>;
}

export function SiblingsStep({ form }: SiblingsStepProps) {
  const { register, watch, setValue } = form;

  const hasSiblings = watch("siblings.hasSiblings");
  const siblingsList = watch("siblings.list") || [];

  const addSibling = () => {
    setValue("siblings.list", [
      ...siblingsList,
      {
        names: {},
        birthDate: {},
        birthPlace: {},
        relationship: "",
        occupation: "",
        achievements: "",
        familyStories: "",
        additionalComments: "",
      },
    ]);
  };

  const removeSibling = (index: number) => {
    setValue(
      "siblings.list",
      siblingsList.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <p className="text-sm text-green-800">
          <span className="font-semibold">Подсказка:</span> Укажите информацию о ваших братьях и сёстрах 
          (родных и двоюродных). Это поможет составить более полную картину семьи. Чем больше подробностей - тем лучше.
        </p>
      </div>

      {/* Вопрос о наличии братьев/сестёр */}
      <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50/30">
        <Label className="text-lg font-semibold mb-4 block">
          У вас есть братья или сестры не далее, чем двоюродные?
        </Label>
        
        <RadioGroup
          value={hasSiblings}
          onValueChange={(value) => setValue("siblings.hasSiblings", value)}
        >
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="yes" id="siblings-yes" />
            <Label htmlFor="siblings-yes" className="cursor-pointer text-base">
              Да
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="siblings-no" />
            <Label htmlFor="siblings-no" className="cursor-pointer text-base">
              Нет
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Если есть братья/сестры */}
      {hasSiblings === "yes" && (
        <div className="space-y-6">
          {siblingsList.map((sibling: any, index: number) => (
            <div
              key={index}
              className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50/30 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeSibling(index)}
              >
                <X className="w-4 h-4" />
              </Button>

              <h4 className="font-semibold text-lg mb-4 text-indigo-900">
                Брат/Сестра {index + 1}
              </h4>

              {/* ФИО */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor={`siblings.list.${index}.names.lastName`}>Фамилия</Label>
                  <Input
                    id={`siblings.list.${index}.names.lastName`}
                    {...register(`siblings.list.${index}.names.lastName`)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor={`siblings.list.${index}.names.firstName`}>Имя</Label>
                  <Input
                    id={`siblings.list.${index}.names.firstName`}
                    {...register(`siblings.list.${index}.names.firstName`)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor={`siblings.list.${index}.names.middleName`}>Отчество</Label>
                  <Input
                    id={`siblings.list.${index}.names.middleName`}
                    {...register(`siblings.list.${index}.names.middleName`)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Дата рождения */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`siblings.list.${index}.birthDate.date`}>Дата рождения</Label>
                  <Input
                    id={`siblings.list.${index}.birthDate.date`}
                    type="date"
                    {...register(`siblings.list.${index}.birthDate.date`)}
                    className="mt-2"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id={`siblings.list.${index}.birthDate.isApproximate`}
                      checked={watch(`siblings.list.${index}.birthDate.isApproximate`)}
                      onCheckedChange={(checked) =>
                        setValue(`siblings.list.${index}.birthDate.isApproximate`, checked)
                      }
                    />
                    <Label
                      htmlFor={`siblings.list.${index}.birthDate.isApproximate`}
                      className="text-sm cursor-pointer"
                    >
                      Примерная
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`siblings.list.${index}.birthPlace.historicalName`}>
                    Место рождения
                  </Label>
                  <Input
                    id={`siblings.list.${index}.birthPlace.historicalName`}
                    {...register(`siblings.list.${index}.birthPlace.historicalName`)}
                    placeholder="Город, село"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Степень родства */}
              <div className="mb-4">
                <Label htmlFor={`siblings.list.${index}.relationship`}>Степень родства</Label>
                <Select
                  value={watch(`siblings.list.${index}.relationship`)}
                  onValueChange={(value) => setValue(`siblings.list.${index}.relationship`, value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Выберите степень родства" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="родной брат">Родной брат</SelectItem>
                    <SelectItem value="родная сестра">Родная сестра</SelectItem>
                    <SelectItem value="двоюродный брат">Двоюродный брат</SelectItem>
                    <SelectItem value="двоюродная сестра">Двоюродная сестра</SelectItem>
                    <SelectItem value="сводный брат">Сводный брат</SelectItem>
                    <SelectItem value="сводная сестра">Сводная сестра</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Род деятельности */}
              <div className="mb-4">
                <Label htmlFor={`siblings.list.${index}.occupation`}>Род деятельности</Label>
                <Textarea
                  id={`siblings.list.${index}.occupation`}
                  {...register(`siblings.list.${index}.occupation`)}
                  placeholder="Профессия, основная деятельность, карьерный путь"
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Достижения */}
              <div className="mb-4">
                <Label htmlFor={`siblings.list.${index}.achievements`}>Достижения</Label>
                <Textarea
                  id={`siblings.list.${index}.achievements`}
                  {...register(`siblings.list.${index}.achievements`)}
                  placeholder="Важные достижения, награды, успехи..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Семейные истории */}
              <div className="mb-4">
                <Label htmlFor={`siblings.list.${index}.familyStories`}>Семейные истории</Label>
                <Textarea
                  id={`siblings.list.${index}.familyStories`}
                  {...register(`siblings.list.${index}.familyStories`)}
                  placeholder="Интересные истории, воспоминания..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Наличие документов */}
              <div className="mb-4">
                <Label htmlFor={`siblings.list.${index}.documents`}>
                  Наличие документов, архивов, фотографий
                </Label>
                <Textarea
                  id={`siblings.list.${index}.documents`}
                  {...register(`siblings.list.${index}.documents`)}
                  placeholder="Опишите, какие документы, фотографии, видео, аудио или иные материалы сохранились и могут быть предоставлены для ознакомления если имеются"
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Дополнительные комментарии */}
              <div>
                <Label htmlFor={`siblings.list.${index}.additionalComments`}>
                  Дополнительная информация
                </Label>
                <Textarea
                  id={`siblings.list.${index}.additionalComments`}
                  {...register(`siblings.list.${index}.additionalComments`)}
                  placeholder="Любая известная вам дополнительная информация, которая не отражена в предыдущих полях и которая может быть интересна - Детство, Хобби, Жизненные истории, мудрости, цитаты, интересные факты"
                  className="mt-2"
                  rows={2}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSibling}
            className="w-full border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить брата/сестру
          </Button>

          {siblingsList.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Нажмите кнопку выше, чтобы добавить информацию о брате или сестре</p>
            </div>
          )}
        </div>
      )}

      {hasSiblings === "no" && (
        <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg border-2 border-gray-200">
          <p className="text-lg">Раздел завершён. Вы можете перейти к следующему шагу.</p>
        </div>
      )}
    </div>
  );
}

