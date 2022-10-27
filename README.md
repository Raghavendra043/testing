Client -> React App
Utilize_task -> Node Application

Start the React Application
Start the Nodejs Application

u can generated the Token on button click from React Application,
other required tasks can be performed by calling the appropriate endpoints

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
