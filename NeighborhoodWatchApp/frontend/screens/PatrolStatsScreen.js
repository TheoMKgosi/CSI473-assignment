import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const PatrolStatsScreen = () => {
  const [stats, setStats] = useState({ completed: 0, response_time: '0 min' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://<your-codespace>.github.dev:8000/api/patrol-stats/', {
          headers: { Authorization: 'Token <your-token>' }
        });
        setStats(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch patrol stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patrol Statistics</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statLabel}>Patrols Completed:</Text>
        <Text style={styles.statValue}>{stats.completed}</Text>
        <Text style={styles.statLabel}>Average Response Time:</Text>
        <Text style={styles.statValue}>{stats.response_time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});

export default PatrolStatsScreen;