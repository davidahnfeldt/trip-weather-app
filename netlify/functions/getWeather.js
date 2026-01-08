export async function handler(event) {
    const { lat, lon } = event.queryStringParameters;
  
    if (!lat || !lon) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing lat or lon" }),
      };
    }
  
    const apiKey = process.env.OPENWEATHER_API_KEY;
  
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing OpenWeather API key" }),
      };
    }
  
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Weather fetch failed" }),
      };
    }
  }
  
