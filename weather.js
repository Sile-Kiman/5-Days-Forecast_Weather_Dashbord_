// var searchHistoryJSON = localStorage.getItem("City-searched");
// var searchHistory = searchHistoryJSON ? JSON.parse(searchHistoryJSON) : { cities: [] };

// var last = searchHistory.cities.slice(-1);
// displayHistory(searchHistory.cities)
// console.log(searchHistory.cities)
// displaySearch(last);


//Declare some gobal variables
var currentWeather = document.querySelector(".currentForecast");
var dailyContainer =document.querySelector(".col-2");
var h5Element = document.querySelector("#days");
 
var searchbtn = document.querySelector("button");
var searchVal = "";

 
//add Event Listner to grab the search result on click
searchbtn.addEventListener("click", function (event) {
    event.preventDefault();

    var parentEl = this.parentElement;
    searchVal = parentEl.querySelector("#city").value;


    //This if condition will display an error  message if the search field is empty and save the city to the local storage
    if (searchVal === "") {
        $('#errorMsg').attr("style", "color:red")
        $('#errorMsg').text("Please enter a valid City name");
    } else {
        $('#errorMsg').empty();

        // searchHistory.cities.push(searchVal);
        // localStorage.setItem('City-searched', JSON.stringify(searchHistory));


    }
    //clearing containers after every append. 
    currentWeather.innerHTML = "";
    dailyContainer.innerHTML="";
    h5Element.innerHTML="";
    //This function also performs the function that dispalay all the weather conditions
    retrieveCurrentWeatherAPI(searchVal)
     
    //calling day1 forecast
    FiveDaysForecastAPI(searchVal)

});


//function retrieve data from the weather API and populate the Temp and wheather conditions on the page.  
function retrieveCurrentWeatherAPI(searchVal) {

    //Set the date 
    var date = new Date();
    date = moment().format('L');
    var currentTime = moment().format("H");

    // This is my API key
    var APIKey = "eeab2a767f4b39347cacd521da7d158c";

    // Here I'm building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal + "&appid=" + APIKey;


    // Here I'm running   AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // Im storing all of the retrieved data inside of an object called "response"
        .then(function (response) {

            console.log("response: ", response)
            //set weather condition variable
            var weather;
            var weatherCondition = response.weather[0].main;
            //create an image element to append the icons
            var image = $("<img>");

            var imageUrl = "http://openweathermap.org/img/wn/13d@2x.png";

            //Set conditional statement to display the weather icon during snow time 
            if (weatherCondition !== "Snow") {

                //Set conditional statement to display the weather icon during day time 
                if (currentTime <= 17) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02d@2x.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10d@2x.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01d@2x.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50d@2x.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11d@2x.png";
                            break;

                    }
                } else if (currentTime >= 18) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02n@2x.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10n@2x.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01n@2x.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50n@2x.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11n@2x.png";
                            break;
                    }

                }
                image.attr("src", imageUrl);
            }

            //Convert the temparature into F
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            //truncate it to 2 digits
            var temparature = tempF.toFixed(2);
            //Set humidity variable and content
            var humidity = response.main.humidity
            //Set wind variable and content
            var wind = response.wind.speed
            //Set Longitute of a searched city
            var Long = response.coord.lon
            console.log("long: ", Long);
            //Set Latitude of a searched city
            var Lat = response.coord.lat;
            console.log("lat: ", Lat);


            // Set  css attribute for the div that will hold all the appended  weather items   
            $(".currentForecast").css("border", "0.5px solid gray ");
            $(".currentForecast").css("margin", "5px");
            $(".currentForecast").css("padding", "5px");
            $(".currentForecast").css("border-radius", "5px");

            //display the City and date in h4 tag appended to the div container
            var cityEl = $("<h4>");
            cityEl.addClass("city");
            cityEl.attr("margin:10px")
            cityEl.text(searchVal + "(" + date + ")");
            cityEl.append(image)
            //append all the city weather information to the div main container
            $(".currentForecast").append(cityEl)

            //display the Temparature in a li  tag appended to the div container
            var temp = $("<p>");
            temp.addClass("tempature");
            temp.text("Temparature: " + temparature + " °F");
            //append all the city weather information to the div main container
            $(".currentForecast").append(temp)

            //display the Humidity in an li tag appended to the div container
            var Humidity = $("<p>");
            Humidity.addClass("humidity");
            Humidity.text("Humidity: " + humidity + " %")
            //append all the city weather information to the div main container
            $(".currentForecast").append(Humidity)

            //display the Wind in an li tag appended to the div container
            var Wind = $("<p>");
            Wind.addClass("humidity");
            Wind.text("Wind-Speed:  " + wind + " mph")
            //append all the city weather information to the div main container
            $(".currentForecast").append(Wind)

            retrieveUVInexAPI(Lat, Long)

        })

}


