class Ant {
    constructor(){
        this.position = {x: 9, y: 9};
        this.objectif = {x: 9, y: 9};
        this.speed = 3;
        this.state = 0;
        this.state1 = 0;
        this.pile = [];
    }
    move(fps){
        let direction = Math.atan2(this.position.y - (this.objectif.y + 0.5), (this.objectif.x + 0.5)-this.position.x);
        let dx = Math.cos(direction); // cos(0) = 1 ; cos(pi) = -1 ; cos(pi/2) = 0.
        let dy = Math.sin(direction) * -1; // sin(0) = 0 ; sin(pi) = 0 ; sin(pi/2) = 1 ; -1 car canvas inverse l'axe Y.
        this.position.x += dx * this.speed / fps; 
        this.position.y += dy * this.speed / fps;
    }
    NewObjectif(grid){
        if (this.state == 1) {
            if (this.state1 == 0) {
                console.log("pile");
                console.log(this.pile);
                
                this.state1 = 1;
                this.pile = this.optimizeMoves(this.pile, grid);
                console.log(this.pile);
            }
            if (this.pile.length == 0) {
                this.state = 0;
                this.state1 = 0;
                this.speed = 3;
                this.pile.push({x: 9, y: 9});
                return {x: 9, y: 9};
            } else {
                //console.log(this.pile[this.pile.length - 1]);
                return this.pile.pop();
            }
        } else {
            this.pile.push(this.objectif);
            return this.NextMouve(grid);
        }
    }

    NextMouve(grid){
        let moves = [];
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // haut, bas, gauche, droite
        for(let dir of directions) {
            let newX = Math.floor(this.position.x) + dir[0];
            let newY = Math.floor(this.position.y) + dir[1];

            if(newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length && grid[newY][newX] > 0) {
                moves.push({x: newX, y: newY});
            }
        }

        return moves[Math.floor(Math.random() * moves.length)];
    }

    optimizeMoves(movesStack, grid) {
        let start = movesStack[movesStack.length - 1]; // dernier mouvement
        let goal = movesStack[0]; // premier mouvement
        let nodes = {};
        for(let y = 0; y < grid.length; y++) {
            for(let x = 0; x < grid[0].length; x++) {
                nodes[`${x},${y}`] = {x, y, dist: Infinity, prev: null};
            }
        }
    
        nodes[`${start.x},${start.y}`].dist = 0;
    
        let unvisited = Object.values(nodes);
    
        while(unvisited.length > 0) {
            unvisited.sort((a, b) => a.dist - b.dist);
            let current = unvisited.shift();
        
            let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // haut, bas, gauche, droite
            for(let dir of directions) {
                let newX = current.x + dir[0];
                let newY = current.y + dir[1];
            
                if(newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length && grid[newY][newX] > 0) {
                    let neighbor = nodes[`${newX},${newY}`];
                    let altDist = current.dist + 1;
                    if(altDist < neighbor.dist) {
                        neighbor.dist = altDist;
                        neighbor.prev = current;
                    }
                }
            }
        }
    
        let path = [];
        let current = nodes[`${goal.x},${goal.y}`];
        while(current !== null) {
            path.unshift({x: current.x, y: current.y});
            current = current.prev;
        }
        return path.reverse();
        }
}

