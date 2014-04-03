var crop = require('./modules/crop'),
    gui = require('nw.gui'),
    imp = require('./modules/imp'),
    map = require('./modules/map'),

    fgContext = document.getElementById('fg').getContext('2d'),
    imageContext = document.getElementById('image').getContext('2d'),
    video = document.getElementsByTagName('video')[0],

    width = 640,
    height = 480,

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
    if(crop.startX === 0) return;
    imageContext.drawImage(video, 0, 0, width, height);

    var center, outputData,
        inputData = imageContext.getImageData(crop.startX, crop.startY, crop.width, crop.height),
        input = inputData.data;

    console.time('thresh');
    imp.threshold(input);
    console.timeEnd('thresh');

    console.time('erode');
    outputData = imp.erode(inputData, 7, fgContext);
    console.timeEnd('erode');

    console.time('center');
    center = imp.center(outputData);
    console.timeEnd('center');

    // Temporarily display video snapshot post-processing.
    imageContext.clearRect(0, 0, width, height);
    imageContext.putImageData(outputData, crop.startX, crop.startY);

    // Draw the center dot, and redraw the crop square.
    fgContext.clearRect(0, 0, width, height);
    fgContext.strokeRect(crop.startX, crop.startY, crop.width, crop.height);
    if(center !== null)
        drawCircle(fgContext, crop.startX + center.x, crop.startY + center.y, 5);

    map(center);
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

            crop.init(fgContext, function() {
                clearInterval(snapInterval);
            }, function() {
                snapInterval = setInterval(snap, 200);
            });
        }
    );
};

console.time = function() {};
console.timeEnd = function() {};

fgContext.fillStyle = 'green';
fgContext.lineWidth = '5px';
fgContext.strokeStyle = 'rgb(255,255,255)';

init();
