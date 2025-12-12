// File: assets/js/simulations/glb.js

let glider = (p) => { 
  let x = 0;      // Posisi dalam piksel
  let v = 2;      // Kecepatan dalam meter/detik
  let time = 0;   // Waktu dalam detik
  let isPaused = false;
  
  // KONSTANTA FISIKA/VISUALISASI
  const SCALE_METER = 50; // 1 meter di simulasi = 50 piksel
  const SIMULATION_SPEED_FACTOR = 0.3; // Faktor untuk memperlambat simulasi agar lebih mudah dilihat

  p.setup = () => {
    let canvas = p.createCanvas(600, 200);
    canvas.parent('glb-canvas-holder');
    p.frameRate(30); // Atur frame rate
    p.select('#speedDisplay').html(p.nf(v, 0, 1)); // Set display awal
  };
  
  // Fungsi internal untuk menggambar Grid (Skala)
  p.drawGrid = () => {
    p.stroke(200); // Warna garis abu-abu muda
    p.strokeWeight(1);
    
    // Garis Vertikal (Meteran)
    for (let i = 0; i < p.width / SCALE_METER; i++) {
      let xPos = i * SCALE_METER;
      p.line(xPos, 0, xPos, p.height);
      
      // Label meteran
      p.fill(50);
      p.textSize(10);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(`${i} m`, xPos + 3, p.height - 3);
    }
    
    // Garis horizontal (garis dasar)
    p.stroke(150);
    p.line(0, p.height - 20, p.width, p.height - 20); 
  };

  p.draw = () => {
    p.background(255); // Latar belakang putih
    
    // 1. Gambar Grid
    p.drawGrid();

    // Hanya update fisika jika tidak di-pause
    if (!isPaused) {
        // Update Waktu: p.deltaTime adalah waktu antar frame (ms)
        let dt = (p.deltaTime / 1000) * SIMULATION_SPEED_FACTOR;
        time += dt; 
        
        // Update Posisi GLB: x = x0 + v * t (dikonversi ke piksel)
        x += v * dt * SCALE_METER; 
    }
    
    // Boundary check (Looping)
    if (x > p.width) {
      x = 0;
      time = 0; // Reset waktu
    }
    
    // 2. GAMBAR: Benda (Lingkaran)
    p.fill('red'); 
    p.noStroke();
    p.circle(x, p.height / 2, 30);
    
    // 3. Update Teks di HTML
    p.select('#info-posisi').html(p.nf(x / SCALE_METER, 0, 2)); // Tampilkan dalam Meter
    p.select('#timeDisplay').html(p.nf(time, 0, 2)); // Tampilkan waktu (2 desimal)
  };
  
  // Metode internal untuk pause/resume
  p.togglePause = () => {
    isPaused = !isPaused;
    if (isPaused) {
      p.noLoop(); // Menghentikan p.draw()
      p.select('#pauseButton').html('Resume');
    } else {
      p.loop(); // Melanjutkan p.draw()
      p.select('#pauseButton').html('Pause');
    }
  };
  
  // Metode internal untuk update kecepatan
  p.updateSpeed = (newV) => {
    v = p.float(newV);
    p.select('#speedDisplay').html(p.nf(v, 0, 1));
    p.loop(); // Pastikan simulasi berjalan setelah kecepatan diubah
    if(isPaused) {
        p.noLoop(); // Jika sebelumnya paused, kembali paused
    }
  };
};

// Menginisialisasi instance GLB
let myGlider = new p5(glider);

// Membuat fungsi global yang dipanggil dari tombol/input HTML
window.togglePause = () => {
  if (myGlider.togglePause) {
    myGlider.togglePause();
  }
};

window.updateSpeed = (value) => {
  if (myGlider.updateSpeed) {
    myGlider.updateSpeed(value);
  }
};
