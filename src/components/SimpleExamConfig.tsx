import { useRef, useState } from "react";
import { useEnterKey } from "@/hooks/use-enter-key";
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
  const [totalValue, setTotalValue] = useState<string>("");
  const [totalQuestions, setTotalQuestions] = useState<string>("");
  const [error, setError] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  useEnterKey(() => formRef.current?.requestSubmit());

  const handleValueChange = (value: string) => {
    // Aceita dígitos e um único separador decimal (vírgula ou ponto)
    if (/^\d*([.,]\d*)?$/.test(value)) {
      setTotalValue(value);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valueNum = parseFloat(totalValue.replace(",", "."));
    const questionsNum = parseInt(totalQuestions);

    if (isNaN(valueNum) || valueNum <= 0) {
      setError("Informe um valor maior que 0");
      return;
    }

    if (questionsNum > 0) {
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
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="totalValue">Valor da Prova</Label>
            <Input
              id="totalValue"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={totalValue}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Ex: 10 ou 2,5"
              autoFocus
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
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
