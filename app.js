const express = require('express') ;
require('dotenv').config();
const bodyParser = require('body-parser');
const pdfRouter = require('./routes/pdf');

const app = express() ;
const startPort = process.env.PORT || 9000 ;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(bodyParser.json());
app.use('/api', pdfRouter);

app.listen( startPort , () => {
    console.log('Server started at port' , startPort ) ;
})