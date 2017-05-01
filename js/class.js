//Classe de l'objet Ball
Ball = function(game) {
  //Variable de deplacements
  this.baseSpd = BASESPEED;
  this.currSpd = this.baseSpd;
  this.ySpd = 0;
  this.dir = undefined;
  this.slowSpd = undefined;
  this.slowFactor = BASESLOWFACTOR;
  this.slowOn = false;
  //Variables specifiques
  this.type = undefined;
  this.combo = 0;
  this.power = BASEPOWER;
  this.color = 0;
  this.lastHit = undefined; //P1 ou P2
  this.playing = false;
  this.game = game;

  //Variables de positionnements
  this.x = 0;
  this.y = 0;
  this.xToGoal = undefined;
  //Timers
  this.holdTimer = game.time.create(false);

  //Variables graphiques et inputs
  this.gBall = game.add.group();
    this.spr = game.add.sprite(this.x,this.y,"ball");
      this.spr.frame = 0;
      this.spr.scale.setTo(0.5);
      this.spr.anchor.setTo(0.5);
    this.sprGlow = game.add.sprite(this.x,this.y,"greenball");
      this.sprGlow.alpha = 0.2;
      this.sprGlow.inputEnabled = true;
      this.sprGlow.events.onInputDown.add(this.slowTheBall, this);
      this.sprGlow.events.onInputUp.add(this.hitTheBall, this);
      this.sprGlow.scale.setTo(BALLGLOWMAX);
      this.sprGlow.anchor.setTo(0.5);
    this.sprClic = game.add.sprite(this.x,this.y,"redball");
      this.sprClic.frame = 0;
      this.sprClic.scale.setTo(0.16);
      this.sprClic.anchor.setTo(0.5);
      this.sprClic.alpha = 0;

  /*
  this.fxLine = game.add.bitmapData(600,300);
    var color = '#dc143c';

    this.fxLine.ctx.beginPath();
    this.fxLine.ctx.lineWidth = "4";
    this.fxLine.ctx.strokeStyle = color;
    this.fxLine.ctx.stroke();
  this.sprLine = game.add.sprite(0, 0, this.fxLine);
  */

  this.gBall.add(this.sprGlow);
  this.gBall.add(this.spr);

  //Variables sonores
  this.sHit = game.add.audio('snd_hitball');
    this.sHit.allowMultiple = true;
    this.sHit.addMarker('sndHit', 0.2, 1.2, 0.12, 0);
    this.sHit.addMarker('sndWall', 0.5, 0.8, 0.18, 0);
  this.sHold = game.add.audio('snd_holdball');
    this.sHold.allowMultiple = false;
    this.sHold.addMarker('sndHold', 0.1, 2.2, 0.16, 0);
  this.sGoal = game.add.audio('snd_goal');
    this.sGoal.allowMultiple = false;
    this.sGoal.addMarker('sndGoal', 0.3, 6, 1.2, 0);
}

//Update de la balle
Ball.prototype.update = function() {
  if(workingButtons){
    //La balle suit son comportement de deplacement
    this.move();
    //Goal si la balle sort du terrain
    this.goals();
    //Rebond sur les bords haut et bas
    this.rebound();
    //Si on change de side on change de couleur
    this.changeSide();
  }
  //On deplace toujours les sprites sur l'objet
  this.gBall.x = this.x;
  this.gBall.y = this.y;
}

//Gestion de tous les deplacements de la balle
Ball.prototype.move = function() {
  //Formule de vitesse de la balle
  if(this.playing && !this.slowOn){
    this.x += this.currSpd * this.dir;
    this.y += this.ySpd;
  }else if(this.playing && this.slowOn){
    this.x += (this.currSpd / this.slowFactor) * this.dir;
    //On affiche le pointeur rouge
    this.sprClic.x =  this.game.input.x;
    this.sprClic.y =  this.game.input.y;
    this.sprClic.alpha = 0.5;

    //On update la ligne de visée$
    /*
    this.fxLine.clear();
      this.fxLine.ctx.beginPath();
      this.fxLine.ctx.beginPath();
      this.fxLine.ctx.moveTo(this.gBall.x, this.gBall.y);
      this.fxLine.ctx.lineTo(game.input.x , game.input.y);
      this.fxLine.ctx.lineWidth = 4;
      this.fxLine.ctx.stroke();
      this.fxLine.ctx.closePath();
      this.fxLine.render();
    }
    */
  }

  //Desceleration Y
  if(Math.abs(this.ySpd)>0.4){//Creer une constante ici
    this.ySpd = this.ySpd - (this.ySpd/YRECTIF)
  }
}

