import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function TabHeader({ title, isOpen, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
    >
      <svg
        className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-90' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">{title}</span>
    </div>
  );
}

export function LeftPanel({ categories, searchTerm, onSearchChange, onAddElement, onAddSnippet }) {
  const [openTabs, setOpenTabs] = useState({
    library: true,
    presets: true,
    notes: true
  });

  const [notes, setNotes] = useState([{ id: 1, content: '' }]);

  const toggleTab = (tab) => {
    setOpenTabs(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <PanelGroup direction="vertical">
        {/* Library Section */}
        <Panel defaultSize={40} minSize={20}>
          <div className="h-full flex flex-col">
            <TabHeader 
              title="Library" 
              isOpen={openTabs.library} 
              onClick={() => toggleTab('library')}
            />
            {openTabs.library && (
              <div className="flex-1 overflow-y-auto p-4">
                <input
                  type="text"
                  placeholder="Search elements..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {categories.map((category) => (
                  <div key={category.name} className="mb-4">
                    <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      {category.name}
                    </h2>
                    <div className="space-y-2">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className="inline-block w-[calc(33.333%-8px)] m-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                          onClick={() => onAddElement(item.id, category.name)}
                        >
                          <div className="p-2 text-center">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-4 border-t pt-4 dark:border-gray-700">
                  <button
                    onClick={() => onAddSnippet()}
                    className="w-full p-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    + Add Custom Snippet
                  </button>
                </div>
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="h-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />

        {/* Presets Section */}
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col">
            <TabHeader 
              title="Presets" 
              isOpen={openTabs.presets} 
              onClick={() => toggleTab('presets')}
            />
            {openTabs.presets && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No presets available
                </div>
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="h-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />

        {/* Notes Section */}
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col">
            <TabHeader 
              title="Notes" 
              isOpen={openTabs.notes} 
              onClick={() => toggleTab('notes')}
            />
            {openTabs.notes && (
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="group relative">
                      <textarea
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm h-24"
                        placeholder="Add your notes here..."
                        value={note.content}
                        onChange={(e) => {
                          const updatedNotes = notes.map(n =>
                            n.id === note.id ? { ...n, content: e.target.value } : n
                          );
                          setNotes(updatedNotes);
                        }}
                      />
                      <button
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 text-xs bg-white dark:bg-gray-800 rounded-full p-1"
                        onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-full p-1 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                    onClick={() => setNotes([...notes, { id: Date.now(), content: '' }])}
                  >
                    + Add Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
} 