var gametitle = function(game) {}

gametitle.prototype = {
  create: function(){
    //On charge un fond au bol
    var bg = this.game.add.sprite(0,0,'bg');
		var gameTitle = this.game.add.sprite(this.game.world.centerX,200,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(this.game.world.centerX,400,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		console.log("3. GameTitle is loaded and ready.");
	},
	playTheGame: function(){
		this.game.state.start("Match");
	}
}
