//barre verte du bas contenant les actions à effectuer
var selectionBar = document.getElementById("selectionBar");

//Array contenant la suite d'actions à effectuer
var flowExecution = new Array();

//position du personnage
var position = data[0].spawn;

//largeur d'une case, on divise la largeur de l'écran de jeu (80vw) par le nombre de case à l'horizontal
var tailleCase = 80/length;

//case suivante par rapport au personnage
var nextPosition;

//ENUM des obstacles
var obstacles = {
    VERT: "obstacleVert",
    JAUNE: "obstacleJaune",
    ROUGE: "obstacleRouge",
};

//ENUM des déplacements
var deplacements = {
    DROITE: 1,
    HAUT: 2,
};

//dictionnaire permettant de stocker les éléments qui disparaissent lors de l'exécution afin de les réafficher lors de la réinitialisation du niveau
var itemsDisparus = {};
itemsDisparus['star'] = new Array();
itemsDisparus[obstacles.ROUGE] = new Array();
itemsDisparus[obstacles.JAUNE] = new Array();
itemsDisparus[obstacles.VERT] = new Array();

//--------------------------------------------------------------------------------------------

document.getElementById("btnLancer").onclick = function() {
    flowExecution=Array();//reinitialisation du flow
    console.log(selectionBar.childNodes)
    for (var i = 0, action; action = selectionBar.childNodes[i]; i++) {
        if (i!=0){
            flowExecution.push(action.className);//on remplit le flow avec les action présentes dans la selectionbar
        }
    }
    execute(0)
}

//--------------------------------------------------------------------------------------------


// execute recursivement chaque action du flow en laissant 2secondes entre chaque étapes pour laisser les animations se dérouler
var compteurRepetitions = 0;
function execute(etape) {
    if(flowExecution.length > etape) {
        var actionEnCours = selectionBar.childNodes[etape+1];
        actionEnCours.classList.add("focused");//on met l'action en cours situé dans la selectionbar en surbrillance
		
		var comoteurEtapeStart; //
		
        switch (flowExecution[etape]) {
			case 'repeat_start':
				compteurEtapeStart = etape;
				console.log("compteur = " + compteurEtapeStart);
                break;
					
			case 'repeat_stop':
				//cas d'erreur si la fin de boucle est présente sans départ de boucle
				if (compteurEtapeStart == undefined) {
					//boite de dialogue echec : fin de boucle sans début de boucle
					console.log("fin de boucle sans début de boucle");
					break;
				}
				
				var intervalle = etape - compteurEtapeStart;
				if (compteurRepetitions != 2) {
					compteurRepetitions++;
					actionEnCours.classList.remove("focused");
					execute(etape-intervalle);
					return;
				}
				compteurRepetitions = 0;
				
                break;
					
            case 'avancer':
                avancer();
                break;
				
            case 'monter':
                monter();
                break;
            case 'sortVert':
                detruireObstacle(obstacles.VERT);
                break;
            case 'sortJaune':
                detruireObstacle(obstacles.JAUNE);
                break;
            case 'sortRouge':
                detruireObstacle(obstacles.ROUGE);
                break;
        }
        setTimeout(function () {
            actionEnCours.classList.remove("focused");//on enlève la surbrillance de l'action en cours
            execute(etape + 1)
        }, 2000)
    }
    else {
        reinitialisationNiveau();//fin du flow d'exécution on réinitialise le niveau
    }
}

//--------------------------------------------------------------------------------------------


//vérifie que le personnage peut avancer d'une case et le fait se déplacer si c'est possible
function avancer() {
    //nextPosition est censé stocker la case suivante sur l'axe des abscisses : si notre position est A2 nextPosition vaudra B2
    nextPosition = String.fromCharCode(position.charCodeAt(0)+1)+position.charAt(1);
    var nextCase = document.getElementById(nextPosition);
    if (nextCase!==null){
        switch (nextCase.className) {//on vérifie qu'il est possible pour le personnage d'avancer
            case 'obstacleRouge':
                //boite de dialogue echec : obstacle rouge
                break;
            case 'obstacleVert':
                //boite de dialogue echec : obstacle vert
                break;
            case 'obstacleJaune':
                //boite de dialogue echec : obstacle jaune
                break;
            default://le perso peut avancer
                animationAvancer();
                deplacement(deplacements.DROITE);
        }
    }else{//arrivé au bord du niveau
        //boite de dialogue echec : bord de niveau
    }

}

