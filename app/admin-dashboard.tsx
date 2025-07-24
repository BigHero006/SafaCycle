import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, RelativePathString, ExternalPathString } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

const { width } = Dimensions.get('window');

const AdminDashboard: React.FC = () => {
  const { logout, name } = useAuth();
  const router = useRouter();
  const [selectedMetric, setSelectedMetric] = useState('drivers');

  const stats = {
    totalDrivers: 45,
    activeDrivers: 38,
    totalUsers: 1250,
    activeUsers: 892,
    wasteCollected: 2.8,
    recycledWaste: 2.1,
    pendingReports: 12,
    resolvedReports: 156,
  };

  const recentUpdates = [
    { id: 1, message: 'Driver #23 completed route Alpha-7', time: '2 mins ago', type: 'success' },
    { id: 2, message: 'New user registration: Sarah Johnson', time: '5 mins ago', type: 'info' },
    { id: 3, message: 'Waste collection delayed in Zone C', time: '8 mins ago', type: 'warning' },
    { id: 4, message: 'Monthly recycling target achieved', time: '12 mins ago', type: 'success' },
  ];

  const handleDriverManagement = () => {
    router.push('/driver-management' as RelativePathString);
  };

  const handleWasteReports = () => {
    router.push('/waste-reports' as RelativePathString);
  };

  const handleUserQueries = () => {
    Alert.alert('User Queries', 'Navigating to user queries management...');
  };

  const handleProfile = () => {
    router.push('/admin-profile' as RelativePathString);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => {
          logout();
          router.replace('/welcome');
        }},
      ]
    );
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      default: return '#757575';
    }
  };

  const StatCard: React.FC<{ title: string; value: string; unit?: string; color: string }> = ({ title, value, unit, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statValueContainer}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>{name || 'Admin'}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard title="Total Drivers" value={stats.totalDrivers.toString()} color="#2196F3" />
          <StatCard title="Active Drivers" value={stats.activeDrivers.toString()} color="#4CAF50" />
          <StatCard title="Total Users" value={stats.totalUsers.toString()} color="#9C27B0" />
          <StatCard title="Active Users" value={stats.activeUsers.toString()} color="#FF5722" />
          <StatCard title="Waste Collected" value={stats.wasteCollected.toString()} unit="tons" color="#607D8B" />
          <StatCard title="Recycled" value={stats.recycledWaste.toString()} unit="tons" color="#8BC34A" />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#E3F2FD' }]} onPress={handleDriverManagement}>
            <Text style={styles.actionIcon}>�</Text>
            <Text style={styles.actionTitle}>Driver Management</Text>
            <Text style={styles.actionSubtitle}>Manage drivers and routes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#E8F5E8' }]} onPress={handleWasteReports}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Waste Reports</Text>
            <Text style={styles.actionSubtitle}>View collection analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#FFF3E0' }]} onPress={handleUserQueries}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionTitle}>User Queries</Text>
            <Text style={styles.actionSubtitle}>{stats.pendingReports} pending</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Updates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Updates</Text>
        <View style={styles.updatesList}>
          {recentUpdates.map((update) => (
            <View key={update.id} style={styles.updateItem}>
              <View style={[styles.updateIndicator, { backgroundColor: getUpdateTypeColor(update.type) }]} />
              <View style={styles.updateContent}>
                <Text style={styles.updateMessage}>{update.message}</Text>
                <Text style={styles.updateTime}>{update.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 18,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 18,
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  updatesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  updateIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default AdminDashboard;
