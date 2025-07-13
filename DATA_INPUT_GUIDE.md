# Data Input Guide for I-FPM System

## Excel/CSV Data Upload Tool

The I-FPM system includes a comprehensive data upload tool that allows you to import historical vessel performance data from Excel spreadsheets (.xlsx, .xls) or CSV files.

## Supported Data Types

### 1. Ships Data
Import vessel information including:
- Vessel Name
- IMO Number
- Ship Type
- Deadweight (MT)
- Engine Power (kW)
- Length, Beam, Draught (m)

### 2. Voyages Data
Import voyage information:
- Ship ID
- Voyage Number
- Departure/Arrival Ports
- Start/End Dates

### 3. Fuel Performance Data
Import operational fuel data:
- SFOC (g/kWh)
- Fuel Consumption Rate (MT/day)
- Engine Load Factor (%)
- Speed Through Water (knots)
- Speed Over Ground (knots)
- Engine Power (kW)
- CO2 Emissions (MT/day)

### 4. Environmental Data
Import weather conditions:
- Wind Speed (knots)
- Wave Height (m)
- Wind Direction (degrees)
- Sea State (0-9)
- Weather Impact (%)

### 5. Hull Condition Data
Import hull performance metrics:
- Hull Roughness Index
- Propeller Slip (%)
- Hull Efficiency (%)
- Days Since Last Cleaning
- Last Cleaning Date

## How to Use the Upload Tool

### Step 1: Access the Tool
1. Go to Dashboard
2. Click "Data Input & Tools" button
3. Select "Bulk Upload" tab

### Step 2: Prepare Your Data
1. Download sample templates from the "Templates" tab
2. Match your column headers to the expected format
3. Ensure data types are correct (numbers, dates, text)

### Step 3: Upload and Process
1. Select your Excel or CSV file
2. Choose the appropriate data type
3. Review column mapping (or customize if needed)
4. Click "Upload and Process Data"

## Column Mapping

### Automatic Mapping
The system automatically maps common column names to database fields:
- "Vessel Name" → name
- "IMO Number" → imo
- "SFOC (g/kWh)" → sfoc
- "Date" → timestamp

### Custom Mapping
For non-standard column names, you can provide custom JSON mapping:

```json
{
  "dataType": "fuel",
  "columnMappings": {
    "Your Column Name": "database_field",
    "Fuel Consumption": "fuelConsumptionRate",
    "Ship Speed": "speedThroughWater"
  },
  "skipRows": 1
}
```

## Data Validation

The system validates uploaded data to ensure:
- Required fields are present
- Data types are correct
- Date formats are valid
- Numeric values are within reasonable ranges

## Error Handling

If upload fails:
1. Check the error messages in the results panel
2. Verify column names match expected format
3. Ensure data types are correct
4. Check for missing required fields
5. Download and use sample templates

## File Limits

- Maximum file size: 10 MB
- Supported formats: .xlsx, .xls, .csv
- No limit on number of records

## Sample Data Templates

Download pre-formatted templates with correct column headers:
- Ships Template
- Voyages Template  
- Fuel Performance Template
- Environmental Data Template
- Hull Condition Template

## Tips for Success

1. **Use Templates**: Start with provided templates for best results
2. **Check Data Types**: Ensure numbers are formatted as numbers, not text
3. **Date Formats**: Use ISO format (YYYY-MM-DD) or Excel date format
4. **Required Fields**: Ships need name and IMO, fuel data needs ship ID and SFOC
5. **Batch Processing**: Large files are processed in batches for better performance

## Integration with Real-time Data

Uploaded historical data integrates seamlessly with:
- Real-time IoT sensor feeds
- Live performance monitoring
- Trend analysis and forecasting
- Hull performance calculations
- Environmental impact assessments

The uploaded data becomes part of your vessel's performance history and is used for baseline comparisons and predictive analytics.