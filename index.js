class Vec2 {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}
// Define the size of each square in pixels
const squareSize = 100;

// Define the colors to alternate between + kotla colours 
const colors = ["#faebd7", "#808080", "#EB212E", "#00A6CB"];

// Create the canvas element and set its size
const canvas = document.createElement("canvas");
canvas.width = squareSize * 6;
canvas.height = squareSize * 6;

// Set kotlas
whiteKotla = new Vec2(2, 0);
blackKotla = new Vec2(3, 5);

// Get the canvas context
const ctx = canvas.getContext("2d");

var piecesarr = [];


// Add the canvas to the page
document.body.appendChild(canvas);

function animate() {
  redrawBoard();
  requestAnimationFrame(animate)
} animate();


class Piece {
  constructor(image, drawnposx, drawnposy, size){
    this.image = image;
    this.drawnposx = drawnposx;
    this.drawnposy = drawnposy;
    this.size = size;
  }

  move(xcoord, ycoord){
    this.drawnposx = xcoord;
    this.drawnposy = ycoord;
  }

  take(){
    var index = piecesarr.indexOf(this);
    if (index > -1) {
      piecesarr.splice(index, 1);
    }
  }
}

//set up board
function setUpPieces(){
  setUpPawns();
  setUpMirza();
}
setUpPieces();

function setUpPawns(){
  const whiteimagepawn = new Image();
  whiteimagepawn.src = "images/pieceWhite.png";

// Once the image is loaded, draw it on one of the squares
  whiteimagepawn.onload = function() {
    ctx.drawImage(whiteimagepawn, squareSize, squareSize, squareSize, squareSize);
    piecesarr.push(new Piece(whiteimagepawn, squareSize, squareSize, squareSize));
    ctx.drawImage(whiteimagepawn, squareSize*2, squareSize, squareSize, squareSize);
    piecesarr.push(new Piece(whiteimagepawn, squareSize*2, squareSize, squareSize));
    ctx.drawImage(whiteimagepawn, squareSize*3, squareSize, squareSize, squareSize);
    piecesarr.push(new Piece(whiteimagepawn, squareSize*3, squareSize, squareSize));
    ctx.drawImage(whiteimagepawn, squareSize*4, squareSize, squareSize, squareSize);
    piecesarr.push(new Piece(whiteimagepawn, squareSize*4, squareSize, squareSize));
};
  const blackimagepawn = new Image();
  blackimagepawn.src = "images/pieceBlack.png";

  // Once the image is loaded, draw it on one of the squares
  blackimagepawn.onload = function() {
    ctx.drawImage(blackimagepawn, squareSize, squareSize*4, squareSize, squareSize);
    piecesarr.push(new Piece(blackimagepawn, squareSize, squareSize*4, squareSize));
    ctx.drawImage(blackimagepawn, squareSize*2, squareSize*4, squareSize, squareSize);
    piecesarr.push(new Piece(blackimagepawn, squareSize*2, squareSize*4, squareSize));
    ctx.drawImage(blackimagepawn, squareSize*3, squareSize*4, squareSize, squareSize);
    piecesarr.push(new Piece(blackimagepawn, squareSize*3, squareSize*4, squareSize));
    ctx.drawImage(blackimagepawn, squareSize*4, squareSize*4, squareSize, squareSize);
    piecesarr.push(new Piece(blackimagepawn, squareSize*4, squareSize*4, squareSize));
  };
}

function setUpMirza(){
  const whiteMirza = new Image();
  whiteMirza.src = "images/mirzaWhite.png";

  whiteMirza.onload = function() {
    ctx.drawImage(whiteMirza, 0, 0, squareSize, squareSize);
    piecesarr.push(new Piece(whiteMirza, squareSize * 2, 0, squareSize));
  }

  const blackMirza = new Image();
  blackMirza.src = "images/mirzaBlack.png";

  blackMirza.onload = function() {
    ctx.drawImage(blackMirza, 0, 0, squareSize, squareSize);
    piecesarr.push(new Piece(blackMirza, squareSize * 3, squareSize * 5, squareSize));
  }
}

function redrawBoard(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      // Calculate the x and y coordinates of the current square
      const x = col * squareSize;
      const y = row * squareSize;
      
      // if kotla tile
      // Set the fill color to the appropriate color
      if(col == whiteKotla.x && row == whiteKotla.y){
        ctx.fillStyle = colors[2];
      }else if (col == blackKotla.x && row == blackKotla.y){
        ctx.fillStyle = colors[3];
      }else{
        ctx.fillStyle = colors[(row + col) % 2];
      }

      
      
      // Draw the square
      ctx.fillRect(x, y, squareSize, squareSize);
      // resets the colour 
      ctx.fillStyle = "#000000";
    }
  }
  piecesarr.forEach(p => {
    ctx.drawImage(p.image, p.drawnposx, p.drawnposy, p.size, p.size);
  });
}
