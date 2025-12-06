import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface PlacesStepProps {
  form: UseFormReturn<any>;
}

export function PlacesStep({ form }: PlacesStepProps) {
  const { register, watch, setValue } = form;

  const places = watch("places.migrationPlaces") || [];

  const addPlace = () => {
    setValue("places.migrationPlaces", [
      ...places,
      {
        year: "",
        place: {
          historicalName: "",
          countryAtTime: "",
        },
        reason: "",
      },
    ]);
  };

  const removePlace = (index: number) => {
    setValue(
      "places.migrationPlaces",
      places.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
        <p className="text-sm text-purple-800">
          <span className="font-semibold">Подсказка:</span> Укажите места, где жили вы и ваши родственники. 
          Это поможет восстановить географию семейной истории.
        </p>
      </div>

      <div className="space-y-4">
        {places.map((place: any, index: number) => (
          <div key={index} className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50/30 relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removePlace(index)}
            >
              <X className="w-4 h-4" />
            </Button>

            <h4 className="font-semibold text-lg mb-4 text-purple-900">Место {index + 1}</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`places.migrationPlaces.${index}.year`}>
                  Год / период
                </Label>
                <Input
                  id={`places.migrationPlaces.${index}.year`}
                  {...register(`places.migrationPlaces.${index}.year`)}
                  placeholder="1950 или 1950-1960"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor={`places.migrationPlaces.${index}.place.historicalName`}>
                  Населённый пункт
                </Label>
                <Input
                  id={`places.migrationPlaces.${index}.place.historicalName`}
                  {...register(`places.migrationPlaces.${index}.place.historicalName`)}
                  placeholder="Москва, Ленинград..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor={`places.migrationPlaces.${index}.place.countryAtTime`}>
                  Страна
                </Label>
                <Input
                  id={`places.migrationPlaces.${index}.place.countryAtTime`}
                  {...register(`places.migrationPlaces.${index}.place.countryAtTime`)}
                  placeholder="СССР, Россия..."
                  className="mt-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor={`places.migrationPlaces.${index}.reason`}>
                Причина переезда
              </Label>
              <Textarea
                id={`places.migrationPlaces.${index}.reason`}
                {...register(`places.migrationPlaces.${index}.reason`)}
                placeholder="Работа, учёба, эвакуация, семейные обстоятельства..."
                className="mt-2"
                rows={2}
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addPlace}
          className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить место проживания
        </Button>

        {places.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Нажмите кнопку выше, чтобы добавить место проживания</p>
          </div>
        )}
      </div>
    </div>
  );
}

