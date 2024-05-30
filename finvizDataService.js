// finvizDataService.js
const getStockData = require('./getStockData');
const UtilityService = require('./FinvizUtilityService');

class FinvizDataService {
    constructor(symbol) {
        this.symbol = symbol;
    }

    async fetchFinvizData() {
        try {
            const finvizData = await getStockData(this.symbol);
            return finvizData;
        } catch (error) {
            console.error('Error fetching Finviz stock data:', error);
            return null;
        }
    }

    async fetchFormatedFinvizData() {
        //Método personal para la info que yo consumo en mis planillas
        try {
            const finvizData = await getStockData(this.symbol);
            // Crear un objeto de datos que incluya el símbolo
            const data = {
                symbol: this.symbol,
                finvizData: finvizData
            };

            // Formatear los datos usando UtilityService
            const formatedData = UtilityService.getFormattedDataForSheets(data);
            return formatedData;
        } catch (error) {
            console.error('Error fetching Finviz stock data:', error);
            return null;
        }

    }
}

module.exports = FinvizDataService;
