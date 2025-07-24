import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

const DriverNews: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();

  // Mock news data
  const newsArticles = [
    {
      id: 1,
      title: 'New Waste Collection Routes Announced',
      summary: 'The city has announced new optimized routes for better efficiency and reduced travel time.',
      time: '2 hours ago',
      category: 'Route Updates',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Safety Guidelines for Hazardous Waste',
      summary: 'Important safety protocols when handling hazardous materials during collection.',
      time: '5 hours ago',
      category: 'Safety',
      priority: 'high',
    },
    {
      id: 3,
      title: 'Driver Incentive Program Launch',
      summary: 'New reward system for drivers with excellent performance and customer ratings.',
      time: '1 day ago',
      category: 'Incentives',
      priority: 'medium',
    },
    {
      id: 4,
      title: 'Mobile App Update Available',
      summary: 'Version 2.1 includes improved navigation and real-time traffic updates.',
      time: '2 days ago',
      category: 'Technology',
      priority: 'medium',
    },
    {
      id: 5,
      title: 'Weekly Collection Schedule Changes',
      summary: 'Temporary schedule adjustments for holiday period affecting Zone A and B.',
      time: '3 days ago',
      category: 'Schedule',
      priority: 'low',
    },
    {
      id: 6,
      title: 'Eco-Friendly Vehicle Initiative',
      summary: 'Introduction of electric waste collection vehicles in pilot program.',
      time: '1 week ago',
      category: 'Environment',
      priority: 'low',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#999';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Route Updates': return '🗺️';
      case 'Safety': return '⚠️';
      case 'Incentives': return '🏆';
      case 'Technology': return '📱';
      case 'Schedule': return '📅';
      case 'Environment': return '🌱';
      default: return '📰';
    }
  };

  const handleReadMore = (article: any) => {
    // Navigate to detailed article view
    // For now, just show an alert
    navigation.navigate('NewsDetail', { article });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News & Updates</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationText}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Priority News Banner */}
      <View style={styles.priorityBanner}>
        <Text style={styles.bannerIcon}>⚡</Text>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Important Update</Text>
          <Text style={styles.bannerText}>New safety protocols effective immediately</Text>
        </View>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* News List */}
      <ScrollView style={styles.newsList} showsVerticalScrollIndicator={false}>
        {newsArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.newsCard}
            onPress={() => handleReadMore(article)}
          >
            <View style={styles.newsHeader}>
              <View style={styles.newsCategory}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(article.category)}</Text>
                <Text style={styles.categoryText}>{article.category}</Text>
              </View>
              <View style={styles.newsTime}>
                <View style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor(article.priority) }
                ]} />
                <Text style={styles.timeText}>{article.time}</Text>
              </View>
            </View>

            <Text style={styles.newsTitle}>{article.title}</Text>
            <Text style={styles.newsSummary}>{article.summary}</Text>

            <View style={styles.newsFooter}>
              <Text style={styles.readMoreText}>Read more →</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Load More Button */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More Articles</Text>
        </TouchableOpacity>
      </ScrollView>

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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 18,
  },
  priorityBanner: {
    backgroundColor: '#F44336',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  bannerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  newsList: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  newsCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  newsTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    alignItems: 'flex-end',
  },
  readMoreText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loadMoreText: {
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

export default DriverNews;
