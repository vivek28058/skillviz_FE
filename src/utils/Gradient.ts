export const TriGradientGenerator = (startColor: string, middleColor: string, endColor: string, steps: number) => {
  const startRGB = hexToRgb(startColor);
  const middleRGB = hexToRgb(middleColor);
  const endRGB = hexToRgb(endColor);
  const halfSteps = steps / 2;
  const stepFactor = 1 / halfSteps;
  const gradient: { [key: string]: string } = {};

  // Generate gradient from start to middle color
  for (let i = 0; i < halfSteps; i++) {
    const gradientColor = interpolateColor(startRGB, middleRGB, i * stepFactor);
    gradient[i] = rgbToHex(gradientColor);
  }

  // Generate gradient from middle to end color
  for (let i = 0; i <= halfSteps; i++) {
    const gradientColor = interpolateColor(middleRGB, endRGB, i * stepFactor);
    gradient[halfSteps + i] = rgbToHex(gradientColor);
  }

  return gradient;
};

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.substring(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToHex(rgb: Array<number>) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

function interpolateColor(startRGB: Array<number>, endRGB: Array<number>, factor: number) {
  const r = Math.round(startRGB[0] + factor * (endRGB[0] - startRGB[0]));
  const g = Math.round(startRGB[1] + factor * (endRGB[1] - startRGB[1]));
  const b = Math.round(startRGB[2] + factor * (endRGB[2] - startRGB[2]));
  return [r, g, b];
}
