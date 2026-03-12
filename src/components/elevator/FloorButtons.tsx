import type { ElevatorState } from "@/hooks/useElevatorFSM";

interface Props {
  state: ElevatorState;
  onRequest: (floor: number) => void;
}

export function FloorButtons({ state, onRequest }: Props) {
  const floors = [5, 4, 3, 2, 1];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-sm font-semibold text-foreground mb-2">Llamar</h2>
      <div className="flex flex-col gap-2">
        {floors.map((floor) => {
          const isQueued = state.queue.includes(floor);
          const isCurrent = state.currentFloor === floor && state.fsmState === "Q0";
          return (
            <button
              key={floor}
              onClick={() => onRequest(floor)}
              disabled={isQueued || isCurrent}
              className={`text-sm font-bold w-10 h-9 rounded border transition-colors ${
                isQueued
                  ? "bg-accent text-accent-foreground border-accent cursor-not-allowed"
                  : isCurrent
                    ? "bg-primary/20 border-primary text-primary cursor-not-allowed"
                    : "bg-secondary border-border text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {floor}
            </button>
          );
        })}
      </div>
    </div>
  );
}
