import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSignIn } from "@clerk/expo";
import { useRouter, Link } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignIn() {
  const { signIn, fetchStatus } = useSignIn();


  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignInPress = async () => {
    if (fetchStatus === "fetching") return;

    setLoading(true);
    setError("");

    try {
      const { error } = await signIn.password({
        identifier: email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid credentials");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: (params) => {
            const url = params.decorateUrl("/");
            router.replace(url as any);
          },
        });
      } else {
        setError("Sign-in attempt not complete.");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <SafeAreaView className="auth-safe-area">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="auth-content">
            {/* Logo Section */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Smart Billing</Text>
                </View>
              </View>
            </View>

            {/* Title Section */}
            <View className="items-center mt-6">
              <Text className="auth-title text-center">Welcome back</Text>
              <Text className="auth-subtitle text-center">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            {/* Form Section */}
            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={`auth-input ${error ? "auth-input-error" : ""}`}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${error ? "auth-input-error" : ""}`}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                {error ? <Text className="auth-error text-center">{error}</Text> : null}

                <TouchableOpacity
                  className={`auth-button ${loading ? "auth-button-disabled" : ""}`}
                  onPress={onSignInPress}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Sign in</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">New to Recurly?</Text>
                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity>
                    <Text className="auth-link">Create an account</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}