/**
 * Get milliseconds from given days, hours, minutes and seconds
 * @param time - object containing days, hours, minutes and seconds
 * @returns number (total milliseconds)
 */
export const getMilliSeconds = (time: {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}): number => {
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = time;

  return (
    days * 24 * 60 * 60 * 1000 + // days → ms
    hours * 60 * 60 * 1000 + // hours → ms
    minutes * 60 * 1000 + // minutes → ms
    seconds * 1000 // seconds → ms
  );
};
