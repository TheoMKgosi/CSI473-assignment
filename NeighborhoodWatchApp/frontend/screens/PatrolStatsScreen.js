import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const PatrolStatsScreen = ({ route }) => {
  const { token } = route.params || {};
  const [stats, setStats] = useState({ completed: 0, response_time: '0 min' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          'https://super-palm-tree-69499prjx6rp24xg7.github.dev:8000/api/patrol-stats/',
          { headers: { Authorization: `Token ${token}` } }
        );
        setStats(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch patrol stats');
      }
    };
    if (token) fetchStats();
  }, [token]);

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
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
  },
  statsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#61a3d2',
    borderRadius: 10,
  },
  statLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginVertical: 5,
  },
  statValue: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
});

export default PatrolStatsScreen;