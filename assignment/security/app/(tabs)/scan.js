import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
  TextInput,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../utils/api';
import { showAlert } from '../../utils/alert';

const ScanScreen = () => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [scannedCheckpoints, setScannedCheckpoints] = useState([]);

  useEffect(() => {
    loadRouteData();
  }, []);

  const loadRouteData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && token !== 'demo-token') {
        const route = await api.getRoute();
        setRouteData(route.route);
        setScannedCheckpoints(route.recent_scans || []);
      } else {
        // Demo route data
        setRouteData({
          id: 1,
          name: 'Neighborhood Patrol',
          description: 'Patrol member addresses and checkpoints',
          checkpoints: [
            { id: 1, full_name: 'John Smith', address: '123 Main St', qr_code_data: 'member:1' },
            { id: 2, full_name: 'Jane Doe', address: '456 Oak Ave', qr_code_data: 'member:2' },
            { id: 3, full_name: 'Bob Johnson', address: '789 Pine Rd', qr_code_data: 'member:3' },
          ],
          total_checkpoints: 3,
        });
        setScannedCheckpoints([]);
      }
    } catch (error) {
      console.error('Failed to load route data:', error);
    }
  };

  const handleStartScan = async () => {
    let currentPermission = permission;

    if (!currentPermission || !currentPermission.granted) {
      currentPermission = await requestPermission();
    }

    if (!currentPermission.granted) {
      showAlert(
        'Camera Permission Required',
        'This app needs camera access to scan QR codes for security checkpoints.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
      return;
    }

    setCameraVisible(true);
    setScanned(false);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      if (token === 'demo-token') {
        // Demo mode: use existing validation logic
        const scanResult = await processQRCode(data);

        if (scanResult.success) {
          setComment(''); // Clear comment after logging

          // Update scanned checkpoints for demo mode
          if (scanResult.type === 'member') {
            setScannedCheckpoints(prev => [...prev, data]);
          }

          const message = scanResult.type === 'member'
            ? `Member Verified: ${scanResult.member.full_name}`
            : `Location: ${scanResult.location}`;

          showAlert(
            'QR Code Scanned! ✅',
            message,
            [
              {
                text: 'OK',
                onPress: () => {
                  setCameraVisible(false);
                },
              },
            ]
          );
        } else {
          showAlert(
            'Invalid QR Code ❌',
            scanResult.message || 'This QR code is not valid for your current route.',
            [{ text: 'Try Again', onPress: () => setScanned(false) }]
          );
        }
      } else {
        // Real API mode: use combined scan endpoint
        const scanResult = await api.scanQRCode({
          qr_data: data,
          comment: comment,
          scan_status: 'completed',
          // Add location data if available (would need geolocation permission)
          // latitude: latitude,
          // longitude: longitude,
        });

        setComment(''); // Clear comment after logging

        const message = scanResult.validation.type === 'member'
          ? `Member Verified: ${scanResult.validation.member.full_name}`
          : scanResult.validation.type === 'member_checkpoint'
          ? `Address Checkpoint: ${scanResult.validation.member.full_name}`
          : `Location: ${scanResult.validation.location}`;

        // Update scanned checkpoints if it's a member checkpoint QR
        if (scanResult.validation?.type === 'member_checkpoint') {
          setScannedCheckpoints(prev => [...prev, data]);
        }

        showAlert(
          'QR Code Scanned! ✅',
          message,
          [
            {
              text: 'OK',
              onPress: () => {
                setCameraVisible(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Scan processing error:', error);
      showAlert(
        'Scan Failed',
        'Unable to process QR code. Please try again.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const processQRCode = async (qrData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token === 'demo-token') {
        // Mock validation for demo
        const validLocations = [
          'Building A - Lobby',
          'Building B - North Entrance',
          'Building C - Server Room',
          'Parking Garage - Level 2',
          'Main Gate - Security Booth',
          'Building D - Roof Access',
          'Warehouse - Loading Bay',
          'Admin Building - Rear Entrance'
        ];

        // Check for demo member QR codes
        if (qrData.startsWith('member:')) {
          const memberId = qrData.split(':')[1];
          return {
            success: true,
            type: 'member',
            member: {
              id: memberId,
              full_name: `Demo Member ${memberId}`,
              email: `member${memberId}@demo.com`,
              phone: '555-0123',
              address: '123 Demo Street',
            },
            message: 'Demo member verified successfully'
          };
        }

        // Check for location QR codes
        if (validLocations.includes(qrData)) {
          return {
            success: true,
            type: 'location',
            location: qrData,
            message: 'Demo location validated successfully'
          };
        } else {
          return {
            success: false,
            message: 'Invalid QR code'
          };
        }
      } else {
        const result = await api.validateQRCode(qrData);
        return result;
      }
    } catch (error) {
      return { success: false, message: 'Network error validating QR code' };
    }
  };



  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (cameraVisible) {
    if (!permission) {
      return (
        <View style={styles.cameraContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Requesting camera access...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.cameraContainer}>
          <Text style={styles.permissionText}>Camera permission is required to scan QR codes</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setCameraVisible(false)}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanFrameContainer}>
              <View style={styles.scanFrame} />
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.loadingText}>Verifying...</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.scanText}>Align QR code within the frame</Text>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.cameraButtonText}>Flip Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.cameraButton, styles.closeButton]}
                onPress={() => setCameraVisible(false)}
              >
                <Text style={styles.cameraButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Scanning Instructions:</Text>
        <Text style={styles.instruction}>• Position QR code within camera frame</Text>
        <Text style={styles.instruction}>• Ensure good lighting conditions</Text>
        <Text style={styles.instruction}>• Hold device steady until scan completes</Text>
        <Text style={styles.instruction}>• Verify location matches your route</Text>
        <Text style={styles.instruction}>• Report any issues immediately</Text>
      </View>

      {routeData && (
        <View style={styles.routeCard}>
          <Text style={styles.sectionTitle}>{routeData.name}</Text>
          <Text style={styles.routeDescription}>{routeData.description}</Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Progress: {scannedCheckpoints.length} / {routeData.total_checkpoints} checkpoints
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(scannedCheckpoints.length / routeData.total_checkpoints) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.locationInfo}>
            {routeData.checkpoints.map((checkpoint, index) => {
              const isScanned = scannedCheckpoints.includes(checkpoint.qr_code_data);
              return (
                <View key={checkpoint.id} style={styles.locationItem}>
                  <Text style={styles.locationLabel}>
                    {index + 1}. {checkpoint.full_name} - {checkpoint.address}
                  </Text>
                  <Text style={isScanned ? styles.locationValue : styles.nextLocationValue}>
                    {isScanned ? '✓ Scanned' : 'Pending'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.commentSection}>
        <Text style={styles.commentLabel}>Comment (optional):</Text>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment about this scan..."
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleStartScan}
        disabled={isLoading}
      >
        <Text style={styles.scanButtonText}>
          {isLoading ? 'Processing...' : 'Scan QR Code'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Extra padding at bottom for better scrolling
  },
  routeCard: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  locationInfo: {
    marginTop: 10,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  nextLocationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    flex: 1,
    textAlign: 'right',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  instructions: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  commentSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 5,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  scanFrameContainer: {
    position: 'relative',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  cameraButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(255,59,48,0.7)',
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    minWidth: 150,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScanScreen;
