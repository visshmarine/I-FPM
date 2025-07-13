# Hull Roughness Index and Hull Efficiency Calculations

## Hull Roughness Index (HRI)

### Definition
Hull Roughness Index measures the surface condition of a ship's hull, indicating fouling and corrosion levels that affect hydrodynamic performance.

### Calculation Methods

#### 1. Power-Based Method (Most Common)
```
HRI = (P_current / P_baseline) × 100
```
Where:
- P_current = Current power consumption at standard conditions
- P_baseline = Power consumption with clean hull at same conditions

#### 2. Speed-Based Method
```
HRI = (V_baseline / V_current)² × 100
```
Where:
- V_baseline = Speed with clean hull at standard power
- V_current = Current speed at same power

#### 3. Resistance-Based Method
```
HRI = (R_current / R_baseline) × 100
```
Where:
- R_current = Current total resistance
- R_baseline = Baseline resistance with clean hull

### Typical Values
- Clean hull: 100-110
- Light fouling: 110-125
- Moderate fouling: 125-150
- Heavy fouling: 150-200+

## Hull Efficiency Calculation

### Definition
Hull efficiency represents the percentage change in performance compared to baseline clean hull condition.

### Formula
```
Hull Efficiency = ((P_baseline - P_current) / P_baseline) × 100
```

### Alternative (SFOC-based)
```
Hull Efficiency = ((SFOC_current - SFOC_baseline) / SFOC_baseline) × 100
```

### Interpretation
- Positive values: Performance degradation (efficiency loss)
- Negative values: Performance improvement (rare, usually measurement error)
- Typical range: 0% to +25% for commercial vessels

## Practical Implementation

### Required Data Points
1. Current power consumption (kW)
2. Current speed (knots)
3. Current SFOC (g/kWh)
4. Baseline values from clean hull condition
5. Sea state and weather conditions
6. Draft and trim conditions

### Weather Correction
Apply ISO 15016 corrections for:
- Wind speed and direction
- Wave height and period
- Water depth
- Current

### Example Calculation

**Baseline Condition (Clean Hull):**
- Power: 8,500 kW
- Speed: 14.2 knots
- SFOC: 182 g/kWh

**Current Condition:**
- Power: 9,200 kW
- Speed: 14.2 knots
- SFOC: 197 g/kWh

**Hull Roughness Index:**
HRI = (9,200 / 8,500) × 100 = 108.2

**Hull Efficiency:**
Hull Efficiency = ((197 - 182) / 182) × 100 = +8.2%

This indicates 8.2% performance degradation due to hull fouling.

## Monitoring Recommendations

### Frequency
- Daily: For critical vessels
- Weekly: For standard operations
- After dry dock: Establish new baseline

### Thresholds
- HRI > 120: Consider hull cleaning
- HRI > 150: Urgent hull maintenance required
- Hull Efficiency > 10%: Economic cleaning point

### Integration with Performance Monitoring
- Trend analysis over time
- Correlation with fuel consumption
- Maintenance planning optimization
- ROI calculation for hull cleaning