require.config({
    paths: {
        jquery: "../Scripts/jquery-2.0.3",
        knockout: "../Scripts/knockout-3.0.0",
        weather: "modules/weather"
    }
});

require(["jquery", "knockout", "weather"], function ($, ko, weather) {
    
    function app() {
        return {
            city: weather.city,
            forecast: weather.forecast,
            isLoading: weather.isLoading,
            getForecast: function() {
                weather.getForecast();
            }
        };
    }

    $(document).ready(function() {
        ko.applyBindings(new app());
    });

});