import { useRef, useState } from "react";
import { useEnterKey } from "@/hooks/use-enter-key";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, RotateCcw } from "lucide-react";
import { SimpleExamConfig, SimpleStudentGrade } from "@/pages/SimpleCalculator";
import { gradeColor } from "@/lib/grade";

interface SimpleStudentGradingProps {
  examConfig: SimpleExamConfig;
  studentNumber: number;
  lastResult?: SimpleStudentGrade;
  onComplete: (student: SimpleStudentGrade) => void;
  onReset: () => void;
}

const SimpleStudentGrading = ({
  examConfig,
  studentNumber,
  lastResult,
  onComplete,
  onReset,
}: SimpleStudentGradingProps) => {
  const [correctAnswers, setCorrectAnswers] = useState<string>("");
  const [error, setError] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  useEnterKey(() => formRef.current?.requestSubmit());

  const handleChange = (value: string) => {
    // Aceita dígitos e um único separador decimal (vírgula ou ponto)
    if (/^\d*([.,]\d*)?$/.test(value)) {
      setCorrectAnswers(value);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const correct = parseFloat(correctAnswers.replace(",", "."));

    if (isNaN(correct) || correct < 0 || correct > examConfig.totalQuestions) {
      setError(`Informe um valor entre 0 e ${examConfig.totalQuestions}`);
      return;
    }

    const score = (correct / examConfig.totalQuestions) * examConfig.totalValue;
    const percentage = (correct / examConfig.totalQuestions) * 100;

    onComplete({
      studentNumber,
      correctAnswers: correct,
      score: parseFloat(score.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(2)),
    });

    setCorrectAnswers("");
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Aluno #{studentNumber}</CardTitle>
            <CardDescription>
              Prova de {examConfig.totalValue.toLocaleString("pt-BR")} pontos • {examConfig.totalQuestions} questões
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="correctAnswers" className="text-lg">Quantas questões acertou?</Label>
            <Input
              id="correctAnswers"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={correctAnswers}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={`0 a ${examConfig.totalQuestions}`}
              className="h-20 text-4xl font-bold text-center placeholder:text-2xl placeholder:font-normal"
              required
              autoFocus
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-sm text-muted-foreground">
              Cada questão vale {(examConfig.totalValue / examConfig.totalQuestions).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} pontos
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular Nota
          </Button>
        </form>

        {lastResult && (
          <div key={lastResult.studentNumber} className="mt-6 py-6 bg-primary/10 rounded-lg text-center animate-fade-in">
            <p className="text-base text-muted-foreground mb-1">
              Nota do Aluno #{lastResult.studentNumber}
            </p>
            <p className={`text-6xl sm:text-7xl md:text-8xl font-bold ${gradeColor(lastResult.percentage)}`}>
              {lastResult.score.toLocaleString("pt-BR")}
            </p>
            <p className="text-base text-muted-foreground mt-2">
              {lastResult.correctAnswers.toLocaleString("pt-BR")} acertos ·{" "}
              <span className={`font-semibold ${gradeColor(lastResult.percentage)}`}>
                {lastResult.percentage.toLocaleString("pt-BR")}%
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleStudentGrading;
