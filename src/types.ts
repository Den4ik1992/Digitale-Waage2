export interface Part {
  weight: number;
}

export interface WeightGroup {
  weight: number;
  count: number;
}

export interface CalibrationResult {
  averageWeight: number;
  totalWeight: number;
  sampleSize: number;
}

export interface MeasurementPoint {
  parts: number;
  estimatedParts: number;
  error: number;
}

export interface WeighingResult {
  totalWeight: number;
  estimatedTotalParts: number;
  actualTotalParts: number;
  error: number;
  measurementPoints: MeasurementPoint[];
}

export interface ProductionConfig {
  totalParts: number;
  distribution: 'manual' | 'normal';
  manualGroups: WeightGroup[];
  normalMean: number;
  normalDeviation: number;
}