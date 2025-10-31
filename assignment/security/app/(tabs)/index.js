import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../utils/api';
import { showAlert, showError, showSuccess } from '../../utils/alert';

const HomeScreen = () => {
  const [officerData, setOfficerData] = useState(null);
  const [complianceData, setComplianceData] = useState([
    { title: 'On-time Patrols', value: '0%', status: 'No Data' },
    { title: 'Incident Reports', value: '0%', status: 'No Data' },
    { title: 'Equipment Check', value: '0%', status: 'No Data' },
    { title: 'Client Feedback', value: 'N/A', status: 'No Data' },
  ]);
  const [panicAlerts, setPanicAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const defaultOfficerData = {
    name: 'Security Officer',
    badgeNumber: 'Not assigned',
    complianceRate: 0,
    completedPatrols: 0,
    lastUpdate: 'Just now',
  };

  const loadOfficerData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token || token === 'demo-token') {
        // Demo mode or no token
        setOfficerData({
          ...defaultOfficerData,
          name: 'Demo Officer',
          badgeNumber: 'DEMO-001',
          shift: 'Demo Shift',
          complianceRate: 98.5,
          completedPatrols: 47,
          pendingTasks: 3,
        });
        setComplianceData([
          { title: 'On-time Patrols', value: '95%', status: 'Excellent' },
          { title: 'Incident Reports', value: '80%', status: 'Good' },
          { title: 'Equipment Check', value: '100%', status: 'Excellent' },
          { title: 'Client Feedback', value: '92%', status: 'Excellent' },
        ]);
        setPanicAlerts([]); // No demo alerts
        return;
      }

      // Get actual officer profile from API
      const profileResponse = await api.getOfficerProfile();
      const profileData = profileResponse.profile;
      const userData = profileResponse.user;

       // Get compliance data
       const complianceResponse = await api.getComplianceData();

       // Get panic alerts
       const alertsResponse = await api.getPanicAlerts();
       setPanicAlerts(alertsResponse.alerts || []);

      setOfficerData({
        ...defaultOfficerData,
        name: `${userData.first_name} ${userData.last_name}`,
        badgeNumber: profileData.employee_id,
        complianceRate: complianceResponse.compliance_rate,
        completedPatrols: complianceResponse.completed_patrols,
      });

      // Update compliance metrics
      const metrics = complianceResponse.compliance_metrics;
      setComplianceData([
        {
          title: 'On-time Patrols',
          value: `${metrics.on_time_patrols}%`,
          status: metrics.on_time_patrols >= 80 ? 'Excellent' : metrics.on_time_patrols >= 60 ? 'Good' : 'Needs Improvement'
        },
        {
          title: 'Incident Reports',
          value: `${metrics.incident_reports}%`,
          status: metrics.incident_reports >= 80 ? 'Excellent' : metrics.incident_reports >= 60 ? 'Good' : 'Needs Improvement'
        },
        {
          title: 'Equipment Check',
          value: `${metrics.equipment_check}%`,
          status: metrics.equipment_check >= 80 ? 'Excellent' : metrics.equipment_check >= 60 ? 'Good' : 'Needs Improvement'
        },
        {
          title: 'Client Feedback',
          value: `${metrics.client_feedback}%`,
          status: metrics.client_feedback >= 80 ? 'Excellent' : metrics.client_feedback >= 60 ? 'Good' : 'Needs Improvement'
        },
      ]);

    } catch (error) {
      console.error('Failed to load officer data:', error);
      showError('Failed to load profile data');
      setOfficerData(defaultOfficerData);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadOfficerData();
  }, [loadOfficerData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOfficerData();
  };

  const handleStartPatrol = () => {
    showAlert('Start Patrol', 'This will begin a new patrol route.');
    // router.push('/patrol'); // Uncomment when you have patrol screen
  };

  const handleReportIncident = () => {
    showAlert('Report Incident', 'Navigate to incident reporting.');
    // router.push('/incident'); // Uncomment when you have incident screen
  };

  const handleResolveAlert = async (alertId, status) => {
    try {
      await api.resolvePanicAlert({ alert_id: alertId, status });
      showSuccess(`Alert marked as ${status.replace('_', ' ')}`);
      // Refresh alerts
      loadOfficerData();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      showError('Failed to resolve alert');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const data = officerData || defaultOfficerData;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.officerName}>{data.name}</Text>
        <Text style={styles.badge}>Badge: {data.badgeNumber}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.complianceRate}%</Text>
            <Text style={styles.statLabel}>Compliance Rate</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.completedPatrols}</Text>
            <Text style={styles.statLabel}>Completed Patrols</Text>
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
              { backgroundColor: item.status === 'No Data' ? '#8E8E93' : 
                              item.status === 'Excellent' ? '#34C759' : 
                              item.status === 'Perfect' ? '#007AFF' : 
                              item.status === 'Good' ? '#FF9500' : '#FF3B30' }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}
       </View>

       {panicAlerts.length > 0 && (
         <View style={styles.alertsSection}>
           <Text style={styles.sectionTitle}>🚨 Active Panic Alerts</Text>
           {panicAlerts.map((alert, index) => (
             <View key={index} style={styles.alertCard}>
               <View style={styles.alertHeader}>
                 <Text style={styles.alertMember}>{alert.member_name}</Text>
                 <Text style={styles.alertTime}>{new Date(alert.timestamp).toLocaleString()}</Text>
               </View>
               <Text style={styles.alertAddress}>{alert.address}</Text>
               <Text style={styles.alertEmail}>{alert.member_email}</Text>
               <View style={styles.alertActions}>
                 <TouchableOpacity
                   style={[styles.alertButton, styles.resolveButton]}
                   onPress={() => handleResolveAlert(alert.id, 'resolved')}
                 >
                   <Text style={styles.alertButtonText}>Resolve</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={[styles.alertButton, styles.falseAlarmButton]}
                   onPress={() => handleResolveAlert(alert.id, 'false_alarm')}
                 >
                   <Text style={styles.alertButtonText}>False Alarm</Text>
                 </TouchableOpacity>
               </View>
             </View>
           ))}
         </View>
       )}

       <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleStartPatrol}
          >
            <Text style={styles.actionText}>Start Patrol</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleReportIncident}
          >
            <Text style={styles.actionText}>Report Incident</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.updateText}>Last updated: {data.lastUpdate}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 3,
  },
  shift: {
    fontSize: 14,
    color: '#666',
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
   alertsSection: {
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
   alertCard: {
     backgroundColor: '#FFF5F5',
     padding: 15,
     borderRadius: 10,
     marginBottom: 10,
     borderLeftWidth: 4,
     borderLeftColor: '#FF3B30',
   },
   alertHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 8,
   },
   alertMember: {
     fontSize: 16,
     fontWeight: 'bold',
     color: '#333',
   },
   alertTime: {
     fontSize: 12,
     color: '#666',
   },
   alertAddress: {
     fontSize: 14,
     color: '#555',
     marginBottom: 4,
   },
   alertEmail: {
     fontSize: 12,
     color: '#777',
     marginBottom: 10,
   },
   alertActions: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   alertButton: {
     paddingVertical: 8,
     paddingHorizontal: 15,
     borderRadius: 6,
     minWidth: 80,
     alignItems: 'center',
   },
   resolveButton: {
     backgroundColor: '#34C759',
   },
   falseAlarmButton: {
     backgroundColor: '#FF9500',
   },
   alertButtonText: {
     color: 'white',
     fontSize: 12,
     fontWeight: '600',
   },
});

export default HomeScreen;
