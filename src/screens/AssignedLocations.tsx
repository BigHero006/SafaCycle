import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';

const AssignedLocations: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [denyReason, setDenyReason] = useState('');

  // Mock assigned locations data
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: 'Residential Area A',
      address: '123 Main Street, District 1',
      timeSlot: '9:00 AM - 11:00 AM',
      houses: 45,
      distance: '3.2 km',
      status: 'pending',
      priority: 'high',
      wasteType: 'Mixed',
    },
    {
      id: 2,
      name: 'Commercial Zone B',
      address: '456 Business Ave, District 2',
      timeSlot: '2:00 PM - 4:00 PM',
      houses: 20,
      distance: '2.8 km',
      status: 'accepted',
      priority: 'medium',
      wasteType: 'Recyclable',
    },
    {
      id: 3,
      name: 'Shopping Complex C',
      address: '789 Mall Road, District 3',
      timeSlot: '6:00 PM - 8:00 PM',
      houses: 15,
      distance: '4.1 km',
      status: 'pending',
      priority: 'low',
      wasteType: 'Organic',
    },
  ]);

  const handleAcceptLocation = (locationId: number, locationName: string) => {
    Alert.alert(
      'Accept Location',
      `Accept collection request for ${locationName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            setLocations(prev => prev.map(loc => 
              loc.id === locationId ? { ...loc, status: 'accepted' } : loc
            ));
            Alert.alert('Success', 'Location accepted successfully!');
          }
        },
      ]
    );
  };

  const handleDenyLocation = (location: any) => {
    setSelectedLocation(location);
    setShowDenyModal(true);
  };

  const submitDenyReason = () => {
    if (!denyReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for denying this request.');
      return;
    }

    setLocations(prev => prev.map(loc => 
      loc.id === selectedLocation.id ? { ...loc, status: 'denied' } : loc
    ));

    setShowDenyModal(false);
    setDenyReason('');
    setSelectedLocation(null);
    Alert.alert('Success', 'Location denied with reason provided.');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#999';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'denied': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assigned Locations</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Statistics */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{locations.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{locations.filter(l => l.status === 'accepted').length}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{locations.filter(l => l.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Locations List */}
      <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
        {locations.map((location) => (
          <View key={location.id} style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationName}>{location.name}</Text>
              <View style={styles.badges}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(location.priority) }]}>
                  <Text style={styles.badgeText}>{location.priority}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(location.status) }]}>
                  <Text style={styles.badgeText}>{location.status}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.locationAddress}>📍 {location.address}</Text>
            
            <View style={styles.locationDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time:</Text>
                <Text style={styles.detailValue}>{location.timeSlot}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Distance:</Text>
                <Text style={styles.detailValue}>{location.distance}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Collection Points:</Text>
                <Text style={styles.detailValue}>{location.houses}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Waste Type:</Text>
                <Text style={styles.detailValue}>{location.wasteType}</Text>
              </View>
            </View>

            {location.status === 'pending' && (
              <View style={styles.locationActions}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptLocation(location.id, location.name)}
                >
                  <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.denyButton}
                  onPress={() => handleDenyLocation(location)}
                >
                  <Text style={styles.actionButtonText}>Deny</Text>
                </TouchableOpacity>
              </View>
            )}

            {location.status === 'accepted' && (
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => navigation.navigate('RouteNavigation', { location })}
              >
                <Text style={styles.actionButtonText}>Navigate to Location</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Deny Modal */}
      <Modal
        visible={showDenyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDenyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deny Collection Request</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for denying "{selectedLocation?.name}"
            </Text>
            
            <TextInput
              style={styles.reasonInput}
              placeholder="Enter reason..."
              multiline
              numberOfLines={4}
              value={denyReason}
              onChangeText={setDenyReason}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowDenyModal(false);
                  setDenyReason('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={submitDenyReason}
              >
                <Text style={styles.modalSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('DriverDashboard')} style={styles.navButton}>
          <Text style={styles.iconText}>🏠</Text>
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AssignedLocations')} style={styles.navButton}>
          <Text style={styles.iconText}>📍</Text>
          <Text style={styles.navText}>Locations</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DriverNews')} style={styles.navButton}>
          <Text style={styles.iconText}>📰</Text>
          <Text style={styles.navText}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DriverSettings')} style={styles.navButton}>
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
    backgroundColor: '#2196F3',
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
  placeholder: {
    width: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#2196F3',
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
    color: '#E3F2FD',
    marginTop: 5,
  },
  locationsList: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  locationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badges: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  locationDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.48,
  },
  denyButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.48,
  },
  navigateButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 100,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: '#999',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.45,
  },
  modalSubmitButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.45,
  },
  modalCancelText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubmitText: {
    color: '#FFF',
    fontSize: 14,
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
    backgroundColor: '#2196F3',
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

export default AssignedLocations;
