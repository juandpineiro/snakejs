$(document).ready(function() {

  // Define vars
  var canvas = $('#canvas')[0];
  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var cw = 15;
  var d = 'right';
  var food;
  var score;
  var snakeColor = '#00ff00';
  var foodColor = '#ff0000';
  var speed = 150;

  // Snake array
  var snakeArray;

  // Initializer
  function init() {
    d = 'right';
    create_snake();
    create_food();
    score = 0;

    if (typeof game_loop != 'undefined') {
      clearInterval(game_loop);
    }
    game_loop = setInterval(paint, speed);
  }

  function create_snake() {
    var length = 5;
    snakeArray = [];

    for (var i = length - 1; i >= 0; i--) {
      snakeArray.push({x: i, y: 0});
    }
  }

  function create_food() {
    food = {
      x: Math.round(Math.random()*(w - cw)/cw),
      y: Math.round(Math.random()*(h - cw)/cw)
    };
  }

  function paint() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0, 0, w, h);

    var nx = snakeArray[0].x;
    var ny = snakeArray[0].y;

    switch (d) {
      case 'right':
        nx++;
        break;
      case 'left':
        nx--;
        break;
      case 'up':
        ny--;
        break;
      case 'down':
        ny++;
        break;
      default:
        break;
    }

    // Game Over - Collide code
    if (nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || checkCollision(nx, ny, snakeArray)) {
      // init();
      // Insert final score
      $('#final_score').html(score);
      $('#overlay').fadeIn(300);
      return;
    }

    if (nx == food.x && ny == food.y) {
      var tail = {
        x: nx,
        y: ny
      }
      score++;
      speed -= 5;
      create_food();
    } else {
      var tail = snakeArray.pop();
      tail.x = nx;
      tail.y = ny;
    }

    snakeArray.unshift(tail);

    for (var i = 0; i < snakeArray.length; i++) {
      var c = snakeArray[i];
      paintCell(c.x, c.y, snakeColor);
    }

    paintCell(food.x, food.y, foodColor);

    checkScore(score);

    // Display current score
    $('#score').html('Your Score: ' + score);
  }

  function paintCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*cw, y*cw, cw, cw);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(x*cw, y*cw, cw, cw);
  }

  function checkCollision(x, y, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i.x == x && array[i.y == y]]) {
        return true;
      }
    }
    return false;
  }

  function checkScore(score) {
    if (localStorage.getItem('highScore') == null) {
      localStorage.setItem('highScore', score);
    } else {
      if (score > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', score);
      }
    }

    // Display high score
    $('#high_score').html('High: ' + localStorage.getItem('highScore'));
  }

  // Keyboard Controller
  $(document).keydown(function(e){
    var key = e.which;

    // Left
    if ((key == '37' || key == '65') && d != 'right') {
      d = 'left';
    } else if ((key == '38' || key == '87') && d != 'down') {
      d = 'up';
    } else if ((key == '39' || key == '68') && d != 'left') {
      d = 'right';
    } else if ((key == '40' || key == '83') && d != 'up') {
      d = 'down';
    }
  });

  init();

});

function resetScore() {
  localStorage.highScore = 0;
  // Display high score
  var highScoreDiv = document.getElementById('high_score');
  highScoreDiv.innerHTML = 'High: 0';
}
