// Variable pulled from the user input
var citySearch;
var lat;
var lon;

// Populating the search history with buttons
var previousCities = function() {
    if (localStorage.getItem("searchHistory")) {
    var cityHistory = JSON.parse(localStorage.getItem("searchHistory"))
    console.log(cityHistory)
    $("#previous-searches").empty();
        for (var i = cityHistory.length - 1; i >= 0; i--) {
            var historyButton = $("<button type='submit'>")
            .addClass("previousBtn btn btn-secondary col-12 mb-3")
            .text(cityHistory[i])
            .appendTo("#previous-searches")
            .bind("click", historyButtonClick)
        }
    }

}

// gather form input data on "click" of the Search Button
$(".searchBtn").on("click", function () {
    $(".error").text("")
    citySearch = $("#citySearch").val()
    getCityData()
})
// search based off the search history buttons
var historyButtonClick = function() {
        $(".error").text("")
        citySearch = $(this).text()
        console.log(citySearch)
        getCityData()
}

// save the names of any searched cities to an array
var setSearchHistory = function () {

    var searchHistory = new Array();

    // Check local storage array for any previous data
    if (localStorage.getItem("searchHistory")) {
        var storageSearchHistory = localStorage.getItem("searchHistory")
        searchHistory = searchHistory.concat(JSON.parse(storageSearchHistory))
    }
    // cut off the list at some length
    if (searchHistory.length >= 8) {
        searchHistory.shift()
    }
    // add the current value to the array
    searchHistory.push(citySearch)

    // save the array to the local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
}




// call API return data for city
var getCityData = function () {
    var cityName = citySearch.trim()
    console.log(cityName)
    var fetchData = fetch("http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=7600d4fdd9952dcc11a35941ea3373d6")

        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.Statustext);
            }
        })

        .then(data => {
            console.log("success", data);
            setSearchHistory();
            var date = new Date();
            var dateToday = date.toLocaleDateString(
                'en-US', {
                year: "numeric",
                month: "numeric",
                day: "numeric"
            })
            console.log(data.weather[0].icon)
            var weatherIcon = $("<img id = 'city-weather-icon' src = 'http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' width='50px' height='50px'>")
            
            // set text and information for the weather info box 
            $(".city-name").text(data.name + " (" + dateToday + ") ");
            $("#city-weather-icon").replaceWith(weatherIcon);
            $(".city-temp").text("Temperature: " + data.main.temp + "\xB0F");
            $(".city-wind-speed").text("Wind Speed: " + data.wind.speed + " MPH")
            $(".city-hum").text("Humidity: " + data.main.humidity + "%");
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            //run more detailed API call with lat-lon 
            var fetchDataAgain = ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7600d4fdd9952dcc11a35941ea3373d6")
            fetch(fetchDataAgain)
                .then(response => {
                    if (response.status >= 200 && response.status <= 299) {
                        return response.json();
                    } else {
                        throw Error(response.Statustext);
                    }
                })

                .then(data => {
                    console.log("success", data);
                    $(".city-uv").text("UV Index: ")

                    var uvIndex = data.daily[0].uvi
                    var indexText = $("<p id ='city-uv-text'>").text(uvIndex)

                    //create UV index with color coding 
                    console.log(uvIndex)
                    if (uvIndex <= 2) {

                        indexText.addClass("bg-success bg-opacity-75 border border-dark border-1 p-1 rounded-pill")

                    } else if (uvIndex > 2 && uvIndex <= 5) {

                        indexText.addClass("bg-warning bg-opacity-50 border border-dark border-1 p-1 rounded-pill")

                    } else if (uvIndex >= 6 && uvIndex <= 7) {

                        indexText.addClass("bg-warning border border-dark border-1 p-1 rounded-pill")

                    } else if (uvIndex >= 8 && uvIndex <= 10) {

                        indexText.addClass("bg-danger bg-opacity-75 border border-dark border-1 p-1 rounded-pill")

                    } 
                    $("#city-uv-text").replaceWith(indexText)

                    dailyWeather(data)
                    previousCities()
                })
        })
        .catch(error => {
            //TODO create alert for error message or paragraph in search div
            $(".error").text("city not found, please check the spelling and try again")
        });
}

// create the 5 day future forecast
var dailyWeather = function(data) {
    var dayElem = $(".daily")
    var dailyDate = new Date();

    //loop through each day and fill information into static boxes 
    for (var i = 0; i < dayElem.length; i++) {
        let dateIndex = i+1
        dailyDate.setDate(dailyDate.getDate()+1)
        
        var dailyDateText = dailyDate.toLocaleDateString(
            'en-US', {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        })

        var dailyIcon = $("<img class = 'daily-icon' src = 'http://openweathermap.org/img/wn/" + data.daily[dateIndex].weather[0].icon + "@2x.png' width='50px' height='50px'>")

        $(dayElem[i]).children(".daily-date").text(dailyDateText)
        $(dayElem[i]).children(".daily-icon").replaceWith(dailyIcon)
        $(dayElem[i]).children(".daily-temp").text("Temp: " + data.daily[dateIndex].temp.day + "\xB0F")
        $(dayElem[i]).children(".daily-wind").text("Wind: " + data.daily[dateIndex].wind_speed + " MPH")
        $(dayElem[i]).children(".daily-humidity").text("Humidity: " + data.daily[dateIndex].humidity + "%")
    }
}

// populate the search history list on page load
previousCities()