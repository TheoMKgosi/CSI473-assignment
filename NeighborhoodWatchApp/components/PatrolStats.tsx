import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const PatrolStats = () => {
  const [stats, setStats] = useState({ completed: 0, responseTime: '0' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://your-django-api/patrol-stats/');
        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patrol Statistics</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.text}>Patrols Completed: {stats.completed}</Text>
        <Text style={styles.text}>Average Response Time: {stats.responseTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, color: '#000', fontFamily: 'Inter', textAlign: 'center' },
  statsContainer: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 5, padding: 10, marginVertical: 10 },
  text: { fontSize: 16, color: '#000', fontFamily: 'Inter' },
});

export default PatrolStats;