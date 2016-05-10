var bbs = bbs || {};

bbs.shapes = {
    getCircle: function (proto) {
        var sp;
        
        sp = Object.create(proto);
        
        sp.draw = bbs.canvas.drawBubble;
        sp.drawContact = bbs.canvas.drawCircle;
        sp.isItHover = bbs.math.isItInCircle;
        sp.isItOnTheEdge = bbs.math.isItOnCircleLine;
        
        sp.setRadius = function (x, y, mx, my) {
            var distance;
            
            distance = Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
            
            proto.value = Math.round(distance);
            
            return proto.value;
        };
        
        return sp;
    },
    getSquare: function (proto) {
        var sp;
        
        sp = Object.create(proto);
        
        sp.draw = bbs.canvas.drawSquare;
        
        sp.drawContact = function (x, y, r, fillStyle) {
            var sq;
            
            sq = bbs.math.getSquareInfo(x, y, r);
            
            bbs.canvas.drawRect(sq.x1, sq.y1, sq.side, sq.side, fillStyle);
            bbs.canvas.drawCircle(sq.x1, sq.y1, 5);
            bbs.canvas.drawCircle(sq.x2, sq.y2, 5);
            bbs.canvas.drawCircle(sq.x3, sq.y3, 5);
            bbs.canvas.drawCircle(sq.x4, sq.y4, 5);
        };
        sp.setRadius = function (x, y, mx, my) {
            proto.value = bbs.math.getDistance(x, y, mx, my);
            
            return proto.value;
        };
        sp.isItHover = function (x, y, r, mx, my) {
            var sq = bbs.math.getSquareInfo(x, y, r);
            
            return ( bbs.math.isItInCircle(sq.x1, sq.y1, 5, mx, my) ||  // left top
                     bbs.math.isItInCircle(sq.x2, sq.y2, 5, mx, my) ||  // right top
                     bbs.math.isItInCircle(sq.x3, sq.y3, 5, mx, my) ||  // right bottom
                     bbs.math.isItInCircle(sq.x4, sq.y4, 5, mx, my) ||  // left bottom
                     sq.isItInSquare(mx, my));                          // inside square
        };
        sp.isItOnTheEdge = function (x, y, r, mx, my) {
            var sq = bbs.math.getSquareInfo(x, y, r);
            
            return ( bbs.math.isItInCircle(sq.x1, sq.y1, 5, mx, my) ||  // left top
                     bbs.math.isItInCircle(sq.x2, sq.y2, 5, mx, my) ||  // right top
                     bbs.math.isItInCircle(sq.x3, sq.y3, 5, mx, my) ||  // right bottom
                     bbs.math.isItInCircle(sq.x4, sq.y4, 5, mx, my) )   // left bottom
        };
        
        return sp;
    },
    getTriangle: function (proto) {
        var sp;
        
        sp = Object.create(proto);
        
        sp.draw = bbs.canvas.drawTriangle;
        
        sp.drawContact = function (x, y, r, fillStyle) {
            var tr;
            
            tr = bbs.math.getIsoscelesTriangleInfo(x, y, r);
            
            bbs.canvas.drawCircle(tr.x1, tr.y1, 5);
            bbs.canvas.drawCircle(tr.x2, tr.y2, 5);
            bbs.canvas.drawCircle(tr.x3, tr.y3, 5);
            
            // inner rectangle for dragging
            bbs.canvas.drawRect(tr.innerRect.x1, tr.innerRect.y1, tr.innerRect.side, tr.innerRect.side, fillStyle);
        };
        sp.setRadius = function (x, y, mx, my) {            
            proto.value = bbs.math.getDistance(x, y, mx, my);
            
            return proto.value;
        };
        sp.isItHover = function (x, y, r, mx, my) {
            var tr;
            
            tr = bbs.math.getIsoscelesTriangleInfo(x, y, r);
            
            return ( bbs.math.isItInCircle(tr.x1, tr.y1, 5, mx, my) || // upper point
                     bbs.math.isItInCircle(tr.x2, tr.y2, 5, mx, my) || // right point
                     bbs.math.isItInCircle(tr.x3, tr.y3, 5, mx, my) || // left point
                     bbs.math.isItInSquare(tr.innerRect.ox, tr.innerRect.oy, tr.innerRect.r, mx, my)); // inner rect
            
        };
        sp.isItOnTheEdge = function (x, y, r, mx, my) {
            var tr;
            
            tr = bbs.math.getIsoscelesTriangleInfo(x, y, r);
            
            return ( bbs.math.isItInCircle(tr.x1, tr.y1, 5, mx, my) || // upper point
                     bbs.math.isItInCircle(tr.x2, tr.y2, 5, mx, my) || // right point
                     bbs.math.isItInCircle(tr.x3, tr.y3, 5, mx, my));  // left point
        };
        
        return sp;
    }
};