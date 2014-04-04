var crop = require('./modules/crop'),
    gui = require('nw.gui'),
    imp = require('./modules/imp'),
    map = require('./modules/map'),

    imageContext = document.getElementById('image').getContext('2d'),
    layoutContext = document.getElementById('layout').getContext('2d'),
    trackerContext = document.getElementById('tracker').getContext('2d'),
    video = document.getElementsByTagName('video')[0],

    x = 60,
    y = 230,
    w = 520,
    h = 230,

    snapElement = document.getElementById('snap'),
    snapInterval,

drawCircle = function(context, x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, 2*Math.PI, false);
    context.fill();
},

init = function() {
    MediaStreamTrack.getSources(function(sources) {
        for(var i = 0; i < sources.length; i++) {
            if(sources[i].kind === 'video' && sources[i].label.slice(0, 7) === 'Vimicro') {
                startVideo(sources[i].id);
                return;
            };
        };

        alert('Vimicro camera not found.');
        gui.App.quit();
    });
},

snap = function() {
    console.time('total');
    imageContext.drawImage(video, x, y, w, h, 0, 0, w, h);

    var center, outputData,
        imageData = imageContext.getImageData(0, 0, w, h);

    console.time('thresh');
    imp.threshold(imageData.data);
    console.timeEnd('thresh');

    console.time('erode');
    imp.erode(imageData, 7);
    console.timeEnd('erode');

    // Temporarily display video snapshot post-processing.
    imageContext.clearRect(0, 0, w, h);
    imageContext.putImageData(imageData, x, y);

    console.time('center');
    center = imp.center(imageData);
    console.timeEnd('center');

    // Draw the tracker.
    trackerContext.clearRect(0, 0, w, h);
    if(center !== null) {
        drawCircle(trackerContext, center.x, center.y, 5);

        // Flip the y coordinate so that the origin is at the bottom left.
        center.y = h - center.y;
    };

    // Temporary measure for determining layout.
    snapElement.textContent = center === null ? 'none' : center.x + ', ' + center.y;


    // Map the coordinates and perform an action.
    // Redraw the layout if the mode is changed.
    map(center, layoutContext);

    // 50-85 ms
    console.timeEnd('total');
},

startVideo = function(sourceId) {
    navigator.webkitGetUserMedia({
            video:{
                optional:[{
                    sourceId:sourceId
                }]
            }
        }, function(stream) {
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();

            //snap();
            snapInterval = setInterval(snap, 120);
        }
    );
};

// Overwrite console functions to prevent logging (performance hit).
/*console.time = function() {};
console.timeEnd = function() {};*/

// Configure the contexts.
imageContext.translate(w, 0);
imageContext.scale(-1, 1);

layoutContext.canvas.style.left = x + 'px';
layoutContext.canvas.style.top = y + 'px';
layoutContext.canvas.width = w;
layoutContext.canvas.height = h;

trackerContext.canvas.style.left = x + 'px';
trackerContext.canvas.style.top = y + 'px';
trackerContext.canvas.width = w;
trackerContext.canvas.height = h;

layoutContext.lineWidth = '5px';
layoutContext.strokeStyle = 'rgb(255,255,255)';

trackerContext.fillStyle = 'green';

// Set the mode to the mouse.
map({x:0, y:0}, layoutContext);

init();
