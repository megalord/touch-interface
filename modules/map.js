var layouts = require('./layouts'),
    output = require('./output'),

    lastX = 0,
    lastY = 0,
    lastZone = null,
    mode = 'mouse',
    sensitivity = 3,
    tracking = false,

changeMode = function(code, context) {
    switch(code) {
        case 1: mode = 'mouse'; break;
        case 2: mode = 'keyboard'; break;
        case 3: mode = 'controls'; break;
    };

    var layout = layouts[mode];

    for(var i = 0; i < layout.length; i++)
        context.strokeRect(layout[i].x, layout[i].y, layout[i].w, layout[i].h);
},

getZone = function(coordinates) {
    var zone,
        layout = layouts[mode],
        x = coordinates.x,
        y = coordinates.y;

    for(var i = 0; i < layout.length; i++) {
        zone = layout[i];
        if(zone.x < x && x <= zone.x + zone.w && zone.y < y && y <= zone.y + zone.h)
            return zone.id;
    };

    return null;
},
    
handlers = {
    
    keyboard:function(coordinates) {
        var key,
            symbol = null,
            x = coordinates.x,
            y = coordinates.y;
        for(var i = 0; i < keyboard.length; i++) {
            key = keyboard[i];
                symbol = key.symbol;
        };

        if(symbol !== null)
            input.key(symbol);
    },

    mouse:function(cursor, zone) {
        // Tracking the mouse takes precedence so that the mouse
        // can track into the click and scroll areas (it has more room).
        if(tracking)
            output.mousemove(sensitivity*(cursor.x - lastX), sensitivity*(cursor.y - lastY));
        else switch(zone) {
            case 'left':    output.click('left'); break;
            case 'right':   output.click('right'); break;
            case 'scroll':  output.scroll(-(cursor.y - lastY)); break;
            default:        tracking = true; break;
        };

        lastX = cursor.x;
        lastY = cursor.y;
    }
    
};

module.exports = function(coordinates, context) {
    // Always check if a mode change is being attempted before passing to coordinates to a mode handler.
    if(!tracking && coordinates !== null && coordinates.y < 50)
        changeMode(Math.round(coordinates.x * 2 + 1), context);
    else if(coordinates === null)
        tracking = false;
    else
        handlers[mode](coordinates, getZone(coordinates));
};
