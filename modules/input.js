var spawn = require('child_process').spawn,

execute = function() {
    var args = Array.prototype.slice.call(arguments);

    for(var i = 0; i < args.length; i++)
        if(typeof args[i] === 'number')
            args[i] = args[i].toString();

    spawn('xdotool', args);
};

module.exports = {

    click:function() {
        execute('click', 1);
    },

    key:function(key) {
        execute('key', key);
    },

    mousemove:function(x, y) {
        execute('mousemove_relative', '--', x, y);
    }

};
