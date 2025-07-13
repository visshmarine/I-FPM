import { db } from './db';
import { 
  ships, 
  voyages, 
  fuelData, 
  environmentalData, 
  hullCondition, 
  trimData, 
  complianceData, 
  auxiliaryData 
} from '@shared/schema';
import { sql, count, avg, min, max, desc } from 'drizzle-orm';

export interface DatabaseStats {
  totalShips: number;
  totalVoyages: number;
  totalFuelRecords: number;
  totalEnvironmentalRecords: number;
  totalHullRecords: number;
  totalTrimRecords: number;
  totalComplianceRecords: number;
  totalAuxiliaryRecords: number;
  dataQuality: number;
  oldestRecord: string;
  newestRecord: string;
  averageSfoc: number;
}

export interface DataIntegrityReport {
  missingData: {
    table: string;
    issue: string;
    count: number;
  }[];
  dataQuality: {
    table: string;
    quality: number;
    description: string;
  }[];
  recommendations: string[];
}

export class DatabaseManager {
  
  /**
   * Get comprehensive database statistics
   */
  async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      const [
        shipCount,
        voyageCount,
        fuelCount,
        envCount,
        hullCount,
        trimCount,
        complianceCount,
        auxiliaryCount,
        avgSfocResult,
        dateRange
      ] = await Promise.all([
        db.select({ count: count() }).from(ships),
        db.select({ count: count() }).from(voyages),
        db.select({ count: count() }).from(fuelData),
        db.select({ count: count() }).from(environmentalData),
        db.select({ count: count() }).from(hullCondition),
        db.select({ count: count() }).from(trimData),
        db.select({ count: count() }).from(complianceData),
        db.select({ count: count() }).from(auxiliaryData),
        db.select({ avg: avg(fuelData.sfoc) }).from(fuelData),
        db.select({ 
          oldest: min(fuelData.timestamp),
          newest: max(fuelData.timestamp)
        }).from(fuelData)
      ]);

      // Calculate data quality score based on completeness
      const totalRecords = fuelCount[0].count + envCount[0].count + hullCount[0].count;
      const expectedRecords = shipCount[0].count * 365; // Assuming daily records
      const dataQuality = Math.min(100, (totalRecords / expectedRecords) * 100);

      return {
        totalShips: shipCount[0].count,
        totalVoyages: voyageCount[0].count,
        totalFuelRecords: fuelCount[0].count,
        totalEnvironmentalRecords: envCount[0].count,
        totalHullRecords: hullCount[0].count,
        totalTrimRecords: trimCount[0].count,
        totalComplianceRecords: complianceCount[0].count,
        totalAuxiliaryRecords: auxiliaryCount[0].count,
        dataQuality: Math.round(dataQuality),
        oldestRecord: dateRange[0].oldest?.toISOString() || '',
        newestRecord: dateRange[0].newest?.toISOString() || '',
        averageSfoc: Number(avgSfocResult[0].avg) || 0
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }

  /**
   * Generate data integrity report
   */
  async getDataIntegrityReport(): Promise<DataIntegrityReport> {
    try {
      const missingData = [];
      const dataQuality = [];
      const recommendations = [];

      // Check for ships without fuel data
      const shipsWithoutFuelData = await db
        .select({ count: count() })
        .from(ships)
        .leftJoin(fuelData, sql`${ships.id} = ${fuelData.shipId}`)
        .where(sql`${fuelData.id} IS NULL`);

      if (shipsWithoutFuelData[0].count > 0) {
        missingData.push({
          table: 'fuel_data',
          issue: 'Ships without fuel performance data',
          count: shipsWithoutFuelData[0].count
        });
        recommendations.push('Add fuel consumption data for all registered vessels');
      }

      // Check for voyages without environmental data
      const voyagesWithoutEnvData = await db
        .select({ count: count() })
        .from(voyages)
        .leftJoin(environmentalData, sql`${voyages.id} = ${environmentalData.voyageId}`)
        .where(sql`${environmentalData.id} IS NULL`);

      if (voyagesWithoutEnvData[0].count > 0) {
        missingData.push({
          table: 'environmental_data',
          issue: 'Voyages without environmental conditions',
          count: voyagesWithoutEnvData[0].count
        });
        recommendations.push('Record weather conditions for all voyages');
      }

      // Check fuel data quality
      const invalidSfocData = await db
        .select({ count: count() })
        .from(fuelData)
        .where(sql`${fuelData.sfoc} < 150 OR ${fuelData.sfoc} > 300`);

      const totalFuelRecords = await db.select({ count: count() }).from(fuelData);
      const fuelQuality = ((totalFuelRecords[0].count - invalidSfocData[0].count) / totalFuelRecords[0].count) * 100;

      dataQuality.push({
        table: 'fuel_data',
        quality: Math.round(fuelQuality),
        description: `${invalidSfocData[0].count} records with unusual SFOC values`
      });

      if (fuelQuality < 95) {
        recommendations.push('Review and validate SFOC values outside normal range (150-300 g/kWh)');
      }

      // Check for recent data
      const recentData = await db
        .select({ count: count() })
        .from(fuelData)
        .where(sql`${fuelData.timestamp} >= NOW() - INTERVAL '7 days'`);

      if (recentData[0].count === 0) {
        missingData.push({
          table: 'fuel_data',
          issue: 'No recent data (last 7 days)',
          count: 0
        });
        recommendations.push('Ensure continuous data collection from vessel sensors');
      }

      return {
        missingData,
        dataQuality,
        recommendations
      };
    } catch (error) {
      console.error('Error generating data integrity report:', error);
      throw error;
    }
  }

