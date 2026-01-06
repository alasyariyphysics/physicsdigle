let whiteboard = (p) => {
    let canvasWidth = 800;
    let canvasHeight = 500;
    let currentColor = '#000000';
    let penSize = 3;
    let isEraser = false;

    // Stack untuk fitur Undo/Redo
    let history = [];
    let redoStack = [];

    p.setup = () => {
        let canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent('whiteboard-canvas-holder');
        p.background(255);
        
        // Simpan kondisi awal kanvas kosong
        saveToHistory();
    };

    p.draw = () => {
        // Logika kursor bisa ditambahkan di sini jika perlu
    };

    p.mouseDragged = () => {
        // Cek apakah mouse berada di dalam area kanvas
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            if (isEraser) {
                p.stroke(255);
                p.strokeWeight(penSize * 4); // Eraser dibuat lebih besar proporsional
            } else {
                p.stroke(currentColor);
                p.strokeWeight(penSize);
            }
            p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        }
    };

    // Saat mouse dilepas, simpan perubahan ke riwayat
    p.mouseReleased = () => {
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            saveToHistory();
        }
    };

    function saveToHistory() {
        history.push(p.get());
        if (history.length > 30) history.shift(); // Batasi 30 langkah agar memori aman
        redoStack = []; // Hapus redo stack setiap ada coretan baru
    }

    // --- API untuk dipanggil dari HTML ---

    window.setPenColor = (color) => {
        isEraser = false;
        currentColor = color;
    };

    window.setPenSize = (size) => {
        penSize = parseInt(size);
    };

    window.useEraser = () => {
        isEraser = true;
    };

    window.undo = () => {
        if (history.length > 1) {
            redoStack.push(history.pop());
            let prevState = history[history.length - 1];
            p.image(prevState, 0, 0);
        }
    };

    window.redo = () => {
        if (redoStack.length > 0) {
            let nextState = redoStack.pop();
            history.push(nextState);
            p.image(nextState, 0, 0);
        }
    };

    window.clearWhiteboard = () => {
        if (confirm("Hapus semua coretan?")) {
            p.background(255);
            saveToHistory();
        }
    };

    window.saveImage = () => {
        p.saveCanvas('my-drawing', 'png');
    };

    window.toggleFullscreen = () => {
        let fs = p.fullscreen();
        p.fullscreen(!fs);
    };

    // Responsif: Sesuaikan ukuran kanvas jika masuk fullscreen
    p.windowResized = () => {
        if (p.fullscreen()) {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
            p.background(255); // Catatan: Resize p5 akan menghapus kanvas, undo akan mengembalikan gambar
            if(history.length > 0) p.image(history[history.length-1], 0, 0);
        } else {
            p.resizeCanvas(canvasWidth, canvasHeight);
            if(history.length > 0) p.image(history[history.length-1], 0, 0);
        }
    };
};

let myWhiteboard = new p5(whiteboard);
