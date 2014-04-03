var erode = function(input, width, dim) {
    var match, offset,
        half = (dim-1)/2,
        height = input.length / width,
        output = new Array(input.length),

    isEdge = function(i) {
        var x = i % width,
            y = Math.floor(i / width);
        console.log(i, x, y);
        return (x < half || x > width - half - 1) || (y < half || y > height - half - 1);
    };

    for(var i = 0; i < input.length; i++) {
        if(isEdge(i)) {
            console.log('edge', i);
            output[i] = 0;
            continue;
        };

        match = true;
        offset = i - half * width - half;
        console.log('element', i);

        for(var j = 0; j < dim*dim; j++) {
            console.log('comparing', j, offset+j);
            if(input[offset + j] !== 1) {
                match = false;
                break;
            };

            if(j % dim === dim - 1)
                offset += width - dim;
        };

        if(match) console.log('match', i);
        output[i] = match ? 1 : 0;
    };

    return output;
};

var erode4 = function(input, width, dim) {
    var match, offset, s,
        half = (dim-1)/2,
        height = input.length / 4 / width,
        output = new Array(input.length),
    
    isEdge = function(i) {
        var x = i / 4 % width,
            y = Math.floor(i / 4 / width);
        console.log(i, x, y);
        return (x < half || x > width - half - 1) || (y < half || y > height - half - 1);
    };

    for(var i = 0; i < input.length; i+=4) {
        if(isEdge(i)) {
            console.log('edge', i);
            output[i] = 0;
            output[i+1] = 0;
            output[i+2] = 0;
            output[i+3] = 255;
            continue;
        };

        match = true;
        offset = i - 4*(half * width + half);
        console.log('element', i);

        for(var j = 0; j < dim*dim; j++) {
            console.log('comparing', j, offset+j*4);
            if(input[offset + j*4] !== 255) {
                match = false;
                break;
            };

            if(j % dim === dim - 1)
                offset += 4*(width - dim);
        };

        s = match ? 255 : 0;
        if(match) console.log('match', i);
        output[i] = s;
        output[i+1] = s;
        output[i+2] = s;
        output[i+3] = 255;
    };

    return output;
};

var t = function(input) {
    var output = [];
    for(var i = 0; i < input.length; i+=4)
        output.push(input[i] === 255 ? 1 : 0);
    return output;
};

var output,
    input = [],
    width = 640;

/*console.time('erode');
output = erode([
    1, 1, 1, 0, 0,
    1, 1, 1, 1, 0,
    1, 1, 1, 1, 0,
    0, 1, 1, 1, 0,
    0, 0, 0, 0, 0,
], 5, 5);
console.timeEnd('erode');
console.log(output);*/

console.time('erode4');
output = erode4([
    255, 0, 0, 255,   255, 0, 0, 255,   255, 0, 0, 255,   0, 0, 0, 255,   0, 0, 0, 255,
    255, 0, 0, 255,   255, 0, 0, 255,   255, 0, 0, 255,   255, 0, 0, 255,   0, 0, 0, 255,
    255, 0, 0, 255,   255, 0, 0, 255,   255, 0, 0, 255,   255, 0, 0, 255,   0, 0, 0, 255,
    255, 0, 0, 255,   255, 0, 0, 255,   255, 0, 0, 255,   255, 0, 0, 255,   0, 0, 0, 255,
    0, 0, 0, 255,   0, 0, 0, 255,   0, 0, 0, 255,   0, 0, 0, 255,   0, 0, 0, 255
], 5, 3);
console.timeEnd('erode4');
console.log(output);
console.log(t(output));


//output = new Array(input.length*4);
/*console.time('recon');
for(var i = 0; i < input.length; i++) {
    s = input[i] === 1 ? 255 : 0;
    output[i] = s;
    output[i+1] = s;
    output[i+2] = s;
    output[i+3] = 255;
};
console.timeEnd('recon');*/
