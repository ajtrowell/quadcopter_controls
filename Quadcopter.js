// Quadcopter constructor
function Quadcopter(){
    this.size_pixels = createVector(width/5,width/30);
    this.position_pixels = createVector(width/2,height/2);
    this.velocity_mps = createVector(0,0); // In meters per second
    this.acceleration_mpss = createVector(0,0); // In meters per second per second.
    
    //Physical Properties
    this.mass_kg = 100; //kg
    this.maxThrust_newtons = 5000; // Newtons of force.

    //NextState
    this.netForce_newtons = createVector(0, 0); // Initial net force.
    this.thrust_newtons = createVector(0,0); //Initial applied thrust.
    
}//constructor
Quadcopter.prototype.draw = function(){
    fill(100);
    rect(this.position_pixels.x - this.size_pixels.x/2, 
         this.position_pixels.y - this.size_pixels.y/2, 
         this.size_pixels.x, this.size_pixels.y);

    // Draw circular 'pin' at C.G. to show rotation point.
    fill(200,10,10);
    ellipse(this.position_pixels.x, this.position_pixels.y, 
            this.size_pixels.y, this.size_pixels.y);
}//draw()
Quadcopter.prototype.update = function(){
    //Update netForce from gravity and thrust
    //Create gravityVector with units of Newtons:
    var gravityVector = createVector(0,this.mass_kg * physics.gravity_mps);
    this.netForce_newtons = p5.Vector.add(this.thrust_newtons,gravityVector);
    // Update acceleration from netForce and mass
    //  acceleration  = force(Newtons) / mass(Kilograms)
    this.acceleration_mpss = this.netForce_newtons.copy().div(this.mass_kg);

    // Update velocity from acceleration
    // Convert timestep based on physics.framesPerSimSecond.

    // Update position from velocity.
    // Take note of physics.pixelsPerMeter
    // Convert timestep based on physics.framesPerSimSecond.
    // ??? is this.position_pixels meant to be in pixels or in meters?
    

    
}//update()
Quadcopter.prototype.thrust = function(thrustVector){
    //Set current applied thrust as Vector object.
    this.thrust_newtons = thrustVector.copy();
}//thrust()
