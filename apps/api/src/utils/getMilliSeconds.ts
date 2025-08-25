/**
 * Get milliseconds from given hours, minutes and seconds
 * @param time - object containing hours, minutes and seconds
 * @returns number (total milliseconds)
 */
export const getMilliSeconds = (time: {
  hour?: number;
  minutes?: number;
  seconds?: number;
}): number => {
  const { hour = 0, minutes = 0, seconds = 0 } = time;

  return (
    hour * 60 * 60 * 1000 + // hours → ms
    minutes * 60 * 1000 + // minutes → ms
    seconds * 1000 // seconds → ms
  );
};