  /**
   * Backup database to JSON format
   */
  async exportDatabaseBackup(): Promise<any> {
    try {
      const [
        allShips,
        allVoyages,
        allFuelData,
        allEnvironmentalData,
        allHullCondition,
        allTrimData,
        allComplianceData,
        allAuxiliaryData
      ] = await Promise.all([
        db.select().from(ships),
        db.select().from(voyages),
        db.select().from(fuelData).orderBy(desc(fuelData.timestamp)),
        db.select().from(environmentalData).orderBy(desc(environmentalData.timestamp)),
        db.select().from(hullCondition).orderBy(desc(hullCondition.timestamp)),
        db.select().from(trimData).orderBy(desc(trimData.timestamp)),
        db.select().from(complianceData).orderBy(desc(complianceData.timestamp)),
        db.select().from(auxiliaryData).orderBy(desc(auxiliaryData.timestamp))
      ]);

      return {
        exportDate: new Date().toISOString(),
        version: '1.0',
        tables: {
          ships: allShips,
          voyages: allVoyages,
          fuelData: allFuelData,
          environmentalData: allEnvironmentalData,
          hullCondition: allHullCondition,
          trimData: allTrimData,
          complianceData: allComplianceData,
          auxiliaryData: allAuxiliaryData
        }
      };
    } catch (error) {
      console.error('Error exporting database backup:', error);
      throw error;
    }
  }

  /**
   * Clean up old data based on retention policy
   */
  async cleanupOldData(retentionMonths: number = 24): Promise<{ deletedRecords: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - retentionMonths);

      const deletedFuelData = await db
        .delete(fuelData)
        .where(sql`${fuelData.timestamp} < ${cutoffDate}`)
        .returning({ id: fuelData.id });

      const deletedEnvData = await db
        .delete(environmentalData)
        .where(sql`${environmentalData.timestamp} < ${cutoffDate}`)
        .returning({ id: environmentalData.id });

      const deletedHullData = await db
        .delete(hullCondition)
        .where(sql`${hullCondition.timestamp} < ${cutoffDate}`)
        .returning({ id: hullCondition.id });

      const totalDeleted = deletedFuelData.length + deletedEnvData.length + deletedHullData.length;

      console.log(`Cleaned up ${totalDeleted} records older than ${retentionMonths} months`);
      
      return { deletedRecords: totalDeleted };
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      throw error;
    }
  }

  /**
   * Optimize database performance
   */
  async optimizeDatabase(): Promise<{ status: string; details: string[] }> {
    try {
      const details = [];

      // Analyze tables for optimization
      await db.execute(sql`ANALYZE ships`);
      await db.execute(sql`ANALYZE fuel_data`);
      await db.execute(sql`ANALYZE environmental_data`);
      details.push('Table statistics updated');

      // Vacuum tables to reclaim space
      await db.execute(sql`VACUUM ANALYZE fuel_data`);
      await db.execute(sql`VACUUM ANALYZE environmental_data`);
      details.push('Database vacuum completed');

      details.push('Performance optimization completed');

      return {
        status: 'success',
        details
      };
    } catch (error) {
      console.error('Error optimizing database:', error);
      return {
        status: 'error',
        details: [error.message]
      };
    }
  }
}

export const databaseManager = new DatabaseManager();