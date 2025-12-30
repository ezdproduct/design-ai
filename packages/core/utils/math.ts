/**
 * @description: Utility functions for geometric calculations
 */

/**
 * Get polygon vertices for a regular polygon
 * @param sides Number of sides
 * @param radius Radius of the polygon
 * @returns Array of points representing the polygon vertices
 */
export function getPolygonVertices(sides: number, radius: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const angle = (2 * Math.PI) / sides;
  
  for (let i = 0; i < sides; i++) {
    points.push({
      x: radius * Math.cos(i * angle - Math.PI / 2),
      y: radius * Math.sin(i * angle - Math.PI / 2),
    });
  }
  
  return points;
}

export default {
  getPolygonVertices,
};
