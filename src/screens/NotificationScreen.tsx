import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const notifications = [
  {
    id: '1',
    type: 'error',
    message: 'Error in system detected',
    date: '2024-06-01',
  },
  {
    id: '2',
    type: 'update',
    message: 'System updated successfully',
    date: '2024-06-02',
  },
  {
    id: '3',
    type: 'error',
    message: 'Critical error occurred',
    date: '2024-06-03',
  },
  {
    id: '4',
    type: 'update',
    message: 'New features added',
    date: '2024-06-04',
  },
];

const NotificationAndAlert: React.FC<{ navigation: any }> = ({ navigation }) => {
  const renderItem = ({ item }: { item: typeof notifications[0] }) => {
    const iconName = item.type === 'error' ? 'error-outline' : 'notifications-none';
    const iconColor = item.type === 'error' ? '#ff4d4d' : '#4e54c8';

    return (
      <View style={styles.notificationBox}>
        <MaterialIcons name={iconName} size={24} color={iconColor} style={styles.icon} />
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
       <View style={styles.bottomNavBar}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
                {/* Placeholder for Home Icon */}
                <Text style={styles.iconText}>🏠</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={styles.navButton}>
                {/* Placeholder for Scan Icon */}
                <Text style={styles.iconText}>📷</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')} style={styles.navButton}>
                {/* Placeholder for Location Icon */}
                <Text style={styles.iconText}>📍</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')} style={styles.navButton}>
                {/* Placeholder for Menu Icon */}
                <Text style={styles.iconText}>☰</Text>
              </TouchableOpacity>
              </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4e54c8',
  },
  listContent: {
    padding: 20,
  },
  notificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a11cb',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  date: {
    color: '#ddd',
    fontSize: 12,
    marginLeft: 10,
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default NotificationAndAlert;
