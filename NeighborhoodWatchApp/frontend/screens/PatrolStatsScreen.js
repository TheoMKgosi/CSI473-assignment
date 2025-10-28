import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PatrolStatsScreen() {
  const [stats, setStats] = useState({ completed: 0, response_time: 'N/A' });

  useEffect(() => {
    setStats({ completed: 12, response_time: '4.2 min' });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patrol Statistics</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Patrols Completed</Text>
        <Text style={styles.value}>{stats.completed}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Avg. Response Time</Text>
        <Text style={styles.value}>{stats.response_time}</Text>
      </View>

      <Text style={styles.note}>Last updated: just now</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30 },
  box: { backgroundColor: '#f0f8ff', padding: 20, borderRadius: 12, marginVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: '#61a3d2' },
  label: { fontSize: 16, color: '#555', marginBottom: 8 },
  value: { fontSize: 32, fontWeight: 'bold', color: '#61a3d2' },
  note: { textAlign: 'center', color: '#888', marginTop: 20, fontSize: 12 },
});