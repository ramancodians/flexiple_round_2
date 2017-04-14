var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var jsonfile = require('jsonfile');

// DB mock
var dbFile = './db-mock.json';
var dbData = {};

// init express
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public'));

dbData = jsonfile.readFileSync(dbFile);

app.get('/',(req,res)=>{
    if(req.session.isLogged){
       res.redirect('/home');
    }else{
        res.render('login', {
            error : null,
            body : {},
            loginError : false
        });
    }
});

app.post('/',(req,res)=>{
    var format = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+|\d+/;
    var emailFormat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.in$/;
    var error = []
    if(format.test(req.body.full_name)){
        error.push({
            msg : "Fullname not formatted correctly"
        });
    }
    if(req.body.password != req.body.password_confirm){
         error.push({
            msg : "Password don't match"
        });
    }
    
    if(req.body.password.length < 4 || req.body.password.length > 8){
          error.push({
            msg : "Password length must be between 4 to 8 characters"
        });
    }
    
    if(!emailFormat.test(req.body.email)){
        error.push({
            msg : "Email should end with .in"
        });
    }
    
    
    if(error.length > 0){
        res.render('login', {
            error : error,
            body : req.body,
            loginError : false
        });
    }else{
        addUser(req.body,(err)=>{
            if(err){
                console.log('Error while adding users');
            }else{
                req.session.isLogged = true;
                res.redirect('/home');
            }
        });
    }
});

app.get('/home',(req,res)=>{
    
    getUserdata(function(req.session.email){
        res.render('logged', {});
    })
    
    res.send('sadasd')
    
});

app.get('/logout',(req,res)=>{
   delete req.session.isLogged;
     res.render('login', {
            error : null,
            body : {},
            loginError : false,
        });
});

app.post('/auth',(req,res)=>{
   var user = dbData.users.find((user)=>{
       return user.email == req.body.email && user.password == req.body.password;
   });
    if(user){
        req.session.isLogged = true;
        res.redirect('/home');
    }else{
         res.render('login', {
            error : null,
            body : {},
            loginError : true,
        });
    }
});


app.listen(process.env.PORT || 5000,()=>{
   console.log('Sever running at Port : 3000');
});

//--------------------------------------------------

function addUser(userData,cb){
    dbData.users.push(userData);
    jsonfile.writeFile(dbFile, dbData, function (err) {
      cb(err);
   });
}

function getUserData(email){
    console.log('find this user -> ' + email)
}