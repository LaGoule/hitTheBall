var preload = function(game){}

preload.prototype = {
	preload: function(){
		//On affiche la barre de chargement pendant le preload
    var loadingBar = this.add.sprite(this.game.world.centerX,this.game.world.centerY,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);

		//On initialise les variables des paramêtres
		oMusic = true;
		oSounds = true;
		oFx = true;
		oFullscreen = false;

		//Variables de positionnement
		gwx = this.game.world.centerX;
		gwy = this.game.world.centerY;
		gww = this.game.world.width;
		gwh = this.game.world.height;

		//Assets de l'écran titre
		this.game.load.image("gametitle","res/gametitle.png");
		this.game.load.spritesheet("play","res/playsheet.png",610,180,6);
		this.game.load.spritesheet("icons","res/icons.png",255,255,4);
	  this.game.load.image('bg','res/flatbg.jpg');

		//Assets du jeu
		//Image de la balle
    this.game.load.spritesheet("ball","res/ballsheet.png",250,250);
    this.game.load.image("redball","res/redball.png");
    this.game.load.image("greenball","res/greenball.png");

		//Son et bruitages
		this.game.load.audio("mus_children", 'snd/children_vlow.wav');

		this.game.load.audio("snd_hitball", 'snd/hitball.wav');
		this.game.load.audio("snd_holdball", 'snd/charge2.wav');
		this.game.load.audio("snd_goal", 'snd/goal.wav');
		this.game.load.audio("snd_wallbounce", 'snd/wallhit.wav');
		this.game.load.audio("snd_gem", 'snd/gem.wav');

		console.log("2. All assets are preloaded.");
	},
  	create: function(){
		//On lance l'écran titre
		this.game.state.start("GameTitle");
	}
}
