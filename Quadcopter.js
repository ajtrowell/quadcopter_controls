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

    // Control System
    this.autopilotActive = true;
    this.autopilotThrust_newtons = createVector(0,0); // Calculated thrust command.
    this.autopilotTarget_pixels = createVector(width/2,height/2); // Initial target position.
    this.drawTarget = true; // Draws axes through autopilot target position.

    // Control System Command Components
    // Primarily useful for creating plots, since they are summed to 
    // produce the this.autopilotThrust_newtons value.
    this.proportional_thrust = createVector(0,0);
    this.integral_thrust = createVector(0,0);
    this.differential_thrust = createVector(0,0);
    
}//constructor
Quadcopter.prototype.draw = function(){
    fill(100);
    rect(this.position_pixels.x - this.size_pixels.x/2, 
         this.position_pixels.y - this.size_pixels.y/2, 
         this.size_pixels.x, this.size_pixels.y);
    // Draw circular 'pin' at C.G. to show rotation point.
    // Also set color to indicate when autopilot is active.
    if(this.autopilotActive) {
        fill(10,200,10); // Green
    } else {
        fill(200,10,10); // Red
    }
    ellipse(this.position_pixels.x, this.position_pixels.y, 
            this.size_pixels.y, this.size_pixels.y);
    if(this.autopilotActive) {
        push()
        stroke(200,20,20);
        line(0,this.autopilotTarget_pixels.y,width,this.autopilotTarget_pixels.y); // Horizontal Line
        line(this.autopilotTarget_pixels.x,0,this.autopilotTarget_pixels.x,height); // Vertical Line
        pop()
    }
}//draw()
Quadcopter.prototype.update = function(){
    /*  Propogates forces into accelerations, velocities,
     *  and ultimately, pixel positions.
     *  Also calls autopilot routine and other misc
     *  utilities.
    */

    // Autopilot update
    this.autopilot(); // Calulate new command.
    if(this.autopilotActive) {this.thrust_newtons = this.autopilotThrust_newtons.copy();}
    
    // Update netForce from gravity and thrust
    // Create gravityVector with units of Newtons:
    var gravityVector = createVector(0,this.mass_kg * physics.gravity_mps);
    this.netForce_newtons = p5.Vector.add(this.thrust_newtons,gravityVector);
    // Update acceleration from netForce and mass
    //  acceleration  = force(Newtons) / mass(Kilograms)
    this.acceleration_mpss = this.netForce_newtons.copy().div(this.mass_kg);

    // Update velocity from acceleration
    // Convert timestep based on physics.framesPerSimSecond.
    // Add (acceleration vector * timeStep_seconds) to existing velocity vector.
    this.velocity_mps.add( this.acceleration_mpss.copy().div( physics.framesPerSimSecond ));

    // Update position from velocity.
    // Take note of physics.pixelsPerMeter
    // Convert timestep based on physics.framesPerSimSecond.
    // this.position_pixels is in pixels, not meters.
    var delta_position_meters = this.velocity_mps.copy().div( physics.framesPerSimSecond );
    this.position_pixels.add(delta_position_meters.copy().mult(  physics.pixelsPerMeter ));
    
}//update()
Quadcopter.prototype.thrust = function(thrustVector){
    //Set current applied thrust as Vector object.
    this.thrust_newtons = thrustVector.copy();
}//thrust()
Quadcopter.prototype.boundThrust = function(thrustVector){
    // Clip input thrust vector to within +/- this.maxThrust_newtons
    var outputThrustVector = thrustVector.copy();
    var that = this; // local value for inner function.
    
    outputThrustVector.x = clipToRange(outputThrustVector.x);
    outputThrustVector.y = clipToRange(outputThrustVector.y);
    return outputThrustVector;

    // Inner function 
    function clipToRange(input,min,max) {
        // this. vs quad1. ?  How to access this from inner function? IDK.
        min = ((min === undefined) ? -that.maxThrust_newtons : min); // Set default value
        max = ((max === undefined) ?  that.maxThrust_newtons : max); // Set default value
        var output;
        if (input>max) { output = max; } 
        else if (input<min) { output = min; } 
        else { output = input; }
        return output;
    } // end inner function
}// boundThrust()
Quadcopter.prototype.toggleAutopilot = function() {
    this.autopilotActive = !this.autopilotActive; // Toggle autopilot.
    if(this.autopilotActive) { // If just turned on:
        this.resetAutopilot();
    } else { // Just turned off:
        this.thrust_newtons = createVector(0,0); // Clear entry from autopilot.
    }
}// toggleAutopilot()
Quadcopter.prototype.resetAutopilot = function() {
    // Reset autopilot memory components.
    // Primarily to clear integral component after 
    // restarting the autopilot.
    this.autopilotThrust_newtons = createVector(0,0);
    this.proportional_thrust = createVector(0,0);
    this.integral_thrust = createVector(0,0);
    this.differential_thrust = createVector(0,0);
}// resetAutopilot()
Quadcopter.prototype.autopilot = function(targetPositionVector){
    // Calculate thrust commands to maintain target position.
    // If argument is provided, update target location.
    if(targetPositionVector) {
        this.autopilotTarget_pixels = targetPositionVector.copy();
    }

    // Thrust components. Clear all.
    this.autopilotThrust_newtons = createVector(0,0);
    // this.proportional_thrust = createVector(0,0);
    // this.integral_thrust = createVector(0,0);
    // this.differential_thrust = createVector(0,0);

    // Setup PID controller
    // Error Signal calculation:
    this.autopilotError_pixels = this.autopilotTarget_pixels.copy().sub(this.position_pixels);
    this.K = 10; // System Gain, applied to Proportional, Integral, and Differential.
    this.Tau_i = .1; // Integral component time constant.
    this.Tau_d = .1; // Differential component time constant.

    // Implement vertical autopilot only
    // Proportional component 
    this.proportional_thrust.y = this.autopilotError_pixels.y * this.K;

    // Integral Component
    // this.integral_thrust.y = this.integral_thrust.y

    // Sum components of P.I.D.
    this.autopilotThrust_newtons.y = 
          this.proportional_thrust.y
        + this.integral_thrust.y
        + this.differential_thrust.y;
    
}
