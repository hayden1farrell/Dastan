class Vec2 {
  constructor(x, y){
    this.x = x;
    this.y = y;

    this.equals = function(other) {
      return other.x == this.x && other.y == this.y;
   };
  }

}
// Define the size of each square in pixels
const squareSize = 100;


// Create the canvas element and set its size
const canvas = document.createElement("canvas");
canvas.width = squareSize * 6;
canvas.height = squareSize * 6;

// Get the canvas context
const ctx = canvas.getContext("2d");

canvas.addEventListener('mousedown', function(e) {
  cursorDown(canvas, e)
})

// Add the canvas to the page
document.body.appendChild(canvas);

class Board{
  constructor(rows, cols, mainColour, alternativeColour, whiteKotlaColour, blackKotlaColour, activeColour){
    this.rows = rows;
    this.cols = cols;
    this.colours = [mainColour, alternativeColour, whiteKotlaColour, blackKotlaColour, activeColour]
    this.piecesarr = [];
    this.squareSize = squareSize;
    this.whiteKotla = new Vec2(2, 0);
    this.blackKotla = new Vec2(3, 5);
    this.selectedSquare = new Vec2(-1, -1);
  }

  SetUp(){
    this.setUpPawns();
    this.setUpMizras();
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
      this.setSquare(xOffset, 1, new Piece(whitePawnImage, new Vec2(xOffset, 1), squareSize));
    }

    // Set up the black pawns
    const blackPawnImage = new Image();
    blackPawnImage.src = "images/pieceBlack.png";

    for(let xOffset = 1; xOffset <= 4; xOffset++){
      ctx.drawImage(blackPawnImage, squareSize, squareSize, squareSize, squareSize);
      this.setSquare(xOffset, 4, new Piece(blackPawnImage, new Vec2(xOffset, 4), squareSize));
    }

  }

  setUpMizras(){
    // set up the white
    const whiteMizraImage = new Image();
    whiteMizraImage.src = "images/mirzaWhite.png";
    ctx.drawImage(whiteMizraImage, squareSize, squareSize, squareSize, squareSize);
    this.setSquare(2, 0, new Piece(whiteMizraImage, new Vec2(2, 0), squareSize));

  
    const blackMizraImage = new Image();
    blackMizraImage.src = "images/mirzaBlack.png";
    ctx.drawImage(blackMizraImage, squareSize, squareSize, squareSize, squareSize);
    this.setSquare(3, 5, new Piece(blackMizraImage, new Vec2(3,5), squareSize));
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

  Move(posistion){
    let piece = this.getPiece(this.selectedSquare);
    if(piece == null) return;
    // handle all logic which may happen when a piece moves
    // need to handle score system
    if(this.containsPiece(posistion)){
      console.info("Need to implement but square contains piece");
      this.movePiece(posistion, this.selectedSquare, piece);
      this.selectedSquare = new Vec2(-1, -1);
    }else{
      this.movePiece(posistion, this.selectedSquare, piece);
      this.selectedSquare = new Vec2(-1, -1);
    }
  }

  movePiece(newPos, oldPos, piece){
    this.setSquare(oldPos.x, oldPos.y, null);
    piece.move(newPos);
    this.setSquare(newPos.x, newPos.y, piece);

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
        }else if(col == this.whiteKotla.x && row == this.whiteKotla.y){
          ctx.fillStyle = this.colours[2];
          // if the current sqaure is the black kotal
        }else if(col == this.blackKotla.x && row == this.blackKotla.y){
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
  constructor(image, drawPos, size){
    this.image = image;
    this.pos = drawPos;
    this.size = size;
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
}

// creates the board
board = new Board(6, 6, "#faebd7", "#808080",  "#B80F0A", "#4682B4", "#11ff11");

function cursorDown(canvas, event){
  let pos = getCursorPosition(canvas, event);
  board.TryMovePiece(pos);
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  let boardX = Math.floor(x / squareSize);
  let boardY = Math.floor(y / squareSize);
  return new Vec2(boardX, boardY)
}

//set up board
function init(){
  board.SetUp();
}

function animate() {
  board.draw();
  requestAnimationFrame(animate)
} animate();

init();