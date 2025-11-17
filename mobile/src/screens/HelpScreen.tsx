import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native';

const HelpScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Help & Support</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getting Started</Text>
          <Text style={styles.text}>
            1. Sign up or log in to your account{'\n'}
            2. Browse available routes and select your stop{'\n'}
            3. Subscribe to a route to start tracking{'\n'}
            4. Enable notifications to receive alerts 2 stops before your stop
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Tracking</Text>
          <Text style={styles.text}>
            View real-time bus location on the map. The bus marker animates
            smoothly as it moves. You can see the previous stop, next stop, and
            estimated arrival time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.text}>
            Receive alerts when the bus is 2 stops away from your selected stop.
            Make sure to enable notifications in your device settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:support@bustrackr.com')}
          >
            <Text style={styles.link}>support@bustrackr.com</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('tel:+1234567890')}
            style={styles.marginTop}
          >
            <Text style={styles.link}>(123) 456-7890</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  link: {
    fontSize: 16,
    color: '#f97316',
    textDecorationLine: 'underline',
  },
  marginTop: {
    marginTop: 10,
  },
});

export default HelpScreen;

