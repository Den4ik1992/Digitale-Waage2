import React from 'react';
import { WeightDistribution } from '../types';

interface Props {
  distribution: WeightDistribution[];
}

export function DistributionChart({ distribution }: Props) {
  const maxPercentage = Math.max(...distribution.map(d => d.percentage));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Weight Distribution</h2>
      
      <div className="space-y-2">
        {distribution.map((d) => (
          <div key={d.weight} className="relative">
            <div className="flex items-center gap-2">
              <div className="w-16 text-sm text-gray-600">{d.weight}g</div>
              <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(d.percentage / maxPercentage) * 100}%` }}
                />
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">
                {d.percentage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}