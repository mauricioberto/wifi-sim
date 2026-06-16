export type Frequency = '2.4' | '5';

export type MaterialCategory =
  | 'internal_wall'
  | 'external_wall'
  | 'glass'
  | 'door'
  | 'pallet'
  | 'column';

export interface Material {
  category: MaterialCategory;
  label: string;
  labelEn: string;
  color: string;
  attenuation24: number;
  attenuation5: number;
  geometry: 'line' | 'rect' | 'circle';
}

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  type: 'wall' | 'glass' | 'door';
  start: Point;
  end: Point;
  thickness: number;
  material: MaterialCategory;
}

export interface Pallet {
  id: string;
  type: 'pallet';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  material: MaterialCategory;
}

export interface Column {
  id: string;
  type: 'column';
  cx: number;
  cy: number;
  radius: number;
  material: MaterialCategory;
}

export type Structure = Wall | Pallet | Column;

export interface AccessPoint {
  id: string;
  type: 'omni' | 'directional';
  position: Point;
  direction?: number;
  beamwidth?: number;
  txPowerDbm: number;
  channel?: number;
}

export interface GridSettings {
  enabled: boolean;
  size: number;
}

export interface ProjectMetadata {
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  version: '1.0';
  name: string;
  frequency: Frequency;
  structures: Structure[];
  accessPoints: AccessPoint[];
  backgroundImage?: string;
  grid: GridSettings;
  metadata: ProjectMetadata;
}

export type ToolType =
  | 'select'
  | 'wall'
  | 'glass'
  | 'door'
  | 'pallet'
  | 'column'
  | 'ap-omni'
  | 'ap-directional'
  | 'erase';
