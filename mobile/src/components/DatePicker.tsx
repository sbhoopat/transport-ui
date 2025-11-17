import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  style?: any;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'Select date', style }) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return placeholder;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthName = (month: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  };

  const renderCalendar = () => {
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <View style={styles.calendar}>
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() => {
              const newDate = new Date(year, month - 1, 1);
              setTempDate(newDate);
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#002133" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{getMonthName(month)} {year}</Text>
          <TouchableOpacity
            onPress={() => {
              const newDate = new Date(year, month + 1, 1);
              setTempDate(newDate);
            }}
          >
            <Ionicons name="chevron-forward" size={24} color="#002133" />
          </TouchableOpacity>
        </View>
        <View style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            const isSelected = day === tempDate.getDate() && month === tempDate.getMonth() && year === tempDate.getFullYear();
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayCell, isSelected && styles.selectedDay, isToday && !isSelected && styles.todayDay]}
                onPress={() => {
                  if (day) {
                    const newDate = new Date(year, month, day);
                    setTempDate(newDate);
                  }
                }}
                disabled={!day}
              >
                {day && <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Ionicons name="calendar-outline" size={20} color="#666" style={styles.icon} />
        <Text style={[styles.text, !value && styles.placeholder]}>{formatDate(value)}</Text>
      </TouchableOpacity>
      <Modal visible={show} transparent animationType="slide" onRequestClose={() => setShow(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShow(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.calendarContainer}>
              {renderCalendar()}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShow(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#002133',
  },
  placeholder: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002133',
  },
  calendarContainer: {
    maxHeight: 400,
  },
  calendar: {
    padding: 10,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedDay: {
    backgroundColor: '#f97316',
    borderRadius: 20,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#f97316',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#002133',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#f97316',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DatePicker;

