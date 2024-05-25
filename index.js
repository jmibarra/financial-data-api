const axios = require('axios');
const { RSI } = require('technicalindicators');

const calculateRSI = async (symbol) => {
    const url = `https://api.example.com/stock-data?symbol=${symbol}`; // Reemplaza con una API válida
    try {
        const response = await axios.get(url);
        const closePrices = response.data.map(point => point.close);
        const period = 14; // Usualmente se usa un periodo de 14 días

        const rsi = RSI.calculate({ values: closePrices, period });

        return rsi[rsi.length - 1]; // Devuelve el último valor del RSI
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
};

(async () => {
    const symbol = 'AAPL'; // Cambia el símbolo de la acción según sea necesario
    const rsi = await calculateRSI(symbol);
    console.log(`RSI for ${symbol}:`, rsi);
})();
