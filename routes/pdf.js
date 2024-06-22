// const { text } = require('body-parser');
const express = require('express') ;
const PdfPrinter = require('pdfmake') ;
const router = express.Router() ;

var pdfmake = require('pdfmake/build/pdfmake') ;
var pdffonts = require('pdfmake/build/vfs_fonts') ;
pdfmake.vfs = pdffonts.pdfMake.vfs ;

const printer = pdfmake ;


function processJson(data, indent = 0) {
    let result = [];

    if (typeof data === 'object' && !Array.isArray(data)) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result.push({ text: `${' '.repeat(indent)}${key}:`, bold: true });

                const value = data[key];
                if (typeof value === 'object') {
                    result = result.concat(processJson(value, indent + 2));
                } else {
                    result.push({ text: `${' '.repeat(indent + 2)}${value}` });
                }
            }
        }
    } else if (Array.isArray(data)) {
        data.forEach(item => {
            result = result.concat(processJson(item, indent + 2));
        });
    } else {
        result.push({ text: `${' '.repeat(indent)}${data}` });
    }

    return result;
}



router.post('/generate-pdf' , async (req,res) => {
    const { title , content } = req.body ;

    const document = {
        content : [
            // { text : title , style: 'header '},
            // content
            { text: title, style: 'header' },
            ...processJson(content)
        ],
        styles: {
            headers:{
                fontSize: 18,
                bold: true    
            }
        }
    }

    const pdfDoc = printer.createPdf( document ) ;
    const pdfBuffer = await new Promise((res,rej) => {
        pdfDoc.getBuffer((buffer) => {
            res(buffer) ;
        });
    });

    const base64PDF = pdfBuffer.toString("base64");

    return res.status(200).json({
        file: base64PDF,
    })

})

module.exports = router ;