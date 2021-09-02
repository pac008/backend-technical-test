export interface Droid {
  protocols: string[];
  scan:      Scan[];
}

export interface Scan {
  coordinates: Coordinates;
  enemies:     Enemies;
  allies?:     number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Enemies {
  type:   string;
  number: number;
}
