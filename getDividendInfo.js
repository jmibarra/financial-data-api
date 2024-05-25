const yahooFinance = require('yahoo-finance2').default;
const { format } = require('date-fns');

const fetchStockData = async (symbol) => {
    try {
        // Primera llamada para obtener los datos principales
        const result = await yahooFinance.quote(symbol);

        // Segunda llamada para obtener los eventos del calendario
        const calendarEventsResult = await yahooFinance.quoteSummary(symbol, { modules: ["calendarEvents"] });

        // Extraer las fechas
        let dividendDateFormatted = result.dividendDate ? format(new Date(result.dividendDate), 'dd/MM/yyyy') : "";
        let exDividendDateFormatted = calendarEventsResult.calendarEvents.exDividendDate ? format(new Date(calendarEventsResult.calendarEvents.exDividendDate), 'dd/MM/yyyy') : "";

        // Extraer otros datos
        const { dividendYield, dividendRate } = result;

        // Devolver todos los datos requeridos
        return { dividendDate: dividendDateFormatted, dividendYield, dividendRate, exDividendDate: exDividendDateFormatted };
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
};

module.exports = fetchStockData;
