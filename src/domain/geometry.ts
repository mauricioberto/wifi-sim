import type { Point, Wall, Pallet, Column } from './types';

export function distance(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const len2 = abx * abx + aby * aby;
  if (len2 === 0) return distance(p, a);
  let t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2;
  t = Math.max(0, Math.min(1, t));
  const projX = a.x + t * abx;
  const projY = a.y + t * aby;
  return distance(p, { x: projX, y: projY });
}

export function segmentIntersectsSegment(
  a1: Point, b1: Point,
  a2: Point, b2: Point,
): boolean {
  const d1x = b1.x - a1.x;
  const d1y = b1.y - a1.y;
  const d2x = b2.x - a2.x;
  const d2y = b2.y - a2.y;
  const cross = d1x * d2y - d1y * d2x;
  if (Math.abs(cross) < 1e-10) return false;
  const t = ((a2.x - a1.x) * d2y - (a2.y - a1.y) * d2x) / cross;
  const u = ((a2.x - a1.x) * d1y - (a2.y - a1.y) * d1x) / cross;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

export function pointInRotatedRect(
  p: Point,
  cx: number, cy: number,
  w: number, h: number,
  angleDeg: number,
): boolean {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - cx;
  const dy = p.y - cy;
  const localX = dx * cos + dy * sin;
  const localY = -dx * sin + dy * cos;
  return Math.abs(localX) <= w / 2 && Math.abs(localY) <= h / 2;
}

export function pointInCircle(p: Point, cx: number, cy: number, radius: number): boolean {
  return distance(p, { x: cx, y: cy }) <= radius;
}

export function rayIntersectsWall(
  origin: Point, target: Point,
  wall: Wall,
): boolean {
  return segmentIntersectsSegment(origin, target, wall.start, wall.end);
}

export function rayIntersectsPallet(
  origin: Point, target: Point,
  pallet: Pallet,
): boolean {
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = origin.x + (target.x - origin.x) * t;
    const py = origin.y + (target.y - origin.y) * t;
    if (pointInRotatedRect({ x: px, y: py }, pallet.x, pallet.y, pallet.width, pallet.height, pallet.rotation)) {
      return true;
    }
  }
  return false;
}

export function rayIntersectsColumn(
  origin: Point, target: Point,
  column: Column,
): boolean {
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = origin.x + (target.x - origin.x) * t;
    const py = origin.y + (target.y - origin.y) * t;
    if (pointInCircle({ x: px, y: py }, column.cx, column.cy, column.radius)) {
      return true;
    }
  }
  return false;
}
