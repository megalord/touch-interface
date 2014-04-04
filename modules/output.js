var spawn = require('child_process').spawn,

execute = function() {
    var args = Array.prototype.slice.call(arguments);

    for(var i = 0; i < args.length; i++)
        if(typeof args[i] === 'number')
            args[i] = args[i].toString();

    spawn('xdotool', args);
};

module.exports = {

    click:function(button) {
        if(button === 'left')
            code = 1;
        else if(button === 'right')
            code = 3
        else return;

        execute('click', code);
    },

    key:function(key) {
        execute('key', key);
    },

    mousemove:function(x, y) {
        execute('mousemove_relative', '--', x, y);
    },

    scroll:function(yDiff) {
        if(yDiff === 0) return;

        execute('click', yDiff > 0 ? 4 : 5);
    }

};
