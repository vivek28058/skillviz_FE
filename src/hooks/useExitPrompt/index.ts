import { useState, useEffect } from "react";

const initBeforeUnLoad = (showExitPrompt: boolean) => {
  window.onbeforeunload = (event) => {
    if (showExitPrompt) {
      event.preventDefault();
      if (event) {
        event.returnValue = "";
      }
      return "";
    }
  };
};

// Hook
export default function useExitPrompt(bool: boolean) {
  const [showExitPrompt, setShowExitPrompt] = useState<boolean>(bool);

  window.onload = function () {
    initBeforeUnLoad(showExitPrompt);
  };

  useEffect(() => {
    initBeforeUnLoad(showExitPrompt);
  }, [showExitPrompt]);

  return [showExitPrompt, setShowExitPrompt] as const;
}
