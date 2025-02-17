class BuildingWalls{
    constructor(x1, y1, x2, y2){
        //create vectors 'a' and 'b'
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
    }

    midpoint(){
        return createVector((this.a.x + this.b.x)*0.5, (this.a.y + this.b.y)*0.5);
    }    
    
    show(){
        stroke(180);
        strokeWeight(2.2);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        
    }

    showCheckpoint(){
        stroke('orange');
        strokeWeight(0.5);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}