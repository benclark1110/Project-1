$(document).ready(function(){

    $(".mainCards").hide();

    //on submit event listener
    $("#submit").on("click", function(event){
        //to stop page from reloading on 'submit' click
        event.preventDefault();
        console.log("working");
        //to clear out food/weather info if anything was present before
        $(".foodInfo").empty();
        //getting user input
        cityName = $(".cityName").val().trim();
        console.log(cityName);
    
        //1st ajax call to Meta Weather to get WOEID for that City
        var weatherQueryURL = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=" + cityName;

        $.ajax({
            url: weatherQueryURL,
            method: "GET",
            headers: {
                "accept": "application/json",
                "x-requested-with": "xmlhttprequest",
                "Access-Control-Allow-Origin":"*"
            }
        }).then(function(weatherResponse) {
            console.log(weatherResponse);
            cityWoeid = weatherResponse[0].woeid;
            console.log(cityWoeid);
        //2nd ajax call to Meta Weather to use the WOEID for the selected city
        }).then(function(){
            var weatherQueryURL2 = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/" + cityWoeid;

            $.ajax({
                url: weatherQueryURL2,
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "x-requested-with": "xmlhttprequest",
                    "Access-Control-Allow-Origin":"*"
                }
            //after getting the WOEID from first call, appeding the appropriate imformation to the DOM
            }).then(function(weatherResponse2) {
                console.log(weatherResponse2);
                console.log(weatherResponse2.consolidated_weather[0].the_temp);
                var $hr = $("<hr>");
                $(".weatherInfo").prepend($hr);
                $("#city").text("City: " + cityName)
                $("#temp").text("Temperature (F): " + (weatherResponse2.consolidated_weather[0].the_temp * 1.8 + 32).toFixed(2));
                $("#humidity").text("Humidity: " + weatherResponse2.consolidated_weather[0].humidity);
                $("#windSpeed").text("Wind Speed (mph): " + (weatherResponse2.consolidated_weather[0].wind_speed).toFixed(2));
                //changing the image displayed based on the responst from weather API
                if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "sn") {
                    weatherState = "sn";
                    altValue = "snow";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "sl") {
                    weatherState = "sl";
                    altValue = "sleet";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "h") {
                    weatherState = "h";
                    altValue = "hail";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "t") {
                    weatherState = "t";
                    altValue = "thunderstorm";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "hr") {
                    weatherState = "hr";
                    altValue = "heavy rain";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "lr") {
                    weatherState = "lr";
                    altValue = "light rain";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "s") {
                    weatherState = "s";
                    altValue = "showers";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "hc") {
                    weatherState = "hc";
                    altValue = "heavy cloud";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "lc") {
                    weatherState = "lc";
                    altValue = "light cloud";
                } else {
                    weatherState = "c";
                    altValue = "clear";
                };
                $("#weatherPic").attr("src", "https://www.metaweather.com/static/img/weather/" + weatherState + ".svg");
                $("#weatherPic").attr("alt", altValue);
        });
    });

        //Ajax call to yelp using the input city
        var foodQueryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurants&location=" + cityName + "&limit=10";
        var apiKey = "tM-UqkhLSQAbJwmpKiTeXGPAagl3_g8ZSo1kpVtGKCbvuT1JLc9RIDJ9G425PSBg_90EakpuaP0p-9fUBWjoX257R6vRewtfaRzJWwoHtUDsxPRga7k0-ArIHPexXHYx" 

        $.ajax({
            url: foodQueryURL,
            method: "GET",
            headers: {
                "accept": "application/json",
                "x-requested-with": "xmlhttprequest",
                "Access-Control-Allow-Origin":"*",
                "Authorization": `Bearer ${apiKey}`
            }
        }).then(function(foodResponse) {
            console.log(foodResponse);
            for ( i = 0; i < foodResponse.businesses.length; i++) {
                //dynamically creating food response items
                var foodDiv = $("<div>");
                var $p = $("<h6>").text(foodResponse.businesses[i].name);
                var $p2 = $("<p>").text(foodResponse.businesses[i].categories[0].title);
                var $p3 = $("<p>").text(foodResponse.businesses[i].rating + " Stars");
                var $img = $("<img>").attr("src", foodResponse.businesses[i].image_url).attr("height", "104");
                var $hr = $("<hr>");
                foodDiv.addClass("foodInfo");
                foodDiv.append($hr, $img, $p, $p2, $p3 );
                $("#foodGoesHere").prepend(foodDiv);
            }
            $(".mainCards").show();
        });
       
    });
});