Ball.prototype.goals = function() {
  //Declenche la fin du round si la balle sort sur un des côtés
  if(this.x>gww+this.spr.width/2+GMARGIN*5 || this.x<0-this.spr.width/2-GMARGIN*5){
    let winner = 0;
    this.game.add.tween(this.sprGlow.scale).to( {x:4, y:4 }, 1000, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.sprGlow).to( {alpha:0 }, 1000, Phaser.Easing.Linear.None, true);

    if(this.dir===1){
      winner=0;
    }else if(this.dir===-1){
      winner=1;
    }

    //On lance un son bruitages
    this.sGoal.play('sndGoal');

    endRound(this.game, winner);
  }
}

Ball.prototype.rebound = function() {
  //Fait rebondir la balle sur les bords haut et bas
  if(this.y<=0+(this.spr.height/2)-this.ySpd || this.y>=gwh-(this.spr.height/2)-this.ySpd){
    this.ySpd *= (-BOUNCEEFFECT);

    //On lance un son bruitages
    this.sHit.play('sndWall');
    //log
    console.log('Player ', this.lastHit+1, ' WALLBOUNCE!');
  }
}

Ball.prototype.changeSide = function() {
  //Se déclanche dès que la balle change de côté
  if((this.x<gwx && this.dir===1 && this.x+this.currSpd>=gwx) || (this.x>gwx && this.dir===(-1) && this.x-this.currSpd<=gwx)){
    this.changeColor();
  }
}

//Fonction slowTheBall
Ball.prototype.slowTheBall = function() {
  if(workingButtons && !this.slowOn){
    if(this.x<=gwx && this.color===1 || this.x>gwx && this.color===2){
      this.slowOn = true;
      this.power = BASEPOWER

      //On lance un son bruitages
      this.sHold.play('sndHold');

      //Timer pour connaitre la vitesse du coup
      this.holdTimer.loop(HOLDLOOPMS, this.addPower, this);
      this.holdTimer.start();

      this.sprGlow.scale.setTo(0.4,0.4);
      this.game.add.tween(this.sprGlow).to( { alpha: 0.6 }, 1000, Phaser.Easing.Linear.None, true);
      //this.game.add.tween(this.sprGlow).to( { tint: 0x00ffff }, 700, Phaser.Easing.Linear.None, true);
      this.game.add.tween(this.sprGlow.scale).to( {x:BALLGLOWMIN, y:BALLGLOWMIN }, 500, Phaser.Easing.Linear.None, true);

      //On calcule le lancer sur Y
      this.cursorX = this.game.input.x;
      this.cursorY = this.game.input.y;
      this.ySpd = 0;
    }
  }
}

