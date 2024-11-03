import React from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  onWeigh: (parts: number) => void;
  onCalibrate: (parts: number) => void;
  onReset: () => void;
  isWeighing: boolean;
  isCalibrated: boolean;
  totalParts?: number;
}

export function Controls({ onWeigh, onCalibrate, onReset, isWeighing, isCalibrated, totalParts }: Props) {
  const [calibrationParts, setCalibrationParts] = React.useState<string>('100');

  const handleCalibrate = (e: React.FormEvent) => {
    e.preventDefault();
    const numParts = parseInt(calibrationParts, 10);
    if (numParts > 0) {
      onCalibrate(numParts);
    }
  };

  const handleWeighAll = () => {
    if (totalParts) {
      onWeigh(totalParts);
    }
  };

  if (!isCalibrated) {
    return (
      <form onSubmit={handleCalibrate} className="space-y-4">
        <div>
          <label htmlFor="parts" className="block text-sm font-medium text-gray-700">
            Referenzteile zur Kalibrierung
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="number"
              name="parts"
              id="parts"
              min="1"
              value={calibrationParts}
              onChange={(e) => setCalibrationParts(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Anzahl der Teile"
              disabled={isWeighing}
            />
            <button
              type="submit"
              disabled={isWeighing}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Kalibrieren
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleWeighAll}
        disabled={isWeighing}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        Gesamtmenge wiegen
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={isWeighing}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <RotateCcw className="w-4 h-4" />
        Neu kalibrieren
      </button>
    </div>
  );
}