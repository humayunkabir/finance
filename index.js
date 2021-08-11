const yahooFinance = require('yahoo-finance');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send({
    status: 200,
    message: 'Hello from Finance App',
  });
});

app.get('/:type/:symbols', (req, res) => {
  if (['quote', 'historical'].includes(req.params.type)) {
    const symbols = req.params.symbols.split(',');
    const options = {
      ...(symbols.length ? { symbols } : { symbol: symbols[0] }),
      ...req.query,
    };
    yahooFinance[req.params.type](options)
      .then((quotes) => res.send(quotes))
      .catch((err) => res.status(404).send(err));
  } else {
    res.status(400).send({
      status: 400,
      message: "Bad Request: Type must be one of 'quote' or 'historical'!",
    });
  }
});

app.listen(port, () => {
  console.log(`Finance app listening at http://localhost:${port}`);
});
