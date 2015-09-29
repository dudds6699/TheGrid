function player(texture,startx, starty, name)
{
    this.texture = texture;
    this.obj = new PIXI.Sprite(this.texture);
    this.obj.anchor.x = 0.5;
    this.obj.anchor.y = 0.5;
    this.vx = 0;
    this.vy = 0;
    this.obj.position.x = startx;
    this.obj.position.y = starty;
    this.velocity = 2;
    this.crashed = false;
    this.playerName = name;
}

player.prototype.setContainer = function(container){
    container.addChild(this.obj);
};

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
    this.vy = 0;
};

player.prototype.right = function(){
    this.vx = this.velocity;
    this.vy = 0;     
};

player.prototype.up = function(){
    this.vx = 0;
    this.vy = this.velocity * -1;    
};

player.prototype.down = function(){
    this.vx = 0;
    this.vy = this.velocity;     
};

player.prototype.update = function(container){
    
    if(!this.crashed){
        clone = new PIXI.Sprite(texture);
        //clone the object where its at now
        clone.anchor.x = 0.5;
        clone.anchor.y = 0.5;
        clone.position.x = this.obj.x;
        clone.position.y = this.obj.y;
        
        container.addChild(clone);
                    
        this.obj.x += this.vx;
        this.obj.y += this.vy;
    }
};

player.prototype.allstop = function(){
    this.vx = 0;
    this.vy = 0;
    this.velocity = 0;
};

player.prototype.crash = function(container, limitx, limity){
    var check = false;
    if(this.obj.x > limitx || this.obj.x < 0){
        check = true;
    }
    if(this.obj.y < 0 || this.obj.y >limity){
        check = true;
    }
    
    return check;
};

player.prototype.hasCrashed = function(container, resx, resy){
    var check = this.crash(container, resx, resy)
                
    if(check){
        if(!this.crashed){
            this.allstop();
            this.crashed = true;
            alert(this.playerName + " Has Crashed");
        }
    }
};