// File: assets/js/simulations/whiteboard.js

let whiteboard = (p) => {
  p.setup = () => {
    let canvas = p.createCanvas(600, 400); // Ukuran lebih besar untuk papan tulis
    canvas.parent('whiteboard-holder');
    p.background(255); // Putih bersih
  };

  p.draw = () => {
    // Fungsi draw whiteboard ini kosong, kita hanya butuh mouse input
  };

  p.mouseDragged = () => {
    // Hanya menggambar jika tombol mouse ditekan dan diseret
    p.stroke(0); // Warna hitam
    p.strokeWeight(3); // Ketebalan garis
    p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY); // Menggambar garis dari posisi mouse sebelumnya ke posisi mouse saat ini
  };

  p.mousePressed = () => {
    // Ini mencegah penyeretan mouse memicu aksi default browser
    return false;
  };
  
  // Fungsi untuk menghapus papan tulis
  window.clearWhiteboard = () => {
    p.background(255);
  };
};

let myWhiteboard = new p5(whiteboard); // Membuat instance p5 untuk Whiteboard
