console.log(data);
var length = data[0].length;
var height = data[0].height;
var l = 1;
while (height > 0) {
    document.getElementById("lvl").innerHTML += "<tr id='ligne" + height + "'>";
    while (l <= length) {
        document.getElementById("ligne" + height).innerHTML += "<td id='" + String.fromCharCode(l + 64) + height + "'></td>";
        l++;
    }
    document.getElementById("lvl").innerHTML += "</tr>";
    l= 1;
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