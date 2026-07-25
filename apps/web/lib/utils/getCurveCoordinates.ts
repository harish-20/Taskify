export const getCurveCoordinates = (
  from: { top: number; right: number },
  to: { top: number; right: number },
  n: number,
) => {
  const top: number[] = [];
  const right: number[] = [];

  const steps = n + 1; // number of segments between from -> to

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    top.push(from.top + (to.top - from.top) * t);
    right.push(from.right + (to.right - from.right) * t);
  }

  return { top, right };
};
