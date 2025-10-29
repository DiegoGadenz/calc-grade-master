import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { SimpleExamConfig } from "@/pages/SimpleCalculator";

interface SimpleExamConfigProps {
  onComplete: (config: SimpleExamConfig) => void;
}

const SimpleExamConfigComponent = ({ onComplete }: SimpleExamConfigProps) => {
  const [totalValue, setTotalValue] = useState<string>("10");
  const [totalQuestions, setTotalQuestions] = useState<string>("10");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valueNum = parseFloat(totalValue);
    const questionsNum = parseInt(totalQuestions);

    if (valueNum > 0 && questionsNum > 0) {
      onComplete({
        totalValue: valueNum,
        totalQuestions: questionsNum,
      });
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Configuração da Prova</CardTitle>
        <CardDescription>
          Configure o valor total e número de questões
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="totalValue">Valor da Prova</Label>
            <Input
              id="totalValue"
              type="number"
              step="0.1"
              min="0.1"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              placeholder="Ex: 10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalQuestions">Número de Questões</Label>
            <Input
              id="totalQuestions"
              type="number"
              min="1"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(e.target.value)}
              placeholder="Ex: 10"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleExamConfigComponent;
