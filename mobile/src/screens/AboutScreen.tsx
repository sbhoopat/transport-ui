import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>BusTrackr</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          BusTrackr is a real-time bus tracking application that helps parents
          and students stay informed about bus locations and arrival times.
        </Text>
        <Text style={styles.description}>
          Features include live tracking, route subscriptions, push
          notifications, and comprehensive admin tools for managing bus routes
          and expenses.
        </Text>
        <Text style={styles.copyright}>
          © 2024 BusTrackr. All rights reserved.
        </Text>
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
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#002133',
    lineHeight: 24,
    marginBottom: 15,
  },
  copyright: {
    fontSize: 14,
    color: '#999',
    marginTop: 30,
    textAlign: 'center',
  },
});

export default AboutScreen;

