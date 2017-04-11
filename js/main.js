var match = function(game){
	//Variables générales
	p = []; //Objet qui contient les deux joueurs
	workingButtons = true; //Pour la pause etc...
  matchRound = undefined; //Contient le numero du round
  matchEnd = false; //
	bestPlayer = undefined; //Contient le joueur dont le score est le plus haut
  bestCombo = 0;

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
		this.game.debug.text("COMBO: " + theBall.combo, gwx-40,32);
		this.game.debug.text("Best COMBO: " + bestCombo, gwx-58,52);
	}
};
