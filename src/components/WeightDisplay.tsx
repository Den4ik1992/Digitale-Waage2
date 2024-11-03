import React from 'react';
import { Scale } from 'lucide-react';
import type { WeighingResult, CalibrationResult } from '../types';

interface Props {
  result: WeighingResult | null;
  calibration: CalibrationResult | null;
  isWeighing: boolean;
}

export function WeightDisplay({ result, calibration, isWeighing }: Props) {
  return (
    <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 aspect-[4/3] flex flex-col">
      {/* Display Screen */}
      <div className="bg-[#1a1a1a] rounded-lg p-4 flex-1 border border-gray-700">
        <div className="h-full flex flex-col">
          {/* LCD Display */}
          <div className="flex-1 bg-[#2d5a27] rounded p-4 font-mono text-[#98fb98] shadow-inner">
            {isWeighing ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-4xl animate-pulse">----</div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl">Gewicht:</span>
                  <span className="text-4xl">{result.totalWeight.toFixed(2)}g</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl">Stück:</span>
                  <span className="text-4xl">{result.estimatedTotalParts}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-2xl">
                  {calibration ? '0.00g' : 'KALIBRIEREN'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="mt-4 flex items-center justify-between text-gray-400">
        <Scale className="w-8 h-8" />
        <div className="text-sm">
          {calibration 
            ? `Kalibriert: ${calibration.sampleSize} Teile (${calibration.averageWeight.toFixed(3)}g/Stück)`
            : 'Nicht kalibriert'}
        </div>
      </div>
    </div>
  );
}