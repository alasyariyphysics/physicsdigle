// File: assets/js/simulations/glb.js (Contoh Modifikasi)

let glider = (p) => { // 'p' adalah instance p5
  let x = 0;
  let v = 2;

  p.setup = () => {
    let canvas = p.createCanvas(600, 200);
    canvas.parent('canvas-holder');
  };

  p.draw = () => {
    p.background(220);
    x = x + v;
    if (x > p.width) { x = 0; }
    p.fill('blue');
    p.circle(x, p.height/2, 30);
    p.select('#info-posisi').html(Math.floor(x));
  };
};

let myGlider = new p5(glider); // Membuat instance p5 untuk simulasi GLB
