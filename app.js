const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const weatherData = require('./utils/weatherData');

const publicPath = path.join(__dirname,"../public");
const viewPath = path.join(__dirname,"templates","views");
const partialPath = path.join(__dirname,"templates","partials");

// app.use(express.urlencoded({extended:true}));
app.set('view engine','hbs');
app.use(express.static(publicPath));
app.set("views",viewPath);
hbs.registerPartials(partialPath);



app.get('/',(req,res) => {
    res.render("index",{title:"Weather App"});
});

app.get('/weather',(req,res) => {

    if(!req.query.address){
        return res.send("address is required");
    }

    weatherData(req.query.address,(error,data) => {
        if(error){
            return res.send(error);
        }
        res.send(data);
    });
}); 

app.use((req,res) => {
    res.render("404",{title:"page not found!",message: "Oops! The page you're looking for doesn't exist."});
});

app.listen(3000,() => {
    console.log(`server is running on http://localhost:3000`);
});
