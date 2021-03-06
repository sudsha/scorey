/* 
---------------------------------------------------------------
Scorey - The score tracking app for friends
March 27, 2017
Sudhakar

This file handles all request and responses from the server

---------------------------------------------------------------
*/

//prints a message on console to confirm server.js is working
console.log('server.js is working')

//allows using express in this file after express is installed and specified in package.json in the folder
const express = require('express')
var session = require('express-session')
const app = express()
app.use(session({secret: 'sudhkarsharma', resave: false, saveUninitialized: false}))

//global.jQuery = global.$ = require('jquery')
//const bootstrap = require('bootstrap')

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

//Express doesn’t handle reading data from the <form> element on it’s own. We have to add another package called body-parser to gain this functionality. Make sure you place body-parser before your CRUD handlers!
//The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

//tell server to read JSON
app.use(bodyParser.json())

//tell Express to make the public folder accessible to the public by using a built-in middleware called express.static
app.use(express.static('public'))
app.use(express.static(__dirname))
//console.log('dirname: ' + __dirname)

//API: Fetch & show scorey for a team
app.get('/scoreyapi/:team', (req, res) => {
    console.log('entering scorey api')
    console.log('scorey wanted for team: ' + req.params.team)

    var team = req.params.team
    var date = 'today'
    
    db.collection('live_games').findOne({forteam: team, date: date}, function(err, records) {  
        console.log('fetching scorey')
        console.log(records)
        
        res.startrender('scoreyfromapi.ejs', {game_data: records})  
    })    
        
   //res.send('{"id": 1,"name":"Matt","band":"BBQ Brawlers"}');
    //res.sendFile('/Users/Sudhakar/Documents/Sudhakar/OneDrive/Personal/Development/scorey' + '/home.html')
    //res.render('home.ejs')

})

//load index page on URL hit
app.get('/index', (req, res) => {
    //console.log('entering scorey')
    //res.send('hello scorey')
    res.sendFile(__dirname + '/index.html')
    //res.render('home.ejs')

})

//load emojitest page on URL hit
app.get('/emojitest', (req, res) => {
    //console.log('entering scorey')
    //res.send('hello scorey')
    res.sendFile(__dirname + '/emojitest.html')
    //res.render('home.ejs')

})
        
//load contact page on URL hit
app.get('/contact', (req, res) => {
    //console.log('entering scorey')
    //res.send('hello scorey')
    res.sendFile(__dirname + '/contact.html')
    
})

//load first home page on URL hit
app.get('/scorey', (req, res) => {
    //console.log('entering scorey')
    //res.send('hello scorey')
    //res.sendFile('/Users/Sudhakar/Documents/Sudhakar/OneDrive/Personal/Development/scorey' + '/home.html')
    res.render('home.ejs')

})

//load first home page on URL hit
app.get('/', (req, res) => {
    //console.log('entering scorey')
    //res.send('hello scorey')
    //res.sendFile('/Users/Sudhakar/Documents/Sudhakar/OneDrive/Personal/Development/scorey' + '/home.html')
    //res.sendFile(__dirname + '/index.html')
    res.sendFile(__dirname + '/index.html')
    //res.render('home.ejs')

})

//load start game page on URL hit
app.get('/start', (req, res) => {
    console.log('entering start')
    //res.send('hello scorey')
    
    res.render('start.ejs')

})

//use EJS to create dynamic HTML
app.set('view engine', 'ejs')


//app.get method to show records from the database 
//The toArray method takes in a callback function that allows us to do stuff with quotes we retrieved from MongoLab.
app.get('/follow', (req, res) => {
    
    db.collection('live_games').find({}, {forteam: 1, againstteam: 1, venue: 1, date:1, startedby: 1, passkey: 1 }).toArray(function(err, results) {
        
        //console.log(results)
        if (err) return console.log(err)
        res.render('follow.ejs', {live_games: results})
        
    })    
})

//app.get method to show records from the database 
//The toArray method takes in a callback function that allows us to do stuff with quotes we retrieved from MongoLab.
app.get('/update', (req, res) => {
    
    db.collection('live_games').find({}, {forteam: 1, againstteam: 1, venue: 1, date:1, startedby: 1, passkey: 1 }).toArray(function(err, results) {
        
        //console.log('getting live games')
        //console.log(results)        
        if (err) return console.log(err)
        res.render('update.ejs', {live_games: results})
        
    })    
})

