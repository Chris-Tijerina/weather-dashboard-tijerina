# Weather Dashboard - Tijerina
a weather dashboard using One Call API

### Github Link:https://github.com/Chris-Tijerina/weather-dashboard-tijerina

### Deployed Page Link:https://chris-tijerina.github.io/weather-dashboard-tijerina/

### Description
build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

### User Story
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly


### Acceptance Criteria
> Given a weather dashboard with form inputs, when I search for a city, then I am presented with current and future conditions for that city and that city is added to the search history
> When I view current weather conditions for that city, then I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index.

The conditions were pulled using the OpenWeather One Call API. I used a ```fetch``` that passed in a variable for the name of the city that would get pulled from the search box. There was also a ```catch``` to make sure to inform them if the API call wasn't successful. I had to define the parameters of what I deemed a success, because the usual ```.ok``` wouldn't have worked, as it doesn't actually count a 404 or other errors as a fail. I also discovered that I would have to do an additional API call using the latitude and longitude pulled from the first API call, as the information for the area is not as detailed in the city name call. This was the only way I could get the 5 day forecast data and UV index. 

> When I view the UV index, then I am presented with a color that indicates whether the conditions are favorable, moderate, or severe. 

This part was interesting, as I had to look up what the generally accepted ranges for the UV index were for different notations. I went with four different levels, from low to very high. The colors were assigned dynamically using a series of ```if``` and ```else if``` statements based on the UV index for the day. 


> When I view future weather conditions for that city, then I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity. 

I created some static boxes in the HTML to contain all the information, but dynamically generated the information to fill those boxes based on the search and API information.

> When I click on a city in the search history, then I am again presented with current and future conditions for that city. 

I used a ```for``` loop to take the information in the local storage array and create a button that would have the name of the city that was searched in it. This one was interesting because the for loop parameters were different than usual. when set up traditionally (```var i = 0; i < cityHistory.Length; i++```) the buttons were being created after each search from the bottom up, which looked off. So I had to rearrange the parameters to (```var i = cityHistory.length - 1; i >= 0; i--```) which felt somewhat odd, but put the most recent search at the top like I wanted. 

### Images
> This image shows the deployed page with a search having been done and with the search history visible. 

![screenshot](https://user-images.githubusercontent.com/90019024/145759496-1e3253d3-e2be-4bbf-bdbd-28601a221639.JPG)
