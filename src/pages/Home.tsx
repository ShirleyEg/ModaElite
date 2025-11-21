
import React from 'react';
import { PredictForm } from '@/components/PredictForm';
import { ResultCard } from '@/components/ResultCard';
import { PredictRequest, PredictResponse, predictSales } from '@/lib/api';
import { Shirt, BarChart3 } from 'lucide-react';

export default function Home() {
  const [result, setResult] = React.useState<PredictResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handlePredict = async (data: PredictRequest) => {
    setLoading(true);
    try {
      const res = await predictSales(data);
      setResult(res);
    } catch (error) {
      console.error("Error predicting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shirt className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">GarmentAI Predictor</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>Weka Engine</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <span>v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Predicción de Demanda</h2>
          <p className="text-slate-500">
            Utiliza el modelo de Machine Learning para estimar ventas basado en atributos de producto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <PredictForm onSubmit={handlePredict} isLoading={loading} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <ResultCard result={result} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
