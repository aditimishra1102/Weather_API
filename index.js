// const API_KEY="803a643a8fa0e43c967b325822580045";
// async function fetchWeatherDetails(){
//     try{
//          let city="goa";
//          const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//          const data= await response.json();
//          console.log("Weather data:-> ",data);

//          let newPara=document.createElement('p');
//          newPara.textContent=`${data?.main?.temp.toFixed(2)} degree C`;

//         document.body.appendChild(newPara);
//         }
//     catch(err){

//     }
// }
const userTab = document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");

let currentTab = userTab;
const API_key="803a643a8fa0e43c967b325822580045";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
          if(clickedTab!=currentTab)
           {
                 currentTab.classList.remove("current-tab");
                 currentTab=clickedTab;
                 currentTab.classList.add("current-tab");
           }
            // if i was on userinfo tab
          if(!searchForm.classList.contains("active"))
            {      // if search tab was not visible, userinfo selected
             userInfoContainer.classList.remove("active");     // remove active from userinfotab
             grantAccessContainer.classList.remove("active");    // remove active from 
             searchForm.classList.add("active");        // search tab given active
            }
          else{
               // if i am on search tab
              searchForm.classList.remove("active");
              userInfoContainer.classList.remove("active");
             // to obtain the coordinates stored in the sessions(program) storage
             // since we have to show weather thats why this line is needed.
             getfromSessionStorage();
             }
        }
userTab.addEventListener('click',()=>{
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
        // event listnener needed to ask for location, position/ coordinates from user
        // if found, store them in the session storage.
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
   
    const {lat,lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make inner container visible
    loadingScreen.classList.add("active");

    try{
        const response= await fetch(  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
          loadingScreen.classList.remove("active");
    }
}
function renderWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon= document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon= document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity= document.querySelector("[data-humidity]");
    const cloudiness=  document.querySelector("[data-cloudiness]");
 
    // fetch values from weather info object and put into elements
    // optional chaining operator: easier to access particular json properties
    // if value not present, the optional chaining operator gives errror.
 
    // use json formatter after accessing the api key weather in chrome, 
    // remember generating the api key.
 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText= `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
 }
 function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        console.log("No geolocation support");
    }
}
function showPosition(position){
    
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton= document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

const searchInput= document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
     return;
    else
     fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
    const data= await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);

    }
    catch(err){

    }
}
