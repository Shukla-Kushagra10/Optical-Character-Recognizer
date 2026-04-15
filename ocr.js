var ocrDemo = {
    // --- Step 4 Settings ---
    HOST: "http://localhost",
    PORT: "8000",
    BATCH_SIZE: 10,
    
    // Canvas dimensions
    CANVAS_WIDTH: 200,
    TRANSLATED_WIDTH: 20,
    PIXEL_WIDTH: 10, // Each "logic" pixel is 10 actual pixels
    
    // Data storage
    data: new Array(400).fill(0), // 20x20 grid flattened
    trainArray: [],
    trainingRequestCount: 0,
    BLUE: "#0000ff",

    onLoadFunction: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.isDrawing = false;

        // Event listeners for drawing
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e, this.ctx, this.canvas));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e, this.ctx, this.canvas));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        this.drawGrid(this.ctx);
    },

    drawGrid: function (ctx) {
        ctx.strokeStyle = this.BLUE;
        for (var x = 0; x <= this.CANVAS_WIDTH; x += this.PIXEL_WIDTH) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, this.CANVAS_WIDTH);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, x); ctx.lineTo(this.CANVAS_WIDTH, x);
            ctx.stroke();
        }
    },

    onMouseMove: function (e, ctx, canvas) {
        if (!canvas.isDrawing) return;
        this.fillSquare(ctx, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    },

    onMouseDown: function (e, ctx, canvas) {
        canvas.isDrawing = true;
        this.fillSquare(ctx, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    },

    onMouseUp: function (e) {
        this.canvas.isDrawing = false;
    },

    fillSquare: function (ctx, x, y) {
        var xPixel = Math.floor(x / this.PIXEL_WIDTH);
        var yPixel = Math.floor(y / this.PIXEL_WIDTH);
        
        // Correct index calculation for a 20x20 flat array
        var index = (yPixel * this.TRANSLATED_WIDTH) + xPixel;
        
        if (index >= 0 && index < 400) {
            this.data[index] = 1;
            ctx.fillStyle = '#000000'; // Draw in black
            ctx.fillRect(xPixel * this.PIXEL_WIDTH, yPixel * this.PIXEL_WIDTH, this.PIXEL_WIDTH, this.PIXEL_WIDTH);
        }
    },

    resetCanvas: function() {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_WIDTH);
        this.drawGrid(this.ctx);
        this.data = new Array(400).fill(0);
    },

    train: function () {
        var digitVal = document.getElementById("digit").value;
        if (digitVal === "" || this.data.indexOf(1) < 0) {
            alert("Please type a digit and draw on the canvas.");
            return;
        }

        this.trainArray.push({ "y0": this.data, "label": parseInt(digitVal) });
        this.trainingRequestCount++;
        this.resetCanvas();

        if (this.trainingRequestCount == this.BATCH_SIZE) {
            alert("Sending batch of 10 samples to server...");
            this.sendData({ trainArray: this.trainArray, train: true });
            this.trainingRequestCount = 0;
            this.trainArray = [];
        } else {
            alert("Sample recorded. Need " + (this.BATCH_SIZE - this.trainingRequestCount) + " more for this batch.");
        }
    },

    test: function () {
        if (this.data.indexOf(1) < 0) {
            alert("Please draw a digit first.");
            return;
        }
        this.sendData({ image: this.data, predict: true });
    },

    receiveResponse: function (xmlHttp) {
        if (xmlHttp.status != 200) {
            alert("Server error: " + xmlHttp.status);
            return;
        }
        var responseJSON = JSON.parse(xmlHttp.responseText);
        if (responseJSON.type == "test") {
            alert("The network predicts: " + responseJSON.result);
        }
    },

    sendData: function (json) {
        var xmlHttp = new XMLHttpRequest();
        // Construct the URL using HOST and PORT
        xmlHttp.open('POST', this.HOST + ":" + this.PORT, true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        
        xmlHttp.onload = () => this.receiveResponse(xmlHttp);
        xmlHttp.onerror = () => alert("Server unreachable. Make sure server.py is running.");
        
        xmlHttp.send(JSON.stringify(json));
    }
};