var preload = function(game){}

preload.prototype = {
	preload: function(){
				//On affiche la barre de chargement pendant le preload
	      var loadingBar = this.add.sprite(this.game.world.centerX,this.game.world.centerY,"loading");
	      loadingBar.anchor.setTo(0.5,0.5);
	      this.load.setPreloadSprite(loadingBar);
		//this.game.load.spritesheet("numbers","res/numbers.png",100,100);
		this.game.load.image("gametitle","res/gametitle.png");
		this.game.load.image("play","res/play.png");
		//this.game.load.image("gameover","res/gameover.png");
	  this.game.load.image('bg','res/flatbg.jpg');

		console.log("2. All assets are preloaded.");
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}
