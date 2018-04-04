class Cell{
    constructor(x, y, r, state, color){
        this.x = (x);
        this.y = (y);
        this.r = r;
        this.state = (state)? true: false;
        this.color = (color)? color: defaultColor;
        this.toDraw = true;
    }
  
    draw(){
        if(this.toDraw){
            let temp = ctx.fillStyle;
            ctx.fillStyle = this.color;
            fillHexagon(this.x, this.y, this.r, Math.PI/2);
            ctx.fillStyle = temp;
            this.toDraw = false;
        }
    }

    update(c){
        this.state = !this.state;
        this.color = (this.state)? c: defaultColor;
        this.toDraw = true;
    }
}

class Ant{
    //D I R E C T I O N S
    //0 NW: i -= 1; k = (k-i%2);
    //1 NE: i -= 1; k = (k-(i%2)+1);
    //2 E   i = i;  k += 1;
    //3 SE  i += 1; k = (k-(i%2)+1);
    //4 SW  i += 1; k = k-(i%2);
    //5 W   i = i;  k -= 1; 

    constructor(i, k, color, dir, cell){
        this.i = i;
        this.k = k;
        this.x = cell.x;
        this.y = cell.y;
        this.size = cell.r/3*2;
        this.color = (color)? color: "white";
        this.dir = (dir)? dir: 0;
    }

    draw(){
        let temp = ctx.fillStyle;
        ctx.fillStyle = this.color;
        fillPolygon(this.x, this.y, this.size, 3, ((this.dir+2)%6)*Math.PI/3);
    }

    move(cell){
        cell.update(this.color);
        if(cell.state)
            this.turnRight();
        else
            this.turnLeft();

        if(this.dir == 0){
            this.k -= (this.i+1)%2;
            this.i -= 1;
        } else if(this.dir == 1){
            this.k = this.k-((this.i+1)%2)+1;
            this.i -= 1;
        } else if(this.dir == 2){
            this.k += 1;
        } else if(this.dir == 3){
            this.k = this.k-((this.i+1)%2)+1;
            this.i += 1;
        } else if(this.dir == 4){
            this.k -= (this.i+1)%2;
            this.i += 1;
        } else if(this.dir == 5){
            this.k -= 1;
        }
    }

    turnLeft(){
        this.dir = ((--this.dir)+6)%6;
    }
    
    turnRight(){
        this.dir = (++this.dir)%6;
    }

    fix(width, height){
        this.k = (this.k+width)%width;
        this.i = (this.i+height)%height;
    }

    center(cell){
        this.x = cell.x;
        this.y = cell.y;
    }
}

class Grid{
    constructor(width, height, size){
        this.width = width;
        this.height = height;
        this.size = size;
        this.cells = new Array(height);
        let orth = this.size*Math.sin(Math.PI/3);
        let xDiff = 2*this.size*Math.cos(Math.PI/6);
        let yDiff = this.size+this.size*Math.sin(Math.PI/6);
        for(let i = 0; i < this.cells.length; i++){
            this.cells[i] = new Array(width);
            for(let k = 0; k < this.cells[i].length; k++){
                if(i%2 == 0)
                    this.cells[i][k] = new Cell(k*xDiff, i*yDiff, this.size);
                else
                    this.cells[i][k] = new Cell(k*xDiff+xDiff/2, i*yDiff, this.size);
            }
        }
        this.ants = [];
    }

    addAnt(x, y, c, d){
        this.ants.push(new Ant(y,x,c,d,this.cells[y][x]));
    }

    moveAnts(){
        for(let j = 0; j < this.ants.length; j++){
            this.ants[j].move(this.cells[this.ants[j].i][this.ants[j].k]);
            this.ants[j].fix(this.width, this.height);
            this.ants[j].center(this.cells[this.ants[j].i][this.ants[j].k]);
        }
    }

    getDrawables(){
        let temp = [];
        for(let i = 0; i < this.cells.length; i++){
            for(let k = 0; k < this.cells[i].length; k++){
                if(this.cells[i][k].toDraw) temp.push(this.cells[i][k]);
            }
        }
        for(let i = 0; i < this.ants.length; i++){
            temp.push(this.ants[i]);
        }
        return temp;
    }
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var defaultColor = "BLACK";
var grid;
var interval;
var width = 55;
var height = 11;
var numAnts = 2;
var Hz = 60;
var numSteps = 200;

function fillHexagon(x, y, r, a){
    fillPolygon(x,y,r,6,a);
}

function fillPolygon(x, y, r, s, a){
    ctx.beginPath();
    ctx.moveTo(x,y+r);
    for(let i = s-1; i > -1; i--){
        ctx.lineTo(x+r*Math.cos(i*2*Math.PI/s+a), y+r*Math.sin(i*2*Math.PI/s+a));
    }

    ctx.fill();
}

function main(){
    grid = new Grid(width, height,10);
    for(let i = 0; i < numAnts; i++){
        grid.addAnt(Math.floor(Math.random()*width), Math.floor(Math.random()*height), getRandomColor());
    }
    clearInterval(interval);
    interval = setInterval(loop, 1000/Hz);
}

function looploop(){
    for(let i = 0; i < numSteps; i++){
        loop();
    }
}

function loop(){
    grid.moveAnts();
    let draws = grid.getDrawables();
    for(let i = 0; i < draws.length; i++){
        draws[i].draw();
    }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color + "FF";
}

main();
