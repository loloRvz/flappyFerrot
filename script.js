var jumpKey = false;
var counter = 0;
var hiscore = 0;
var prevCount = false;
var noInput = 0;

var gravity = 0.2;
var jumpSpeed = -5;
var airSpeed = -1.5;
var frameTime = 10;
var hSpeed = 1;
var hardMode = false;

var holeSize = 140;
var obstWidth = 30;
var obstDist = 175;
var obstNum = 5;
var xPos = 140;
var imgWidth = 80;
var imgHeight = 100;
var groundLVL = 57;
var buffer = 20;

var mouseX = 0;
var mouseY = 0;
var click = false;
var prevClick = false;

function launch(){
  counter = 0;
  clearInterval(gameArea.interval);
  gameArea.start();
  ground.start();
  gamePiece = new sprite(20,55,'red',xPos,30);
  obst = [];
  for(var i = 0; i < obstNum; i++){
      obst.push(new obstacle(Math.random()*(gameArea.canvas.height-holeSize-groundLVL-buffer*2)+buffer,
                             'black',700+obstDist*i));
  }
}

function sprite(width,height,colour,x,y) {
  this.width = width;
  this.height = height;
  this.imgWidth = 160;
  this.imgHeight = 180;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.accX = 0;
  this.accY = gravity;
  ctx = gameArea.context;
  var image = new Image();
  image.src = 'assets/ferrot.png';
  this.update = function(){
    /*ctx.fillStyle = colour;
    ctx.fillRect(this.x,this.y,this.width,this.height);*/
    ctx.drawImage(image,this.x-20,this.y-5,this.imgWidth,this.imgHeight);
  };
  this.newPos = function(){
    this.x += this.speedX;
    this.y += this.speedY;
  };
  this.newSpeed = function(){
    this.speedX += this.accX;
    this.speedY += this.accY;
  };
  this.bottom = function(){
    if(this.y+this.height >= gameArea.canvas.height-groundLVL-1){
      this.speedY = 0;
      this.y = gameArea.canvas.height - this.height-1-groundLVL;
      this.accY = 0;
    }else{
      this.accY = gravity;
    }
  };
  this.scoreUp = function(){
    counterAdj = false;
    for(var i = 0; i < obstNum; i++){
      if((this.x > obst[i].x) && (this.x < obst[i].x+30)){
        counterAdj = true;
      }
    }
    if(prevCount == false && counterAdj){
      counter++;
    }
    prevCount = counterAdj;
  };
}
function obstacle(holeHeight,colour,x) {
  this.holeHeight = holeHeight;
  this.x = x;
  this.speedX = 0;
  this.holeSpeed = hSpeed;
  this.upperTop = 0;
  this.lowerBot = gameArea.canvas.height-groundLVL;

  ctx = gameArea.context;
  //image sizes: 52 X 283
  upperBolt = new Image();
  lowerBolt = new Image();
  upperBolt.src = './assets/upperBolt.png';
  lowerBolt.src = './assets/lowerBolt.png';

  this.update = function(){
    this.upperBot = this.holeHeight;
    this.lowerTop = this.holeHeight + holeSize;

    /*ctx.fillStyle = colour;
    ctx.fillRect(this.x,this.upperTop,
                 obstWidth,this.upperBot);
    ctx.fillRect(this.x,this.lowerTop,
                obstWidth,this.lowerBot-this.lowerTop);*/
    ctx.drawImage(upperBolt,0,0,50,this.upperBot,this.x-12,this.upperTop,52,this.upperBot);
    ctx.drawImage(lowerBolt,0,283,50,this.lowerTop-this.lowerBot,this.x-12,this.lowerTop,52,this.lowerBot-this.lowerTop);
  };
  this.newSpeed = function(){
    this.x += this.speedX;
    if(hardMode){
      this.holeHeight += this.holeSpeed;
    }
    if(this.holeHeight < buffer){
      this.holeSpeed = hSpeed;
    }if(this.holeHeight > this.lowerBot - buffer - holeSize){
      this.holeSpeed = -hSpeed;
    }
  };
  this.reset = function(index){
    var i = index-1;
    if(i == -1){i=obstNum-1;}
    if(this.x <= -obstWidth-10){
      this.x = obst[i].x + obstDist;
      this.holeHeight = Math.random()*(gameArea.canvas.height-holeSize-groundLVL-buffer*2)+buffer;
    }
  };
  this.crash = function(sprite){
    var left = sprite.x;
    var right = sprite.x + sprite.width;
    var up = sprite.y;
    var down = sprite.y + sprite.height;

    var over = (right > this.x)&&(left < this.x+obstWidth);
    var against = (up < this.upperBot) || (down > this.lowerTop);

    if(over && against){
      if(counter > hiscore){hiscore = counter;}
      noInput = 2;
      ground.speedX = 0;
      for(var i = 0; i < obstNum; i++){
        obst[i].speedX = 0;
      }
      clearInterval(gameArea.interval);
      gameArea.interval = setInterval(restart,frameTime);
    }
  };
}

