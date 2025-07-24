import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { logout, user, name } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.navigate('Welcome');
          },
        },
      ]
    );
  };

  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName);
  };

  // Admin statistics data
  const stats = [
    { icon: '👥', number: '156', label: 'Total Users' },
    { icon: '🚚', number: '24', label: 'Active Drivers' },
    { icon: '🗺️', number: '8', label: 'Active Routes' },
    { icon: '⚠️', number: '12', label: 'Pending Issues' },
  ];

  const managementButtons = [
    { icon: '👥', title: 'Driver Management', screen: 'DriverManagement' },
    { icon: '📊', title: 'User Analytics', screen: 'UserAnalytics' },
    { icon: '📈', title: 'Waste Reports', screen: 'WasteReports' },
    { icon: '📅', title: 'Collection Calendar', screen: 'CollectionCalendar' },
    { icon: '❓', title: 'User Queries', screen: 'UserQueries' },
    { icon: '⚙️', title: 'Settings', screen: 'AdminSettings' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.textsContainer}>
            <Text style={styles.appName}>SafaCycle Admin</Text>
            <Text style={styles.welcomeMessage}>Welcome, {name || user}!</Text>
            <Text style={styles.subtitle}>Manage your waste collection system</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => handleNavigation('AdminNotifications')}
            >
              <View style={styles.notificationIcon}>
                <Text style={styles.iconText}>🔔</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => handleNavigation('AdminProfile')}
            >
              <View style={styles.profilePicturePlaceholder}>
                <Text style={styles.iconText}>👤</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <View style={styles.statIconPlaceholder}>
                <Text style={styles.iconText}>{stat.icon}</Text>
              </View>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Management Buttons */}
        <View style={styles.buttonsContainer}>
          {managementButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={() => handleNavigation(button.screen)}
            >
              <View style={styles.buttonIconPlaceholder}>
                <Text style={styles.iconText}>{button.icon}</Text>
              </View>
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Updates */}
        <View style={styles.updatesSection}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          <View style={styles.updateCard}>
            <Text style={styles.updateTitle}>5 new driver registrations</Text>
            <Text style={styles.updateTime}>2 hours ago</Text>
          </View>
          <View style={styles.updateCard}>
            <Text style={styles.updateTitle}>Monthly waste report generated</Text>
            <Text style={styles.updateTime}>1 day ago</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => handleNavigation('AdminDashboard')} style={styles.navButton}>
          <Text style={styles.iconText}>🏠</Text>
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('DriverManagement')} style={styles.navButton}>
          <Text style={styles.iconText}>👥</Text>
          <Text style={styles.navText}>Drivers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('WasteReports')} style={styles.navButton}>
          <Text style={styles.iconText}>📊</Text>
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')} style={styles.navButton}>
          {/* Placeholder for Menu Icon */}
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ABE5dA',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerBox: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textsContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#E8F5E9',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 10,
  },
  notificationIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    marginLeft: 5,
  },
  profilePicturePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statBox: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  statIconPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#E8F5E9',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  buttonIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  updatesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  updateCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  updateTime: {
    fontSize: 12,
    color: '#666',
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#A5CECA',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#A5CECA',
    marginTop: 4,
  },
});

export default AdminDashboard;
