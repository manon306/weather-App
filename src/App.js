// App.jsx
import React from "react";
import "./App.css";
import { useEffect, useState } from "react";

// Material-UI imports
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircularProgress from '@mui/material/CircularProgress';

// External libraries
import { useTranslation } from 'react-i18next';
import axios from "axios";
import moment from "moment/moment";
import "moment/min/locales";

function App() {
  const { t, i18n } = useTranslation();
  const [weather, setWeather] = useState({
    temp: null,
    description: "",
    min: null,
    max: null,
    icon: null,
    humidity: null,
    pressure: null,
    windSpeed: null,
    sunrise: null,
    sunset: null,
    feelsLike: null,
    visibility: null
  });
  const [locale, setLocale] = useState("ar");
  const [datetime, setDatetime] = useState("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Cairo");

  useEffect(() => {
    setDatetime(moment().format('MMMM Do YYYY, h:mm:ss a'));
    i18n.changeLanguage(locale);
    const controller = new AbortController();

    axios
      .get(
        'https://api.openweathermap.org/data/2.5/weather?lat=30.033333&lon=31.233334&appid=bc37e17c9b846169b024d9baad98cf8e',
        { signal: controller.signal }
      )
      .then(function (response) {
        const data = response.data;
        setWeather({
          temp: Math.round(data.main.temp - 272.15),
          description: data.weather[0].description,
          min: Math.round(data.main.temp_min - 272.15),
          max: Math.round(data.main.temp_max - 272.15),
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: (data.wind.speed * 3.6).toFixed(1),
          sunrise: moment.unix(data.sys.sunrise).format('h:mm A'),
          sunset: moment.unix(data.sys.sunset).format('h:mm A'),
          feelsLike: Math.round(data.main.feels_like - 272.15),
          visibility: (data.visibility / 1000).toFixed(1)
        });
        setLoading(false);
      })
      .catch(function (error) {
        if (!axios.isCancel(error)) {
          console.log(error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [locale]);

  function handleLagClick() {
    const newLocale = locale === "ar" ? "en" : "ar";
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    moment.locale(newLocale);
    setDatetime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }

  function handleRefresh() {
    window.location.reload();
  }

  return (
    <div className="App">
      <Container maxWidth="sm">
        <div style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: "column"
        }}>
          {/* CARD */}
          <div style={{
            background: "rgba(28 52 91 /36%)",
            color: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
            width: "100%"
          }} dir={locale === "ar" ? "rtl" : "ltr"}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon style={{ marginRight: '5px' }} />
                <Typography variant="h4" style={{ fontWeight: "600" }}>
                  {location}
                </Typography>
              </div>
              <RefreshIcon style={{ cursor: 'pointer' }} onClick={handleRefresh} />
            </div>
            
            <Typography variant="h6" style={{ margin: '5px 0' }}>
              {datetime}
            </Typography>
            
            <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <CircularProgress style={{ color: 'white' }} />
              </div>
            ) : (
              <>
                {/* Main Weather Info */}
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: 'center' }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Typography variant="h1" style={{ textAlign: "right" }} >
                        {weather.temp}°
                      </Typography>
                      <img src={weather.icon} alt={weather.description} />
                    </div>
                    
                    <Typography variant="h6" style={{ textTransform: 'capitalize' }}>
                      {weather.description}
                    </Typography>
                    
                    <Typography variant="body1">
                      {t("feels_like")}: {weather.feelsLike}°
                    </Typography>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h5>{t("min")}: {weather.min}°</h5>
                      <h5 style={{ margin: "0px 5px" }}>|</h5>
                      <h5>{t("max")}: {weather.max}°</h5>
                    </div>
                  </div>
                  
                  <CloudIcon style={{ fontSize: "150px", color: "white" }} />
                </div>

                {/* Weather Details */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginTop: '20px'
                }}>
                  {/* Humidity */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <OpacityIcon style={{ marginRight: '5px' }} />
                    <Typography>{weather.humidity}%</Typography>
                    <Typography style={{ margin: '0 5px' }}>{t("humidity")}</Typography>
                  </div>
                  
                  {/* Wind Speed */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <AirIcon style={{ marginRight: '5px' }} />
                    <Typography>{weather.windSpeed} km/h</Typography>
                    <Typography style={{ margin: '0 5px' }}>{t("wind_speed")}</Typography>
                  </div>
                  
                  {/* Pressure */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CompressIcon style={{ marginRight: '5px' }} />
                    <Typography>{weather.pressure} hPa</Typography>
                    <Typography style={{ margin: '0 5px' }}>{t("pressure")}</Typography>
                  </div>
                  
                  {/* Visibility */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <WbSunnyIcon style={{ marginRight: '5px' }} />
                    <Typography>{weather.visibility} km</Typography>
                    <Typography style={{ margin: '0 5px' }}>{t("visibility")}</Typography>
                  </div>
                  
                  {/* Sunrise */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <WbSunnyIcon style={{ marginRight: '5px', color: '#FFD700' }} />
                    <Typography>{weather.sunrise}</Typography>
                    <Typography style={{ margin: '0 5px' }}>{t("sunrise")}</Typography>
                  </div>
                  
                  {/* Sunset */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <WbSunnyIcon style={{ marginRight: '5px', color: '#FF8C00' }} />
                    <Typography>{weather.sunset}</Typography>
                    <Typography style={{ margin: '0 5px' }}>{t("sunset")}</Typography>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Language Button */}
          <div style={{ width: "100%", display: "flex", justifyContent: "end", marginTop: "20px" }}>
            <Button variant="text" style={{ color: "white" }} onClick={handleLagClick}>
              {locale === "en" ? "Arabic" : "الانجليزية"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;