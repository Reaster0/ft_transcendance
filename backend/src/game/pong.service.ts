import { Injectable } from '@nestjs/common';
import { PosOrVec, Point, Ball, Paddle, Field, Pong } from './interfaces/pong.interface';

@Injectable()
export class PongService {
  constructor() {}

  initPong(): Pong {
    const field = this.initField();
    const ball = this.initBall(field);
    const paddleL = this.initPaddle(field, true);
    const paddleR = this.initPaddle(field, false);
    const pong: Pong = {
      field: field,
      ball: ball,
      paddleL: paddleL,
      paddleR: paddleR,
    };
    return pong;
  }

  initField(): Field {
    const field: Field = {
      length: 1,
      width: 1,
      offset: 1 / 80,
    };
    return field;
  }

  initBall(field: Field): Ball {
    const ball: Ball = {
      pos: { x: field.length / 2, y: field.width / 2 },
      vel:  this.initBallVelocity(field, Math.random() > 0.5),
      speed: field.length / 500,
      radius: field.length / 60,
    };
    return ball;
  }

  initPaddle(field: Field, left: boolean): Paddle {
    const xValue = left === true ? 0 + field.length / 50 : field.length - 2 * field.length / 50;
    const paddle: Paddle = {
      tlcPos: { x: xValue, y: field.width / 2 },
      length: field.length / 50,
      width: field.width / 7,
    };
    return paddle;
  }

  initBallVelocity(field: Field, goingRight: boolean): PosOrVec {
    let dir = 1;
    if (goingRight === true) {
      dir = -1;
    }
    let yValue = Math.random() * (0.00075 + 0.00075) - 0.00075;
    let vel: PosOrVec = {
      x: dir * (field.length / 1000),
      y : yValue,
    };
    return vel;
  }

  calcBallPos(pong: Pong) {
    const ball = pong.ball;
    const field = pong.field;

    ball.pos.x = ball.pos.x + ball.vel.x;
    ball.pos.y = ball.pos.y + ball.vel.y;
    if (ball.pos.y - ball.radius < 0 + field.offset) {
      ball.vel.y *= -1;
      ball.pos.y = 0 + field.offset + ball.vel.y + ball.radius;
    } else if (ball.pos.y + ball.radius > field.width - field.offset) {
      ball.vel.y *= -1;
      ball.pos.y = field.width - field.offset + ball.vel.y - ball.radius;
    }
    let collision = false;
    let paddle = undefined;
    if ((ball.pos.x - ball.radius) <= (field.offset + pong.paddleL.length)) {
      collision = this.checkCollision(ball, pong.paddleL);
      paddle = pong.paddleL;
    } else if ((ball.pos.x + ball.radius) >= (field.length - field.offset - pong.paddleR.length)) {
      collision = this.checkCollision(ball, pong.paddleR);
      paddle = pong.paddleR;
    }
    if (collision === true) {
      this.getBounce(ball, field, paddle);
    }
  }

  resetBall(field: Field, ball: Ball) {
    ball.pos.x = field.length / 2;
    ball.pos.y = field.width / 2;
    ball.speed = field.length / 500;
    ball.vel = this.initBallVelocity(field, ball.vel.x > 0 ? true : false);
  }

  checkCollision(ball: Ball, paddle: Paddle): boolean {
    const padTop = paddle.tlcPos.y;
    const padBottom = paddle.tlcPos.y + paddle.width;
    const padLeft = paddle.tlcPos.x;
    const padRight = paddle.tlcPos.x + paddle.length;
    const ballTop = ball.pos.y - ball.radius;
    const ballBottom = ball.pos.y + ball.radius;
    const ballLeft = ball.pos.x - ball.radius;
    const ballRight = ball.pos.x + ball.radius;

    return (ballRight > padLeft && ballTop < padBottom && ballLeft < padRight &&
      ballBottom > padTop);
  }

  getBounce(ball: Ball, field: Field, paddle: Paddle): void {
    const collidePoint = (ball.pos.y - (paddle.tlcPos.y + paddle.width / 2)) / (paddle.width / 2);
    const bounceAngle = collidePoint * (Math.PI / 4);
    const direction = (ball.pos.x < field.length / 2) ? 1 : -1;
    ball.vel.x = direction * ball.speed * Math.cos(bounceAngle);
    ball.vel.y = ball.speed * Math.sin(bounceAngle);
    ball.speed *= 1.1;

  }

  getScore(field: Field, ball: Ball): Point {
    if ((ball.pos.x - ball.radius) < (0 - field.offset)) {
      this.resetBall(field, ball);
      return Point.RIGHT;
    } else if ((ball.pos.x + ball.radius) > (field.length + field.offset)) {
      this.resetBall(field, ball);
      return Point.LEFT;
    }
    return Point.NONE;
  }

  movePaddle(field: Field, paddle: Paddle, input: string): void {
    if (input === 'UP') {
      paddle.tlcPos.y -= field.width / 7;
    } else if (input === 'DOWN') {
      paddle.tlcPos.y += field.width / 7;
    }
    if (paddle.tlcPos.y + paddle.width >= field.width - field.offset) {
      paddle.tlcPos.y = field.width - field.offset  - paddle.width;
    } else if (paddle.tlcPos.y <= 0 + field.offset) {
      paddle.tlcPos.y = 0 + field.offset;
    }
  }
}