function preGame(){
  gameArea.clear();
  updateSprite(gamePiece);
  updateGround();
  var time = new Date();
  gamePiece.x = xPos - gamePiece.imgWidth/2;
  gamePiece.y = gameArea.canvas.height/2+13*Math.sin((time.getMilliseconds()/1000)*2*Math.PI)-60;
  welcomeText();
  hardmodeButton.update();
  if(hardmodeButton.hover()){
    hardMode = !hardMode;
  }
  if(jumpKey){
    gameStart();
    clearInterval(gameArea.interval);
    gameArea.interval = setInterval(updateGameArea,frameTime);
  }
  prevClick = click;
}
function welcomeText(){
  ctx = gameArea.context;
  /*ctx.textAlign = 'center';
  ctx.font = '100px flappyBirdy';
  ctx.fillStyle = 'black';
  ctx.fillText("Flappy Ferrot",gameArea.canvas.width/2,gameArea.canvas.height/3.5);
  ctx.font = '40px flappyBirdy';
  ctx.fillText("Use spacebar, up arrow key or click to jump",gameArea.canvas.width/2,gameArea.canvas.height-15);*/
  title = new Image();
  titleW = 400;
  titleH = 100;
  title.src = './assets/title.png';
  ctx.drawImage(title,(gameArea.canvas.width-titleW)/2,gameArea.canvas.height/10,titleW,titleH);

  instr = new Image();
  instrW = 500;
  instrH = 50;
  instr.src = './assets/instructions.png';
  ctx.drawImage(instr,(gameArea.canvas.width-instrW)/2+45,gameArea.canvas.height-47,instrW,instrH);
}
function gameStart(){
  gamePiece.imgWidth = 53;
  gamePiece.imgHeight = 60;
  gamePiece.x = xPos - gamePiece.imgWidth/2;
  for(var i = 0; i < obstNum; i++){
      obst[i].speedX = airSpeed;
  }
}
function restart(){
  gameArea.clear();
  gameArea.canvas.style.cursor = "default";
  for(var i = 0; i < obstNum; i++){
    updateObstacle(obst[i],i);
  }
  updateSprite(gamePiece);
  updateHiscore(counter);
  updateGround();
  if(gamePiece.y > gameArea.canvas.height-gamePiece.height-50-groundLVL){
    noInput = 1;
  }
  restartButton.update();
  if(restartButton.hover()){
    noInput = 0;
    launch();
  }
  prevClick = click;
}

var gameArea = {
  canvas: document.createElement('canvas'),
  start : function() {
    this.canvas.width = 700;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(preGame,frameTime);
    this.bgImage = new Image();
    this.bgImage.src = './assets/background.jpg';
  },
  clear : function() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.context.drawImage(this.bgImage,0,0,this.canvas.width,this.canvas.height);
  }
};
var restartButton = {
  width: 150,
  height: 30,
  xOffset: 0,
  yOffset: 30,
  bar: 3,
  x: 0,
  y: 0,
  text: 'restart',
  update : function() {
    this.x = (gameArea.canvas.width-this.width)/2+this.xOffset;
    this.y = (gameArea.canvas.height-this.height)/2+this.yOffset;
    ctx = gameArea.canvas.getContext("2d");
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x-(this.bar)/2,
                 this.y-(this.bar)/2,
                 this.width+this.bar,
                 this.height+this.bar);
    ctx.fillStyle = '#f2a953';
    ctx.fillRect(this.x,
                 this.y,
                 this.width,
                 this.height);
     ctx.textAlign = 'center';
     ctx.font = '16px numberFont';
     ctx.fillStyle = 'black';
     ctx.lineWidth = 3;
     ctx.strokeText(this.text,this.x+this.width/2,this.y+this.height*(3/4));
     ctx.fillStyle = 'white';
     ctx.fillText(this.text,this.x+this.width/2,this.y+this.height*(3/4));
  },
  hover : function() {
    var onX = (mouseX > this.x)&&(mouseX < this.x+this.width);
    var onY = (mouseY > this.y)&&(mouseY < this.y+this.height);
    var h = onX && onY;
    if(h){
      gameArea.canvas.style.cursor = "pointer";
      this.width = 155;
      this.height = 35;
    }else{
      this.width = 150;
      this.height = 30;
    }
    if(prevClick && !click && h){
      return true;
    }else{
      return false;
    }
  }
};
var hardmodeButton = {
  width: 150,
  height: 30,
  xOffset: 200,
  yOffset: 30,
  bar: 3,
  x: 0,
  y: 0,
  text: 'hard mode',
  update : function() {
    this.x = (gameArea.canvas.width-this.width)/2+this.xOffset;
    this.y = (gameArea.canvas.height-this.height)/2+this.yOffset;
    ctx = gameArea.canvas.getContext("2d");
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x-(this.bar)/2,
                 this.y-(this.bar)/2,
                 this.width+this.bar,
                 this.height+this.bar);
    if(!hardMode){
      ctx.fillStyle = '#f2a953';
    }else{
      ctx.fillStyle = '#8f510a';
    }
    ctx.fillRect(this.x,
                 this.y,
                 this.width,
                 this.height);
     ctx.textAlign = 'center';
     ctx.font = '16px numberFont';
     ctx.fillStyle = 'black';
     ctx.lineWidth = 3;
     ctx.strokeText(this.text,this.x+this.width/2,this.y+this.height*(3/4));
     ctx.fillStyle = 'white';
     ctx.fillText(this.text,this.x+this.width/2,this.y+this.height*(3/4));
  },
  hover : function() {
    var onX = (mouseX > this.x)&&(mouseX < this.x+this.width);
    var onY = (mouseY > this.y)&&(mouseY < this.y+this.height);
    var h = onX && onY;
    if(h){
      gameArea.canvas.style.cursor = "pointer";
      this.width = 155;
      this.height = 35;
    }else{
      this.width = 150;
      this.height = 30;
    }
    if(prevClick && !click && h){
      return true;
    }else{
      return false;
    }
  }
};
var ground={
  start: function() {
    this.img = new Image();
    this.img.src = './assets/ground.png';
    this.width = 750;
    this.height = 350;
    this.x1 = 0;
    this.x2 = this.x1+this.width;
    this.speedX = airSpeed;
  },
  x1 : 0,
  y : gameArea.canvas.height-groundLVL-50,
  x2 : 0,
  speedX : airSpeed,

  update : function(){
    ctx = gameArea.context;
    ctx.drawImage(this.img,this.x1,this.y,this.width,this.height);
    ctx.drawImage(this.img,this.x2,this.y,this.width,this.height);
  },
  newPos : function(){
    this.x1 += this.speedX;
    this.x2 += this.speedX;
  },
  reset : function(){
    if(this.x1 < 0-this.width-10){this.x1=this.x2+this.width;}
    if(this.x2 < 0-this.width-10){this.x2=this.x1+this.width;}
  }
};


