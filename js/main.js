var match = function(game){
	//Variables générales
	p = []; //Objet qui contient les deux joueurs
	workingButtons = true; //Pour la pause etc...
  matchRound = undefined; //Contient le numero du round
  matchEnd = false; //
	bestPlayer = undefined; //Contient le joueur dont le score est le plus haut

	BASESPEED = 4;
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

		//Classe de l'objet Ball
		Ball = function(game) {
			this.baseSpd = BASESPEED;
			this.currSpd = this.baseSpd;
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

			this.spr = game.add.sprite(this.x,this.y,"ball");
				this.spr.inputEnabled = true;
				this.spr.events.onInputDown.add(this.slowTheBall, this);
				this.spr.events.onInputUp.add(this.hitTheBall, this);
				this.spr.scale.setTo(0.5);
				this.spr.anchor.setTo(0.5);
		}

		//Update de la balle
		Ball.prototype.update = function() {
			//Formule de vitesse de la balle
			if(this.playing && !this.slowOn){
				this.x += this.currSpd * this.dir;
			}else if(this.playing && this.slowOn){
				this.x += (this.currSpd / this.slowFactor) * this.dir;
			}

			//On deplace toujours le sprite sur l'objet
			this.spr.x = this.x;
			this.spr.y = this.y;

			//On modifie xToGoal
			if(this.dir===1){
				this.xToGoal = Math.floor(gww + (this.x-gww));
			}else{
				this.xToGoal = Math.floor(0 + this.x);
			}

			//Goal si la balle sort du terrain
			if(this.x>gww+this.spr.width/2+GMARGIN || this.x<0-this.spr.width/2-GMARGIN){
				endRound(this.game, this.lastHit);
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
			//this.playing = false;
			this.slowOn = true;
		}

		//Fonction hitTheBall
		Ball.prototype.hitTheBall = function(type, player) {
			if(workingButtons){
				let pnb = player;

				//On incrémente le combo de passes
				this.combo++;

				//On modifie vitesse et direction
				this.dir *= (-1);
				this.currSpd *= ((this.combo/10)+1);
				this.playing = true;
				this.slowOn = false;

				//Qui a touché la balle en dernier
				if(this.x<gwx){ //P1
					this.lastHit = 0;
				}else{
					this.lastHit = 1;
				}
				//console.log('Balle renvoyé par: Joueur ',this.lastHit+1);
			}
		}

		//Reset de la balle
		Ball.prototype.reset = function() {
			this.currSpd = 0;
			this.dir = undefined
			this.type = undefined;
			this.combo = 0;
			this.lastHit = undefined; //P1 ou P2
			this.playing = false;

			this.x = gwx;
			this.y = gwy;
		}

    //Classe de l'objet Player
    Player = function(id, game) {
			this.level = 1;
			this.exp = 0;
      this.score = 0;

			this.id = id;
			this.game = game;

			/*
			this.btn = game.add.graphics(0, 0);
				this.btn.alpha = 0.3;
				this.btn.anchor = 1;
				this.btn.beginFill(0x00FF33, 0.8);
				this.btn.lineStyle(0);
				this.btn.drawRect(GMARGIN,GMARGIN,gwx-GMARGIN*2,gwh-GMARGIN*2);
		    this.btn.inputEnabled = true;
	    	this.btn.events.onInputDown.add(theBall.slowTheBall, this);
	    	this.btn.events.onInputUp.add(theBall.hitTheBall, this);
			*/
    }

		//Update de la balle
		Player.prototype.update = function() {
		}

		//Fonction pressShoot
		Player.prototype.pressShoot = function() {
			if(workingButtons){
				this.btn.alpha = 1;
			}
		}

		//Fonction releaseShoot
		Player.prototype.releaseShoot = function() {
			if(workingButtons){
				this.btn.alpha = 0.3;
			}
		}

		//Fonction qui dessine le plateau de jeu
		drawBoard(this);

		//Initialize la partie (créer p0 et p1 + theBall)
		initMatch(this);

    //Fonction d'initialisation de la partie
		function initMatch(game){
	    p[0] = new Player(0, game);
	    p[1] = new Player(1, game);
	    matchRound = 1;
			theBall = new Ball(game);
			//On lance la balle
			theBall.goBall();
			//On affiche un message de début de partie
			console.log('---> Bonne partie! | Round: ',matchRound);
			console.log('Direction de la balle:  ',theBall.dir);
		};

    //Fonction de création des deux joueurs
		function endRound(game, winn){
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

			//1. On attribue les points
			p[winner].score += 1;
			console.log('Gagnant du round: Joueur ', winner+1);
			console.log('Fin du round, score: ',p[0].score,'-',p[1].score);
			//2. On montre de niveau les joueurs

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

			//4. On lance un nouveau round
			if(!matchEnd){
				newRound(self);
			}
		};

    //Fonction qui enclenche le prochain round
		function newRound(game){
			//On arrête la ball
			theBall.reset();
			//On lance la balle
			theBall.goBall();
		};

    //Fonction qui retourne le joueur en tête
		function whoIsAhead(game){
			let best = undefined;

			if(p[0].score==p[1].score){
				best = -1;
			}else if(p[0].score<p[1].score){
				best = 1;
			}else{
				best = 0;
			}

			return best;
		};

		function drawBoard(parent){

			let self = parent;
	    let stroke = 10;

			//Styles
	    stSimple = { font: "60px Arial", fill: "#ffdd66", align: "center" };

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
		}
  },

  //Update se lance toute les frames après l'événement create
  update: function() {
		//Update de la balle
		theBall.update();

		//Pseudo HUD
		this.game.debug.text("Score de J1: " + p[0].score, 32,32);
		this.game.debug.text("Score de J2: " + p[1].score, gww-170,32);
		this.game.debug.text("COMBO: " + theBall.combo, gwx-40,32);

		//Fin du match
		if(matchEnd){
			if(bestPlayer){
				var winX = gww-170;
			}else{
				var winX = 32;
			}
			this.game.debug.text("GAGNANT: J" + (bestPlayer+1) + '!',winX,gwy);
		}
	}
};
