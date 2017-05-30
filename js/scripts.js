var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var cellSize = 100;

var cellMargin = 10;

var crossThickness = 20;
var circleThickness = 20;

var crossPad = 20;
var circlePad = 20;

var crossGradient = context.createLinearGradient(0, 0, 0, canvas.height);
crossGradient.addColorStop(0, "#E2A677");
crossGradient.addColorStop(1, "#C97969");

var circleGradient = context.createLinearGradient(0, 0, 0, canvas.height);
circleGradient.addColorStop(0, "#964F5B");
circleGradient.addColorStop(1, "#632323");

var cellColor = '#fff';

var gridLineColor = context.createLinearGradient(0, 0, canvas.width, canvas.height);
gridLineColor.addColorStop(0, "#e0e0e0");
gridLineColor.addColorStop(1, "#c0c0c0");

var cells = [];

var gameOver = false;

// Tracks which player is currently acting
var currentPlayer;

// CREATE PLAYER //

function Player(isHuman, isPlayerOne) {
  this.isHuman = isHuman;
  this.isPlayerOne = isPlayerOne;
}

var playerOne;
var playerTwo;

// CREATE CELL

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.hasCross = false;
  this.hasCircle = false;
  this.isEmpty = function() {
    return !this.hasCross && !this.hasCircle;
  };
  this.drawCell = function(context)  {
    drawCell(this.x, this.y);
    if(this.hasCross){
      drawCross(this.x,this.y);
    } else if (this.hasCircle) {
      drawCircle(this.x,this.y);
    }
  };
}

// CREATE BOARD //

function generateBoard() {
  cells = [];
  for(var x = 0; x < 3; x++) {
    var row = [];
    for(var y = 0; y < 3; y++) {
      row.push(new Cell(x, y));
    }
    cells.push(row);
  }
}

function drawGridLines()
{
  var halfMargin = cellMargin / 2;
  var margin = cellMargin / 2;

  context.beginPath();
  context.moveTo(cellSize + halfMargin, 0 + margin);
  context.lineTo(cellSize + halfMargin, canvas.height - margin);

  context.moveTo(cellSize * 2 + cellMargin + halfMargin, 0 + margin);
  context.lineTo(cellSize * 2 + cellMargin + halfMargin, canvas.height - margin);

  context.moveTo(0 + margin, cellSize + halfMargin);
  context.lineTo(canvas.width - margin, cellSize + halfMargin);

  context.moveTo(0 + margin, cellSize * 2 + cellMargin + halfMargin);
  context.lineTo(canvas.width - margin, cellSize * 2 + cellMargin + halfMargin);

  context.lineWidth = cellMargin;
  context.lineCap = 'round';
  context.strokeStyle = gridLineColor;

  context.stroke();
}

function drawCells() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGridLines();
  for(var x = 0; x < 3; x++) {
    for(var y = 0; y < 3; y++) {
      cells[x][y].drawCell();
    }
  }
}

function drawCell(x, y) {
  context.fillStyle = cellColor;
  var marginCell = cellSize + cellMargin;
  context.fillRect(x * marginCell, y * marginCell, cellSize, cellSize);
}

// CREATE X FUNCTION
function drawCross(x, y) {
  var marginCell = cellSize + cellMargin;
  x *= marginCell;
  y *= marginCell;

  context.save();
  context.rect( x, y, cellSize, cellSize );
  context.clip();

  var xMax = x + cellSize;
  var yMax = y + cellSize;

  context.beginPath();
  context.moveTo(x + crossPad, y + crossPad);
  context.lineTo( xMax - crossPad, yMax - crossPad );
  context.stroke();
  context.moveTo( x + crossPad, yMax - crossPad );
  context.lineTo( xMax - crossPad, y + crossPad );

  context.lineWidth = crossThickness;
  context.strokeStyle = crossGradient;
  context.lineCap = 'round';
  context.stroke();
  context.restore();
}

