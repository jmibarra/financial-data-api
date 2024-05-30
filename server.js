const express = require('express');
const fs = require('fs');
const calculateRSI = require('./calculateRSI');
const fetchStockData = require('./getDividendInfo');
const FinvizDataService = require('./finvizDataService');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    //Devuelvo un texto que diga API FINANZAS
    res.send('API FINANZAS');
})

app.get('/api/rsi/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const rsi = await calculateRSI(symbol);

        if (rsi === null) {
            res.status(500).send('Error calculating RSI');
        } else {
            const data = { symbol, rsi };
            res.json(data);
        }
    } catch (error) {
        console.error('Error in /api/rsi/:symbol:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/dividendInfo/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const dividendInfo = await fetchStockData(symbol);

        if (dividendInfo === null) {
            res.status(404).send('No se encuentra información del dividendo para este simbolo ' + symbol);
        } else {
            const data = { symbol, dividendInfo };
            res.json(data);
        }
    } catch (error) {
        console.error('Error in /api/dividendInfo/:symbol:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/finvizdata/:symbol', async (req, res) => {

    const symbol = req.params.symbol;
    const finvizDataService = new FinvizDataService(symbol);
    try {

        const finvizData = await finvizDataService.fetchFinvizData();

        if (finvizData === null) {
            res.status(404).send('No se encuentra información de finviz para este simbolo ' + symbol);
        } else {
            const data = { symbol, finvizData };
            res.json(data);
        }
    } catch (error) {
        console.error('Error in /api/finvizdata/:symbol:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/finvizdata/formatedData/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const finvizDataService = new FinvizDataService(symbol);
    try {
        const finvizData = await finvizDataService.fetchFormatedFinvizData(symbol);

        if (finvizData === null) {
            res.status(404).send('No se encuentra información de finviz para este simbolo ' + symbol);
        } else {

            const data = { symbol, finvizData };
            res.json(data);
        }
    } catch (error) {
        console.error('Error in /api/finvizdata/:symbol:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
