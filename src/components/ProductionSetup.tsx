import React, { useState } from 'react';
import { Factory } from 'lucide-react';
import type { ProductionConfig, WeightGroup } from '../types';
import { ConfigurationManager } from './ConfigurationManager';

interface Props {
  onProduction: (config: ProductionConfig) => void;
  isProducing: boolean;
}

export function ProductionSetup({ onProduction, isProducing }: Props) {
  const [mode, setMode] = useState<'manual' | 'normal'>('manual');
  const [totalParts, setTotalParts] = useState('1000');
  const [groups, setGroups] = useState<WeightGroup[]>([
    { weight: 2.1, count: 200 },
    { weight: 2.2, count: 600 },
    { weight: 2.3, count: 200 }
  ]);
  const [mean, setMean] = useState('2.2');
  const [deviation, setDeviation] = useState('0.05');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseInt(totalParts);
    onProduction({
      totalParts: total,
      distribution: mode,
      manualGroups: groups.map(group => ({
        weight: group.weight,
        count: (group.count / groups.reduce((sum, g) => sum + g.count, 0)) * 100
      })),
      normalMean: parseFloat(mean),
      normalDeviation: parseFloat(deviation)
    });
  };

  const updateGroup = (index: number, field: 'weight' | 'count', value: string) => {
    const newGroups = [...groups];
    newGroups[index] = {
      ...newGroups[index],
      [field]: parseFloat(value)
    };
    setGroups(newGroups);
  };

  const addGroup = () => {
    setGroups([...groups, { weight: 2.2, count: 0 }]);
  };

  const removeGroup = (index: number) => {
    setGroups(groups.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Factory className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Teileproduktion</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gesamtanzahl der Teile
          </label>
          <input
            type="number"
            value={totalParts}
            onChange={(e) => setTotalParts(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gewichtsverteilung
          </label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={mode === 'manual'}
                onChange={() => setMode('manual')}
                className="text-blue-600"
              />
              <span className="ml-2">Manuelle Verteilung</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={mode === 'normal'}
                onChange={() => setMode('normal')}
                className="text-blue-600"
              />
              <span className="ml-2">Normalverteilung</span>
            </label>
          </div>
        </div>

        {mode === 'manual' ? (
          <div className="space-y-4">
            {groups.map((group, index) => (
              <div key={index} className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600">
                    Gewicht (g)
                  </label>
                  <input
                    type="number"
                    value={group.weight}
                    onChange={(e) => updateGroup(index, 'weight', e.target.value)}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600">
                    Anzahl (Stück)
                  </label>
                  <input
                    type="number"
                    value={group.count}
                    onChange={(e) => updateGroup(index, 'count', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGroup(index)}
                  className="mt-6 text-red-600 hover:text-red-800"
                >
                  Entfernen
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGroup}
              className="text-blue-600 hover:text-blue-800"
            >
              + Gruppe hinzufügen
            </button>

            <div className="pt-4 border-t">
              <ConfigurationManager 
                groups={groups}
                onLoadConfig={setGroups}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mittelwert (g)
              </label>
              <input
                type="number"
                value={mean}
                onChange={(e) => setMean(e.target.value)}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Standardabweichung
              </label>
              <input
                type="number"
                value={deviation}
                onChange={(e) => setDeviation(e.target.value)}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isProducing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isProducing ? 'Produziere...' : 'Teile produzieren'}
        </button>
      </div>
    </form>
  );
}