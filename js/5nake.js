angular.module('mongolab', ['ngResource']).
    factory('HighScores', function($resource) {
      var HighScores = $resource(
      	'https://api.mongolab.com/api/1/databases/snake-high-scores/collections/high-scores/',
        { apiKey: '50fc038de4b082da891d7e25' },
        { update: { method: 'PUT' } }
      );
 
      return HighScores;
    });

angular.module('5nake', ['mongolab']);

function HighScoreController ($rootScope, HighScores) {
	$rootScope.highScores = HighScores.query();
}

function GameOverController ($scope, $rootScope, HighScores) {
	$scope.save = function () {
		var score = {name: $scope.name, score: $rootScope.score};
		$rootScope.highScores.push(score);
		HighScores.save(score);
		$rootScope.$apply();
		$('#failModal').modal('hide');
	};
}

function SnakeController ($scope, $rootScope) {
	var interval;
	$scope.started = false;
	$scope.start = function () {
		$scope.started = true;
		newDirection = 'right';
		snake = [{x: 0, y: 0}, {x: snakeWidth, y: 0}, {x: snakeWidth*2, y: 0}, {x: snakeWidth*3, y: 0}];
		if(interval) {
			clearInterval(interval);
		}
		$rootScope.score = 0;
		interval = window.setInterval(function () {
			currentDirection = newDirection;
			clearCanvas();
			drawSnake();
			drawDot();
			var newSegment = { x: snake[snake.length - 1].x, y:snake[snake.length - 1].y};
			switch(currentDirection) {
				case 'right':
					newSegment.x += snakeWidth;
					break;
				case 'left':
					newSegment.x -= snakeWidth;
					break;
				case 'down':
					newSegment.y += snakeWidth;
					break;
				case 'up':
					newSegment.y -= snakeWidth;
					break;
				default:
					throw "What the hell, this shouldn't happen!??";
			}

			if(newSegment.x < 0) { newSegment.x = canvasElement.width - snakeWidth; }
			if(newSegment.y < 0) { newSegment.y = canvasElement.height - snakeWidth; }
			if(newSegment.x > canvasElement.width - snakeWidth) { newSegment.x = 0; }
			if(newSegment.y > canvasElement.height - snakeWidth) { newSegment.y = 0; }

			if(newSegment.x === dot.x && newSegment.y === dot.y) {
				dot = randomiseDot();
				$rootScope.score += 20;
				$rootScope.$apply();
			}
			else {
				snake.splice(0, 1);
			}

			if(_.any(snake, function (segment) { return segment.x === newSegment.x && segment.y === newSegment.y; })) {
				window.clearInterval(interval);
				$scope.started = false;
				$('#failModal').modal({keyboard: false});
				$scope.$apply();
			}
			else {
				snake.push(newSegment);
			}
		}, 50);
	}
}

// Get the image:
var appleImage = new Image();
appleImage.src = 'img/apple_20x20.png';

var snakeWidth = 20;
var canvasWidth = $('.span8').width();
var canvasHeight = Math.floor(canvasWidth / (1.618*snakeWidth)) * snakeWidth;

// Embiggen the canvas:
$('#canvas').attr('width', canvasWidth + 'px');
$('#canvas').attr('height', canvasHeight + 'px');

var canvasElement = document.getElementById('canvas');
var canvasContext = canvasElement.getContext('2d');

var currentDirection = 'right';
var snake = [{x: 0, y: 0}, {x: snakeWidth, y: 0}, {x: snakeWidth*2, y: 0}, {x: snakeWidth*3, y: 0}];

var randomiseDot = function () {
	return {
		x: Math.floor(Math.random() * canvasElement.width / snakeWidth) * snakeWidth,
		y: Math.floor(Math.random() * canvasElement.height / snakeWidth) * snakeWidth
	};
};
var dot = randomiseDot();

var drawSnake = function drawSnake() {
	canvasContext.fillStyle   = '#00f';
	for(var i = 0; i < snake.length; i++) {
		canvasContext.fillRect(snake[i].x,snake[i].y,snakeWidth,snakeWidth);
	}
};

var drawDot = function drawDot () {
	canvasContext.drawImage(appleImage, dot.x,dot.y,snakeWidth,snakeWidth);
};



var clearCanvas = function clearCanvas () {
	canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
};

var newDirection = 'right';

$(document).keydown(function (event) {
	switch(event.keyCode) {
		case 37:
			if(currentDirection !== 'right') {
				newDirection = 'left';
			}
			event.preventDefault();
			break;
		case 38:
			if(currentDirection !== 'down') {
				newDirection = 'up';
			}
			event.preventDefault();
			break;
		case 39:
			if(currentDirection !== 'left') {
				newDirection = 'right';
			}
			event.preventDefault();
			break;
		case 40:
			if(currentDirection !== 'up') {
				newDirection = 'down';
			}
			event.preventDefault();
			break;
	}
});
