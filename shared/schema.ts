import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ships = pgTable("ships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imo: text("imo").notNull().unique(),
  type: text("type").notNull(),
  deadweight: decimal("deadweight", { precision: 10, scale: 2 }),
  enginePower: decimal("engine_power", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const voyages = pgTable("voyages", {
  id: serial("id").primaryKey(),
  shipId: integer("ship_id").references(() => ships.id),
  voyageNumber: text("voyage_number").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  arrivalDate: timestamp("arrival_date"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fuelData = pgTable("fuel_data", {
  id: serial("id").primaryKey(),
  shipId: integer("ship_id").references(() => ships.id),
  voyageId: integer("voyage_id").references(() => voyages.id),
  timestamp: timestamp("timestamp").notNull(),
  sfoc: decimal("sfoc", { precision: 8, scale: 2 }), // g/kWh
  fuelConsumptionRate: decimal("fuel_consumption_rate", { precision: 10, scale: 2 }), // MT/day
  engineLoadFactor: decimal("engine_load_factor", { precision: 5, scale: 2 }), // %
  speedThroughWater: decimal("speed_through_water", { precision: 5, scale: 2 }), // knots
  speedOverGround: decimal("speed_over_ground", { precision: 5, scale: 2 }), // knots
  enginePower: decimal("engine_power", { precision: 10, scale: 2 }), // kW
  fuelType: text("fuel_type").notNull(),
  co2Emissions: decimal("co2_emissions", { precision: 10, scale: 2 }), // tons/day
  createdAt: timestamp("created_at").defaultNow(),
});

export const environmentalData = pgTable("environmental_data", {
  id: serial("id").primaryKey(),
  shipId: integer("ship_id").references(() => ships.id),
  voyageId: integer("voyage_id").references(() => voyages.id),
  timestamp: timestamp("timestamp").notNull(),
  windSpeed: decimal("wind_speed", { precision: 5, scale: 2 }), // knots
  waveHeight: decimal("wave_height", { precision: 5, scale: 2 }), // meters
  windDirection: integer("wind_direction"), // degrees
  seaState: integer("sea_state"), // 0-9 scale
  weatherImpact: decimal("weather_impact", { precision: 5, scale: 2 }), // % impact on fuel
  createdAt: timestamp("created_at").defaultNow(),
});

export const hullCondition = pgTable("hull_condition", {
  id: serial("id").primaryKey(),
  shipId: integer("ship_id").references(() => ships.id),
  timestamp: timestamp("timestamp").notNull(),
  roughnessIndex: decimal("roughness_index", { precision: 8, scale: 2 }), // μm
  propellerSlip: decimal("propeller_slip", { precision: 5, scale: 2 }), // %
  hullEfficiency: decimal("hull_efficiency", { precision: 5, scale: 2 }), // % deviation
  daysSinceLastCleaning: integer("days_since_last_cleaning"),
  lastCleaningDate: timestamp("last_cleaning_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trimData = pgTable("trim_data", {
  id: serial("id").primaryKey(),
  shipId: integer("ship_id").references(() => ships.id),
  voyageId: integer("voyage_id").references(() => voyages.id),
  timestamp: timestamp("timestamp").notNull(),
  currentTrim: decimal("current_trim", { precision: 5, scale: 2 }), // meters
  optimalTrim: decimal("optimal_trim", { precision: 5, scale: 2 }), // meters
  fuelSavingsPotential: decimal("fuel_savings_potential", { precision: 5, scale: 2 }), // %
  trimAdjustment: decimal("trim_adjustment", { precision: 5, scale: 2 }), // meters
  createdAt: timestamp("created_at").defaultNow(),
});

export const complianceData = pgTable("compliance_data", {
  id: serial("id").primaryKey(),
  shipId: integer("ship_id").references(() => ships.id),
  voyageId: integer("voyage_id").references(() => voyages.id),
  timestamp: timestamp("timestamp").notNull(),
  ciiRating: text("cii_rating").notNull(), // A, B, C, D, E
  ciiValue: decimal("cii_value", { precision: 10, scale: 2 }),
  eeoiValue: decimal("eeoi_value", { precision: 10, scale: 2 }), // g CO2/t·nm
  eeoiTarget: decimal("eeoi_target", { precision: 10, scale: 2 }),
  complianceStatus: text("compliance_status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auxiliaryData = pgTable("auxiliary_data", {
  id: serial("id").primaryKey(),
  shipId: integer("ship_id").references(() => ships.id),
  timestamp: timestamp("timestamp").notNull(),
  hvacPower: decimal("hvac_power", { precision: 8, scale: 2 }), // kW
  pumpsPower: decimal("pumps_power", { precision: 8, scale: 2 }), // kW
  lightingPower: decimal("lighting_power", { precision: 8, scale: 2 }), // kW
  navigationPower: decimal("navigation_power", { precision: 8, scale: 2 }), // kW
  cargoHandlingPower: decimal("cargo_handling_power", { precision: 8, scale: 2 }), // kW
  totalAuxiliaryPower: decimal("total_auxiliary_power", { precision: 8, scale: 2 }), // kW
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertShipSchema = createInsertSchema(ships).omit({
  id: true,
  createdAt: true,
});

export const insertVoyageSchema = createInsertSchema(voyages).omit({
  id: true,
  createdAt: true,
});

export const insertFuelDataSchema = createInsertSchema(fuelData).omit({
  id: true,
  createdAt: true,
});

export const insertEnvironmentalDataSchema = createInsertSchema(environmentalData).omit({
  id: true,
  createdAt: true,
});

export const insertHullConditionSchema = createInsertSchema(hullCondition).omit({
  id: true,
  createdAt: true,
});

export const insertTrimDataSchema = createInsertSchema(trimData).omit({
  id: true,
  createdAt: true,
});

export const insertComplianceDataSchema = createInsertSchema(complianceData).omit({
  id: true,
  createdAt: true,
});

export const insertAuxiliaryDataSchema = createInsertSchema(auxiliaryData).omit({
  id: true,
  createdAt: true,
});

// Types
export type Ship = typeof ships.$inferSelect;
export type InsertShip = z.infer<typeof insertShipSchema>;
export type Voyage = typeof voyages.$inferSelect;
export type InsertVoyage = z.infer<typeof insertVoyageSchema>;
export type FuelData = typeof fuelData.$inferSelect;
export type InsertFuelData = z.infer<typeof insertFuelDataSchema>;
export type EnvironmentalData = typeof environmentalData.$inferSelect;
export type InsertEnvironmentalData = z.infer<typeof insertEnvironmentalDataSchema>;
export type HullCondition = typeof hullCondition.$inferSelect;
export type InsertHullCondition = z.infer<typeof insertHullConditionSchema>;
export type TrimData = typeof trimData.$inferSelect;
export type InsertTrimData = z.infer<typeof insertTrimDataSchema>;
export type ComplianceData = typeof complianceData.$inferSelect;
export type InsertComplianceData = z.infer<typeof insertComplianceDataSchema>;
export type AuxiliaryData = typeof auxiliaryData.$inferSelect;
export type InsertAuxiliaryData = z.infer<typeof insertAuxiliaryDataSchema>;
