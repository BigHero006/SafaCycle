import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const DriverDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
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
    // Handle specific navigation cases
    switch(screenName) {
      case 'AssignedLocations':
        // Navigate to assigned locations screen
        navigation.navigate('AssignedLocations');
        break;
      case 'RouteNavigation':
        // Navigate to route navigation screen
        Alert.alert('Route Navigation', 'Opening GPS navigation...', [
          { text: 'OK', onPress: () => console.log('Route navigation opened') }
        ]);
        break;
      case 'CollectionStatus':
        // Navigate to collection status screen
        Alert.alert('Collection Status', 'Opening collection status...', [
          { text: 'OK', onPress: () => console.log('Collection status opened') }
        ]);
        break;
      case 'DriverNews':
        // Navigate to driver news screen
        navigation.navigate('DriverNews');
        break;
      case 'ReportProblems':
        // Navigate to report problems screen
        navigation.navigate('ReportProblem');
        break;
      case 'DriverSettings':
        // Navigate to driver settings screen
        navigation.navigate('Settings');
        break;
      case 'DriverNotifications':
        // Navigate to notifications screen
        navigation.navigate('NotificationAndAlert');
        break;
      case 'DriverProfile':
        // Navigate to profile screen
        navigation.navigate('ProfileScreen');
        break;
      default:
        // Default navigation for other screens
        navigation.navigate(screenName);
    }
  };

  const handleTaskAction = (taskType: string, action: string) => {
    Alert.alert(
      'Task Action',
      `You have ${action}ed the ${taskType} task.`,
      [{ text: 'OK' }]
    );
  };

  const handleNavigateToTask = (location: string) => {
    Alert.alert(
      'Navigation',
      `Opening GPS navigation to ${location}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Navigate', onPress: () => console.log(`Navigating to ${location}`) }
      ]
    );
  };

  // Driver statistics
  const stats = [
    { icon: '📍', number: '5', label: 'Assigned Locations' },
    { icon: '✅', number: '3', label: 'Completed Today' },
    { icon: '⏰', number: '2', label: 'Pending Tasks' },
    { icon: '🏆', number: '45', label: 'Total Completed' },
  ];

  const driverActions = [
    { icon: '📍', title: 'Assigned Locations', screen: 'AssignedLocations' },
    { icon: '🗺️', title: 'Route Navigation', screen: 'RouteNavigation' },
    { icon: '📋', title: 'Collection Status', screen: 'CollectionStatus' },
    { icon: '📰', title: 'News & Updates', screen: 'DriverNews' },
    { icon: '❓', title: 'Report Problems', screen: 'ReportProblems' },
    { icon: '⚙️', title: 'Settings', screen: 'DriverSettings' },
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
            <Text style={styles.appName}>SafaCycle Driver</Text>
            <Text style={styles.welcomeMessage}>Welcome, {name || user}!</Text>
            <Text style={styles.subtitle}>Ready for today's collections</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => handleNavigation('DriverNotifications')}
            >
              <View style={styles.notificationIcon}>
                <Text style={styles.iconText}>🔔</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => handleNavigation('DriverProfile')}
            >
              <View style={styles.profilePicturePlaceholder}>
                <Text style={styles.iconText}>👤</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsMainContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
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
        </View>

        {/* Quick Actions */}
        <View style={styles.buttonsContainer}>
          {driverActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={() => handleNavigation(action.screen)}
            >
              <View style={styles.buttonIconPlaceholder}>
                <Text style={styles.iconText}>{action.icon}</Text>
              </View>
              <Text style={styles.buttonText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Tasks */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>Residential Area A</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending</Text>
              </View>
            </View>
            <Text style={styles.taskDetails}>Collection time: 9:00 AM - 11:00 AM</Text>
            <Text style={styles.taskDetails}>Houses: 45 | Route distance: 3.2 km</Text>
            <View style={styles.taskActions}>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => handleTaskAction('Residential Area A', 'accept')}
              >
                <Text style={styles.buttonTextWhite}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.denyButton}
                onPress={() => handleTaskAction('Residential Area A', 'deni')}
              >
                <Text style={styles.buttonTextWhite}>Deny</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>Commercial Zone B</Text>
              <View style={[styles.statusBadge, styles.acceptedBadge]}>
                <Text style={styles.statusText}>Accepted</Text>
              </View>
            </View>
            <Text style={styles.taskDetails}>Collection time: 2:00 PM - 4:00 PM</Text>
            <Text style={styles.taskDetails}>Shops: 20 | Route distance: 2.8 km</Text>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={() => handleNavigateToTask('Commercial Zone B')}
            >
              <Text style={styles.buttonTextWhite}>Navigate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => handleNavigation('DriverDashboard')} style={styles.navButton}>
          <Text style={styles.iconText}>🏠</Text>
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('AssignedLocations')} style={styles.navButton}>
          <Text style={styles.iconText}>📍</Text>
          <Text style={styles.navText}>Locations</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('DriverNews')} style={styles.navButton}>
          <Text style={styles.iconText}>📰</Text>
          <Text style={styles.navText}>News</Text>
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
    backgroundColor: '#FFF',
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
    backgroundColor: '#2196F3',
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
    color: '#E3F2FD',
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
  statsMainContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statBox: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 12,
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
    color: '#E3F2FD',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#2196F3',
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
  tasksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  acceptedBadge: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 0.45,
  },
  denyButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 0.45,
  },
  navigateButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonTextWhite: {
    color: '#FFF',
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

export default DriverDashboard;
