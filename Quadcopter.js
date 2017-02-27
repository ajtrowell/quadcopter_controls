// Quadcopter constructor
function Quadcopter(){
    this.size_pixels = createVector(width/5,width/30);
    this.position_pixels = createVector(width/2,height/2);
    this.velocity_mps = createVector(0,0); // In meters per second
    this.acceleration_mpss = createVector(0,0); // In meters per second per second.
    
    // Rotational States
    this.omega = 0; // Radians per second
    this.alpha = 0; // Radians per second^2

    //Physical Properties
    this.mass_kg = 100; // kg
    this.moment_of_inertia = 10; // kg meters^2
    this.maxThrust_newtons = 5000; // Newtons of force.

    //NextState
    this.netForce_newtons = createVector(0, 0); // Initial net force.
    this.thrust_newtons = createVector(0,0); //Initial applied thrust.
    this.netTorque = 0;  // newton meters

    // Control System
    this.autopilotActive = true;
    this.autopilotThrust_newtons = createVector(0,0); // Calculated thrust command.
    this.autopilotTarget_pixels = createVector(width/2,height/2); // Initial target position.
    this.drawTarget = true; // Draws axes through autopilot target position.

    // Setup PID objects.
    // (K, Tau_i, Tau_d, integration_time_sec)
    this.pid_x = new PID(20, 4, .0003, -1);
    this.pid_y = new PID(20, 4, .0003, -1);
    
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
Quadcopter.prototype.
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
    this.netForce_newtons = p5.Vector.add( 
        this.boundThrust(this.thrust_newtons), gravityVector);
    
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
    this.pid_x.reset();
    this.pid_y.reset();
}// resetAutopilot()
Quadcopter.prototype.autopilot = function(targetPositionVector) {
    
    if(targetPositionVector) {
        this.autopilotTarget_pixels = targetPositionVector.copy();
    }
    // Update PID targets. 
    this.pid_x.setTarget(this.autopilotTarget_pixels.x);
    this.pid_y.setTarget(this.autopilotTarget_pixels.y);
    
    // PID update
    var time = physics.getTime();
    this.pid_x.update(this.position_pixels.x,time);
    this.pid_y.update(this.position_pixels.y,time);

    // PID output
    this.autopilotThrust_newtons = createVector(this.pid_x.output,this.pid_y.output);
    
}