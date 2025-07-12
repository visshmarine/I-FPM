# I-FPM Data Input Guide

## How to Input Data into Your Maritime Fuel Performance Monitoring System

Your I-FPM system has comprehensive API endpoints for inputting all types of vessel performance data. Here are the complete methods:

### 1. Adding New Vessels

**Endpoint:** `POST /api/ships`

**Example data:**
```json
{
  "name": "MV Your Vessel Name",
  "imo": "IMO1234567",
  "type": "Container Ship",
  "deadweight": "85000",
  "enginePower": "22000"
}
```

**Ship Types:** Container Ship, Bulk Carrier, Tanker, General Cargo, Research Vessel

### 2. Creating New Voyages

**Endpoint:** `POST /api/voyages`

**Example data:**
```json
{
  "shipId": 1,
  "voyageNumber": "VOY-2025-001",
  "origin": "Singapore",
  "destination": "Hamburg",
  "departureDate": "2025-07-12T08:00:00.000Z",
  "arrivalDate": null,
  "status": "active"
}
```

### 3. Fuel Performance Data

**Endpoint:** `POST /api/fuel-data`

**Example data:**
```json
{
  "shipId": 1,
  "voyageId": 1,
  "timestamp": "2025-07-12T14:00:00.000Z",
  "sfoc": "185.5",
  "fuelConsumptionRate": "25.8",
  "engineLoadFactor": "78.5",
  "speedThroughWater": "15.2",
  "speedOverGround": "14.8",
  "enginePower": "15700",
  "fuelType": "HFO",
  "co2Emissions": "80.4"
}
```

**Key Metrics Explained:**
- **SFOC**: Specific Fuel Oil Consumption (g/kWh)
- **Fuel Consumption Rate**: Metric tons per day
- **Engine Load Factor**: Percentage (0-100%)
- **Speeds**: In knots
- **Engine Power**: In kW
- **CO2 Emissions**: Tons per day

### 4. Environmental Conditions

**Endpoint:** `POST /api/environmental-data`

**Example data:**
```json
{
  "shipId": 1,
  "voyageId": 1,
  "timestamp": "2025-07-12T14:00:00.000Z",
  "windSpeed": "12.5",
  "waveHeight": "2.1",
  "windDirection": 245,
  "seaState": 3,
  "weatherImpact": "3.2"
}
```

### 5. Hull Condition Data

**Endpoint:** `POST /api/hull-condition`

**Example data:**
```json
{
  "shipId": 1,
  "timestamp": "2025-07-12T14:00:00.000Z",
  "roughnessIndex": "125.8",
  "propellerSlip": "14.2",
  "hullEfficiency": "-2.8",
  "daysSinceLastCleaning": 85,
  "lastCleaningDate": "2025-04-15T00:00:00.000Z"
}
```

### 6. Vessel Trim Data

**Endpoint:** `POST /api/trim-data`

**Example data:**
```json
{
  "shipId": 1,
  "voyageId": 1,
  "timestamp": "2025-07-12T14:00:00.000Z",
  "currentTrim": "1.8",
  "optimalTrim": "1.5",
  "fuelSavingsPotential": "2.3",
  "trimAdjustment": "-0.3"
}
```

### 7. Compliance Data

**Endpoint:** `POST /api/compliance-data`

**Example data:**
```json
{
  "shipId": 1,
  "voyageId": 1,
  "timestamp": "2025-07-12T14:00:00.000Z",
  "ciiRating": "C",
  "ciiValue": "8.45",
  "eeoiValue": "12.8",
  "eeoiTarget": "11.5",
  "complianceStatus": "Warning"
}
```

### 8. Auxiliary Systems Data

**Endpoint:** `POST /api/auxiliary-data`

**Example data:**
```json
{
  "shipId": 1,
  "timestamp": "2025-07-12T14:00:00.000Z",
  "hvacPower": "95.5",
  "pumpsPower": "125.8",
  "lightingPower": "35.2",
  "navigationPower": "45.0",
  "cargoHandlingPower": "85.3",
  "totalAuxiliaryPower": "386.8"
}
```

## How to Use These Endpoints

### Option 1: Using Browser Developer Tools
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Use fetch API to send data:

```javascript
fetch('/api/ships', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: "MV Test Ship",
    imo: "IMO9876543",
    type: "Bulk Carrier",
    deadweight: "95000",
    enginePower: "18500"
  })
}).then(response => response.json()).then(data => console.log(data));
```

### Option 2: Using Tools like Postman or curl
```bash
curl -X POST http://your-app-url/api/ships \
  -H "Content-Type: application/json" \
  -d '{"name":"MV Test Ship","imo":"IMO9876543","type":"Bulk Carrier","deadweight":"95000","enginePower":"18500"}'
```

### Option 3: Integration with Existing Systems
The API endpoints accept standard JSON and can be integrated with:
- Ship management systems
- Engine monitoring equipment
- Weather data feeds
- IoT sensors
- Manual data entry forms

## Data Requirements

**Required Fields:**
- Ship: name, imo, type
- Voyage: shipId, voyageNumber, origin, destination, departureDate, status
- Fuel Data: shipId, timestamp, fuelType
- All timestamps should be in ISO 8601 format

**Optional Fields:**
- Most numeric performance metrics are optional
- Voyage: arrivalDate, voyageId (for other data types)

## Data Validation

The system automatically validates:
- Data types and formats
- Required field presence
- Numeric ranges for performance metrics
- Valid ship and voyage references

## Integration Examples

### Real-time Data Streaming
For continuous monitoring, send data every 15-30 minutes:
- Fuel performance data
- Environmental conditions
- Engine parameters

### Daily Reporting
Submit once per day:
- Hull condition assessments
- Compliance calculations
- Auxiliary system summaries

### Voyage-based Reporting
Submit at voyage milestones:
- Departure data
- Mid-voyage performance
- Arrival statistics

Your I-FPM system is now ready to receive real operational data from your vessels!