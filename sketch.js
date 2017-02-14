var quad1;

function setup() {
    createCanvas(windowWidth,windowHeight);
    quad1 = new Quadcopter();

}

function draw() {
    background(0);
    quad1.draw();
}



