/**
 * Created by matshec on 21.02.17.
 */
var lastSpawn; //Date type
var pepe; //sprite
var renderer;
var avalBottles = 1;
var pepeAlcoh = 1.5;
var stage; // main container
var bottles = new PIXI.Container();
var cars = new PIXI.Container();
var lost = new PIXI.Container();
var strBottles;
var strPepeAlc;
var startTime = -1;
 var pepeFixedVel = 4;
var bLost = false;

var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    space = keyboard(32);
//użyj container i addChild, removeChild

function onLo() {
    //Create the renderer
     renderer = PIXI.autoDetectRenderer(800, 600);
    //Add the canvas to the HTML document
    document.body.appendChild(renderer.view);
    //Create a container object called the `stage`
     stage = new PIXI.Container();
    lastSpawn = new Date();
    //get picture
    PIXI.loader
        .add("imagies/car.png")
        .add("imagies/slav_pepe.png")
        .add("imagies/bottle.png")
        .add("imagies/background.jpg")
        .load(setup);

}


function setup() {
    var strLost = new PIXI.Text(
        "Przegrałes, odswierz strone by zagrac od nowa",
        {fontFamily: "Arial", fontSize: 26, fill: "white"}
    );
    strLost.x = 10;
    strLost.y = 150;
    lost.addChild(strLost);
    strBottles = new PIXI.Text(
        "Dostępne butelki:  " + avalBottles,
        {fontFamily: "Arial", fontSize: 20, fill: "white"}
    );
    strPepeAlc = new PIXI.Text(
        "Promile:  " + pepeAlcoh,
        {fontFamily: "Arial", fontSize: 20, fill: "white"}
    );

    var backgr = new PIXI.Sprite(PIXI.loader.resources["imagies/background.jpg"].texture);
    pepe = new PIXI.Sprite(PIXI.loader.resources["imagies/slav_pepe.png"].texture);
    //background settings
    backgr.width = 800;
    backgr.height = 600;
    backgr.alpha = 80;
    //pepe settings
    pepe.scale.x = 0.08;
    pepe.scale.y = 0.08;
    pepe.y = 515;
    pepe.x = 400;
    pepe.xv = 0;

    stage.addChild(backgr);
    stage.addChild(pepe);

//ADD keyboard functionality

    left.press = function () {
        pepe.xv = -pepeFixedVel;
    };
    right.press = function () {
        pepe.xv = pepeFixedVel;
    };
    left.release = function () {
       if(!right.isDown) pepe.xv = 0;
    };
    right.release = function () {
        if(!left.isDown)
            pepe.xv = 0;
    };
    up.press = function () {
        if(avalBottles !== 0) {
            spawnBottles();
            avalBottles--;
        }

    };
    space.press = function () {
        avalBottles++;
        pepeAlcoh += 0.2;
        if(pepeFixedVel > 0.4)
            pepeFixedVel -= 0.2;
        if(pepe.xv !== 0){
            if(left.isDown)
                pepe.xv = -pepeFixedVel;
            else
                pepe.xv = pepeFixedVel;
        }

    };
    

    //Tell the `renderer` to `render` the `stage`
    renderer.render(stage);
}

function spawnBottles() {
    if(avalBottles > 0){
        var temp = new PIXI.Sprite(PIXI.loader.resources["imagies/bottle.png"].texture);
        temp.x = pepe.x;
        temp.y = pepe.y;
        temp.scale.x = 0.1;
        temp.scale.y = 0.1;
        bottles.addChild(temp);
    }
}

function gameLoop() {
    if(startTime === -1){
        startTime = new Date();
    }
    requestAnimationFrame(gameLoop);
    play();
    if(pepeAlcoh > 10 || pepeAlcoh < 0.2 || bLost )
        renderer.render(lost);
    else
         renderer.render(stage);
}

function play() {
    var now  = new Date();
    if((now.getTime() - startTime.getTime())  > 3000 ){
        if(pepeAlcoh > 0.2){
            pepeAlcoh -= 0.2;
            if(pepe.xv <= 4 &&  pepeFixedVel < 4){
                pepeFixedVel += 0.2;
            }
        }
        startTime = now;
    }
    strBottles.text = "dostepne butleki: " + avalBottles;
    strPepeAlc.text = "promile: " + Math.round(pepeAlcoh * 100)/100;
    strPepeAlc.y = 20;
    if((pepe.x < 7 && right.isUp) || (pepe.x > 750 && left.isUp)) pepe.xv = 0;
        pepe.x += pepe.xv;
    bottles.children.forEach(updateBottles);
    //spawn cars
    spawnCars();
    cars.children.forEach(updateCars);
    car_botteCollision();
    var texts = new PIXI.Container();
    texts.addChild(strBottles);
    texts.addChild(strPepeAlc);
    stage.addChild(texts);
    stage.addChild(bottles);


}

function car_botteCollision() {
    var elem1;
    cars.children.forEach(cr);

    function cr(elem,index,arr) {
        elem1 = elem;
        bottles.children.forEach(bott);
    }
    function bott(elem,index,arr) {
       if(hitTestRectangle(elem1,elem)){
           elem1.visible = false;
           elem.visible = false;
           bottles.removeChild(elem);
           cars.removeChild(elem1);
       }
    }
}
// removes from containter `bottles` elements which passed visible area
function updateBottles(elem, index, arr) {
    if(elem.y < 0)
        bottles.removeChild(elem);
    elem.y += -3;
}

function spawnCars() {
    var now = new Date();
    if(now - lastSpawn > 3000){
        var temp  = new PIXI.Sprite(PIXI.loader.resources["imagies/car.png"].texture);
        temp.scale.x = 0.04;
        temp.scale.y = 0.04;
        temp.x = Math.floor((Math.random() * 730) + 1);
        lastSpawn = now;
        cars.addChild(temp);
        stage.addChild(cars);
    }
}
// removes from containter `cars` elements which passed visible area
function updateCars(elem,index,arr) {
    if(elem.y > 600){
        cars.removeChild(elem);
        bLost = true;
    }
    elem.y += 2;
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //downHandler
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;

}

function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
}