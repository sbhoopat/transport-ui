import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
// Note: Install expo-linear-gradient for gradient effects: npx expo install expo-linear-gradient
// import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import GradientButton from '../components/GradientButton';
import { login, register, loadStoredAuth } from '../store/slices/authSlice';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    await dispatch(login({ email, password }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Left Section - Branding */}
        <View style={styles.brandingSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Image
                source={require('../../assets/icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              {/* <Ionicons name="bus" size={40} color="#002133" /> */}
            </View>
            {/* <Text style={styles.logoText}>BusTrackr</Text> */}
          </View>
          <Text style={styles.brandTitle}>BusTrackr</Text>
          {/* <Text style={styles.tagline}>Track your bus in real-time</Text> */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="location" size={24} color="#fff" />
              <Text style={styles.featureText}>Real-time Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="notifications" size={24} color="#fff" />
              <Text style={styles.featureText}>Smart Alerts</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
              <Text style={styles.featureText}>Safe & Secure</Text>
            </View>
          </View>
        </View>

        {/* Right Section - Form */}
        <View style={styles.formSection}>
         
          <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <GradientButton
              title="Login"
              icon="arrow-forward"
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
              style={styles.submitButton}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: isTablet ? 900 : width - 40,
    flexDirection: isTablet ? 'row' : 'column',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#fff',
    minHeight: isTablet ? 600 : 700,
  },
  brandingSection: {
    flex: isTablet ? 0.45 : 1,
    padding: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f97316', // Orange-500 gradient color
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#002133',
    marginBottom: 10,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 10,
  },
  featuresContainer: {
    width: '100%',
    gap: 20,
    marginTop: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  formSection: {
    flex: isTablet ? 0.55 : 1,
    backgroundColor: '#f5f5f5',
    padding: 30,
    justifyContent: 'center',
  },
  formHeader: {
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContent: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonGradient: {
    backgroundColor: '#f97316', // Orange-500 gradient color
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default AuthScreen;

