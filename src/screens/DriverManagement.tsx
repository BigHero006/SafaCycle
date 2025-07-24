import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';

const DriverManagement: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');

  // Mock driver data
  const [drivers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.driver@gmail.com',
      phone: '+1234567890',
      status: 'active',
      assignedRoutes: 3,
      completedTasks: 45,
      location: 'Zone A',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.driver@gmail.com',
      phone: '+1234567891',
      status: 'active',
      assignedRoutes: 2,
      completedTasks: 32,
      location: 'Zone B',
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.driver@gmail.com',
      phone: '+1234567892',
      status: 'inactive',
      assignedRoutes: 1,
      completedTasks: 18,
      location: 'Zone C',
    },
  ]);

  const handleAssignLocation = (driverId: number, driverName: string) => {
    Alert.alert(
      'Assign Location',
      `Assign new collection location to ${driverName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Assign', 
          onPress: () => {
            Alert.alert('Success', 'Location assigned successfully!');
          }
        },
      ]
    );
  };

  const handleViewDetails = (driver: any) => {
    Alert.alert(
      'Driver Details',
      `Name: ${driver.name}\nEmail: ${driver.email}\nPhone: ${driver.phone}\nStatus: ${driver.status}\nCompleted Tasks: ${driver.completedTasks}`,
      [{ text: 'OK' }]
    );
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchText.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search drivers..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Statistics */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{drivers.length}</Text>
          <Text style={styles.statLabel}>Total Drivers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{drivers.filter(d => d.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{drivers.filter(d => d.status === 'inactive').length}</Text>
          <Text style={styles.statLabel}>Inactive</Text>
        </View>
      </View>

      {/* Drivers List */}
      <ScrollView style={styles.driversList} showsVerticalScrollIndicator={false}>
        {filteredDrivers.map((driver) => (
          <View key={driver.id} style={styles.driverCard}>
            <View style={styles.driverHeader}>
              <View style={styles.driverAvatar}>
                <Text style={styles.avatarText}>{driver.name.charAt(0)}</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverEmail}>{driver.email}</Text>
                <Text style={styles.driverLocation}>📍 {driver.location}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                driver.status === 'active' ? styles.activeBadge : styles.inactiveBadge
              ]}>
                <Text style={styles.statusText}>{driver.status}</Text>
              </View>
            </View>

            <View style={styles.driverStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{driver.assignedRoutes}</Text>
                <Text style={styles.statText}>Routes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{driver.completedTasks}</Text>
                <Text style={styles.statText}>Completed</Text>
              </View>
            </View>

            <View style={styles.driverActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleViewDetails(driver)}
              >
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.assignButton]}
                onPress={() => handleAssignLocation(driver.id, driver.name)}
              >
                <Text style={styles.actionButtonText}>Assign Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#E8F5E9',
    marginTop: 5,
  },
  driversList: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  driverCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  driverEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  driverLocation: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  inactiveBadge: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  driverStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  assignButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default DriverManagement;
