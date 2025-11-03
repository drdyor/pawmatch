# 🐕 Ovulation Tracking System - PawMatch Mobile

## Overview
Complete ovulation and heat cycle tracking system for female dogs, designed specifically for breeders to monitor fertility windows and optimize breeding timing.

## Features

### 📅 Interactive Calendar
- **Fertile Window Visualization**: Green periods mark optimal breeding days
- **Heat Start Tracking**: Pink dots indicate when heat cycles begin
- **Ovulation Estimation**: Gold markers show estimated ovulation dates
- **Multi-Pet Support**: Track multiple female dogs simultaneously

### 📊 Smart Calculations
- **Automatic Fertile Window**: Calculates 7-16 days after heat start (typical dog cycle)
- **Estimated Ovulation**: Places at day 12-13 of cycle
- **Cycle Prediction**: Estimates next heat cycle (~6 months)
- **Status Indicators**: Real-time cycle status for each dog

### 🔧 User Interface
- **Heat Tracking Dashboard**: Overview of all female dogs and their cycles
- **Individual Pet Calendar**: Detailed calendar view for specific dogs
- **Log Ovulation Screen**: Easy form to record heat cycle start dates
- **Status Cards**: Quick visual status for each dog's current cycle phase

## Database Schema

Uses existing `heat_cycles` table with these fields:
```sql
- pet_id: string (references pets table)
- heat_start_date: date (when bleeding/swelling starts)
- estimated_ovulation: date (calculated ovulation date)
- fertile_window_start: date (start of fertile period)
- fertile_window_end: date (end of fertile period)
- next_heat_estimate: date (predicted next cycle)
- notes: string (optional observations)
```

## Screen Flow

### 1. Heat Tracking Dashboard (`HeatTrackingScreen`)
- **Purpose**: Main dashboard showing all female dogs
- **Features**:
  - List of female dogs with current cycle status
  - Quick action buttons to log new heat cycles
  - Tap to view individual calendar
- **Navigation**: Available as tab in breeder navigation

### 2. Log Ovulation Screen (`LogOvulationScreen`)
- **Purpose**: Record new heat cycle start dates
- **Features**:
  - Dog selection dropdown
  - Interactive calendar to pick heat start date
  - Automatic fertile window calculation
  - Notes field for observations
- **Navigation**: Accessible from dashboard "+" button or individual pet cards

### 3. Individual Calendar View (`OvulationCalendar`)
- **Purpose**: Detailed calendar view for specific dogs
- **Features**:
  - Full month calendar with marked dates
  - Legend explaining color codes
  - Upcoming fertile windows list
  - Event details on date tap

## Color Coding System

- 🔴 **Pink (#FF1493)**: Heat start date
- 🟢 **Green (#32CD32)**: Fertile window period
- 🟡 **Gold (#FFD700)**: Estimated ovulation date
- 🔵 **Blue (#00adf5)**: Selected dates

## Navigation Integration

Added to breeder tab navigation:
```jsx
<Tab.Screen name="Heat Tracking" component={HeatTrackingScreen} />
```

Stack navigation includes:
- `HeatTrackingDashboard`: Main overview screen
- `LogOvulation`: Form to log new cycles
- `HeatTracking`: Existing individual pet tracking (preserved)

## Dependencies Added

```json
{
  "react-native-calendars": "^1.1313.0"
}
```

## Usage Instructions

### For Breeders:
1. **Access**: Tap "Heat Tracking" tab in breeder navigation
2. **Add Dogs**: System automatically shows all female dogs
3. **Log Cycles**: Tap "Log Heat" button on any dog card
4. **Monitor**: View calendar to see fertile windows and ovulation dates
5. **Plan Breeding**: Use green periods for optimal stud bookings

### Data Flow:
1. Breeder selects dog and heat start date
2. System calculates fertile window (days 9-16)
3. Places estimated ovulation marker
4. Saves to database with timestamps
5. Updates all calendar views automatically

## Technical Implementation

### Components Created:
- `OvulationCalendar.tsx`: Reusable calendar component
- `HeatTrackingScreen.tsx`: Main dashboard
- `LogOvulationScreen.tsx`: Data entry form

### Key Features:
- **Real-time Updates**: Calendar refreshes when new data is logged
- **Error Handling**: Graceful fallbacks for missing data
- **Performance**: Efficient queries and local state management
- **Accessibility**: Screen reader friendly with proper labels

## Future Enhancements

- **Push Notifications**: Alerts for upcoming fertile windows
- **Cycle History**: Charts showing historical patterns
- **Breeding Records**: Link to actual breeding outcomes
- **Vet Integration**: Sync with veterinary heat cycle confirmations
- **Export Data**: PDF reports for kennel records

## Testing

To test the system:
1. Add female dogs to your breeder account
2. Navigate to "Heat Tracking" tab
3. Tap "Log New Heat Cycle"
4. Select a dog and pick a heat start date
5. View the calculated fertile window
6. Switch between dogs to see different calendars

## Support

The system uses the existing PawMatch database schema and Supabase integration, ensuring compatibility with all existing breeder features.
