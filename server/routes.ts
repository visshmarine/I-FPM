import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRealisticData } from "../client/src/lib/data-generator";
import { mlPredictor } from "./ml-predictor";
import { weatherService } from "./weather-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate realistic data on server startup
  await generateRealisticData(storage);

  // Ships
  app.get("/api/ships", async (req, res) => {
    try {
      const ships = await storage.getShips();
      res.json(ships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ships", error });
    }
  });

  app.get("/api/ships/:id", async (req, res) => {
    try {
      const ship = await storage.getShip(parseInt(req.params.id));
      if (!ship) {
        return res.status(404).json({ message: "Ship not found" });
      }
      res.json(ship);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ship", error });
    }
  });

  // Voyages
  app.get("/api/voyages", async (req, res) => {
    try {
      const shipId = req.query.shipId ? parseInt(req.query.shipId as string) : undefined;
      const voyages = shipId 
        ? await storage.getVoyagesByShip(shipId)
        : await storage.getVoyages();
      res.json(voyages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch voyages", error });
    }
  });

  // Fuel Data
  app.get("/api/fuel-data", async (req, res) => {
    try {
      const shipId = req.query.shipId ? parseInt(req.query.shipId as string) : undefined;
      const voyageId = req.query.voyageId ? parseInt(req.query.voyageId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const data = await storage.getFuelData(shipId, voyageId, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fuel data", error });
    }
  });

  app.get("/api/fuel-data/latest/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const data = await storage.getLatestFuelData(shipId);
      if (!data) {
        return res.status(404).json({ message: "No fuel data found for ship" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest fuel data", error });
    }
  });

  // Environmental Data
  app.get("/api/environmental-data", async (req, res) => {
    try {
      const shipId = req.query.shipId ? parseInt(req.query.shipId as string) : undefined;
      const voyageId = req.query.voyageId ? parseInt(req.query.voyageId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const data = await storage.getEnvironmentalData(shipId, voyageId, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch environmental data", error });
    }
  });

  app.get("/api/environmental-data/latest/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const data = await storage.getLatestEnvironmentalData(shipId);
      if (!data) {
        return res.status(404).json({ message: "No environmental data found for ship" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest environmental data", error });
    }
  });

  // Hull Condition
  app.get("/api/hull-condition", async (req, res) => {
    try {
      const shipId = req.query.shipId ? parseInt(req.query.shipId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const data = await storage.getHullCondition(shipId, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hull condition data", error });
    }
  });

  app.get("/api/hull-condition/latest/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const data = await storage.getLatestHullCondition(shipId);
      if (!data) {
        return res.status(404).json({ message: "No hull condition data found for ship" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest hull condition data", error });
    }
  });

  // Trim Data
  app.get("/api/trim-data", async (req, res) => {
    try {
      const shipId = req.query.shipId ? parseInt(req.query.shipId as string) : undefined;
      const voyageId = req.query.voyageId ? parseInt(req.query.voyageId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const data = await storage.getTrimData(shipId, voyageId, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trim data", error });
    }
  });

  app.get("/api/trim-data/latest/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const data = await storage.getLatestTrimData(shipId);
      if (!data) {
        return res.status(404).json({ message: "No trim data found for ship" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest trim data", error });
    }
  });

  // Compliance Data
  app.get("/api/compliance-data", async (req, res) => {
    try {
      const shipId = req.query.shipId ? parseInt(req.query.shipId as string) : undefined;
      const voyageId = req.query.voyageId ? parseInt(req.query.voyageId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const data = await storage.getComplianceData(shipId, voyageId, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance data", error });
    }
  });

  app.get("/api/compliance-data/latest/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const data = await storage.getLatestComplianceData(shipId);
      if (!data) {
        return res.status(404).json({ message: "No compliance data found for ship" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest compliance data", error });
    }
  });

  // Auxiliary Data
  app.get("/api/auxiliary-data", async (req, res) => {
    try {
      const shipId = req.query.shipId ? parseInt(req.query.shipId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const data = await storage.getAuxiliaryData(shipId, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch auxiliary data", error });
    }
  });

  app.get("/api/auxiliary-data/latest/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const data = await storage.getLatestAuxiliaryData(shipId);
      if (!data) {
        return res.status(404).json({ message: "No auxiliary data found for ship" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest auxiliary data", error });
    }
  });

  // Dashboard summary endpoint
  app.get("/api/dashboard/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      
      const [
        ship,
        latestFuel,
        latestEnvironmental,
        latestHull,
        latestTrim,
        latestCompliance,
        latestAuxiliary,
        fuelHistory,
        voyages
      ] = await Promise.all([
        storage.getShip(shipId),
        storage.getLatestFuelData(shipId),
        storage.getLatestEnvironmentalData(shipId),
        storage.getLatestHullCondition(shipId),
        storage.getLatestTrimData(shipId),
        storage.getLatestComplianceData(shipId),
        storage.getLatestAuxiliaryData(shipId),
        storage.getFuelData(shipId, undefined, 7),
        storage.getVoyagesByShip(shipId)
      ]);

      if (!ship) {
        return res.status(404).json({ message: "Ship not found" });
      }

      const dashboardData = {
        ship,
        current: {
          fuel: latestFuel,
          environmental: latestEnvironmental,
          hull: latestHull,
          trim: latestTrim,
          compliance: latestCompliance,
          auxiliary: latestAuxiliary,
        },
        history: {
          fuel: fuelHistory,
        },
        voyages,
      };

      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data", error });
    }
  });

  // Machine Learning Predictive Maintenance
  app.get("/api/ml/predictive-maintenance/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const recommendations = await mlPredictor.generatePredictiveMaintenanceRecommendations(shipId);
      res.json(recommendations);
    } catch (error) {
      console.error("Predictive maintenance error:", error);
      res.status(500).json({ error: "Failed to generate maintenance recommendations" });
    }
  });

  // Weather-Adjusted Performance Analysis
  app.get("/api/ml/weather-adjusted-performance/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const voyageId = req.query.voyageId ? parseInt(req.query.voyageId as string) : undefined;
      const analysis = await mlPredictor.calculateWeatherAdjustedPerformance(shipId, voyageId);
      res.json(analysis);
    } catch (error) {
      console.error("Weather adjustment error:", error);
      res.status(500).json({ error: "Failed to calculate weather-adjusted performance" });
    }
  });

  // Weather Data Endpoints
  app.get("/api/weather/current/:shipId", async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId);
      const weatherData = await weatherService.getCurrentWeatherForShip(shipId);
      res.json(weatherData);
    } catch (error) {
      console.error("Weather data error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.get("/api/weather/data-sources", async (req, res) => {
    try {
      await weatherService.updateDataSourceStatus();
      const sources = weatherService.getDataSources();
      res.json(sources);
    } catch (error) {
      console.error("Data sources error:", error);
      res.status(500).json({ error: "Failed to fetch data sources" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
