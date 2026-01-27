// App principal con enlaces a fotos
class NetworkMap {
    constructor() {
        this.container = document.getElementById('mapContainer');
        this.wrapper = document.getElementById('mapWrapper');
        this.floorPlan = document.getElementById('floorPlan');
        this.pointsLayer = document.getElementById('pointsLayer');
        this.gridCanvas = document.getElementById('gridCanvas');
        
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.showLabels = true;
        this.showGrid = false;
        
        this.init();
    }

    init() {
        this.floorPlan.onload = () => {
            this.setupCanvas();
            this.createPoints();
            this.updateStats();
        };
        
        this.setupControls();
        this.setupZoomPan();
        
        if (this.floorPlan.complete) {
            this.setupCanvas();
            this.createPoints();
            this.updateStats();
        }
    }

    setupCanvas() {
        this.gridCanvas.width = this.floorPlan.naturalWidth;
        this.gridCanvas.height = this.floorPlan.naturalHeight;
    }

    createPoints() {
        this.pointsLayer.innerHTML = '';
        CONFIG.points.forEach(point => {
            const el = this.createPoint(point);
            this.pointsLayer.appendChild(el);
        });
    }

    createPoint(point) {
        const div = document.createElement('div');
        div.className = 'point ' + getSignalCategory(point.signal);
        div.style.left = point.x + '%';
        div.style.top = point.y + '%';
        div.dataset.id = point.id;
        
        // Marcador
        const marker = document.createElement('div');
        marker.className = 'marker';
        div.appendChild(marker);
        
        // Etiqueta
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = point.id;
        div.appendChild(label);
        
        // Tooltip con enlace a la foto
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <strong>Punto ${point.id}</strong>
                <span class="badge ${getSignalCategory(point.signal)}">${getSignalText(point.signal)}</span>
            </div>
            <div class="tooltip-body">
                <div>Señal: <b>${point.signal} dBm</b></div>
                <div>Ubicación: ${point.label}</div>
                <div>Red: NFZ Guest</div>
            </div>
            <div class="tooltip-footer">
                <a href="images/${point.img}" target="_blank" class="photo-link">
                    📷 Ver captura WiFi
                </a>
            </div>
        `;
        div.appendChild(tooltip);
        
        // Eventos
        div.onmouseenter = () => {
            tooltip.classList.add('show');
            div.classList.add('active');
        };
        div.onmouseleave = () => {
            tooltip.classList.remove('show');
            div.classList.remove('active');
        };
        div.onclick = (e) => {
            e.stopPropagation();
            this.selectPoint(point);
        };
        
        return div;
    }

    selectPoint(point) {
        const infoCard = document.getElementById('selectedInfo');
        infoCard.style.display = 'block';
        
        document.getElementById('pointId').textContent = 'Punto ' + point.id;
        document.getElementById('pointSignal').textContent = `${point.signal} dBm (${getSignalText(point.signal)})`;
        document.getElementById('pointLocation').textContent = point.label;
        
        // Actualizar o crear el enlace a la foto en el panel
        let photoLinkContainer = document.getElementById('photoLinkContainer');
        if (!photoLinkContainer) {
            photoLinkContainer = document.createElement('div');
            photoLinkContainer.id = 'photoLinkContainer';
            photoLinkContainer.style.marginTop = '1rem';
            photoLinkContainer.style.paddingTop = '1rem';
            photoLinkContainer.style.borderTop = '1px solid rgba(255,255,255,0.1)';
            document.querySelector('#selectedInfo .info').appendChild(photoLinkContainer);
        }
        
        photoLinkContainer.innerHTML = `
            <a href="images/${point.img}" target="_blank" class="photo-link-panel">
                📷 Ver captura WiFi completa
            </a>
        `;
        
        document.querySelectorAll('.point').forEach(p => p.classList.remove('selected'));
        document.querySelector(`[data-point-id="${point.id}"]`).classList.add('selected');
    }

    updateStats() {
        const stats = { excellent: 0, good: 0, fair: 0, poor: 0 };
        CONFIG.points.forEach(p => stats[getSignalCategory(p.signal)]++);
        
        document.getElementById('excellentPoints').textContent = stats.excellent;
        document.getElementById('goodPoints').textContent = stats.good;
        document.getElementById('fairPoints').textContent = stats.fair;
        document.getElementById('poorPoints').textContent = stats.poor;
    }

    setupControls() {
        document.getElementById('toggleLabels').onclick = () => {
            this.showLabels = !this.showLabels;
            this.pointsLayer.classList.toggle('hide-labels', !this.showLabels);
        };
        
        document.getElementById('toggleGrid').onclick = () => {
            this.showGrid = !this.showGrid;
            if (this.showGrid) {
                this.drawGrid();
                this.gridCanvas.style.display = 'block';
            } else {
                this.gridCanvas.style.display = 'none';
            }
        };
        
        document.getElementById('zoomIn').onclick = () => this.zoom(0.2);
        document.getElementById('zoomOut').onclick = () => this.zoom(-0.2);
        document.getElementById('resetView').onclick = () => this.reset();
    }

    setupZoomPan() {
        this.container.onwheel = (e) => {
            e.preventDefault();
            this.zoom(e.deltaY > 0 ? -0.1 : 0.1);
        };
        
        let dragging = false, startX, startY;
        
        this.wrapper.onmousedown = (e) => {
            if (e.target === this.floorPlan || e.target === this.gridCanvas) {
                dragging = true;
                startX = e.clientX - this.translateX;
                startY = e.clientY - this.translateY;
                this.wrapper.style.cursor = 'grabbing';
            }
        };
        
        document.onmousemove = (e) => {
            if (dragging) {
                this.translateX = e.clientX - startX;
                this.translateY = e.clientY - startY;
                this.updateTransform();
            }
        };
        
        document.onmouseup = () => {
            dragging = false;
            this.wrapper.style.cursor = 'grab';
        };
    }

    zoom(delta) {
        this.scale = Math.max(0.5, Math.min(3, this.scale + delta));
        this.updateTransform();
    }

    updateTransform() {
        this.wrapper.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }

    reset() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    drawGrid() {
        const ctx = this.gridCanvas.getContext('2d');
        const w = this.gridCanvas.width;
        const h = this.gridCanvas.height;
        
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= w; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        
        for (let y = 0; y <= h; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }
}

// Iniciar
document.addEventListener('DOMContentLoaded', () => new NetworkMap());
