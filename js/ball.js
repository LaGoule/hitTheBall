//Classe de l'objet Ball
Ball = function(game) {
  //Variable de deplacements
  this.baseSpd = BASESPEED;
  this.currSpd = this.baseSpd;
  this.ySpd = 0;
  this.delaySpd = 0;
  this.maxDelaySpd = 0;
  this.dir = undefined;
  this.slowSpd = undefined;
  this.slowFactor = BASESLOWFACTOR;
  //Variables specifiques
  this.state = 0; //0=Inactive, 1=Moving, 2=Goal
  this.type = 1; //0=Slow, 1=Normal, 2=Dropshot, 3=?, 4=?
  this.combo = 0;
  this.power = BASEPOWER;
  this.gem = 0;
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

  this.gBall.add(this.sprGlow);
  this.gBall.add(this.spr);

  //Variables sonores
  this.sHit = game.add.audio('snd_hitball');
    this.sHit.allowMultiple = true;
    this.sHit.addMarker('sndHit', 0.2, 1.2, 0.06, 0);
    this.sHit.addMarker('sndWall', 0.5, 0.8, 0.22, 0);
    this.sHit.addMarker('sndDrop', 0.4, 0.3, 0.14, 0);
  this.sHold = game.add.audio('snd_holdball');
    this.sHold.allowMultiple = false;
    this.sHold.addMarker('sndHold', 0.1, 2.2, 0.12, 0);
  this.sGoal = game.add.audio('snd_goal');
    this.sGoal.allowMultiple = false;
    this.sGoal.addMarker('sndGoal', 0.3, 6, 1.2, 0);
  this.sGem = game.add.audio('snd_gem');
    this.sGem.allowMultiple = true;
    this.sGem.addMarker('sndGem', 1.2, 0.2, 0.30, 0);
}

//Update de la balle
Ball.prototype.update = function() {
  if(workingButtons){
    //Goal si la balle sort du terrain
    this.goals();
    //Si on change de side on change de couleur
    this.changeSide();
    //Rebond sur les bords haut et bas
    this.rebound();
    //La balle suit son comportement de deplacement
    this.move();
  }
  //On deplace toujours les sprites sur l'objet
  this.gBall.x = this.x;
  this.gBall.y = this.y;
}

//Gestion de tous les deplacements de la balle
Ball.prototype.move = function() {
  //Switch de comportement de deplacement de la balle
  this.behaviour();
}

Ball.prototype.behaviour = function() {
  //Switch en fonction de state
  switch(this.state) {
    case 0: //Inactive
      this.sprGlow.tint = black;
    break;
    case 1: //Moving, where the fun start
      //Switch de différents coups !!
      switch(this.type) {
        case 0: //Slow
          this.sprGlow.tint = purple;
          this.slowMove();
        break;
        case 1: //Normal
          this.sprGlow.tint = green;
          this.normalMove();
          this.ySpdRectif(0.9);
        break;
        case 2: //Dropshot
          this.sprGlow.tint = red;
          this.dropMove();
        break;
        case 3: //Wallbounce
          this.sprGlow.tint = blue;
          this.normalMove();
          this.ySpdRectif(1.4);
        break;
      }
    break;
    case 2: //Goal, not so fun but still
      this.sprGlow.tint = white;
    break;
  }
}

Ball.prototype.normalMove = function() {
  this.x += this.currSpd * this.dir;
  this.y += this.ySpd;
}

Ball.prototype.slowMove = function() {
  this.x += (this.currSpd / this.slowFactor) * this.dir;
  //On affiche le pointeur rouge
  this.sprClic.x =  this.game.input.x;
  this.sprClic.y =  this.game.input.y;
  this.sprClic.alpha = 0.5;
}

Ball.prototype.dropMove = function() {
  //A refaire
  if(this.delaySpd<this.maxDelaySpd){
    let addSpd = this.delaySpd * 0.02;
    this.currSpd += addSpd;
    this.delaySpd += addSpd;
  }else if(this.delaySpd>=this.maxDelaySpd){
    this.delaySpd = 0;
    this.maxDelaySpd = 0;
  }
  this.normalMove();
}

Ball.prototype.ySpdRectif = function(amount) {
  if(Math.abs(this.ySpd)>0.4){//Creer une constante ici
    this.ySpd = this.ySpd - (this.ySpd/(YRECTIF*amount));
  }
}

Ball.prototype.goals = function() {
  //Declenche la fin du round si la balle sort sur un des côtés
  if(this.x>gww+this.spr.width/2+GMARGIN*5 || this.x<0-this.spr.width/2-GMARGIN*5){
    this.state = 2;
    let winner = 0;
    //Animation de goal
    this.game.add.tween(this.sprGlow.scale).to( {x:4, y:4 }, 1000, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.sprGlow).to( {alpha:0 }, 1000, Phaser.Easing.Linear.None, true);
    //Définir qui marque le point
    if(this.dir===1){
      winner=0;
    }else if(this.dir===-1){
      winner=1;
    }
    //On lance un son bruitages
    this.sGoal.play('sndGoal');
    //On lance la fin du round
    endRound(this.game, winner);
  }
}

