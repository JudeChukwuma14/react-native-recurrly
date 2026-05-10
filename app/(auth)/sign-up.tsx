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
import { useSignUp } from "@clerk/expo";
import { useRouter, Link } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

/**
 * Render the two-step sign-up screen that creates an account with email/password, sends a verification code, and verifies the code to finalize sign-up and navigate to the app root.
 *
 * @returns The sign-up screen's JSX element.
 */
export default function SignUp() {
  const { signUp, fetchStatus } = useSignUp();


  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Start the sign up process
  const onSignUpPress = async () => {
    if (fetchStatus === "fetching") return;
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await signUp.password({
        emailAddress: email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid details");
        return;
      }

      // Split name into first and last for Clerk
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      // Update the user profile with the name
      await signUp.update({
        firstName,
        lastName,
      });

      // Send verification email
      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (err: any) {

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Verify the email address
  const onVerifyPress = async () => {
    if (fetchStatus === "fetching") return;

    setLoading(true);
    setError("");

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (error) {
        setError(error.message || "Invalid verification code");
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: (params) => {
            const url = params.decorateUrl("/");
            router.replace(url as any);
          },
        });
      } else {
        setError("Verification failed. Please check the code.");
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
              <Text className="auth-title text-center">
                {pendingVerification ? "Verify email" : "Create account"}
              </Text>
              <Text className="auth-subtitle text-center">
                {pendingVerification
                  ? `Enter the code sent to ${email}`
                  : "Join Recurly to manage your subscriptions easily"}
              </Text>
            </View>

            {/* Form Section */}
            <View className="auth-card">
              {!pendingVerification ? (
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Full Name</Text>
                    <TextInput
                      className={`auth-input ${error === "Please enter your full name." ? "auth-input-error" : ""}`}
                      placeholder="Enter your full name"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>

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
                      placeholder="Create a password"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  {error ? <Text className="auth-error text-center">{error}</Text> : null}

                  <TouchableOpacity
                    className={`auth-button ${loading ? "auth-button-disabled" : ""}`}
                    onPress={onSignUpPress}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Continue</Text>
                    )}
                  </TouchableOpacity>

                  {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
                  <View nativeID="clerk-captcha" />
                </View>

              ) : (
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className={`auth-input ${error ? "auth-input-error" : ""}`}
                      placeholder="Enter code"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      keyboardType="number-pad"
                      value={code}
                      onChangeText={setCode}
                    />
                  </View>

                  {error ? <Text className="auth-error text-center">{error}</Text> : null}

                  <TouchableOpacity
                    className={`auth-button ${loading ? "auth-button-disabled" : ""}`}
                    onPress={onVerifyPress}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify account</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPendingVerification(false)}
                    className="items-center py-2"
                  >
                    <Text className="auth-link">Back to sign up</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!pendingVerification && (
                <View className="auth-link-row">
                  <Text className="auth-link-copy">Already have an account?</Text>
                  <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                      <Text className="auth-link">Sign in</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}