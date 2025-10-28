import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Camera } from 'expo-camera';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  // Mock route data
  const routeData = {
    currentLocation: 'Building A - Lobby',
    nextLocation: 'Building B - North Entrance',
    estimatedTime: '5 min',
    progress: 3,
    total: 8,
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    setCameraVisible(true);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      'QR Code Scanned!',
      `Location: ${data}\n\nScan successful! Moving to next checkpoint.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setScanned(false);
            setCameraVisible(false);
            // In real app, this would update the route progress
          },
        },
      ]
    );
  };

  if (cameraVisible) {
    if (hasPermission === null) {
      return (
        <View style={styles.cameraContainer}>
          <Text>Requesting camera permission...</Text>
        </View>
      );
    }
    
    if (hasPermission === false) {
      return (
        <View style={styles.cameraContainer}>
          <Text style={styles.permissionText}>No access to camera</Text>
          <TouchableOpacity style={styles.button} onPress={() => setCameraVisible(false)}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Align QR code within the frame</Text>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setCameraVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.routeCard}>
        <Text style={styles.sectionTitle}>Current Route</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Progress: {routeData.progress}/{routeData.total} locations
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(routeData.progress / routeData.total) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.locationInfo}>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Current Location:</Text>
            <Text style={styles.locationValue}>{routeData.currentLocation}</Text>
          </View>
          
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Next in Route:</Text>
            <Text style={styles.nextLocationValue}>{routeData.nextLocation}</Text>
          </View>
          
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Estimated Time:</Text>
            <Text style={styles.locationValue}>{routeData.estimatedTime}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.scanButton}
        onPress={requestCameraPermission}
      >
        <Text style={styles.scanButtonText}>Scan QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => Alert.alert('Next Location', 'Proceeding to next location in route...')}
      >
        <Text style={styles.nextButtonText}>Next Location</Text>
      </TouchableOpacity>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Scanning Instructions:</Text>
        <Text style={styles.instruction}>1. Position QR code within camera frame</Text>
        <Text style={styles.instruction}>2. Ensure good lighting</Text>
        <Text style={styles.instruction}>3. Hold steady until scan completes</Text>
        <Text style={styles.instruction}>4. Verify location matches your route</Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
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
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextLocationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
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
  instructions: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
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
    paddingLeft: 10,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ScanScreen;