/* OLD FOLLOW SCOREY CODE
app.post('/followscorey', (req, res) => {
    
    console.log('followgame form submitted') 
    //prints the contents of the form from the index.html when it is submitted with a POST method
    //console.log(req.body)

    var team = req.body.team_name
    var opposition = req.body.opposition_name
    var venue = req.body.venue
    var date = req.body.date
    
    db.collection('live_games').findOne({team_name: team, opposition_name: opposition, venue: venue, date: date}, function(err, records) {  
        console.log('fetching scorey')
        console.log(records)
        
        res.render('followgame.ejs', {game_data: records})  
    })
})
*/

//This handles the form being submitted from the html file. The form is submitted with a 'POST' request. Express doesn’t handle reading data from the <form> element on it’s own. We have to add another package called body-parser to gain this functionality. Make sure you place body-parser before your CRUDparser handlers!
/*app.post('/startgame', (req, res) => {
    //prints a message on console
    //console.log('startgame form submitted') 
    //prints the contents of the form from the index.html when it is submitted with a POST method
    //console.log(req.body)

    //creates a collection in the database and saves the contents of the form to it
    db.collection('live_games').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database live_games')

    })
    //redirect back to some page otherwise the flow will be stuck at the database
    res.render('updategame.ejs', {game_data: req.body})      
    
})*/

//Function to follow an existing scorey
app.post('/followscorey', (req, res) => {
    
    //console.log('entering start scorey')
    console.log(req.body)
    
    var startedby = req.body.selected_startedby
    var forteam = req.body.selected_forteam
    var againstteam = req.body.selected_againstteam
    var venue = req.body.selected_venue
    var date = req.body.selected_date
    var updatedby = req.body.user_name
    //var score = req.body.user_name + ' joined..'
    var chatter = req.body.user_name + ' joined..'
    var timestamp = new Date()

    var sess
    sess = req.session
    sess.scorey_starter = startedby
    sess.team = forteam
    sess.opposition = againstteam
    sess.venue = venue
    sess.date = date
    sess.user_name = updatedby
    
    db.collection('live_games').findOneAndUpdate(
        {startedby: startedby, forteam: forteam, againstteam: againstteam, venue: venue, date: date},
        {$push: {chatterlog: {chatter: chatter, updatedby: updatedby, time: timestamp}}},
        {upsert: true, returnOriginal: false},
        function(err, records) {  
            //console.log('fetching scorey')
            //console.log(records.value.scorelog.length)
            //res.redirect('/')
            res.render('followgame.ejs', {game_data: records.value, user: updatedby})  
    })
    
})

//Function to refresh follow scorey page
app.get('/followscorey', (req, res) => {
    
    //console.log('entering start scorey')
    console.log('refreshing now...')
    //console.log(req.session)
    
    var sess
    sess = req.session
    
    var startedby = sess.scorey_starter
    var forteam = sess.team
    var againstteam = sess.opposition
    var venue = sess.venue
    var date = sess.date
    var updatedby = sess.user_name

    db.collection('live_games').findOne({"startedby": startedby,"forteam": forteam, "againstteam": againstteam, "venue": venue, "date": date}, function(err, records) {  
        console.log('fetching scorey')
        //console.log(records)
        
        res.render('followgame.ejs', {game_data: records, user: updatedby})  
    })    
    
})

//Function to Join an existing Scorey
app.post('/joinscorey', (req, res) => {
    
    //console.log('entering start scorey')
    console.log(req.body)
    
    var startedby = req.body.selected_startedby
    var forteam = req.body.selected_forteam
    var againstteam = req.body.selected_againstteam
    var venue = req.body.selected_venue
    var date = req.body.selected_date
    var updatedby = req.body.user_name
    //var score = req.body.user_name + ' joined..'
    var chatter = req.body.user_name + ' joined..'
    var timestamp = new Date()

    var sess
    sess = req.session
    sess.scorey_starter = startedby
    sess.team = forteam
    sess.opposition = againstteam
    sess.venue = venue
    sess.date = date
    sess.user_name = updatedby
    
    db.collection('live_games').findOneAndUpdate(
        {startedby: startedby, forteam: forteam, againstteam: againstteam, venue: venue, date: date},
        {$push: {chatterlog: {chatter: chatter, updatedby: updatedby, time: timestamp}}},
        {upsert: true, returnOriginal: false},
        function(err, records) {  
            //console.log('fetching scorey')
            //console.log(records.value.scorelog.length)
            //res.redirect('/')
            res.render('updategame.ejs', {game_data: records.value, user: updatedby})  
    })
    
})

