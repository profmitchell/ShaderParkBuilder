import React from 'react';
import { environments } from '../../environments';
import { hexToRgb, rgbToHex } from '../../utils/colors';

export function Settings({ isOpen, onClose, theme, onThemeChange, environment, onEnvironmentChange, onEnvironmentParamChange, environmentParams }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Theme Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onThemeChange('light')}
                className={`px-4 py-2 rounded-md ${
                  theme === 'light' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Environment Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview Environment</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(environments).map(([key, env]) => (
                <button
                  key={key}
                  onClick={() => onEnvironmentChange(key)}
                  className={`px-3 py-2 rounded-md text-sm ${
                    environment === key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {env.name}
                </button>
              ))}
            </div>
          </div>

          {environment && environments[environment].hasControls && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Environment Controls
              </h3>
              <div className="space-y-3">
                {Object.entries(environments[environment].controls).map(([key, control]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-600 dark:text-gray-400">
                      {control.label}
                    </label>
                    {control.type === 'slider' ? (
                      <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={environmentParams[key] ?? control.default}
                        onChange={(e) => {
                          try {
                            onEnvironmentParamChange(key, parseFloat(e.target.value));
                          } catch (error) {
                            console.error('Error updating environment parameter:', error);
                          }
                        }}
                        className="w-full mt-1"
                      />
                    ) : control.type === 'color' ? (
                      <input
                        type="color"
                        value={rgbToHex(environmentParams[key] ?? control.default)}
                        onChange={(e) => {
                          try {
                            onEnvironmentParamChange(key, hexToRgb(e.target.value));
                          } catch (error) {
                            console.error('Error updating environment parameter:', error);
                          }
                        }}
                        className="w-full h-8 mt-1 rounded cursor-pointer"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 