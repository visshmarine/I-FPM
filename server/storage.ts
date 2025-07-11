import {
  ships,
  voyages,
  fuelData,
  environmentalData,
  hullCondition,
  trimData,
  complianceData,
  auxiliaryData,
  type Ship,
  type InsertShip,
  type Voyage,
  type InsertVoyage,
  type FuelData,
  type InsertFuelData,
  type EnvironmentalData,
  type InsertEnvironmentalData,
  type HullCondition,
  type InsertHullCondition,
  type TrimData,
  type InsertTrimData,
  type ComplianceData,
  type InsertComplianceData,
  type AuxiliaryData,
  type InsertAuxiliaryData,
} from "@shared/schema";

export interface IStorage {
  // Ships
  createShip(ship: InsertShip): Promise<Ship>;
  getShips(): Promise<Ship[]>;
  getShip(id: number): Promise<Ship | undefined>;

  // Voyages
  createVoyage(voyage: InsertVoyage): Promise<Voyage>;
  getVoyages(): Promise<Voyage[]>;
  getVoyagesByShip(shipId: number): Promise<Voyage[]>;
  getVoyage(id: number): Promise<Voyage | undefined>;

  // Fuel Data
  createFuelData(data: InsertFuelData): Promise<FuelData>;
  getFuelData(shipId?: number, voyageId?: number, limit?: number): Promise<FuelData[]>;
  getLatestFuelData(shipId: number): Promise<FuelData | undefined>;

  // Environmental Data
  createEnvironmentalData(data: InsertEnvironmentalData): Promise<EnvironmentalData>;
  getEnvironmentalData(shipId?: number, voyageId?: number, limit?: number): Promise<EnvironmentalData[]>;
  getLatestEnvironmentalData(shipId: number): Promise<EnvironmentalData | undefined>;

  // Hull Condition
  createHullCondition(data: InsertHullCondition): Promise<HullCondition>;
  getHullCondition(shipId?: number, limit?: number): Promise<HullCondition[]>;
  getLatestHullCondition(shipId: number): Promise<HullCondition | undefined>;

  // Trim Data
  createTrimData(data: InsertTrimData): Promise<TrimData>;
  getTrimData(shipId?: number, voyageId?: number, limit?: number): Promise<TrimData[]>;
  getLatestTrimData(shipId: number): Promise<TrimData | undefined>;

  // Compliance Data
  createComplianceData(data: InsertComplianceData): Promise<ComplianceData>;
  getComplianceData(shipId?: number, voyageId?: number, limit?: number): Promise<ComplianceData[]>;
  getLatestComplianceData(shipId: number): Promise<ComplianceData | undefined>;

  // Auxiliary Data
  createAuxiliaryData(data: InsertAuxiliaryData): Promise<AuxiliaryData>;
  getAuxiliaryData(shipId?: number, limit?: number): Promise<AuxiliaryData[]>;
  getLatestAuxiliaryData(shipId: number): Promise<AuxiliaryData | undefined>;
}

export class MemStorage implements IStorage {
  private ships: Map<number, Ship> = new Map();
  private voyages: Map<number, Voyage> = new Map();
  private fuelDataMap: Map<number, FuelData> = new Map();
  private environmentalDataMap: Map<number, EnvironmentalData> = new Map();
  private hullConditionMap: Map<number, HullCondition> = new Map();
  private trimDataMap: Map<number, TrimData> = new Map();
  private complianceDataMap: Map<number, ComplianceData> = new Map();
  private auxiliaryDataMap: Map<number, AuxiliaryData> = new Map();

  private currentShipId = 1;
  private currentVoyageId = 1;
  private currentFuelDataId = 1;
  private currentEnvironmentalDataId = 1;
  private currentHullConditionId = 1;
  private currentTrimDataId = 1;
  private currentComplianceDataId = 1;
  private currentAuxiliaryDataId = 1;

  constructor() {
    this.initializeWithSampleData();
  }

