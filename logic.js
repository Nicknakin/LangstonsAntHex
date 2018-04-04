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

    drawWithOutline(){
        let temp = ctx.fillStyle;
        ctx.fillStyle = "GRAY";
        drawHexagon(this.x, this.y, this.r);
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
            this.k -= i%2;
            this.i -= 1;
        } else if(this.dir == 1){
            this.k = k-(i%2)+1;
            this.i -= 1;
        } else if(this.dir == 2){
            this.k += 1;
        } else if(this.dir == 3){
            this.k = this.k-(i%2)+1;
            this.i += 1;
        } else if(this.dir == 4){
            this.k -= i%2;
            this.i += 1;
        } else if(this.dir == 5){
            this.k -= 1;
        }
    }
}

class Grid{
    constructor(width, height, size){
        this.width = width;
        this.height = height;
        this.size = size;
        this.cells = new Array(height);
        for(let i = 0; i < this.cells.length; i++){
            this.cells[i] = new Array(width);
            for(let k = 0; k < this.cells[i].length; k++){
                if(i%2 == 0)
                    this.cells[i][k] = new Cell(k*this.size, i*this.size, this.size/2, true, getRandomColor());
                else
                    this.cells[i][k] = new Cell(k*this.size+this.size/2, i*this.size, this.size/2, true, getRandomColor());
            }
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

function main(){
    grid = new Grid(10,10,50);
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
