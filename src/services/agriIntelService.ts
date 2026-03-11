
// Mock service - Google GenAI disabled
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AgriHealthData {
  healthScore: number;
  dominantPests: string[];
  pestRisk: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico';
  recommendations: string[];
  sources: { title: string; uri: string }[];
}

export interface DailyIntel {
  date: string;
  temp: number;
  rain: number;
  pestRisk: number;
  ndvi: number;
  recommendation: string;
}

// Fix: Adding missing YearlyIntel interface for Geointeligencia component
export interface YearlyIntel {
  year: number;
  ndvi: number;
  rain: number;
  status: string;
}

export const fetchAgriHealthInsights = async (province: string, municipality?: string, commune?: string): Promise<AgriHealthData> => {
  // Mock implementation - simulates agricultural health data
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const location = `${commune ? commune + ' em ' : ''}${municipality ? municipality + ', ' : ''}${province}`;
  
  // Generate realistic mock data based on location
  const healthScore = 65 + Math.floor(Math.random() * 25); // 65-90
  const risks = ['Baixo', 'Moderado', 'Alto', 'Crítico'] as const;
  const pestRisk = risks[Math.floor(Math.random() * risks.length)];
  
  const pestOptions = [
    ['Lagarta do Funil', 'Pulgão'],
    ['Gafanhoto', 'Broca do Caule'],
    ['Mosca Branca', 'Ácaros'],
    ['Trips', 'Cochonilhas']
  ];
  
  const dominantPests = pestOptions[Math.floor(Math.random() * pestOptions.length)];
  
  return {
    healthScore,
    dominantPests,
    pestRisk,
    recommendations: [
      "Aumentar vigilância biótica matinal.",
      "Otimizar janelas de irrigação conforme o stress hídrico local.",
      "Considerar aplicação de controle biológico."
    ],
    sources: [
      { title: 'Instituto de Investigação Agronómica de Angola', uri: 'https://www.iia.gov.ao' },
      { title: `Fitossanidade em ${location}`, uri: 'https://fao.org' }
    ],
  };
};

export const fetch7DayIntel = async (location: string, mode: 'history' | 'forecast'): Promise<DailyIntel[]> => {
  // Simulação de dados temporais baseada na localização para a Geointeligência
  const days = mode === 'history' ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] : ['Amanhã', '+2 Dias', '+3 Dias', '+4 Dias', '+5 Dias', '+6 Dias', '+7 Dias'];
  
  return days.map((day, i) => ({
    date: day,
    temp: 22 + Math.floor(Math.random() * 8),
    rain: Math.floor(Math.random() * 15),
    pestRisk: 10 + Math.floor(Math.random() * 50),
    ndvi: 0.6 + (Math.random() * 0.3),
    recommendation: i % 3 === 0 ? "Aplicar Reforço Orgânico" : "Monitoramento Padrão"
  }));
};

// Fix: Adding missing fetchMultiYearIntel function for Geointeligencia component
export const fetchMultiYearIntel = async (location: string): Promise<YearlyIntel[]> => {
  // Simulação de dados anuais históricos baseada na localização
  const years = [2020, 2021, 2022, 2023, 2024];
  
  return years.map((year) => ({
    year,
    ndvi: 0.65 + (Math.random() * 0.2),
    rain: 600 + Math.floor(Math.random() * 600),
    status: Math.random() > 0.6 ? 'Excelente' : 'Estável'
  }));
};