class Model {
    constructor() {
        this.grid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1 ,1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 2, 0],
            [0, 2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0 ,0 ,0 ,0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0 ,0 ,0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 0, 0, 1, 0, 0 ,0 ,0],
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 0 ,1, 0, 0, 1, 0, 1, 0, 1, 1, 2, 0, 1, 0],
            [0, 1, 1, 1, 0, 2, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.grid1 = [
        [0, 0, 0, 0, 0],
        [0, 3, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 2, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 2, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 2, 1, 0],
        [0, 0, 0, 0, 0]
        ];

        this.toggleButton = document.getElementById('btn');
        this.game = false;
        this.isTimerRunning = false;
        this.interval;
        this.seconds = 0;
        this.milliseconds = 0;

        this._startTime     = Date.now();
        this._lag           = 0;
        this._fps           = 60; // Frame rate.
        this._frameDuration = 1000 / this._fps;

        // piere-antoine.gean@mines-ales.fr
        this.ants = [];
        for (let i = 0; i < 100; i++) {
            this.ants.push(new Ant());
        }
    }

    bindDisplayFourmi(callback) {
        this.DisplayFourmi = callback;
    }
    bindDisplay(callback) {
        this.Display = callback;
    }
    bindtimerDisplay(callback) {
        this.timerDisplay = callback;
    }
    timer() {
        if (!this.isTimerRunning) {
            this.startT();
            this.toggleButton.textContent = 'Stop';
            this.startG();
        } else {
            this.stopT();
            this.toggleButton.textContent = 'Start';
        }
    }
    startT() {
        this.isTimerRunning = true;
        this.interval = setInterval(() => {
            this.milliseconds += 10;
            if (this.milliseconds >= 1000) {
                this.milliseconds = 0;
                this.seconds += 1;
            }
            this.timerDisplay(this.seconds, this.milliseconds);
        }, 1);
    }
    stopT() {
        this.isTimerRunning = false;
        this.game = false;
        clearInterval(this.interval);
    }
    startG() {this.game = true;}
    
    Update = function() {
        this.toggleButton.addEventListener('click', this.timer.bind(this));
        let currentTime = Date.now();
        let deltaTime   = currentTime - this._startTime;
        this._lag += deltaTime;
        this._startTime = currentTime;

        while (this._lag >= this._frameDuration) {
            this.Display(this.grid);
                for (let ant of this.ants) {
                    if(this.game){
                    ant.move(this._fps);
                        if (this.grid[Math.floor(ant.position.y)][Math.floor(ant.position.x)] == 2) {
                            ant.speed = 1;
                            ant.state = 1;
                            ant.objectif = ant.NewObjectif(this.grid);
                        } else 
                        if (Math.floor(ant.position.x) == ant.objectif.x && Math.floor(ant.position.y) == ant.objectif.y && ant.state == 0){
                            ant.objectif = ant.NewObjectif(this.grid);
                        } else 
                        if (Math.floor(ant.position.x) == ant.objectif.x && Math.floor(ant.position.y) == ant.objectif.y && ant.state == 1){
                            ant.objectif = ant.NewObjectif(this.grid);
                        }
                    }
                    this.DisplayFourmi(ant.position);
                }
            this._lag -= this._frameDuration;           
        }
        requestAnimationFrame(this.Update.bind(this));
    }
}
class View {
    constructor() {
        this._cellSize  = 50; // La taille d'une cellule en pixel.
        this.canvas = document.getElementById('my_canvas');
        this.ctx = this.canvas.getContext('2d');
        this.timerElement = document.getElementById('timer');
    }
    Display = function(grid) {
        let _nbLines   = (grid).length;
        let _nbColumns = (grid[0]).length;
        this.canvas.width  = _nbColumns * this._cellSize;
        this.canvas.height = _nbLines * this._cellSize;
        for (let i_line = 0; i_line < _nbLines; i_line++) {
            for (let i_col = 0; i_col < _nbColumns; i_col++) {
                this.ctx.drawImage(GRASS, 128, 68, 32, 32, i_col * this._cellSize, i_line * this._cellSize, this._cellSize, this._cellSize);
                if (grid[i_line][i_col] == 1) {
                    this.ctx.drawImage(GRASS, 192, 143, 32, 32, i_col * this._cellSize, i_line * this._cellSize, this._cellSize, this._cellSize);
                } else if (grid[i_line][i_col] == 0) {
                        this.ctx.drawImage(SHADOW, 47, 96, 98, 50, i_col * this._cellSize, i_line * this._cellSize, this._cellSize, this._cellSize);
                        this.ctx.drawImage(TREE, 23,13,117,135, i_col * this._cellSize, i_line * this._cellSize, this._cellSize, this._cellSize);
                } else if (grid[i_line][i_col] == 2) {
                        this.ctx.drawImage(HEXTILES_IMAGE, 32*3, 32*15, 32, 32, i_col * this._cellSize, i_line * this._cellSize, this._cellSize, this._cellSize);
                } else if (grid[i_line][i_col] == 3) {
                        this.ctx.drawImage(HEXTILES_IMAGE, 32*3,32*20, 32, 32, i_col * this._cellSize, i_line * this._cellSize, this._cellSize, this._cellSize);
                }  
            }
        }
    }
    DisplayFourmi = function(position) {
        this.ctx.drawImage(ANT, 0,0, 64, 64,position.x*this._cellSize+0.5,position.y*this._cellSize+0.5, this._cellSize/2, this._cellSize/2);
    }
    timerDisplay(seconds, milliseconds) {
        let displaySeconds = seconds < 10 ? '0' + seconds : seconds;
        let displayMilliseconds = milliseconds < 10 ? '0' + milliseconds : milliseconds;
        this.timerElement.textContent = `${displaySeconds}:${displayMilliseconds}`;
    }
  
}

class Controller {
    constructor(model, view) {
      this.model = model
      this.view = view
      this.bindDisplay = this.bindDisplay.bind(this);
      this.model.bindDisplay(this.bindDisplay); 

      this.bindDisplayFourmi = this.bindDisplayFourmi.bind(this);
      this.model.bindDisplayFourmi(this.bindDisplayFourmi); 

      this.bindtimerDisplay = this.bindtimerDisplay.bind(this);
      this.model.bindtimerDisplay(this.bindtimerDisplay);      
      this.model.Update()
    }  
    bindDisplay (grid) {
        this.view.Display(grid);
    }
    bindDisplayFourmi (position) {
        this.view.DisplayFourmi(position);
    }
    bindtimerDisplay (seconds, milliseconds) {
        this.view.timerDisplay(seconds, milliseconds);
    }
}

const HEXTILES_IMAGE = new Image();
HEXTILES_IMAGE.src = 'img/foodAndColony.png';
const TREE = new Image();
TREE.src = 'img/tree.png';
const GRASS = new Image();
GRASS.src = 'img/grass.png';
const SHADOW = new Image();
SHADOW.src = 'img/shadow.png';
const ANT = new Image();
ANT.src = 'img/ant.png';
Promise.all([
    new Promise( (resolve) => {HEXTILES_IMAGE.addEventListener('load', () => { resolve();}); }),
    new Promise( (resolve) => {TREE.addEventListener('load', () => { resolve();}); }),
    new Promise( (resolve) => {GRASS.addEventListener('load', () => { resolve();}); }),
    new Promise( (resolve) => {SHADOW.addEventListener('load', () => { resolve();}); }),
    new Promise( (resolve) => {ANT.addEventListener('load', () => { resolve();}); }),
])
.then(() => {   
    const app = new Controller(new Model(), new View())

});      