const yahooFinance = require('yahoo-finance');
const express = require('express');
const cors = require('cors');
const Axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send({
    status: 200,
    message: 'Hello from Finance App',
  });
});

app.get('/search', (req, res) => {
  Axios.get('https://query2.finance.yahoo.com/v1/finance/search', {
    params: req.query,
  })
    .then(({ data }) => res.send(data))
    .catch((err) => res.status(404).send(err));
});

app.get('/:type/:symbols', (req, res) => {
  if (['quote', 'historical', 'snapshot'].includes(req.params.type)) {
    const symbols = req.params.symbols.split(',');
    const modules = req.query.modules?.split(',');
    const fields = req.query.fields?.split(',');

    const options = {
      ...(symbols.length ? { symbols } : { symbol: symbols[0] }),
      ...req.query,
      ...(!modules || { modules }),
      ...(!fields || { fields }),
    };
    yahooFinance[req.params.type](options)
      .then((quotes) => res.send(quotes))
      .catch((err) => res.status(404).send(err));
  } else {
    res.status(400).send({
      status: 400,
      message:
        "Bad Request: Type must be one of 'quote', 'historical', or 'snapshot'!",
    });
  }
});

app.get('*', (_, res) => {
  res.status(404).send({
    status: 404,
    message: 'Not Found!',
  });
});

app.listen(port, () => {
  console.log(`Finance app listening at http://localhost:${port}`);
});
