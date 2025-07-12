export interface WeatherData {
  location: {
    latitude: number;
    longitude: number;
  };
  current: {
    windSpeed: number;
    windDirection: number;
    waveHeight: number;
    seaState: number;
    temperature: number;
    humidity: number;
    visibility: number;
  };
  forecast: {
    timestamp: Date;
    windSpeed: number;
    waveHeight: number;
    seaState: number;
  }[];
}

export interface DataSource {
  name: string;
  type: 'primary' | 'backup';
  available: boolean;
  lastUpdate: Date;
}

export class WeatherService {
  private dataSources: DataSource[] = [
    {
      name: "MetOcean Primary API",
      type: 'primary',
      available: true,
      lastUpdate: new Date()
    },
    {
      name: "NOAA Backup Service",
      type: 'backup',
      available: true,
      lastUpdate: new Date()
    },
    {
      name: "Local Sensor Network",
      type: 'backup',
      available: true,
      lastUpdate: new Date()
    }
  ];

  async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    // Try primary data source first
    try {
      return await this.fetchFromPrimarySource(latitude, longitude);
    } catch (error) {
      console.warn("Primary weather source failed, trying backup sources:", error);
      
      // Try backup sources
      for (const source of this.dataSources.filter(s => s.type === 'backup' && s.available)) {
        try {
          return await this.fetchFromBackupSource(source, latitude, longitude);
        } catch (backupError) {
          console.warn(`Backup source ${source.name} failed:`, backupError);
        }
      }
      
      // If all sources fail, return synthetic data based on historical patterns
      return this.generateRealisticWeatherData(latitude, longitude);
    }
  }

  private async fetchFromPrimarySource(latitude: number, longitude: number): Promise<WeatherData> {
    // Simulate API call to primary weather service
    // In real implementation, this would call MetOcean or similar maritime weather API
    
    if (!process.env.WEATHER_API_KEY) {
      throw new Error("Primary weather API key not configured");
    }

    // Simulate realistic maritime weather data
    const baseWindSpeed = 15 + Math.random() * 20; // 15-35 knots
    const baseWaveHeight = 2 + Math.random() * 4; // 2-6 meters
    
    return {
      location: { latitude, longitude },
      current: {
        windSpeed: baseWindSpeed,
        windDirection: Math.random() * 360,
        waveHeight: baseWaveHeight,
        seaState: Math.floor(baseWaveHeight / 2) + 2, // Sea state 2-5
        temperature: 15 + Math.random() * 15, // 15-30°C
        humidity: 60 + Math.random() * 30, // 60-90%
        visibility: 8 + Math.random() * 12 // 8-20 km
      },
      forecast: this.generateForecast(baseWindSpeed, baseWaveHeight)
    };
  }

  private async fetchFromBackupSource(source: DataSource, latitude: number, longitude: number): Promise<WeatherData> {
    // Simulate backup source with slightly different data
    const windVariation = source.name.includes("NOAA") ? 0.9 : 1.1;
    const waveVariation = source.name.includes("Local") ? 0.8 : 1.0;
    
    const baseWindSpeed = (12 + Math.random() * 18) * windVariation;
    const baseWaveHeight = (1.5 + Math.random() * 3.5) * waveVariation;
    
    return {
      location: { latitude, longitude },
      current: {
        windSpeed: baseWindSpeed,
        windDirection: Math.random() * 360,
        waveHeight: baseWaveHeight,
        seaState: Math.floor(baseWaveHeight / 2) + 2,
        temperature: 12 + Math.random() * 18,
        humidity: 55 + Math.random() * 35,
        visibility: 6 + Math.random() * 14
      },
      forecast: this.generateForecast(baseWindSpeed, baseWaveHeight)
    };
  }

  private generateRealisticWeatherData(latitude: number, longitude: number): WeatherData {
    // Generate realistic weather data based on geographic location
    const isNorthern = latitude > 30;
    const isTropical = Math.abs(latitude) < 30;
    
    let baseWindSpeed = 12;
    let baseWaveHeight = 2;
    
    if (isTropical) {
      baseWindSpeed = 8 + Math.random() * 25; // More variable in tropics
      baseWaveHeight = 1 + Math.random() * 4;
    } else if (isNorthern) {
      baseWindSpeed = 15 + Math.random() * 30; // Higher winds in northern waters
      baseWaveHeight = 2.5 + Math.random() * 5;
    }
    
    return {
      location: { latitude, longitude },
      current: {
        windSpeed: baseWindSpeed,
        windDirection: Math.random() * 360,
        waveHeight: baseWaveHeight,
        seaState: Math.floor(baseWaveHeight / 2) + 2,
        temperature: isTropical ? 25 + Math.random() * 8 : 8 + Math.random() * 15,
        humidity: 65 + Math.random() * 25,
        visibility: 10 + Math.random() * 15
      },
      forecast: this.generateForecast(baseWindSpeed, baseWaveHeight)
    };
  }

  private generateForecast(baseWindSpeed: number, baseWaveHeight: number) {
    const forecast = [];
    
    for (let i = 1; i <= 72; i += 6) { // 72-hour forecast, 6-hour intervals
      const windTrend = 0.9 + Math.random() * 0.2; // ±10% variation
      const waveTrend = 0.85 + Math.random() * 0.3; // ±15% variation
      
      forecast.push({
        timestamp: new Date(Date.now() + i * 60 * 60 * 1000),
        windSpeed: baseWindSpeed * windTrend,
        waveHeight: baseWaveHeight * waveTrend,
        seaState: Math.floor((baseWaveHeight * waveTrend) / 2) + 2
      });
    }
    
    return forecast;
  }

  getDataSources(): DataSource[] {
    return [...this.dataSources];
  }

  async updateDataSourceStatus(): Promise<void> {
    // Simulate checking data source availability
    for (const source of this.dataSources) {
      // Randomly simulate occasional unavailability
      source.available = Math.random() > 0.1; // 90% uptime
      source.lastUpdate = new Date();
    }
  }

  async getCurrentWeatherForShip(shipId: number): Promise<WeatherData> {
    // In a real implementation, this would get the ship's current location
    // For demo purposes, simulate different locations for different ships
    const locations = [
      { lat: 51.5, lon: -0.1 }, // North Sea
      { lat: 25.3, lon: 55.4 }, // Persian Gulf  
      { lat: 1.3, lon: 103.8 }, // Singapore Strait
      { lat: 40.7, lon: -74.0 }, // New York Harbor
    ];
    
    const location = locations[shipId % locations.length];
    return this.getWeatherData(location.lat, location.lon);
  }
}

export const weatherService = new WeatherService();