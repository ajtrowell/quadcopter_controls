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


// Define physics object
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



// Keyboard Inputs
function keyPressed() {
  if(key == ' ') {
    // Toggle autoPilot
    quad1.autoPilotActive = !quad1.autoPilotActive;
  }
  if(keyCode === LEFT_ARROW)  { quad1.thrust_newtons.x = -quad1.maxThrust_newtons; } 
  if(keyCode === RIGHT_ARROW) { quad1.thrust_newtons.x =  quad1.maxThrust_newtons; }
  if(keyCode === UP_ARROW)    { quad1.thrust_newtons.y = -quad1.maxThrust_newtons; }
  if(keyCode === DOWN_ARROW)  { quad1.thrust_newtons.y =  quad1.maxThrust_newtons; }
}
function keyReleased() {
  if(key == ' ') {
    // Clear previous thrust so last autopilot command won't persist.
    quad1.thrust_newtons = createVector(0,0);
  }
  if(keyCode === LEFT_ARROW)  {  quad1.thrust_newtons.x = 0; } 
  if(keyCode === RIGHT_ARROW) {  quad1.thrust_newtons.x = 0; }
  if(keyCode === UP_ARROW)    {  quad1.thrust_newtons.y = 0; }
  if(keyCode === DOWN_ARROW)  {  quad1.thrust_newtons.y = 0; }
}
