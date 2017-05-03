var boot = function(game){
	console.log("1. Booting the coin war!");
};

boot.prototype = {
	preload: function(){
		//Image de la barre de chargement
    this.game.load.image("loading","res/loading.png");
	},
	create: function(){
		//Standard settings (Scale, Screen size set, etc..)
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
    //this.game.scale.pageAlignVertically = true;
		// Stretch to fill
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
		//Désactive l'anti-aliasing
		this.game.stage.smoothed = false;
		//A activer pour connaitre les fps
		this.game.time.advancedTiming = true;

		//Futur fonction de setScreenSize
		//this.scale.setScreenSize();
		this.game.state.start("Preload");
	}
}
