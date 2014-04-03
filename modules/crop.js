module.exports = {

    endX:0,
    endY:0,
    mousedown:false,
    startX:0,
    startY:0,

    init:function(context, onstart, onstop) {
        var self = this;
        this.context = context;

        Object.defineProperties(this, {
            width:{
                get:function() {
                    return this.endX - this.startX;
                }
            },
            height:{
                get:function() {
                    return this.endY - this.startY;
                }
            }
        });

        context.canvas.addEventListener('mousedown', function(event) {
            self.inputHandler(event);
            onstart();
        });
        context.canvas.addEventListener('mousemove', function(event) {
            self.outputHandler(event);
        });
        context.canvas.addEventListener('mouseup', function(event) {
            var tmp;

            self.outputHandler(event);
            self.mousedown = false;

            if(self.startX > self.endX) {
                tmp = self.startX;
                self.startX = self.endX;
                self.endX = tmp;
            };

            if(self.startY > self.endY) {
                tmp = self.startY;
                self.startY = self.endY;
                self.endY = tmp;
            };
            onstop();
        });
    },

    inputHandler:function(event) {
        this.mousedown = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
    },

    outputHandler:function(event) {
        if(this.mousedown) {
            this.endX = event.clientX;
            this.endY = event.clientY;
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.context.strokeRect(this.startX, this.startY, this.width, this.height);
        };
    }
}
