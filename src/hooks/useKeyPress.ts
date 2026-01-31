import { useEffect } from "react";

export const useKeyPress = () => {
  const useEscapeKey = (onClose: () => void) => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);
  };

  return {
    useEscapeKey: useEscapeKey,
  };
};
