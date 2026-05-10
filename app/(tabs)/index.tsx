import "@/global.css"
import { FlatList, Image, Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscription from "@/components/UpcomingSubscription";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useState } from "react";

import { useUser } from "@clerk/expo";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  const { user } = useUser();
  const [expandedSubscription, setExpandedSubscription] = useState<string | null>(null)
  return (
    <SafeAreaView className="flex-1 bg-background p-5">

      <FlatList
        ListHeaderComponent={() => ( 
          <>
            <View className="mb-2.5 flex-row items-center justify-between">
              <View className="flex-row items-center">
                {user?.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} className="size-16 rounded-full" />
                ) : (
                  <Image source={images.avatar} className="size-16 rounded-full" />
                )}
                <Text className="ml-4 text-2xl font-sans-bold text-primary">
                  {user?.firstName ? `${user.firstName}` : HOME_USER.name}
                </Text>
              </View>

              <Image source={icons.add} className="size-10 rounded-full border border-border" />
            </View>

            <View className=" home-balance-card">
              <Text className=" home-balance-label">Remaining Balance</Text>
              <View className=" home-balance-row">
                <Text className="home-balance-amount">{formatCurrency((HOME_BALANCE.amount))}</Text>
                <Text className="home-balance-date">{dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}</Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No upcoming subscriptions</Text>}
                renderItem={({ item }) => (
                  <UpcomingSubscription {...item} />
                )}
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}

        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard {...item}
            expanded={expandedSubscription === item.id}
            onPress={() => setExpandedSubscription((currentId) => (currentId === item.id ? null : item.id))}
          />
        )}
        extraData={expandedSubscription}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No subscriptions found</Text>}
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}