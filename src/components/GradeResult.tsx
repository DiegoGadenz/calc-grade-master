import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { StudentGrade } from "@/pages/Index";

interface Props {
  student: StudentGrade;
  onNextStudent: () => void;
  onReset: () => void;
}

const GradeResult = ({ student, onNextStudent, onReset }: Props) => {
  const isPassing = student.percentage >= 60;

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-elevated)] border-border/50 backdrop-blur-sm animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
              isPassing
                ? "bg-gradient-to-br from-accent to-accent/80"
                : "bg-gradient-to-br from-destructive to-destructive/80"
            } shadow-lg`}
          >
            {isPassing ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : (
              <XCircle className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {student.name}
            </h2>
            <p
              className={`text-lg ${
                isPassing ? "text-accent" : "text-destructive"
              } font-semibold`}
            >
              {isPassing ? "Aprovado!" : "Necessita Recuperação"}
            </p>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 md:p-8 rounded-2xl border border-primary/20 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Nota Final</p>
              <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {student.totalScore.toFixed(2)}
              </p>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Percentual</p>
              <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {student.percentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Detalhamento por Questão
          </h3>
          <div className="grid gap-2">
            {student.scores.map((score, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg border border-border/50"
              >
                <span className="text-sm font-medium text-foreground">
                  Questão {index + 1}
                </span>
                <span className="text-sm font-bold text-primary">
                  {score.toFixed(2)} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onNextStudent}
            className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all gap-2"
          >
            Próximo Aluno
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="sm:w-auto h-12 gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Nova Prova
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GradeResult;
