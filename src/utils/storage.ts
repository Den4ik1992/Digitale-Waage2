import type { WeightGroup } from '../types';

const STORAGE_KEY = 'weight-configurations';

export interface StoredConfig {
  name: string;
  groups: WeightGroup[];
  timestamp: number;
}

export function saveConfiguration(name: string, groups: WeightGroup[]): void {
  try {
    const existingConfigs = loadConfigurations();
    const newConfig: StoredConfig = {
      name,
      groups,
      timestamp: Date.now()
    };
    
    const updatedConfigs = [...existingConfigs, newConfig];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));
  } catch (error) {
    console.error('Error saving configuration:', error);
  }
}

export function loadConfigurations(): StoredConfig[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading configurations:', error);
    return [];
  }
}

export function deleteConfiguration(name: string): void {
  try {
    const configs = loadConfigurations();
    const updatedConfigs = configs.filter(config => config.name !== name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));
  } catch (error) {
    console.error('Error deleting configuration:', error);
  }
}