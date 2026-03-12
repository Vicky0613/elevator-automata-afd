import { STATE_LABELS, type ElevatorState } from "@/hooks/useElevatorFSM";

interface Props {
  state: ElevatorState;
}

export function StatusPanel({ state }: Props) {
  const dirLabel = state.direction === "up" ? "▲ Subiendo" : state.direction === "down" ? "▼ Bajando" : "● Inactivo";

  return (
    <div className="border border-border rounded p-3 bg-card">
      <h2 className="font-semibold text-sm text-foreground mb-2">Estado del Elevador</h2>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Estado:</span>{" "}
          <span className="font-bold text-primary">{state.fsmState} - {STATE_LABELS[state.fsmState]}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Piso actual:</span>{" "}
          <span className="font-bold text-foreground">{state.currentFloor}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Dirección:</span>{" "}
          <span className="text-foreground">{dirLabel}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Destino:</span>{" "}
          <span className="text-foreground">{state.targetFloor ?? "—"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Puertas:</span>{" "}
          <span className={state.doorsOpen ? "text-accent font-bold" : "text-foreground"}>
            {state.doorsOpen ? "ABIERTAS" : "CERRADAS"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Cola:</span>{" "}
          {state.queue.length === 0 ? (
            <span className="text-muted-foreground">Vacía</span>
          ) : (
            state.queue.map((f, i) => (
              <span key={i} className="font-bold text-accent mr-1">P{f}</span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
