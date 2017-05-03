//Fonction d'initialisation de la partie
function initMatch(game){
  p[0] = new Player(0, game);
  p[1] = new Player(1, game);
  matchRound = 1;
  theBall = new Ball(game);
  theBall.reset();
  //On lance la musique
  if(oMusic){
    music.pause();
    music.play('normal');
  }
  //On le timer qui lance la balle
  //self.game.time.events.add(Phaser.Timer.SECOND * 2, theBall.goBall, theBall);
  newTimer(2,theBall.goBall,theBall);
  //On affiche un message de début de partie
  console.log('---> Bonne partie! | Round: ',matchRound);
};

//Fonction qui enclenche le prochain round
function newRound(){
  //On retire le marqueur de goal
  goalZone.alpha = 0;
  //On reset la ball
  theBall.reset();
  //On lance le timer qui lance la balle
  //self.game.time.events.add(Phaser.Timer.SECOND * 2, theBall.goBall, theBall);
  newTimer(2,theBall.goBall,theBall);
};

//Fonction de fin d'un round (goal)
function endRound(game, winn){
  var self = game;
  let winner = winn;
  workingButtons = false;

  //Si personne n'a toucher la balle
  if(winner===undefined){
    //Which side is the goal?
    if(theBall.x < gwx){
      winner = 1;
    }else{
      winner = 0;
    }
  }
  //On met en surbrillance la zone du vainqueur
  //A Definir dans une fonction render ou goalFx
  goalZone = self.game.add.graphics(0, 0);
  if(winner===0){
    goalZone.beginFill(0xFF00CC, 0.7);
    goalZone.drawRect(0,0,gwx,gwh);
  }else{
    goalZone.beginFill(0x00EEFF, 0.7);
    goalZone.drawRect(gwx,0,gww,gwh);
  }
  goalZone.alpha = 0.4;

  //1. On attribue les points
  p[winner].score += 1;
  console.log('Gagnant du round: Joueur ', winner+1);
  console.log('Fin du round, score: ',p[0].score,'-',p[1].score);

  txPScore[winner].setText(p[winner].score);

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
    //Nouveau round
    newTimer(2,newRound,this);
  }else{
    //Ecran titre
    newTimer(4,goTitle,this);
  }
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

//Petite fonction qui renvoie le côté ou X se trouve
function whichSide(x){
  let side = 0;
  let posX = x;
  if(posX>=gmx){
    side = 1;
  }
  return side;
}

//Fonction qui change l'état vers Ecran Titre
function goTitle(){
  //On arrête la musique du match
  music.pause();
  //On redirige vers l'écran titre
  game.state.start('GameTitle');
}

//Fonction qui re-initialise les variables du match
function resetMatch(){
  p = []; //Objet qui contient les deux joueurs
  workingButtons = true; //Pour la pause etc...
  matchRound = undefined; //Contient le numero du round
  matchEnd = false;
  bestPlayer = undefined; //Contient le joueur dont le score est le plus haut
  bestCombo = 0;
}

function drawBoard(parent){
  let self = parent;
  let stroke = 10;

  //Styles
  var stSimple = { font: "80px Arial", fill: purple, align: "center" };
  var stSmall = { font: "40px Arial", fill: purple, align: "center" };

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

  txCombo = game.add.text(gwx,40,'0',stSmall);
    txCombo.anchor.setTo(0.5);
    txCombo.alpha = 0.5;

  txSpd = game.add.text(gwx,gwh-30,'0m/s',stSmall);
    txSpd.anchor.setTo(0.5);
    txSpd.alpha = 0.5;

  txPScore = [];
  txPScore[0] = game.add.text(gwx-50,GMARGIN * 1.1,'0',stSimple);
    txPScore[0].anchor.setTo(1,0);
    txPScore[0].alpha = 0.6;

  txPScore[1] = game.add.text(gwx+50,GMARGIN * 1.1,'0',stSimple);
    txPScore[1].anchor.setTo(0,0);
    txPScore[1].alpha = 0.6;
}
