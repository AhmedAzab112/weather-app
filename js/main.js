const weather_icon = document.getElementById('weather_icon');
const weather_degree = document.getElementById('weather_degree');
const country_name = document.getElementById('country_name');
const weather_condation = document.getElementById('weather_condation');
const country_current_date = document.getElementById('country_current_date');
const country_current_day = document.getElementById('country_current_day');
const country_wind_kph = document.getElementById('country_wind_kph');
const country_wind_dir = document.getElementById('country_wind_dir');
const country_wind_uv = document.getElementById('country_wind_uv');

const country_two_day = document.getElementById('country_two_day');
const weather_two_icon = document.getElementById('weather_two_icon');
const weather_two_degree = document.getElementById('weather_two_degree');
const weather_two_small_degree = document.getElementById('weather_two_small_degree');
const weather_two_status = document.getElementById('weather_two_status');

const country_three_day = document.getElementById('country_three_day');
const weather_three_icon = document.getElementById('weather_three_icon');
const weather_three_degree = document.getElementById('weather_three_degree');
const weather_three_small_degree = document.getElementById('weather_three_small_degree');
const weather_three_status = document.getElementById('weather_three_status');


let dataCountry = {};

getAllData = async (searchKey) => {
    try {
        let APIData = await fetch('https://weatherapi-com.p.rapidapi.com/forecast.json?' + new URLSearchParams({
            q: searchKey,
            days:3
        }), {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '3959dad2edmsh3c547dd97c6f620p138566jsn76b3b22e7a9d',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
            },
        });
        dataCountry = await APIData.json();

        if (!dataCountry.error && APIData.status == 200) {
            handleView(dataCountry);
        } else
            return;
    } catch (err) {
        console.error(err);
    }
}


(() => {
    getAllData('cairo');
})();



getDataWithSearch = (search) => {
    if(search && search.length > 1){
        getAllData(search);
    } else {
        getAllData('cairo');
    }
}




handleView = ({ current: { condition: { icon, text }, temp_c, uv, wind_dir, wind_kph }, location: { name, localtime }, forecast}) => {
    let local_date = new Date(localtime);
    weather_icon.src = icon;
    weather_degree.innerHTML = temp_c + '<sup>o</sup>C';
    country_name.innerHTML = name;
    weather_condation.innerHTML = text;
    country_current_date.innerHTML = `${local_date.getDate()} ${generateMonth(local_date.getMonth())}`;
    // country_current_date.innerHTML = local_date.toLocaleDateString('en-us', {day:"numeric", month:"long"});
    country_current_day.innerHTML = local_date.toLocaleDateString('en-us', { weekday:"long" });
    country_wind_kph.innerHTML = wind_kph + 'km/h';
    country_wind_dir.innerHTML = generateWindDirection(wind_dir);
    country_wind_uv.innerHTML = uv + '%';


    // handle forecast for day two
    country_two_day.innerHTML = new Date(forecast.forecastday[1].date).toLocaleDateString('en-us', { weekday:"long" });
    weather_two_icon.src = forecast.forecastday[1].day.condition.icon;
    weather_two_degree.innerHTML = forecast.forecastday[1].day.maxtemp_c + '<sup>o</sup>C';
    weather_two_small_degree.innerHTML = forecast.forecastday[1].day.mintemp_c + '<sup>o</sup>C';
    weather_two_status.innerHTML = forecast.forecastday[1].day.condition.text;

    // handle forecast for day three
    country_three_day.innerHTML = new Date(forecast.forecastday[2].date).toLocaleDateString('en-us', { weekday:"long" });
    weather_three_icon.src = forecast.forecastday[2].day.condition.icon;
    weather_three_degree.innerHTML = forecast.forecastday[2].day.maxtemp_c + '<sup>o</sup>C';
    weather_three_small_degree.innerHTML = forecast.forecastday[2].day.mintemp_c + '<sup>o</sup>C';
    weather_three_status.innerHTML = forecast.forecastday[2].day.condition.text;
}




generateMonth = (monthNumber) => {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (monthNumber > 0 && monthNumber <= 12) {
        return month[monthNumber];
    }
}



generateWindDirection = (windAlias) => {
    let alias = windAlias.toUpperCase();
    let obj_dir = {
        'N': 'North',
        'NE': 'North, East',
        'NNE': 'North, East',
        'NW':'North, West',
        'NNW':'North, West',
        'S':'South',
        'SE': 'South, East',
        'SSE': 'South, East',
        'SW':'South, West',
        'SSW':'South, West',
        'E': 'East',
        'W':'West',
    }
    return obj_dir[alias] || alias;
}