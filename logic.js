class Cell{
    constructor(x, y, r, state, color){
        this.x = x;
        this.y = y;
        this.r = r;
        this.state = (state)? true: false;
        this.color = (color)? color: defaultColor;
        this.toDraw = true;
    }
  
    draw(){
        if(this.toDraw){
            let temp = ctx.fillStyle;
            ctx.fillStyle = this.color;
            fillHexagon(this.x, this.y, this.r);
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

    constructor(i, k, color, dir){
        this.i = i;
        this.k = k;
        this.color = (color)? color: "white";
        this.dir = (dir)? dir: 0;
    }

    move(cell){
        cell.update(this.color);
        if(cell.state)
            this.turnRight();
        else
            this.turnLeft();

        if(this.dir == 0){
            this.k -= this.i%2;
            this.i -= 1;
        } else if(this.dir == 1){
            this.k = this.k-(this.i%2)+1;
            this.i -= 1;
        } else if(this.dir == 2){
            this.k += 1;
        } else if(this.dir == 3){
            this.k = this.k-(this.i%2)+1;
            this.i += 1;
        } else if(this.dir == 4){
            this.k -= this.i%2;
            this.i += 1;
        } else if(this.dir == 5){
            this.k -= 1;
        }
    }

    turnLeft(){
        this.dir = ((this.dir--)+6)%6;
    }
    
    turnRight(){
        this.dir = (this.dir++)%6;
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
        this.ants.push(new Ant(x,y,c,d));
    }

    moveAnts(){
        for(let i = 0; i < this.ants.length; i++){
            this.ants[i].move(this.cells[this.ants[i].i][this.ants[i].k]);
        }
    }

    getDrawables(){
        let temp = [];
        for(let i = 0; i < this.cells.length; i++){
            for(let k = 0; k < this.cells[i].length; k++){
                if(this.cells[i][k].toDraw) temp.push(this.cells[i][k]);
            }
        }
        return temp;
    }
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var defaultColor = "BLACK";
var grid;
var interval;

function fillHexagon(x, y, r){
    fillPolygon(x,y,r,6);
}

function fillPolygon(x, y, r, s){
    ctx.beginPath();
    ctx.moveTo(x,y+r);
    for(let i = s-1; i > -1; i--){
        ctx.lineTo(x+r*Math.sin(i*2*Math.PI/s), y+r*Math.cos(i*2*Math.PI/s));
    }

    ctx.fill();
}

function drawHexagon(x, y, r){
    drawPolygon(x, y, r, 6);
}

function drawPolygon(x, y, r, s){
    ctx.beginPath();
    ctx.moveTo(x,y+r);
    for(let i = s-1; i > -1; i--){
        ctx.lineTo(x+r*Math.sin(i*2*Math.PI/s), y+r*Math.cos(i*2*Math.PI/s));
    }

    ctx.stroke();
}

var width = 55;
var height = 51;

function main(){
    grid = new Grid(55,51,10);
    for(let i = 0; i < 1; i++){
        grid.addAnt(Math.floor(Math.random()*width), Math.round(Math.random()*height), getRandomColor());
    }
    clearInterval(interval);
    interval = setInterval(loop, 1000);
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
