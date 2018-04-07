let canvas;
let canvasContext;
let ballX = 100;
let ballSpeedX = 5
let ballY = 100;
let ballSpeedY = 7;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICKS_COLS = 10;
const BRICK_GAP = 2;
const BRICK_ROWS = 14;
let brickGrid = new Array(BRICKS_COLS * BRICK_ROWS);
let bricksLeft = 0;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
paddleX = 400;


let mouseX = 0;
let mouseY = 0;


function brickReset() {
	bricksLeft = 0;
	for (let j=0; j<3*BRICKS_COLS;j++){
		brickGrid[j] = false;
	}
	for(let j = 3*BRICKS_COLS; j < BRICKS_COLS * BRICK_ROWS; j++){
		brickGrid[j] = true;
		bricksLeft++;
		//end od if statement
	}//end of for loop
}//end of brickReset function

function updateMousePosition(evt) {

	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	paddleX = mouseX -(PADDLE_WIDTH/2);



}

window.onload = function() {
	canvas = document.getElementById('game-canvas');
	canvasContext = canvas.getContext('2d');

	let framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	canvas.addEventListener('mousemove', updateMousePosition);
	brickReset();
	ballReset();
}

function ballReset() {
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}


function ballMove() {
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if (ballX > canvas.width && ballSpeedX > 0.0) {
		ballSpeedX = -ballSpeedX;
	}else if (ballX < 0 && ballSpeedX < 0.0) {
		ballSpeedX = -ballSpeedX;
	}
//drawColorRect(BRICK_W*2,0, BRICK_W-2,BRICK_H, 'blue');
	if (ballY < 0 && ballSpeedY < 0.0) {
		ballSpeedY = -ballSpeedY
	}else if (ballY > canvas.height) {
		ballReset();
		brickReset();
	}
}

function isBrickAtColRow(col,row) {
	if(col >= 0 && col < BRICKS_COLS && row >= 0 && row < BRICK_ROWS) {
		let brickIndexUnderCoord = rowColToArrayIndex(col,row);
		return brickGrid[brickIndexUnderCoord];
	} else {
		return false;
	}
}

function ballBrickHandling() {
	let ballBrickCol = Math.floor(ballX / BRICK_W);
	let ballBrickRow = Math.floor(ballY / BRICK_H);

	 let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow );



	if (ballBrickCol >= 0 && ballBrickCol < BRICKS_COLS &&
		 ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

		if(isBrickAtColRow(ballBrickCol, ballBrickRow)) {
			brickGrid[brickIndexUnderBall] = false;
			bricksLeft--;
			console.log(bricksLeft);

			let prevBallX = ballX - ballSpeedX;
			let prevBallY = ballY - ballSpeedY;
			let prevBrickCol = Math.floor(prevBallX / BRICK_W);
			let prevBrickRow = Math.floor(prevBallY / BRICK_H);


			let bothTestsFaild = true;

			if(prevBrickCol != ballBrickCol) {
					if(isBrickAtColRow(prevBrickCol,prevBrickRow) == false) {
							ballSpeedX = -ballSpeedX;
							bothTestsFaild = false;
					}

			}
			if(prevBrickRow != ballBrickRow) {
					if(isBrickAtColRow(prevBrickCol,prevBrickRow) == false) {
						ballSpeedY = -ballSpeedY;
						bothTestsFaild = false;
				}
			}

			if(bothTestsFaild) {
				ballSpeedX = -ballSpeedX;
				ballSpeedY = -ballSpeedY;
			}

		}//end of brick found
	}
}

function ballPaddleHandling() {
	let paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;
	let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
	let paddleLeftEdgeX = paddleX;
	let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
	if(ballY > paddleTopEdgeY && // below the top of the paddle
		 ballY < paddleBottomEdgeY && // above bottom of the paddle
		 ballX > paddleLeftEdgeX && // right of the left side of paddle
		 ballX < paddleRightEdgeX) { //left of the right side of paddle
			 ballSpeedY = -ballSpeedY;

			 let centerOfThePaddleX = paddleX + PADDLE_WIDTH/2;
			 let ballDistFromPaddleCenterX = ballX - centerOfThePaddleX;
			 ballSpeedX = ballDistFromPaddleCenterX *0.2;

			 if(bricksLeft == 0) {
				 brickReset();
			 }//out of bricks
		 }// ball center inside paddle
	 }//end of ballPaddleHandling


function moveAll() {
	 ballMove();
	 ballBrickHandling();
	 ballPaddleHandling();
}




function rowColToArrayIndex(col, row) {
	return col + BRICKS_COLS * row;
}


function drawBricks() {

	for( let eachRow = 0; eachRow < BRICK_ROWS; eachRow++){
		for(let eachCol = 0; eachCol<BRICKS_COLS; eachCol++){

			let arrayIndex = rowColToArrayIndex(eachCol, eachRow );

			if (brickGrid[arrayIndex]){
			drawColorRect(BRICK_W*eachCol,BRICK_H*eachRow, BRICK_W-BRICK_GAP,BRICK_H- BRICK_GAP, 'blue');
		}//end of if statement
		}//end of for loop
	}

}//end of drawBricks function

function drawAll() {
	// draw canvas
	drawColorRect(0,0, canvas.width,canvas.height, '#000');

	// draw ball
	drawColorCircle (ballX,ballY, 10, '#fff');

	// draw paddle
	drawColorRect(paddleX,canvas.height-PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH,PADDLE_THICKNESS, '#fff');

	drawBricks();
}

function drawColorCircle (centerX,centerY, radius, fillColor) {

	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();

};

function drawColorRect (topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {

	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth, boxHeight);

}

function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX,textY);

}

function updateAll() {

	moveAll();
	drawAll();
}
