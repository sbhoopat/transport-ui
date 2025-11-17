import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import GradientButton from '../components/GradientButton';
import { sendNotification } from '../store/slices/notificationSlice';

const SendNotificationScreen = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.notifications);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'info' | 'warning' | 'alert'>('info');

  // Only allow admin and developer to access this screen
  if (user?.role !== 'admin' && user?.role !== 'developer') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access Denied</Text>
        <Text style={styles.errorSubtext}>Only administrators can send notifications</Text>
      </View>
    );
  }

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in both title and message');
      return;
    }

    try {
      await dispatch(
        sendNotification({
          notification: {
            title: title.trim(),
            message: message.trim(),
            type: notificationType,
          },
          token: token!,
        })
      );

      Alert.alert('Success', 'Notification sent to all users', [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setMessage('');
            setNotificationType('info');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification. Please try again.');
    }
  };

  const notificationTypes = [
    { id: 'info', label: 'Information', icon: 'information-circle', color: '#2196F3' },
    { id: 'warning', label: 'Warning', icon: 'warning', color: '#FF9800' },
    { id: 'alert', label: 'Alert', icon: 'alert-circle', color: '#F44336' },
  ] as const;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={32} color="#fff" />
        <Text style={styles.headerTitle}>Send Notification</Text>
        <Text style={styles.headerSubtitle}>Broadcast message to all users</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Type</Text>
          <View style={styles.typeContainer}>
            {notificationTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  notificationType === type.id && styles.typeCardSelected,
                  { borderColor: type.color },
                ]}
                onPress={() => setNotificationType(type.id)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={notificationType === type.id ? type.color : '#666'}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    notificationType === type.id && { color: type.color, fontWeight: 'bold' },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter notification title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter notification message"
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{message.length}/500</Text>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={[styles.previewCard, { borderLeftColor: notificationTypes.find(t => t.id === notificationType)?.color }]}>
            <View style={styles.previewHeader}>
              <Ionicons
                name={notificationTypes.find(t => t.id === notificationType)?.icon as any}
                size={20}
                color={notificationTypes.find(t => t.id === notificationType)?.color}
              />
              <Text style={styles.previewTitle}>{title || 'Notification Title'}</Text>
            </View>
            <Text style={styles.previewMessage}>{message || 'Notification message will appear here...'}</Text>
          </View>
        </View>

        <GradientButton
          title="Send Notification"
          icon="send"
          onPress={handleSend}
          disabled={isLoading || !title.trim() || !message.trim()}
          loading={isLoading}
          style={styles.sendButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#002133',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeCardSelected: {
    borderWidth: 2,
    backgroundColor: '#fff',
    shadowColor: '#f97316',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  typeLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#002133',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  previewSection: {
    marginBottom: 25,
  },
  previewCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
    flex: 1,
  },
  previewMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sendButton: {
    marginTop: 10,
    marginBottom: 20,
    // GradientButton handles styling
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    textAlign: 'center',
    marginTop: 100,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SendNotificationScreen;

