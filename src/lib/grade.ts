// Percentual mínimo para a nota ser considerada acima da média
export const PASSING_PERCENTAGE = 60;

/** Cor do texto da nota: verde a partir do corte, vermelho abaixo. */
export const gradeColor = (percentage: number) =>
  percentage >= PASSING_PERCENTAGE ? "text-green-500" : "text-red-500";