Ball.prototype.rebound = function() {
  //Fait rebondir la balle sur les bords haut et bas
  if(this.y<=0+(this.spr.height/2)-this.ySpd || this.y>=gwh-(this.spr.height/2)-this.ySpd){
    this.type = 3;

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
    this.changeGem();
  }
}

//Fonction slowTheBall
Ball.prototype.slowTheBall = function() {
  if(workingButtons && this.type!=0){
    if(this.x<=gwx && this.gem===1 || this.x>gwx && this.gem===2){
      this.type = 0;
      this.power = BASEPOWER

      //On lance un son bruitages
      this.sHold.play('sndHold');

      //Timer pour connaitre la vitesse du coup
      this.holdTimer.loop(HOLDLOOPMS, this.addPower, this);
      this.holdTimer.start();

      this.game.add.tween(this.sprGlow.scale).to( {x:BALLGLOWMIN, y:BALLGLOWMIN }, 500, Phaser.Easing.Linear.None, true);
      this.game.add.tween(this.sprGlow).to( { alpha: BALLALPHAMAX }, 1200, Phaser.Easing.Linear.None, true);

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
    if(this.x<=gwx && this.gem===1 || this.x>gwx && this.gem===2){
      let pnb = player;

      //On detruit le timer de hold
      this.holdTimer.destroy();

      //On cache le pointeur rouge
      this.sprClic.alpha = 0;

      //On incrémente le combo de passes
      this.combo++;
      txCombo.setText(this.combo);
      txSpd.setText((Math.floor(this.currSpd)) + 'm/s');

      //On modifie vitesse et direction
      //A changer --> faire fonction de tirs général (amortis, smash, slices)
      //Deplacer la balle en fonction de l'angles du pointeurs
      if(this.cursorX+10<this.game.input.x){
        this.type = 1;
        this.dir = -1;
        //On lance un son bruitages
        this.sHit.play('sndHit');
        //log
        console.log('Player ', this.lastHit+1, ' HOLDSHOT!');
      }else if(this.cursorX-10>this.game.input.x){
        this.type = 1;
        this.dir = 1;
        //On lance un son bruitages
        this.sHit.play('sndHit');
        //log
        console.log('Player ', this.lastHit+1, ' HOLDSHOT!');
      }else{
        this.type = 2;
        this.dir *= (-1);
        this.currSpd *= 0.5; //Teste
        this.delaySpd = this.currSpd;
        this.maxDelaySpd = this.delaySpd * 2.2;
        //On lance un son bruitages
        this.sHit.play('sndDrop');
        //log
        console.log('Player ', this.lastHit+1, ' DROPSHOT!');
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
      this.changeGem();

      //On modifie les bruitages en fonction
      this.sHold.pause();

      this.currSpd += (this.power) + (this.combo/30);
      if(this.power>=1.5){console.log('Puissance du hold: ',this.power);}
      this.playing = true;

      this.game.add.tween(this.sprGlow.scale).to( {x:BALLGLOWMAX, y:BALLGLOWMAX }, 400, Phaser.Easing.Linear.None, true);
      this.game.add.tween(this.sprGlow).to( { alpha: BALLAPLHAMIN }, 400, Phaser.Easing.Linear.None, true);

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
  if(this.power<MAXPOWER){ //Attention !
    this.power += HOLDPOWERADD;
  }
}

//Changement de couleur
Ball.prototype.changeGem = function() {
  if(this.gem>0){
    this.gem=0;
  }else{
    //On lance un son bruitages
    this.sGem.play('sndGem');

    if(this.dir===-1){
      this.gem=1;
    }else{
      this.gem=2;
    }
  }
  //On change le sprite en fonction
  this.spr.frame = this.gem;
}

//Lancement de la balle
Ball.prototype.goBall = function() {
  workingButtons = true;
  this.state = 1;
  this.type = 1;

  //On lance un son bruitages
  this.sHit.play('sndHit');

  this.currSpd = this.baseSpd;
  this.dir = Math.round(Math.random(0,1));
    if(!this.dir){this.dir = -1;}
  this.playing = true;
  this.sprGlow.inputEnabled = true;

  txSpd.setText((Math.floor(this.currSpd)) + 'm/s');
  //On change la couleur de la balle
  this.changeGem();
}

//Reset de la balle
Ball.prototype.reset = function() {
  //Variable de deplacements
  this.currSpd = this.baseSpd;
  this.ySpd = 0;
  this.delaySpd = 0;
  this.maxDelaySpd = 0;
  this.dir = undefined;
  this.slowSpd = undefined;
  //Variables specifiques
  this.state = 0
  this.type = 1;
  this.combo = 0;
  this.power = BASEPOWER;
  this.gem = 0;
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
  this.sprGlow.alpha = BALLALPHAMAX;
  this.sprGlow.tint = black;

  this.sprClic.alpha = 0;

  this.game.add.tween(this.spr).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
  this.game.add.tween(this.sprGlow).to( { alpha: BALLALPHAMIN }, 700, Phaser.Easing.Linear.None, true);

  this.sGoal.pause();

  txCombo.setText(this.combo);
  txSpd.setText('0' + 'm/s');
}
