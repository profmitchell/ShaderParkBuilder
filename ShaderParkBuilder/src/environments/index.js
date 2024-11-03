import { Ocean } from './Ocean';
import { Sky } from './Sky';
import { Plain } from './Plain';
import { Studio } from './Studio';

export const environments = {
  plain: {
    name: 'Plain Background',
    component: Plain,
    preview: '/previews/plain.png',
    hasControls: false
  },
  ocean: {
    name: 'Ocean',
    component: Ocean,
    preview: '/previews/ocean.png',
    hasControls: false
  },
  sky: {
    name: 'Sky',
    component: Sky,
    preview: '/previews/sky.png',
    hasControls: false
  },
  studio: {
    name: 'Studio',
    component: Studio,
    preview: '/previews/studio.png',
    hasControls: true,
    controls: {
      backgroundColor: { type: 'color', label: 'Background Color', default: 0xa0a0a0 },
      groundColor: { type: 'color', label: 'Ground Color', default: 0xcbcbcb },
      fogNear: { type: 'slider', label: 'Fog Start', min: 1, max: 50, step: 1, default: 10 },
      fogFar: { type: 'slider', label: 'Fog End', min: 50, max: 1000, step: 10, default: 500 }
    }
  }
}; 