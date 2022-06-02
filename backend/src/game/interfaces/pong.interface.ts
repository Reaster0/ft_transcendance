export enum Point {
  LEFT = 'leftScore',
  RIGHT = 'rightScore',
  NONE = 'none',
}

export interface PosOrVec {
  x: number;
  y: number;
}

export interface Ball {
  pos: PosOrVec;
  vel: PosOrVec;
  speed: number;
  radius: number;
}

export interface Paddle {
  tlcPos: PosOrVec; // tlc = top left corner
  length: number;
  width: number;
}

export interface Field {
  length: number;
  width: number;
  offset: number;
}

export interface Pong {
  field: Field;
  ball: Ball;
  paddleR: Paddle;
  paddleL: Paddle;
}
