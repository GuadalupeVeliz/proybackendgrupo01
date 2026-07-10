// src/services/conversor.service.js

/**
 * Convierte un monto de una moneda de origen a Pesos Argentinos (ARS)
 * @param {number} monto - La cantidad de dinero a convertir
 * @param {string} monedaOrigen - Código de la moneda (Ej: 'USD', 'EUR', 'BRL')
 * @returns {number|null} - El monto convertido a ARS o null si hay un error
 */
const convertirAMonedaLocal = async (monto, monedaOrigen = 'USD') => {
    // Si el paquete ya está cotizado en ARS, devolvemos el monto intacto
    if (monedaOrigen === 'ARS') {
        return Number(monto);
    }

    try {
        // Consultamos la API pública de tasas de cambio
        const respuesta = await fetch(`https://api.exchangerate-api.com/v4/latest/${monedaOrigen}`);
        
        if (!respuesta.ok) {
            throw new Error('No se pudo obtener la tasa de cambio');
        }

        const data = await respuesta.json();
        const tasaCambioARS = data.rates['ARS'];

        if (!tasaCambioARS) {
            throw new Error('La moneda ARS no está disponible en la respuesta de la API');
        }

        // Calculamos el monto final
        const montoConvertido = monto * tasaCambioARS;

        // Retornamos el valor numérico redondeado a 2 decimales para Mercado Pago
        return Number(montoConvertido.toFixed(2));

    } catch (error) {
        console.error("Error en el servicio de conversión:", error);
        return null;
    }
};

module.exports = { convertirAMonedaLocal };