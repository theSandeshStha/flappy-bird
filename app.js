//Board

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//Bird
let birdWidth = 34;
let birdHeight = 24; //The actual image ratio = 408/228 = 17/12 = 34/24
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = { x: birdX, y: birdY, width: birdWidth, height: birdHeight };

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2; //speed of pipe moving left
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameover = false;

let score = 0;
let highscore = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // Used for drawing on the board

  // Drawing the bird
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);

  setInterval(placePipes, 1500); //1.5seconds

  document.addEventListener("keydown", moveBird);
  document.addEventListener("touchstart", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameover) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //Bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // limit bird to top of the canvas
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // if bird touches ground
  if (bird.y + 24 > board.height) {
    gameover = true;
  }

  //Pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    // if bird crosses pipe, increase score
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameover = true;
    }
  }

  // Clear passed pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  context.fillStyle = "black";
  context.font = "45px sans-serif";
  context.fillText("Score:", 5, 45);
  context.fillStyle = "white";
  context.fillText(score, 145, 45);
  context.fillStyle = "black";
  context.fillText("High Score: ", 5, 90);
  context.fillStyle = "white";
  context.fillText(highscore, 250, 90);

  if (gameover) {
    context.fillStyle = "red";
    context.fillText("GAME OVER!", 5, 135);
  }
}
function placePipes() {
  if (gameover) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (
    e.code == "Space" ||
    e.code == "ArrowUp" ||
    e.code == "KeyX" ||
    e.type === "touchstart"
  ) {
    velocityY = -6; //jump

    //reset game
    if (gameover) {
      bird.y = birdY;
      pipeArray = [];
      if (score > highscore) {
        highscore = score;
      }
      score = 0;
      gameover = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}
