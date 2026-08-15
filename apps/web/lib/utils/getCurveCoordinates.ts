export const getCurveCoordinates = (
  from: { top: number; left: number },
  to: { top: number; left: number },
  n: number,
) => {
  const top: number[] = [];
  const left: number[] = [];

  const steps = n + 1; // number of segments between from -> to

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    top.push(from.top + (to.top - from.top) * t);
    left.push(from.left + (to.left - from.left) * t);
  }

  return { top, left };
};
