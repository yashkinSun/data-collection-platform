import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ParentsStepProps {
  form: UseFormReturn<any>;
}

export function ParentsStep({ form }: ParentsStepProps) {
  const { register, watch, setValue } = form;

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Подсказка:</span> Заполните информацию о ваших родителях. 
          Если какие-то сведения неизвестны, оставьте поля пустыми.
        </p>
      </div>

      {/* ОТЕЦ */}
      <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/30">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">Отец</h3>

        {/* ФИО */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="parents.father.names.lastName">Фамилия</Label>
            <Input
              id="parents.father.names.lastName"
              {...register("parents.father.names.lastName")}
              placeholder="Иванов"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="parents.father.names.firstName">Имя</Label>
            <Input
              id="parents.father.names.firstName"
              {...register("parents.father.names.firstName")}
              placeholder="Пётр"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="parents.father.names.middleName">Отчество</Label>
            <Input
              id="parents.father.names.middleName"
              {...register("parents.father.names.middleName")}
              placeholder="Иванович"
              className="mt-2"
            />
          </div>
        </div>

        {/* Годы жизни */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="parents.father.lifeYears.birthDate.date">Дата рождения</Label>
            <Input
              id="parents.father.lifeYears.birthDate.date"
              type="date"
              {...register("parents.father.lifeYears.birthDate.date")}
              className="mt-2"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="parents.father.lifeYears.birthDate.isApproximate"
                checked={watch("parents.father.lifeYears.birthDate.isApproximate")}
                onCheckedChange={(checked) => setValue("parents.father.lifeYears.birthDate.isApproximate", checked)}
              />
              <Label htmlFor="parents.father.lifeYears.birthDate.isApproximate" className="text-sm cursor-pointer">
                Примерная дата
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="parents.father.lifeYears.deathDate.date">Дата смерти</Label>
            <Input
              id="parents.father.lifeYears.deathDate.date"
              type="date"
              {...register("parents.father.lifeYears.deathDate.date")}
              className="mt-2"
            />
          </div>
        </div>

        {/* Место рождения */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="parents.father.lifeYears.birthPlace.historicalName">Место рождения</Label>
            <Input
              id="parents.father.lifeYears.birthPlace.historicalName"
              {...register("parents.father.lifeYears.birthPlace.historicalName")}
              placeholder="Город, село, деревня"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="parents.father.lifeYears.birthPlace.countryAtTime">Страна</Label>
            <Input
              id="parents.father.lifeYears.birthPlace.countryAtTime"
              {...register("parents.father.lifeYears.birthPlace.countryAtTime")}
              placeholder="СССР"
              className="mt-2"
            />
          </div>
        </div>

        {/* Образование */}
        <div className="mb-6">
          <Label htmlFor="parents.father.education">Образование</Label>
          <Textarea
            id="parents.father.education"
            {...register("parents.father.education")}
            placeholder="Укажите школу, техникум/вуз, специальность, иные сведения если известны"
            className="mt-2"
            rows={2}
          />
        </div>

        {/* Профессия */}
        <div className="mb-6">
          <Label htmlFor="parents.father.profession.mainOccupation">Основная профессия / род занятий</Label>
          <Textarea
            id="parents.father.profession.mainOccupation"
            {...register("parents.father.profession.mainOccupation")}
            placeholder="Инженер, плотник, учитель..."
            className="mt-2"
            rows={2}
          />
        </div>

        {/* Достижения */}
        <div className="mb-6">
          <Label htmlFor="parents.father.achievements">Достижения</Label>
          <Textarea
            id="parents.father.achievements"
            {...register("parents.father.achievements")}
            placeholder="Укажите достижения которые вы считаете важными"
            className="mt-2"
            rows={2}
          />
        </div>

        {/* Ключевые события */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="parents.father.keyEvents.militaryService">Военная служба</Label>
            <Textarea
              id="parents.father.keyEvents.militaryService"
              {...register("parents.father.keyEvents.militaryService")}
              placeholder="Годы, части, звания..."
              className="mt-2"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="parents.father.keyEvents.warParticipation">Участие в войнах</Label>
            <Textarea
              id="parents.father.keyEvents.warParticipation"
              {...register("parents.father.keyEvents.warParticipation")}
              placeholder="Какие войны, в каком качестве..."
              className="mt-2"
              rows={2}
            />
          </div>
        </div>

        {/* Характер */}
        <div className="mt-6">
          <Label htmlFor="parents.father.character">Характер, увлечения, особенности</Label>
          <Textarea
            id="parents.father.character"
            {...register("parents.father.character")}
            placeholder="Как его помнят, черты характера, хобби, таланты..."
            className="mt-2"
            rows={3}
          />
        </div>

        {/* Наличие документов */}
        <div className="mt-6">
          <Label htmlFor="parents.father.documents">
            Наличие документов, архивов, фотографий
          </Label>
          <Textarea
            id="parents.father.documents"
            {...register("parents.father.documents")}
            placeholder="Опишите, какие документы, фотографии, видео, аудио или иные материалы сохранились и могут быть предоставлены для ознакомления если имеются"
            className="mt-2"
            rows={3}
          />
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6">
          <Label htmlFor="parents.father.additionalInfo">Дополнительные сведения (в свободной форме) </Label>
          <Textarea
            id="parents.father.additionalInfo"
            {...register("parents.father.additionalInfo")}
            placeholder="Любая дополнительная информация, которая не отражена в предыдущих полях и которая может быть интересна - Детство, Хобби, События, Жизненные истории, мудрости, цитаты, интересные факты которые вам известны"
            className="mt-2"
            rows={4}
          />
        </div>
      </div>

      {/* МАТЬ */}
      <div className="border-2 border-pink-200 rounded-lg p-6 bg-pink-50/30">
        <h3 className="text-2xl font-bold text-pink-900 mb-6">Мать</h3>

        {/* ФИО */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="parents.mother.names.maidenName">Девичья фамилия</Label>
            <Input
              id="parents.mother.names.maidenName"
              {...register("parents.mother.names.maidenName")}
              placeholder="Петрова"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="parents.mother.names.firstName">Имя</Label>
            <Input
              id="parents.mother.names.firstName"
              {...register("parents.mother.names.firstName")}
              placeholder="Мария"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="parents.mother.names.middleName">Отчество</Label>
            <Input
              id="parents.mother.names.middleName"
              {...register("parents.mother.names.middleName")}
              placeholder="Петровна"
              className="mt-2"
            />
          </div>
        </div>

        {/* Годы жизни */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="parents.mother.lifeYears.birthDate.date">Дата рождения</Label>
            <Input
              id="parents.mother.lifeYears.birthDate.date"
              type="date"
              {...register("parents.mother.lifeYears.birthDate.date")}
              className="mt-2"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="parents.mother.lifeYears.birthDate.isApproximate"
                checked={watch("parents.mother.lifeYears.birthDate.isApproximate")}
                onCheckedChange={(checked) => setValue("parents.mother.lifeYears.birthDate.isApproximate", checked)}
              />
              <Label htmlFor="parents.mother.lifeYears.birthDate.isApproximate" className="text-sm cursor-pointer">
                Примерная дата
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="parents.mother.lifeYears.deathDate.date">Дата смерти</Label>
            <Input
              id="parents.mother.lifeYears.deathDate.date"
              type="date"
              {...register("parents.mother.lifeYears.deathDate.date")}
              className="mt-2"
            />
          </div>
        </div>

        {/* Место рождения */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="parents.mother.lifeYears.birthPlace.historicalName">Место рождения</Label>
            <Input
              id="parents.mother.lifeYears.birthPlace.historicalName"
              {...register("parents.mother.lifeYears.birthPlace.historicalName")}
              placeholder="Город, село, деревня"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="parents.mother.lifeYears.birthPlace.countryAtTime">Страна</Label>
            <Input
              id="parents.mother.lifeYears.birthPlace.countryAtTime"
              {...register("parents.mother.lifeYears.birthPlace.countryAtTime")}
              placeholder="СССР"
              className="mt-2"
            />
          </div>
        </div>

        {/* Образование */}
        <div className="mb-6">
          <Label htmlFor="parents.mother.education">Образование</Label>
          <Textarea
            id="parents.mother.education"
            {...register("parents.mother.education")}
            placeholder="Укажите школу, техникум/вуз, специальность, иные сведения если известны"
            className="mt-2"
            rows={2}
          />
        </div>

        {/* Профессия */}
        <div className="mb-6">
          <Label htmlFor="parents.mother.profession.mainOccupation">Основная профессия / род занятий</Label>
          <Textarea
            id="parents.mother.profession.mainOccupation"
            {...register("parents.mother.profession.mainOccupation")}
            placeholder="Учитель, врач, домохозяйка..."
            className="mt-2"
            rows={2}
          />
        </div>

        {/* Достижения */}
        <div className="mb-6">
          <Label htmlFor="parents.mother.achievements">Достижения</Label>
          <Textarea
            id="parents.mother.achievements"
            {...register("parents.mother.achievements")}
            placeholder="Укажите достижения которые вы считаете важными"
            className="mt-2"
            rows={2}
          />
        </div>

        {/* Характер */}
        <div className="mt-6">
          <Label htmlFor="parents.mother.character">Характер, увлечения, особенности</Label>
          <Textarea
            id="parents.mother.character"
            {...register("parents.mother.character")}
            placeholder="Как её помнят, черты характера, хобби, таланты..."
            className="mt-2"
            rows={3}
          />
        </div>

        {/* Наличие документов */}
        <div className="mt-6">
          <Label htmlFor="parents.mother.documents">
            Наличие документов, архивов, фотографий
          </Label>
          <Textarea
            id="parents.mother.documents"
            {...register("parents.mother.documents")}
            placeholder="Опишите, какие документы, фотографии, видео, аудио или иные материалы сохранились и могут быть предоставлены для ознакомления если имеются"
            className="mt-2"
            rows={3}
          />
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6">
          <Label htmlFor="parents.mother.additionalInfo">Дополнительные сведения (в свободной форме)</Label>
          <Textarea
            id="parents.mother.additionalInfo"
            {...register("parents.mother.additionalInfo")}
            placeholder="Любая дополнительная информация, которая не отражена в предыдущих полях и которая может быть интересна - Детство, Хобби, События, Жизненные истории, мудрости, цитаты, интересные факты которые вам известны"
            className="mt-2"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

