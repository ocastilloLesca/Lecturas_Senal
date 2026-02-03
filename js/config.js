// Configuración de puntos WiFi
const CONFIG = {
    // Umbrales de señal en dBm
    thresholds: {
        excellent: -55,    // 0 a -55 dBm: Señal muy buena
        good: -75,         // -55 a -75 dBm: Buena
        fair: -90          // -75 a -90 dBm: Mala
                          // ≤ -90 dBm: Desconexión
    },
    
    // Datos de cada punto (coordenadas estimadas según plano)
    points: [
        { id: 1, x: 81, y: 62, signal: -62, label: 'Área Principal', img: 'punto_1.jpeg' },
        { id: 2, x: 36, y: 49, signal: -56, label: 'Corredor Central', img: 'punto_2.jpeg' },
        { id: 3, x: 13, y: 46, signal: -48, label: 'Zona Oeste', img: 'punto_3.jpeg' },
        { id: 4, x: 11, y: 17, signal: -60, label: 'Sala Norte', img: 'punto_4.jpeg' },
        { id: 5, x: 34, y: 57, signal: -68, label: 'Pasillo Sur', img: 'punto_5.jpeg' },
        { id: 6, x: 33, y: 83, signal: -78, label: 'Área Sur', img: 'punto_6.jpeg' },
        { id: 7, x: 51, y: 83, signal: -72, label: 'Sur Este', img: 'punto_7.jpeg' },
        
        // Puntos pendientes (ajusta cuando tengas las imágenes)
        { id: 8, x: 85, y: 81, signal: -60, label: 'Esquina SE', img: 'punto_8.jpeg' },
        { id: 9, x: 63, y: 18, signal: -56, label: 'Sala NE', img: 'punto_9.jpeg' },
        { id: 10, x: 73, y: 30, signal: -52, label: 'Centro Este', img: 'punto_10.jpeg' },
        { id: 11, x: 87, y: 61, signal: -61, label: 'Área Este', img: 'punto_11.jpeg' },
        { id: 12, x: 87, y: 18, signal: -60, label: 'Esquina NE', img: 'punto_12.jpeg' },
        { id: 13, x: 57, y: 65, signal: -56, label: 'Centro', img: 'punto_13.jpeg' },
        { id: 14, x: 54, y: 67, signal: -59, label: 'Centro Sur', img: 'punto_14.jpeg' },
        { id: 15, x: 53, y: 47, signal: -53, label: 'Área Central', img: 'punto_15.jpeg' },
        { id: 16, x: 48, y: 62, signal: -58, label: 'Zona Media', img: 'punto_16.jpeg' },
        { id: 17, x: 37, y: 27, signal: -80, label: 'Sala NO', img: 'punto_17.jpeg' },
        { id: 18, x: 36, y: 35, signal: -83, label: 'Corredor NO', img: 'punto_18.jpeg' },
        { id: 19, x: 41, y: 26, signal: -66, label: 'Área Norte', img: 'punto_19.jpeg' },
        { id: 20, x: 41, y: 74, signal: -69, label: 'Pasillo SO', img: 'punto_20.jpeg' },
        { id: 21, x: 30, y: 27, signal: -64, label: 'Sala Oeste', img: 'punto_21.jpeg' },
        { id: 22, x: 17, y: 42, signal: -49, label: 'Zona O Media', img: 'punto_22.jpeg' },
        { id: 23, x: 25, y: 20, signal: -59, label: 'Área NO', img: 'punto_23.jpeg' },
        { id: 24, x: 19, y: 53, signal: -48, label: 'Centro Oeste', img: 'punto_24.jpeg' },
        { id: 25, x: 22, y: 66, signal: -53, label: 'SO Medio', img: 'punto_25.jpeg' },
        { id: 26, x: 33, y: 65, signal: -68, label: 'Pasillo Central', img: 'punto_26.jpeg' },
        { id: 27, x: 12, y: 35, signal: -60, label: 'Extremo O', img: 'punto_27.jpeg' },
        { id: 28, x: 13, y: 65, signal: -48, label: 'Extremo SO', img: 'punto_28.jpeg' }
    ]
};

// Función auxiliar para obtener categoría de señal
function getSignalCategory(signal) {
    if (signal >= CONFIG.thresholds.excellent) return 'excellent';
    if (signal >= CONFIG.thresholds.good) return 'good';
    if (signal >= CONFIG.thresholds.fair) return 'fair';
    return 'poor';
}

function getSignalText(signal) {
    const cat = getSignalCategory(signal);
    return { excellent: 'Señal muy buena', good: 'Buena', fair: 'Mala', poor: 'Desconexión' }[cat];
}
