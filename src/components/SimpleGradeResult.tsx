import { useEnterKey } from "@/hooks/use-enter-key";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, RotateCcw } from "lucide-react";
import { gradeColor } from "@/lib/grade";
import { SimpleStudentGrade } from "@/pages/SimpleCalculator";

interface SimpleGradeResultProps {
  student: SimpleStudentGrade;
  onNextStudent: () => void;
  onReset: () => void;
}

const SimpleGradeResult = ({ student, onNextStudent, onReset }: SimpleGradeResultProps) => {
  useEnterKey(onNextStudent);

  return (
    <Card className="animate-fade-in border-2">
      <CardHeader className="text-center">
        <CardTitle>
          Aluno #{student.studentNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="py-6 bg-primary/10 rounded-lg">
            <p className="text-base text-muted-foreground mb-2">Nota</p>
            <p className={`text-7xl md:text-8xl font-bold ${gradeColor(student.percentage)}`}>
              {student.score.toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Acertos</p>
              <p className="text-xl font-semibold">{student.correctAnswers.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Percentual</p>
              <p className={`text-xl font-semibold ${gradeColor(student.percentage)}`}>{student.percentage.toLocaleString("pt-BR")}%</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onNextStudent} className="flex-1" size="lg">
            Próximo Aluno
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={onReset} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleGradeResult;
