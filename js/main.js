var match = function(game){
	//Variables générales
	p = []; //Objet qui contient les deux joueurs
	workingButtons = true; //Pour la pause etc...
  matchRound = undefined; //Contient le numero du round
  matchEnd = false; //
	bestPlayer = undefined; //Contient le joueur dont le score est le plus haut
  bestCombo = 0;
	goalZone = []; //Objet qui contient les goal visuel en cas de but
	glowTween = []; //Objet qui contient les tween de la balle

	//Couleurs
	red = '0xff0000';
	yellow = '0xdd9933';
	green = '0x55ff55';
	purple = '0xaa0099';
	blue = '0x4422ff';
	crimson = '0xff2244';
	white = '0xffffff';
	black = '0x222222';
	gray = '0x999999';

	BASESPEED = 4;
	BASESLOWFACTOR = 60;
	BOUNCEEFFECT = 1.04;
	HOLDLOOPMS = 140;
	HOLDPOWERADD = 0.2;
	BASEPOWER = 0.8;
	MAXPOWER = 1.9;
	YRECTIF = 40;

	POINTSPERMATCH = 5;
	PLAYERNB = 2;

	//Graphics
	GMARGIN = 10;
	BALLGLOWMAX = 0.48;
	BALLGLOWMIN = 0.32;
	BALLALPHAMAX = 0.5;
	BALLALPHAMIN = 0.2;
}

//On créer l'état qui gère le match 1v1
match.prototype = {
  preload: function() {
		//Musique
		music = this.game.add.audio('mus_children');
	    music.allowMultiple = false;
	    music.addMarker('normal', 2, 0, 0.24, 0);
  },

  create: function() {
		//On déclanche le moter physique ARCADE
		//this.game.physics.startSystem(Phaser.Physics.ARCADE);

		//Fonction qui dessine le plateau de jeu
		drawBoard(this);

		//Initialize la partie (créer p0 et p1 + theBall)
		resetMatch();
		initMatch(this);
  },

  update: function() {
		//Update de la balle
		theBall.update();

		//Pseudo HUD
		//this.game.debug.text("FPS: " + game.time.fps, 40,32);
		//this.game.debug.text("COMBO: " + theBall.combo, gwx-40,32);
		//this.game.debug.text("Best COMBO: " + bestCombo, gwx-58,52);
	}
};
