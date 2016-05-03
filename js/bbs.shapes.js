var bbs = bbs || {};

bbs.shapes = {
    getCircle: function (proto) {
        var sp;
        
        sp = Object.create(proto);
        
        sp.draw = bbs.canvas.drawBubble;
        
        return sp;
    }  
};