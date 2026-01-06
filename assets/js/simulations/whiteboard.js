// File: assets/js/simulations/whiteboard.js

let whiteboard = (p) => {
  let canvasWidth = 800;
  let canvasHeight = 500;
  let currentColor = '#000000'; // Default hitam
  let penSize = 3;
  let isEraser = false;

  // Stacks untuk Undo dan Redo
  let history = [];
  let redoStack = [];

  p.setup = () => {
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('whiteboard-canvas-holder');
    p.background(255);
    
    // Simpan keadaan awal (kanvas kosong) ke history
    saveState();
  };

  p.draw = () => {
    // Kursor berubah jadi lingkaran jika penghapus aktif
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      if (isEraser) {
        p.cursor(p.CROSS);
      } else {
        p.cursor(p.ARROW);
      }
    }
  };

  p.mouseDragged = () => {
    if (isEraser) {
      p.stroke(255); // Warna putih untuk menghapus
      p.strokeWeight(20);
    } else {
      p.stroke(currentColor);
      p.strokeWeight(penSize);
    }
    p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
  };

  // Simpan state saat mouse dilepas (selesai satu tarikan garis)
  p.mouseReleased = () => {
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      saveState();
    }
  };

  // --- Fungsi Kontrol ---

  function saveState() {
    // Ambil gambar kanvas saat ini dan simpan ke history
    history.push(p.get());
    // Batasi history agar tidak terlalu berat (misal 20 langkah)
    if (history.length > 21) history.shift();
    // Kosongkan redo setiap ada aksi baru
    redoStack = [];
  }

  window.setPenColor = (color) => {
    isEraser = false;
    currentColor = color;
  };

  window.useEraser = () => {
    isEraser = true;
  };

  window.undo = () => {
    if (history.length > 1) {
      redoStack.push(history.pop()); // Pindahkan state sekarang ke redo
      let previousState = history[history.length - 1];
      p.image(previousState, 0, 0); // Gambar ulang state sebelumnya
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
    p.background(255);
    saveState();
  };

  window.toggleFullscreen = () => {
    let fs = p.fullscreen();
    p.fullscreen(!fs);
    if (!fs) {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    } else {
      p.resizeCanvas(canvasWidth, canvasHeight);
    }
  };
};

let myWhiteboard = new p5(whiteboard);
