class Ray {
    constructor(pos, angle){
        //position
        this.pos = pos;
        //angle
        this.angle = angle;
        //direction
        this.dir = p5.Vector.fromAngle(angle);

    }

    setDir(x,y){
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    rotate(offset){
        this.dir = p5.Vector.fromAngle(this.angle + offset);
    }

    show(){
        stroke(255);
        push();
        translate(this.pos.x, this.pos.y);
        line(0, 0, this.dir.x * 10, this.dir.y * 10);
        pop();
    }

    cast(wall){
        //(x,y) coords for wall
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        //(x,y) coords for ray
        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        /** Line-to-Line intersection calculation **/
        //denominator for t and u
        const den = ((x1 - x2)*(y3 - y4))-((y1 - y2)*(x3 - x4));
        if (den == 0){
            return;
        }
        //numerator for t
        const tnum = ((x1 - x3)*(y3 - y4)) - ((y1 - y3)*(x3 -x4));
        //numerator for u
        const unum = ((x1 - x2)*(y1 - y3)) - ((y1 - y2)*(x1 - x3));

        const t = tnum /den;
        const u = -(unum)/den;

        if(t > 0 && t < 1 && u > 0){
            const pt = createVector();
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
            return pt;
        } else{
            return false;
        }


    }
}