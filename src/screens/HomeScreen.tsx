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
        <Text style={styles.newsTitle}>{article.title}</Text>
        <Text style={styles.newsDescription}>{article.description}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')} style={styles.navButton}>
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
    backgroundColor: '#4e54c8',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerBox: {
    flexDirection: 'row',
    backgroundColor: '#6a11cb',
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
    fontSize: 30, // decreased by 2 from 32
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeMessage: {
    fontSize: 22, // decreased by 2 from 24
    color: '#fff',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14, // decreased by 2 from 16
    color: '#ddd',
  },
  iconsContainer: {
    alignItems: 'center',
    marginLeft: 15,
  },
  notificationButton: {
    marginBottom: 10,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#4e54c8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {},
  profilePicturePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#4e54c8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 18,
  },
  rewardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a11cb',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  rewardIconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#4e54c8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rewardPointsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#6a11cb',
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonIconPlaceholder: {
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  newsHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  blogButton: {
    backgroundColor: '#6a11cb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  blogButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  newsContainer: {
    flexGrow: 0,
    marginBottom: 20,
  },
  newsCard: {
    backgroundColor: '#6a11cb',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: width - 80,
  },
  newsImagePlaceholder: {
    height: 120,
    backgroundColor: '#4e54c8',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  newsDescription: {
    color: '#ddd',
    fontSize: 14,
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
});

export default Home;
