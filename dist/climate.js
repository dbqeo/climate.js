'use strict';Object.defineProperty(exports,'__esModule',{value:!0}),exports.initClimate=initClimate,exports.getWeather=getWeather,exports.setTheme=setTheme,exports.getLatLong=getLatLong,exports.convertFromKelvin=convertFromKelvin,exports.getCurrentLocation=getCurrentLocation;function initClimate(a){if(a.userLocation)if(a.useIP){if(!a.ipAPIKey)throw new Error('useIP is true, but no ipinfo.io API key was provided!');getLatLong(a).then((b)=>{getWeather(b,a).then((b)=>{setTheme(b,a)})}),0<a.interval&&setInterval(()=>{getLatLong(a).then((b)=>{getWeather(b,a).then((b)=>{setTheme(b,a)})})},a.interval)}else navigator&&navigator.geolocation?navigator.geolocation.getCurrentPosition((b)=>{getWeather(b,a).then((b)=>{setTheme(b,a)}),0<a.interval&&setInterval(()=>{getWeather(b,a).then((b)=>{setTheme(b,a)})},a.interval)}):(console.warn('Navigator not found, falling back to default location! Are you running this in a browser?'),a.userLocation=!1);a.userLocation||(!a.location&&(a.location=DEFAULTS.location),getWeather(a.location,a).then((b)=>{setTheme(b,a)}),0<a.interval&&setInterval(()=>{getWeather(position,a).then((b)=>{setTheme(b,a)})},a.interval))}async function getWeather(a,b){if(!b.weatherAPIKey)throw new Error('You must set a valid `weatherAPIKey` in `initClimate()`!');let c=a.coords?await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${a.coords.latitude}&lon=${a.coords.longitude}&appid=${b.weatherAPIKey}`):await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(b.location)}&appid=${b.weatherAPIKey}`);const d=await c.json();return d}async function setTheme(a,b){let c;try{c=await(await fetch(b.theme)).json()}catch(a){console.error('climate.json is missing or at the wrong location!')}if(!c.use)throw new Error('`use` must be defined in climate.json!');let d=b.mode;d||(d=DEFAULTS.mode);let e=c.temperature.enabled?c.temperature[a.main[c.use.temperature]]:c.weather[a.weather[0][c.use.weather]];if('color'===d||'all'===d){for(let a in e){const b=document.getElementsByClassName('climate-'+a),c=document.getElementsByClassName('climate-'+a+'-background');for(let c of b)c.style.color=e[a];for(let b of c)b.style['background-color']=e[a]}return!0}if('toggle'===d||'all'===d){const a=document.getElementsByClassName('climate-toggle');console.log(a);for(let b of a)console.log(e),b.style.display=b.classList.contains('climate-'+e)?'inherit':'none';return!0}throw new Error('mode not recognized! Valid modes: color, toggle')}async function getLatLong(a){const b=await(await fetch(`https://ipinfo.io/json?token=${a.ipAPIKey}`)).json(),c=(''+b.loc).split(','),d={coords:{latitude:c[0],longitude:c[1]}};return d}function convertFromKelvin(a,b){if('celsius'===a.toLowerCase())return b-273.15;if('fahrenheit'===a.toLowerCase())return 9*(b-273.15)/5+32;throw new Error('resultUnit must be celsius or fahrenheit!')}async function getCurrentLocation(a){if(a.userLocation)return a.useIP?await getLatLong(a):await new Promise((a)=>{navigator.geolocation.getCurrentPosition(a)});else{let b=await(await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(a.location)}&appid=${a.weatherAPIKey}`)).json();return{coords:{latitude:b.coord.lat,longitude:b.coord.lon}}}}const DEFAULTS={location:'San Francisco',mode:'all'};
