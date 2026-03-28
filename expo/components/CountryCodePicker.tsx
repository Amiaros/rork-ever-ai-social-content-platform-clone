import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { COUNTRY_CODES } from '@/constants/countryCodes';
import { CountryCode } from '@/types';
import { useLanguageStore } from '@/store/languageStore';
import { Search, X, ChevronDown } from 'lucide-react-native';

interface CountryCodePickerProps {
  selectedCountry: CountryCode | null;
  onSelectCountry: (country: CountryCode) => void;
}

const { height } = Dimensions.get('window');

export const CountryCodePicker = ({ selectedCountry, onSelectCountry }: CountryCodePickerProps) => {
  const { t } = useLanguageStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(COUNTRY_CODES);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(COUNTRY_CODES);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = COUNTRY_CODES.filter(
        country => 
          country.name.toLowerCase().includes(query) || 
          country.dialCode.includes(query) ||
          country.code.toLowerCase().includes(query)
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery]);

  const handleOpenModal = () => {
    setModalVisible(true);
    setSearchQuery('');
    setFilteredCountries(COUNTRY_CODES);
    
    // Focus the search input after a short delay to ensure the modal is fully open
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectCountry = (country: CountryCode) => {
    onSelectCountry(country);
    handleCloseModal();
  };

  const renderCountryItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity 
      style={styles.countryItem} 
      onPress={() => handleSelectCountry(item)}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryDialCode}>{item.dialCode}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity 
        style={styles.pickerButton} 
        onPress={handleOpenModal}
      >
        {selectedCountry ? (
          <View style={styles.selectedCountry}>
            <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
            <Text style={styles.selectedDialCode}>{selectedCountry.dialCode}</Text>
          </View>
        ) : (
          <View style={styles.selectedCountry}>
            <Text style={styles.placeholderText}>{t('profile.selectCountry')}</Text>
          </View>
        )}
        <ChevronDown size={16} color={COLORS.text} />
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
              <Text style={styles.modalTitle}>{t('profile.selectCountry')}</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <X size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Search size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder={t('profile.searchCountry')}
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <X size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
              windowSize={10}
              showsVerticalScrollIndicator={true}
            />
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
  selectedCountry: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedDialCode: {
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
    height: Platform.OS === 'web' ? '80%' : height * 0.7,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 4,
  },
  countryDialCode: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});