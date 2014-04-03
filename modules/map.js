var keyboard = require('./keyboard'),
    input = require('./input'),

    lastX = 0,
    lastY = 0,
    mode = 'mouse',
    sensitivity = 3,
    tracking = false,

changeMode = function(mode) {
    switch(mode) {
        case 1: mode = 'mouse'; break;
        case 2: mode = 'keyboard'; break;
        case 3: mode = 'controls'; break;
    };
},
    
handlers = {
    
    keyboard:function(coordinates) {
        if(coordinates === null)
            return;

        var key,
            symbol = null,
            x = coordinates.x,
            y = coordinates.y;
        for(var i = 0; i < keyboard.length; i++) {
            key = keyboard[i];
            if(key.x < x && x <= key.x + key.w && key.y < y && y <= key.y + key.h)
                symbol = key.symbol;
        };

        if(symbol !== null)
            input.key(symbol);
    },

    mouse:function(cursor) {
        if(cursor === null) {
            tracking = false;
            return;
        };

        if(tracking) {
            input.mousemove(-sensitivity*(cursor.x - lastX), -sensitivity*(cursor.y - lastY));
            lastX = cursor.x;
            lastY = cursor.y;
        } else {
            lastX = cursor.x;
            lastY = cursor.y;
            tracking = true;
        };
    }
    
};

module.exports = function(coordinates) {
    // Always check if a mode change is being attempted before passing to coordinates to a mode handler.
    if(!tracking && coordinates !== null && coordinates.y < 0.1) {
        changeMode(Math.round(coordinates.x * 2 + 1));
    } else {
        handlers[mode](coordinates);
    };
};
