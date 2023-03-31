let cvs = document.getElementById("mycanvas");
let ctx = cvs.getContext("2d");

let frames = 0;
let DEGREE = Math.PI / 180;

let sprite = new Image();
sprite.src = "img/sprite.png";

let SCORE = new Audio();
SCORE.src = "audio/point.wav";
let HIT = new Audio();
HIT.src = "audio/hit.wav";
let FLY = new Audio();
FLY.src = "audio/fly.wav";
let DIE = new Audio();
DIE.src = "audio/die.wav";
let START = new Audio();
START.src = "audio/start.wav";

let state = {
  current: 0,
  gameReady: 0,
  game: 1,
  over: 2,
};

function clickHandller() {
  switch (state.current) {
    case state.gameReady:
      state.current = state.game;
      break;
    case state.game:
      FLY.play();
      bird.flap();
      break;
    default:
      bird.speed = 0;
      bird.rotation = 0;
      pipes.position = [];
      state.current = state.gameReady;
      score.value = 0;
      break;
  }
}
document.addEventListener("click", clickHandller);
document.addEventListener("keydown", function (e) {
  if (e.keyCode == 32) {
    clickHandller();
  }
});

let bg = {
  sx: 0,
  sy: 0,
  w: 515,
  h: 251,
  x: 0,
  y: cvs.height - 360,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
  },
};
let fg = {
  sx: 0,
  sy: 675,
  w: 509,
  h: 115,
  x: 0,
  y: cvs.height - 115,
  dx: 3,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
  update: function () {
    if (state.current == state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  },
};
let pipes = {
  top: {
    sx: 642,
    sy: 0,
  },
  bottom: {
    sx: 536,
    sy: 0,
  },
  w: 94,
  h: 491,
  dx: 3,
  gap: 150,
  position: [],
  maxYPos: -150,
  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let topYPos = p.y;
      let botYpos = p.y + this.h + this.gap;

      ctx.drawImage(
        sprite,
        this.top.sx,
        this.top.sy,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );
      ctx.drawImage(
        sprite,
        this.bottom.sx,
        this.bottom.sy,
        this.w,
        this.h,
        p.x,
        botYpos,
        this.w,
        this.h
      );
    }
  },
  update: function () {
    if (state.current != state.game) return;
    if (frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1),
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;

      let bottomPipesPos = p.y + this.h + this.gap;
      if (
        bird.x + bird.radiuos > p.x &&
        bird.x - bird.radiuos < p.x + this.w &&
        bird.y + bird.radiuos > p.y &&
        bird.y - bird.radiuos < p.y + this.h
      ) {
        HIT.play();
        state.current = state.over;
      }
      if (
        bird.x + bird.radiuos > p.x &&
        bird.x - bird.radiuos < p.x + this.w &&
        bird.y + bird.radiuos > bottomPipesPos &&
        bird.y - bird.radiuos < bottomPipesPos + this.h
      ) {
        HIT.play();
        state.current = state.over;
      }
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        SCORE.play();
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("Best", score.best);
      }
    }
  },
};

let getReady = {
  sx: 0,
  sy: 320,
  w: 244,
  h: 145,
  x: cvs.width / 2 - 244 / 2,
  y: 90,
  draw: function () {
    if (state.current == state.gameReady) {
      ctx.drawImage(
        sprite,
        this.sx,
        this.sy,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

let gameOver = {
  sx: 0,
  sy: 470,
  w: 245,
  h: 191,
  x: cvs.width / 2 - 245 / 2,
  y: 80,
  draw: function () {
    if (state.current == state.over) {
      ctx.drawImage(
        sprite,
        this.sx,
        this.sy,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

let bird = {
  animation: [
    { sx: 290, sy: 319 },
    { sx: 290, sy: 376 },
    { sx: 290, sy: 426 },
    { sx: 290, sy: 376 },
  ],
  w: 57,
  h: 50,
  x: 70,
  y: 170,
  speed: 0,
  gravity: 0.6,
  jump: 6,
  rotation: 0,
  animationIndex: 0,
  radiuos: 12,

  draw: function () {
    let bird = this.animation[this.animationIndex];
    ctx.save();
    ctx.translate(this.w, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      sprite,
      bird.sx,
      bird.sy,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );
    ctx.restore();
  },
  update: function () {
    let period = state.current == state.gameReady ? 7 : 3;
    this.animationIndex += frames % period == 0 ? 1 : 0;
    this.animationIndex = this.animationIndex % 4;
    if (state.current == state.gameReady) {
      this.y = 170;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.speed < this.jump) {
        this.rotation = -25 * DEGREE;
      } else {
        this.rotation = 25 * DEGREE;
      }
    }
    if (this.y + this.h / 2 >= cvs.height - fg.h) {
      this.y = cvs.height - fg.h - this.h / 2;
      this.animationIndex = 1;
      if (state.current == state.game) {
        DIE.play();
        state.current = state.over;
      }
    }
  },
  flap: function () {
    this.speed = -this.jump;
  },
};

var score = {
  best: parseInt(localStorage.getItem("Best")) || 0,
  value: 0,
  draw: function () {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    if (state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = "35px IMPACT";
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);
    } else if (state.current == state.over) {
      ctx.lineWidth = 2;
      ctx.font = "35px IMPACT";

      ctx.fillText(this.value, 270, 207);
      ctx.strokeText(this.value, 270, 207);

      ctx.fillText(this.best, 270, 257);
      ctx.strokeText(this.best, 270, 257);
    }
  },
};

function update() {
  bird.update();
  fg.update();
  pipes.update();
}

function draw() {
  ctx.fillStyle = "#0099cc";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function animate() {
  update();
  draw();
  frames++;
  requestAnimationFrame(animate);
}

animate();
