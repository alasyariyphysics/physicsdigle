/* ============================================================
   WHITEBOARD INTERAKTIF (p5.js Instance Mode)
   Fungsi: Menggambar, Penghapus, Undo/Redo, Simpan Gambar
   ============================================================ */

let whiteboard = (p) => {
    // Pengaturan Default
    let canvasWidth = 800;
    let canvasHeight = 500;
    let currentColor = '#000000';
    let penSize = 3;
    let isEraser = false;

    // Stack untuk fitur Undo/Redo
    let history = [];
    let redoStack = [];

    p.setup = () => {
        // Mengambil lebar container agar otomatis pas (responsif)
        const container = document.getElementById('whiteboard-canvas-holder');
        const containerWidth = container ? container.offsetWidth : canvasWidth;

        let canvas = p.createCanvas(containerWidth, canvasHeight);
        canvas.parent('whiteboard-canvas-holder');
        
        p.background(255);
        p.cursor(p.CROSS);
        
        // Simpan kondisi awal kanvas kosong ke history
        saveToHistory();
    };

    p.draw = () => {
        // Loop draw dikosongkan karena kita menggunakan event mouseDragged
    };

    p.mouseDragged = () => {
        // Cek apakah kursor berada di dalam area kanvas
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            if (isEraser) {
                p.stroke(255); // Warna putih untuk penghapus
                p.strokeWeight(penSize * 4); // Penghapus lebih besar dari pena
            } else {
                p.stroke(currentColor);
                p.strokeWeight(penSize);
            }
            // Gambar garis dari posisi mouse sebelumnya ke posisi sekarang
            p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        }
    };

    // Saat klik mouse dilepas, ambil snapshot untuk history
    p.mouseReleased = () => {
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            saveToHistory();
        }
    };

    // Fungsi internal untuk menyimpan snapshot kanvas
    function saveToHistory() {
        history.push(p.get());
        // Batasi memori: simpan maksimal 30 langkah terakhir
        if (history.length > 30) history.shift(); 
        
        // Kosongkan redoStack setiap kali ada coretan baru
        redoStack = []; 
    }

    /* ------------------------------------------------------------
       API GLOBAL (Dapat dipanggil dari tombol HTML)
       ------------------------------------------------------------ */

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
            // Pindahkan kondisi sekarang ke redo stack
            redoStack.push(history.pop());
            // Ambil kondisi sebelumnya
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
        if (confirm("Apakah Anda yakin ingin menghapus seluruh papan tulis?")) {
            p.background(255);
            saveToHistory();
        }
    };

    window.saveImage = () => {
        p.saveCanvas('Catatan-Fisika-' + p.day() + p.month() + p.year(), 'png');
    };

    window.toggleFullscreen = () => {
        let fs = p.fullscreen();
        p.fullscreen(!fs);
    };

    // Menangani perubahan ukuran jendela agar kanvas tetap pas
    p.windowResized = () => {
        const container = document.getElementById('whiteboard-canvas-holder');
        if (container) {
            let newWidth = container.offsetWidth;
            
            // Jika masuk mode Fullscreen
            if (p.fullscreen()) {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            } else {
                p.resizeCanvas(newWidth, canvasHeight);
            }

            // Restore konten terakhir setelah resize (karena resize p5 menghapus kanvas)
            if (history.length > 0) {
                p.image(history[history.length - 1], 0, 0, p.width, p.height);
            }
        }
    };
};

// Inisialisasi p5 instance
let myWhiteboard = new p5(whiteboard);
