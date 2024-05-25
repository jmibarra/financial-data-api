const express = require('express');
const fs = require('fs');
const calculateRSI = require('./calculateRSI');

const app = express();
const port = 3000;

app.get('/api/rsi/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const rsi = await calculateRSI(symbol);

    if (rsi === null) {
        res.status(500).send('Error calculating RSI');
    } else {
        const data = { symbol, rsi };
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        res.json(data);
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});