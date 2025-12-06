import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface TraditionsStepProps {
  form: UseFormReturn<any>;
}

export function TraditionsStep({ form }: TraditionsStepProps) {
  const { register, watch, setValue } = form;

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Подсказка:</span> Семейные традиции, праздники, рецепты, 
          обычаи — всё это часть нашего культурного наследия. Поделитесь тем, что помните.
        </p>
      </div>

      {/* Семейные праздники */}
      <div className="border-2 border-amber-200 rounded-lg p-6 bg-amber-50/30">
        <h3 className="text-xl font-bold text-amber-900 mb-4">Семейные праздники и традиции</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="traditions.holidays.mainHolidays">Главные семейные праздники</Label>
            <Textarea
              id="traditions.holidays.mainHolidays"
              {...register("traditions.holidays.mainHolidays")}
              placeholder="Какие праздники отмечали особенно, как их проводили..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="traditions.holidays.rituals">Семейные ритуалы и обычаи</Label>
            <Textarea
              id="traditions.holidays.rituals"
              {...register("traditions.holidays.rituals")}
              placeholder="Особые традиции на Новый год, дни рождения, другие события..."
              className="mt-2"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Кулинарные традиции */}
      <div className="border-2 border-orange-200 rounded-lg p-6 bg-orange-50/30">
        <h3 className="text-xl font-bold text-orange-900 mb-4">Кулинарные традиции</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="traditions.cuisine.signatureDishes">Фирменные семейные блюда</Label>
            <Textarea
              id="traditions.cuisine.signatureDishes"
              {...register("traditions.cuisine.signatureDishes")}
              placeholder="Какие блюда готовили особенно часто или по праздникам..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="traditions.cuisine.recipes">Семейные рецепты</Label>
            <Textarea
              id="traditions.cuisine.recipes"
              {...register("traditions.cuisine.recipes")}
              placeholder="Опишите рецепты, которые передавались в семье..."
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Религиозные традиции */}
      <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/30">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Религиозные традиции</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="traditions.religion.denomination">Вероисповедание</Label>
            <Input
              id="traditions.religion.denomination"
              {...register("traditions.religion.denomination")}
              placeholder="Православие, католицизм, ислам, иудаизм..."
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="traditions.religion.practices">Религиозные практики</Label>
            <Textarea
              id="traditions.religion.practices"
              {...register("traditions.religion.practices")}
              placeholder="Посещение храма, соблюдение постов, молитвы..."
              className="mt-2"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Семейные легенды */}
      <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50/30">
        <h3 className="text-xl font-bold text-purple-900 mb-4">Семейные истории и легенды</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="traditions.stories.legends">Семейные легенды</Label>
            <Textarea
              id="traditions.stories.legends"
              {...register("traditions.stories.legends")}
              placeholder="Истории о предках, которые передавались из поколения в поколение..."
              className="mt-2"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="traditions.stories.memorableEvents">Памятные события</Label>
            <Textarea
              id="traditions.stories.memorableEvents"
              {...register("traditions.stories.memorableEvents")}
              placeholder="Важные события в истории семьи, о которых рассказывали..."
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Семейные реликвии */}
      <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50/30">
        <h3 className="text-xl font-bold text-green-900 mb-4">Семейные реликвии и ценности</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="traditions.heirlooms.items">Семейные реликвии</Label>
            <Textarea
              id="traditions.heirlooms.items"
              {...register("traditions.heirlooms.items")}
              placeholder="Предметы, передающиеся по наследству: украшения, книги, фотографии, документы..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="traditions.heirlooms.history">История реликвий</Label>
            <Textarea
              id="traditions.heirlooms.history"
              {...register("traditions.heirlooms.history")}
              placeholder="Откуда эти предметы, кому принадлежали, какую историю несут..."
              className="mt-2"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Язык и диалект */}
      <div className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50/30">
        <h3 className="text-xl font-bold text-indigo-900 mb-4">Язык и особенности речи</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="traditions.language.mainLanguage">Основной язык в семье</Label>
            <Input
              id="traditions.language.mainLanguage"
              {...register("traditions.language.mainLanguage")}
              placeholder="Русский, украинский, идиш..."
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="traditions.language.dialectWords">Диалектные слова и выражения</Label>
            <Textarea
              id="traditions.language.dialectWords"
              {...register("traditions.language.dialectWords")}
              placeholder="Особые слова, выражения, поговорки, которые использовались в семье..."
              className="mt-2"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

