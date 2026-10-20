import { useEffect, useRef } from "react";

/**
 * Faz o Enter sempre disparar a ação principal da tela,
 * independente de qual elemento está com foco.
 */
export function useEnterKey(onEnter: () => void) {
  const callbackRef = useRef(onEnter);

  useEffect(() => {
    callbackRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat || e.isComposing) return;
      // Impede o Enter de acionar o botão focado ou o submit nativo do form
      e.preventDefault();
      callbackRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
