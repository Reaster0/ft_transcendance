import { Injectable } from '@nestjs/common';
import { Point, Ball, Paddle, Field, Pong } from './interfaces/pong.interface';

@Injectable()
export class PongService {
	constructor() {}

	initPong() : Pong {
		let field = this.initField();
		let ball = this.initBall(field);
		let paddleR = this.initPaddle(field, false);
		let paddleL = this.initPaddle(field,true);
		let pong: Pong = {
			field: field,
			ball: ball,
			paddleR: paddleR,
			paddleL: paddleL,
		}
		return pong;
	}

	initField() : Field {
		let field: Field = {
			width: 1,
			length: 1,
			offset: 1/80,
		}
		return field;		
	}

	initBall(field: Field) : Ball {
		let ball: Ball = {
			pos: { x: field.length/2, y : field.length/2 },
			vel: { x: 5, y: 5 },
			speed: 5,
			radius: field.length/60
		}
		return ball;	
	}

	initPaddle(field: Field, left: boolean) : Paddle {
		const yValue = (left === true) ? (0 + field.length/50) : (field.length - field.length/50);
		let paddle: Paddle = {
			blcPos: { x: field.width/2, y: yValue },
			width: field.width/7,
			length: field.length/50,
		}
		return paddle;
	}

	calcBallPos(pong: Pong) {
		let ball = pong.ball;
		let field = pong.field;

		ball.pos.x = ball.pos.x + ball.vel.x;
		ball.pos.y = ball.pos.y + ball.vel.y;
		if (ball.pos.y + ball.radius < 0 + field.offset) {
			ball.pos.y = 0 + field.offset;
			ball.vel.y *= -1;
		} else if (ball.pos.y + ball.radius > field.width - field.offset) {
			ball.pos.y = field.width - field.offset;
			ball.vel.y *= -1;
		}
		let collision = false;
		let paddle = undefined;
		if (ball.pos.x < field.length/4) { // can affinate this 
			collision = this.checkCollision(ball, pong.paddleL);
			paddle = pong.paddleL;
		} else if (ball.pos.x > ((field.length/4) * 3)) { // can affinate this
			collision = this.checkCollision(ball, pong.paddleR);
			paddle = pong.paddleR;
		}
		if (collision === true) {
			this.getBounce(ball, field, paddle);
		}
	}

	resetBall(field: Field, ball: Ball) {
		ball.pos.x = field.length/2;
		ball.pos.y = field.width/2;
		ball.speed = 5;
		ball.vel.x *= -1;
	}

	checkCollision(ball: Ball, paddle: Paddle) : boolean {
		const padTop = paddle.blcPos.y + paddle.width;
		const padBottom = paddle.blcPos.y;
		const padLeft = paddle.blcPos.x;
		const padRight =  paddle.blcPos.x + paddle.length;
		const ballTop = ball.pos.y + ball.radius;
		const ballBottom = ball.pos.y - ball.radius;
		const ballLeft = ball.pos.x - ball.radius;
		const ballRight = ball.pos.x + ball.radius;

		return (ballRight > padLeft && ballTop < padBottom
			&& ballLeft < padRight && ballBottom > padTop);
	}
	
	getBounce(ball: Ball, field: Field, paddle: Paddle) : void {
		let collidePoint = (ball.pos.y - (paddle.blcPos.y + paddle.width/2)) / paddle.width/2;
		let bounceAngle = collidePoint * Math.PI/4;
		let direction = (ball.pos.x < field.length/2) ? 1 : -1;
		ball.vel.x = direction * ball.speed * Math.cos(bounceAngle);
		ball.vel.y = ball.speed * Math.sin(bounceAngle);
		ball.speed += 0.1;
	}

	getScore(field: Field, ball: Ball): Point {
		if (ball.pos.x - ball.radius < 0) {
			this.resetBall(field, ball);
			return Point.RIGHT;
		} else if (ball.pos.x + ball.radius > field.length) {
			this.resetBall(field, ball);
			return Point.LEFT;
		}
		return Point.NONE;
	}

	movePaddle(field: Field, paddle: Paddle, input: string) : void {
		if (input === 'UP') {
			paddle.blcPos.y += field.width/7;
		} else if (input === 'DOWN') {
			paddle.blcPos.y -= field.width/7;
		}
		if (paddle.blcPos.y + paddle.width > field.width + field.offset) {
			paddle.blcPos.y = field.width - field.offset;
		} else if (paddle.blcPos.y < 0 + field.offset) {
			paddle.blcPos.y = 0 + field.offset;
		}
	}
}
