import React, { useState, useEffect } from 'react';
import { ShaderParkPreview } from './components/ShaderParkPreview';
import * as THREE from 'three';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from "react-resizable-panels";
import { Toolbar } from './components/layout/Toolbar';
import { LeftPanel } from './components/layout/LeftPanel';
import { environments } from './environments';
import { Settings } from './components/ui/Settings';
import { AddSnippetDialog } from './components/dialogs/AddSnippetDialog';

// Add this new component for the resize handle
function ResizeHandle({ className = "", ...props }) {
  return (
    <PanelResizeHandle
      className={`w-2 hover:bg-gray-300 transition-colors duration-150 ${className}`}
      {...props}
    >
      <div className="w-px h-full bg-gray-200 mx-auto" />
    </PanelResizeHandle>
  );
}

// Add new animation helper functions
const getAnimatedValue = (param, animation) => {
  if (!animation?.enabled) return param;
  
  const scale = animation.amplitude || 1;
  const speed = animation.speed || 1;
  const offset = animation.offset || 0;
  
  // Create oscillation between param-scale and param+scale
  return `${param} + ${scale} * sin(${speed} * time + ${offset})`;
};

// Add this helper function at the top with other helpers
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [selectedElements, setSelectedElements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [animations, setAnimations] = useState({});
  const [currentEnvironment, setCurrentEnvironment] = useState('plain');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [environmentParams, setEnvironmentParams] = useState({});
  const [customSnippets, setCustomSnippets] = useState([]);
  const [showSnippetDialog, setShowSnippetDialog] = useState(false);

  useEffect(() => {
    // Initialize geometry
    const sphereGeometry = new THREE.SphereGeometry(2, 45, 45);
    setGeometry(sphereGeometry);
  }, []);

  // Add theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Element definitions
  const elementDefinitions = {
    geometry: {
      box: {
        name: 'Box',
        category: 'Geometry',
        codeTemplate: 'box({{width}}, {{height}}, {{depth}})',
        defaultParams: { width: 1, height: 1, depth: 1 },
        paramControls: [
          { name: 'width', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true },
          { name: 'height', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true },
          { name: 'depth', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true }
        ]
      },
      sphere: {
        name: 'Sphere',
        category: 'Geometry',
        codeTemplate: 'sphere({{radius}})',
        defaultParams: { radius: 1 },
        paramControls: [
          { name: 'radius', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true }
        ]
      },
      boxFrame: {
        name: 'Box Frame',
        category: 'Geometry',
        codeTemplate: 'boxFrame({{width}}, {{height}}, {{depth}}, {{thickness}})',
        defaultParams: { width: 2, height: 2, depth: 2, thickness: 0.1 },
        paramControls: [
          { name: 'width', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true },
          { name: 'height', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true },
          { name: 'depth', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true },
          { name: 'thickness', type: 'slider', min: 0.01, max: 1, step: 0.01, animatable: true }
        ]
      },
      torus: {
        name: 'Torus',
        category: 'Geometry',
        codeTemplate: 'torus({{outerRingSize}}, {{innerRingSize}})',
        defaultParams: { outerRingSize: 1, innerRingSize: 0.5 },
        paramControls: [
          { name: 'outerRingSize', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true },
          { name: 'innerRingSize', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true }
        ]
      },
      cylinder: {
        name: 'Cylinder',
        category: 'Geometry',
        codeTemplate: 'cylinder({{radius}}, {{height}})',
        defaultParams: { radius: 0.5, height: 2 },
        paramControls: [
          { name: 'radius', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true },
          { name: 'height', type: 'slider', min: 0.1, max: 5, step: 0.1, animatable: true }
        ]
      }
    },
    color: {
      solid: {
        name: 'Solid Color',
        category: 'Color',
        codeTemplate: 'color(vec3({{r}}, {{g}}, {{b}}))',
        defaultParams: { r: 1, g: 0, b: 0 },
        paramControls: [
          { name: 'color', type: 'color', value: '#ff0000' }
        ]
      }
    },
    material: {
      metal: {
        name: 'Metal',
        category: 'Material',
        codeTemplate: 'metal({{value}})',
        defaultParams: { value: 0.5 },
        paramControls: [
          { name: 'value', type: 'slider', min: 0, max: 1, step: 0.01, animatable: true }
        ]
      },
      shine: {
        name: 'Shine',
        category: 'Material',
        codeTemplate: 'shine({{value}})',
        defaultParams: { value: 0.5 },
        paramControls: [
          { name: 'value', type: 'slider', min: 0, max: 1, step: 0.01, animatable: true }
        ]
      },
      fresnel: {
        name: 'Fresnel',
        category: 'Material',
        codeTemplate: 'fresnel({{amount}});',
        defaultParams: { amount: 0.5 },
        paramControls: [
          { name: 'amount', type: 'slider', min: 0, max: 1, step: 0.01, animatable: true }
        ]
      }
    },
    effects: {
      noiseDisplace: {
        name: 'Noise Displacement',
        category: 'Effects',
        codeTemplate: `let s = getSpace();
let displacement = noise(s * {{scale}} + time * {{speed}});
displace(displacement * {{amount}}, 0, 0);`,
        defaultParams: { scale: 3.0, speed: 0.1, amount: 0.1 },
        paramControls: [
          { name: 'scale', type: 'slider', min: 0.1, max: 10, step: 0.1, animatable: true },
          { name: 'speed', type: 'slider', min: 0, max: 1, step: 0.01, animatable: true },
          { name: 'amount', type: 'slider', min: 0, max: 1, step: 0.01, animatable: true }
        ]
      },
      twist: {
        name: 'Twist',
        category: 'Effects',
        codeTemplate: `twist({{amount}} * sin(time * {{speed}}));`,
        defaultParams: { amount: 3.0, speed: 1.0 },
        paramControls: [
          { name: 'amount', type: 'slider', min: 0, max: 10, step: 0.1, animatable: true },
          { name: 'speed', type: 'slider', min: 0, max: 2, step: 0.1, animatable: true }
        ]
      },
      // Add more effect definitions...
    },
    utility: {
      getSpace: {
        name: 'Get Space',
        category: 'Utility',
        codeTemplate: 'let s = getSpace();',
        defaultParams: {},
        paramControls: []
      },
      noise: {
        name: 'Noise',
        category: 'Utility',
        codeTemplate: 'noise(getSpace() * {{scale}})',
        defaultParams: { scale: 1.0 },
        paramControls: [
          { name: 'scale', type: 'slider', min: 0.1, max: 10, step: 0.1, animatable: true }
        ]
      },
      occlusion: {
        name: 'Occlusion',
        category: 'Utility',
        codeTemplate: 'occlusion({{amount}});',
        defaultParams: { amount: 0.5 },
        paramControls: [
          { name: 'amount', type: 'slider', min: 0, max: 1, step: 0.01, animatable: true }
        ]
      },
      getRayDirection: {
        name: 'Get Ray Direction',
        category: 'Utility',
        codeTemplate: 'getRayDirection()',
        defaultParams: {},
        paramControls: [],
        description: 'Gets the direction that camera/ray is looking at'
      },
      sphericalDistribution: {
        name: 'Spherical Distribution',
        category: 'Utility',
        codeTemplate: 'sphericalDistribution(getSpace(), {{numPoints}})',
        defaultParams: { numPoints: 10 },
        paramControls: [
          { 
            name: 'numPoints', 
            type: 'slider', 
            min: 1, 
            max: 100, 
            step: 1, 
            animatable: true,
            label: 'Number of Points'
          }
        ],
        description: 'Distributes points over a sphere surface'
      }
    },
    modifiers: {
      shell: {
        name: 'Shell',
        category: 'Modifiers',
        codeTemplate: 'shell({{thickness}})',
        defaultParams: { thickness: 0.1 },
        paramControls: [
          { 
            name: 'thickness', 
            type: 'slider', 
            min: 0.001, 
            max: 0.2, 
            step: 0.001, 
            animatable: true,
            label: 'Shell Thickness'
          }
        ],
        description: 'Creates a hollow shell with specified thickness'
      },
      expand: {
        name: 'Expand',
        category: 'Modifiers',
        codeTemplate: 'expand({{amount}})',
        defaultParams: { amount: 0.1 },
        paramControls: [
          { 
            name: 'amount', 
            type: 'slider', 
            min: -1, 
            max: 1, 
            step: 0.01, 
            animatable: true,
            label: 'Expand Amount'
          }
        ]
      },
      blend: {
        name: 'Blend',
        category: 'Modifiers',
        codeTemplate: 'blend({{amount}})',
        defaultParams: { amount: 0.5 },
        paramControls: [
          { 
            name: 'amount', 
            type: 'slider', 
            min: 0, 
            max: 1, 
            step: 0.01, 
            animatable: true,
            label: 'Blend Amount'
          }
        ]
      }
    },
    space: {
      mirrorX: {
        name: 'Mirror X',
        category: 'Space',
        codeTemplate: 'mirrorX()',
        defaultParams: {},
        paramControls: []
      },
      mirrorY: {
        name: 'Mirror Y',
        category: 'Space',
        codeTemplate: 'mirrorY()',
        defaultParams: {},
        paramControls: []
      },
      mirrorZ: {
        name: 'Mirror Z',
        category: 'Space',
        codeTemplate: 'mirrorZ()',
        defaultParams: {},
        paramControls: []
      },
      rotateX: {
        name: 'Rotate X',
        category: 'Space',
        codeTemplate: 'rotateX({{angle}})',
        defaultParams: { angle: 0 },
        paramControls: [
          { 
            name: 'angle', 
            type: 'slider', 
            min: -Math.PI, 
            max: Math.PI, 
            step: 0.01, 
            animatable: true,
            label: 'Angle (radians)'
          }
        ]
      },
      rotateY: {
        name: 'Rotate Y',
        category: 'Space',
        codeTemplate: 'rotateY({{angle}})',
        defaultParams: { angle: 0 },
        paramControls: [
          { 
            name: 'angle', 
            type: 'slider', 
            min: -Math.PI, 
            max: Math.PI, 
            step: 0.01, 
            animatable: true,
            label: 'Angle (radians)'
          }
        ]
      },
      rotateZ: {
        name: 'Rotate Z',
        category: 'Space',
        codeTemplate: 'rotateZ({{angle}})',
        defaultParams: { angle: 0 },
        paramControls: [
          { 
            name: 'angle', 
            type: 'slider', 
            min: -Math.PI, 
            max: Math.PI, 
            step: 0.01, 
            animatable: true,
            label: 'Angle (radians)'
          }
        ]
      }
    }
  };

  const categories = [
    {
      name: 'Geometry',
      items: [
        { id: 'box', name: 'Box' },
        { id: 'sphere', name: 'Sphere' },
        { id: 'boxFrame', name: 'Box Frame' },
        { id: 'torus', name: 'Torus' },
        { id: 'cylinder', name: 'Cylinder' }
      ]
    },
    {
      name: 'Operations',
      items: [
        { id: 'blend', name: 'Smooth Blend' },
        { id: 'union', name: 'Union' },
        { id: 'difference', name: 'Difference' },
        { id: 'intersect', name: 'Intersect' }
      ]
    },
    {
      name: 'Material',
      items: [
        { id: 'metal', name: 'Metal' },
        { id: 'shine', name: 'Shine' },
        { id: 'fresnel', name: 'Fresnel' }
      ]
    },
    {
      name: 'Utility',
      items: [
        { id: 'getSpace', name: 'Get Space' },
        { id: 'getNormal', name: 'Get Normal' },
        { id: 'noise', name: 'Noise' },
        { id: 'occlusion', name: 'Occlusion' },
        { id: 'getRayDirection', name: 'Get Ray Direction' },
        { id: 'sphericalDistribution', name: 'Spherical Distribution' }
      ]
    },
    {
      name: 'Space',
      items: [
        { id: 'mirrorX', name: 'Mirror X' },
        { id: 'mirrorY', name: 'Mirror Y' },
        { id: 'mirrorZ', name: 'Mirror Z' },
        { id: 'rotateX', name: 'Rotate X' },
        { id: 'rotateY', name: 'Rotate Y' },
        { id: 'rotateZ', name: 'Rotate Z' }
      ]
    },
    {
      name: 'Modifiers',
      items: [
        { id: 'shell', name: 'Shell' },
        { id: 'expand', name: 'Expand' },
        { id: 'blend', name: 'Blend' }
      ]
    },
    {
      name: 'Color',
      items: [
        { id: 'solid', name: 'Solid Color' }
      ]
    },
    {
      name: 'Custom',
      items: customSnippets.map(snippet => ({
        id: snippet.id,
        name: snippet.name
      }))
    }
  ];

  const handleAddElement = (elementId, category) => {
    const elementType = category.toLowerCase() + '.' + elementId;
    const definition = elementDefinitions[category.toLowerCase()][elementId];
    
    if (!definition) {
      setError(`Unknown element type: ${elementType}`);
      return;
    }

    const newElement = {
      id: `${elementId}-${Date.now()}`,
      type: elementType,
      name: definition.name,
      params: { ...definition.defaultParams },
      animations: {}
    };

    setSelectedElements(prev => [...prev, newElement]);
    generateCode([...selectedElements, newElement]);
  };

  const handleRemoveElement = (elementId) => {
    setSelectedElements(prev => prev.filter(el => el.id !== elementId));
    generateCode(selectedElements.filter(el => el.id !== elementId));
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null;
  };

  const generateCode = (elements) => {
    // Separate elements by category
    const materials = elements.filter(el => el.type.startsWith('material.'));
    const colors = elements.filter(el => el.type.startsWith('color.'));
    const utilities = elements.filter(el => el.type.startsWith('utility.'));
    const space = elements.filter(el => el.type.startsWith('space.'));
    const modifiers = elements.filter(el => el.type.startsWith('modifiers.'));
    const geometries = elements.filter(el => el.type.startsWith('geometry.'));
    
    let code = '';
    
    // First apply utilities
    utilities.forEach(el => {
      const [category, type] = el.type.split('.');
      const definition = elementDefinitions[category][type];
      let utilityCode = definition.codeTemplate;
      
      Object.entries(el.params).forEach(([key, value]) => {
        const animationValue = el.animations[key]?.enabled 
          ? getAnimatedValue(value, el.animations[key])
          : value;
        utilityCode = utilityCode.replace(`{{${key}}}`, animationValue);
      });
      
      code += utilityCode + ';\n';
    });
    
    // Then apply space transformations
    space.forEach(el => {
      const [category, type] = el.type.split('.');
      const definition = elementDefinitions[category][type];
      let spaceCode = definition.codeTemplate;
      
      Object.entries(el.params).forEach(([key, value]) => {
        const animationValue = el.animations[key]?.enabled 
          ? getAnimatedValue(value, el.animations[key])
          : value;
        spaceCode = spaceCode.replace(`{{${key}}}`, animationValue);
      });
      
      code += spaceCode + ';\n';
    });
    
    // Then apply materials
    materials.forEach(el => {
      const [category, type] = el.type.split('.');
      const definition = elementDefinitions[category][type];
      let materialCode = definition.codeTemplate;
      
      Object.entries(el.params).forEach(([key, value]) => {
        const animationValue = el.animations[key]?.enabled 
          ? getAnimatedValue(value, el.animations[key])
          : value;
        materialCode = materialCode.replace(`{{${key}}}`, animationValue);
      });
      
      code += materialCode + ';\n';
    });
    
    // Then apply colors
    colors.forEach(el => {
      const rgb = hexToRgb(el.params.color || '#ff0000');
      code += `color(vec3(${rgb.r.toFixed(2)}, ${rgb.g.toFixed(2)}, ${rgb.b.toFixed(2)}));\n`;
    });
    
    // Then apply modifiers
    modifiers.forEach(el => {
      const [category, type] = el.type.split('.');
      const definition = elementDefinitions[category][type];
      let modifierCode = definition.codeTemplate;
      
      Object.entries(el.params).forEach(([key, value]) => {
        const animationValue = el.animations[key]?.enabled 
          ? getAnimatedValue(value, el.animations[key])
          : value;
        modifierCode = modifierCode.replace(`{{${key}}}`, animationValue);
      });
      
      code += modifierCode + ';\n';
    });
    
    // Finally, handle geometries
    if (geometries.length > 0) {
      geometries.forEach((el, index) => {
        const [category, type] = el.type.split('.');
        const definition = elementDefinitions[category][type];
        let geomCode = definition.codeTemplate;
        
        Object.entries(el.params).forEach(([key, value]) => {
          const animationValue = el.animations[key]?.enabled 
            ? getAnimatedValue(value, el.animations[key])
            : value;
          geomCode = geomCode.replace(`{{${key}}}`, animationValue);
        });
        
        if (index === 0) {
          code += geomCode;
        } else {
          code += `;\nunion();\n${geomCode}`;
        }
      });
    }
    
    setGeneratedCode(code);
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setGeneratedCode(newCode);
  };

  // Add animation toggle handler
  const handleToggleAnimation = (elementId, paramName) => {
    setSelectedElements(prev => {
      return prev.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            animations: {
              ...el.animations,
              [paramName]: {
                ...(el.animations[paramName] || {}),
                enabled: !(el.animations[paramName]?.enabled),
                amplitude: el.animations[paramName]?.amplitude || 0.5,
                speed: el.animations[paramName]?.speed || 1,
                offset: el.animations[paramName]?.offset || 0
              }
            }
          };
        }
        return el;
      });
    });
  };

  // Add animation clear handler
  const handleClearAnimation = (elementId, paramName) => {
    setSelectedElements(prev => {
      return prev.map(el => {
        if (el.id === elementId) {
          const newAnimations = { ...el.animations };
          delete newAnimations[paramName];
          return {
            ...el,
            animations: newAnimations
          };
        }
        return el;
      });
    });
  };

  // Update renderParamControl with collapsible animation controls
  const renderParamControl = (element, control, index) => {
    const isAnimated = element.animations[control.name]?.enabled;
    
    return (
      <div key={control.name} className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            {control.name.charAt(0).toUpperCase() + control.name.slice(1)}
          </label>
          <div className="flex items-center space-x-2">
            {isAnimated && (
              <button
                onClick={() => handleClearAnimation(element.id, control.name)}
                className="p-1 rounded text-red-500 hover:bg-red-50"
                title="Clear animation"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {control.animatable && (
              <button
                onClick={() => handleToggleAnimation(element.id, control.name)}
                className={`p-1 rounded ${isAnimated ? 'text-blue-500' : 'text-gray-400'} hover:bg-gray-50`}
                title={isAnimated ? 'Disable animation' : 'Enable animation'}
              >
                <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {!isAnimated && (
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={element.params[control.name]}
            onChange={(e) => {
              const newElements = [...selectedElements];
              newElements[index] = {
                ...element,
                params: {
                  ...element.params,
                  [control.name]: parseFloat(e.target.value)
                }
              };
              setSelectedElements(newElements);
              generateCode(newElements);
            }}
            className="w-full"
          />
        )}
        
        {isAnimated && (
          <div className="mt-2 space-y-2 pl-4 border-l-2 border-blue-200">
            <div>
              <label className="text-xs text-gray-600">Base Value</label>
              <div className="text-sm font-medium text-gray-900">
                {element.params[control.name].toFixed(2)}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Amplitude</label>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={element.animations[control.name].amplitude}
                onChange={(e) => {
                  const newElements = [...selectedElements];
                  newElements[index] = {
                    ...element,
                    animations: {
                      ...element.animations,
                      [control.name]: {
                        ...element.animations[control.name],
                        amplitude: parseFloat(e.target.value)
                      }
                    }
                  };
                  setSelectedElements(newElements);
                  generateCode(newElements);
                }}
                className="w-full"
              />
              <div className="text-xs text-gray-500">
                ±{element.animations[control.name].amplitude.toFixed(2)}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Speed</label>
              <input
                type="range"
                min={0.1}
                max={5}
                step={0.1}
                value={element.animations[control.name].speed}
                onChange={(e) => {
                  const newElements = [...selectedElements];
                  newElements[index] = {
                    ...element,
                    animations: {
                      ...element.animations,
                      [control.name]: {
                        ...element.animations[control.name],
                        speed: parseFloat(e.target.value)
                      }
                    }
                  };
                  setSelectedElements(newElements);
                  generateCode(newElements);
                }}
                className="w-full"
              />
              <div className="text-xs text-gray-500">
                {element.animations[control.name].speed.toFixed(1)}x
              </div>
            </div>
          </div>
        )}
        
        {!isAnimated && (
          <div className="text-xs text-gray-500">
            {element.params[control.name].toFixed(2)}
          </div>
        )}
      </div>
    );
  };

  // Add theme handler
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Add environment parameter handler
  const handleEnvironmentParamChange = (key, value) => {
    setEnvironmentParams(prev => {
      const newParams = { ...prev, [key]: value };
      // Update the environment if it exists
      if (environments[currentEnvironment]?.component) {
        environmentRef.current?.updateParams(newParams);
      }
      return newParams;
    });
  };

  // Add snippet handler
  const handleAddSnippet = () => {
    setShowSnippetDialog(true);
  };

  const handleSaveSnippet = (snippet) => {
    const newSnippet = {
      id: `snippet-${Date.now()}`,
      ...snippet,
      category: 'Custom'
    };
    
    // Add to custom snippets
    setCustomSnippets(prev => [...prev, newSnippet]);
    
    // Add to element definitions
    elementDefinitions.custom = {
      ...elementDefinitions.custom,
      [newSnippet.id]: {
        name: newSnippet.name,
        category: 'Custom',
        codeTemplate: newSnippet.codeTemplate,
        defaultParams: newSnippet.defaultParams,
        paramControls: newSnippet.paramControls
      }
    };
    
    // Save to localStorage
    localStorage.setItem('customSnippets', JSON.stringify(customSnippets));
  };

  // Load custom snippets on mount
  useEffect(() => {
    const saved = localStorage.getItem('customSnippets');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCustomSnippets(parsed);
      
      // Restore to element definitions
      elementDefinitions.custom = {};
      parsed.forEach(snippet => {
        elementDefinitions.custom[snippet.id] = {
          name: snippet.name,
          category: 'Custom',
          codeTemplate: snippet.codeTemplate,
          defaultParams: snippet.defaultParams,
          paramControls: snippet.paramControls
        };
      });
    }
  }, []);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Toolbar 
        theme={theme} 
        onThemeChange={handleThemeChange}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel */}
        <Panel defaultSize={20} minSize={15}>
          <LeftPanel 
            categories={categories}
            searchTerm={searchTerm}
            onSearchChange={(value) => setSearchTerm(value)}
            onAddElement={handleAddElement}
            onAddSnippet={handleAddSnippet}
          />
        </Panel>

        <ResizeHandle />

        {/* Middle Panel */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <PanelGroup direction="vertical">
              <Panel defaultSize={50}>
                <div className="h-full border-b border-gray-200 p-4 bg-white overflow-y-auto">
                  <h2 className="text-sm font-semibold text-gray-600 mb-4">
                    Shader Composer
                  </h2>
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    {selectedElements.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Add elements from the left panel to start building your shader
                      </div>
                    ) : (
                      selectedElements.map((element, index) => (
                        <div key={element.id} className="p-4 bg-white border border-gray-200 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{element.name}</span>
                            <button
                              onClick={() => handleRemoveElement(element.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              ×
                            </button>
                          </div>
                          <div className="space-y-4">
                            {element.type.split('.')[0] === 'color' ? (
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Color</label>
                                <input
                                  type="color"
                                  value={element.params.color || '#ff0000'}
                                  onChange={(e) => {
                                    const newElements = [...selectedElements];
                                    newElements[index] = {
                                      ...element,
                                      params: {
                                        ...element.params,
                                        color: e.target.value
                                      }
                                    };
                                    setSelectedElements(newElements);
                                    generateCode(newElements);
                                  }}
                                  className="w-full h-10 rounded-md cursor-pointer"
                                />
                              </div>
                            ) : (
                              elementDefinitions[element.type.split('.')[0]][element.type.split('.')[1]]
                                .paramControls.map((control) => (
                                  renderParamControl(element, control, index)
                                ))
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Panel>

              <ResizeHandle />

              <Panel defaultSize={50}>
                <div className="h-full p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold text-gray-600">Generated Code</h2>
                    <button
                      onClick={() => copyToClipboard(generatedCode)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      Copy Code
                    </button>
                  </div>
                  <textarea
                    className="w-full h-[calc(100%-2rem)] p-4 font-mono text-sm bg-white rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={generatedCode || '// Add elements to generate shader code'}
                    onChange={handleCodeChange}
                    spellCheck="false"
                  />
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </Panel>

        <ResizeHandle />

        {/* Right Panel - Preview */}
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Preview
              </h2>
            </div>
            <div className="flex-1">
              <ShaderParkPreview 
                code={generatedCode} 
                geometry={geometry}
                environment={currentEnvironment}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>

      <Settings 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        environment={currentEnvironment}
        onEnvironmentChange={setCurrentEnvironment}
        environmentParams={environmentParams}
        onEnvironmentParamChange={handleEnvironmentParamChange}
      />

      <AddSnippetDialog 
        isOpen={showSnippetDialog}
        onClose={() => setShowSnippetDialog(false)}
        onSave={handleSaveSnippet}
      />
    </div>
  );
}

export default App;
