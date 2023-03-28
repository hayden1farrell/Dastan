class Vec2 {
  constructor(x, y){
    this.x = x;
    this.y = y;

    this.equals = function(other) {
      return other.x == this.x && other.y == this.y;
   };
  }

}
// Add the canvas to the page
const canvas = document.getElementById("Canvas");
// Define the size of each square in pixels
const squareSize = 100;

// Create the canvas element and set its size
//const canvas = document.createElement("canvas");
canvas.width = squareSize * 6;
canvas.height = squareSize * 6;

// Get the canvas context
const ctx = canvas.getContext("2d");

let scores = [100,100];
let currentPlayer = 1;
let selectedMove = "";
let moveIndex = 0;

var p1moves = ["Ryott", "Chowkidar", "Cuirassier", "Faujdar", "Jazair"];
var p2moves = ["Ryott", "Chowkidar", "Cuirassier", "Faujdar", "Jazair"];

canvas.addEventListener('mousedown', function(e) {
  cursorDown(canvas, e)
})

window.addEventListener('keydown', function(e) {
  keypressed(canvas, e)
})



class Board{
  constructor(rows, cols, mainColour, alternativeColour, whiteKotlaColour, blackKotlaColour, activeColour){
    this.rows = rows;
    this.cols = cols;
    this.colours = [mainColour, alternativeColour, whiteKotlaColour, blackKotlaColour, activeColour]
    this.piecesarr = [];
    this.squareSize = squareSize;
    this.kotlas = [new Vec2(2, 0), new Vec2(3, 5)];
    this.selectedSquare = new Vec2(-1, -1);
    this.potentailSquares = [];
  }

  reset(){
    this.selectedSquare = new Vec2(-1,-1);
    this.SetUp();
  }

  SetUp(){
    this.setUpPawns();
    this.setUpMizras();
  }

  controlsKotla(player){
    let kotlaPos = this.kotlas[(1-player)/2];
    let peice = board.getPiece(kotlaPos);

    if(peice == null){
      return false;
    }  

    return peice.team == player;
  }

  controlsEnemyKotla(player){
    let kotlaPos = this.kotlas[(player+1)/2];
    let peice = board.getPiece(kotlaPos);

    if(peice == null){
      return false;
    }  

    return peice.team == player;
  }


  setUpPawns(){
    // null init the board
    for(let x = 0; x < 6; x++){
      for(let y = 0; y < 6; y++){
        this.setSquare(x,y,null);
      }
    }

    // Set up the white pawns
    const whitePawnImage = new Image();
    whitePawnImage.src = "images/pieceWhite.png";

    for(let xOffset = 1; xOffset <= 4; xOffset++){
      ctx.drawImage(whitePawnImage, squareSize, squareSize, squareSize, squareSize);
      this.setSquare(xOffset, 1, new Piece(whitePawnImage, new Vec2(xOffset, 1), squareSize, 1, "p"));
    }

    // Set up the black pawns
    const blackPawnImage = new Image();
    blackPawnImage.src = "images/pieceBlack.png";

    for(let xOffset = 1; xOffset <= 4; xOffset++){
      ctx.drawImage(blackPawnImage, squareSize, squareSize, squareSize, squareSize);
      this.setSquare(xOffset, 4, new Piece(blackPawnImage, new Vec2(xOffset, 4), squareSize, -1, "p"));
    }

  }

  setUpMizras(){
    // set up the white
    const whiteMizraImage = new Image();
    whiteMizraImage.src = "images/mirzaWhite.png";
    ctx.drawImage(whiteMizraImage, squareSize, squareSize, squareSize, squareSize);
    this.setSquare(2, 0, new Piece(whiteMizraImage, new Vec2(2, 0), squareSize, 1, "m"));

  
    const blackMizraImage = new Image();
    blackMizraImage.src = "images/mirzaBlack.png";
    ctx.drawImage(blackMizraImage, squareSize, squareSize, squareSize, squareSize);
    this.setSquare(3, 5, new Piece(blackMizraImage, new Vec2(3,5), squareSize, -1, "m"));
  }

  setSquare(x, y, value){
    this.piecesarr[(x) + (y * this.cols)] = value;
  }

  containsPiece(pos){
    return this.piecesarr[(pos.x) + (pos.y * this.cols)] != null;
  }

  draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBoard();
    this.drawPieces();
  }


  TryMovePiece(square){
    // if a piece has been selected
    if(!this.selectedSquare.equals(new Vec2(-1, -1))){
      this.Move(square)
      this.selectedSquare = new Vec2(-1, -1);
    }else{
      if(this.containsPiece(square)){
        this.selectedSquare = square;
      }
    }
  }

  Move(posistion, selectedPeice){
    let piece = this.getPiece(this.selectedSquare);
    if(piece == null) return;
    // handle all logic which may happen when a piece moves
    let valid = false;
    
    valid = piece.CheckMove(posistion);

    if(piece.team != currentPlayer){
      valid = false;
    }
    //reset the peice posistion
    piece.move(this.selectedSquare);

    let movingSqaure = this.getPiece(posistion);
    if(movingSqaure != null && movingSqaure.team == piece.team){
      valid = false;
    }
    let gameOver = false;
    if(valid){
      // maps 1 to 0 and -1 to 1 for indexing the players score
      let currentPlayerIndex = (1-currentPlayer)/2;
      if(this.containsPiece(posistion)){
        if(this.getPiece(posistion).type == "m"){
          // you have got the mirza
          gameOver = true;
          scores[currentPlayerIndex] += 5;
        }else{
          scores[currentPlayerIndex] += 1;
        }
        this.movePiece(posistion, this.selectedSquare, piece);

      }else{
        this.movePiece(posistion, this.selectedSquare, piece);
      }
      scores[currentPlayerIndex] -= mapMoveIndex(moveIndex);

      //check if in control of mirza
      if(this.controlsKotla(currentPlayer)){
        scores[currentPlayerIndex] += 5;
      }
      if(this.controlsEnemyKotla(currentPlayer)){
        scores[currentPlayerIndex] += 1;
      }

      // check if mirza in enemy kotla
      if(piece.type == "m" && piece.pos.equals(this.GetEnemyMirza())){
        gameOver = true;
      }

      if(gameOver){
        GameOver();
      }

      // calulate the other players score
      currentPlayer *= -1;
      currentPlayerIndex = (1-currentPlayer)/2;
      if(this.controlsKotla(currentPlayer)){
        scores[currentPlayerIndex] += 5;
      }
      if(this.controlsEnemyKotla(currentPlayer)){
        scores[currentPlayerIndex] += 1;
      }


    }

    this.selectedSquare = new Vec2(-1, -1);

    // Update score UI
    document.getElementsByClassName("pointsText")[0].innerHTML = scores[0];
    document.getElementsByClassName("pointsText")[1].innerHTML = scores[1];
  }

  movePiece(newPos, oldPos, piece){
    this.setSquare(oldPos.x, oldPos.y, null);
    piece.move(newPos);
    this.setSquare(newPos.x, newPos.y, piece);

  }

  GetEnemyMirza(){
    return this.kotlas[(currentPlayer+1)/2];
  }

  getPiece(posistion){
    return this.piecesarr[(posistion.x) + (posistion.y * this.cols)];
  }

  drawBoard() {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        // Calculate the x and y coordinates of the current square
        const x = col * squareSize;
        const y = row * squareSize;

        // if the current square is selected
        if(col == this.selectedSquare.x && row == this.selectedSquare.y){
          ctx.fillStyle = this.colours[4];
          // the current sqaure is the white kotla
        }else if(col == this.kotlas[0].x && row == this.kotlas[0].y){
          ctx.fillStyle = this.colours[2];
          // if the current sqaure is the black kotal
        }else if(col == this.kotlas[1].x && row == this.kotlas[1].y){
          ctx.fillStyle = this.colours[3];
        }else{
          ctx.fillStyle = this.colours[(row + col) % 2];
        }
        // Draw the square
        ctx.fillRect(x, y, squareSize, squareSize);
        // resets the colour 
        ctx.fillStyle = "#000000";
      }
    }
  }

  drawPieces() {
    this.piecesarr.forEach(p => {
      if(p != null){
        ctx.drawImage(p.image, p.pos.x * squareSize, p.pos.y * squareSize, p.size, p.size);
      }
    });
  }
}

class Piece {
  constructor(image, drawPos, size, team, type){
    this.image = image;
    this.pos = drawPos;
    this.size = size;
    this.team = team;
    this.type = type;
  }

  move(pos){
    this.pos = pos;
  }

  take(){
    var index = piecesarr.indexOf(this);
    if (index > -1) {
      piecesarr.splice(index, 1);
    }
  }

  CheckMove(targetSqaure){
    var moveCheck = {
      "Ryott" :       this.ryottCheck,
      "Chowkidar" :   this.ChowkidarCheck,
      "Faujdar" :     this.FaujdarCheck,
      "Cuirassier" :  this.CuirassierCheck,
      "Jazair" :      this.JazairCheck,
      "" : this.Blank,
    };

    return moveCheck[selectedMove](targetSqaure, this);
  }

  Blank(targetSqaure, self){
    console.log("No move selected please select a move");
  }

