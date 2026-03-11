
// Mock service - Google GenAI disabled
// import { GoogleGenAI, Type } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface WeatherData {
  temp: number;
  humidity: number;
  conditions: string;
  windSpeed: number;
  precipitation: number;
  sources: { title: string; uri: string }[];
}

export const fetchProvinceWeather = async (province: string, municipality?: string, commune?: string): Promise<WeatherData> => {
  // Mock implementation - simulates weather data
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const locationStr = `${commune ? 'Comuna de ' + commune + ', ' : ''}${municipality ? 'Município de ' + municipality + ', ' : ''}${province}, Angola`;
  
  // Generate random but realistic weather data
  const temp = 20 + Math.floor(Math.random() * 15); // 20-35°C
  const humidity = 40 + Math.floor(Math.random() * 40); // 40-80%
  const windSpeed = 5 + Math.floor(Math.random() * 20); // 5-25 km/h
  const precipitation = Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0;
  
  const conditions = precipitation > 0 ? 'Chuva Moderada' : 
                    humidity > 70 ? 'Nublado' : 'Céu Limpo';

  return {
    temp,
    humidity,
    conditions,
    windSpeed,
    precipitation,
    sources: [
      { title: 'Instituto Nacional de Meteorologia de Angola', uri: 'https://www.inamet.gov.ao' },
      { title: `Previsão para ${locationStr}`, uri: 'https://weather.com' }
    ],
  };
};
