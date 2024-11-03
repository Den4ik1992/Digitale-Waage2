import React, { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import type { WeightGroup } from '../types';
import { saveConfiguration, loadConfigurations, deleteConfiguration, type StoredConfig } from '../utils/storage';

interface Props {
  groups: WeightGroup[];
  onLoadConfig: (groups: WeightGroup[]) => void;
}

export function ConfigurationManager({ groups, onLoadConfig }: Props) {
  const [configName, setConfigName] = useState('');
  const [savedConfigs, setSavedConfigs] = useState<StoredConfig[]>(loadConfigurations());

  const handleSave = () => {
    if (!configName.trim()) return;
    saveConfiguration(configName, groups);
    setSavedConfigs(loadConfigurations());
    setConfigName('');
  };

  const handleDelete = (name: string) => {
    deleteConfiguration(name);
    setSavedConfigs(loadConfigurations());
  };

  const handleLoad = (config: StoredConfig) => {
    onLoadConfig(config.groups);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          placeholder="Konfigurationsname"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={handleSave}
          disabled={!configName.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Speichern
        </button>
      </div>

      {savedConfigs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Gespeicherte Konfigurationen</h3>
          <div className="space-y-2">
            {savedConfigs.map((config) => (
              <div
                key={config.name}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div>
                  <div className="font-medium">{config.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(config.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoad(config)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Laden
                  </button>
                  <button
                    onClick={() => handleDelete(config.name)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}