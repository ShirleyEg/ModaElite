
import { PredictResponse } from '@/lib/api';
import { CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ResultCardProps {
  result: PredictResponse | null;
}

// Datos dummy para el gráfico de "historial de entrenamiento" o contexto
const mockHistoryData = [
  { name: 'Ene', sales: 24 },
  { name: 'Feb', sales: 30 },
  { name: 'Mar', sales: 28 },
  { name: 'Abr', sales: 45 },
  { name: 'May', sales: 50 },
  { name: 'Jun', sales: 48 },
  { name: 'Jul', sales: 60 },
];

export function ResultCard({ result }: ResultCardProps) {
  if (!result) {
    return (
      <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center border rounded-xl border-dashed bg-muted/20">
        <div className="bg-muted rounded-full p-4 mb-4">
          <TrendingUp className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">Esperando datos</h3>
        <p className="text-sm text-muted-foreground max-w-xs mt-2">
          Completa el formulario y haz clic en predecir para ver la estimación del modelo Weka.
        </p>
      </div>
    );
  }

  const isSimulation = result.source === 'simulation';

  return (
    <div className="space-y-6">
      {/* Main Metric */}
      <div className="p-6 bg-card border rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ventas Estimadas</h3>
            {isSimulation && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" /> Simulado
              </span>
            )}
            {!isSimulation && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Backend Real
              </span>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight text-primary">
              {result.prediction.toFixed(1)}
            </span>
            <span className="text-xl text-muted-foreground">unidades</span>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            El modelo estima esta demanda basada en el histórico de 5,000 transacciones similares.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 bg-card border rounded-xl shadow-sm">
        <h4 className="text-sm font-medium mb-4">Tendencia de Categoría (Últimos 6 meses)</h4>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockHistoryData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Stats Mock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg border">
          <div className="text-xs text-muted-foreground mb-1">Precisión del Modelo (RMSE)</div>
          <div className="text-lg font-semibold">3.42</div>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <div className="text-xs text-muted-foreground mb-1">Correlación</div>
          <div className="text-lg font-semibold">0.94</div>
        </div>
      </div>
    </div>
  );
}
