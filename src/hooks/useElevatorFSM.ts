import { useState, useCallback, useRef } from "react";

// Estados del autómata del elevador
export type FSMState =
  | "Q0" | "Q1" | "Q2" | "Q3" | "Q4"
  | "Q5" | "Q6" | "Q7" | "Q8" | "Q9" | "Q10";

// Etiquetas de cada estado en español
export const STATE_LABELS: Record<FSMState, string> = {
  Q0: "Inactivo",
  Q1: "Recibiendo solicitud",
  Q2: "Agregando a cola",
  Q3: "Evaluando destino",
  Q4: "Cerrando puertas",
  Q5: "Subiendo",
  Q6: "Bajando",
  Q7: "Llegó al piso",
  Q8: "Abriendo puertas",
  Q9: "Pasajero entra/sale",
  Q10: "Verificando cola",
};

export type Direction = "up" | "down" | "idle";

export interface ElevatorState {
  currentFloor: number;
  fsmState: FSMState;
  direction: Direction;
  queue: number[];
  history: FSMState[];
  targetFloor: number | null;
  isRunning: boolean;
  doorsOpen: boolean;
}

const initialState: ElevatorState = {
  currentFloor: 1,
  fsmState: "Q0",
  direction: "idle",
  queue: [],
  history: ["Q0"],
  targetFloor: null,
  isRunning: false,
  doorsOpen: false,
};

export function useElevatorFSM() {
  const [state, setState] = useState<ElevatorState>({ ...initialState });
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Agregar solicitud de piso
  const requestFloor = useCallback((floor: number) => {
    setState((prev) => {
      if (prev.queue.includes(floor)) return prev;
      if (floor === prev.currentFloor && prev.fsmState === "Q0") return prev;
      return { ...prev, queue: [...prev.queue, floor] };
    });
  }, []);

  // Procesar siguiente transición del autómata
  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = { ...prev };
      const transition = (to: FSMState) => {
        next.fsmState = to;
        next.history = [...prev.history, to];
      };

      switch (prev.fsmState) {
        case "Q0":
          if (prev.queue.length > 0) {
            transition("Q1");
            next.isRunning = true;
          }
          break;
        case "Q1":
          transition("Q2");
          break;
        case "Q2":
          transition("Q3");
          break;
        case "Q3": {
          const target = prev.queue[0];
          if (target !== undefined) {
            next.targetFloor = target;
            if (target === prev.currentFloor) {
              transition("Q7");
              next.queue = prev.queue.slice(1);
            } else {
              transition("Q4");
              next.direction = target > prev.currentFloor ? "up" : "down";
            }
          } else {
            transition("Q0");
            next.direction = "idle";
            next.isRunning = false;
          }
          break;
        }
        case "Q4":
          next.doorsOpen = false;
          transition(prev.direction === "up" ? "Q5" : "Q6");
          break;
        case "Q5":
          next.currentFloor = prev.currentFloor + 1;
          if (next.currentFloor === prev.targetFloor) {
            transition("Q7");
            next.queue = prev.queue.filter((f) => f !== prev.targetFloor);
          } else {
            transition("Q5");
          }
          break;
        case "Q6":
          next.currentFloor = prev.currentFloor - 1;
          if (next.currentFloor === prev.targetFloor) {
            transition("Q7");
            next.queue = prev.queue.filter((f) => f !== prev.targetFloor);
          } else {
            transition("Q6");
          }
          break;
        case "Q7":
          next.direction = "idle";
          transition("Q8");
          break;
        case "Q8":
          next.doorsOpen = true;
          transition("Q9");
          break;
        case "Q9":
          transition("Q10");
          break;
        case "Q10":
          next.targetFloor = null;
          if (prev.queue.length > 0) {
            transition("Q3");
          } else {
            transition("Q0");
            next.direction = "idle";
            next.isRunning = false;
            next.doorsOpen = false;
          }
          break;
      }
      return next;
    });
  }, []);

  const startAuto = useCallback(() => {
    if (autoIntervalRef.current) return;
    autoIntervalRef.current = setInterval(() => nextStep(), 800);
  }, [nextStep]);

  const stopAuto = useCallback(() => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopAuto();
    setState({ ...initialState, history: ["Q0"] });
  }, [stopAuto]);

  return { state, requestFloor, nextStep, startAuto, stopAuto, reset };
}