function updateSprite(spr){
  spr.update();
  spr.newPos();
  spr.newSpeed();
  spr.bottom();
  spr.scoreUp();
}
function updateObstacle(ob,index){
  ob.update();
  ob.newSpeed();
  ob.reset(index);
  ob.crash(gamePiece);
}
function updateScore(score){
  ctx = gameArea.context;
  ctx.textAlign = 'center';
  ctx.font = '50px numberFont';
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  ctx.strokeText(score,gameArea.canvas.width/2,gameArea.canvas.height/3.5);
  ctx.fillStyle = 'white';
  ctx.fillText(score,gameArea.canvas.width/2,gameArea.canvas.height/3.5);
}
function updateHiscore(score){
  ctx = gameArea.context;
  var width = 150;
  var height = 100;
  var bar = 3;
  ctx.fillStyle = 'black';
  ctx.fillRect((gameArea.canvas.width-width-bar)/2,(gameArea.canvas.height-height-bar)/2-50,width+bar,height+bar);
  ctx.fillStyle = '#f2a953';
  ctx.fillRect((gameArea.canvas.width-width)/2,(gameArea.canvas.height-height)/2-50,width,height);

  ctx.textAlign = 'center';
  ctx.font = '25px numberFont';
  ctx.fillStyle = 'black';
  ctx.lineWidth = 3;
  ctx.strokeText("score: "+score,gameArea.canvas.width/2,gameArea.canvas.height/2-55);
  ctx.fillStyle = 'white';
  ctx.fillText("score: "+score,gameArea.canvas.width/2,gameArea.canvas.height/2-55);

  ctx.fillStyle = 'black';
  ctx.lineWidth = 3;
  ctx.strokeText("best: "+hiscore,gameArea.canvas.width/2,gameArea.canvas.height/2-25);
  ctx.fillStyle = 'white';
  ctx.fillText("best: "+hiscore,gameArea.canvas.width/2,gameArea.canvas.height/2-25);
}
function updateGround(){
  ground.update();
  ground.newPos();
  ground.reset();
}
function updateGameArea(){
  gameArea.clear();
  for(var i = 0; i < obstNum; i++){
    updateObstacle(obst[i],i);
  }
  updateSprite(gamePiece);
  updateScore(counter);
  updateGround();
}

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case (32):
      jumpFunc();
      break;
    case (38):
      jumpFunc();
      break;
    }
};
document.onkeyup = function(e){
  var key = e.keyCode;
  if(key == 38 || key == 32){
    jumpKey = false;
  }
};
document.onmousedown = function(c){
  /*if(!jumpKey && noInput == 0){
    jumpKey = true;
    gamePiece.speedY = jumpSpeed;
  }*/
  click = true;
};
document.onmouseup = function(c){
  jumpKey = false;
  click = false;
};
function jumpFunc(){
  if(!jumpKey && noInput==0){
    jumpKey = true;
    gamePiece.speedY = jumpSpeed;
  }
  if(noInput == 1){
    noInput = 0;
    clearInterval(gameArea.interval);
    counter = 0;
    launch();
  }
}

gameArea.canvas.onmousemove = function(e) {
  var rect = this.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
};
