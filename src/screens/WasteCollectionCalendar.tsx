import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type WasteType = 'non-renewable' | 'renewable' | 'both';

type PickupSchedule = {
  date: number; // day of month
  wasteType: WasteType;
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Dummy pickup schedules for demonstration
const dummySchedules: Record<string, PickupSchedule[]> = {
  '2024-1': [
    { date: 3, wasteType: 'non-renewable' },
    { date: 10, wasteType: 'renewable' },
    { date: 17, wasteType: 'both' },
    { date: 24, wasteType: 'non-renewable' },
  ],
  '2024-2': [
    { date: 5, wasteType: 'renewable' },
    { date: 12, wasteType: 'both' },
    { date: 19, wasteType: 'non-renewable' },
    { date: 26, wasteType: 'renewable' },
  ],
  // Add more months as needed
};

type RootStackParamList = {
  Home: undefined;
  ScanScreen: undefined;
  LocationScreen: undefined;
  MenuScreen: undefined;
  WasteCollectionCalendar: undefined;
};

const WasteCollectionCalendar: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth()); // 0-based

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const schedules = dummySchedules[`${year}-${monthIndex + 1}`] || [];

  const handleNextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(year + 1);
    } else {
      setMonthIndex(monthIndex + 1);
    }
  };

  const handlePrevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(year - 1);
    } else {
      setMonthIndex(monthIndex - 1);
    }
  };

  const getWasteTypeColor = (wasteType: WasteType) => {
    switch (wasteType) {
      case 'non-renewable':
        return '#e74c3c'; // red
      case 'renewable':
        return '#27ae60'; // green
      case 'both':
        return '#f39c12'; // orange
      default:
        return '#ccc';
    }
  };

  const renderDay = (day: number) => {
    const scheduleForDay = schedules.find(s => s.date === day);
    const bgColor = scheduleForDay ? getWasteTypeColor(scheduleForDay.wasteType) : 'transparent';

    return (
      <View key={day} style={[styles.dayBox, { backgroundColor: bgColor }]}>
        <Text style={styles.dayText}>{day}</Text>
      </View>
    );
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {/* Header with month and navigation button */}
      <View style={styles.header}>
        <Text style={styles.monthText}>{monthNames[monthIndex]} {year}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {daysArray.map(day => renderDay(day))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: getWasteTypeColor('non-renewable') }]} />
          <Text style={styles.legendText}>Non-renewable</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: getWasteTypeColor('renewable') }]} />
          <Text style={styles.legendText}>Renewable</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: getWasteTypeColor('both') }]} />
          <Text style={styles.legendText}>Both</Text>
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Text style={styles.iconText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  navButton: {
    marginLeft: 10,
    backgroundColor: '#',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  navButtonText: {
    color: '#000',
    fontSize: 18,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayBox: {
    width: (width - 40) / 7 - 4,
    height: 40,
    margin: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#000',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 100,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    color: '#000',
    fontWeight: '600',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#a5ceca',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  naviButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#000',
    fontSize: 24,
  },
});

export default WasteCollectionCalendar;
