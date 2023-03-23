// Define the size of each square in pixels
const squareSize = 30;

// Define the colors to alternate between
const colors = ["#faebd7", "black"];

// Create the canvas element and set its size
const canvas = document.createElement("canvas");
canvas.width = squareSize * 6;
canvas.height = squareSize * 6;

// Get the canvas context
const ctx = canvas.getContext("2d");

// Loop through each square and draw it with the appropriate color
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

// Load the image to display
const image = new Image();
image.src = "images/piece1.png";

// Once the image is loaded, draw it on one of the squares
image.onload = function() {
  ctx.drawImage(image, squareSize, squareSize, squareSize, squareSize);
};

// Add the canvas to the page
document.body.appendChild(canvas);
