
import { format } from "date-fns";

export interface PredictRequest {
  date: Date;
  category: string;
  size: string;
  color: string;
  price: number;
  inventory: number;
}

export interface PredictResponse {
  prediction: number;
  unit: string;
  source: 'backend' | 'simulation';
}

export interface ModelMetrics {
  rmse: number;
  correlation: number;
}

/**
 * Simula la lógica del backend Weka para cuando el servidor Java no está disponible.
 */
function simulatePrediction(req: PredictRequest): number {
  // Factores base (copiados de la lógica Java para consistencia visual)
  const baseDemand: Record<string, number> = { Shirt: 30, Pants: 25, Dress: 20, Jacket: 15, Skirt: 18 };
  const sizeFactor: Record<string, number> = { XS: 0.8, S: 1.0, M: 1.2, L: 1.0, XL: 0.9 };
  const colorFactor: Record<string, number> = { Red: 1.0, Blue: 1.1, Green: 0.9, Black: 1.2, White: 1.05 };

  const catVal = baseDemand[req.category] || 20;
  const sizeVal = sizeFactor[req.size] || 1.0;
  const colorVal = colorFactor[req.color] || 1.0;
  
  // Elasticidad precio simplificada
  const basePrice = 30; 
  const priceEffect = Math.max(0.2, 1.0 - 0.01 * (req.price - basePrice));
  
  // Efecto inventario
  const invEffect = 1.0 - Math.exp(-req.inventory / 20.0);

  // Estacionalidad simple (mes)
  const month = req.date.getMonth() + 1;
  const seasonFactor = (month >= 5 && month <= 8) ? 1.15 : 0.95;

  const demand = catVal * sizeVal * colorVal * priceEffect * invEffect * seasonFactor;
  
  // Ruido aleatorio reducido para la demo
  const noise = (Math.random() - 0.5) * 4;
  
  let sales = Math.max(0, demand + noise);
  // Cap por inventario
  return Math.min(sales, req.inventory);
}

/**
 * Llama al backend real o usa simulación.
 */
export async function predictSales(data: PredictRequest): Promise<PredictResponse> {
  try {
    // Intentar llamar al backend Spring Boot
    // Nota: Requiere proxy configurado o CORS habilitado en el backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // Timeout rápido para fallar a simulación

    const response = await fetch('http://localhost:8080/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        date: format(data.date, 'yyyy-MM-dd')
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('Backend error');
    
    const result = await response.json();
    return { prediction: result.prediction, unit: 'units', source: 'backend' };

  } catch (error) {
    console.warn("Backend no disponible, usando simulación local.", error);
    // Fallback a simulación
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          prediction: simulatePrediction(data),
          unit: 'units',
          source: 'simulation'
        });
      }, 600); // Pequeño delay para realismo
    });
  }
}