// CREATE O FUNCTION
function drawCircle(x, y) {
  var marginCell = cellSize + cellMargin;
  x *= marginCell;
  y *= marginCell;

  context.save();
  context.rect( x, y, cellSize, cellSize );
  context.clip();

  var cellHalfSize = cellSize / 2;
  context.beginPath();
  context.arc( x + cellHalfSize,
    y + cellHalfSize,
    cellHalfSize - circlePad, 0, 2 * Math.PI);

  context.lineWidth = circleThickness;
  context.strokeStyle = circleGradient;
  context.stroke();
  context.restore();
}

// START GAME

function startGame() {
  gameOver = false;

  playerOne = new Player(true, true);
  playerTwo = new Player(true, false);

  currentPlayer = playerOne;

  generateBoard();
  drawCells();
}

// TEST WIN CONDITIONS

function testWinConditions(){
  if(testWinConditionsVertical() === true||
     testWinConditionsHorizontal() === true ||
     testWinConditionsDiagonal() === true) {
    if(currentPlayer.isPlayerOne) {
      alert("X WINS!");
      gameOver = true;
    }
    else {
      alert("CIRCLE WINS!");
      gameOver = true;
      }
    }
    else if(testNoWinner())
    {
      alert("NOBODY WINS");
      gameOver = true;
    }
  }

function testWinConditionsHorizontal() {
  for(var y = 0; y < 3; y++) {
    if( cells[0][y].hasCross &&
        cells[1][y].hasCross &&
        cells[2][y].hasCross ) {

          return true;
    } else if( cells[0][y].hasCircle &&
               cells[1][y].hasCircle &&
               cells[2][y].hasCircle ) {
        return true;
    }
  }
  return false;
}

function testWinConditionsVertical() {
  for(var x = 0; x < 3; x++) {
    if( cells[x][0].hasCross &&
        cells[x][1].hasCross &&
        cells[x][2].hasCross ) {
          return true;
    } else if( cells[x][0].hasCircle &&
        cells[x][1].hasCircle &&
        cells[x][2].hasCircle ) {
        return true;
    }
  }
  return false;
}

function testWinConditionsDiagonal() {
  if( cells[1][1].hasCross ) {
    if( cells[0][0].hasCross &&
        cells[2][2].hasCross ) {
          return true;
    } else if( cells[2][0].hasCross &&
               cells[0][2].hasCross ) {
        return true;
    }
  }
    // Now check for Circle
  if( cells[1][1].hasCircle ) {
    if( cells[0][0].hasCircle &&
        cells[2][2].hasCircle ) {
          return true;
    } else if( cells[2][0].hasCircle &&
               cells[0][2].hasCircle ) {
        return true;
    }
  }
  return false;
}

function testNoWinner() {
  for(var x = 0; x < 3; x++) {
    for(var y = 0; y < 3; y++) {
      if(cells[x][y].isEmpty()) {
        return false;
      }
    }
  }
  return true;
}

function startNextTurn() {
  drawCells();
  if(currentPlayer.isPlayerOne) {
    currentPlayer = playerTwo;
  } else {
    currentPlayer = playerOne;
  }
}

function chooseCell(x,y)
{
  var cell = cells[x][y];
  if(cell.isEmpty()) {
    if(currentPlayer.isPlayerOne) {
      cell.hasCross = true;
    } else {
      cell.hasCircle = true;
    }
    testWinConditions();
    startNextTurn();
  }
}

canvas.addEventListener("mouseup", mouseUp, false);

function mouseUp(e) {
    if (gameOver === true) {
      startGame();
      return;
    }
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
    getCellAtPagePosition(mouseX, mouseY);
}

function getCellAtPagePosition(mouseX,mouseY) {
  var marginCell = cellSize + cellMargin;
  var x = parseInt(mouseX / marginCell);
  var y = parseInt(mouseY / marginCell);

  chooseCell(x, y);
}

// CALL FUNCTION TO START GAME
startGame();
