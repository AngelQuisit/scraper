const express = require('express');
const app = express();
const router = express.Router();

const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin())

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

async function getRouteDist(origin, destination){

    let routeDistURL = "https://sea-distances.org/";
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto(routeDistURL);
    
    await delay(50);

    const value = await page.$$eval('#country_id_from > option', options =>{
        let obj = {}
        for(i=0; i<Object.keys(options).length; i++){
        obj[(options)[i].value] = options[i].innerText
        }   
    return obj
    })

    const oVal = await value;

    let countryVal;

    for(let i=0;i<Object.keys(oVal).length;i++){
        if(oVal[Object.keys(oVal)[i]]===`${origin}`){
            countryVal = Object.keys(oVal)[i]
        }
    }

    await page.select('#country_id_from', countryVal)

    const dValue = await page.$$eval('#country_id_to > option', options =>{
        let obj = {}
        for(i=0; i<Object.keys(options).length; i++){
        obj[(options)[i].value] = options[i].innerText
        }   
    return obj
    })

    const dVal = await dValue;

    let countrydVal;

    for(let i=0;i<Object.keys(dVal).length;i++){
        if(dVal[Object.keys(dVal)[i]]===`${destination}`){
            countrydVal = Object.keys(dVal)[i]
        }
    }

    await page.select('#country_id_to', countrydVal)

    await delay(500);

    await page.click('[class="btn btn-primary span3"]')

    await delay(1000);

    const routeDist = await page.$$eval('tbody > tr > td', calResult=>{
    return calResult.map(el3=>{
        return el3.innerText
    })
  })
    return routeDist;
}

router.get('/:origin/:destination',(req,res)=>{
    
    getRouteDist(req.params.origin, req.params.destination)
        .then(arr=>{
            let newArr = [];
            for(let i=0; i<arr.length; i+=6){
                newArr.push([arr[i+1], arr[i+3], arr[i+5]])
            }
    
            res.send({newArr})
        })
        .catch(err=>{
            res.send(`An error occured ${err}`)
        })
    
})

module.exports = router