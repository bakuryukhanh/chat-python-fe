const stringToColour = function (str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

const checkBlackOrWhite = (hex: string) => {
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

export const getImageUrl = (name: string) => {
  const color = stringToColour(name);
  const textColor = checkBlackOrWhite(color) === "white" ? "fff" : "000";
  const url = `https://ui-avatars.com/api/?name=${name}&background=${color}&color=${textColor}`;
  return url;
};
