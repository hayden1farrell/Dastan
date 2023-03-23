// Define the size of each square in pixels
const squareSize = 100;

// Define the colors to alternate between
const colors = ["#faebd7", "#808080"];

// Create the canvas element and set its size
const canvas = document.createElement("canvas");
canvas.width = squareSize * 6;
canvas.height = squareSize * 6;

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
}
setUpPieces();

function setUpPawns(){
  const whiteimagepawn = new Image();
  whiteimagepawn.src = "images/piece1.png";

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
  blackimagepawn.src = "images/piece2.png";

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

function redrawBoard(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      // Calculate the x and y coordinates of the current square
      const x = col * squareSize;
      const y = row * squareSize;
      
      // Set the fill color to the appropriate color
      ctx.fillStyle = colors[(row + col) % 2];
      
      // Draw the square
      ctx.fillRect(x, y, squareSize, squareSize);
    }
  }
  piecesarr.forEach(p => {
    ctx.drawImage(p.image, p.drawnposx, p.drawnposy, p.size, p.size);
  });
}
