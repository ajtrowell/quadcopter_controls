var quad1; // Quadcopter object instance.
var physics;

function setup() {
    createCanvas(windowWidth,windowHeight);
    quad1 = new Quadcopter();
}

function draw() {
    physics.setTimeScale(); // Update based on current fps.
    background(0);
    quad1.update();
    quad1.draw();
}


physics = {
    gravity_mps: 10, // meters/sec^2
    pixelsPerMeter: 10,
    framesPerSimSecond: 30,  // Initial value.
    timeScale : 1, // Larger runs faster.

    setTimeScale : function() {
        // Update timescale as FPS changes.
        // Prevent having a arbitrarily small timescale.
        // Note: this function should probably be a member of the 
        // physics object.
        var tempFPS = getFrameRate();
        var minFPS = 10;
        
        if (tempFPS >= minFPS) {
            this.framesPerSimSecond = tempFPS / this.timeScale;
        } else {
            this.framesPerSimSecond = minFPS;
        }
    }//setPhysicsTimeScale()
} //physics object


