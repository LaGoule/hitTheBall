var boot = function(game){
	console.log("1. Booting the coin war!");
};

boot.prototype = {
	preload: function(){
		//Image de la barre de chargement
    this.game.load.image("loading","res/loading.png");
		//Image de la ball
    this.game.load.spritesheet("ball","res/ballsheet.png",250,250);
    //this.game.load.image("ball","res/ball.png");
    this.game.load.image("redball","res/redball.png");
	},
	create: function(){
		//Standard settings (Scale, Screen size set, etc..)
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;

		//A activer pour connaitre les fps
		this.game.time.advancedTiming = true;
		//Futur fonction de setScreenSize
		//this.scale.setScreenSize();
		this.game.state.start("Preload");
	}
}
