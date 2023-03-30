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
var selectedoffer = false;

canvas.addEventListener('mousedown', function(e) {
  cursorDown(canvas, e);
})

window.addEventListener('keydown', function(e) {
  keypressed(canvas, e);
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
        // means that this square has a peice and that no previous peice selected
        this.selectedSquare = square;

        // display valid moves;
        this.DisplayValidMoves(square);
      }
    }
  }

  DisplayValidMoves(square){
    let peice = this.getPiece(square);
    peice.showValid();
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
      // changes the moves

      if (currentPlayer == 1){
        changeMoveOrderP1(selectedMove);
        
      } else if (currentPlayer == -1){
        changeMoveOrderP2(selectedMove);
      }

      // calulate the other players score
      currentPlayer *= -1;
      updateMoveBlocks();
      updatePlayerText(currentPlayer);
      currentPlayerIndex = (1-currentPlayer)/2;
      if(this.controlsKotla(currentPlayer)){
        scores[currentPlayerIndex] += 5;
      }
      if(this.controlsEnemyKotla(currentPlayer)){
        scores[currentPlayerIndex] += 1;
      }
    }

    selectedMove = "";
    makeAllSquaresBlank();

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
    if(this.getPiece(selectedMove) != null){
      console.log("board circle");
      this.DisplayValidMoves();
    }
  }

  drawPieces() {
    this.piecesarr.forEach(p => {
      if(p != null){
        ctx.drawImage(p.image, p.pos.x * squareSize, p.pos.y * squareSize, p.size, p.size);
      }
    });

    if(this.getPiece(selectedMove) != null){
      console.log("tsetes");
      this.DisplayValidMoves();
    }
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

  showValid(){
    console.log("Test");
    if(selectedMove == "Ryott"){
      console.log("ryott");

      this.ryottShow(this);
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
    let temp = self.pos;ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke(); 
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
    temp.y -= self.team * 1;
    temp.x += 2;
    if(temp.equals(targetSqaure)) return true;
    temp.x -= 4;
    if(temp.equals(targetSqaure)) return true;
    return false;
  }

  FaujdarShow(self){
    let temp = self.pos;
    temp.x += 1;
    DrawCirlce(temp.x, temp.y, 50);
    temp.x += 1;
    if(temp.equals(targetSqaure)) return true;
    temp.x -= 4;
    if(temp.equals(targetSqaure)) return true;
    temp.x += 1;
    if(temp.equals(targetSqaure)) return true;
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

  ChowkidarShow(self){
    let temp = self.pos;
    temp.x += 1; temp.y +=1;
    
    DrawCirlce(temp.x, temp.y, 50);
    temp.y -= 1; temp.x += 1;
    DrawCirlce(temp.x, temp.y, 50);
    temp.y-=1; temp.x -= 1;
    DrawCirlce(temp.x, temp.y, 50);

    //reset posistion
    temp.y += 1;
    temp.x -= 1;

    temp.x -= 1; temp.y +=1;
    DrawCirlce(temp.x, temp.y, 50);
    temp.x -= 1; temp.y -= 1;
    DrawCirlce(temp.x, temp.y, 50);
    temp.x += 1;temp.y-=1;
    DrawCirlce(temp.x, temp.y, 50);
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

  ryottShow(self){
    let temp = self.pos;
    temp.x += 1;
    DrawCirlce(temp.x, temp.y, 50);
    temp.x -= 2;
    DrawCirlce(temp.x, temp.y, 50);
    temp.x += 1;
    temp.y += 1;
    DrawCirlce(temp.x, temp.y, 50);
    temp.y -= 2;
    DrawCirlce(temp.x, temp.y, 50);
    temp.y += 1;
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
    if (selectedoffer){
      this.childNodes[0].innerHTML = document.getElementById("offer").title;
      if (currentplayer == 1){
        scores[0] -= this.title;
      } else{
        scores[1] -= this.title;
      }
      document.getElementsByClassName("pointsText")[0].innerHTML = scores[0];
      document.getElementsByClassName("pointsText")[1].innerHTML = scores[1];
      updateOffer();
    } else if (this.title != "4" && this.title != "5") {
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
    }
    
});
}

function makeAllSquaresBlank(){
  var moves = document.getElementsByClassName("moveBlock");
      for (var j =0; j < moves.length; j++){
        moves[j].style.backgroundColor = "#44423f";
      }
}

document.getElementById("offer").addEventListener('mousedown', function(){
  selectedoffer = true;
});

function updatePlayerText(player){
  var el = document.getElementById("currentplayer");
  if (player == 1){
    el.innerHTML = "Current Player: P1";
    el.style.color = "red";
  } else {
    el.innerHTML = "Current Player: P2";
    el.style.color = "rgb(0, 174, 255)";
  }
}

function changeMoveOrderP1(move){
  //console.log(move);
  for (var i=0; i < 5; i++){
    if (p1moves[i] == move){
      console.log(scores);
      var temp = p1moves[i];
      for (var j = 0; i+j < 4; j++){
        //moves[i+j].innerHTML = moves[i+j+1].innerHTML;
        p1moves[i+j] = p1moves[i+j+1];
      }
      //moves[4].innerHTML = temp;
      p1moves[4] = temp;
      break;
    }
  }
  console.log(p1moves);
}

function changeMoveOrderP2(move){
  //console.log(move);
  for (var i=0; i < 5; i++){
    if (p2moves[i] == move){
      console.log(scores);
      var temp = p2moves[i];
      for (var j = 0; i+j < 4; j++){
        p2moves[i+j] = p2moves[i+j+1];
      }
      p2moves[4] = temp;
      break;
    }
  }
  console.log(p2moves);
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

function updateOffer(){
  var offerblock = document.getElementById("offer");
  offerblock.title = p1moves[Math.floor(Math.random()*5)];
  offerblock.innerHTML = "Offer: "+offerblock.title;
  selectedoffer = false;
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

function updateMoveBlocks(){
  if (currentPlayer == 1){
    document.getElementById("move1").innerHTML = p1moves[0];
    document.getElementById("move2").innerHTML = p1moves[1];
    document.getElementById("move3").innerHTML = p1moves[2];
    document.getElementById("move4").innerHTML = p1moves[3];
    document.getElementById("move5").innerHTML = p1moves[4];
  } else {
    document.getElementById("move1").innerHTML = p2moves[0];
    document.getElementById("move2").innerHTML = p2moves[1];
    document.getElementById("move3").innerHTML = p2moves[2];
    document.getElementById("move4").innerHTML = p2moves[3];
    document.getElementById("move5").innerHTML = p2moves[4];
  }
}

function GameOver(){
  console.log("Game over");
  if(scores[0] > scores[1]){
    console.log("Player one has won");
  }else{
    console.log("Player two has won");
  }
}

function DrawCirlce(x, y, radius){
  ctx.beginPath();
  console.log(x * squareSize, y * squareSize, radius);
  ctx.arc(x * squareSize, y * squareSize, radius , 0, 2 * Math.PI, false);
  ctx.fillStyle = "blue"; 
  ctx.fill(); 
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