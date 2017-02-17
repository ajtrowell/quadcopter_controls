var quad1;
var physics = {
    gravity_mps: 10, // meters/sec^2
    pixelsPerMeter: 10,
    framesPerSimSecond: 30,  // Initial value.
    timeScale : 1 // Larger runs faster.
}

function setup() {
    createCanvas(windowWidth,windowHeight);
    quad1 = new Quadcopter();
}

function draw() {
    setPhysicsTimeScale();
    background(0);
    quad1.update();
    quad1.draw();
}




setPhysicsTimeScale = function() {
    // Update timescale as FPS changes.
    // Prevent having a arbitrarily small timescale.
    // Note: this function should probably be a member of the 
    // physics object.
    var tempFPS = getFrameRate();
    var minFPS = 10;
    
    if (tempFPS >= minFPS) {
        physics.framesPerSimSecond = tempFPS / physics.timeScale;
    } else {
        physics.framesPerSimSecond = minFPS;
    }
}


