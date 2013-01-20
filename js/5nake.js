var canvasElement = document.getElementById('canvas');

var canvasContext = canvasElement.getContext('2d');

var currentDirection = 'right';
var snake = [{x: 0, y: 0}, {x: 5, y: 0}, {x: 10, y: 0}, {x: 15, y: 0}];
var dot = {x: Math.random() * 5 * Math.floor(canvasElement.width / 5), y: Math.random() * 5 * Math.floor(canvasElement.height / 5)}

var drawSnake = function drawSnake() {
	for(var i = 0; i < snake.length; i++)
	{
		canvasContext.fillRect(snake[i].x,snake[i].y,5,5);
	}
};

var drawDot = function drawDot () {
	canvasContext.fillRect(snake[i].x,snake[i].y,5,5);
}



var clearCanvas = function clearCanvas () {
	canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
};

var timer = function timer () {
	window.setTimeout(function () {
		clearCanvas();
	 	drawSnake();
	 	var newSegment = { x: snake[snake.length - 1].x, y:snake[snake.length - 1].y};
		switch(currentDirection) {
			case 'right':
				newSegment.x += 5;
				break;
			case 'left':
				newSegment.x -= 5;
				break;
			case 'down':
				newSegment.y += 5;
				break;
			case 'up':
				newSegment.y -= 5;
				break;
			default:
				throw "What the hell, this shouldn't happen!??"
		}

		if(newSegment.x < 0) { newSegment.x = canvasElement.width; }
		if(newSegment.y < 0) { newSegment.y = canvasElement.height; }
		if(newSegment.x > canvasElement.width) { newSegment.x = 0; }
		if(newSegment.y > canvasElement.height) { newSegment.y = 0; }

		snake.push(newSegment);
		snake.splice(0, 1);

		timer();
	}, 100);
};

$(document).keydown(function (event) {
	switch(event.keyCode) {
		case 37:
			currentDirection = 'left';
			break;
		case 38:
			currentDirection = 'up';
			break;
		case 39:
			currentDirection = 'right';
			break;
		case 40:
			currentDirection = 'down';
			break;
	}
})

timer();