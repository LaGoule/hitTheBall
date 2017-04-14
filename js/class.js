//Classe de l'objet Ball
Ball = function(game) {
  this.baseSpd = BASESPEED;
  this.currSpd = this.baseSpd;
  this.ySpd = 0;
  this.dir = undefined;
  this.type = undefined;
  this.combo = 0;
  this.power = BASEPOWER;
  this.lastHit = undefined; //P1 ou P2
  this.playing = false;

  this.slowSpd = undefined;
  this.slowFactor = BASESLOWFACTOR;
  this.slowOn = false;

  this.x = 0;
  this.y = 0;
  this.xToGoal = undefined;
  this.game = game;

  this.holdTimer = game.time.create(false);

  this.gSpr = game.add.group();

  this.spr = game.add.sprite(this.x,this.y,"ball");
    this.spr.scale.setTo(0.5);
    this.spr.anchor.setTo(0.5);

  this.sprGlow = game.add.sprite(this.x,this.y,"redball");
    this.sprGlow.alpha = 0.2;
    this.sprGlow.inputEnabled = true;
    this.sprGlow.events.onInputDown.add(this.slowTheBall, this);
    this.sprGlow.events.onInputUp.add(this.hitTheBall, this);
    this.sprGlow.scale.setTo(0.4);
    this.sprGlow.anchor.setTo(0.5);

  //On ajoute les sprite au groupe
  this.gSpr.add(this.sprGlow);
  this.gSpr.add(this.spr);
}

//Update de la balle
Ball.prototype.update = function() {
  if(workingButtons){
    //Formule de vitesse de la balle
    if(this.playing && !this.slowOn){
      this.x += this.currSpd * this.dir;
      this.y += this.ySpd;
    }else if(this.playing && this.slowOn){
      this.x += (this.currSpd / this.slowFactor) * this.dir;
      //this.y += this.ySpd;
    }
    //Desceleration Y
    if(Math.abs(this.ySpd)>0.4){//Creer une constante ici
      this.ySpd = this.ySpd - (this.ySpd/YRECTIF)
    }

    //On deplace toujours les sprites sur l'objet
    this.gSpr.x = this.x;
    this.gSpr.y = this.y;

    //Goal si la balle sort du terrain
    if(this.x>gww+this.spr.width/2+GMARGIN*5 || this.x<0-this.spr.width/2-GMARGIN*5){
      endRound(this.game, this.lastHit);
    }
    //Rebond sur les bords haut et bas
    if(this.y<=0+(this.spr.height/2)-this.ySpd || this.y>=gwh-(this.spr.height/2)-this.ySpd){
      this.ySpd *= (-BOUNCEEFFECT);
    }
    //Option pour un joueur -> mur de droite
    /*
    if(this.x+this.spr.width/2>=gww){
      this.dir *= (-1);
    }
    if(this.x-this.spr.width/2<=0){
      this.dir *= (-1);
    }
    */
  }
}

//Gestion de tous les deplacements de la balle /////////// A FAIRE !
Ball.prototype.move = function() {
}

//Fonction qui ajoute du pouvoir aux balles chargés
Ball.prototype.addPower = function() {
  if(this.power>=MAXPOWER){
    this.power -= 1;
  }
}

//Lancement de la balle
Ball.prototype.goBall = function() {
  workingButtons = true;

  this.currSpd = this.baseSpd;
  this.dir = Math.round(Math.random(0,1));
    if(!this.dir){this.dir = -1;}
  this.type = 0;
  this.playing = true;
  this.sprGlow.inputEnabled = true;
}

//Fonction slowTheBall
Ball.prototype.slowTheBall = function() {
  if(workingButtons){
    this.slowOn = true;
    this.power = BASEPOWER;

    //Timer pour connaitre la vitesse du coup
    this.holdTimer.loop(100, this.addPower, this);
    this.holdTimer.start();

    this.sprGlow.scale.setTo(0.4,0.4);
    this.game.add.tween(this.sprGlow).to( { alpha: 0.6 }, 100, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.sprGlow.scale).to( {x:0.3, y:0.3 }, 200, Phaser.Easing.Linear.None, true);

    //On calcule le lancer sur Y
    this.cursorX = this.game.input.x;
    this.cursorY = this.game.input.y;
    this.ySpd = 0;
  }
}

//Fonction hitTheBall
Ball.prototype.hitTheBall = function(type, player) {
  if(workingButtons){
    let pnb = player;

    this.holdTimer.destroy();

    //On incrémente le combo de passes
    this.combo++;
    //On modifie le meilleur combo si nécessaire
    if(this.combo>bestCombo){
      bestCombo = this.combo;
    }
    if(this.power===BASEPOWER){
      this.power = 0;
    }

    //On modifie vitesse et direction
    //Formule à modifier pour empecher de se passer la balle à soit même
    this.dir *= (-1);
    this.currSpd += (this.power/2) + (this.combo/14);
    console.log('Puissance du hold: ',this.power);
    this.playing = true;
    this.slowOn = false;

    //this.sprGlow.scale.setTo(0.3,0.3);
    this.game.add.tween(this.sprGlow).to( { alpha: 0.2 }, 200, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.sprGlow.scale).to( {x:0.4, y:0.4 }, 100, Phaser.Easing.Linear.None, true);

    //Qui a touché la balle en dernier
    if(this.x<gwx){ //P1
      this.lastHit = 0;
    }else{
      this.lastHit = 1;
    }

    //Teste pour le deplacement Y MOOOOOOOCHE
    if(this.cursorY<this.game.input.y-40){

      this.yGutter = Math.abs(this.game.input.y - this.cursorY)/40;
      this.ySpd = this.yGutter * (-1);
    }else if(this.cursorY>this.game.input.y+40){

      this.yGutter = Math.abs(this.cursorY - this.game.input.y)/40;
      this.ySpd = this.yGutter * 1;
    }
  }
}

//Reset de la balle
Ball.prototype.reset = function() {
  this.currSpd = 0;
  this.ySpd = 0;
  this.dir = undefined
  this.type = undefined;
  this.combo = 0;
  this.lastHit = undefined; //P1 ou P2
  this.playing = false;
  this.power = BASEPOWER;

  this.x = gwx;
  this.y = gwy;

  this.spr.alpha = 0;
  this.sprGlow.inputEnabled = false;
  this.sprGlow.scale.setTo(0.4);
  this.sprGlow.alpha = 0.2;

  this.game.add.tween(this.spr).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
}

//Classe de l'objet Player
Player = function(id, game) {
  this.level = 1;
  this.exp = 0;
  this.score = 0;

  this.id = id;
  this.game = game;
}

//Update de la balle
Player.prototype.update = function() {
}
