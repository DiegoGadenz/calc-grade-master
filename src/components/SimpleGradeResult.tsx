import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { SimpleStudentGrade } from "@/pages/SimpleCalculator";

interface SimpleGradeResultProps {
  student: SimpleStudentGrade;
  onNextStudent: () => void;
  onReset: () => void;
}

const SimpleGradeResult = ({ student, onNextStudent, onReset }: SimpleGradeResultProps) => {
  const getStatus = () => {
    if (student.percentage >= 70) return { label: "Aprovado", icon: CheckCircle2, color: "text-green-500" };
    if (student.percentage >= 50) return { label: "Recuperação", icon: AlertCircle, color: "text-yellow-500" };
    return { label: "Reprovado", icon: XCircle, color: "text-red-500" };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="animate-fade-in border-2">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <StatusIcon className={`w-6 h-6 ${status.color}`} />
          Aluno #{student.studentNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Acertos</p>
            <p className="text-4xl font-bold">{student.correctAnswers}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Nota</p>
              <p className="text-2xl font-bold">{student.score}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Percentual</p>
              <p className="text-2xl font-bold">{student.percentage}%</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${status.color} bg-opacity-10`}>
            <p className="text-lg font-semibold">{status.label}</p>
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
