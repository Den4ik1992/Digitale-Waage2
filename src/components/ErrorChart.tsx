import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { WeighingResult } from '../types';

interface Props {
  result: WeighingResult | null;
}

export function ErrorChart({ result }: Props) {
  if (!result || !result.measurementPoints) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const error = payload[0].value;
      const errorText = error > 0 ? `+${error}` : error;
      
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="text-sm font-medium text-gray-900">
            Bei {payload[0].payload.parts} Teilen
          </p>
          <p className={`text-sm ${error > 0 ? 'text-red-600' : 'text-orange-600'}`}>
            Abweichung: {errorText} Stück
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Abweichungsverlauf</h2>
          <div className="text-sm text-gray-600">
            Positive Werte = Waage zählt zu viel
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={result.measurementPoints}
              margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="parts" 
                label={{ 
                  value: 'Teile', 
                  position: 'insideBottom', 
                  offset: -10 
                }}
              />
              <YAxis 
                label={{ 
                  value: 'Abweichung (Stück)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 30
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#666" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="error"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Tatsächliche Stückzahl</div>
          <div className="text-2xl font-mono text-green-600">
            {result.actualTotalParts}
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Gezählte Stückzahl</div>
          <div className="text-2xl font-mono text-blue-600">
            {result.estimatedTotalParts}
          </div>
        </div>
      </div>
    </div>
  );
}