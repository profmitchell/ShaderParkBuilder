import React, { useState, useEffect } from 'react';
import { ShaderParkPreview } from './components/ShaderParkPreview';

function App() {
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-600">
                        Live Preview
                    </h2>
                </div>
                <div className="flex-1 preview-container">
                    <ShaderParkPreview code={generatedCode} />
                </div>
            </div>
        </div>
    );
}

export default App;
