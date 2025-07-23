import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout, name } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate('Welcome');
  };

  // Placeholder data for news articles
  const newsArticles = [
    { id: 1, title: 'Waste Management Tips', description: 'Learn how to manage your waste effectively.' },
    { id: 2, title: 'Recycling Benefits', description: 'Discover the benefits of recycling.' },
    { id: 3, title: 'Community Clean-up', description: 'Join local clean-up events in your area.' },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;

  const renderNewsArticles = () => {
    return newsArticles.map((article, index) => (
      <View key={article.id} style={styles.newsCard}>
        {/* Placeholder for News Image */}
        <View style={styles.newsImagePlaceholder}>
          <Text style={styles.iconText}>Image</Text>
        </View>
        <Text style={styles.newsTitle} numberOfLines={1} ellipsizeMode="tail">
          {article.title}
        </Text>
        <Text style={styles.newsDescription} numberOfLines={2} ellipsizeMode="tail">
          {article.description}
        </Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Box containing texts and icons */}
        <View style={styles.headerBox}>
        <View style={styles.textsContainer}>
          <Text style={styles.appName}>Safa Cycle</Text>
          <Text style={styles.welcomeMessage}>Welcome, {name || user}!</Text>
          <Text style={styles.subtitle}>Let's turn your trash into some cash</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('NotificationAndAlert')}
          >
            {/* Notification Icon above profile picture */}
            <View style={styles.notificationIcon}>
              <Text style={styles.iconText}>🔔</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            {/* Profile Picture */}
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.iconText}>Profile Pic</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reward Points Section */}
      <TouchableOpacity
        style={styles.rewardPointsContainer}
        onPress={() => navigation.navigate('ExchangePoints')}
      >
        {/* Placeholder for Reward Icon */}
        <View style={styles.rewardIconPlaceholder}>
          <Text style={styles.iconText}>🏆</Text>
        </View>
        <Text style={styles.rewardPointsText}>You have 120 reward points</Text>
      </TouchableOpacity>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('WasteCollectionCalendar')}
        >
          {/* Placeholder for TrashCalendar Icon */}
          <View style={styles.buttonIconPlaceholder}>
            <Text style={styles.iconText}>📅</Text>
          </View>
          <Text style={styles.buttonText}>Trash Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TrackVehicle')}
        >
          {/* Placeholder for VehicleTrack Icon */}
          <View style={styles.buttonIconPlaceholder}>
            <Text style={styles.iconText}>🚚</Text>
          </View>
          <Text style={styles.buttonText}>Vehicle Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ExchangePoints')}
        >
          {/* Placeholder for ExchangePoints Icon */}
          <View style={styles.buttonIconPlaceholder}>
            <Text style={styles.iconText}>💰</Text>
          </View>
          <Text style={styles.buttonText}>Exchange Points</Text>
        </TouchableOpacity>
      </View>

      {/* News Report Title and See All Button */}
      <View style={styles.newsHeader}>
        <Text style={styles.newsHeaderText}>News Report</Text>
        <TouchableOpacity
          style={styles.blogButton}
          onPress={() => navigation.navigate('Blogs')}
        >
          <Text style={styles.blogButtonText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* News Articles Section */}
      <Animated.ScrollView
        style={styles.newsContainer}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderNewsArticles()}
      </Animated.ScrollView>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          {/* Placeholder for Home Icon */}
          <Text style={styles.iconText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={styles.navButton}>
          {/* Placeholder for Scan Icon */}
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TrackVehicle')} style={styles.navButton}>
          {/* Placeholder for Location Icon */}
          <Text style={styles.iconText}>📍</Text>
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
    paddingBottom: 100, // Add bottom padding for navigation bar
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerBox: {
    flexDirection: 'row',
    backgroundColor: '#4DCB9B',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textsContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 26, // Reduced from 30
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 3,
  },
  welcomeMessage: {
    fontSize: 18, // Reduced from 22
    color: '#000',
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12, // Reduced from 14
    color: '#000',
  },
  iconsContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  notificationButton: {
    marginBottom: 8,
  },
  notificationIcon: {
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {},
  profilePicturePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#000',
    fontSize: 16, // Reduced from 20
  },
  rewardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ABE5DA',
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
  },
  rewardIconPlaceholder: {
    width: 35,
    height: 35,
    backgroundColor: '#FFF',
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardPointsText: {
    color: '#000',
    fontSize: 16, // Reduced from 18
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 3,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonIconPlaceholder: {
    marginBottom: 6,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12, // Added smaller font size
    textAlign: 'center',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsHeaderText: {
    fontSize: 18, // Reduced from 20
    fontWeight: 'bold',
    color: '#000',
  },
  blogButton: {
    backgroundColor: '#ABE5DA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  blogButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12, // Added smaller font size
  },
  newsContainer: {
    flexGrow: 0,
    marginBottom: 15,
    maxHeight: 180, // Limit height to prevent overlap
  },
  newsCard: {
    backgroundColor: '#4DCB9B',
    borderRadius: 15,
    padding: 12,
    marginRight: 12,
    width: width - 100,
    height: 160, // Fixed height to prevent overlap
  },
  newsImagePlaceholder: {
    height: 80, // Reduced from 120
    backgroundColor: '#4e54c8',
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14, // Reduced from 16
    marginBottom: 4,
  },
  newsDescription: {
    color: '#000',
    fontSize: 12, // Reduced from 14
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#BCDC9C',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
  },
});

export default Home;
