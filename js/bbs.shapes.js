var bbs = bbs || {};

bbs.shapes = {
    getCircle: function (proto) {
        var sp;
        
        sp = Object.create(proto);
        
        sp.draw = bbs.canvas.drawBubble;
        sp.setRadius = function (x, y, mx, my) {
            var distance;
            
            distance = Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
            
            proto.value = Math.round(distance);
            
            return proto.value;
        };
        sp.isItHover = function (x, y, r, mx, my) {
            var distance;
            
            distance = Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
            
            return distance < r - 6;
        };
        sp.isItOnTheEdge = function (x, y, r, mx, my) {
            var distance;
            
            distance = Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
            
            return distance > r - 7 && distance < r + 7;
        };
        
        return sp;
    },
    getRect: function (proto) {
        var sp;
        
        sp = Object.create(proto);
        
        sp.draw = bbs.canvas.drawRect;
        sp.setRadius = function (x, y, mx, my) {
            var distance;
            
            distance = Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
            
            proto.value = Math.round(distance);
            
            return proto.value;
        };
        sp.isItHover = function (x, y, r, mx, my) {
            return ( (my > (y-r)+5) && // top line 
                     (mx < (x+r)-5) && // right line
                     (mx > (x-r)+5) && // left line
                     (my < (y+r)-5) )  // bottom line
        };
        sp.isItOnTheEdge = function (x, y, r, mx, my) {
            return ( ((y-r)-5 <= my && (y-r)+5 >= my && (x-r) <= mx && mx <= x+r) || // top line 
                     ((x+r)-5 <= mx && (x+r)+5 >= mx && (y-r) <= my && my <= y+r) || // right line
                     ((x-r)-5 <= mx && (x-r)+5 >= mx && (y-r) <= my && my <= y+r) || // left line
                     ((y+r)-5 <= my && (y+r)+5 >= my && (x-r) <= mx && mx <= x+r) )  // bottom line
        };
        
        return sp;
    },
    getTriangle: function (proto) {
        var sp;
        
        sp = Object.create(proto);
        
        sp.draw = bbs.canvas.drawTriangle;
        sp.setRadius = function (x, y, mx, my) {
            var distance;
            
            distance = Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
            
            proto.value = Math.round(distance);
            
            return proto.value;
        };
        sp.isItHover = function (x, y, r, mx, my) {
            // TODO -> it will be f*ing interesting... back to secondary school geometry basics i think :)
        };
        sp.isItOnTheEdge = function (x, y, r, mx, my) {
            // TODO -> it will be f*ing interesting... back to secondary school geometry basics i think :)
        };
        
        return sp;
    }
};