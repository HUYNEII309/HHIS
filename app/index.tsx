import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar
} from "react-native";

import { useEffect, useState } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";

export default function Index() {

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  const splashOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.6);
  const glow = useSharedValue(0.6);

  const formOpacity = useSharedValue(0);
  const formTranslate = useSharedValue(60);

  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {

    logoScale.value = withTiming(1, { duration: 900 });

    glow.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );

    setTimeout(() => {

      splashOpacity.value = withTiming(0, { duration: 800 });

      setTimeout(() => {

        setShowForm(true);

        formOpacity.value = withTiming(1, { duration: 700 });
        formTranslate.value = withTiming(0, { duration: 700 });

      }, 400);

    }, 1800);

  }, []);

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }]
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslate.value }]
  }));

  if (!loaded) return null;

  return (

    <LinearGradient
      colors={["#c81e4a", "#e11d48", "#fb7185"]}
      style={styles.container}
    >

      <StatusBar barStyle="light-content" />

      {/* SPLASH SCREEN */}

      <Animated.View style={[styles.splash, splashStyle]}>

        <Animated.Image
          source={require("../assets/images/logo100.png")}
          style={[styles.splashLogo, logoStyle, glowStyle]}
        />

        <Text style={styles.splashTitle}>HHIS</Text>

      </Animated.View>

      {/* LOGO HEADER */}

      <View style={styles.logoContainer}>

        <Image
          source={require("../assets/images/logo100.png")}
          style={styles.logo}
        />

        <View>

          <Text style={styles.title}>HHIS</Text>
          <Text style={styles.subtitle}>
            Hospital Information System
          </Text>

        </View>

      </View>

      {/* LOGIN FORM */}

      {showForm && (

        <Animated.View style={[styles.form, formStyle]}>

          <Text style={styles.loginTitle}>
            Đăng nhập hệ thống
          </Text>

          {/* EMAIL */}

          <View style={styles.inputBox}>

            <Ionicons
              name="mail-outline"
              size={20}
              color="#e11d48"
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
            />

          </View>

          {/* PASSWORD */}

          <View style={styles.inputBox}>

            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#e11d48"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >

              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#e11d48"
              />

            </TouchableOpacity>

          </View>

          {/* LOGIN BUTTON */}

          <TouchableOpacity activeOpacity={0.85}>

            <LinearGradient
              colors={["#e11d48", "#fb7185"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >

              <Text style={styles.buttonText}>
                ĐĂNG NHẬP
              </Text>

            </LinearGradient>

          </TouchableOpacity>

          <TouchableOpacity>

            <Text style={styles.forgot}>
              Quên mật khẩu?
            </Text>

          </TouchableOpacity>

        </Animated.View>

      )}

    </LinearGradient>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },

  splash: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#e11d48",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },

  splashLogo: {
    width: 120,
    height: 120,
    marginBottom: 10
  },

  splashTitle: {
    color: "#fff",
    fontSize: 34,
    fontFamily: "Inter_700Bold"
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35
  },

  logo: {
    width: 70,
    height: 70,
    marginRight: 14
  },

  title: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "Inter_700Bold",
    letterSpacing: 1
  },

  subtitle: {
    color: "#ffe4e6",
    fontSize: 13,
    fontFamily: "Inter_400Regular"
  },

  form: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 26,
    borderRadius: 22,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 12
  },

  loginTitle: {
    fontSize: 20,
    color: "#e11d48",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Inter_600SemiBold"
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecdd3",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fff"
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 6,
    fontFamily: "Inter_400Regular",
    fontSize: 15
  },

  button: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5
  },

  forgot: {
    textAlign: "center",
    marginTop: 15,
    color: "#e11d48",
    fontFamily: "Inter_500Medium"
  }

});