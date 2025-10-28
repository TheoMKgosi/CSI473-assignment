import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const HomeScreen = () => {
  // Mock data - in real app, this would come from your backend
  const officerData = {
    name: 'John Smith',
    badgeNumber: 'SG-247',
    shift: 'Night Shift (10 PM - 6 AM)',
    complianceRate: 98.5,
    completedPatrols: 47,
    pendingTasks: 3,
    lastUpdate: '2 hours ago',
  };

  const complianceData = [
    { title: 'On-time Patrols', value: '95%', status: 'Excellent' },
    { title: 'Incident Reports', value: '100%', status: 'Perfect' },
    { title: 'Equipment Check', value: '92%', status: 'Good' },
    { title: 'Client Feedback', value: '4.8/5', status: 'Excellent' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.officerName}>{officerData.name}</Text>
        <Text style={styles.badge}>Badge: {officerData.badgeNumber}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{officerData.complianceRate}%</Text>
            <Text style={styles.statLabel}>Compliance Rate</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{officerData.completedPatrols}</Text>
            <Text style={styles.statLabel}>Completed Patrols</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.pending]}>{officerData.pendingTasks}</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{officerData.shift.split(' ')[0]}</Text>
            <Text style={styles.statLabel}>Current Shift</Text>
          </View>
        </View>
      </View>

      <View style={styles.complianceSection}>
        <Text style={styles.sectionTitle}>Compliance Metrics</Text>
        
        {complianceData.map((item, index) => (
          <View key={index} style={styles.complianceItem}>
            <View>
              <Text style={styles.complianceTitle}>{item.title}</Text>
              <Text style={styles.complianceValue}>{item.value}</Text>
            </View>
            <View style={[styles.statusBadge, 
              { backgroundColor: item.status === 'Excellent' ? '#34C759' : 
                              item.status === 'Perfect' ? '#007AFF' : 
                              item.status === 'Good' ? '#FF9500' : '#FF3B30' }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Start Patrol</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Report Incident</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.updateText}>Last updated: {officerData.lastUpdate}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  officerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  badge: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: 20,
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
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  pending: {
    color: '#FF3B30',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  complianceSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  complianceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  complianceTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  complianceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  updateText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 20,
  },
});

export default HomeScreen;
