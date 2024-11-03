import React, { useState } from 'react';

export function AddSnippetDialog({ isOpen, onClose, onSave }) {
  const [snippet, setSnippet] = useState({
    name: '',
    category: 'Custom',
    codeTemplate: '',
    defaultParams: {},
    paramControls: []
  });

  const [currentParam, setCurrentParam] = useState({
    name: '',
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.1
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!snippet.name || !snippet.codeTemplate) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(snippet);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Add Custom Snippet</h2>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={snippet.name}
              onChange={(e) => setSnippet(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              placeholder="Enter snippet name"
            />
          </div>

          {/* Code Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Code Template
            </label>
            <textarea
              value={snippet.codeTemplate}
              onChange={(e) => setSnippet(prev => ({ ...prev, codeTemplate: e.target.value }))}
              className="w-full p-2 border rounded-md h-32 font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              placeholder="Enter shader code here. Use {{paramName}} for parameters"
            />
          </div>

          {/* Parameters Section */}
          <div className="border-t pt-4 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parameters</h3>
            
            {/* Parameter List */}
            <div className="space-y-2 mb-4">
              {snippet.paramControls.map((param, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md dark:border-gray-600">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{param.name}</span>
                  <button
                    onClick={() => {
                      setSnippet(prev => ({
                        ...prev,
                        paramControls: prev.paramControls.filter((_, i) => i !== index)
                      }));
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Add Parameter Form */}
            <div className="p-2 border rounded-md dark:border-gray-600">
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Parameter name"
                  value={currentParam.name}
                  onChange={(e) => setCurrentParam(prev => ({ ...prev, name: e.target.value }))}
                  className="p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                <button
                  onClick={() => {
                    if (currentParam.name) {
                      setSnippet(prev => ({
                        ...prev,
                        paramControls: [...prev.paramControls, { ...currentParam }],
                        defaultParams: {
                          ...prev.defaultParams,
                          [currentParam.name]: currentParam.min
                        }
                      }));
                      setCurrentParam({
                        name: '',
                        type: 'slider',
                        min: 0,
                        max: 1,
                        step: 0.1
                      });
                    }
                  }}
                  disabled={!currentParam.name}
                  className="bg-blue-500 text-white rounded px-2 py-1 disabled:opacity-50 hover:bg-blue-600"
                >
                  Add Parameter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Snippet
          </button>
        </div>
      </div>
    </div>
  );
} 