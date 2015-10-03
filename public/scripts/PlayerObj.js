function RectangleHelper(x, y, size,  w, h, up){
    //rectangles first xy is the top left corner which is 0 by 0
    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;
    this.created = false;
    //the object of the Graphics
    this.rect = null;
    
}

RectangleHelper.prototype.addToField = function(container){
    this.rect = new PIXI.Graphics();
    container.addChild(this.rect);
    this.created = true;
};


RectangleHelper.prototype.draw = function(){
    
    if(this.created){
        this.rect.clear();
        //line style will be useless later but right now lets keep it red.
        this.rect.lineStyle(1, 0xFF0000);
        this.rect.drawRect(this.x, this.y, this.w, this.h);
        this.rect.alpha = 0;
    }
    
};

function player(textures,startx, starty, name)
{
    //for the object when cloning
    this.texture = textures;
    
    //sets up the object for rendering in pixi
    this.coordx = startx;
    this.coordy = starty;
    
    this.obj = new PIXI.Sprite(this.texture);
    this.obj.anchor.x = 0.5;
    this.obj.anchor.y = 0.5;
    this.obj.position.x = startx;
    this.obj.position.y = starty;
    
    //we want it to go in a direction these two properties will help with that
    this.vx = 0;
    this.vy = 0;
    this.velocity = 3;
    
    
    
    //some properties to help with logic
    this.crashed = false;
    this.playerName = name;
    
    //for our hit box our sprites are 25pix by 25pix and the origin should be in the center
    //25 / 2 = 12.5 but we will round up
    this.offset = 6;
    
    this.pixsize = 3;
    
    //this will be instantiated but will change
    this.futurexy = new PIXI.Point(startx,starty);
    //used for help in making calculations some of the futureexy code will probably get exsized
    //once i have a chance to make this with socket.io
    this.minus = true;
    this.killed = false;
    
    this.currentRectangle = null;
    
    this.started = false;
    
    
    this.rectangles = [];
    //this.addRectangle();
    

 
    

}

player.prototype.addRectangle = function(){
    //left and right
    //i'm tired screw pixel perfect hit detection
    this.currentRectangle = new RectangleHelper(this.futurexy.x, this.futurexy.y, this.pixsize, 0, 0);
    this.rectangles.push(this.currentRectangle);    
};

//handles the begining of the game
player.prototype.start = function(container, direction){
    
    this.started = true;
    switch (direction) {
        case 'up':
            // code
            this.up(container);
            break;
        case 'down':
            // code
            this.down(container);
            break;
        case 'left':
            this.left(container);
            break;
        case 'right':
            // code
            this.right(container);
            break;
        default:
            this.right(container);
            // code
    }
    
    container.addChild(this.obj);
};

player.prototype.left = function(container){
    if(this.vx <= 0){
        this.vx = this.velocity * -1;
        this.minus = true;
        this.vy = 0;
        this.addRectangle();
        this.currentRectangle.h = this.pixsize;
        this.currentRectangle.addToField(container);
        this.currentRectangle.draw();
        this.obj.position.x = this.futurexy.x - this.offset /2;
        this.obj.position.y = this.futurexy.y + this.pixsize /2;
    }
};

player.prototype.right = function(container){
    if(this.vx >= 0){
        this.vx = this.velocity;
        this.minus = false;
        this.vy = 0;
        this.addRectangle();
        this.currentRectangle.h = this.pixsize;
        this.currentRectangle.addToField(container);
        this.currentRectangle.draw();
        this.obj.position.x = this.futurexy.x + this.offset /2;
        this.obj.position.y = this.futurexy.y + this.pixsize /2;
    }
};

player.prototype.up = function(container){
    if(this.vy <= 0){
        this.vx = 0;
        this.vy = this.velocity * -1;   
        this.minus = true;
        this.addRectangle();
        this.currentRectangle.w = this.pixsize;
        this.currentRectangle.addToField(container);
        this.currentRectangle.draw();
        this.obj.position.x = this.futurexy.x + this.pixsize /2;
        this.obj.position.y = this.futurexy.y - this.offset /2;        
    }
};

player.prototype.down = function(container){
    if(this.vy >= 0){
        this.vx = 0;
        this.vy = this.velocity;
        this.minus = false;        
        this.addRectangle();
        this.currentRectangle.w = this.pixsize;
        this.currentRectangle.addToField(container);
        this.currentRectangle.draw();
        this.obj.position.x = this.futurexy.x + this.pixsize /2;
        this.obj.position.y = this.futurexy.y + this.offset /2;        
    }
};

player.prototype.update = function(container){
    //the way this works it creates a duplicate sprite of where you where
    //hence we calculate a hit based on where you are going to be.
    if(!this.crashed){

        this.clone(container);
        this.move();
        this.currentRectangle.draw();

    }
};

player.prototype.move = function(){
    this.obj.x += this.vx;
    this.obj.y += this.vy;
        
    if(this.vx !== 0){
        this.futurexy.x += this.vx;
        this.currentRectangle.w += (this.vx * 1);
    }else if(this.vy !== 0){
        this.futurexy.y  += this.vy;
        this.currentRectangle.h += (this.vy  * 1);
    }
};

player.prototype.clone = function(container){
    clone = new PIXI.Sprite(this.texture);
    //clone the object where its at now
    clone.anchor.x = 0.5;
    clone.anchor.y = 0.5;
    clone.position.x = this.obj.position.x;
    clone.position.y = this.obj.position.y;
        
    container.addChild(clone);
};

player.prototype.allstop = function(){
    this.vx = 0;
    this.vy = 0;
    this.velocity = 0;
};

//I going to call this offGrid, exceeds the bounds of the game
player.prototype.offGrid = function(limitx, limity){
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
function gameOver(players, limx, limy){
    //itterate through all the players
    var hitareas = [];
    for(var j = 0; j< players.length; j++){
        hitareas = hitareas.concat(players[j].rectangles);
    }
    
    
    //check if the player IntersectionCheck
    for(var p = 0; p < players.length; p ++){
        play = players[p];
        for(var i = 0; i < hitareas.length; i++){
            var item = hitareas[i];
            if(IntersectionCheck(item, play)){
                return stopGame(play, players);
            }
        }
    }
    

    for(var k = 0; k < players.length; k++){
        if(players[k].offGrid(limx, limy)){
            return stopGame(players[k], players);
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
    
    //we don't play as a pixel we play as a box so lets get the latest box
	var checkrect = item.rect.getBounds();
	var objbounds = playerObj.obj.getBounds();
	
	var point = new PIXI.Point(objbounds.x + objbounds.width /2, objbounds.y + objbounds.height/2);
	if(playerObj.vx > 0){
        point.x  = point.x + playerObj.offset;
	}
    else if(playerObj.vx < 0){
        point.x  = point.x - playerObj.offset;
	}
	
	if(playerObj.vy > 0){
        point.y = point.y + playerObj.offset;
	}else if(playerObj.vy < 0){
        point.y = point.y - playerObj.offset;
	}
	
	
	return rectangleContainsPoint(checkrect,point);

}

function rectangleContainsPoint(rect, point) {
	if (rect.width <= 0 || rect.height <= 0) {
		return false;
	}

    if(point.x >= rect.x && point.x <= (rect.x + rect.width)){
        if(point.y >= rect.y && point.y <= (rect.y + rect.height)){
            return true;
        }
    }
 
 
}

