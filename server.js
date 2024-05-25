const express = require('express');
const fs = require('fs');
const calculateRSI = require('./calculateRSI');
const fetchStockData = require('./getDividendInfo');

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
            res.status(500).send('Error getting dividend INFO');
        } else {
            const data = { symbol, dividendInfo };
            res.json(data);
        }
    } catch (error) {
        console.error('Error in /api/dividendInfo/:symbol:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
