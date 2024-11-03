export function hexToRgb(hex) {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex value
  const bigint = parseInt(hex, 16);
  
  // Convert to RGB
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  // Return as number (compatible with Three.js)
  return (r << 16) ^ (g << 8) ^ b;
}

export function rgbToHex(number) {
  // Convert the number to RGB components
  const r = (number >> 16) & 255;
  const g = (number >> 8) & 255;
  const b = number & 255;
  
  // Convert to hex string
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
} 