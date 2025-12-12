// File: assets/js/simulations/glb.js

let glider = (p) => { 
  let time = 0;    // Waktu dalam detik
  let isPaused = false;
  
  // KONSTANTA FISIKA/VISUALISASI
  const SCALE_METER = 50; 
  const SIMULATION_SPEED_FACTOR = 0.3; 
  const TRACE_LIMIT = 80;

  // FUNGSIONALITAS OBJEK GLB
  // Membuat Constructor/Template Objek
  class MovableObject {
      constructor(id, initialV, yOffset, color) {
          this.id = id; // 1 atau 2
          this.x = 0;   // Posisi X (piksel)
          this.v = initialV; // Kecepatan (m/s)
          this.yOffset = yOffset; // Posisi Y di kanvas
          this.color = color;
          this.trace = [];
      }

      update(dt) {
          this.x += this.v * dt * SCALE_METER;
          
          // Simpan jejak (trace)
          if (p.frameCount % 5 === 0) { 
              this.trace.push(p.createVector(this.x, this.yOffset));
              if (this.trace.length > TRACE_LIMIT) {
                  this.trace.shift();
              }
          }
          
          // Boundary check (Looping)
          if (this.x > p.width) {
              this.x = 0;
              this.trace = [];
              return true; // Menandakan reset terjadi
          }
          return false;
      }

      draw() {
          // Gambar Jejak Lintasan
          p.noStroke();
          p.fill(this.color); // Menggunakan warna solid (Merah atau Biru)
          this.trace.forEach(point => {
              p.ellipse(point.x, point.y, 2, 2); // UKURAN TITIK DITINGKATKAN menjadi 6x6
          });
          
          // Gambar Benda
          p.fill(this.color); 
          p.noStroke();
          p.circle(this.x, this.yOffset, 30);
          
          // Update Teks di HTML
          p.select(`#pos${this.id}Display`).html(p.nf(this.x / SCALE_METER, 0, 2));
      }

      reset() {
          this.x = 0;
          this.trace = [];
      }
  }

  // INISIALISASI DUA OBJEK
  const object1 = new MovableObject(1, 2.0, 65, 'red'); // Objek 1 (Merah)
  const object2 = new MovableObject(2, 1.2, 135, 'blue'); // Objek 2 (Biru)
  let objects = [object1, object2];

  p.setup = () => {
    let canvas = p.createCanvas(600, 200);
    canvas.parent('glb-canvas-holder');
    p.frameRate(30); 
    // Set display awal untuk kedua objek
    p.select('#speedDisplay1').html(p.nf(object1.v, 0, 1)); 
    p.select('#speedDisplay2').html(p.nf(object2.v, 0, 1)); 
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
    
    // Garis horizontal untuk lintasan
    p.stroke(150);
    p.line(0, object1.yOffset, p.width, object1.yOffset); 
    p.line(0, object2.yOffset, p.width, object2.yOffset); 
  };

  p.draw = () => {
    p.background(255); 
    p.drawGrid();

    // Hanya update fisika jika tidak di-pause
    if (!isPaused) {
        let dt = (p.deltaTime / 1000) * SIMULATION_SPEED_FACTOR;
        time += dt; 
        
        let shouldResetTime = false;

        // Iterasi dan Update kedua objek
        objects.forEach(obj => {
            if (obj.update(dt)) {
                // Jika salah satu objek reset (mencapai batas), set flag
                shouldResetTime = true;
            }
        });
        
        // Jika salah satu objek looping, reset waktu
        if (shouldResetTime) {
            time = 0;
        }
    }
    
    // Gambar kedua objek
    objects.forEach(obj => {
        obj.draw();
    });
    
    // Update Teks Waktu di HTML
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
  
  // Fungsi yang menerima ID objek (1 atau 2)
  p.updateSpeed = (id, newV) => {
    let targetObj = objects.find(obj => obj.id === id);
    if (targetObj) {
        targetObj.v = p.float(newV);
        p.select(`#speedDisplay${id}`).html(p.nf(targetObj.v, 0, 1));
    }
    if (!isPaused) p.loop(); 
  };
  
  p.resetSimulation = () => {
    objects.forEach(obj => obj.reset()); // Reset posisi dan jejak kedua objek
    time = 0;
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

// Fungsi updateSpeed sekarang menerima ID objek (1 atau 2)
window.updateSpeed = (id, value) => {
  if (myGlider.updateSpeed) myGlider.updateSpeed(id, value);
};

window.resetSimulation = () => {
  if (myGlider.resetSimulation) myGlider.resetSimulation();
};
