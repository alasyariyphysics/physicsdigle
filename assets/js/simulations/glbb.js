// File: assets/js/simulations/glbb.js

let glbbSim = (p) => { 
  let time = 0;    
  let isPaused = false;
  
  const NORMAL_WIDTH = 600;      
  const NORMAL_HEIGHT = 200;     
  let canvasWidth = NORMAL_WIDTH; 
  let canvasHeight = NORMAL_HEIGHT; 
  let currentScaleFactor = 1;      

  const SCALE_METER = 50;        
  const SIMULATION_SPEED_FACTOR = 0.3; 
  const TRACE_LIMIT = 100;
  const OBJECT_SIZE = 30;        
  const DOT_SIZE = 6;            

  class GLBBObject {
      constructor(id, v0, a, yOffset, color) {
          this.id = id; 
          this.x0 = 0;       // Posisi awal (meter)
          this.x = 0;        // Posisi saat ini (piksel)
          this.v0 = v0;      // Kecepatan awal (m/s)
          this.a = a;        // Percepatan (m/s^2)
          this.yOffset = yOffset; 
          this.color = color;
          this.trace = [];
      }

      update(dt, currentTime) {
          // Rumus GLBB: s = v0*t + 0.5*a*t^2
          let posInMeters = (this.v0 * currentTime) + (0.5 * this.a * Math.pow(currentTime, 2));
          
          // Konversi ke piksel dengan skala
          this.x = posInMeters * SCALE_METER * currentScaleFactor;
          
          if (p.frameCount % 10 === 0) { 
              this.trace.push(p.createVector(this.x, this.yOffset * currentScaleFactor));
              if (this.trace.length > TRACE_LIMIT) this.trace.shift();
          }
          
          // Reset jika keluar batas layar (kanan atau kiri)
          let shouldReset = false;
          if (this.x > p.width || this.x < -50) {
              shouldReset = true;
          }
          return shouldReset;
      }

      draw() {
          p.noStroke();
          p.fill(this.color); 
          this.trace.forEach(point => {
              p.ellipse(point.x, point.y, DOT_SIZE * currentScaleFactor, DOT_SIZE * currentScaleFactor); 
          });
          
          p.fill(this.color); 
          p.circle(this.x, this.yOffset * currentScaleFactor, OBJECT_SIZE * currentScaleFactor); 
          
          // Hitung kecepatan sesaat: v = v0 + a*t
          let vNow = this.v0 + (this.a * time);
          p.select(`#pos${this.id}Display`).html(p.nf(this.x / (SCALE_METER * currentScaleFactor), 0, 2));
          p.select(`#vNow${this.id}Display`).html(p.nf(vNow, 0, 2));
      }

      reset() {
          this.x = 0;
          this.trace = [];
      }
  }

  const object1 = new GLBBObject(1, 1.0, 0.5, 65, 'red'); // v0=1, a=0.5
  const object2 = new GLBBObject(2, 2.0, -0.2, 135, 'blue'); // v0=2, a=-0.2 (perlambatan)
  let objects = [object1, object2];

  p.setup = () => {
    p.createCanvas(NORMAL_WIDTH, NORMAL_HEIGHT).parent('glbb-canvas-holder');
    p.frameRate(30); 
  };
  
  p.drawGrid = () => {
    p.stroke(220); 
    let scaledMeter = SCALE_METER * currentScaleFactor;
    for (let i = 0; i * scaledMeter < p.width; i++) {
      let xPos = i * scaledMeter;
      p.line(xPos, 0, xPos, p.height);
      p.fill(100);
      p.textSize(10 * currentScaleFactor); 
      p.text(`${i}m`, xPos + 3, p.height - 5); 
    }
  };

  p.draw = () => {
    p.background(255); 
    p.drawGrid();

    if (!isPaused) {
        let dt = (p.deltaTime / 1000) * SIMULATION_SPEED_FACTOR;
        time += dt; 
        
        objects.forEach(obj => {
            if (obj.update(dt, time)) {
                time = 0; // Reset waktu simulasi jika benda keluar layar
                objects.forEach(o => o.reset());
            }
        });
    }
    
    objects.forEach(obj => obj.draw());
    p.select('#timeDisplay').html(p.nf(time, 0, 2));
  };
  
  p.resizeSimulation = (w, h) => {
    currentScaleFactor = w / NORMAL_WIDTH; 
    p.resizeCanvas(w, h);
  };

  p.updateParam = (id, type, val) => {
      let obj = objects.find(o => o.id === id);
      if (type === 'v') obj.v0 = p.float(val);
      if (type === 'a') obj.a = p.float(val);
      p.select(`#${type}Val${id}`).html(val);
  };

  p.resetSim = () => {
      time = 0;
      objects.forEach(o => o.reset());
  };
};

let myGlbb = new p5(glbbSim);

// Integrasi Fullscreen Global
window.toggleFullscreen = () => {
    let wrapper = document.getElementById('simulation-wrapper');
    if (!document.fullscreenElement) {
        wrapper.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
};

window.windowResized = () => {
    if (document.fullscreenElement) {
        myGlbb.resizeSimulation(window.innerWidth, window.innerWidth / 3);
    } else {
        myGlbb.resizeSimulation(600, 200);
    }
};
