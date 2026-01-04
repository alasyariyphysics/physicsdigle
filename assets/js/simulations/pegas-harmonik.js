// File: sketch.js

let springSim = (p) => {
    // --- Variabel Fisika ---
    let k, m, A; // Akan diinisialisasi di setup dari nilai slider
    let w, T, f, TE; // Konstanta turunan
    
    let t = 0; // Waktu berjalan simulasi
    let currentX = 0;
    let currentV = 0;
    let PE = 0, KE = 0;

    // --- Variabel Status & Visualisasi ---
    let isPaused = true; // Mulai dalam keadaan pause
    const SCALE_PIXELS = 60; // Skala diperbesar sedikit agar lebih jelas
    let originY; 
    let springAnchorY = 40;
    let massSize = 40;
    
    // Array untuk grafik
    let wavePath = []; 
    const MAX_WAVE_PATH = 500;

    // --- Variabel Whiteboard ---
    let pg; // Buffer grafis untuk coretan

    p.setup = () => {
        // Buat kanvas utama
        let canvas = p.createCanvas(700, 500);
        canvas.parent('canvas-container');
        
        // Buat buffer grafis transparan untuk whiteboard
        pg = p.createGraphics(p.width, p.height);
        pg.clear(); // Pastikan transparan di awal

        p.frameRate(60);
        originY = p.height / 2;

        // Setup Event Listener untuk Slider Input
        p.select('#kInput').input(updateInputs);
        p.select('#mInput').input(updateInputs);
        p.select('#aInput').input(updateInputs);

        // Setup Event Listener untuk Tombol Kontrol
        p.select('#playPauseBtn').mousePressed(togglePlayPause);
        p.select('#resetBtn').mousePressed(resetSimulation);
        p.select('#fullscreenBtn').mousePressed(toggleFullscreen);
        p.select('#clearPaintBtn').mousePressed(clearPaint);

        // Inisialisasi nilai awal
        updateInputs();
        resetSimulation(); // Reset agar posisi awal sesuai simpangan A
    };

    // --- Fungsi Kontrol ---

    function togglePlayPause() {
        isPaused = !isPaused;
        let btn = p.select('#playPauseBtn');
        if (isPaused) {
            btn.html('▶ Mulai');
            btn.style('background-color', '#0056b3');
        } else {
            btn.html('⏸ Jeda');
            btn.style('background-color', '#e67e22'); // Warna oranye saat berjalan
        }
    }

    function resetSimulation() {
        t = 0;
        wavePath = [];
        // Saat reset, kembalikan posisi ke simpangan awal (A)
        currentX = A;
        currentV = 0;
        calculateInstantaneousValues(); // Update nilai PE/KE awal
        if(!isPaused) togglePlayPause(); // Pause setelah reset
        p.draw(); // Paksa gambar ulang sekali
    }

    function clearPaint() {
        pg.clear(); // Hapus buffer whiteboard
    }

    function toggleFullscreen() {
        let fs = p.fullscreen();
        p.fullscreen(!fs);
    }

    // --- Fungsi Fisika & Input ---

    function updateInputs() {
        // Baca nilai dari slider
        k = parseFloat(p.select('#kInput').value());
        m = parseFloat(p.select('#mInput').value());
        A = parseFloat(p.select('#aInput').value());

        // Update tampilan teks
        p.select('#kVal').html(k.toFixed(1) + " N/m");
        p.select('#mVal').html(m.toFixed(1) + " kg");
        p.select('#aVal').html(A.toFixed(1) + " m");

        calculateConstants();
        
        // Jika sedang di-reset/pause di awal, update posisi massanya juga
        if (t === 0 && isPaused) {
             currentX = A;
        }
    }

    function calculateConstants() {
        if (m <= 0) m = 0.1; // Mencegah pembagian nol
        w = p.sqrt(k / m);
        T = p.TWO_PI / w;
        f = 1.0 / T;
        TE = 0.5 * k * p.sq(A);

        p.select('#tOut').html(T.toFixed(2) + " s");
        p.select('#fOut').html(f.toFixed(2) + " Hz");
        p.select('#teOut').html(TE.toFixed(2) + " J");
    }

    function calculateInstantaneousValues() {
        PE = 0.5 * k * p.sq(currentX);
        KE = 0.5 * m * p.sq(currentV);
        
        // Update Output HTML
        p.select('#xOut').html(currentX.toFixed(2) + " m");
        p.select('#vOut').html(currentV.toFixed(2) + " m/s");
        p.select('#peOut').html(PE.toFixed(2) + " J");
        p.select('#keOut').html(KE.toFixed(2) + " J");
    }


    // --- Loop Utama p.draw() ---
    p.draw = () => {
        p.background(255); // 1. Hapus layar utama

        // 2. Update Fisika jika tidak pause
        if (!isPaused) {
            let dt = p.deltaTime / 1000;
            t += dt;
            currentX = A * p.cos(w * t);
            currentV = -A * w * p.sin(w * t);
            calculateInstantaneousValues();
        }

        // 3. Gambar Visualisasi Simulasi
        p.stroke(200); p.strokeWeight(2);
        p.line(p.width * 0.4, 0, p.width * 0.4, p.height); // Garis pemisah

        drawSpringSystem();
        drawWaveGraph();

        // 4. Gambar Layer Whiteboard di paling atas
        p.image(pg, 0, 0);
    };

    // --- Fungsi Whiteboard (Mouse Drag) ---
    p.mouseDragged = () => {
        // Hanya menggambar jika mouse di dalam area kanvas
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            pg.stroke(255, 0, 0); // Warna coretan merah
            pg.strokeWeight(3);
            pg.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
        }
        // Mencegah perilaku default browser saat drag (misal select text)
        return false; 
    };


    // --- Fungsi Penggambaran ---

    function drawSpringSystem() {
        let centerX = p.width * 0.2;
        // Posisi Y massa dalam piksel. Titik setimbang ada di originY.
        // Jika X positif (simpangan ke atas di fisika), di kanvas Y harus berkurang (naik).
        let massYPixel = originY - (currentX * SCALE_PIXELS); 

        // Gambar Anchor
        p.fill(80); p.noStroke(); p.rectMode(p.CENTER);
        p.rect(centerX, springAnchorY - 10, 80, 20);

        // Gambar Garis Setimbang
        p.stroke(0, 150, 255, 150); p.strokeWeight(1);
        p.drawingContext.setLineDash([5, 5]);
        p.line(centerX - 80, originY, centerX + 80, originY);
        p.drawingContext.setLineDash([]);

        // Gambar Pegas (Perbaikan fungsi zig-zag)
        p.noFill(); p.stroke(50); p.strokeWeight(3);
        let springStartVec = p.createVector(centerX, springAnchorY);
        // Ujung pegas ada di bagian atas massa
        let springEndVec = p.createVector(centerX, massYPixel - massSize/2);
        drawRobustZigZagSpring(springStartVec, springEndVec, 14, 20);

        // Gambar Massa
        p.fill(0, 86, 179); p.stroke(0, 40, 90); p.strokeWeight(2);
        p.rect(centerX, massYPixel, massSize, massSize, 8);

        // Label
        p.fill(100); p.noStroke(); p.textAlign(p.CENTER);
        p.text("Posisi Setimbang (x=0)", centerX, originY + 20);
    }

    // Fungsi Zig-Zag yang Lebih Kuat (Robust)
    function drawRobustZigZagSpring(start, end, segments, width) {
        let dist = p5.Vector.dist(start, end);
        // Jika jarak terlalu dekat, gambar garis lurus saja untuk mencegah glitch
        if (dist < segments * 2) { 
            p.line(start.x, start.y, end.x, end.y);
            return;
        }

        let dir = p5.Vector.sub(end, start).normalize();
        // Vektor tegak lurus untuk offset kiri/kanan
        let perp = p.createVector(-dir.y, dir.x).mult(width / 2);
        let step = p5.Vector.sub(end, start).div(segments);

        p.beginShape();
        p.vertex(start.x, start.y);
        for (let i = 1; i < segments; i++) {
            let pos = p5.Vector.add(start, p5.Vector.mult(step, i));
            // Selang-seling tambah/kurang vektor tegak lurus
            if (i % 2 === 0) pos.add(perp);
            else pos.sub(perp);
            p.vertex(pos.x, pos.y);
        }
        p.vertex(end.x, end.y);
        p.endShape();
    }

    function drawWaveGraph() {
        let graphStartX = p.width * 0.45;
        let graphEndX = p.width - 20;
        let graphCenterY = originY;

        // Simpan data posisi untuk grafik
        // Mapping: Simpangan positif (A) -> Y lebih kecil (atas kanvas)
        let mappedY = p.map(currentX, -A*1.5, A*1.5, graphCenterY + 100, graphCenterY - 100);
        
        if (!isPaused || wavePath.length === 0) {
             wavePath.unshift(mappedY);
        }
        if (wavePath.length > MAX_WAVE_PATH) wavePath.pop();

        // Gambar Sumbu
        p.stroke(150); p.strokeWeight(1);
        p.line(graphStartX, graphCenterY, graphEndX, graphCenterY); // Sumbu t
        p.line(graphStartX + 20, graphCenterY - 120, graphStartX + 20, graphCenterY + 120); // Sumbu x

        p.fill(100); p.noStroke();
        p.text("Waktu (t)", graphEndX - 30, graphCenterY + 20);
        p.text("Posisi (x)", graphStartX + 30, graphCenterY - 130);

        // Gambar Grafik Gelombang
        p.noFill(); p.stroke(220, 50, 50); p.strokeWeight(2);
        p.beginShape();
        for (let i = 0; i < wavePath.length; i++) {
            let xCoord = (graphStartX + 20) + i * 1.5; // Jarak horizontal antar titik
            if (xCoord > graphEndX) break;
            p.vertex(xCoord, wavePath[i]);
        }
        p.endShape();

        // Titik indikator saat ini
        if (wavePath.length > 0) {
            let currentGraphX = graphStartX + 20;
            let currentGraphY = wavePath[0];
            p.fill(220, 50, 50); p.noStroke();
            p.circle(currentGraphX, currentGraphY, 10);

            // Garis penghubung visual
            p.stroke(220, 50, 50, 100); p.strokeWeight(1);
            p.drawingContext.setLineDash([2, 4]);
            let massYPixel = originY - (currentX * SCALE_PIXELS);
            p.line(p.width * 0.2 + massSize/2, massYPixel, currentGraphX, currentGraphY);
            p.drawingContext.setLineDash([]);
        }
    }

    // Fungsi untuk menangani resize window agar responsif
    p.windowResized = () => {
        // Opsional: sesuaikan ukuran kanvas jika window berubah, terutama saat keluar fullscreen
        // p.resizeCanvas(p.windowWidth * 0.7, p.windowHeight * 0.7); 
        // originY = p.height / 2; 
    }
};

new p5(springSim);
