import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, ArrowRight, RotateCcw, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import SimpleExamConfig from "@/components/SimpleExamConfig";
import SimpleStudentGrading from "@/components/SimpleStudentGrading";
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

type Step = "config" | "grading";

const SimpleCalculator = () => {
  const [step, setStep] = useState<Step>("config");
  const [examConfig, setExamConfig] = useState<SimpleExamConfig | null>(null);
  const [studentHistory, setStudentHistory] = useState<SimpleStudentGrade[]>([]);

  const handleConfigComplete = (config: SimpleExamConfig) => {
    setExamConfig(config);
    setStep("grading");
  };

  // A nota aparece na mesma tela e o campo já fica pronto para o próximo aluno
  const handleGradingComplete = (student: SimpleStudentGrade) => {
    setStudentHistory((prev) => [...prev, student]);
  };

  const handleReset = () => {
    setStep("config");
    setExamConfig(null);
    setStudentHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 pt-16 pb-8 sm:pt-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-6 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-1.5 rounded-lg">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Calculadora Rápida
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
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
              lastResult={studentHistory[studentHistory.length - 1]}
              onComplete={handleGradingComplete}
              onReset={handleReset}
            />
          )}

          {/* Student History */}
          {studentHistory.length > 0 && step === "grading" && (
            <SimpleStudentHistory students={studentHistory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCalculator;
