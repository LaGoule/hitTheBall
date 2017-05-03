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
    muteButton = this.game.add.sprite(40,20,"icons");
      muteButton.frame = 0;
      muteButton.inputEnabled = true;
      muteButton.events.onInputDown.add(this.muteMusic, this);
      muteButton.anchor.setTo(0,0);
      muteButton.scale.setTo(0.3,0.3);
    fullButton = this.game.add.sprite(gww-36,20,"icons");
      fullButton.frame = 2;
      fullButton.inputEnabled = true;
      fullButton.events.onInputDown.add(this.fullscreen, this);
      fullButton.anchor.setTo(1,0);
      fullButton.scale.setTo(0.24,0.24);

		console.log("3. GameTitle is loaded and ready.");
	},
	playTheGame: function(){
		this.game.state.start("Match");
	},
  muteMusic: function(){
    if(oMusic){
      oMusic = false;
      muteButton.frame = 1;
    }else{
      oMusic = true;
      muteButton.frame = 0;
    }
  },
  fullscreen: function(){
    if (this.game.scale.isFullScreen){
      this.game.scale.stopFullScreen();
    }else{
      this.game.scale.startFullScreen(false);
    }
  }
}
