var preload = function(game){}

preload.prototype = {
	preload: function(){
				//On affiche la barre de chargement pendant le preload
	      var loadingBar = this.add.sprite(this.game.world.centerX,this.game.world.centerY,"loading");
	      loadingBar.anchor.setTo(0.5,0.5);
	      this.load.setPreloadSprite(loadingBar);
		//Assets de l'écran titre
		this.game.load.image("gametitle","res/gametitle.png");
		this.game.load.spritesheet("play","res/playsheet.png",610,180);
		//this.game.load.image("play","res/play.png");
	  this.game.load.image('bg','res/flatbg.jpg');

		//Assets du jeu
		//Image de la balle
    this.game.load.spritesheet("ball","res/ballsheet.png",250,250);
    //this.game.load.image("ball","res/ball.png");
    this.game.load.image("redball","res/redball.png");

		//Son et bruitages
		this.game.load.audio("snd_hitball", 'snd/release_ball.mp3');

		console.log("2. All assets are preloaded.");
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}
