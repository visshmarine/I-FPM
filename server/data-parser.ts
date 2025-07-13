import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { storage } from './storage';
import type { 
  InsertShip, InsertVoyage, InsertFuelData, 
  InsertEnvironmentalData, InsertHullCondition,
  InsertTrimData, InsertComplianceData, InsertAuxiliaryData 
} from '@shared/schema';

export interface ParsedDataResult {
  success: boolean;
  message: string;
  recordsProcessed: number;
  errors: string[];
  data?: {
    ships?: number;
    voyages?: number;
    fuelData?: number;
    environmentalData?: number;
    hullCondition?: number;
    trimData?: number;
    complianceData?: number;
    auxiliaryData?: number;
  };
}

export interface DataMappingConfig {
  sheetName?: string;
  dataType: 'ships' | 'voyages' | 'fuel' | 'environmental' | 'hull' | 'trim' | 'compliance' | 'auxiliary';
  columnMappings: Record<string, string>;
  skipRows?: number;
  dateFormat?: string;
}

export class DataParser {
  
  /**
   * Parse Excel file and extract data based on configuration
   */
  async parseExcelFile(
    fileBuffer: Buffer, 
    mappingConfig: DataMappingConfig[]
  ): Promise<ParsedDataResult> {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const result: ParsedDataResult = {
        success: true,
        message: '',
        recordsProcessed: 0,
        errors: [],
        data: {}
      };

      for (const config of mappingConfig) {
        const sheetName = config.sheetName || workbook.SheetNames[0];
        
        if (!workbook.Sheets[sheetName]) {
          result.errors.push(`Sheet "${sheetName}" not found`);
          continue;
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: null 
        }) as any[][];

        const processedData = await this.processSheetData(jsonData, config);
        
        if (processedData.success) {
          result.recordsProcessed += processedData.recordsProcessed;
          if (result.data) {
            result.data[this.getDataKey(config.dataType)] = processedData.recordsProcessed;
          }
        } else {
          result.errors.push(...processedData.errors);
        }
      }