//Function for autorefresh from update scorey scren
app.get('/joinscorey', (req, res) => {
    
    //console.log('entering start scorey')
    console.log('refreshing now...')
    //console.log(req.session)
    
    var sess
    sess = req.session
    
    var startedby = sess.scorey_starter
    var forteam = sess.team
    var againstteam = sess.opposition
    var venue = sess.venue
    var date = sess.date
    var updatedby = sess.user_name

    db.collection('live_games').findOne({"startedby": startedby,"forteam": forteam, "againstteam": againstteam, "venue": venue, "date": date}, function(err, records) {  
        console.log('fetching scorey')
        //console.log(records)
        
        res.render('updategame.ejs', {game_data: records, user: updatedby})  
    }) 
        
    /*db.collection('live_games').findOneAndUpdate(
        {startedby: startedby, forteam: forteam, againstteam: againstteam, venue: venue, date: date},
        {$push: {scorelog: {score: score, updatedby: updatedby, time: timestamp}, chatterlog: {chatter: chatter, updatedby: updatedby, time: timestamp}}},
        {upsert: true, returnOriginal: false},
        function(err, records) {  
            //console.log('fetching scorey')
            //console.log(records.value.scorelog.length)
            //res.redirect('/')
            res.render('updategame.ejs', {game_data: records.value})  
    })*/
    
})

//Function to Start a New Scorey
app.post('/startscorey', (req, res) => {
    
    //console.log('entering start scorey')
    //console.log(req.body)
    
    var scorey_starter = req.body.scorey_starter
    var team = req.body.team_name
    var opposition = req.body.opposition_name
    var venue = req.body.venue
    var date = req.body.date
    var score = req.body.score_update
    var chatter = scorey_starter.concat(" joined")
    var passkey = req.body.passkey
    var timestamp = new Date()

    var sess
    sess = req.session
    sess.scorey_starter = scorey_starter
    sess.team = team
    sess.opposition = opposition
    sess.venue = venue
    sess.date = date
    sess.user_name = scorey_starter
    
    db.collection('live_games').save(
        {startedby: scorey_starter, passkey: passkey, forteam: team, againstteam: opposition, venue: venue, date: date, scorelog: [{score: score,updatedby: scorey_starter,time: timestamp}],
        chatterlog: [{chatter: chatter,updatedby: scorey_starter,time: timestamp}]},
        (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        //console.log(result)
        //redirect back to some page otherwise the flow will be stuck at the database
        //res.redirect('/showscorey?scorey='+req.body.scorey_starter)     
        res.redirect('/showscorey')     
        
    })
    
})

//Function to show updated Scorey
app.get('/showscorey', (req, res) => {
    
    var sess
    sess = req.session
    var updatedby = sess.user_name    
    //console.log('session value' + sess.scorey_starter)
    //res.redirect('/')     
   db.collection('live_games').findOne({startedby: sess.scorey_starter, forteam: sess.team, againstteam: sess.opposition, venue: sess.venue, date:sess.date}, function(err, records) {
        
        //console.log(records)
        if (err) return console.log(err)
        
        //console.log(records.scorelog.length)
        //res.redirect('/')
        res.render('updategame.ejs', {game_data: records, user: updatedby})  
        
    })    
})


//Function to Update score in Scorey
app.post('/updatescorey', (req, res) => {

    var startedby = req.body.startedby
    var forteam = req.body.forteam
    var againstteam = req.body.againstteam
    var venue = req.body.venue
    var date = req.body.date
    var score = req.body.score_update
    var timestamp = new Date()

    var sess
    sess = req.session
    var updatedby = sess.user_name
    //console.log(updatedby)
    
    db.collection('live_games').findOneAndUpdate(
        {startedby: startedby, forteam: forteam, againstteam: againstteam, venue: venue, date: date},
        {$push: {scorelog: {score: score, updatedby: updatedby, time: timestamp}}},
        {upsert: true, returnOriginal: false},
        function(err, records) {  
            //console.log('fetching scorey')
            //console.log(records.value.scorelog.length)
            //res.redirect('/')
            res.render('updategame.ejs', {game_data: records.value, user: updatedby})  
    })
    
})

