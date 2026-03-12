import { useElevatorFSM } from "@/hooks/useElevatorFSM";
import { BuildingVisualization } from "@/components/elevator/BuildingVisualization";
import { FloorButtons } from "@/components/elevator/FloorButtons";
import { StatusPanel } from "@/components/elevator/StatusPanel";
import { ControlButtons } from "@/components/elevator/ControlButtons";

const Index = () => {
  const { state, requestFloor, nextStep, startAuto, stopAuto, reset } = useElevatorFSM();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Título */}
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Simulador de Elevador
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sistema de control de elevador de 5 pisos modelado como máquina de estados finitos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Izquierda: Edificio + botones */}
          <div>
            <div className="flex gap-4 justify-center mb-4">
              <FloorButtons state={state} onRequest={requestFloor} />
              <BuildingVisualization state={state} />
            </div>
         
          </div>

          {/* Derecha: controles, historial, info del AFD */}
          <div className="space-y-4">
            <div className="border border-border rounded p-3 bg-card">
              <h2 className="font-semibold text-sm text-foreground mb-2">Controles</h2>
              <ControlButtons
                onNextStep={nextStep}
                onStartAuto={startAuto}
                onStopAuto={stopAuto}
                onReset={reset}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Presiona los botones de piso para agregar solicitudes, luego usa <b>Correr</b>  para avanzar o <b>Pausar</b> para detenerlo.
              </p>
            </div>

        
             <StatusPanel state={state} />

            {/* Tabla de estados - informativa */}
            <div className="border border-border rounded p-3 bg-card">
              <h2 className="font-semibold text-sm text-foreground mb-2">Tabla de Estados</h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1 text-muted-foreground">Estado</th>
                    <th className="text-left py-1 text-muted-foreground">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Q0", "Inactivo - esperando solicitudes"],
                    ["Q1", "Recibiendo solicitud del usuario"],
                    ["Q2", "Agregando solicitud a la cola"],
                    ["Q3", "Evaluando próximo destino"],
                    ["Q4", "Cerrando puertas"],
                    ["Q5", "Moviendo hacia arriba"],
                    ["Q6", "Moviendo hacia abajo"],
                    ["Q7", "Llegó al piso destino"],
                    ["Q8", "Abriendo puertas"],
                    ["Q9", "Pasajero entrando/saliendo"],
                    ["Q10", "Verificando si hay más solicitudes"],
                  ].map(([estado, desc]) => (
                    <tr key={estado} className="border-b border-border last:border-0">
                      <td className="py-1 font-semibold text-primary">{estado}</td>
                      <td className="py-1 text-foreground">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Transiciones - informativa */}
            <div className="border border-border rounded p-3 bg-card">
              <h2 className="font-semibold text-sm text-foreground mb-2">Transiciones</h2>
              <div className="text-xs text-foreground space-y-0.5">
                <p>Q0 → Q1 : Solicitud recibida</p>
                <p>Q1 → Q2 : Agregar a cola</p>
                <p>Q2 → Q3 : Evaluar destino</p>
                <p>Q3 → Q4 : Cerrar puertas (o Q7 si ya está en el piso)</p>
                <p>Q4 → Q5/Q6 : Subir o bajar</p>
                <p>Q5/Q6 → Q7 : Llegó al piso</p>
                <p>Q7 → Q8 : Abrir puertas</p>
                <p>Q8 → Q9 : Movimiento de pasajeros</p>
                <p>Q9 → Q10 : Verificar cola</p>
                <p>Q10 → Q3/Q0 : Siguiente solicitud o inactivo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
