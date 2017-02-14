// Quadcopter constructor
function Quadcopter(){
    this.pos = createVector(width/2,height/2);
    this.size = createVector(width/5,width/30);
}
Quadcopter.prototype.draw = function(){
    fill(100);
    rect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, 
         this.size.x, this.size.y);
}
