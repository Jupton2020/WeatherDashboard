$(document).ready(function(){ 
    $("#submitCity").click(function(){
        return getWeather();
    });
    
});
function getWeather(){
    var city = $("#city").val();

    if (city != '') {

        $.ajax({

            url:'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=metric" +
            "&APPID=23302ddb187391ead663cc6c36ea9130",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                 var results = showResults(data)
                 console.log(data)

                 $('#showWeather').html(results);
                 $('#city').val('');

            }
        });
        
    }else{
        $('#error2').html("<div>City field cannot be empty</div>");
    }
}
function showResults(data) {
    return `<p> Temperature: `+data.main.temp+` &deg;F</p>`
}