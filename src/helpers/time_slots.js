import {zeroPad} from "./calendar";

export const generateTimeSlots = (step = 10, min = 0, max = 24 * 60) => {
  if (60 % step !== 0 || min < 0 || max > 24 * 60 || max < min) {
    return null;
  }
  
  const out = [];
  for (let i = min; i < max; i += step) {
    out.push(`${zeroPad(Math.floor(i/60), 2)}:${zeroPad(i % 60, 2)}`);
  }
  
  return out;
};