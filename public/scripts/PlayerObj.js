function player(texture,startx, starty)
{
    this.texture = texture;
    this.obj = new PIXI.Sprite(this.texture);
    this.obj.anchor.x = 0.5;
    this.obj.anchor.y = 0.5;
    this.vx = 0;
    this.vy = 0;
    this.obj.position.x = startx;
    this.obj.position.y = starty;
}

player.prototype.setContainer = function(container){
    container.addChild(this.obj);
};

player.prototype.left = function(){
    this.vx = -5;
    this.vy = 0;
};

player.prototype.right = function(){
    this.vx = 5;
    this.vy = 0;     
};

player.prototype.up = function(){
    this.vx = 0;
    this.vy = -5;    
};

player.prototype.down = function(){
    this.vx = 0;
    this.vy = 5;     
};

player.prototype.update = function(container){
    clone = new PIXI.Sprite(texture);
    
    //clone the object where its at now
    clone.anchor.x = 0.5;
    clone.anchor.y = 0.5;
    clone.position.x = this.obj.x;
    clone.position.y = this.obj.y;
    
    container.addChild(clone);
                
    this.obj.x += this.vx;
    this.obj.y += this.vy;
    
    
    //for(var i = 0; i<container.children.length; i++){
        //console.log(container.children[i]);
    //}
    
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
}
