//Fonctions courtes ou pratiques

//Fonction qui creer un timer event
function newTimer(sec,call,context){
  //call est la fonction qu'on appelle à la fin du timer
  self.game.time.events.add(Phaser.Timer.SECOND * sec, call, context);
}