//Function to post chatter on scorey
app.post('/updatechatter', (req, res) => {
    
    var startedby = req.body.startedby
    var forteam = req.body.forteam
    var againstteam = req.body.againstteam
    var venue = req.body.venue
    var date = req.body.date
    var chatter = req.body.chatter_update
    var timestamp = new Date()
    
    var score_update_from_chat = req.body.score_update_from_chat
    console.log(req.body)
    
    var sess
    sess = req.session
    var updatedby = sess.user_name
    
    if(score_update_from_chat == ""){
        db.collection('live_games').findOneAndUpdate(
            {startedby: startedby, forteam: forteam, againstteam: againstteam, venue: venue, date: date},
            {$push: {chatterlog: {chatter: chatter, updatedby: updatedby, time: timestamp}}},
            {upsert: true, returnOriginal: false},
            function(err, records) {  
                //console.log('fetching scorey')
                //console.log(records.value.scorelog.length)
                //res.redirect('/')
                res.render('updategame.ejs', {game_data: records.value, user: updatedby})  
        })        
    }
    else{
        db.collection('live_games').findOneAndUpdate(
            {startedby: startedby, forteam: forteam, againstteam: againstteam, venue: venue, date: date},
            {$push: {chatterlog: {chatter: chatter, updatedby: updatedby, time: timestamp}, scorelog: {score: score_update_from_chat, updatedby: updatedby, time: timestamp}}},
            {upsert: true, returnOriginal: false},
            function(err, records) {  
                //console.log('fetching scorey')
                //console.log(records.value.scorelog.length)
                //res.redirect('/')
                res.render('updategame.ejs', {game_data: records.value, user: updatedby})  
        })
    }
})

//Function for autorefresh from update score/update chatter scren
app.get('/updatescorey', (req, res) => {
    
    //console.log('entering start scorey')
    console.log('refreshing now...')
    //console.log(req.session)
    
    var sess
    sess = req.session
    
    var startedby = sess.scorey_starter
    var forteam = sess.team
    var againstteam = sess.opposition
    var venue = sess.venue
    var date = sess.date
    var updatedby = sess.user_name

    db.collection('live_games').findOne({"startedby": startedby,"forteam": forteam, "againstteam": againstteam, "venue": venue, "date": date}, function(err, records) {  
        console.log('fetching scorey')
        //console.log(records)
        
        res.render('updategame.ejs', {game_data: records, user: updatedby})  
    }) 
    
})

//Function for autorefresh from update score/update chatter scren
app.get('/updatechatter', (req, res) => {
    
    //console.log('entering start scorey')
    console.log('refreshing now...')
    //console.log(req.session)
    
    var sess
    sess = req.session
    
    var startedby = sess.scorey_starter
    var forteam = sess.team
    var againstteam = sess.opposition
    var venue = sess.venue
    var date = sess.date
    var updatedby = sess.user_name

    db.collection('live_games').findOne({"startedby": startedby,"forteam": forteam, "againstteam": againstteam, "venue": venue, "date": date}, function(err, records) {  
        console.log('fetching scorey')
        //console.log(records)
        
        res.render('updategame.ejs', {game_data: records, user: updatedby})  
    }) 
    
})


//Function to refresh follow scorey page
app.get('/updatefollowchatter', (req, res) => {
    
    //console.log('entering start scorey')
    console.log('refreshing now...')
    //console.log(req.session)
    
    var sess
    sess = req.session
    
    var startedby = sess.scorey_starter
    var forteam = sess.team
    var againstteam = sess.opposition
    var venue = sess.venue
    var date = sess.date
    var updatedby = sess.user_name

    db.collection('live_games').findOne({"startedby": startedby,"forteam": forteam, "againstteam": againstteam, "venue": venue, "date": date}, function(err, records) {  
        console.log('fetching scorey')
        //console.log(records)
        
        res.render('followgame.ejs', {game_data: records, user: updatedby})  
    })    
    
})


//Function to post chatter on scorey
app.post('/updatefollowchatter', (req, res) => {
    
    var startedby = req.body.startedby
    var forteam = req.body.forteam
    var againstteam = req.body.againstteam
    var venue = req.body.venue
    var date = req.body.date
    var chatter = req.body.chatter_update
    var timestamp = new Date()

    var sess
    sess = req.session
    var updatedby = sess.user_name
    
    db.collection('live_games').findOneAndUpdate(
        {startedby: startedby, forteam: forteam, againstteam: againstteam, venue: venue, date: date},
        {$push: {chatterlog: {chatter: chatter, updatedby: updatedby, time: timestamp}}},
        {upsert: true, returnOriginal: false},
        function(err, records) {  
            //console.log('fetching scorey')
            //console.log(records.value.scorelog.length)
            //res.redirect('/')
            res.render('followgame.ejs', {game_data: records.value, user: updatedby})  
    })
    
})

