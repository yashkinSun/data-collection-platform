import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

export interface Step {
  id: string;
  title: string;
  description?: string;
  category?: "family" | "profession" | "migration" | "traditions" | "general";
  component: ReactNode;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onGoToStep: (stepIndex: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  completedSteps: Set<number>;
}

const categoryColors = {
  family: "bg-blue-100 text-blue-800 border-blue-300",
  profession: "bg-green-100 text-green-800 border-green-300",
  migration: "bg-purple-100 text-purple-800 border-purple-300",
  traditions: "bg-amber-100 text-amber-800 border-amber-300",
  general: "bg-gray-100 text-gray-800 border-gray-300",
};

export function StepWizard({
  steps,
  currentStep,
  onNext,
  onPrev,
  onGoToStep,
  canGoNext,
  canGoPrev,
  completedSteps,
}: StepWizardProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Шаг {currentStep + 1} из {steps.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step navigation (breadcrumbs) */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index);
            const categoryColor = step.category
              ? categoryColors[step.category]
              : categoryColors.general;

            return (
              <button
                key={step.id}
                onClick={() => onGoToStep(index)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium whitespace-nowrap",
                  isActive
                    ? categoryColor + " shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300",
                  isCompleted && !isActive && "border-green-500"
                )}
              >
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{index + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current step title and description */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {currentStepData.title}
        </h2>
        {currentStepData.description && (
          <p className="text-gray-600">{currentStepData.description}</p>
        )}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6 md:p-8 mb-6 min-h-[400px]">
        {currentStepData.component}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={!canGoPrev}
          size="lg"
          className="text-lg"
        >
          ← Назад
        </Button>

        <div className="text-sm text-gray-500">
          {currentStep + 1} / {steps.length}
        </div>

        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          size="lg"
          className="text-lg"
        >
          {currentStep === steps.length - 1 ? "Завершить" : "Далее →"}
        </Button>
      </div>
    </div>
  );
}

