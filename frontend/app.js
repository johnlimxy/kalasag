// App.js
// This file contains the complete skeleton for the Kalasag Activation Flow.
// It uses React Navigation for screen management.
// To run this, you will need to install the following packages:
// npm install @react-navigation/native @react-navigation/stack
// npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- Reusable Components (for skeleton purposes) ---

// A simple button component we can reuse
const CustomButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

// --- Screen 1.0: BPI Login Screen ---

const LoginScreen = ({ navigation }) => {
  // For the prototype, any login attempt will be successful.
  const handleLogin = () => {
    navigation.replace('BpiDashboard'); // Use replace to prevent going back to login
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BPI Replica</Text>
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      <CustomButton title="Login" onPress={handleLogin} />
    </SafeAreaView>
  );
};

// --- Screen 2.0: BPI Standard Dashboard ---

const BpiDashboardScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleActivate = () => {
    setModalVisible(false);
    navigation.navigate('KalasagDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Kalasag Activation Modal Component */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Activate BPI Kalasag?</Text>
            <Text style={styles.modalBody}>
              Experience a simpler and safer way to bank, designed for your
              peace of mind.
            </Text>
            <CustomButton title="Activate Now" onPress={handleActivate} />
            <CustomButton
              title="Maybe Later"
              onPress={() => setModalVisible(false)}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>BPI Dashboard</Text>
      <Text style={styles.bodyText}>[Your accounts would be listed here]</Text>

      {/* This is the banner that triggers the activation modal */}
      <TouchableOpacity
        style={styles.banner}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.bannerTitle}>Activate Kalasag Mode</Text>
        <Text style={styles.bannerText}>
          A simpler, safer way to bank. Tap to learn more.
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- Screen 3.0: Kalasag Dashboard ---

const KalasagDashboardScreen = () => {
  return (
    <SafeAreaView style={styles.containerKalasag}>
      <Text style={styles.titleKalasag}>Kalasag Dashboard</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Your Money:</Text>
        <Text style={styles.balanceAmount}>₱15,500.00</Text>
      </View>
      <View style={styles.tileGrid}>
        {/* We can map over an array to create these tiles later */}
        <View style={styles.tile}><Text>Check Balance</Text></View>
        <View style={styles.tile}><Text>Pay with QR</Text></View>
        <View style={styles.tile}><Text>Send Money</Text></View>
        <View style={styles.tile}><Text>Pay Bills</Text></View>
        <View style={styles.tile}><Text>Guardians</Text></View>
        <View style={styles.tile}><Text>Help / Tulong</Text></View>
      </View>
    </SafeAreaView>
  );
};

// --- Navigation Setup ---

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Hiding the header for a cleaner look
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="BpiDashboard" component={BpiDashboardScreen} />
        <Stack.Screen name="KalasagDashboard" component={KalasagDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Stylesheet ---
// Basic skeleton styles. We can make these look perfect later.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  containerKalasag: {
    flex: 1,
    backgroundColor: '#E8F5E9', // A calming green background
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#004A8F', // BPI Blue
  },
  titleKalasag: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1B5E20', // Dark Green
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF7A00', // BPI Orange
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondaryButtonText: {
    color: '#555',
  },
  banner: {
    width: '100%',
    padding: 20,
    backgroundColor: '#004A8F',
    borderRadius: 12,
    marginTop: 40,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalBody: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  balanceLabel: {
    fontSize: 20,
    color: '#333',
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  tileGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  tile: {
    width: '45%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    // Basic shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
