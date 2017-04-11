var match = function(game){
	//Variables générales
	p = []; //Objet qui contient les deux joueurs
	workingButtons = true; //Pour la pause etc...
  matchRound = undefined; //Contient le numero du round
  matchEnd = false; //
	bestPlayer = undefined; //Contient le joueur dont le score est le plus haut

	BASESPEED = 4;//3
	BASESLOWFACTOR = 8;
	POINTSPERMATCH = 3;
	PLAYERNB = 2;
	GMARGIN = 10;
}

//On créer l'état qui gère le match 1v1
match.prototype = {
  preload: function() {
		//Variables de positionnement
		gwx = this.game.world.centerX; gwy = this.game.world.centerY;
		gww = this.game.world.width; gwh = this.game.world.height;
  },

  create: function() {
		//On déclanche le moter physique ARCADE
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		//Classe de l'objet Ball
		Ball = function(game) {
			this.baseSpd = BASESPEED;
			this.currSpd = this.baseSpd;
			this.ySpd = 0;
			this.dir = undefined;
			this.type = undefined;
			this.combo = 0;
			this.lastHit = undefined; //P1 ou P2
			this.playing = false;

			this.slowSpd = undefined;
			this.slowFactor = BASESLOWFACTOR;
			this.slowOn = false;

			this.x = gwx;
			this.y = gwy;
			this.xToGoal = undefined;
			this.game = game;

			this.sprGlow = game.add.sprite(this.x,this.y,"redball");
				this.sprGlow.alpha = 0.3;
				this.sprGlow.inputEnabled = true;
				this.sprGlow.events.onInputDown.add(this.slowTheBall, this);
				this.sprGlow.events.onInputUp.add(this.hitTheBall, this);
				this.sprGlow.scale.setTo(0.4);
				this.sprGlow.anchor.setTo(0.5);

			this.spr = game.add.sprite(this.x,this.y,"ball");
				this.spr.scale.setTo(0.5);
				this.spr.anchor.setTo(0.5);
			//On active la physique sur les sprites de Ball
			game.physics.enable( [ this.spr, this.sprGlow ], Phaser.Physics.ARCADE);
		}

		//Update de la balle
		Ball.prototype.update = function() {
			if(workingButtons){
				//Formule de vitesse de la balle
				if(this.playing && !this.slowOn){
					this.x += (-Math.abs(this.ySpd)) + this.currSpd * this.dir;
					this.y += this.ySpd * (1+(this.combo/10));
				}else if(this.playing && this.slowOn){
					this.x += (-Math.abs(this.ySpd)) + (this.currSpd / this.slowFactor) * this.dir;
					//this.y += (this.ySpd * 1+(this.combo/10)/ this.slowFactor);
				}
				//Desceleration Y
				if(this.ySpd){
					this.ySpd -= this.ySpd/40;
				}

				//On deplace toujours le sprite sur l'objet
				this.spr.x = this.x;
				this.spr.y = this.y;
				this.sprGlow.x = this.x;
				this.sprGlow.y = this.y;

				//On modifie xToGoal
				/*
				if(this.dir===1){
					this.xToGoal = Math.floor(gww + (this.x-gww));
				}else{
					this.xToGoal = Math.floor(0 + this.x);
				}
				*/

				//Goal si la balle sort du terrain
				if(this.x>gww+this.spr.width/2+GMARGIN*5 || this.x<0-this.spr.width/2-GMARGIN*5){
					endRound(this.game, this.lastHit);
				}
			}
		}


		//Lancement de la balle
		Ball.prototype.goBall = function() {
			this.currSpd = this.baseSpd;
			this.dir = Math.round(Math.random(0,1));
				if(!this.dir){this.dir = -1;}
			this.type = 0;
			this.playing = true;
		}

		//Fonction slowTheBall
		Ball.prototype.slowTheBall = function() {
			if(workingButtons){
				//this.playing = false;
				this.slowOn = true;
				this.sprGlow.alpha = 0.5;
				this.sprGlow.scale.setTo(0.32);

				//On calcule le lancer sur Y
				this.cursorY = this.game.input.y;
				this.ySpd = 0;
			}
		}

		//Fonction hitTheBall
		Ball.prototype.hitTheBall = function(type, player) {
			if(workingButtons){
				let pnb = player;

				//On incrémente le combo de passes
				this.combo++;
				txCombo.setText(theBall.combo);

				//On modifie vitesse et direction
				//Formule à modifier pour empecher de se passer la balle à soit même
				this.dir *= (-1);
				this.currSpd += 0.5 + (this.combo/10);
				this.playing = true;
				this.slowOn = false;
				this.sprGlow.alpha = 0.3;
				//this.add.tween(this.sprGlow.scale).to({ x: 2, y: 2}, 1000, Phaser.Easing.Linear.None, true);
				//this.add.tween(this.sprGlow.scale).to({ x: 2, y: 2 }, 500, Phaser.Easing.Back.Out, true, 1000);
				this.sprGlow.scale.setTo(0.4);
				//Qui a touché la balle en dernier
				if(this.x<gwx){ //P1
					this.lastHit = 0;
				}else{
					this.lastHit = 1;
				}

				//Teste pour le deplacement Y MOOOOOOOCHE
				if(this.cursorY<this.game.input.y+100){

					this.yGutter = (this.cursorY-this.game.input.y)/100;
					this.ySpd = this.yGutter * (-1);
					console.log('Ampleur du swipe: ',this.yGutter);
				}else if(this.cursorY>this.game.input.y-100){

					this.yGutter = (this.cursorY+this.game.input.y)/100;
					this.ySpd = this.yGutter * (-1);
					console.log('Ampleur du swipe: ',this.yGutter);
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

			this.x = gwx;
			this.y = gwy;

			this.spr.alpha = 0;
			this.game.add.tween(this.spr).to( { alpha: 1 }, 800, Phaser.Easing.Linear.None, true);
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

		//Fonction qui dessine le plateau de jeu
		drawBoard(this);

		//Initialize la partie (créer p0 et p1 + theBall)
		resetMatch();
		initMatch(this);

    //Fonction d'initialisation de la partie
		function initMatch(game){
	    p[0] = new Player(0, game);
	    p[1] = new Player(1, game);
	    matchRound = 1;
			theBall = new Ball(game);
			theBall.reset();
			//On lance la balle
			theBall.goBall();
			//On affiche un message de début de partie
			console.log('---> Bonne partie! | Round: ',matchRound);
			console.log('Direction de la balle:  ',theBall.dir);
		};

    //Fonction de création des deux joueurs
		function endRound(game, winn){
			workingButtons = false;
			let self = game;
			let winner = winn;

			//Si personne n'a toucher la balle
			if(winner===undefined){
				if(theBall.x < gwx){
					winner = 1;
				}else{
					winner = 0;
				}
			}

			goalZone = self.game.add.graphics(0, 0);
			//goalZone.lineStyle(0);
			if(winner){
				goalZone.beginFill(0xFF00CC, 0.3);
				goalZone.drawRect(0,0,gwx,gwh);
			}else{
				goalZone.beginFill(0x00EEFF, 0.3);
				goalZone.drawRect(gwx,0,gww,gwh);
			}
			goalZone.alpha = 0.4;

			//1. On attribue les points
			p[winner].score += 1;
			console.log('Gagnant du round: Joueur ', winner+1);
			console.log('Fin du round, score: ',p[0].score,'-',p[1].score);

			//2. On montre de niveau les joueurs?

			//3. Est-ce que la partie est fini?
			bestPlayer = whoIsAhead(self);

			if(bestPlayer!=-1){
				if(p[bestPlayer].score>=POINTSPERMATCH){
					//Appelle d'une fonction qui termine le match ici
					theBall.reset();

					matchEnd = true;
					workingButtons = false;
				}
			}

			//4. On lance un nouveau round ou on arrête le match
			if(!matchEnd){
				//On arrête la ball
				theBall.reset();
				self.game.time.events.add(Phaser.Timer.SECOND * 2, newRound, this);
			}else{
				if(bestPlayer){
					var winX = gww-170;
				}else{
					var winX = 32;
				}
				self.game.debug.text("GAGNANT: J" + (bestPlayer+1) + '!',winX,gwy);
				self.game.time.events.add(Phaser.Timer.SECOND * 4, goTitle, this);
			}
		};

    //Fonction qui enclenche le prochain round
		function newRound(){
			workingButtons = true;
			//On retire le marqueur de goal
			goalZone.alpha = 0;
			//On arrête la ball
			theBall.reset();
			//On lance la balle
			//game.time.events.add(Phaser.Timer.SECOND * 3, theBall.goBall, this);
			theBall.goBall();
		};

    //Fonction qui retourne le joueur en tête
		function whoIsAhead(game){
			let best = undefined;
			//On teste lequel des deux joueurs à le plus haut score
			if(p[0].score==p[1].score){
				best = -1;
			}else if(p[0].score<p[1].score){
				best = 1;
			}else{
				best = 0;
			}
			//On retourne l'id du joueur.
			return best;
		}

		function goTitle(){
			game.state.start('GameTitle');
		}

		function resetMatch(){
			p = []; //Objet qui contient les deux joueurs
			workingButtons = true; //Pour la pause etc...
		  matchRound = undefined; //Contient le numero du round
		  matchEnd = false; //
			bestPlayer = undefined; //Contient le joueur dont le score est le plus haut
		}

		function drawBoard(parent){

			let self = parent;
	    let stroke = 10;

			//Styles
	    stSimple = { font: "90px Times", fill: "#ffdd66", align: "center" };

			var board = self.game.add.group()

	    //On charge la texture de fond
	    var bg = self.game.add.sprite(0,0,'bg');

			var pZones = self.game.add.graphics(0, 0);
				pZones.beginFill(0xFF00CC, 0.1);
				pZones.lineStyle(0);
				pZones.drawRect(0,0,gwx,gwh);

				pZones.beginFill(0x00EEFF, 0.1);
				pZones.lineStyle(0);
				pZones.drawRect(gwx,0,gww,gwh);

			window.graphics += pZones;

			txCombo = game.add.text(gwx,50,'0',stSimple);
			txCombo.anchor.setTo(0.5);
			txCombo.alpha = 0;
		}
  },

  //Update se lance toute les frames après l'événement create
  update: function() {
		//Update de la balle
		theBall.update();

		//Pseudo HUD
		/*
		this.game.debug.text("Score de J1: " + p[0].score, 32,32);
		this.game.debug.text("theBall.xToGoal: " + theBall.xToGoal, 32,70);
		this.game.debug.text("Score de J2: " + p[1].score, gww-170,32);
		this.game.debug.text("COMBO: " + theBall.combo, gwx-40,32);
		*/
	}
};
