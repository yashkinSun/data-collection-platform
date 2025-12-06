import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ConsentStepProps {
  form: UseFormReturn<any>;
}

export function ConsentStep({ form }: ConsentStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Уважаемый родственник!
        </h3>
        <p className="text-blue-800 mb-3">
          Мы начали важный проект по созданию семейного архива и родословной книги. 
          Наша цель — сохранить память о наших предках, их жизни, традициях и историях 
          для нас и будущих поколений.
        </p>
        <p className="text-blue-800">
          Ваши воспоминания и знания бесценны для восстановления нашей общей истории. 
          Любая информация, даже кажущаяся незначительной, может стать ключом к 
          пониманию судеб наших предков.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="consent.fullName" className="text-base font-semibold">
            ФИО полностью <span className="text-red-500">★</span>
          </Label>
          <Input
            id="consent.fullName"
            {...register("consent.fullName")}
            placeholder="Иванов Иван Иванович"
            className="mt-2 text-lg"
          />
          {(errors as any).consent?.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {(errors as any).consent?.fullName?.message || "Обязательное поле"}
            </p>
          )}
        </div>

        <div className="border-t-2 pt-4">
          <h4 className="font-semibold text-lg mb-4">Согласие на обработку данных</h4>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent.agreeToProcess"
                checked={watch("consent.agreeToProcess")}
                onCheckedChange={(checked) => setValue("consent.agreeToProcess", checked)}
              />
              <Label htmlFor="consent.agreeToProcess" className="text-base leading-relaxed cursor-pointer">
                Я даю согласие на сбор, хранение и использование предоставленных мной данных 
                для составления семейной родословной <span className="text-red-500">★</span>
              </Label>
            </div>
            {(errors as any).consent?.agreeToProcess && (
              <p className="text-red-500 text-sm ml-7">
                {(errors as any).consent?.agreeToProcess?.message || "Согласие обязательно"}
              </p>
            )}

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent.agreeToPublishFamilyBook"
                checked={watch("consent.agreeToPublishFamilyBook")}
                onCheckedChange={(checked) => setValue("consent.agreeToPublishFamilyBook", checked)}
              />
              <Label htmlFor="consent.agreeToPublishFamilyBook" className="text-base leading-relaxed cursor-pointer">
                Публикация данных в семейной книге (в печатном или цифровом виде), 
                которая будет доступна только членам семьи
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent.agreeToShareFamilyMembers"
                checked={watch("consent.agreeToShareFamilyMembers")}
                onCheckedChange={(checked) => setValue("consent.agreeToShareFamilyMembers", checked)}
              />
              <Label htmlFor="consent.agreeToShareFamilyMembers" className="text-base leading-relaxed cursor-pointer">
                Передача данных другим членам семьи для целей генеалогического исследования
              </Label>
            </div>
          </div>
        </div>

        <div className="border-t-2 pt-4">
          <h4 className="font-semibold text-lg mb-4">Согласие на публикацию материалов</h4>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent.agreeToPublishText"
                checked={watch("consent.agreeToPublishText")}
                onCheckedChange={(checked) => setValue("consent.agreeToPublishText", checked)}
              />
              <Label htmlFor="consent.agreeToPublishText" className="text-base leading-relaxed cursor-pointer">
                Можно публиковать текстовые данные
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent.agreeToPublishPhotos"
                checked={watch("consent.agreeToPublishPhotos")}
                onCheckedChange={(checked) => setValue("consent.agreeToPublishPhotos", checked)}
              />
              <Label htmlFor="consent.agreeToPublishPhotos" className="text-base leading-relaxed cursor-pointer">
                Можно публиковать фото/видео/аудио материалы
              </Label>
            </div>
          </div>
        </div>

        <div className="border-t-2 pt-4">
          <Label className="text-base font-semibold mb-3 block">
            Уровень приватности
          </Label>
          <RadioGroup
            value={watch("consent.privacyLevel")}
            onValueChange={(value) => setValue("consent.privacyLevel", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="только для семьи" id="privacy-family" />
              <Label htmlFor="privacy-family" className="cursor-pointer">Только для семьи</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="для книги" id="privacy-book" />
              <Label htmlFor="privacy-book" className="cursor-pointer">Для семейной книги</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="можно публиковать открыто" id="privacy-public" />
              <Label htmlFor="privacy-public" className="cursor-pointer">Можно публиковать открыто</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="consent.specialRestrictions" className="text-base font-semibold">
            Особые ограничения (если есть)
          </Label>
          <Textarea
            id="consent.specialRestrictions"
            {...register("consent.specialRestrictions")}
            placeholder="Укажите любые особые ограничения или пожелания..."
            className="mt-2"
            rows={3}
          />
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <span className="text-red-500 font-bold">★</span> — обязательные поля
        </p>
      </div>
    </div>
  );
}

