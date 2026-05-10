import { View, Text, TouchableOpacity, Image } from 'react-native'
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";


const SafeAreaView = styled(RNSafeAreaView)

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary mb-8">Settings</Text>

      {/* Profile Card */}
      <View className="bg-card p-6 rounded-3xl border border-border mb-6">
        <View className="flex-row items-center gap-5">
          <View className="relative">
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} className="size-20 rounded-full" />
            ) : (
              <View className="size-20 rounded-full bg-accent items-center justify-center">
                <Text className="text-3xl font-sans-bold text-white">
                  {user?.firstName?.[0] || "U"}
                </Text>
              </View>
            )}
            <View className="absolute bottom-0 right-0 size-6 bg-success rounded-full border-2 border-card" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-sans-bold text-primary">
              {user?.fullName || "User Name"}
            </Text>
            <Text className="text-base font-sans-medium text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress || "email@example.com"}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="gap-4">
        <TouchableOpacity
          className="bg-card p-5 rounded-2xl border border-border flex-row items-center justify-between"
          onPress={() => {}}
        >
          <Text className="text-lg font-sans-bold text-primary">Edit Profile</Text>
          <View className="size-8 items-center justify-center rounded-full bg-muted">
            <Text className="text-primary">→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-destructive/10 p-5 rounded-2xl border border-destructive/20 flex-row items-center justify-between"
        >
          <Text className="text-lg font-sans-bold text-destructive">Sign Out</Text>
          <View className="size-8 items-center justify-center rounded-full bg-destructive/10">
            <Text className="text-destructive">×</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default Settings