/*
app.post('/updategame', (req, res) => {
    //prints a message on console
    console.log('updategame form submitted') 
    //prints the contents of the form from the index.html when it is submitted with a POST method
    console.log(req.body)

    
    var team = req.body.team_selected
    var opposition = req.body.opposition_selected
    var venue = req.body.venue
    var date = req.body.date
    
    db.collection('live_games').findOne({"team_name": team, "opposition_name": opposition, "venue": venue, "date": date}, function(err, records) {  
        console.log('fetching scorey')
        console.log(records.scorey)
        
        res.render('updategame.ejs', {game_data: records})  
    })
    
})
*/

//set up database connections
const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://scoreyadmin:scoreyadmin@ds137360.mlab.com:37360/scorey', (err, database) => {
    
    if (err) return console.log(err)
    db = database
    //create and start server where browsers can connect to - when the database is connected
    app.listen(3000, function(){
        console.log('listening on 3000')
    })
    
})

//------------------------------------ END -----------------------------------



/* *** Sample code and notes ***

CRUD: create, read, update, delete

The READ operation is performed by browsers whenever you visit a webpage. Under the hood, browsers sends a GET request to the server to perform a READ operation. In Express, we handle a GET request with the get method: app.get(path, callback).

The first argument, path, is the path of the GET request. It’s anything that comes after your domain name.
When we’re visiting localhost:3000, our browsers are actually looking for localhost:3000/. The path argument in this case is /.

The second argument is a callback function that tells the server what to do when the path is matched. It takes in two arguments, a request object and a response object:

app.get('/', function(request, response){
    
    //write 'hello test app' back to the browser
    response.send('hello test app')
})

In ES6, function () can be replaced with =>
request and response are generally written as req and res

localhost:3000/to == app.get('/to', (req, res)
*/

/* Initial app.get methods
app.get('/', (req, res) => {
    
    //redirects browser to another file (html)
    res.sendFile('/Users/sudhakar/documents/sudhakar/onedrive/personal/testapp' + '/index.html')
})

app.get('/message', (req, res) => {
    
    //prints out a message on browser
    res.send('hello test app')
})
*/

/*
  NOTES ON npm run dev
  
  With nodemon server restart is not needed everytime we make a change to source code. nodemon restarts the server automatically everytime we save a file that the server uses
  
  With nodemon:
  'node server.js' becomes 'nodemon server.js' when running from the command line. But we cannot run it from command line because it is not installed with a -g flag. Here we installed it with a -dev flag.
  
  So we need to run nodemon at from command line from within the node_modules folder. i.e. ./node_modules/.bin/nodemon server.js. Or we can use a script below to shorten it:
*/

/*

//This handles the form being submitted from the html file. The form is submitted with a 'POST' request. Express doesn’t handle reading data from the <form> element on it’s own. We have to add another package called body-parser to gain this functionality. Make sure you place body-parser before your CRUDparser handlers!
app.post('/newquotes', (req, res) => {
    //prints a message on console
    console.log('form submitted') 
    //prints the contents of the form from the index.html when it is submitted with a POST method
    console.log(req.body)

    

A collection is a named location to store stuff. You can create as many collections as you want. We can create the quotes collection by using the string quotes while calling MongoDB’s db.collection() method. While creating the quotes collection, we can also save our first entry into MongoDB with the save method simultaneously.

Once we’re done saving, we have to redirect the user somewhere (or they’ll be stuck waiting forever for our server to move). In this case, we’re going to redirect them back to /, which causes their browsers to reload.
    //creates a collection in the database and saves the contents of the form to it
    db.collection('newquotes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        //redirect back to some page otherwise the flow will be stuck at the database
        res.redirect('/')      
        //rest.redirect('/message') will go to app.get('/message', (req, res))
        //res.redirect('/message')      
    })
})

//get the PUT request from main.js via fetch in there    
app.put('/quotes', (req, res) => {
    // Handle put request
    //console.log('in server.js now')
    console.log(req.body)

//find and update a record in database
    db.collection('newquotes').findOneAndUpdate(
        {name: 'test'}, 
        {$set: {name: req.body.name, quote: req.body.quote}},
        {sort: {_id: -1}, upsert: true},
        (err, result) => {
            if (err) return res.send(err)
            res.send(result)
            })    
})

//this gets the DELETE request from main.js via fetch in there
app.delete('/quotes', (req, res) => {
  // Handle delete event here

//find and delete a record from the database
    db.collection('newquotes').findOneAndDelete(
        {name: req.body.name},
        (err, result) => {
            if (err) return res.send(500, err)
            res.json('A darth vadar quote got deleted')
            })
})


*/