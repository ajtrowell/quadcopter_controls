var quad1;
var physics = {
    gravity_mps: 10, // meters/sec^2
    pixelsPerMeter: 2,
    framesPerSimSecond: 30 
}

function setup() {
    createCanvas(windowWidth,windowHeight);
    quad1 = new Quadcopter();
}

function draw() {
    physics.framesPerSimSecond = getFrameRate(); // Seems redundant
    background(0);
    quad1.update();
    quad1.draw();
}