      if (result.errors.length > 0) {
        result.success = false;
        result.message = `Processed with ${result.errors.length} errors`;
      } else {
        result.message = `Successfully processed ${result.recordsProcessed} records`;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: `Excel parsing failed: ${error.message}`,
        recordsProcessed: 0,
        errors: [error.message]
      };
    }
  }

  /**
   * Parse CSV file and extract data
   */
  async parseCSVFile(
    fileBuffer: Buffer,
    config: DataMappingConfig
  ): Promise<ParsedDataResult> {
    return new Promise((resolve) => {
      const records: any[] = [];
      const errors: string[] = [];
      
      const stream = Readable.from(fileBuffer.toString());
      
      stream
        .pipe(csv({ 
          skipEmptyLines: true,
          headers: true 
        }))
        .on('data', (data) => {
          records.push(data);
        })
        .on('end', async () => {
          try {
            const processedData = await this.processCSVData(records, config);
            resolve(processedData);
          } catch (error) {
            resolve({
              success: false,
              message: `CSV processing failed: ${error.message}`,
              recordsProcessed: 0,
              errors: [error.message]
            });
          }
        })
        .on('error', (error) => {
          resolve({
            success: false,
            message: `CSV parsing failed: ${error.message}`,
            recordsProcessed: 0,
            errors: [error.message]
          });
        });
    });
  }

  /**
   * Process sheet data based on configuration
   */
  private async processSheetData(
    jsonData: any[][],
    config: DataMappingConfig
  ): Promise<ParsedDataResult> {
    const headers = jsonData[0] || [];
    const dataRows = jsonData.slice(config.skipRows || 1);
    const errors: string[] = [];
    let successCount = 0;

    // Validate column mappings
    const mappedColumns = Object.keys(config.columnMappings);
    const missingColumns = mappedColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return {
        success: false,
        message: `Missing columns: ${missingColumns.join(', ')}`,
        recordsProcessed: 0,
        errors: [`Missing columns: ${missingColumns.join(', ')}`]
      };
    }

    // Process each data row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      
      try {
        const mappedData = this.mapRowData(row, headers, config);
        
        if (this.validateRowData(mappedData, config.dataType)) {
          await this.saveRowData(mappedData, config.dataType);
          successCount++;
        } else {
          errors.push(`Row ${i + 2}: Invalid data format`);
        }
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      message: `Processed ${successCount} of ${dataRows.length} rows`,
      recordsProcessed: successCount,
      errors
    };
  }

  /**
   * Process CSV data
   */
  private async processCSVData(
    records: any[],
    config: DataMappingConfig
  ): Promise<ParsedDataResult> {
    const errors: string[] = [];
    let successCount = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        const mappedData = this.mapCSVData(record, config);
        
        if (this.validateRowData(mappedData, config.dataType)) {
          await this.saveRowData(mappedData, config.dataType);
          successCount++;
        } else {
          errors.push(`Record ${i + 1}: Invalid data format`);
        }
      } catch (error) {
        errors.push(`Record ${i + 1}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      message: `Processed ${successCount} of ${records.length} records`,
      recordsProcessed: successCount,
      errors
    };
  }

  /**
   * Map row data based on column mappings
   */
  private mapRowData(row: any[], headers: string[], config: DataMappingConfig): any {
    const mappedData: any = {};
    
    Object.entries(config.columnMappings).forEach(([sourceCol, targetField]) => {
      const colIndex = headers.indexOf(sourceCol);
      if (colIndex !== -1) {
        let value = row[colIndex];
        
        // Handle date conversion
        if (targetField.includes('Date') || targetField === 'timestamp') {
          value = this.parseDate(value, config.dateFormat);
        }
        
        // Handle numeric conversions
        if (this.isNumericField(targetField)) {
          value = this.parseNumeric(value);
        }
        
        mappedData[targetField] = value;
      }
    });

    return mappedData;
  }

  /**
   * Map CSV data based on column mappings
   */
  private mapCSVData(record: any, config: DataMappingConfig): any {
    const mappedData: any = {};
    
    Object.entries(config.columnMappings).forEach(([sourceCol, targetField]) => {
      let value = record[sourceCol];
      
      // Handle date conversion
      if (targetField.includes('Date') || targetField === 'timestamp') {
        value = this.parseDate(value, config.dateFormat);
      }
      
      // Handle numeric conversions
      if (this.isNumericField(targetField)) {
        value = this.parseNumeric(value);
      }
      
      mappedData[targetField] = value;
    });

    return mappedData;
  }

  /**
   * Parse date values
   */
  private parseDate(value: any, format?: string): string | null {
    if (!value) return null;
    
    try {
      // Handle Excel date serial numbers
      if (typeof value === 'number') {
        const date = XLSX.SSF.parse_date_code(value);
        return new Date(date.y, date.m - 1, date.d).toISOString();
      }
      
      // Handle string dates
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch {
      return null;
    }
  }

  /**
   * Parse numeric values
   */
  private parseNumeric(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  /**
   * Check if field should be treated as numeric
   */
  private isNumericField(fieldName: string): boolean {
    const numericFields = [
      'deadweight', 'enginePower', 'length', 'beam', 'draught',
      'sfoc', 'fuelConsumptionRate', 'engineLoadFactor', 'speedThroughWater',
      'speedOverGround', 'enginePower', 'co2Emissions', 'windSpeed',
      'waveHeight', 'windDirection', 'seaState', 'weatherImpact',
      'roughnessIndex', 'propellerSlip', 'hullEfficiency', 'daysSinceLastCleaning'
    ];
    
    return numericFields.includes(fieldName);
  }

  /**
   * Validate row data before saving
   */
  private validateRowData(data: any, dataType: string): boolean {
    switch (dataType) {
      case 'ships':
        return !!(data.name && data.imo);
      case 'voyages':
        return !!(data.shipId && data.voyageNumber);
      case 'fuel':
        return !!(data.shipId && (data.sfoc || data.fuelConsumptionRate));
      case 'environmental':
        return !!(data.shipId && (data.windSpeed || data.waveHeight));
      case 'hull':
        return !!(data.shipId && (data.roughnessIndex || data.hullEfficiency));
      default:
        return !!data.shipId;
    }
  }

  /**
   * Save row data to storage
   */
  private async saveRowData(data: any, dataType: string): Promise<void> {
    // Add timestamp if not provided
    if (!data.timestamp && dataType !== 'ships' && dataType !== 'voyages') {
      data.timestamp = new Date().toISOString();
    }

    switch (dataType) {
      case 'ships':
        await storage.createShip(data as InsertShip);
        break;
      case 'voyages':
        await storage.createVoyage(data as InsertVoyage);
        break;
      case 'fuel':
        await storage.createFuelData(data as InsertFuelData);
        break;
      case 'environmental':
        await storage.createEnvironmentalData(data as InsertEnvironmentalData);
        break;
      case 'hull':
        await storage.createHullCondition(data as InsertHullCondition);
        break;
      case 'trim':
        await storage.createTrimData(data as InsertTrimData);
        break;
      case 'compliance':
        await storage.createComplianceData(data as InsertComplianceData);
        break;
      case 'auxiliary':
        await storage.createAuxiliaryData(data as InsertAuxiliaryData);
        break;
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  /**
   * Get data key for result object
   */
  private getDataKey(dataType: string): keyof NonNullable<ParsedDataResult['data']> {
    const keyMap: Record<string, keyof NonNullable<ParsedDataResult['data']>> = {
      'ships': 'ships',
      'voyages': 'voyages',
      'fuel': 'fuelData',
      'environmental': 'environmentalData',
      'hull': 'hullCondition',
      'trim': 'trimData',
      'compliance': 'complianceData',
      'auxiliary': 'auxiliaryData'
    };
    
    return keyMap[dataType] || 'fuelData';
  }

  /**
   * Get sample mapping configuration for different data types
   */
  static getSampleMappings(): Record<string, DataMappingConfig> {
    return {
      ships: {
        dataType: 'ships',
        columnMappings: {
          'Vessel Name': 'name',
          'IMO Number': 'imo',
          'Ship Type': 'shipType',
          'Deadweight (MT)': 'deadweight',
          'Engine Power (kW)': 'enginePower',
          'Length (m)': 'length',
          'Beam (m)': 'beam',
          'Draught (m)': 'draught'
        }
      },
      voyages: {
        dataType: 'voyages',
        columnMappings: {
          'Ship ID': 'shipId',
          'Voyage Number': 'voyageNumber',
          'Departure Port': 'departurePort',
          'Arrival Port': 'arrivalPort',
          'Start Date': 'startDate',
          'End Date': 'endDate'
        }
      },
      fuel: {
        dataType: 'fuel',
        columnMappings: {
          'Ship ID': 'shipId',
          'Voyage ID': 'voyageId',
          'Date': 'timestamp',
          'SFOC (g/kWh)': 'sfoc',
          'Fuel Rate (MT/day)': 'fuelConsumptionRate',
          'Engine Load (%)': 'engineLoadFactor',
          'Speed STW (knots)': 'speedThroughWater',
          'Speed SOG (knots)': 'speedOverGround',
          'Engine Power (kW)': 'enginePower',
          'Fuel Type': 'fuelType',
          'CO2 Emissions (MT/day)': 'co2Emissions'
        }
      },
      environmental: {
        dataType: 'environmental',
        columnMappings: {
          'Ship ID': 'shipId',
          'Voyage ID': 'voyageId',
          'Date': 'timestamp',
          'Wind Speed (knots)': 'windSpeed',
          'Wave Height (m)': 'waveHeight',
          'Wind Direction (deg)': 'windDirection',
          'Sea State': 'seaState',
          'Weather Impact (%)': 'weatherImpact'
        }
      },
      hull: {
        dataType: 'hull',
        columnMappings: {
          'Ship ID': 'shipId',
          'Date': 'timestamp',
          'Hull Roughness Index': 'roughnessIndex',
          'Propeller Slip (%)': 'propellerSlip',
          'Hull Efficiency (%)': 'hullEfficiency',
          'Days Since Cleaning': 'daysSinceLastCleaning',
          'Last Cleaning Date': 'lastCleaningDate'
        }
      }
    };
  }
}

export const dataParser = new DataParser();