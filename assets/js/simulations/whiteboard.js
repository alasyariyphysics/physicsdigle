// File: assets/js/simulations/whiteboard.js

// Membuat fungsi instance p5.js untuk Whiteboard
let whiteboard = (p) => {
  let canvasWidth = 600;
  let canvasHeight = 400;

  p.setup = () => {
    // Memasukkan kanvas ke div id="whiteboard-canvas-holder"
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('whiteboard-canvas-holder');
    p.background(255); // Latar belakang putih bersih
  };

  p.draw = () => {
    // Fungsi draw kosong, hanya digunakan untuk menerima input mouse
  };

  p.mouseDragged = () => {
    // Menggambar garis yang mengikuti gerakan mouse
    p.stroke(0); // Warna hitam
    p.strokeWeight(3); // Ketebalan
    p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
  };
  
  // Fungsi ini dipanggil dari tombol 'Clear Whiteboard' di HTML
  window.clearWhiteboard = () => {
    p.background(255); // Mengisi ulang kanvas dengan warna putih
  };
};

// Menginisialisasi instance Whiteboard
let myWhiteboard = new p5(whiteboard);
