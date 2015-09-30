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
    this.minus = true;

}

player.prototype.start = function(container, direction){
    container.addChild(this.obj);
    switch (direction) {
        case 'up':
            // code
            this.up();
            this.futurexy = new PIXI.Point(this.obj.x, this.obj.y - this.offset);
            break;
        case 'down':
            // code
            this.down();
            this.futurexy = new PIXI.Point(this.obj.x, this.obj.y + this.offset);
            break;
        case 'left':
            this.left();
            this.futurexy = new PIXI.Point(this.obj.x - this.offset , this.obj.y);
            break;
        case 'right':
            // code
            this.right();
            this.futurexy = new PIXI.Point(this.obj.x  + this.offset , this.obj.y);
            break;
        default:
            this.right();
            this.futurexy = new PIXI.Point(this.obj.x  + this.offset , this.obj.y);
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

//I going to call this offGrid
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


player.prototype.intersects = function(container){
    for(var i = 0; i<container.children.length; i++){
        var item = container.children[i];
        
        var xdist = 0;
        if(this.vx !== 0){
            if(this.minus){
                xdist = item.position.x - (this.obj.position.x - this.offset);
            }else{
                xdist = item.position.x - (this.obj.position.x + this.offset);
            }
            
        }else{
            xdist = item.position.x - this.obj.position.x
        }
        
        if(xdist > -item.width/2 && xdist < item.width/2)
		{
            var ydist = 0;
            if(this.vy !== 0){
                if(this.minus){
                    ydist = item.position.y - (this.obj.position.y - this.offset);
                }else{
                    ydist = item.position.y - (this.obj.position.y + this.offset);
                }
                
            }else{
                ydist = item.position.y - this.obj.position.y;
            }

           
            if(ydist > -item.height/2 && ydist < item.height/2)
			{
                return true;
			}
		}
    }
    return false;
};
//if it crashed then let the player know
player.prototype.hasCrashed = function(container, resx, resy){
    var check = this.offGrid(container, resx, resy);
                    
    if(check){
        if(!this.crashed){
            this.allstop();
            this.crashed = true;
            alert(this.playerName + " Has Went Off Grid");
        }
    }
    
    check = this.intersects(container);
    
        if(check){
        if(!this.crashed){
            this.allstop();
            this.crashed = true;
            alert(this.playerName + " Has Crashed");
        }
    }
    
    return check;
};