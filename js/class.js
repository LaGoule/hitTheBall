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
  this.gSpr = game.add.group();
    this.spr = game.add.sprite(this.x,this.y,"ball");
      this.spr.frame = 0;
      this.spr.scale.setTo(0.5);
      this.spr.anchor.setTo(0.5);
    this.sprGlow = game.add.sprite(this.x,this.y,"redball");
      this.sprGlow.alpha = 0.2;
      this.sprGlow.inputEnabled = true;
      this.sprGlow.events.onInputDown.add(this.slowTheBall, this);
      this.sprGlow.events.onInputUp.add(this.hitTheBall, this);
      this.sprGlow.scale.setTo(BALLGLOWMAX);
      this.sprGlow.anchor.setTo(0.5);
  this.gSpr.add(this.sprGlow);
  this.gSpr.add(this.spr);

  //Variables sonores
  this.sfx = game.add.audio('snd_hitball');
    this.sfx.allowMultiple = true;
    this.sfx.addMarker('release_ball', 0.1, 4, 0.5, 0);
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
  this.gSpr.x = this.x;
  this.gSpr.y = this.y;
}

//Gestion de tous les deplacements de la balle
Ball.prototype.move = function() {
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
    this.sfx.play('release_ball');

    endRound(this.game, winner);
  }
}

Ball.prototype.rebound = function() {
  //Fait rebondir la balle sur les bords haut et bas
  if(this.y<=0+(this.spr.height/2)-this.ySpd || this.y>=gwh-(this.spr.height/2)-this.ySpd){
    this.ySpd *= (-BOUNCEEFFECT);
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
  if(workingButtons){
    if(this.x<=gwx && this.color===1 || this.x>gwx && this.color===2){
      this.slowOn = true;
      this.power = BASEPOWER;

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
      //Formule à modifier pour empecher de se passer la balle à soit même
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
      if(this.cursorY<this.game.input.y-40){

        this.yGutter = Math.abs(this.game.input.y - this.cursorY)/50;
        this.ySpd = this.yGutter * (-1);
      }else if(this.cursorY>this.game.input.y+40){

        this.yGutter = Math.abs(this.cursorY - this.game.input.y)/50;
        this.ySpd = this.yGutter * 1;
      }

      //On change la couleur de la balle
      this.changeColor();

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

//Lancement de la balle
Ball.prototype.goBall = function() {
  workingButtons = true;

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
