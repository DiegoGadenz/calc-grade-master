import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, RotateCcw } from "lucide-react";
import { SimpleExamConfig, SimpleStudentGrade } from "@/pages/SimpleCalculator";

interface SimpleStudentGradingProps {
  examConfig: SimpleExamConfig;
  studentNumber: number;
  onComplete: (student: SimpleStudentGrade) => void;
  onReset: () => void;
}

const SimpleStudentGrading = ({
  examConfig,
  studentNumber,
  onComplete,
  onReset,
}: SimpleStudentGradingProps) => {
  const [correctAnswers, setCorrectAnswers] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correct = parseInt(correctAnswers);
    
    if (correct >= 0 && correct <= examConfig.totalQuestions) {
      const score = (correct / examConfig.totalQuestions) * examConfig.totalValue;
      const percentage = (correct / examConfig.totalQuestions) * 100;

      onComplete({
        studentNumber,
        correctAnswers: correct,
        score: parseFloat(score.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(2)),
      });
      
      setCorrectAnswers("");
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Aluno #{studentNumber}</CardTitle>
            <CardDescription>
              Prova de {examConfig.totalValue} pontos • {examConfig.totalQuestions} questões
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="correctAnswers">Quantas questões acertou?</Label>
            <Input
              id="correctAnswers"
              type="number"
              min="0"
              max={examConfig.totalQuestions}
              value={correctAnswers}
              onChange={(e) => setCorrectAnswers(e.target.value)}
              placeholder={`0 a ${examConfig.totalQuestions}`}
              required
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Cada questão vale {(examConfig.totalValue / examConfig.totalQuestions).toFixed(2)} pontos
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular Nota
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleStudentGrading;
