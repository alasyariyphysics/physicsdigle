// File: assets/js/simulations/glb.js

let glider = (p) => { 
  let time = 0;    // Waktu dalam detik
  let isPaused = false;
  
  // --- KONSTANTA SIMULASI DAN SKALA ---
  const NORMAL_WIDTH = 600;      // Lebar kanvas default
  const NORMAL_HEIGHT = 200;     // Tinggi kanvas default
  let canvasWidth = NORMAL_WIDTH; 
  let canvasHeight = NORMAL_HEIGHT; 
  let currentScaleFactor = 1;      // Faktor skala saat ini (1 = normal)

  const SCALE_METER = 50;        // Skala piksel per meter (BASE VALUE)
  const SIMULATION_SPEED_FACTOR = 0.3; 
  const TRACE_LIMIT = 80;
  const OBJECT_SIZE = 30;        // Ukuran Objek (BASE VALUE)
  const DOT_SIZE = 6;            // Ukuran Titik Jejak (BASE VALUE)

  // FUNGSIONALITAS OBJEK GLB
  class MovableObject {
      constructor(id, initialV, yOffset, color) {
          this.id = id; 
          this.x = 0;   
          this.v = initialV; 
          this.yOffset = yOffset; // Y Offset (BASE VALUE)
          this.color = color;
          this.trace = [];
      }

      update(dt) {
          // Posisi diperbarui dengan skala dasar (SCALE_METER) dikalikan faktor skala saat ini
          this.x += this.v * dt * SCALE_METER * currentScaleFactor;
          
          // Simpan jejak (trace)
          if (p.frameCount % 10 === 0) { 
              // Posisi Y di trace juga harus diskalakan
              this.trace.push(p.createVector(this.x, this.yOffset * currentScaleFactor));
              if (this.trace.length > TRACE_LIMIT) {
                  this.trace.shift();
              }
          }
          
          // Boundary Check (Dukungan Maju dan Mundur)
          let shouldReset = false;

          if (this.v > 0) {
              // Maju (Kanan ke Kiri)
              if (this.x > p.width) {
                  this.x = this.x - p.width; 
                  this.trace = [];
                  shouldReset = true;
              }
          } else if (this.v < 0) {
              // Mundur (Kiri ke Kanan)
              if (this.x < 0) {
                  this.x = p.width + this.x; 
                  this.trace = [];
                  shouldReset = true;
              }
          }
         
          return shouldReset;
      }

      draw() {
          // Gambar Jejak Lintasan
          p.noStroke();
          p.fill(this.color); 
          this.trace.forEach(point => {
              // Ukuran titik diskalakan
              p.ellipse(point.x, point.y, DOT_SIZE * currentScaleFactor, DOT_SIZE * currentScaleFactor); 
          });
          
          // Gambar Benda
          p.fill(this.color); 
          p.noStroke();
          // Posisi Y dan ukuran objek diskalakan
          p.circle(this.x, this.yOffset * currentScaleFactor, OBJECT_SIZE * currentScaleFactor); 
          
          // Update Teks di HTML (Menggunakan skala meter saat ini)
          p.select(`#pos${this.id}Display`).html(p.nf(this.x / (SCALE_METER * currentScaleFactor), 0, 2));
      }

      reset() {
          this.x = 0;
          this.trace = [];
      }
  }

  // INISIALISASI DUA OBJEK
  const object1 = new MovableObject(1, 2.0, 65, 'red'); 
  const object2 = new MovableObject(2, 1.2, 135, 'blue'); 
  let objects = [object1, object2];

  p.setup = () => {
    p.createCanvas(NORMAL_WIDTH, NORMAL_HEIGHT).parent('glb-canvas-holder');
    p.frameRate(30); 
    p.select('#speedDisplay1').html(p.nf(object1.v, 0, 1)); 
    p.select('#speedDisplay2').html(p.nf(object2.v, 0, 1)); 
  };
  
  // Fungsi internal untuk menggambar Grid (Skala)
  p.drawGrid = () => {
    p.stroke(200); 
    p.strokeWeight(1);
    
    // Hitung skala meter saat ini
    let scaledMeter = SCALE_METER * currentScaleFactor;

    // Garis Vertikal (Meteran)
    for (let i = 0; i * scaledMeter < p.width; i++) {
      let xPos = i * scaledMeter;
      p.line(xPos, 0, xPos, p.height);
      
      // Label meteran (textSize diskalakan)
      p.fill(50);
      p.textSize(10 * currentScaleFactor); 
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(`${i} m`, xPos + 3 * currentScaleFactor, p.height - 3); 
    }
    
    // Garis horizontal untuk lintasan (Y Offset diskalakan)
    p.stroke(150);
    p.line(0, object1.yOffset * currentScaleFactor, p.width, object1.yOffset * currentScaleFactor); 
    p.line(0, object2.yOffset * currentScaleFactor, p.width, object2.yOffset * currentScaleFactor); 
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
                shouldResetTime = true;
            }
        });
        
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
  
  // FUNGSI BARU UNTUK RESIZE SIMULASI
  p.resizeSimulation = (w, h) => {
    let oldWidth = canvasWidth;

    // Hitung faktor skala berdasarkan lebar baru dibagi lebar normal
    currentScaleFactor = w / NORMAL_WIDTH; 
    
    // Sesuaikan posisi x objek agar tetap proporsional
    objects.forEach(obj => {
        obj.x = (obj.x / oldWidth) * w;
    });

    // Ubah ukuran kanvas
    p.resizeCanvas(w, h);
    canvasWidth = w;
    canvasHeight = h;
  };

  // --- METODE INTERNAL LAIN ---

  p.togglePause = () => {
    isPaused = !isPaused;
    if (isPaused) {
      p.noLoop();
      p.select('#pauseButton').html('Resume');
    } else {
      p.loop();
    }
  };
  
  p.updateSpeed = (id, newV) => {
    let targetObj = objects.find(obj => obj.id === id);
    if (targetObj) {
        targetObj.v = p.float(newV);
        p.select(`#speedDisplay${id}`).html(p.nf(targetObj.v, 0, 1));
    }
    if (!isPaused) p.loop(); 
  };
  
  p.resetSimulation = () => {
    objects.forEach(obj => obj.reset()); 
    time = 0;
    isPaused = false;
    p.select('#pauseButton').html('Pause');
    p.loop(); 
  };
  
  // Expose variabel penting
  p.NORMAL_WIDTH = NORMAL_WIDTH;
  p.NORMAL_HEIGHT = NORMAL_HEIGHT;
  p.isPaused = isPaused; 
};

