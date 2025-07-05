const request = require('request')

const openWeatherMap = {
    BASE_URL:"https://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY:"c56d7751783a7d9a2b1d38beb3bfee96",
}

const weatherData = (address,callback) => {

    const url = 
    openWeatherMap.BASE_URL +
    encodeURIComponent(address) +
    "&APPID="+
    openWeatherMap.SECRET_KEY;


    request({url ,json:true},(err,data) => {
        if(err){
            callback("Unable to fetch data , Please try again..." + err,null);
        }else if(data.body.cod !== 200){
            callback("City not found. Please enter a valid city name:")
        }else{
            callback(null,data.body);
        }
    })
}

module.exports = weatherData;