import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { ExamConfig, StudentGrade } from "@/pages/Index";

interface Props {
  examConfig: ExamConfig;
  onComplete: (student: StudentGrade) => void;
  onReset: () => void;
}

const StudentGrading = ({ examConfig, onComplete, onReset }: Props) => {
  const [studentName, setStudentName] = useState("");
  const [scores, setScores] = useState<string[]>(
    examConfig.questions.map(() => "")
  );

  const updateScore = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const handleCalculate = () => {
    if (!studentName.trim()) {
      toast.error("Digite o nome do aluno");
      return;
    }

    const scoreValues = scores.map((s) => parseFloat(s));
    if (scoreValues.some((s) => isNaN(s) || s < 0)) {
      toast.error("Todas as notas devem ser válidas e não negativas");
      return;
    }

    // Check if any score exceeds its question weight
    const invalidScores = scoreValues.filter(
      (score, index) => score > examConfig.questions[index].weight
    );
    if (invalidScores.length > 0) {
      toast.error("A nota não pode ser maior que o peso da questão");
      return;
    }

    const totalScore = scoreValues.reduce((sum, score) => sum + score, 0);
    const percentage = (totalScore / examConfig.totalWeight) * 100;

    const student: StudentGrade = {
      name: studentName,
      scores: scoreValues,
      totalScore,
      percentage,
    };

    onComplete(student);
    setStudentName("");
    setScores(examConfig.questions.map(() => ""));
  };

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-card)] border-border/50 backdrop-blur-sm animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Avaliar Aluno
            </h2>
            <p className="text-muted-foreground">
              Peso total: {examConfig.totalWeight} pontos
            </p>
          </div>
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Nova Prova
          </Button>
        </div>

        {/* Student Name */}
        <div className="space-y-2">
          <Label htmlFor="studentName" className="text-base font-semibold">
            Nome do Aluno
          </Label>
          <Input
            id="studentName"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Digite o nome do aluno"
            className="text-lg h-12 transition-all focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
          />
        </div>

        {/* Question Scores */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Notas por Questão</Label>
          <div className="grid gap-3">
            {examConfig.questions.map((question, index) => (
              <div
                key={question.id}
                className="flex gap-3 items-center bg-secondary/50 p-4 rounded-lg border border-border/50 transition-all hover:shadow-sm"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <span className="text-base font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center whitespace-nowrap">
                    Peso: {question.weight}
                  </p>
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.01"
                    value={scores[index]}
                    onChange={(e) => updateScore(index, e.target.value)}
                    placeholder={`0 - ${question.weight}`}
                    max={question.weight}
                    className="h-10 text-base"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent shadow-md hover:shadow-lg transition-all gap-2"
        >
          <Calculator className="w-5 h-5" />
          Calcular Nota
        </Button>
      </div>
    </Card>
  );
};

export default StudentGrading;
