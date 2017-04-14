//Fonction d'initialisation de la partie
function initMatch(game){
  p[0] = new Player(0, game);
  p[1] = new Player(1, game);
  matchRound = 1;
  theBall = new Ball(game);
  theBall.reset();
  //On lance la balle
  self.game.time.events.add(Phaser.Timer.SECOND * 2, theBall.goBall, theBall);
  //On affiche un message de début de partie
  console.log('---> Bonne partie! | Round: ',matchRound);
  console.log('Direction de la balle:  ',theBall.dir);
};

//Fonction de création des deux joueurs
function endRound(game, winn){

  workingButtons = false;
  var self = game;
  let winner = winn;

  //Si personne n'a toucher la balle
  if(winner===undefined){
    if(theBall.x < gwx){
      winner = 1;
    }else{
      winner = 0;
    }
  }

  goalZone = self.game.add.graphics(0, 0);
  //goalZone.lineStyle(0);
  if(winner){
    goalZone.beginFill(0xFF00CC, 0.3);
    goalZone.drawRect(0,0,gwx,gwh);
  }else{
    goalZone.beginFill(0x00EEFF, 0.3);
    goalZone.drawRect(gwx,0,gww,gwh);
  }
  goalZone.alpha = 0.4;

  //1. On attribue les points
  p[winner].score += 1;
  console.log('Gagnant du round: Joueur ', winner+1);
  console.log('Fin du round, score: ',p[0].score,'-',p[1].score);

  //2. On montre de niveau les joueurs?

  //3. Est-ce que la partie est fini?
  bestPlayer = whoIsAhead(self);

  if(bestPlayer!=-1){
    if(p[bestPlayer].score>=POINTSPERMATCH){
      //Appelle d'une fonction qui termine le match ici
      theBall.reset();

      matchEnd = true;
      workingButtons = false;
    }
  }

  //4. On lance un nouveau round ou on arrête le match
  if(!matchEnd){
    self.game.time.events.add(Phaser.Timer.SECOND * 2, newRound, this);
  }else{
    if(bestPlayer){
      var winX = gww-170;
    }else{
      var winX = 32;
    }
    self.game.debug.text("GAGNANT: J" + (bestPlayer+1) + '!',winX,gwy);
    self.game.time.events.add(Phaser.Timer.SECOND * 4, goTitle, this);
  }
};

//Fonction qui enclenche le prochain round
function newRound(){
  //On retire le marqueur de goal
  goalZone.alpha = 0;
  //On arrête la ball
  theBall.reset();
  //On lance la balle
  self.game.time.events.add(Phaser.Timer.SECOND * 2, theBall.goBall, theBall);
  //theBall.goBall();
};

//Fonction qui retourne le joueur en tête
function whoIsAhead(game){
  let best = undefined;
  //On teste lequel des deux joueurs à le plus haut score
  if(p[0].score==p[1].score){
    best = -1;
  }else if(p[0].score<p[1].score){
    best = 1;
  }else{
    best = 0;
  }
  //On retourne l'id du joueur.
  return best;
}

//Fonction qui change l'état vers Ecran Titre
function goTitle(){
  game.state.start('GameTitle');
}

//Fonction qui re-initialise les variables du match
function resetMatch(){
  p = []; //Objet qui contient les deux joueurs
  workingButtons = true; //Pour la pause etc...
  matchRound = undefined; //Contient le numero du round
  matchEnd = false; //
  bestPlayer = undefined; //Contient le joueur dont le score est le plus haut
  bestCombo = 0;
}

function drawBoard(parent){

  let self = parent;
  let stroke = 10;

  //Styles
  var stSimple = { font: "90px Times", fill: "#ffdd66", align: "center" };

  var board = self.game.add.group()

  //On charge la texture de fond
  var bg = self.game.add.sprite(0,0,'bg');

  var pZones = self.game.add.graphics(0, 0);
    pZones.beginFill(0xFF00CC, 0.1);
    pZones.lineStyle(0);
    pZones.drawRect(0,0,gwx,gwh);

    pZones.beginFill(0x00EEFF, 0.1);
    pZones.lineStyle(0);
    pZones.drawRect(gwx,0,gww,gwh);

  window.graphics += pZones;

  /*
  txCombo = game.add.text(gwx,50,'0',stSimple);
  txCombo.anchor.setTo(0.5);
  txCombo.alpha = 0;
  */
}
