let x = 0;
let v = 2; 

function setup() {
  // Membuat kanvas ukuran 600x200
  // .parent('canvas-holder') memasukkannya ke dalam div di HTML
  let canvas = createCanvas(600, 200);
  canvas.parent('canvas-holder');
}

function draw() {
  background(220); // Latar belakang abu-abu
  
  // Fisika sederhana
  x = x + v;
  
  // Reset jika keluar layar
  if (x > width) {
    x = 0;
  }
  
  // Gambar Bola
  fill('blue');
  circle(x, height/2, 30);
  
  // Update teks di HTML (DOM manipulation)
  // select('#id') adalah fitur p5.js untuk mengambil elemen HTML
  select('#info-posisi').html(Math.floor(x));
}
