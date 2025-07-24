import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const WasteReports: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Mock waste reports data
  const wasteData = {
    monthly: {
      collected: 1250,
      disposed: 1180,
      recycled: 320,
      organic: 480,
      plastic: 220,
      paper: 180,
      glass: 50,
    },
    weekly: {
      collected: 320,
      disposed: 295,
      recycled: 85,
      organic: 125,
      plastic: 58,
      paper: 42,
      glass: 10,
    },
    daily: {
      collected: 45,
      disposed: 42,
      recycled: 12,
      organic: 18,
      plastic: 8,
      paper: 6,
      glass: 1,
    },
  };

  const currentData = wasteData[selectedPeriod as keyof typeof wasteData];

  const handleGenerateReport = () => {
    Alert.alert(
      'Generate Report',
      `Generate ${selectedPeriod} waste collection report?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            Alert.alert('Success', `${selectedPeriod} report generated successfully!`);
          }
        },
      ]
    );
  };

  const reportTypes = [
    { id: 'collected', label: 'Total Collected', icon: '📦', color: '#2196F3' },
    { id: 'disposed', label: 'Disposed', icon: '🗑️', color: '#F44336' },
    { id: 'recycled', label: 'Recycled', icon: '♻️', color: '#4CAF50' },
  ];

  const wasteTypes = [
    { id: 'organic', label: 'Organic Waste', icon: '🍎', color: '#8BC34A' },
    { id: 'plastic', label: 'Plastic', icon: '🥤', color: '#FF5722' },
    { id: 'paper', label: 'Paper', icon: '📄', color: '#795548' },
    { id: 'glass', label: 'Glass', icon: '🍾', color: '#607D8B' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Waste Reports</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={handleGenerateReport}>
          <Text style={styles.downloadText}>📊</Text>
        </TouchableOpacity>
      </View>

      {/* Period Selection */}
      <View style={styles.periodSelector}>
        {['daily', 'weekly', 'monthly'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedPeriod
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period && styles.selectedPeriodText
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Stats */}
        <View style={styles.statsContainer}>
          {reportTypes.map((type) => (
            <View key={type.id} style={[styles.statCard, { backgroundColor: type.color }]}>
              <Text style={styles.statIcon}>{type.icon}</Text>
              <Text style={styles.statNumber}>
                {currentData[type.id as keyof typeof currentData]} kg
              </Text>
              <Text style={styles.statLabel}>{type.label}</Text>
            </View>
          ))}
        </View>

        {/* Waste Types Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Waste Types Breakdown</Text>
          {wasteTypes.map((type) => (
            <View key={type.id} style={styles.wasteTypeCard}>
              <View style={styles.wasteTypeHeader}>
                <View style={styles.wasteTypeInfo}>
                  <Text style={styles.wasteTypeIcon}>{type.icon}</Text>
                  <Text style={styles.wasteTypeName}>{type.label}</Text>
                </View>
                <Text style={styles.wasteTypeAmount}>
                  {currentData[type.id as keyof typeof currentData]} kg
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(currentData[type.id as keyof typeof currentData] / currentData.collected) * 100}%`,
                      backgroundColor: type.color,
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Recent Collections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Collections</Text>
          {[
            { driver: 'John Smith', location: 'Residential Area A', amount: '45 kg', time: '2 hours ago' },
            { driver: 'Sarah Johnson', location: 'Commercial Zone B', amount: '32 kg', time: '4 hours ago' },
            { driver: 'Mike Davis', location: 'Shopping Complex C', amount: '28 kg', time: '6 hours ago' },
          ].map((collection, index) => (
            <View key={index} style={styles.collectionCard}>
              <View style={styles.collectionHeader}>
                <Text style={styles.collectionDriver}>{collection.driver}</Text>
                <Text style={styles.collectionTime}>{collection.time}</Text>
              </View>
              <Text style={styles.collectionLocation}>📍 {collection.location}</Text>
              <Text style={styles.collectionAmount}>📦 {collection.amount}</Text>
            </View>
          ))}
        </View>

        {/* Report Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleGenerateReport}>
            <Text style={styles.actionButtonText}>📊 Generate Full Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.exportButton]}
            onPress={() => Alert.alert('Export', 'Report exported successfully!')}
          >
            <Text style={styles.actionButtonText}>📤 Export Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('AdminDashboard')} style={styles.navButton}>
          <Text style={styles.iconText}>🏠</Text>
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DriverManagement')} style={styles.navButton}>
          <Text style={styles.iconText}>👥</Text>
          <Text style={styles.navText}>Drivers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('WasteReports')} style={styles.navButton}>
          <Text style={styles.iconText}>📊</Text>
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminSettings')} style={styles.navButton}>
          <Text style={styles.iconText}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  selectedPeriod: {
    backgroundColor: '#4CAF50',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedPeriodText: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  wasteTypeCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  wasteTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wasteTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wasteTypeIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  wasteTypeName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  wasteTypeAmount: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  collectionCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionDriver: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  collectionTime: {
    fontSize: 12,
    color: '#999',
  },
  collectionLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  collectionAmount: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  navText: {
    fontSize: 10,
    color: '#FFF',
    marginTop: 4,
  },
});

export default WasteReports;
