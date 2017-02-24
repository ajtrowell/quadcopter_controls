// PID constructor
function PID(K, Tau_i, Tau_d, integration_time_sec) {
    // Create new PID controller with given gains.
    // Note that K is applied to P, I, and D
    // Tau_i and Tau_i are time constants, or 
    // "Seconds per repeat" so they increase gain 
    // as their values decrease.
    // integration_time_sec determines how long to 
    // accumulate the integrator, but a value of -1
    // provides an infinite accumulator.

    // Use external or default values. (Should allow -1 to disable components.)
    if ((K !== undefined) && (Tau_i !== undefined) && (Tau_d !== undefined) 
            && (integration_time_sec !== undefined)) {
        this.K = K;
        this.Tau_i = Tau_i;
        this.Tau_d = Tau_d;
        this.integration_time_sec = integration_time_sec;
    } else { 
        // PID gains and integration times. (Default Values)
        this.K = 20; // System Gain, applied to Proportional, Integral, and Differential.
        this.Tau_i = 4; // Integral component time constant. (SecondsPerRepeat)
        this.Tau_d = .0003; // Differential component time constant.
    }


    // Target and position inputs.
    this.target = 0; // Initial target position.
    this.position = 0; // Initial target position.
    this.last_position = 0; // Initial target position.
    this.time = 0; // For calculating timesteps.
    this.last_time = 0; // For calculating timesteps.

    // Outputs
    this.output = 0; // Calculated thrust command.
    this.output_proportional = 0;
    this.output_integral = 0;
    this.output_differential = 0;

    // Number or time window to integrate.
    integration_time_sec = -1; // Determine time to integrate. -1 == infinite.
    // positionVector = []; // Store past positions.
    // timeVector = []; // Store past times.

}// constructor
PID.prototype.reset = function() {
    // Reset PID controller
    // Clear integrator memory and 'position' vector.
    this.output = 0; // Calculated thrust command.
    this.output_proportional = 0;
    this.output_integral = 0;
    this.output_differential = 0;
}// reset()
PID.prototype.setTarget = function(newTarget) {
    // Change target or 'set point' of the controller.
    // This clears the integrator memory.
    this.reset();
    this.target = newTarget;
}// setTarget()
PID.prototype.getError = function() {
    return this.target - this.position;
}
PID.prototype.getTimestep = function() {
    return this.time - this.last_time;
}
PID.prototype.update = function(newPosition,newTime) {
    // Calculate next 'output'
    // Accepts newPosition, and newTime, which are added 
    // to positionVector and timeVector, respectively.
    // Note: Vectors are not implemented yet, so 4 values 
    // are the stand in, position/time/last_position/last_time.
    // output, and its pid components are computed.
    // Returns output.

    if(newPosition !== undefined) {
        if(newTime !== undefined) {
            // this.positionVector.add(newPosition);
            // this.timeVector.add(newTime);
            this.position = newPosition;
            this.time = newTime;
        }
    }

    // Proportional component 
    this.output_proportional = this.getError() * this.K;

    // Integral Component
    // Note Tau_i * fps := secondsPerRepeat * framesPerSimSecond
    // = frames per repeat.
    this.output_integral = this.output_integral + 
            (this.K / (this.Tau_i / this.getTimestep() )) 
            * this.getError();

    // Differential Component
    this.output_differential = 
            (this.K / (this.Tau_d / this.getTimestep() )) 
            * -( this.position - this.last_position );
            
    // Sum components of P.I.D.
    this.output = 
          this.output_proportional
        + this.output_integral
        + this.output_differential;
    
    // Store last position/time for next differential iteration.
    this.last_position = this.position;
    this.last_time = this.time;

    return this.output;
    
}// update()
