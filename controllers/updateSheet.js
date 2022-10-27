const { google } = require("googleapis");


const updateSheet = async(data, auth)=>{

    try{
        console.log("Updating ..")

        const Column = String.fromCharCode(64+data.column);

        const Range = `${data.sheet}!${Column}${data.row}`

        const sheets = google.sheets({version: 'v4', auth});

        await sheets.spreadsheets.values.update({
            spreadsheetId:data.sheetId,
            range: Range,
            valueInputOption: "USER_ENTERED",
            resource: {
              values: [[data.value]],
            },
          });

        return "success";
    } catch(error){
        console.log(error)
        return error
    }

}

module.exports ={
    updateSheet
}