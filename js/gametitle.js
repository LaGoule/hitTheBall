var gametitle = function(game) {}

gametitle.prototype = {
  create: function(){
    // Stretch to fill
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    //On charge un fond au bol
    var bg = this.game.add.sprite(0,0,'bg');
		var gameTitle = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY-100,"gametitle");
		  gameTitle.anchor.setTo(0.5,0.5);
		//var playButton = this.game.add.button(this.game.world.centerX,this.game.world.height-120,"play",this.playTheGame,this);
		//playButton.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.sprite(this.game.world.centerX,this.game.world.height-120,"play");
      playButton.inputEnabled = true;
      playButton.events.onInputDown.add(this.playTheGame, this);
      playButton.anchor.setTo(0.5,0.5);
      //playButton.animation.add('rainbow', [0,1,2,3,4,5], 20, true);
      //playButton.animation.play('rainbow');
		console.log("3. GameTitle is loaded and ready.");
	},
	playTheGame: function(){
		this.game.state.start("Match");
	}
}
