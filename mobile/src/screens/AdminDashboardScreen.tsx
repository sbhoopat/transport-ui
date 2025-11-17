import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { VictoryPie } from 'victory-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExpenses, addExpense } from '../store/slices/expenseSlice';
import { Expense } from '../types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import GradientButton from '../components/GradientButton';
import DatePicker from '../components/DatePicker';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 60) / 2; // 2 buttons per row with padding

const AdminDashboardScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { token } = useAppSelector((state) => state.auth);
  const { expenses, isLoading } = useAppSelector((state) => state.expenses);
  const { routes } = useAppSelector((state) => state.routes);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (token) {
      dispatch(fetchExpenses(token));
    }
  }, [token, dispatch]);

  const handleAddExpense = async () => {
    if (!category || !amount || !description || !expenseDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const expenseData: Omit<Expense, 'id'> = {
      category,
      amount: parseFloat(amount),
      description,
      date: expenseDate.toISOString(),
    };

    await dispatch(
      addExpense({
        expense: expenseData,
        token: token!,
      })
    );

    setModalVisible(false);
    setCategory('');
    setAmount('');
    setDescription('');
    setExpenseDate(new Date());
  };

  const handleExport = async () => {
    try {
      // Create Excel file from expenses
      const data = expenses.map(exp => ({
        Category: exp.category,
        Amount: exp.amount,
        Description: exp.description || '',
        Date: new Date(exp.date).toLocaleDateString(),
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileUri = `${FileSystem.documentDirectory}expenses.xlsx`;
      
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'Sharing not available');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export expenses');
    }
  };

  const chartData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.x === expense.category);
    if (existing) {
      existing.y += expense.amount;
    } else {
      acc.push({ x: expense.category, y: expense.amount });
    }
    return acc;
  }, [] as { x: string; y: number }[]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const quickActions = [
    {
      id: 'routes',
      title: 'Route Management',
      icon: 'create',
      color: '#f97316',
      screen: 'RouteManagement',
    },
    {
      id: 'viewRoutes',
      title: 'View Routes',
      icon: 'map',
      color: '#00BCD4',
      screen: 'Routes',
    },
    {
      id: 'drivers',
      title: 'Driver Management',
      icon: 'people',
      color: '#4CAF50',
      screen: 'DriverManagement',
    },
    {
      id: 'tracking',
      title: 'Live Tracking',
      icon: 'location',
      color: '#9C27B0',
      screen: 'LiveTracking',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerGradient}>
          <Text style={styles.totalText}>Total Expenses</Text>
          <Text style={styles.totalAmount}>${totalExpenses.toFixed(2)}</Text>
        </View>
        <View style={styles.buttonRow}>
          <GradientButton
            title="Add Expense"
            icon="add-circle"
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}
          />
          <GradientButton
            title="Export"
            icon="download"
            onPress={handleExport}
            style={styles.actionButton}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => {
                // @ts-ignore
                navigation.navigate(action.screen);
              }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <VictoryPie
            data={chartData}
            colorScale={[
              '#002133', // Primary dark blue
              '#f97316', // Orange accent
              '#4CAF50', // Green
              '#2196F3', // Blue
              '#9C27B0', // Purple
              '#00BCD4', // Cyan
              '#FF9800', // Orange
              '#FFC107', // Amber
              '#E91E63', // Pink
              '#3F51B5', // Indigo
            ]}
            width={320}
            height={320}
            innerRadius={60}
            labelRadius={({ innerRadius }: any) => ((innerRadius as number) || 0) + 50}
            labels={({ datum }) => {
              const percentage = ((datum.y / totalExpenses) * 100).toFixed(1);
              return `${percentage}%`;
            }}
            style={{
              labels: {
                fill: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
              },
            }}
          />
          <View style={styles.legendContainer}>
            {chartData.map((item, index) => {
              const percentage = ((item.y / totalExpenses) * 100).toFixed(1);
              const colors = [
                '#002133', '#f97316', '#4CAF50', '#2196F3', '#9C27B0',
                '#00BCD4', '#FF9800', '#FFC107', '#E91E63', '#3F51B5',
              ];
              return (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors[index % colors.length] }]} />
                  <View style={styles.legendText}>
                    <Text style={styles.legendLabel}>{item.x}</Text>
                    <Text style={styles.legendValue}>${item.y.toFixed(2)} ({percentage}%)</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.expensesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <Text style={styles.expenseCount}>{expenses.length} total</Text>
        </View>
        {expenses.length > 0 ? (
          <View style={styles.expensesList}>
            {expenses.slice(0, 10).map((item) => (
              <View key={item.id} style={styles.expenseItem}>
                <View style={styles.expenseIconContainer}>
                  <Ionicons name="receipt" size={24} color="#f97316" />
                </View>
                <View style={styles.expenseInfo}>
                  <View style={styles.expenseHeader}>
                    <Text style={styles.expenseCategory}>{item.category}</Text>
                    <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.expenseDescription}>{item.description}</Text>
                  <View style={styles.expenseFooter}>
                    <Ionicons name="calendar-outline" size={14} color="#999" />
                    <Text style={styles.expenseDate}>
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>Add your first expense to get started</Text>
          </View>
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Expense</Text>

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setExpenseDate(new Date());
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.saveButtonContainer}>
              <GradientButton
                title="Save Expense"
                icon="checkmark"
                onPress={handleAddExpense}
                style={styles.saveButtonFullWidth}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 15,
    marginTop: 10,
  },
  quickActionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#002133',
    textAlign: 'center',
  },
  expensesSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  expenseCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  expensesList: {
    gap: 12,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  headerGradient: {
    backgroundColor: '#002133',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
    opacity: 0.9,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: BUTTON_WIDTH,
    minWidth: BUTTON_WIDTH,
    maxWidth: BUTTON_WIDTH,
  },
  addButton: {
    // GradientButton handles styling
  },
  exportButton: {
    // GradientButton handles styling
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 12,
    color: '#666',
  },
  expenseItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  expenseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  expenseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f97316',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  modalButton: {
    // GradientButton handles styling
    width: BUTTON_WIDTH,
    minWidth: BUTTON_WIDTH,
    maxWidth: BUTTON_WIDTH,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: BUTTON_WIDTH,
    minWidth: BUTTON_WIDTH,
    maxWidth: BUTTON_WIDTH,
  },
  cancelButtonText: {
    color: '#002133',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonContainer: {
    marginTop: 10,
  },
  saveButtonFullWidth: {
    width: '100%',
  },
});

export default AdminDashboardScreen;

