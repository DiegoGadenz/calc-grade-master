import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Users } from "lucide-react";
import type { StudentGrade } from "@/pages/Index";

interface Props {
  students: StudentGrade[];
}

const StudentHistory = ({ students }: Props) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-card)] border-border/50 backdrop-blur-sm animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Alunos Avaliados ({students.length})
          </h3>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {students.map((student, index) => {
            const isPassing = student.percentage >= 60;
            return (
              <div
                key={index}
                className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg border border-border/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {isPassing ? (
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  )}
                  <span className="font-medium text-foreground truncate">
                    {student.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Nota</p>
                    <p className="text-lg font-bold text-primary">
                      {student.totalScore.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">%</p>
                    <p
                      className={`text-lg font-bold ${
                        isPassing ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {student.percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default StudentHistory;
