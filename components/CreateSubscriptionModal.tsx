import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { icons } from '@/constants/icons';
import dayjs from 'dayjs';
import clsx from 'clsx';

interface CreateSubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

const CATEGORIES = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  'Entertainment': '#ffcfcf',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  'Design': '#f5c542',
  'Productivity': '#b8e8d0',
  'Cloud': '#d1d1d1',
  'Music': '#ffd1e8',
  'Other': '#f6eecf',
};

const CreateSubscriptionModal = ({ isVisible, onClose, onCreate }: CreateSubscriptionModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [category, setCategory] = useState('Entertainment');

  const isValid = name.trim().length > 0 && !isNaN(parseFloat(price)) && parseFloat(price) > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name: name.trim(),
      price: parseFloat(price),
      currency: 'USD',
      frequency: frequency, // Added to match requirement
      category,
      status: 'active',
      startDate: dayjs().toISOString(),
      renewalDate: dayjs().add(1, frequency === 'Monthly' ? 'month' : 'year').toISOString(),
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category] || '#f6eecf',
    };

    onCreate(newSubscription);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('Entertainment');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="modal-overlay">
        <Pressable className="flex-1" onPress={handleClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="modal-container"
        >
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <TouchableOpacity onPress={handleClose} className="modal-close">
              <Text className="modal-close-text">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            className="modal-body" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Name Field */}
            <View className="auth-field mb-4">
              <Text className="auth-label">Name</Text>
              <TextInput
                className="auth-input"
                placeholder="e.g. Netflix, Claude, etc."
                value={name}
                onChangeText={setName}
                placeholderTextColor="rgba(0,0,0,0.3)"
              />
            </View>

            {/* Price Field */}
            <View className="auth-field mb-4">
              <Text className="auth-label">Price</Text>
              <TextInput
                className="auth-input"
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholderTextColor="rgba(0,0,0,0.3)"
              />
            </View>

            {/* Frequency Selector */}
            <View className="auth-field mb-4">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                <TouchableOpacity
                  onPress={() => setFrequency('Monthly')}
                  className={clsx('picker-option', frequency === 'Monthly' && 'picker-option-active')}
                >
                  <Text className={clsx('picker-option-text', frequency === 'Monthly' && 'picker-option-text-active')}>
                    Monthly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFrequency('Yearly')}
                  className={clsx('picker-option', frequency === 'Yearly' && 'picker-option-active')}
                >
                  <Text className={clsx('picker-option-text', frequency === 'Yearly' && 'picker-option-text-active')}>
                    Yearly
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Category Selector */}
            <View className="auth-field mb-6">
              <Text className="auth-label">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={clsx('category-chip', category === cat && 'category-chip-active')}
                  >
                    <Text className={clsx('category-chip-text', category === cat && 'category-chip-text-active')}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isValid}
              className={clsx('auth-button', !isValid && 'auth-button-disabled')}
            >
              <Text className="auth-button-text">Create Subscription</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
