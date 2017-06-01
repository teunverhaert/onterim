var express = require('express');
var bodyparser = require('body-parser');
var path = require("path");
var app = express();
var http = require('http');
var request = require('request');

var logedIn = false;
var loggedInUser = null;

//static file hosting
app.use(express.static('client'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//configure app

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/backend/loggedIn', function (req,res) {
    var user = {'username':req.body.username,'imageUrl':req.body.imageUrl};
    logedIn = true;
    loggedInUser = user;
    res.status(200).json({message:'logged in as: '+loggedInUser.username});
});

app.get('/backend/getloggedIn',function (req,res) {
    res.status(200).json({username:loggedInUser.username,imageUrl:loggedInUser.imageUrl});
});

app.post('/backend/loginFromDb',function (req,res) {
    var userToLog = {'username':req.body.username,'password':req.body.password};
});

app.get('/backend/autocomplete', function (req,res) {
    var location = req.query.location;
    var options = {
         method: 'GET',
         url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+location+'&components=country:be&key=AIzaSyApFGIipkwRe_OUSgy996K0ukg7gxNL4qM'
    };
    request(options, function (error, response, body) {
        if(body!=null){
           res.status(200).send(body);
        }
    });
});

app.get('/backend/getdistance', function (req,res) {
    var origin = req.query.origin;
    var destination = req.query.destination;
    var options = {
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origin+'&destinations=place_id:'+destination+'&key=AIzaSyApFGIipkwRe_OUSgy996K0ukg7gxNL4qM'
    };
    request(options, function (error, response, body) {
        if(body!=null){
            res.status(200).send(body);
        }
    });
});

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/login',function(req,res){
    res.sendFile(path.join(__dirname+'/client/login.html'));
});

app.get('/loginVerification',function(req,res){
    res.sendFile(path.join(__dirname+'/client/loginVerification.html'));
});

app.get('/jobs',function(req,res){
    res.sendFile(path.join(__dirname+'/client/jobs.html'));
});

app.get('/payment', function (req, res) {
    res.sendFile(path.join(__dirname+'/client/pyment.html'));
});

app.get('/newjob', function (req, res) {
    res.sendFile(path.join(__dirname+'/client/jobsNew.html'));
});

app.get('/newuser', function (req, res) {
    res.sendFile(path.join(__dirname+'/client/newUser.html'));
});

app.listen(3000);