  JazairCheck(targetSqaure, self){
    let temp = self.pos;
    temp.x += 2;
    if(temp.equals(targetSqaure)) return true;
    temp.x -= 4;
    if(temp.equals(targetSqaure)) return true;
    temp.x += 2;

    temp.y += self.team * 2;
    if(temp.equals(targetSqaure)) return true;
    temp.x += 2;
    if(temp.equals(targetSqaure)) return true;
    temp.x -= 4;
    if(temp.equals(targetSqaure)) return true;

    temp.x += 3;
    temp.y -= self.team * 3;
    if(temp.equals(targetSqaure)) return true;
    temp.x -= 2;
    if(temp.equals(targetSqaure)) return true;
  }

  CuirassierCheck(targetSqaure, self){
    let temp = self.pos;
    temp.y += self.team;
    if(temp.equals(targetSqaure)) return true;
    temp.y += self.team;
    if(temp.equals(targetSqaure)) return true;
    temp.y -= self.team * 2;
    temp.x += 2;
    if(temp.equals(targetSqaure)) return true;
    temp.x -= 4;
    if(temp.equals(targetSqaure)) return true;
    return false;
  }

  FaujdarCheck(targetSqaure, self){
    let temp = self.pos;
    temp.x += 1;
    if(temp.equals(targetSqaure)) return true;
    temp.x += 1;
    if(temp.equals(targetSqaure)) return true;
    temp.x -= 4;
    if(temp.equals(targetSqaure)) return true;
    temp.x += 1;
    if(temp.equals(targetSqaure)) return true;
  }

  ChowkidarCheck(targetSqaure, self){
    let temp = self.pos;
    temp.x += 1; temp.y +=1;
    if(temp.equals(targetSqaure)) return true;
    temp.y -= 1; temp.x += 1;
    if(temp.equals(targetSqaure)) return true;
    temp.y-=1; temp.x -= 1;
    if(temp.equals(targetSqaure)) return true;

    //reset posistion
    temp.y += 1;
    temp.x -= 1;

    temp.x -= 1; temp.y +=1;
    if(temp.equals(targetSqaure)) return true;
    temp.x -= 1; temp.y -= 1;
    if(temp.equals(targetSqaure)) return true;
    temp.x += 1;temp.y-=1;
    if(temp.equals(targetSqaure)) return true;

    return false;
  }

  ryottCheck(targetSquare, self){
    let temp = self.pos;
    temp.x += 1;
    if(temp.equals(targetSquare)) return true;
    temp.x -= 2;
    if(temp.equals(targetSquare)) return true;
    temp.x += 1;
    temp.y += 1;
    if(temp.equals(targetSquare)) return true;
    temp.y -= 2;
    if(temp.equals(targetSquare)) return true;
    return false;
  }
}
var elements = document.getElementsByClassName("moveBlock");


for (var i = 0; i < elements.length; i++){
  elements[i].addEventListener('mousedown', function(){
    var moves = document.getElementsByClassName("moveBlock");
    for (var j =0; j < moves.length; j++){
      moves[j].style.backgroundColor = "#44423f";
    }
    selectedMove = this.textContent;
    if(currentPlayer == 1){
      moveIndex = p1moves.indexOf(selectedMove);
    }else{
      moveIndex = p2moves.indexOf(selectedMove);
    }

    this.style.backgroundColor = "#687c4d";
});
}

function mapMoveIndex(x){
  if (x === 0) {
    return 1;
  } else if (x === 1) {
    return 5;
  } else if (x === 2) {
    return 7;
  } else {
    return x;
  }
}


// creates the board
board = new Board(6, 6, "#faebd7", "#808080",  "#B80F0A", "#4682B4", "#11ff11");

function cursorDown(canvas, event){
  let pos = getCursorPosition(canvas, event);
  board.TryMovePiece(pos);
}

function keypressed(canvas, event){
  if(event.keyCode == "R".charCodeAt(0)){
    for (var i = 0; i < elements.length; i++){
      var moves = document.getElementsByClassName("moveBlock");
      for (var j =0; j < moves.length; j++){
        moves[j].style.backgroundColor = "#44423f";
      }
    };
    
    selectedMove = "";
    board.reset();
  }
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  let boardX = Math.floor(x / squareSize);
  let boardY = Math.floor(y / squareSize);
  return new Vec2(boardX, boardY)
}

function setUI(){
  for (var i = 0; i < 5; i++){
    document.getElementsByClassName("moveText")[i].innerHTML = p1moves[i];
  }
  document.getElementsByClassName("pointsText")[0].innerHTML = scores[0];
  document.getElementsByClassName("pointsText")[1].innerHTML = scores[1];
}

function GameOver(){
  console.log("Game over");
  if(scores[0] > scores[1]){
    console.log("Player one has won");
  }else{
    console.log("Player two has won");
  }
}

//set up board
function init(){
  board.SetUp();
  setUI();
}

function animate() {
  board.draw();
  requestAnimationFrame(animate);
} animate();

init();