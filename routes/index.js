const express = require('express');
const router = express.Router();
const fs = require('fs');
const dotenv = require('dotenv').config()
const {getSheetData, updateSheet} = require('../controllers/sheets.js')
const { google } = require("googleapis");
const {authorize} = require('./Authorize.js')

const fetch  = require('node-fetch')
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uris = process.env.REDIRECT


/*****************************************
 
    The server has 4 endpoint created and the description for each of them is given below ;
    
    1. /link GET Request ;
    
    This endpoint is called in the client Side for the user to authorise the 
    subsequent events. this endpoint generates the auth oAuth link which 
    redirects the URL to / login on successful authorization

    2. / login  GET Request ;

    This endpoint generates a token whenever user authorizes from google oAuth2. The link
    is redicted to this endoint

    3. /spreadsheet/:id   GET Request ;
    path variables : Sheet ID

    This endpoint fetches the values of all the rows from all the Sheets of the Spreadsheet
    Sheet ID shopuld be passed mandatorily

    4. /spreadsheet/update  POST Request ;
    Request Body : { spreadsheet_id, sheet_id, row_number, column_number, value }

    This endpoint updates the cell representing the row and column of the particular\
    sheet in the Spreadsheet

    **** Error handelling is done at all the required positions ****

    Flow : 

    first /link endpoint should be called

    and 3 and 4 API endpoints can be called as in when required

********************************************/


router.get("/link", async(req, res)=>{
    try {
        const id = req.params.id

        //const sheetId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris);

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: "https://www.googleapis.com/auth/spreadsheets"
        });
        console.log("came")
        res.send(authUrl)

    } catch(error){
        console.log(error)
        res.send({
            "status":"error",
            "message":error
        })
    }
})

// ********************************************************* //

router.get("/login", async(req, res)=>{

    console.log(req.params)
    console.log(req.query)

    const code = req.query.code  

    fs.readFile('credentials.json', async(err, content) => {
        if (err) res.send({"status":"error", "message":err})

        await authorize(JSON.parse(content), code);
        
        res.send({
            "statusCode":200,
            "status":"Authorization Success"
        })
      });

})

// ********************************************************* //

router.get("/spreadsheet/:id", async(req, res)=>{

    try {
        
        const id = req.params.id

        // const id = "1KSn8Esooers2RmUmZEB76xInGQFbgG7nkWp8IuOuBww"

        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris);

        await fs.readFile('token.json', async(err, content) => {
            if (err) res.send({
                "status":"error",
                "message":err
            })
        
            await oAuth2Client.setCredentials(JSON.parse(content))
            
            const result = await getSheetData(id, oAuth2Client)

            res.send({
                "status":"success",
                "statusCode":200,
                "data":result
            })
            
        });
        
    } catch(error){
        console.log(error)
        res.send({
            "status":"error",
            "message":error
        })
    }
})


// ********************************************************* //


router.post("/spreadsheet/update", async(req, res)=>{

    try {

        const data = {
            "sheetId" : req.body.spreadsheet_id,
            "sheet": req.body.sheet_id,
            "row" : req.body.row_number,
            "column" : req.body.column_number,
            "value": req.body.value
        }

        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris);

        await fs.readFile('token.json', async(err, content) => {
            if (err) res.send({
                "status":"error",
                "message":err
            })
        
        await oAuth2Client.setCredentials(JSON.parse(content))
        const result = await updateSheet(data, oAuth2Client);

        res.send({
            "statusCode":200, 
            "status":"update Successful"
        })
    })

    } catch(error){
        console.log(error)
        res.send({
            "status":"error",
            "message":error
        })
    }
})


// ********************************************************* //


router.get("/ode/news", async(req, res)=>{

    try{

        const keyword = [
            '"dataprivacy"',
            '+Data privacy laws',
            '"privacy of data"',
            '"web 3.0"',
            '"data is like air"'
        ]
        var news = {}
        const d = new Date();
        const date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
        console.log(date)
        for(const j of keyword){
            
            const api = `https://newsapi.org/v2/everything?q=${j}&from=${date}&language=en&sortBy=relevancy&apiKey=c46df11249ae4ae39aa77b0eac2571ed`
            console.log(api)
            const response = await fetch(api);
            const articles = await response.json();
            console.log(articles )
            for(const k of articles["articles"]){

                news[k['title']] = k
                news[k['title']]['keyword'] = j 
            }
        }
        const Data = Object.values(news)   

        res.send({
            "statusCode":200,
            "totalResults":Data.length,
            "items":Data
        })
    } catch(error){
        res.send(error)
        console.log(error)
    }
})


router.get("/ode/signin" ,(req, res)=>{
    try{   
        const email = req.query.email
        console.log(email)
        res.send({email})
    }catch(error){
        console.log(error)
    }
})
module.exports = router ;