// Menginisialisasi instance GLB
let myGlider = new p5(glider);

// --- FUNGSI GLOBAL YANG DIPANGGIL DARI HTML ---

window.toggleFullscreen = () => {
    // Target yang ingin difullscreen adalah div#simulation-wrapper
    let wrapper = document.getElementById('simulation-wrapper');
    
    if (!wrapper) {
        console.error("Error: Elemen #simulation-wrapper tidak ditemukan.");
        return; 
    }
    
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        // Keluar dari mode fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { 
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { 
            document.webkitExitFullscreen();
        }
    } else {
        // Masuk ke mode fullscreen
        if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
        } else if (wrapper.mozRequestFullScreen) { 
            wrapper.mozRequestFullScreen();
        } else if (wrapper.webkitRequestFullscreen) { 
            wrapper.webkitRequestFullscreen();
        }
    }
}

// Fungsi P5.js bawaan untuk resize
p5.prototype.windowResized = () => {
    const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
    
    if (isFullScreen) {
        // Hitung tinggi baru berdasarkan proporsi yang sama (3:1)
        const newWidth = window.innerWidth;
        const newHeight = newWidth / (myGlider.NORMAL_WIDTH / myGlider.NORMAL_HEIGHT);
        myGlider.resizeSimulation(newWidth, newHeight); 
    } else {
        // Kembali ke mode normal
        myGlider.resizeSimulation(myGlider.NORMAL_WIDTH, myGlider.NORMAL_HEIGHT);
    }
    
    myGlider.loop();
    if (myGlider.isPaused) myGlider.noLoop();
}

window.togglePause = () => {
  if (myGlider.togglePause) myGlider.togglePause();
};

window.updateSpeed = (id, value) => {
  if (myGlider.updateSpeed) myGlider.updateSpeed(id, value);
};

window.resetSimulation = () => {
  if (myGlider.resetSimulation) myGlider.resetSimulation();
};