  private initializeWithSampleData() {
    // Initialize with sample ships
    const sampleShips: InsertShip[] = [
      {
        name: "MV Atlantic Explorer",
        imo: "IMO1234567",
        type: "Container Ship",
        deadweight: "80000",
        enginePower: "20000",
      },
      {
        name: "MV Pacific Voyager",
        imo: "IMO2345678",
        type: "Bulk Carrier",
        deadweight: "120000",
        enginePower: "15000",
      },
      {
        name: "MV Northern Star",
        imo: "IMO3456789",
        type: "Tanker",
        deadweight: "150000",
        enginePower: "18000",
      },
    ];

    sampleShips.forEach(ship => {
      this.ships.set(this.currentShipId, {
        ...ship,
        id: this.currentShipId,
        createdAt: new Date(),
      });
      this.currentShipId++;
    });

    // Initialize with sample voyages
    const sampleVoyages: InsertVoyage[] = [
      {
        shipId: 1,
        voyageNumber: "VOY-2024-001",
        origin: "Singapore",
        destination: "Rotterdam",
        departureDate: new Date("2024-01-01"),
        arrivalDate: null,
        status: "active",
      },
      {
        shipId: 2,
        voyageNumber: "VOY-2024-002",
        origin: "Shanghai",
        destination: "Long Beach",
        departureDate: new Date("2024-01-05"),
        arrivalDate: null,
        status: "active",
      },
      {
        shipId: 3,
        voyageNumber: "VOY-2024-003",
        origin: "Abu Dhabi",
        destination: "Houston",
        departureDate: new Date("2024-01-10"),
        arrivalDate: null,
        status: "active",
      },
    ];

    sampleVoyages.forEach(voyage => {
      this.voyages.set(this.currentVoyageId, {
        ...voyage,
        id: this.currentVoyageId,
        createdAt: new Date(),
      });
      this.currentVoyageId++;
    });
  }

  // Ships
  async createShip(ship: InsertShip): Promise<Ship> {
    const newShip: Ship = {
      ...ship,
      id: this.currentShipId++,
      createdAt: new Date(),
    };
    this.ships.set(newShip.id, newShip);
    return newShip;
  }

  async getShips(): Promise<Ship[]> {
    return Array.from(this.ships.values());
  }

  async getShip(id: number): Promise<Ship | undefined> {
    return this.ships.get(id);
  }

  // Voyages
  async createVoyage(voyage: InsertVoyage): Promise<Voyage> {
    const newVoyage: Voyage = {
      ...voyage,
      id: this.currentVoyageId++,
      createdAt: new Date(),
    };
    this.voyages.set(newVoyage.id, newVoyage);
    return newVoyage;
  }

  async getVoyages(): Promise<Voyage[]> {
    return Array.from(this.voyages.values());
  }

  async getVoyagesByShip(shipId: number): Promise<Voyage[]> {
    return Array.from(this.voyages.values()).filter(v => v.shipId === shipId);
  }

  async getVoyage(id: number): Promise<Voyage | undefined> {
    return this.voyages.get(id);
  }

  // Fuel Data
  async createFuelData(data: InsertFuelData): Promise<FuelData> {
    const newData: FuelData = {
      ...data,
      id: this.currentFuelDataId++,
      createdAt: new Date(),
    };
    this.fuelDataMap.set(newData.id, newData);
    return newData;
  }

  async getFuelData(shipId?: number, voyageId?: number, limit?: number): Promise<FuelData[]> {
    let data = Array.from(this.fuelDataMap.values());
    
    if (shipId) {
      data = data.filter(d => d.shipId === shipId);
    }
    if (voyageId) {
      data = data.filter(d => d.voyageId === voyageId);
    }
    
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return data;
  }

  async getLatestFuelData(shipId: number): Promise<FuelData | undefined> {
    const data = await this.getFuelData(shipId, undefined, 1);
    return data[0];
  }

  // Environmental Data
  async createEnvironmentalData(data: InsertEnvironmentalData): Promise<EnvironmentalData> {
    const newData: EnvironmentalData = {
      ...data,
      id: this.currentEnvironmentalDataId++,
      createdAt: new Date(),
    };
    this.environmentalDataMap.set(newData.id, newData);
    return newData;
  }

