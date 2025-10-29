import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleStudentGrade } from "@/pages/SimpleCalculator";

interface SimpleStudentHistoryProps {
  students: SimpleStudentGrade[];
}

const SimpleStudentHistory = ({ students }: SimpleStudentHistoryProps) => {
  const averageScore = students.reduce((acc, s) => acc + s.score, 0) / students.length;
  const averagePercentage = students.reduce((acc, s) => acc + s.percentage, 0) / students.length;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Histórico de Avaliações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Média da Turma</p>
            <p className="text-2xl font-bold">{averageScore.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Aproveitamento</p>
            <p className="text-2xl font-bold">{averagePercentage.toFixed(1)}%</p>
          </div>
        </div>

        <div className="space-y-2">
          {students.map((student) => (
            <div
              key={student.studentNumber}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <span className="font-medium">Aluno #{student.studentNumber}</span>
              <div className="text-right">
                <p className="font-bold">{student.score} pts</p>
                <p className="text-sm text-muted-foreground">{student.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleStudentHistory;
