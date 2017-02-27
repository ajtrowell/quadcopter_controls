var quad1; // Quadcopter object instance.
var physics;

var world;

function world()
{
    this.quad_copters = [];
}






function setup() {
    createCanvas(windowWidth,windowHeight);
    physics.setFPS();
    quad1 = new Quadcopter();
    var prop1 = new Propsulion(quad1);
}

function Propulsion(body)
{
    this.body = body;

    this.update = function()
    {
        body.force += calculated_force;
    }

}

function draw() {
    background(0);
    gravity.applyForce(quad1);
    quad1.netForces += gravity;
    atmosphere.applyForce(quad1);
    quad1.force += propulsion.force;
    quad1.update();
    quad1.draw();
}


// Define physics object
physics = {
    gravity_mps: 10, // meters/sec^2
    pixelsPerMeter: 10,
    framesPerSimSecond: 60,  // Initial value.
    timeScale : 1, // Larger runs faster.

    setTimeScale : function() {
        // Update timescale as FPS changes.
        // Prevent having a arbitrarily small timescale.
        var tempFPS = getFrameRate();
        var minFPS = 10;
        
        if (tempFPS >= minFPS) {
            this.framesPerSimSecond = tempFPS / this.timeScale;
        } else {
            this.framesPerSimSecond = minFPS;
        }
    },//setPhysicsTimeScale()

    setFPS : function() {
        frameRate(this.framesPerSimSecond);
    },

    getTime : function() {
        return frameCount / this.framesPerSimSecond;
    }
} //physics object



// Keyboard Inputs
function keyPressed() {
  if(key == ' ') {
    // Toggle autopilot
    quad1.toggleAutopilot();
  }
  if(keyCode === LEFT_ARROW)  { quad1.thrust_newtons.x = -quad1.maxThrust_newtons; } 
  if(keyCode === RIGHT_ARROW) { quad1.thrust_newtons.x =  quad1.maxThrust_newtons; }
  if(keyCode === UP_ARROW)    { quad1.thrust_newtons.y = -quad1.maxThrust_newtons; }
  if(keyCode === DOWN_ARROW)  { quad1.thrust_newtons.y =  quad1.maxThrust_newtons; }
}
function keyReleased() {
  if(key == ' ') {
    // optional command on release
  }
  if(keyCode === LEFT_ARROW)  {  quad1.thrust_newtons.x = 0; } 
  if(keyCode === RIGHT_ARROW) {  quad1.thrust_newtons.x = 0; }
  if(keyCode === UP_ARROW)    {  quad1.thrust_newtons.y = 0; }
  if(keyCode === DOWN_ARROW)  {  quad1.thrust_newtons.y = 0; }
}

// Mouse Inputs
function mouseClicked() {
    // Click to set autopilot target.
    quad1.autopilot(createVector(mouseX,mouseY));
    // prevent default
    return false;
}