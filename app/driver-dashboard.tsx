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
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

const { width } = Dimensions.get('window');

const DriverDashboard: React.FC = () => {
  const { logout, name } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([
    { id: 1, area: 'Residential Zone A', status: 'pending', priority: 'high', time: '09:00 AM' },
    { id: 2, area: 'Commercial District B', status: 'in-progress', priority: 'medium', time: '11:30 AM' },
    { id: 3, area: 'Industrial Park C', status: 'completed', priority: 'low', time: '02:00 PM' },
  ]);

  const stats = {
    assignedLocations: 15,
    completedToday: 12,
    pending: 3,
    totalCompleted: 156,
  };

  const newsUpdates = [
    { id: 1, title: 'New Collection Schedule', content: 'Updated timing for Zone A collections', time: '1h ago' },
    { id: 2, title: 'Route Optimization', content: 'New optimized routes available', time: '3h ago' },
    { id: 3, title: 'Safety Guidelines', content: 'Updated safety protocols for drivers', time: '1d ago' },
  ];

  const handleTaskAction = (taskId: number, action: 'accept' | 'deny') => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: action === 'accept' ? 'in-progress' : 'denied' }
          : task
      )
    );
    Alert.alert('Task Updated', `Task ${action === 'accept' ? 'accepted' : 'denied'} successfully`);
  };

  const handleNavigateToRoute = (area: string) => {
    Alert.alert('Navigation', `Opening route to ${area}...`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => {
          logout();
          router.replace('Welcome');
        }},
      ]
    );
  };

  const navigateTo = (screen: string) => {
    router.push(screen);
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'pending': return '#2196F3';
      case 'denied': return '#F44336';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const StatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.driverName}>{name || 'Driver'}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigateTo('/ProfileScreen')}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grouped Stats Box */}
      <View style={styles.statsBox}>
        <StatItem label="Assigned Locations" value={stats.assignedLocations} />
        <StatItem label="Completed Today" value={stats.completedToday} />
        <StatItem label="Pending" value={stats.pending} />
        <StatItem label="Total Completed" value={stats.totalCompleted} />
      </View>

      {/* Task Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assigned Tasks</Text>
        <View style={styles.tasksList}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskArea}>{task.area}</Text>
                  <Text style={styles.taskTime}>{task.time}</Text>
                </View>
                <View style={styles.taskBadges}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                    <Text style={styles.priorityText}>{task.priority}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getTaskStatusColor(task.status) }]}>
                    <Text style={styles.statusText}>{task.status}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.taskActions}>
                {task.status === 'pending' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                      onPress={() => handleTaskAction(task.id, 'accept')}
                    >
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                      onPress={() => handleTaskAction(task.id, 'deny')}
                    >
                      <Text style={styles.actionButtonText}>Deny</Text>
                    </TouchableOpacity>
                  </>
                )}
                {task.status === 'in-progress' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                    onPress={() => handleNavigateToRoute(task.area)}
                  >
                    <Text style={styles.actionButtonText}>Navigate</Text>
                  </TouchableOpacity>
                )}
                {task.status === 'completed' && (
                  <View style={[styles.actionButton, { backgroundColor: '#4CAF50', opacity: 0.6 }]}>
                    <Text style={styles.actionButtonText}>✓ Completed</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* News & Updates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>News & Updates</Text>
        <View style={styles.newsList}>
          {newsUpdates.map((news) => (
            <View key={news.id} style={styles.newsCard}>
              <Text style={styles.newsTitle}>{news.title}</Text>
              <Text style={styles.newsContent}>{news.content}</Text>
              <Text style={styles.newsTime}>{news.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('AssignedLocations')}>
          <Text style={styles.navButtonText}>Assigned Locations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('TrackVehicle')}>
          <Text style={styles.navButtonText}>Route Navigation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('DriverDashboard')}>
          <Text style={styles.navButtonText}>Collection Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('ReportProblem')}>
          <Text style={styles.navButtonText}>Report Problems</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('DriverNews')}>
          <Text style={styles.navButtonText}>News and Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Settings')}>
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
          <Text style={styles.navButtonText}>Logout</Text>
        </TouchableOpacity>
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
  driverName: {
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
  statsBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
    borderTopWidth: 4,
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
  tasksList: {
    gap: 15,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  taskInfo: {
    flex: 1,
  },
  taskArea: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
  },
  taskBadges: {
    gap: 5,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  priorityText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  newsList: {
    gap: 15,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  newsContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  newsTime: {
    fontSize: 12,
    color: '#999',
  },
  navBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    marginTop: 20,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    margin: 5,
    minWidth: 110,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DriverDashboard;
