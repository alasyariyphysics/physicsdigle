// File: assets/js/simulations/glb.js

// Membuat fungsi instance p5.js untuk GLB
let glider = (p) => { 
  let x = 0;
  let v = 2; // Kecepatan
  let canvasWidth = 600;
  let canvasHeight = 200;

  p.setup = () => {
    // Memasukkan kanvas ke div id="glb-canvas-holder"
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('glb-canvas-holder');
  };

  p.draw = () => {
    p.background(220); // Latar belakang abu-abu
    
    // FISIKA: Update Posisi
    x = x + v;
    
    // Boundary check (Looping)
    if (x > p.width) {
      x = 0;
    }
    
    // GAMBAR: Benda (Lingkaran)
    p.fill('blue');
    p.noStroke();
    p.circle(x, p.height / 2, 30);
    
    // Update teks di HTML
    p.select('#info-posisi').html(Math.floor(x));
  };
};

// Menginisialisasi instance GLB
let myGlider = new p5(glider);
