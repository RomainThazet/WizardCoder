//barre verte du bas contenant les actions à effectuer
var selectionBar = document.getElementById("selectionBar");

//Array contenant la suite d'actions à effectuer
var flowExecution;

//position du personnage
var position;

//largeur d'une case, on divise la largeur de l'écran de jeu (80vw) par le nombre de cases à l'horizontal
var tailleCase;

//hauteur d'une case, on divise la hauteur de l'écran de jeu (75vw) par le nombre de cases à la vertical
var HauteurCase;

//case suivante par rapport au personnage
var nextPosition;

//booléen qui sera mis à "true" si un échec ou un succès est detecté
var stopExecution;

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

initVar();

//--------------------------------------------------------------------------------------------

function initVar(){//initialisation de toutes les variables importantes à l'exécution du flow
    itemsDisparus['star'] = new Array();
    itemsDisparus[obstacles.ROUGE] = new Array();
    itemsDisparus[obstacles.JAUNE] = new Array();
    itemsDisparus[obstacles.VERT] = new Array();
    stopExecution = false;
    tailleCase = 80/length;
    HauteurCase = 75/data[0].height;
    position = data[0].spawn;
    flowExecution = new Array();
}

//--------------------------------------------------------------------------------------------

//se lance quand l'utilisateur clique sur le bouton "Lancer !"
document.getElementById("btnLancer").onclick = function() {
    console.log(selectionBar.childNodes)
    for (var i = 0, action; action = selectionBar.childNodes[i]; i++) {
            flowExecution.push(action.className);//on remplit le flow avec les action présentes dans la selectionbar

    }
    execute(0)
}

//--------------------------------------------------------------------------------------------


// execute recursivement chaque action du flow en laissant 2secondes entre chaque étapes pour laisser les animations se dérouler
var compteurRepetitions = 0;
function execute(etape) {

    if (itemsDisparus['star'].length == 3) {
        reussite();
    }

    if(flowExecution.length > etape && !stopExecution) {
        var actionEnCours = selectionBar.childNodes[etape];

        actionEnCours.classList.add("focused");//on met l'action en cours situé dans la selectionbar en surbrillance

        switch (flowExecution[etape]) {
			case 'repeat_start':
				compteurEtapeStart = etape+1;
				console.log("compteur = " + compteurEtapeStart);
                break;

			case 'repeat_stop':
				//cas d'erreur si la fin de boucle est présente sans départ de boucle
				if (compteurEtapeStart == undefined) {
					echec();
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
    else if (!stopExecution) {
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
                echec();
                break;
            case 'obstacleVert':
                echec();
                break;
            case 'obstacleJaune':
                echec();
                break;
            case 'borders':
                echec();
                break;
            case 'ground':
                echec();
                break;
            default://le perso peut avancer
                setTimeout(animationAvancer(), 1000);
                deplacement(deplacements.DROITE);
        }
    }else{//arrivé au bord du niveau
        echec();
    }

}

//vérifie que le personnage peut monter d'une case et le fait se déplacer si c'est possible
function monter() {
    nextPosition = position.charAt(0)+(parseInt(position.charAt(1))+1).toString();
    var nextCase = document.getElementById(nextPosition);
    var Case = document.getElementById(position);
    if (Case.className == "ladder personnage" && nextCase != null) {
        switch (nextCase.className) {//on vérifie qu'il est possible pour le personnage de monter
            case 'obstacleRouge':
                echec();
                break;
            case 'obstacleVert':
                echec();
                break;
            case 'obstacleJaune':
                echec();
                break;
            case 'borders':
                echec();
                break;
            case 'ground':
                echec();
                break;
            default://le perso peut monter
                setTimeout(animationMonter(), 1000);
                deplacement(deplacements.HAUT)
        }
    }else {
            echec();
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
    if (document.getElementById(nextPosition).className=="star"){
        itemsDisparus["star"].push(nextPosition);//on récupère les infos de l'item qui va disparaitre pour la réinitialisation du niveau
        document.getElementById(nextPosition).classList.remove("star");
    }
    setTimeout(function () {//on attend la fin de l'animation
        document.getElementById(position).classList.remove("personnage");
        document.getElementById(nextPosition).classList.add("personnage");
        if (direction==deplacements.DROITE){
            document.getElementById(position).style.transform += 'translateX(-'+tailleCase+'vw)'
        }else {
            document.getElementById(position).style.transform += 'translateY(' + HauteurCase + 'vh)'
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
    for (var cle of Object.keys(itemsDisparus)){
        for (var valeur of itemsDisparus[cle]){
            document.getElementById(valeur.toString()).classList.add(cle);
        }
    }
    reinitialisePositionPersonnage();
    initVar();
}

//le personnage revient à sa position d'origine
function reinitialisePositionPersonnage() {
    document.getElementById(position).classList.remove("personnage");
    position = data[0].spawn;
    document.getElementById(position).classList.add("personnage");
    document.getElementById(position).style.animationName = null;
}

//--------------------------------------------------------------------------------------------

function animationAvancer() {
    var elem = document.getElementById(position);
    elem.classList.add("personnageAvance");
    elem.style.transition = 'transform 1000ms ease-in-out';
    elem.style.transform = 'translateX(' + tailleCase + 'vw)';
    setTimeout(function () {
        elem.style.transition = "";
        elem.classList.remove("personnageAvance");
    },1000)
}

function animationMonter() {
    var elem = document.getElementById(position);
    elem.classList.add("personnageMonte");
    elem.style.transition = 'transform 1000ms ease-in';
    elem.style.transform = 'translateY(-' + HauteurCase + 'vh)';
    setTimeout(function () {
        elem.classList.remove("personnageMonte");
        elem.style.transition="";
    },1000)
}

//--------------------------------------------------------------------------------------------

//lance la boite de dialogue d'echec
function echec() {
    stopExecution = true;
    $('#modalEchec').modal('toggle');
}

//lance la boite de dialogue de reussite
function reussite() {
	window.etat = 1;

    stopExecution = true;
    $('#modalReussite').modal('toggle');
}

//--------------------------------------------------------------------------------------------

document.getElementsByClassName("reessayer").item(0).onclick = function() {
    $('#modalEchec').modal('hide');
    reinitialisationNiveau();
}

document.getElementsByClassName("reessayer").item(1).onclick = function() {
    $('#modalReussite').modal('hide');
    reinitialisationNiveau();
}

document.getElementById("suivant").onclick = function() {
    $('#modalReussite').modal('hide');
    lvl2();
    levelGeneration();
    initVar();
}

