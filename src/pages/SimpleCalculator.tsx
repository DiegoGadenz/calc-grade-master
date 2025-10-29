import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, ArrowRight, RotateCcw, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import SimpleExamConfig from "@/components/SimpleExamConfig";
import SimpleStudentGrading from "@/components/SimpleStudentGrading";
import SimpleGradeResult from "@/components/SimpleGradeResult";
import SimpleStudentHistory from "@/components/SimpleStudentHistory";

export interface SimpleExamConfig {
  totalValue: number;
  totalQuestions: number;
}

export interface SimpleStudentGrade {
  studentNumber: number;
  correctAnswers: number;
  score: number;
  percentage: number;
}

type Step = "config" | "grading" | "result";

const SimpleCalculator = () => {
  const [step, setStep] = useState<Step>("config");
  const [examConfig, setExamConfig] = useState<SimpleExamConfig | null>(null);
  const [currentStudent, setCurrentStudent] = useState<SimpleStudentGrade | null>(null);
  const [studentHistory, setStudentHistory] = useState<SimpleStudentGrade[]>([]);

  const handleConfigComplete = (config: SimpleExamConfig) => {
    setExamConfig(config);
    setStep("grading");
  };

  const handleGradingComplete = (student: SimpleStudentGrade) => {
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-2xl shadow-lg">
              <Calculator className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Calculadora Rápida
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            Cálculo simplificado de notas por acertos
          </p>
          <Link to="/detailed">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Calculadora Avançada
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {step === "config" && (
            <SimpleExamConfig onComplete={handleConfigComplete} />
          )}

          {step === "grading" && examConfig && (
            <SimpleStudentGrading
              examConfig={examConfig}
              studentNumber={studentHistory.length + 1}
              onComplete={handleGradingComplete}
              onReset={handleReset}
            />
          )}

          {step === "result" && currentStudent && (
            <SimpleGradeResult
              student={currentStudent}
              onNextStudent={handleNextStudent}
              onReset={handleReset}
            />
          )}

          {/* Student History */}
          {studentHistory.length > 0 && step !== "config" && (
            <SimpleStudentHistory students={studentHistory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCalculator;
