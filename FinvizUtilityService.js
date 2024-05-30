// utilityService.js
const { format } = require('date-fns');

class UtilityService {
    static getFormattedDataForSheets(data) {
        try {
            const finvizData = data.finvizData;

            console.log("Data finviz")
            console.log(finvizData)

            // Formatear RSI como número
            const rsi = parseFloat(finvizData['RSI (14)'].replace(',', '.'));

            // Formatear la fecha "Dividend Ex-Date"
            const dividendExDate = finvizData['Dividend Ex-Date'];
            const formattedDividendExDate = format(new Date(dividendExDate), 'dd/MM/yyyy');

            // Extraer y dividir el campo "Dividend Est."
            const dividendEst = finvizData['Dividend Est.'];
            const dividendParts = dividendEst.match(/([\d.]+)\s\(([\d.]+)%\)/);

            const dividend = parseFloat(dividendParts[1].replace(',', '.'));
            const dividendYield = parseFloat(dividendParts[2].replace(',', '.'));

            return {
                RSI: rsi,
                dividendExDate: formattedDividendExDate,
                dividend,
                dividendYield
            };

        } catch (error) {
            console.error('Error formatting:', error);
            return null;
        }
    }
}

module.exports = UtilityService;
