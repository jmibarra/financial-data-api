const express = require('express');
const fs = require('fs');
const calculateRSI = require('./calculateRSI');
const fetchStockData = require('./getDividendInfo');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    //Devuelvo un mensaje "API DE FINANZAS
    //Abajo listo links a las rutas disponibles
    res.send('API DE FINANZAS');
    res.end();



});

app.get('/api/rsi/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const rsi = await calculateRSI(symbol);

    res.status(200).send('OK');

    if (rsi === null) {
        res.status(500).send('Error calculating RSI');
    } else {
        const data = { symbol, rsi };
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        res.json(data);
    }
});

app.get('/api/dividendInfo/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const dividendInfo = await fetchStockData(symbol);

    res.status(200).send('OK');

    if (dividendInfo === null) {
        res.status(500).send('Error getting dividend INFO');
    } else {
        const data = { symbol, dividendInfo };
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        res.json(data);
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});