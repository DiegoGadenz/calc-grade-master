import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, ArrowRight, RotateCcw, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import ExamConfiguration from "@/components/ExamConfiguration";
import StudentGrading from "@/components/StudentGrading";
import GradeResult from "@/components/GradeResult";
import StudentHistory from "@/components/StudentHistory";

export interface ExamConfig {
  totalWeight: number;
  questions: Array<{ id: number; weight: number }>;
}

export interface StudentGrade {
  name: string;
  scores: number[];
  totalScore: number;
  percentage: number;
}

type Step = "config" | "grading" | "result";

const Index = () => {
  const [step, setStep] = useState<Step>("config");
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [currentStudent, setCurrentStudent] = useState<StudentGrade | null>(null);
  const [studentHistory, setStudentHistory] = useState<StudentGrade[]>([]);

  const handleConfigComplete = (config: ExamConfig) => {
    setExamConfig(config);
    setStep("grading");
  };

  const handleGradingComplete = (student: StudentGrade) => {
    setCurrentStudent(student);
    setStudentHistory((prev) => [...prev, student]);
    setStep("result");
  };

  const handleNextStudent = () => {
    setCurrentStudent(null);
    setStep("grading");
  };

  const handleReset = () => {
    setStep("config");
    setExamConfig(null);
    setCurrentStudent(null);
    setStudentHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 pt-16 pb-8 sm:pt-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-6 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-1.5 rounded-lg">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Calculadora de Notas
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Sistema profissional para avaliação de provas
          </p>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Calculator className="w-4 h-4" />
              Calculadora Rápida
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {step === "config" && (
            <ExamConfiguration onComplete={handleConfigComplete} />
          )}

          {step === "grading" && examConfig && (
            <StudentGrading
              examConfig={examConfig}
              studentNumber={studentHistory.length + 1}
              onComplete={handleGradingComplete}
              onReset={handleReset}
            />
          )}

          {step === "result" && currentStudent && (
            <GradeResult
              student={currentStudent}
              onNextStudent={handleNextStudent}
              onReset={handleReset}
            />
          )}

          {/* Student History */}
          {studentHistory.length > 0 && step !== "config" && (
            <StudentHistory students={studentHistory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
