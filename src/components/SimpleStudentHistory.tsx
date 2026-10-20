import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleStudentGrade } from "@/pages/SimpleCalculator";
import { gradeColor } from "@/lib/grade";

interface SimpleStudentHistoryProps {
  students: SimpleStudentGrade[];
}

const SimpleStudentHistory = ({ students }: SimpleStudentHistoryProps) => {
  const averageScore = students.reduce((acc, s) => acc + s.score, 0) / students.length;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="text-lg">Corrigidas ({students.length})</CardTitle>
          <span className="text-sm text-muted-foreground">
            Média {averageScore.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mais recente primeiro */}
        <div className="divide-y divide-border">
          {[...students].reverse().map((student) => (
            <div
              key={student.studentNumber}
              className="flex items-center justify-between py-2 text-sm"
            >
              <span className="text-muted-foreground">Aluno #{student.studentNumber}</span>
              <span className="flex items-baseline gap-3">
                <span className="text-muted-foreground">
                  {student.correctAnswers.toLocaleString("pt-BR")} acertos
                </span>
                <span className={`font-bold text-base ${gradeColor(student.percentage)}`}>
                  {student.score.toLocaleString("pt-BR")}
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleStudentHistory;
