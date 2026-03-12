import { motion } from "framer-motion";
import type { ElevatorState } from "@/hooks/useElevatorFSM";

interface Props {
  state: ElevatorState;
}

export function BuildingVisualization({ state }: Props) {
  const floors = [5, 4, 3, 2, 1];
  const floorHeight = 60;
  const elevatorY = (5 - state.currentFloor) * floorHeight;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-sm font-semibold text-foreground mb-2">Edificio</h2>
      <div className="relative border-2 border-border bg-card">
        <div className="flex">
          {/* Etiquetas de piso */}
          <div className="flex flex-col">
            {floors.map((floor) => (
              <div
                key={floor}
                className="flex items-center justify-center border-b border-border last:border-b-0"
                style={{ width: 40, height: floorHeight }}
              >
                <span className={`text-sm font-bold ${
                  state.currentFloor === floor ? "text-primary" : "text-muted-foreground"
                }`}>
                  {floor}
                </span>
              </div>
            ))}
          </div>

          {/* Hueco del elevador */}
          <div
            className="relative border-l-2 border-border"
            style={{ width: 70, height: floorHeight * 5 }}
          >
            {floors.slice(0, -1).map((floor) => (
              <div
                key={floor}
                className="absolute w-full border-b border-border"
                style={{ top: (5 - floor) * floorHeight + floorHeight }}
              />
            ))}

            {/* Cabina del elevador */}
            <motion.div
              className="absolute left-1 right-1 bg-primary border-2 border-primary rounded flex items-center justify-center"
              style={{ height: floorHeight - 6 }}
              animate={{ top: elevatorY + 3 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div className="flex w-full h-full overflow-hidden rounded-sm">
                <motion.div
                  className="bg-primary-foreground/30 h-full"
                  animate={{ width: state.doorsOpen ? "10%" : "50%" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="bg-primary-foreground/30 h-full"
                  animate={{ width: state.doorsOpen ? "10%" : "50%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="absolute text-xs font-bold text-primary-foreground">
                {state.currentFloor}
              </span>
            </motion.div>

            {/* Indicadores de solicitudes pendientes */}
            {state.queue.map((floor) => (
              <motion.div
                key={`req-${floor}`}
                className="absolute right-1 w-2 h-2 rounded-full bg-accent"
                style={{ top: (5 - floor) * floorHeight + floorHeight / 2 - 4 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
