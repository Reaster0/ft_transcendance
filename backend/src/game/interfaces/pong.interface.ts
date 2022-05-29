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
  blcPos: PosOrVec; // blc = bottom left corner
  width: number;
  length: number;
}

export interface Field {
  width: number;
  length: number;
  offset: number;
}

export interface Pong {
  field: Field;
  ball: Ball;
  paddleR: Paddle;
  paddleL: Paddle;
}
