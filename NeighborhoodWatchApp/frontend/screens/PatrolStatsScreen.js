import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PatrolStatsScreen = () => {
  const [stats, setStats] = useState({ 
    completed: 0, 
    response_time: 'N/A',
    coverage: 0,
    incidents: 0
  });

  useEffect(() => {
    setStats({
      completed: 12,
      response_time: '4.2 min',
      coverage: 85,
      incidents: 2
    });
  }, []);

  const statCards = [
    {
      title: 'Patrols Completed',
      value: stats.completed,
      icon: '🛡️',
      color: '#61a3d2'
    },
    {
      title: 'Avg Response Time',
      value: stats.response_time,
      icon: '⏱️',
      color: '#4CAF50'
    },
    {
      title: 'Area Coverage',
      value: `${stats.coverage}%`,
      icon: '🗺️',
      color: '#FF9800'
    },
    {
      title: 'Incidents Reported',
      value: stats.incidents,
      icon: '📝',
      color: '#F44336'
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Security Dashboard</Text>
        <Text style={styles.subtitle}>Real-time patrol statistics</Text>
      </View>

      <View style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <Text style={styles.icon}>{stat.icon}</Text>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Monthly Summary</Text>
        <View style={styles.reportCard}>
          <Text style={styles.reportText}>✅ All patrol routes completed on schedule</Text>
          <Text style={styles.reportText}>📊 Response time improved by 12% this month</Text>
          <Text style={styles.reportText}>👥 45 active community participants</Text>
          <Text style={styles.reportText}>🛡️ 98% of residents feel safer this month</Text>
          <Text style={styles.reportText}>📱 App usage increased by 25%</Text>
        </View>
      </View>

      <Text style={styles.updateNote}>Last updated: Today at 14:30</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '600', 
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 5,
  },
  statLabel: { 
    fontSize: 12, 
    color: '#666',
    textAlign: 'center',
  },
  reportSection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  reportCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    lineHeight: 20,
  },
  updateNote: { 
    textAlign: 'center', 
    color: '#888', 
    fontSize: 12, 
    marginTop: 10,
    marginBottom: 20,
  },
});

export default PatrolStatsScreen;