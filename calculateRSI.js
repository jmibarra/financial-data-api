const yahooFinance = require('yahoo-finance2').default;
const { subMonths, format } = require('date-fns');

const fetchStockData = async (symbol) => {
    try {
        const today = new Date();
        const period1 = format(subMonths(today, 4), 'yyyy-MM-dd');
        const period2 = format(today, 'yyyy-MM-dd');

        const result = await yahooFinance.historical(symbol, { period1, period2 });
        if (!result || result.length === 0) {
            throw new Error('No data found');
        }
        return result;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
};

const calculateFinalRSI = async (symbol) => {
    const rawData = await fetchStockData(symbol);

    if (!rawData) return null;

    const period = 14; // Usualmente se usa un periodo de 14 días
    const rsi = calculateRSI(rawData, period);

    return rsi; // Devuelve el último valor del RSI
};

const calculateRSI = (data, period = 14) => {
    if (data.length < period) {
        console.error('Not enough data points to calculate RSI');
        return null;
    }

    const closePrices = data.map(entry => entry.close);

    const gains = [];
    const losses = [];

    // Calcular ganancias y pérdidas
    for (let i = 1; i < closePrices.length; i++) {
        const change = closePrices[i] - closePrices[i - 1];
        if (change > 0) {
            gains.push(change);
            losses.push(0);
        } else {
            losses.push(Math.abs(change));
            gains.push(0);
        }
    }

    // Calcular promedios de ganancias y pérdidas
    let averageGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let averageLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

    let rs = averageGain / averageLoss;
    let rsi = 100 - (100 / (1 + rs));

    const rsiArray = [rsi];

    // Calcular RSI para cada periodo subsiguiente
    for (let i = period; i < gains.length; i++) {
        const currentGain = gains[i];
        const currentLoss = losses[i];

        averageGain = ((averageGain * (period - 1)) + currentGain) / period;
        averageLoss = ((averageLoss * (period - 1)) + currentLoss) / period;

        rs = averageGain / averageLoss;
        rsi = 100 - (100 / (1 + rs));

        rsiArray.push(rsi);
    }

    return rsiArray[rsiArray.length - 1]; // Devuelve el último valor del RSI
};

module.exports = calculateFinalRSI;
