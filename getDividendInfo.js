const yahooFinance = require('yahoo-finance2').default;
const { subMonths, format } = require('date-fns');

const fetchStockData = async (symbol) => {
    try {
        // Primera llamada para obtener los datos principales
        const result = await yahooFinance.quote(symbol);
        if (!result || result.length === 0) {
            throw new Error('No data found');
        }

        // Segunda llamada para obtener los eventos del calendario
        const calendarEventsResult = await yahooFinance.quoteSummary(symbol, { modules: ["calendarEvents"] });
        if (!calendarEventsResult || !calendarEventsResult.calendarEvents) {
            throw new Error('No calendar events found');
        }

        // Extraer las fechas
        let dividendDateFormatted = format(new Date(result.dividendDate), 'dd/MM/yyyy');
        let exDividendDateFormatted = format(new Date(calendarEventsResult.calendarEvents.exDividendDate), 'dd/MM/yyyy');

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
