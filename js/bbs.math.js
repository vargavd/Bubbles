var bbs = bbs || {};

/* Math module - for trigonometry
   Helper functions for calculating the coords and sides */
   
bbs.math = (function () {
    var sqrt2, sqrt3, sqrt3per2, math = {};;
    
    // consts
    sqrt2 = Math.sqrt(2);
    sqrt3 = Math.sqrt(3);
    sqrt5 = Math.sqrt(5);
    sqrt6 = Math.sqrt(6);
    sqrt3per2 = sqrt3 / 2;
    sqrt5per2 = sqrt6 / 2;
    sqrt6per2 = sqrt6 / 2;
    
    math.getDistance = function (x1, y1, x2, y2) {
        return Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
    };
    
    math.getIsoscelesTriangleInfo = function (x, y, r) {
        var x1, y1, x2, y2, x3, y3, side, m,
            innerRect;
            
        // triangle
        x1 =   x,
        y1 =   y - r,
        x2 =   x + sqrt3per2 * r,
        y2 =   y + r / 2,
        x3 =   x - sqrt3per2 * r,
        y3 =   y + r / 2,
        side = sqrt3 * r,
        m =    1.5 * r
        
        // inner square
        innerRect = {};
        innerRect.side = sqrt3 * side / (2 + sqrt3);
        innerRect.x1 = x1 - innerRect.side / 2;
        innerRect.y1 = y1 + innerRect.side * sqrt3 / 2;
        innerRect.r = innerRect.side / sqrt2;
        innerRect.ox = innerRect.x1 + innerRect.side / 2;
        innerRect.oy = innerRect.y1 + innerRect.side / 2;
        
        return {
            x1:   x1,
            y1:   y1,
            x2:   x2,
            y2:   y2,
            x3:   x3,
            y3:   y3,
            side: side,
            m:    m,
            innerRect: innerRect
        };
    };
    math.get306090TriangleInfo = function (a, bLong, bShort) {
          var infos;
          
          infos = {};
          
          if (a !== 0) {
              infos.a = a;
              infos.bLong = a * sqrt5per2;
              infos.bShort = a / 2;  
              infos.m = sqrt5 * a / 4;
          } else if (bLong !== 0) {
              infos.a = (bLong / sqrt5) * 2;
              infos.bLong = bLong;
              infos.bShort = (bLong / sqrt5);
              infos.m = bLong / 2;
          } else if (bShort !== 0) {
              infos.a = bShort * 2;
              infos.bLong = bShort * sqrt5;
              infos.bShort = bShort;
              infos.m = sqrt5 * bShort / 2;
          } else {
              throw "get306090TriangleInfo: at least one parameter must be real side";
          }
          
          return infos;
    };
    math.get4590TriangleInfo = function (a, b) {
        var infos;
        
        infos = {};
        
        if (a !== 0) {
            infos.a = a;
            infos.b = a / sqrt2;
            infos.m = sqrt3per2 * a / 2;
        } else if (b !== 0) {
            infos.a = b * sqrt2;
            infos.b = b;
            infos.m = sqrt6per2 * b / 2;
        } else {
            throw "get306090TriangleInfo: at least one parameter must be real side";
        }
        
        return infos;
    }
    math.getSquareInfo = function (x, y, r) {
        var infos, halfSide;
        
        infos = {};
        
        halfSide = math.get4590TriangleInfo(r).b;
        
        infos.side = halfSide * 2;
        infos.x1 = x - halfSide;
        infos.y1 = y - halfSide;
        infos.x2 = x + halfSide;
        infos.y2 = y - halfSide;
        infos.x3 = x + halfSide;
        infos.y3 = y + halfSide;
        infos.x4 = x - halfSide;
        infos.y4 = y + halfSide;
        
        infos.isItInSquare = function (mx, my) {
            return ( (my > infos.y1) &&  // top line 
                     (mx < infos.x3) &&  // right line
                     (mx > infos.x1) &&  // left line
                     (my < infos.y3) );  // bottom line
        }
        
        return infos;
    };
    
    // mouse position functions
    math.isItInCircle = function (x, y, r, mx, my) {
        var distance;
            
        distance = Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
        
        return distance < r;
    };
    math.isItOnCircleLine = function (x, y, r, mx, my) {
        var distance;
            
        distance = Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
        
        return distance > r - 5 && distance < r + 5;
    };
    math.isItInSquare = function (x, y, r, mx, my) {
        var sq = math.getSquareInfo(x, y, r);
        
        return sq.isItInSquare(mx, my);
    };
    math.isItOnSquareLine = function (x, y, r, mx, my) {
        var sq = math.getSquareInfo(x, y, r);
        
        return ( (sq.y1-5 <= my && sq.y1+5 >= my && sq.x1 <= mx && mx <= sq.x3) || // top line 
                 (sq.x3-5 <= mx && sq.x3+5 >= mx && sq.y1 <= my && my <= sq.y3) || // right line
                 (sq.x1-5 <= mx && sq.x1+5 >= mx && sq.y1 <= my && my <= sq.y3) || // left line
                 (sq.y3-5 <= my && sq.y3+5 >= my && sq.x1 <= mx && mx <= sq.x3) );  // bottom line
    };
    
    return math;
}());
