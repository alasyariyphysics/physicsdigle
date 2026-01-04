// File: sketch.js

let springSim = (p) => {
    // --- Variabel Fisika ---
    let k = 10;   // Konstanta pegas (N/m)
    let m = 2.0;  // Massa (kg)
    let A = 2.0;  // Amplitudo/Simpangan awal (m)
    
    let w; // Omega (kecepatan sudut)
    let T, f; // Periode dan Frekuensi
    
    let t = 0; // Waktu berjalan simulasi
    let currentX = 0; // Posisi saat ini (meter)
    let currentV = 0; // Kecepatan saat ini (m/s)
    let PE = 0, KE = 0, TE = 0; // Energi

    // --- Variabel Visualisasi ---
    const SCALE_PIXELS = 50; // 1 meter = 50 piksel
    let originY; // Titik setimbang (equilibrium) di kanvas
    let springAnchorY = 30; // Titik gantung pegas di atas
    let massRadius = 25;
    
    // Array untuk menyimpan jejak gelombang (untuk grafik)
    let wavePath = []; 
    const MAX_WAVE_PATH = 400; // Panjang maksimal jejak grafik

    p.setup = () => {
        // Membuat kanvas berukuran 600x450 dan menaruhnya di div HTML
        let canvas = p.createCanvas(600, 450);
        canvas.parent('canvas-container');
        p.frameRate(60);
        
        originY = p.height / 2; // Titik setimbang di tengah vertikal kanvas

        // Setup Event Listener untuk Input HTML
        p.select('#kInput').input(updateInputs);
        p.select('#mInput').input(updateInputs);
        p.select('#aInput').input(updateInputs);

        // Hitung konstanta awal
        calculateConstants();
        updateInputs(); // Update tampilan nilai awal
    };

    // Fungsi dijalankan saat slider digeser
    function updateInputs() {
        // Baca nilai dari slider HTML
        k = parseFloat(p.select('#kInput').value());
        m = parseFloat(p.select('#mInput').value());
        A = parseFloat(p.select('#aInput').value());

        // Update tampilan teks di samping slider
        p.select('#kVal').html(k.toFixed(1) + " N/m");
        p.select('#mVal').html(m.toFixed(1) + " kg");
        p.select('#aVal').html(A.toFixed(1) + " m");

        // Hitung ulang konstanta fisika yang bergantung pada input
        calculateConstants();
    }

    function calculateConstants() {
        // 1. Hitung Omega (w = sqrt(k/m))
        w = p.sqrt(k / m);
        // 2. Hitung Periode (T = 2*pi / w)
        T = p.TWO_PI / w;
        // 3. Hitung Frekuensi (f = 1/T)
        f = 1.0 / T;
        // 4. Hitung Energi Total (E = 1/2 * k * A^2) - Konstan
        TE = 0.5 * k * p.sq(A);

        // Update Output HTML yang konstan
        p.select('#tOut').html(T.toFixed(2) + " s");
        p.select('#fOut').html(f.toFixed(2) + " Hz");
        p.select('#teOut').html(TE.toFixed(2) + " J");
    }

    p.draw = () => {
        p.background(255); // Hapus layar setiap frame

        // --- A. Update Fisika ---
        let dt = p.deltaTime / 1000; // Ubah milidetik ke detik
        t += dt; // Waktu berjalan

        // Hitung posisi saat ini: x(t) = A * cos(w*t)
        currentX = A * p.cos(w * t);
        
        // Hitung kecepatan saat ini: v(t) = -A * w * sin(w*t)
        currentV = -A * w * p.sin(w * t);

        // Hitung Energi Sesaat
        PE = 0.5 * k * p.sq(currentX); // PE = 1/2 k x^2
        KE = 0.5 * m * p.sq(currentV); // KE = 1/2 m v^2

        // --- B. Update Output HTML Sesaat ---
        p.select('#xOut').html(currentX.toFixed(2) + " m");
        p.select('#vOut').html(currentV.toFixed(2) + " m/s");
        p.select('#peOut').html(PE.toFixed(2) + " J");
        p.select('#keOut').html(KE.toFixed(2) + " J");


        // --- C. Menggambar Visualisasi ---
        
        // Membagi layar menjadi dua area dengan garis pemisah
        p.stroke(220);
        p.line(p.width/2, 0, p.width/2, p.height);

        drawSpringSystem();
        drawWaveGraph();
    };

    // Fungsi: Menggambar Pegas dan Massa (Bagian Kiri)
    function drawSpringSystem() {
        let centerX = p.width / 4; // Posisi X tengah untuk area kiri
        
        // Konversi posisi fisika (meter) ke piksel
        // Posisi Y massa = Titik Setimbang + (posisi X meter * skala)
        // Kita gunakan minus karena di kanvas Y positif ke bawah, tapi di fisika biasanya simpangan awal (A) dianggap positif ke atas.
        let massYPixel = originY - (currentX * SCALE_PIXELS); 

        // 1. Gambar Titik Gantung (Anchor)
        p.fill(100); p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(centerX, springAnchorY - 5, 60, 10);

        // 2. Gambar Pegas (Garis Zig-zag)
        p.noFill();
        p.stroke(80);
        p.strokeWeight(2);
        
        let springStart = p.createVector(centerX, springAnchorY);
        let springEnd = p.createVector(centerX, massYPixel - massRadius/2);
        
        // Fungsi helper untuk menggambar pegas zig-zag
        drawZigZagSpring(springStart, springEnd, 12, 15);

        // 3. Gambar Garis Setimbang (Equilibrium)
        p.stroke(200, 200, 255);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([5, 5]); // Garis putus-putus
        p.line(centerX - 60, originY, centerX + 60, originY);
        p.drawingContext.setLineDash([]); // Reset garis

        // 4. Gambar Massa (Kotak Biru)
        p.fill(0, 86, 179); // Warna Biru
        p.stroke(0, 50, 100);
        p.strokeWeight(2);
        // Ukuran massa divisualisasikan sedikit berubah berdasarkan input massa (opsional)
        let drawnSize = massRadius + (m * 3); 
        p.rect(centerX, massYPixel, drawnSize, drawnSize, 5);

        // Label
        p.fill(0); p.noStroke(); p.textAlign(p.CENTER);
        p.text("Setimbang", centerX, originY + 15);
    }

    // Fungsi Helper: Menggambar garis zig-zag untuk pegas
    function drawZigZagSpring(start, end, segments, width) {
        let direction = p5.Vector.sub(end, start);
        let len = direction.mag();
        let segmentLen = len / segments;
        direction.normalize();
        
        // Vektor tegak lurus untuk zig-zag
        let perpendicular = p.createVector(-direction.y, direction.x).mult(width / 2);

        p.beginShape();
        p.vertex(start.x, start.y);
        for (let i = 1; i < segments; i++) {
            let pos = p5.Vector.add(start, p5.Vector.mult(direction, i * segmentLen));
            // Zig-zag kiri kanan
            if (i % 2 === 0) pos.add(perpendicular);
            else pos.sub(perpendicular);
            p.vertex(pos.x, pos.y);
        }
        p.vertex(end.x, end.y);
        p.endShape();
    }


    // Fungsi: Menggambar Grafik Gelombang Harmonis (Bagian Kanan)
    function drawWaveGraph() {
        let graphOriginX = p.width * 0.75; // Pusat X area kanan
        let graphTop = 50;
        let graphBottom = p.height - 50;
        let graphHeight = graphBottom - graphTop;

        // 1. Simpan data posisi saat ini ke array jejak
        // Kita mapping posisi X meter ke koordinat Y grafik
        // Nilai positif X (atas) dipetakan ke Y negatif (atas kanvas)
        let mappedY = p.map(currentX, -A, A, graphBottom, graphTop);
        
        // Dorong data baru ke depan array (agar yang lama tergeser ke belakang)
        wavePath.unshift(mappedY);
        
        // Hapus data yang terlalu lama agar tidak berat
        if (wavePath.length > MAX_WAVE_PATH) {
            wavePath.pop();
        }

        // 2. Gambar Sumbu Grafik
        p.stroke(150); p.strokeWeight(1);
        // Sumbu Y (Vertikal - Posisi)
        p.line(graphOriginX, graphTop - 20, graphOriginX, graphBottom + 20);
        // Sumbu X (Horizontal - Waktu/Titik tengah)
        let graphCenterY = (graphTop + graphBottom) / 2;
        p.line(p.width/2 + 20, graphCenterY, p.width - 20, graphCenterY);

        // Label Sumbu
        p.fill(100); p.noStroke(); p.textAlign(p.CENTER, p.CENTER);
        p.text("Posisi (x)", graphOriginX, graphTop - 30);
        p.text("Waktu (t)", p.width - 40, graphCenterY + 15);

        // 3. Gambar Jejak Gelombang
        p.noFill();
        p.stroke(220, 50, 50); // Warna Merah untuk gelombang
        p.strokeWeight(2);
        
        p.beginShape();
        // Iterasi array jejak untuk menggambar garis
        for (let i = 0; i < wavePath.length; i++) {
            // X bergerak ke kiri seiring waktu (i bertambah)
            let xCoord = graphOriginX - i; 
            // Y diambil dari data yang sudah dimapping
            let yCoord = wavePath[i];
            
            // Berhenti menggambar jika keluar dari area grafik kiri
            if (xCoord < p.width/2 + 20) break; 
            
            p.vertex(xCoord, yCoord);
        }
        p.endShape();

        // Gambar titik merah di ujung grafik (posisi saat ini)
        if (wavePath.length > 0) {
            p.fill(220, 50, 50); p.noStroke();
            p.circle(graphOriginX, wavePath[0], 8);
            
            // Garis bantu visual dari massa ke grafik
            p.stroke(200, 50, 50, 100); // Merah transparan
            p.drawingContext.setLineDash([2, 4]);
            let massYPixel = originY - (currentX * SCALE_PIXELS); 
            p.line(p.width/4 + 30, massYPixel, graphOriginX, wavePath[0]);
            p.drawingContext.setLineDash([]);
        }
    }
};

// Inisialisasi p5.js
new p5(springSim);
