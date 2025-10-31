import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert utility
 * Uses Alert.alert on mobile and window.alert on web
 */
export const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    // On web, use window.alert for simple alerts
    if (buttons && buttons.length > 0) {
      // For alerts with buttons, use window.confirm for yes/no
      if (buttons.length === 2 && buttons[0].text && buttons[1].text) {
        const result = window.confirm(`${title}\n\n${message}`);
        if (result && buttons[0].onPress) {
          buttons[0].onPress();
        } else if (!result && buttons[1].onPress) {
          buttons[1].onPress();
        }
      } else {
        // For single button or complex cases, just show alert
        window.alert(`${title}\n\n${message}`);
        if (buttons && buttons[0] && buttons[0].onPress) {
          buttons[0].onPress();
        }
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    // On mobile, use native Alert
    Alert.alert(title, message, buttons);
  }
};

/**
 * Convenience function for error alerts
 */
export const showError = (message, title = 'Error') => {
  showAlert(title, message);
};

/**
 * Convenience function for success alerts
 */
export const showSuccess = (message, title = 'Success') => {
  showAlert(title, message);
};

/**
 * Convenience function for info alerts
 */
export const showInfo = (message, title = 'Info') => {
  showAlert(title, message);
};