//Fonction hitTheBall
Ball.prototype.hitTheBall = function(type, player) {
  if(workingButtons){
    if(this.x<=gwx && this.color===1 || this.x>gwx && this.color===2){
      let pnb = player;

      this.holdTimer.destroy();

      this.sprClic.alpha = 0;

      //On lance un son bruitages
      this.sHit.play('sndHit');

      //On incrémente le combo de passes
      this.combo++;
      //On modifie le meilleur combo si nécessaire
      /*
      if(this.combo>bestCombo){
        bestCombo = this.combo;
      }
      if(this.power===BASEPOWER){
        this.power = 0;
      }
      */

      //On modifie vitesse et direction
      //A changer --> faire fonction de tirs général (amortis, smash, slices)
      //Deplacer la balle en fonction de l'angles du pointeurs
      if(this.cursorX<this.game.input.x){
        this.dir = -1;
        this.type = 0;
        //log
        console.log('Player ', this.lastHit+1, ' HOLDSHOT!');
      }else if(this.cursorX>this.game.input.x){
        this.dir = 1;
        this.type = 0;
        //log
        console.log('Player ', this.lastHit+1, ' HOLDSHOT!');
      }else{
        this.dir *= (-1);
        this.type = 1;
        //log
        console.log('Player ', this.lastHit+1, ' DROPSHOT!');
        //this.sprGlow.tint = 0xff00ff;
      }

      //Teste pour le deplacement Y MOOOOOOOCHE
      //A inclure dans la futur fonction du haut
      if(this.cursorY<this.game.input.y-40){

        this.yGutter = Math.abs(this.game.input.y - this.cursorY)/20;
        this.ySpd = this.yGutter * (-1);
      }else if(this.cursorY>this.game.input.y+40){

        this.yGutter = Math.abs(this.cursorY - this.game.input.y)/20;
        this.ySpd = this.yGutter * 1;
      }

      //On change la couleur de la balle
      this.changeColor();

      //On modifie les bruitages en fonction
      this.sHold.pause();

      this.currSpd += (this.power) + (this.combo/30);
      if(this.power>=1.5){console.log('Puissance du hold: ',this.power);}
      this.playing = true;
      this.slowOn = false;

      //this.sprGlow.scale.setTo(0.3,0.3);
      this.game.add.tween(this.sprGlow).to( { alpha: 0.2 }, 200, Phaser.Easing.Linear.None, true);
      //this.game.add.tween(this.sprGlow).to( { tint: 0xffffff }, 100, Phaser.Easing.Linear.None, true);
      this.game.add.tween(this.sprGlow.scale).to( {x:BALLGLOWMAX, y:BALLGLOWMAX }, 100, Phaser.Easing.Linear.None, true);

      //Qui a touché la balle en dernier
      if(this.x<gwx){ //P1
        this.lastHit = 0;
      }else{
        this.lastHit = 1;
      }
    }
  }
}

//Fonction qui ajoute du pouvoir aux balles chargés
Ball.prototype.addPower = function() {
  if(this.power<MAXPOWER-0.1){
    this.power += HOLDPOWERADD;
  }
}

//Changement de couleur
Ball.prototype.changeColor = function() {
  if(this.color>0){
    this.color=0;
  }else{
    if(this.dir===-1){
      this.color=1;
    }else{
      this.color=2;
    }
  }
  //On change le sprite en fonction
  this.spr.frame = this.color;
}
/*
Ball.prototype.drawLine = function(){
  bmd.clear();
  bmd.ctx.beginPath();
  bmd.ctx.beginPath();
  bmd.ctx.moveTo(10, 10);
  bmd.ctx.lineTo(game.input.x , game.input.y);
  bmd.ctx.lineWidth = 4;
  bmd.ctx.stroke();
  bmd.ctx.closePath();
  bmd.render();
  bmd.refreshBuffer();
};
*/

//Lancement de la balle
Ball.prototype.goBall = function() {
  workingButtons = true;

  //On lance un son bruitages
  this.sHit.play('sndHit');

  this.currSpd = this.baseSpd;
  this.dir = Math.round(Math.random(0,1));
    if(!this.dir){this.dir = -1;}
  this.playing = true;
  this.sprGlow.inputEnabled = true;
  //On change la couleur de la balle
  this.changeColor();
}

//Reset de la balle
Ball.prototype.reset = function() {
  //Variable de deplacements
  this.currSpd = this.baseSpd;
  this.ySpd = 0;
  this.dir = undefined;
  this.slowSpd = undefined;
  this.slowOn = false;
  //Variables specifiques
  this.type = undefined;
  this.combo = 0;
  this.power = BASEPOWER;
  this.color = 0;
  this.lastHit = undefined;
  this.playing = false;

  this.x = gwx;
  this.y = gwy;
  //Timers
  this.holdTimer = game.time.create(false);

  this.spr.alpha = 0;
  this.spr.frame = 0;

  this.sprGlow.inputEnabled = false;
  this.sprGlow.scale.setTo(BALLGLOWMAX);
  this.sprGlow.alpha = 0.2;

  this.game.add.tween(this.spr).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);

  this.sGoal.pause();
}

//Classe de l'objet Player
Player = function(id, game) {
  this.level = 1;
  this.exp = 0;
  this.score = 0;

  this.id = id;
  this.game = game;

  //Variables graphiques et inputs
}

//Update de la balle
Player.prototype.update = function() {
}