//vérifie que le personnage peut monter d'une case et le fait se déplacer si c'est possible
function monter() {
    //nextPosition est censé stocker la case suivante sur l'axe des ordonnées : si notre position est A2 nextPosition vaudra A3
    nextPosition = position.charAt(0)+(parseInt(position.charAt(1))+1).toString();
    var nextCase = document.getElementById(nextPosition);
    if (nextCase!==null){
        if (nextCase.className == "ladder"){
            animationMonter();
            deplacement(deplacements.HAUT)
        }
    }
}


//appelle la destruction d'un obstacle si le joueur a selectionné le bon sort pour détruire cet obstacle
function detruireObstacle(typeObstacle) {
    //nextPosition est censé stocker la case suivante sur l'axe des abscisses : si notre position est A2 nextPosition vaudra B2
    nextPosition = String.fromCharCode(position.charCodeAt(0)+1)+position.charAt(1);
    var nextCase = document.getElementById(nextPosition);
    if (nextCase!==null){
        if (typeObstacle == nextCase.className){//on regarde si le sort utilisé correspond à l'obstacle
            destruction(typeObstacle);
        }
    }
}

//--------------------------------------------------------------------------------------------

//enleve la classe "personnage" de la case actuelle et l'affecte à la case suivante
function deplacement(direction) {
    if(document.getElementById(nextPosition).className=="star"){
        itemsDisparus["star"].push(nextPosition);//on récupère les infos de l'item qui va disparaitre pour la réinitialisation du niveau
        document.getElementById(nextPosition).classList.remove("star");
    }
    setTimeout(function () {//on attend la fin de l'animation
        document.getElementById(position).classList.remove("personnage");
        document.getElementById(nextPosition).classList.add("personnage");
        if (direction==deplacements.DROITE){
            document.getElementById(position).style.transform += 'translateX(-'+tailleCase+'vw)'
        }else{
            document.getElementById(position).style.transform += 'translateY('+tailleCase+'vw)'
        }
        position = nextPosition;
    }, 1000)
}

//enleve la classe d'obstacle à la case suivante
function destruction(typeObstacle) {
    itemsDisparus[typeObstacle].push(nextPosition);//on récupère les infos de l'item qui va disparaitre pour la réinitialisation du niveau
    document.getElementById(nextPosition).classList.add("disparition");
    setTimeout(function(){
        document.getElementById(nextPosition).classList.remove(typeObstacle);
        document.getElementById(nextPosition).classList.remove("disparition");
    },2000);

}

//--------------------------------------------------------------------------------------------

//les items ayant éventuellement disparus du niveau (étoiles, obstacles) sont réaffichés
function reinitialisationNiveau() {
    console.log(itemsDisparus)
    for (var cle of Object.keys(itemsDisparus)){
        for (var valeur of itemsDisparus[cle]){
            console.log(valeur)
            document.getElementById(valeur.toString()).classList.add(cle);
        }
    }
    reinitialisePositionPersonnage();
}

//le personnage revient à sa position d'origine
function reinitialisePositionPersonnage() {
    document.getElementById(position).classList.remove("personnage");
    position = data[0].spawn;
    document.getElementById(position).classList.add("personnage");
}

//--------------------------------------------------------------------------------------------

function animationAvancer() {
    var elem = document.getElementById(position)
    elem.style.position = 'relative';
    elem.style.transform += 'translateX('+tailleCase+'vw)';
}

function animationMonter() {
    var elem = document.getElementById(position)
    elem.style.position = 'relative';
    elem.style.transform += 'translateY(-'+tailleCase+'vw)';
}

//--------------------------------------------------------------------------------------------

function echec() {
    $('#modalEchec').modal('toggle');
}

function reussite() {
    $('#modalReussite').modal('toggle');
}
