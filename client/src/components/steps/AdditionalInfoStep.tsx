import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface AdditionalInfoStepProps {
  form: UseFormReturn<any>;
}

export function AdditionalInfoStep({ form }: AdditionalInfoStepProps) {
  const { register } = form;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border-l-4 border-gray-500 p-4">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">Подсказка:</span> Если есть что-то важное, что мы не спросили ранее, 
          вы можете указать это здесь. Любая информация, которую вы считаете ценной для семейной истории.
        </p>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50/30">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Дополнительная информация</h3>
        
        <div>
          <Label htmlFor="additionalInfo.freeText" className="text-base font-semibold">
            Свободное поле для любой дополнительной информации
          </Label>
          <Textarea
            id="additionalInfo.freeText"
            {...register("additionalInfo.freeText")}
            placeholder="Здесь вы можете указать любую информацию, которую считаете важной: семейные легенды, истории, традиции, документы, фотографии (описание), связи с известными людьми, важные события и всё, что не вошло в предыдущие разделы...Чем больше подробностей - тем лучше."
            className="mt-2"
            rows={10}
          />
          <p className="text-sm text-gray-600 mt-2">
            Это поле полностью свободное - пишите всё, что считаете важным для сохранения семейной памяти.
          </p>
        </div>
      </div>
    </div>
  );
}

