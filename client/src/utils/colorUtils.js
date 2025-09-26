// utils/colorUtils.js

export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const isColorUnique = (color, colors) => {
  return !colors.includes(color);
};

export const getTextColor = (bgColor) => {
  const color = bgColor.substring(1); // remove #
  const rgb = parseInt(color, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.299 * r + 0.587 * g + 0.114 * b; // per ITU-R BT.709

  return luma > 186 ? '#000000' : '#FFFFFF'; // white if dark background, black if light
};