//function retrieve UV-Index data from the weather API and populate on the page.  
function retrieveUVInexAPI(Lat, Long) {

    // This is my API key
    var APIKey = "eeab2a767f4b39347cacd521da7d158c";

    // Here I'm building the URL we need to query the database
    var queryURL1 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + Lat + "&lon=" + Long + "&appid=" + APIKey;

    // Here I'm running   AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL1,
        method: "GET"
    })
        // store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            var result = response;

            var IndexValue = result.value;
            //display the UV-Index in an p tag appended to the div container
            var Index = $("<p>");
            Index.addClass("uv-index");
            Index.text(IndexValue);

            //prepend all the city weather information to the div main container
            $(".currentForecast").append("UV Index:  ", Index);
             
        })
}

//function retrieve UV-Index data from the weather API and populate on the page.  
function FiveDaysForecastAPI(searchVal) {

    var date = new Date();
    date = moment().format('L');
    var currentTime = moment().format("H");
    // This is my API key
    var APIKey = "eeab2a767f4b39347cacd521da7d158c";
      
    // Here I'm building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchVal + ",us" + "&appid=" + APIKey;



    // Here I'm running   AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // Im storing all of the retrieved data inside of an object called "response"
        .then(function (response) {
            console.log("5 day: ", response)

            //set weather condition variable
            var weatherCondition = response.list[3].weather[0].main;

            //create an image element to append the icons
            var image = $("<img>");


            var imageUrl = "http://openweathermap.org/img/wn/13d.png";

            //Set conditional statement to display the weather icon during snow time 
            if (weatherCondition !== "Snow") {

                //Set conditional statement to display the weather icon during day time 
                if (currentTime <= 17) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02d.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10d.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01d.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50d.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11d.png";
                            break;

                    }
                } else if (currentTime >= 18) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02n.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10n.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01n.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50n.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11n.png";
                            break;
                    }

                }
                image.attr("src", imageUrl);
            }

            // //Convert the temparature into F
            var tempF = (response.list[3].main.temp - 273.15) * 1.80 + 32;
            //truncate it to 2 digits
            var temparature = tempF.toFixed(2);
            //Set humidity variable and content
            var humidity = response.list[3].main.humidity;

            //Set date variable and content 
            var Date1 = response.list[3].dt_txt
            date1 = moment(Date1).format('L');
            
            //Create a new Div and set its attribute to append all the weather items   
            ///var dailyHeader = $(".daily");
        
            //create another div to hold all the 5 days forcast
            //var daysEl = $("#day1");
            $("#day1").attr("style", "color: red")
            $("#day1").attr("style", "background: royalblue")
            $("#day1").css("border", "0.5px solid gray ");
            $("#day1").css("margin", "5px");
            $("#day1").css("padding", "5px");
            $("#day1").css("border-radius", "5px")


            //display the City and date in h5 tag appended to the div container
            //var h5El = $("<h5>");
            //h5El.addClass("days");
            //h5El.attr("margin", "10px")
            $("#days").text("5 Days Forecast: ");
            //$(".five-days").prepend(h5El);

            // //display the day 1 in a h6  tag appended to the div col-2
            var d1El = $("<h6>");
            d1El.text(date1);
            $("#day1").append(d1El);

            // //display the icon in an p tag appended to the div container
            var icon = $("<p>");
            icon.append(image);
            $("#day1").append(icon);

            //display the Temparature in a p  tag appended to the div col-2
            var temp = $("<p>");
            temp.text("Temp: " + temparature + " °F");
            $("#day1").append(temp);

            //display the Humidity in an p tag appended to the div container
            var Humidity = $("<p>");
            Humidity.text("Humidity: " + humidity + " %")
            $("#day1").append(Humidity);
      

        })
}