  async getEnvironmentalData(shipId?: number, voyageId?: number, limit?: number): Promise<EnvironmentalData[]> {
    let data = Array.from(this.environmentalDataMap.values());
    
    if (shipId) {
      data = data.filter(d => d.shipId === shipId);
    }
    if (voyageId) {
      data = data.filter(d => d.voyageId === voyageId);
    }
    
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return data;
  }

  async getLatestEnvironmentalData(shipId: number): Promise<EnvironmentalData | undefined> {
    const data = await this.getEnvironmentalData(shipId, undefined, 1);
    return data[0];
  }

  // Hull Condition
  async createHullCondition(data: InsertHullCondition): Promise<HullCondition> {
    const newData: HullCondition = {
      ...data,
      id: this.currentHullConditionId++,
      createdAt: new Date(),
    };
    this.hullConditionMap.set(newData.id, newData);
    return newData;
  }

  async getHullCondition(shipId?: number, limit?: number): Promise<HullCondition[]> {
    let data = Array.from(this.hullConditionMap.values());
    
    if (shipId) {
      data = data.filter(d => d.shipId === shipId);
    }
    
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return data;
  }

  async getLatestHullCondition(shipId: number): Promise<HullCondition | undefined> {
    const data = await this.getHullCondition(shipId, 1);
    return data[0];
  }

  // Trim Data
  async createTrimData(data: InsertTrimData): Promise<TrimData> {
    const newData: TrimData = {
      ...data,
      id: this.currentTrimDataId++,
      createdAt: new Date(),
    };
    this.trimDataMap.set(newData.id, newData);
    return newData;
  }

  async getTrimData(shipId?: number, voyageId?: number, limit?: number): Promise<TrimData[]> {
    let data = Array.from(this.trimDataMap.values());
    
    if (shipId) {
      data = data.filter(d => d.shipId === shipId);
    }
    if (voyageId) {
      data = data.filter(d => d.voyageId === voyageId);
    }
    
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return data;
  }

  async getLatestTrimData(shipId: number): Promise<TrimData | undefined> {
    const data = await this.getTrimData(shipId, undefined, 1);
    return data[0];
  }

  // Compliance Data
  async createComplianceData(data: InsertComplianceData): Promise<ComplianceData> {
    const newData: ComplianceData = {
      ...data,
      id: this.currentComplianceDataId++,
      createdAt: new Date(),
    };
    this.complianceDataMap.set(newData.id, newData);
    return newData;
  }

  async getComplianceData(shipId?: number, voyageId?: number, limit?: number): Promise<ComplianceData[]> {
    let data = Array.from(this.complianceDataMap.values());
    
    if (shipId) {
      data = data.filter(d => d.shipId === shipId);
    }
    if (voyageId) {
      data = data.filter(d => d.voyageId === voyageId);
    }
    
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return data;
  }

  async getLatestComplianceData(shipId: number): Promise<ComplianceData | undefined> {
    const data = await this.getComplianceData(shipId, undefined, 1);
    return data[0];
  }

  // Auxiliary Data
  async createAuxiliaryData(data: InsertAuxiliaryData): Promise<AuxiliaryData> {
    const newData: AuxiliaryData = {
      ...data,
      id: this.currentAuxiliaryDataId++,
      createdAt: new Date(),
    };
    this.auxiliaryDataMap.set(newData.id, newData);
    return newData;
  }

  async getAuxiliaryData(shipId?: number, limit?: number): Promise<AuxiliaryData[]> {
    let data = Array.from(this.auxiliaryDataMap.values());
    
    if (shipId) {
      data = data.filter(d => d.shipId === shipId);
    }
    
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return data;
  }

  async getLatestAuxiliaryData(shipId: number): Promise<AuxiliaryData | undefined> {
    const data = await this.getAuxiliaryData(shipId, 1);
    return data[0];
  }
}

export const storage = new MemStorage();
