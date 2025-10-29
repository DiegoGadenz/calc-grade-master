import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { ExamConfig } from "@/pages/Index";

interface Props {
  onComplete: (config: ExamConfig) => void;
}

const ExamConfiguration = ({ onComplete }: Props) => {
  const [totalWeight, setTotalWeight] = useState<string>("10");
  const [questions, setQuestions] = useState<Array<{ id: number; weight: string }>>([
    { id: 1, weight: "" },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), weight: "" }]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    } else {
      toast.error("É necessário ter pelo menos uma questão");
    }
  };

  const updateQuestionWeight = (id: number, weight: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, weight } : q)));
  };

  const handleSubmit = () => {
    const totalWeightNum = parseFloat(totalWeight);
    if (isNaN(totalWeightNum) || totalWeightNum <= 0) {
      toast.error("Peso total deve ser um número válido maior que zero");
      return;
    }

    const questionWeights = questions.map((q) => parseFloat(q.weight));
    if (questionWeights.some((w) => isNaN(w) || w <= 0)) {
      toast.error("Todos os pesos das questões devem ser válidos");
      return;
    }

    const sumWeights = questionWeights.reduce((a, b) => a + b, 0);
    if (Math.abs(sumWeights - totalWeightNum) > 0.01) {
      toast.error(
        `A soma dos pesos das questões (${sumWeights.toFixed(2)}) deve ser igual ao peso total (${totalWeightNum})`
      );
      return;
    }

    const config: ExamConfig = {
      totalWeight: totalWeightNum,
      questions: questions.map((q, index) => ({
        id: index + 1,
        weight: parseFloat(q.weight),
      })),
    };

    toast.success("Configuração salva! Agora você pode avaliar os alunos.");
    onComplete(config);
  };

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-card)] border-border/50 backdrop-blur-sm animate-fade-in">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Configurar Prova
          </h2>
          <p className="text-muted-foreground">
            Defina o peso total e os valores de cada questão
          </p>
        </div>

        {/* Total Weight */}
        <div className="space-y-2">
          <Label htmlFor="totalWeight" className="text-base font-semibold">
            Peso Total da Prova
          </Label>
          <Input
            id="totalWeight"
            type="number"
            step="0.01"
            value={totalWeight}
            onChange={(e) => setTotalWeight(e.target.value)}
            placeholder="Ex: 10"
            className="text-lg h-12 transition-all focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
          />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Questões</Label>
            <Button
              onClick={addQuestion}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Questão
            </Button>
          </div>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="flex gap-3 items-center bg-secondary/50 p-4 rounded-lg border border-border/50 transition-all hover:shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.01"
                    value={question.weight}
                    onChange={(e) =>
                      updateQuestionWeight(question.id, e.target.value)
                    }
                    placeholder="Peso da questão"
                    className="h-10"
                  />
                </div>
                <Button
                  onClick={() => removeQuestion(question.id)}
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  disabled={questions.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all gap-2"
        >
          Continuar para Avaliação
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default ExamConfiguration;
