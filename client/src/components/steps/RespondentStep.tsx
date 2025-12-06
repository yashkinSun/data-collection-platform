import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface RespondentStepProps {
  form: UseFormReturn<any>;
}

export function RespondentStep({ form }: RespondentStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const addNickname = () => {
    const current = watch("respondent.nicknames") || [];
    setValue("respondent.nicknames", [...current, ""]);
  };

  const removeNickname = (index: number) => {
    const current = watch("respondent.nicknames") || [];
    setValue("respondent.nicknames", current.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Подсказка:</span> Заполните информацию о себе. 
          Поля, отмеченные <span className="text-red-500 font-bold">★</span>, обязательны для заполнения.
        </p>
      </div>

      {/* ФИО */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="respondent.lastName" className="text-base font-semibold">
            Фамилия <span className="text-red-500">★</span>
          </Label>
          <Input
            id="respondent.lastName"
            {...register("respondent.lastName")}
            placeholder="Иванов"
            className="mt-2 text-lg"
          />
          {(errors as any).respondent?.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {(errors as any).respondent?.lastName?.message || "Обязательное поле"}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="respondent.firstName" className="text-base font-semibold">
            Имя <span className="text-red-500">★</span>
          </Label>
          <Input
            id="respondent.firstName"
            {...register("respondent.firstName")}
            placeholder="Иван"
            className="mt-2 text-lg"
          />
          {(errors as any).respondent?.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {(errors as any).respondent?.firstName?.message || "Обязательное поле"}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="respondent.middleName" className="text-base font-semibold">
            Отчество <span className="text-red-500">★</span>
          </Label>
          <Input
            id="respondent.middleName"
            {...register("respondent.middleName")}
            placeholder="Иванович"
            className="mt-2 text-lg"
          />
          {(errors as any).respondent?.middleName && (
            <p className="text-red-500 text-sm mt-1">
              {(errors as any).respondent?.middleName?.message || "Обязательное поле"}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="respondent.maidenName" className="text-base font-semibold">
            Девичья фамилия (для женщин)
          </Label>
          <Input
            id="respondent.maidenName"
            {...register("respondent.maidenName")}
            placeholder="Петрова"
            className="mt-2 text-lg"
          />
        </div>
      </div>

      {/* Варианты имён / прозвища */}
      <div>
        <Label className="text-base font-semibold mb-2 block">
          Варианты имён / прозвища / написание в старых документах
        </Label>
        <p className="text-sm text-gray-600 mb-3">
          Например: разные написания фамилии, уменьшительные имена, прозвища
        </p>
        
        <div className="space-y-2">
          {(watch("respondent.nicknames") || []).map((nickname: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`respondent.nicknames.${index}`)}
                placeholder="Вариант имени или прозвище"
                className="text-lg"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeNickname(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addNickname}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить вариант имени
          </Button>
        </div>
      </div>

      {/* Дата рождения */}
      <div className="border-t-2 pt-4">
        <h4 className="font-semibold text-lg mb-4">Дата и место рождения</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="respondent.birthDate.date" className="text-base font-semibold">
              Дата рождения <span className="text-red-500">★</span>
            </Label>
            <Input
              id="respondent.birthDate.date"
              type="date"
              {...register("respondent.birthDate.date")}
              className="mt-2 text-lg"
            />
            {(errors as any).respondent?.birthDate?.date && (
              <p className="text-red-500 text-sm mt-1">
                {(errors as any).respondent?.birthDate?.date?.message || "Обязательное поле"}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-8">
            <Checkbox
              id="respondent.birthDate.isApproximate"
              checked={watch("respondent.birthDate.isApproximate")}
              onCheckedChange={(checked) => setValue("respondent.birthDate.isApproximate", checked)}
            />
            <Label htmlFor="respondent.birthDate.isApproximate" className="cursor-pointer">
              Примерная дата
            </Label>
          </div>
        </div>

        {watch("respondent.birthDate.isApproximate") && (
          <div className="mt-3">
            <Label htmlFor="respondent.birthDate.dateRange" className="text-sm">
              Диапазон дат (например, 1950–1955)
            </Label>
            <Input
              id="respondent.birthDate.dateRange"
              {...register("respondent.birthDate.dateRange")}
              placeholder="1950–1955"
              className="mt-2"
            />
          </div>
        )}
      </div>

      {/* Место рождения */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="respondent.birthPlace.settlementType" className="text-base font-semibold">
            Тип населённого пункта
          </Label>
          <Select
            value={watch("respondent.birthPlace.settlementType")}
            onValueChange={(value) => setValue("respondent.birthPlace.settlementType", value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="город">Город</SelectItem>
              <SelectItem value="село">Село</SelectItem>
              <SelectItem value="деревня">Деревня</SelectItem>
              <SelectItem value="станица">Станица</SelectItem>
              <SelectItem value="другое">Другое</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="respondent.birthPlace.historicalName" className="text-base font-semibold">
            Название населённого пункта <span className="text-red-500">★</span>
          </Label>
          <Input
            id="respondent.birthPlace.historicalName"
            {...register("respondent.birthPlace.historicalName")}
            placeholder="Москва"
            className="mt-2 text-lg"
          />
          {(errors as any).respondent?.birthPlace?.historicalName && (
            <p className="text-red-500 text-sm mt-1">
              {(errors as any).respondent?.birthPlace?.historicalName?.message || "Обязательное поле"}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="respondent.birthPlace.region" className="text-base">
            Область/губерния/край
          </Label>
          <Input
            id="respondent.birthPlace.region"
            {...register("respondent.birthPlace.region")}
            placeholder="Московская область"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="respondent.birthPlace.countryAtTime" className="text-base font-semibold">
            Страна на момент рождения <span className="text-red-500">★</span>
          </Label>
          <Input
            id="respondent.birthPlace.countryAtTime"
            {...register("respondent.birthPlace.countryAtTime")}
            placeholder="СССР"
            className="mt-2"
          />
          {(errors as any).respondent?.birthPlace?.countryAtTime && (
            <p className="text-red-500 text-sm mt-1">
              {(errors as any).respondent?.birthPlace?.countryAtTime?.message || "Обязательное поле"}
            </p>
          )}
        </div>
      </div>

      {/* Контактная информация */}
      <div className="border-t-2 pt-4">
        <h4 className="font-semibold text-lg mb-4">Контактная информация (необязательно)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="respondent.contact.phone">Телефон</Label>
            <Input
              id="respondent.contact.phone"
              {...register("respondent.contact.phone")}
              placeholder="+7 (999) 123-45-67"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="respondent.contact.email">Email</Label>
            <Input
              id="respondent.contact.email"
              type="email"
              {...register("respondent.contact.email")}
              placeholder="example@mail.ru"
              className="mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="respondent.contact.address">Почтовый адрес</Label>
            <Textarea
              id="respondent.contact.address"
              {...register("respondent.contact.address")}
              placeholder="Город, улица, дом, квартира"
              className="mt-2"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Образование и деятельность */}
      <div className="border-t-2 pt-4">
        <h4 className="font-semibold text-lg mb-4">Образование и деятельность</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="respondent.education" className="text-base font-semibold">Образование</Label>
            <Textarea
              id="respondent.education"
              {...register("respondent.education")}
              placeholder="Укажите школу, техникум/ВУЗ, специальность, год окончания"
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="respondent.occupation" className="text-base font-semibold">Род деятельности</Label>
            <Textarea
              id="respondent.occupation"
              {...register("respondent.occupation")}
              placeholder="Укажите Ваш основной род деятельности"
              className="mt-2"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="respondent.achievements" className="text-base font-semibold">Достижения</Label>
            <Textarea
              id="respondent.achievements"
              {...register("respondent.achievements")}
              placeholder="Укажите Ваши основные достижения, которые вы считаете важным отразить в родовой книге"
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="respondent.additionalComments" className="text-base font-semibold">О себе (в свободной форме)</Label>
            <Textarea
              id="respondent.additionalComments"
              {...register("respondent.additionalComments")}
              placeholder="Ваш путь: детство, переезды, значимые перемены, где жили и чем занимались, хобби, увлечения, интересы в разные периоды жизни, ценности, яркие моменты, истории и мудрости, интересные факты, воспоминания и любая другая ценная (по вашему мнению) информация."
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

