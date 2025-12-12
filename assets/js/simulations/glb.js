// File: assets/js/simulations/glb.js

let glider = (p) => { 
  // VARIABEL OBJEK 1 (Merah)
  let x1 = 0;      // Posisi dalam piksel
  let v1 = 2;      // Kecepatan dalam meter/detik
  let trace1 = []; // Jejak lintasan

  // VARIABEL OBJEK 2 (Biru) - Kecepatan tetap untuk perbandingan
  let x2 = 0;
  const v2 = 1.2; // Kecepatan Objek 2 (lebih lambat)
  let trace2 = [];

  let time = 0;    // Waktu dalam detik
  let isPaused = false;
  
  // KONSTANTA FISIKA/VISUALISASI
  const SCALE_METER = 50; // 1 meter di simulasi = 50 piksel
  const SIMULATION_SPEED_FACTOR = 0.05; // Faktor untuk memperlambat simulasi
  const Y_OFFSET_1 = 65; // Posisi Y Objek 1
  const Y_OFFSET_2 = 135; // Posisi Y Objek 2

  p.setup = () => {
    let canvas = p.createCanvas(600, 200);
    canvas.parent('glb-canvas-holder');
    p.frameRate(30); 
    p.select('#speedDisplay').html(p.nf(v1, 0, 1)); // Set display awal
  };
  
  // Fungsi internal untuk menggambar Grid (Skala)
  p.drawGrid = () => {
    p.stroke(200); 
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
    p.line(0, Y_OFFSET_1, p.width, Y_OFFSET_1); 
    p.line(0, Y_OFFSET_2, p.width, Y_OFFSET_2); 
  };

  // Fungsi internal untuk menggambar Jejak
  p.drawTrace = (traceArray, color) => {
      p.noStroke();
      p.fill(color);
      traceArray.forEach(point => {
          p.ellipse(point.x, point.y, 4, 4); // Gambar titik kecil
      });
  };

  p.draw = () => {
    p.background(255); 
    p.drawGrid();

    // Hanya update fisika jika tidak di-pause
    if (!isPaused) {
        let dt = (p.deltaTime / 1000) * SIMULATION_SPEED_FACTOR;
        time += dt; 
        
        // 1. Update Posisi GLB Objek 1
        x1 += v1 * dt * SCALE_METER;
        
        // 2. Update Posisi GLB Objek 2
        x2 += v2 * dt * SCALE_METER;

        // Simpan posisi ke trace (setiap 5 frame)
        if (p.frameCount % 5 === 0) { 
            // Objek 1 (Merah)
            trace1.push(p.createVector(x1, Y_OFFSET_1));
            if (trace1.length > 80) { // Batasi panjang jejak
                trace1.shift();
            }
            
            // Objek 2 (Biru)
            trace2.push(p.createVector(x2, Y_OFFSET_2)); 
            if (trace2.length > 80) {
                trace2.shift();
            }
        }
    }
    
    // Boundary check (Looping)
    const handleBoundary = (x_pos, trace_arr) => {
        if (x_pos > p.width) {
            return { x: 0, trace: [] }; // Reset posisi dan jejak
        }
        return { x: x_pos, trace: trace_arr };
    };

    let result1 = handleBoundary(x1, trace1);
    x1 = result1.x; trace1 = result1.trace;
    
    let result2 = handleBoundary(x2, trace2);
    x2 = result2.x; trace2 = result2.trace;

    // Jika Objek 1 direset, reset juga waktu
    if (x1 === 0 && trace1.length === 0) {
        time = 0;
    }
    
    // 3. GAMBAR: Jejak Lintasan
    p.drawTrace(trace1, 'rgba(255, 0, 0, 0.5)'); // Merah
    p.drawTrace(trace2, 'rgba(0, 0, 255, 0.5)'); // Biru

    // 4. GAMBAR: Benda (Lingkaran)
    p.fill('red'); p.circle(x1, Y_OFFSET_1, 30);
    p.fill('blue'); p.circle(x2, Y_OFFSET_2, 30);
    
    // 5. Update Teks di HTML
    p.select('#pos1Display').html(p.nf(x1 / SCALE_METER, 0, 2)); 
    p.select('#pos2Display').html(p.nf(x2 / SCALE_METER, 0, 2)); 
    p.select('#timeDisplay').html(p.nf(time, 0, 2));
  };
  
  // METODE INTERNAL
  
  p.togglePause = () => {
    isPaused = !isPaused;
    if (isPaused) {
      p.noLoop();
      p.select('#pauseButton').html('Resume');
    } else {
      p.loop();
      p.select('#pauseButton').html('Pause');
    }
  };
  
  p.updateSpeed = (newV) => {
    v1 = p.float(newV);
    p.select('#speedDisplay').html(p.nf(v1, 0, 1));
    if (!isPaused) p.loop(); 
  };
  
  p.resetSimulation = () => {
    x1 = 0;
    x2 = 0;
    time = 0;
    trace1 = [];
    trace2 = [];
    isPaused = false;
    p.select('#pauseButton').html('Pause');
    p.loop(); 
  };
};

// Menginisialisasi instance GLB
let myGlider = new p5(glider);

// Membuat fungsi global yang dipanggil dari tombol/input HTML
window.togglePause = () => {
  if (myGlider.togglePause) myGlider.togglePause();
};

window.updateSpeed = (value) => {
  if (myGlider.updateSpeed) myGlider.updateSpeed(value);
};

window.resetSimulation = () => {
  if (myGlider.resetSimulation) myGlider.resetSimulation();
};
