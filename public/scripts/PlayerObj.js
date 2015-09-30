function player(textures,startx, starty, name)
{
    //for the object when cloning
    this.texture = textures;
    
    //sets up the object for rendering in pixi
    this.obj = new PIXI.Sprite(this.texture);
    this.obj.anchor.x = 0.5;
    this.obj.anchor.y = 0.5;
    this.obj.position.x = startx;
    this.obj.position.y = starty;
    
    //we want it to go in a direction these two properties will help with that
    this.vx = 0;
    this.vy = 0;
    this.velocity = 2;
    
    //some properties to help with logic
    this.crashed = false;
    this.playerName = name;
    
    //for our hit box our sprites are 25pix by 25pix and the origin should be in the center
    //25 / 2 = 12.5 but we will round up
    this.offset = 6;
    
    //this will be instantiated but will change
    this.futurexy = new PIXI.Point(startx,starty);
    //used for help in making calculations some of the futureexy code will probably get exsized
    //once i have a chance to make this with socket.io
    this.minus = true;
    this.killed = false;

}

//handles the begining of the game
player.prototype.start = function(container, direction){
    container.addChild(this.obj);
    switch (direction) {
        case 'up':
            // code
            this.up();
            break;
        case 'down':
            // code
            this.down();
            break;
        case 'left':
            this.left();
            break;
        case 'right':
            // code
            this.right();
            break;
        default:
            this.right();
            // code
    }
};

player.prototype.left = function(){
    this.vx = this.velocity * -1;
    this.minus = true;
    this.vy = 0;
};

player.prototype.right = function(){
    this.vx = this.velocity;
    this.minus = false;
    this.vy = 0;     
};

player.prototype.up = function(){
    this.vx = 0;
    this.vy = this.velocity * -1;   
    this.minus = true;
};

player.prototype.down = function(){
    this.vx = 0;
    this.vy = this.velocity;
    this.minus = false;
};

player.prototype.update = function(container){
    //the way this works it creates a duplicate sprite of where you where
    //hence we calculate a hit based on where you are going to be.
    if(!this.crashed){
        clone = new PIXI.Sprite(this.texture);
        //clone the object where its at now
        clone.anchor.x = 0.5;
        clone.anchor.y = 0.5;
        clone.position.x = this.obj.x;
        clone.position.y = this.obj.y;
        
        container.addChild(clone);
                    
        this.obj.x += this.vx;
        this.obj.y += this.vy;
        
        if(this.vx !== 0){
            this.futurexy.x += this.vx;
        }else if(this.vy !== 0){
            this.futurexy.y  += this.vy;
        }
    }
};

player.prototype.allstop = function(){
    this.vx = 0;
    this.vy = 0;
    this.velocity = 0;
};

//I going to call this offGrid, exceeds the bounds of the game
player.prototype.offGrid = function(container, limitx, limity){
    var check = false;
    if(this.futurexy.x > limitx + this.offset || this.futurexy.x < 0){
        check = true;
    }
    if(this.futurexy.y < 0 || this.futurexy.y > limity + this.offset){
        check = true;
    }
    
    return check;
};


//this was hard to hack to gether gosh darn it
//but the key was figuring out when to minus and when to add
//players should be an array
function gameOver(container, players){
    
    for(var i = 0; i<container.children.length; i++){
        var item = container.children[i];
        
        for(var j = 0; j < players.length; j++){
            if(IntersectionCheck(item, players[j])){
               return stopGame(players[j], players);
            }
        }
        
    }
    
}

function stopGame(killedPlayer, players){
    
    for(var j = 0; j < players.length; j++){
        players[j].allstop();
    }
    
    if(!killedPlayer.crashed){
        alert(killedPlayer.playerName + " Has lost");
        killedPlayer.crashed = true;
        return true;
    }
}

function pauseGame(players){
    for(var j = 0; j < players.length; j++){
        players[j].allstop();
    }
}


function IntersectionCheck(item, playerObj) {
    var xdist = 0;
    
    if (playerObj.vx !== 0) {
        if (playerObj.minus) {
            xdist = item.position.x - (playerObj.obj.position.x - playerObj.offset);
        } else {
            xdist = item.position.x - (playerObj.obj.position.x + playerObj.offset);
        }
    } else {
        xdist = item.position.x - playerObj.obj.position.x
    }

    if (xdist > -item.width / 2 && xdist < item.width / 2) {
        var ydist = 0;
        if (playerObj.vy !== 0) {
            if (playerObj.minus) {
                ydist = item.position.y - (playerObj.obj.position.y - playerObj.offset);
            } else {
                ydist = item.position.y - (playerObj.obj.position.y + playerObj.offset);
            }

        } else {
            ydist = item.position.y - playerObj.obj.position.y;
        }


        if (ydist > -item.height / 2 && ydist < item.height / 2) {
            return true;
        }
        
    }
    
    return false;
}