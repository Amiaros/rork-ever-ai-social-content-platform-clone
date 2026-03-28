import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform,
  ScrollView
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { useLanguageStore } from '@/store/languageStore';
import { Calendar, X } from 'lucide-react-native';

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DatePicker = ({ 
  selectedDate, 
  onSelectDate,
  maximumDate = new Date(),
  minimumDate = new Date(1900, 0, 1)
}: DatePickerProps) => {
  const { t } = useLanguageStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(selectedDate || new Date());
  
  // Generate years (from 1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  
  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => i);
  
  // Generate days based on selected month and year
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const days = Array.from(
    { length: getDaysInMonth(tempDate.getFullYear(), tempDate.getMonth()) }, 
    (_, i) => i + 1
  );

  const handleOpenModal = () => {
    setTempDate(selectedDate || new Date());
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    onSelectDate(tempDate);
    handleCloseModal();
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(tempDate);
    newDate.setDate(day);
    setTempDate(newDate);
  };

  const handleSelectMonth = (month: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(month);
    
    // Adjust the day if it exceeds the days in the selected month
    const daysInMonth = getDaysInMonth(newDate.getFullYear(), month);
    if (newDate.getDate() > daysInMonth) {
      newDate.setDate(daysInMonth);
    }
    
    setTempDate(newDate);
  };

  const handleSelectYear = (year: number) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(year);
    
    // Adjust the day if it exceeds the days in the selected month (e.g., Feb 29 in non-leap years)
    const daysInMonth = getDaysInMonth(year, newDate.getMonth());
    if (newDate.getDate() > daysInMonth) {
      newDate.setDate(daysInMonth);
    }
    
    setTempDate(newDate);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const isDateInRange = (date: Date) => {
    return date >= minimumDate && date <= maximumDate;
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.pickerButton} 
        onPress={handleOpenModal}
      >
        <View style={styles.selectedDate}>
          {selectedDate ? (
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          ) : (
            <Text style={styles.placeholderText}>{t('profile.selectDateOfBirth')}</Text>
          )}
        </View>
        <Calendar size={20} color={COLORS.text} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('profile.selectDateOfBirth')}</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <X size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContainer}>
              {/* Days */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>{t('profile.day')}</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={true}>
                  {days.map((day) => {
                    const dayDate = new Date(tempDate);
                    dayDate.setDate(day);
                    const isInRange = isDateInRange(dayDate);
                    const isSelected = tempDate.getDate() === day;
                    
                    return (
                      <TouchableOpacity
                        key={`day-${day}`}
                        style={[
                          styles.pickerItem,
                          isSelected && styles.selectedPickerItem,
                          !isInRange && styles.disabledPickerItem,
                        ]}
                        onPress={() => isInRange && handleSelectDay(day)}
                        disabled={!isInRange}
                      >
                        <Text 
                          style={[
                            styles.pickerItemText,
                            isSelected && styles.selectedPickerItemText,
                            !isInRange && styles.disabledPickerItemText,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              
              {/* Months */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>{t('profile.month')}</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={true}>
                  {months.map((month) => {
                    const monthDate = new Date(tempDate);
                    monthDate.setMonth(month);
                    const isInRange = isDateInRange(monthDate);
                    const isSelected = tempDate.getMonth() === month;
                    
                    const monthNames = [
                      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ];
                    
                    return (
                      <TouchableOpacity
                        key={`month-${month}`}
                        style={[
                          styles.pickerItem,
                          isSelected && styles.selectedPickerItem,
                          !isInRange && styles.disabledPickerItem,
                        ]}
                        onPress={() => isInRange && handleSelectMonth(month)}
                        disabled={!isInRange}
                      >
                        <Text 
                          style={[
                            styles.pickerItemText,
                            isSelected && styles.selectedPickerItemText,
                            !isInRange && styles.disabledPickerItemText,
                          ]}
                        >
                          {monthNames[month]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              
              {/* Years */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>{t('profile.year')}</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={true}>
                  {years.map((year) => {
                    const yearDate = new Date(tempDate);
                    yearDate.setFullYear(year);
                    const isInRange = isDateInRange(yearDate);
                    const isSelected = tempDate.getFullYear() === year;
                    
                    return (
                      <TouchableOpacity
                        key={`year-${year}`}
                        style={[
                          styles.pickerItem,
                          isSelected && styles.selectedPickerItem,
                          !isInRange && styles.disabledPickerItem,
                        ]}
                        onPress={() => isInRange && handleSelectYear(year)}
                        disabled={!isInRange}
                      >
                        <Text 
                          style={[
                            styles.pickerItemText,
                            isSelected && styles.selectedPickerItemText,
                            !isInRange && styles.disabledPickerItemText,
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.footerButton, styles.cancelButton]} 
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.footerButton, styles.confirmButton]} 
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>{t('common.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  selectedDate: {
    flex: 1,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 16,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  datePickerContainer: {
    flexDirection: 'row',
    padding: 16,
    height: 250,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerScroll: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectedPickerItem: {
    backgroundColor: `${COLORS.primary}30`,
  },
  disabledPickerItem: {
    opacity: 0.5,
  },
  pickerItemText: {
    color: COLORS.text,
    fontSize: 16,
  },
  selectedPickerItemText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  disabledPickerItemText: {
    color: COLORS.textSecondary,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 0.5,
    borderRightColor: COLORS.border,
  },
  confirmButton: {
    borderLeftWidth: 0.5,
    borderLeftColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  confirmButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});