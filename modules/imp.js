module.exports = {

    center:function(imageData) {
        var count = 0,
            pixels = imageData.data,
            x = 0,
            y = 0;

        for(var i = 0; i < pixels.length; i+=4) {
            if(pixels[i] === 255) {
                count++;
                x += i / 4 % imageData.width;
                y += Math.floor(i / 4 / imageData.width);
            };
        };

        if(count < 400)
            return null;

        return {
            x:Math.round(x/count),
            y:Math.round(y/count)
        };
    },

    erode:function(inputData, dim, context) {
        var match, offset, s,
            half = (dim-1)/2,
            height = inputData.height,
            input = inputData.data,
            outputData = context.createImageData(inputData),
            output = outputData.data,
            width = inputData.width,
        
        isEdge = function(i) {
            var x = i / 4 % width,
                y = Math.floor(i / 4 / width);
            return (x < half || x > width - half - 1) || (y < half || y > height - half - 1);
        };

        for(var i = 0; i < input.length; i+=4) {
            if(isEdge(i)) {
                output[i] = 0;
                output[i+1] = 0;
                output[i+2] = 0;
                output[i+3] = 255;
                continue;
            };

            match = true;
            offset = i - 4*(half * width + half);

            for(var j = 0; j < dim*dim; j++) {
                if(input[offset + j*4] !== 255) {
                    match = false;
                    break;
                };

                if(j % dim === dim - 1)
                    offset += 4*(width - dim);
            };

            s = match ? 255 : 0;
            output[i] = s;
            output[i+1] = s;
            output[i+2] = s;
            output[i+3] = 255;
        };

        return outputData;
    },

    threshold:function(pixels) {
        var s;
        for(var i = 0; i < pixels.length; i+=4) {
            s = (pixels[i] + pixels[i+1] + pixels[i+2] === 765) ? 255 : 0;
            pixels[i] = s;
            pixels[i+1] = s;
            pixels[i+2] = s;
            pixels[i+3] = 255;
        };
    }

};
