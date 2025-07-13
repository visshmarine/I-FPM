import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRealisticData } from "../client/src/lib/data-generator";
import { mlPredictor } from "./ml-predictor";
import { weatherService } from "./weather-service";
import { databaseManager } from './database-manager';

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

  // ===== DATA INPUT ENDPOINTS (POST) =====
  
  // Create new ship
  app.post("/api/ships", async (req, res) => {
    try {
      const shipData = req.body;
      const newShip = await storage.createShip(shipData);
      res.status(201).json(newShip);
    } catch (error) {
      res.status(400).json({ message: "Failed to create ship", error });
    }
  });

  // Create new voyage
  app.post("/api/voyages", async (req, res) => {
    try {
      const voyageData = req.body;
      const newVoyage = await storage.createVoyage(voyageData);
      res.status(201).json(newVoyage);
    } catch (error) {
      res.status(400).json({ message: "Failed to create voyage", error });
    }
  });

  // Add fuel performance data
  app.post("/api/fuel-data", async (req, res) => {
    try {
      const fuelData = req.body;
      const newData = await storage.createFuelData(fuelData);
      res.status(201).json(newData);
    } catch (error) {
      res.status(400).json({ message: "Failed to add fuel data", error });
    }
  });

  // Add environmental data
  app.post("/api/environmental-data", async (req, res) => {
    try {
      const environmentalData = req.body;
      const newData = await storage.createEnvironmentalData(environmentalData);
      res.status(201).json(newData);
    } catch (error) {
      res.status(400).json({ message: "Failed to add environmental data", error });
    }
  });

  // Add hull condition data
  app.post("/api/hull-condition", async (req, res) => {
    try {
      const hullData = req.body;
      const newData = await storage.createHullCondition(hullData);
      res.status(201).json(newData);
    } catch (error) {
      res.status(400).json({ message: "Failed to add hull condition data", error });
    }
  });

  // Hull Performance Calculator endpoint
  app.post("/api/calculate-hull-performance", async (req, res) => {
    try {
      const { hullCalculator } = await import("./hull-calculator");
      
      const {
        currentPower,
        baselinePower,
        currentSpeed,
        baselineSpeed,
        currentSfoc,
        baselineSfoc,
        seaState,
        windSpeed,
        waveHeight
      } = req.body;

      if (!currentPower || !baselinePower || !currentSfoc || !baselineSfoc) {
        return res.status(400).json({ 
          error: "Missing required parameters: currentPower, baselinePower, currentSfoc, baselineSfoc" 
        });
      }

      const results = hullCalculator.calculateHullPerformance({
        currentPower,
        baselinePower,
        currentSpeed,
        baselineSpeed,
        currentSfoc,
        baselineSfoc,
        seaState,
        windSpeed,
        waveHeight
      });

      const economicImpact = hullCalculator.calculateEconomicImpact({
        currentPower,
        baselinePower,
        currentSpeed,
        baselineSpeed,
        currentSfoc,
        baselineSfoc,
        seaState,
        windSpeed,
        waveHeight
      });

      res.json({ ...results, economicImpact });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate hull performance", details: error.message });
    }
  });

  // File upload configuration
  const multer = (await import('multer')).default;
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req: any, file: any, cb: any) => {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
        'application/csv'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.'), false);
      }
    }
  });

  // Data upload endpoint
  app.post("/api/upload-data", upload.single('dataFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { dataParser } = await import("./data-parser");
      const mappingConfig = req.body.mappingConfig ? JSON.parse(req.body.mappingConfig) : null;
      
      if (!mappingConfig) {
        return res.status(400).json({ error: "Mapping configuration is required" });
      }

      let result;
      const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        result = await dataParser.parseCSVFile(req.file.buffer, mappingConfig);
      } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
        result = await dataParser.parseExcelFile(req.file.buffer, Array.isArray(mappingConfig) ? mappingConfig : [mappingConfig]);
      } else {
        return res.status(400).json({ error: "Unsupported file format" });
      }

      res.json(result);
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ 
        error: "File processing failed", 
        details: error.message 
      });
    }
  });

  // Get sample mapping configurations
  app.get("/api/upload-data/sample-mappings", (req, res) => {
    try {
      const { DataParser } = require("./data-parser");
      const sampleMappings = DataParser.getSampleMappings();
      res.json(sampleMappings);
    } catch (error) {
      res.status(500).json({ error: "Failed to get sample mappings" });
    }
  });

  // Add trim data
  app.post("/api/trim-data", async (req, res) => {
    try {
      const trimData = req.body;
      const newData = await storage.createTrimData(trimData);
      res.status(201).json(newData);
    } catch (error) {
      res.status(400).json({ message: "Failed to add trim data", error });
    }
  });

  // Add compliance data
  app.post("/api/compliance-data", async (req, res) => {
    try {
      const complianceData = req.body;
      const newData = await storage.createComplianceData(complianceData);
      res.status(201).json(newData);
    } catch (error) {
      res.status(400).json({ message: "Failed to add compliance data", error });
    }
  });

  // Add auxiliary data
  app.post("/api/auxiliary-data", async (req, res) => {
    try {
      const auxiliaryData = req.body;
      const newData = await storage.createAuxiliaryData(auxiliaryData);
      res.status(201).json(newData);
    } catch (error) {
      res.status(400).json({ message: "Failed to add auxiliary data", error });
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

  // Database Management Endpoints
  app.get("/api/database/stats", async (req, res) => {
    try {
      const stats = await databaseManager.getDatabaseStats();
      res.json(stats);
    } catch (error) {
      console.error("Database stats error:", error);
      res.status(500).json({ error: "Failed to fetch database statistics" });
    }
  });

  app.get("/api/database/integrity", async (req, res) => {
    try {
      const report = await databaseManager.getDataIntegrityReport();
      res.json(report);
    } catch (error) {
      console.error("Data integrity error:", error);
      res.status(500).json({ error: "Failed to generate integrity report" });
    }
  });

  app.get("/api/database/backup", async (req, res) => {
    try {
      const backup = await databaseManager.exportDatabaseBackup();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="ifpm_backup_${new Date().toISOString().split('T')[0]}.json"`);
      res.json(backup);
    } catch (error) {
      console.error("Database backup error:", error);
      res.status(500).json({ error: "Failed to create database backup" });
    }
  });

  app.post("/api/database/cleanup", async (req, res) => {
    try {
      const { retentionMonths } = req.body;
      const result = await databaseManager.cleanupOldData(retentionMonths || 24);
      res.json(result);
    } catch (error) {
      console.error("Database cleanup error:", error);
      res.status(500).json({ error: "Failed to cleanup database" });
    }
  });

  app.post("/api/database/optimize", async (req, res) => {
    try {
      const result = await databaseManager.optimizeDatabase();
      res.json(result);
    } catch (error) {
      console.error("Database optimization error:", error);
      res.status(500).json({ error: "Failed to optimize database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
