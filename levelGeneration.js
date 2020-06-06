
var length;
var height;
var data;
var tableBody = document.getElementById("lvl");//tbody de tableJeu

lvl1();//met les données JSON du premier niveau dans la variable data

levelGeneration();

function levelGeneration() {
    console.log(data);
    length = data[0].length;
    height = data[0].height;
    var l = 1;
    tableBody.innerHTML = "";//on vide le tbody du tableau
    document.getElementById("selectionBar").innerHTML ="";//on vide le flow d'exécution
    while (height > 0) {
        tableBody.innerHTML += "<tr id='ligne" + height + "'>";
        while (l <= length) {
            document.getElementById("ligne" + height).innerHTML += "<td id='" + String.fromCharCode(l + 64) + height + "'></td>";
            l++;
        }
        tableBody.innerHTML += "</tr>";
        l = 1;
        height--;
    }
    data[0].borders.forEach(element => document.getElementById(element).classList.add('borders'));
    data[0].ground.forEach(element => document.getElementById(element).classList.add('ground'));
    data[0].ladders.forEach(element => document.getElementById(element).classList.add('ladder'));
    data[0].stars.forEach(element => document.getElementById(element).classList.add('star'));
    data[0].yellow.forEach(element => document.getElementById(element).classList.add('obstacleJaune'));
    data[0].green.forEach(element => document.getElementById(element).classList.add('obstacleVert'));
    data[0].red.forEach(element => document.getElementById(element).classList.add('obstacleRouge'));
    document.getElementById(data[0].spawn).classList.add('personnage');
}