import { useState } from "react";

interface Props {
  onNextStep: () => void;
  onStartAuto: () => void;
  onStopAuto: () => void;
  onReset: () => void;
}

export function ControlButtons({ onNextStep, onStartAuto, onStopAuto, onReset }: Props) {
  const [isAuto, setIsAuto] = useState(false);

  const toggleAuto = () => {
    if (isAuto) {
      onStopAuto();
    } else {
      onStartAuto();
    }
    setIsAuto(!isAuto);
  };

  const handleReset = () => {
    onStopAuto();
    setIsAuto(false);
    onReset();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleAuto}
        className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
          isAuto
            ? "bg-accent text-accent-foreground border-accent"
            : "bg-primary text-primary-foreground border-primary hover:opacity-90"
        }`}
      >
        {isAuto ? "Pausar" : "Correr"}
      </button>
    </div>
  );
}
