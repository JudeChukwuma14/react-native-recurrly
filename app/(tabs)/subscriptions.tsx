import { View, Text, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useMemo } from 'react'
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useSubscriptions } from '@/context/SubscriptionsContext';
import SubscriptionCard from '@/components/SubscriptionCard';
import { Ionicons } from '@expo/vector-icons';

const SafeAreaView = styled(RNSafeAreaView)

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plan?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-sans-bold text-primary mb-6">Your Subscriptions</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-3 mb-6">
          <Ionicons name="search" size={20} color="rgba(0,0,0,0.4)" />
          <TextInput
            placeholder="Search subscriptions..."
            placeholderTextColor="rgba(0,0,0,0.4)"
            className="flex-1 ml-3 text-base font-sans-medium text-primary"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="rgba(0,0,0,0.4)" />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <View className="px-5 mb-4">
            <SubscriptionCard
              {...item}
              expanded={expandedId === item.id}
              onPress={() => toggleExpand(item.id)}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20 px-10">
            <Text className="text-lg font-sans-medium text-muted-foreground text-center">
              No subscriptions found matching "{searchQuery}"
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}



export default Subscriptions

