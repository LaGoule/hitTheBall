var boot = function(game){
	console.log("1. Booting the coin war!");
};

boot.prototype = {
	preload: function(){
		//Image de la barre de chargement
    this.game.load.image("loading","res/loading.png");
		//Image de la ball
    this.game.load.image("ball","res/ball.png");
	},
	create: function(){
		//Standard settings (Scale, Screen size set, etc..)
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		//Futur fonction de setScreenSize
		//this.scale.setScreenSize();
		this.game.state.start("Preload");
	}
}
