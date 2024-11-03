import { useState, useCallback } from 'react';
import { WeightDisplay } from './components/WeightDisplay';
import { Controls } from './components/Controls';
import { ErrorChart } from './components/ErrorChart';
import { ProductionSetup } from './components/ProductionSetup';
import { generateParts, takeSample, weighSample, calibrate } from './utils/simulation';
import type { Part, WeighingResult, CalibrationResult, ProductionConfig } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  const [parts, setParts] = useState<Part[]>([]);
  const [calibration, setCalibration] = useState<CalibrationResult | null>(null);
  const [result, setResult] = useState<WeighingResult | null>(null);
  const [isWeighing, setIsWeighing] = useState(false);
  const [isProducing, setIsProducing] = useState(false);
  const [distributionData, setDistributionData] = useState<{ weight: number; count: number }[]>([]);

  const calculateDistribution = (parts: Part[]) => {
    const distribution = new Map<number, number>();
    parts.forEach(part => {
      const weight = Math.round(part.weight * 10) / 10; // Round to 1 decimal place
      distribution.set(weight, (distribution.get(weight) || 0) + 1);
    });
    return Array.from(distribution.entries())
      .map(([weight, count]) => ({ weight, count }))
      .sort((a, b) => a.weight - b.weight);
  };

  const handleProduction = useCallback(async (config: ProductionConfig) => {
    setIsProducing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newParts = generateParts(config);
    setParts(newParts);
    setDistributionData(calculateDistribution(newParts));
    setCalibration(null);
    setResult(null);
    setIsProducing(false);
  }, []);

  const handleCalibrate = useCallback(async (referenceParts: number) => {
    if (parts.length === 0) return;
    
    setIsWeighing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sample = takeSample(parts, referenceParts);
    const calibrationResult = calibrate(sample, referenceParts);
    
    setCalibration(calibrationResult);
    setResult(null);
    setIsWeighing(false);
  }, [parts]);

  const handleWeigh = useCallback(async (sampleSize: number) => {
    if (!calibration || parts.length === 0) return;
    
    setIsWeighing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sample = takeSample(parts, sampleSize);
    const weighResult = weighSample(sample, calibration);
    
    setResult(weighResult);
    setIsWeighing(false);
  }, [parts, calibration]);

  const handleReset = useCallback(() => {
    setParts([]);
    setCalibration(null);
    setResult(null);
    setDistributionData([]);
  }, []);

  const WeightTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="text-sm font-medium text-gray-900">
            Gewicht: {payload[0].payload.weight.toFixed(1)}g
          </p>
          <p className="text-sm text-blue-600">
            Anzahl: {payload[0].payload.count} Teile
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Digitale Zählwaage</h1>
          <p className="text-gray-600 mt-2">
            {parts.length === 0 
              ? 'Bitte zuerst Teile produzieren'
              : calibration 
                ? 'Waage ist kalibriert und bereit zum Wiegen'
                : 'Bitte kalibrieren Sie die Waage mit einer bekannten Stückzahl'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ProductionSetup 
              onProduction={handleProduction}
              isProducing={isProducing}
            />
            {parts.length > 0 && (
              <Controls 
                onWeigh={handleWeigh}
                onCalibrate={handleCalibrate}
                onReset={handleReset}
                isWeighing={isWeighing}
                isCalibrated={!!calibration}
                totalParts={parts.length}
              />
            )}
          </div>
          <div>
            <WeightDisplay 
              result={result} 
              calibration={calibration}
              isWeighing={isWeighing}
            />
          </div>
        </div>

        {distributionData.length > 0 && !result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gewichtsverteilung der produzierten Teile</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={distributionData}
                  margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="weight" 
                    label={{ 
                      value: 'Gewicht (g)', 
                      position: 'insideBottom', 
                      offset: -10 
                    }}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Anzahl (Stück)', 
                      angle: -90, 
                      position: 'insideLeft',
                      offset: 30
                    }}
                  />
                  <Tooltip content={<WeightTooltip />} />
                  <Bar dataKey="count" fill="#93c5fd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 -mx-4 px-4 py-6 bg-white shadow-lg">
            <ErrorChart result={result} />
          </div>
        )}
      </div>
    </div>
  );
}