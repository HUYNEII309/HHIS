import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";

import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from "@expo-google-fonts/dm-serif-display";

// ─── Tokens ────────────────────────────────────────────────────────
const C = {
  redDeep:  "#8A1930", // Tối ưu lại tone đỏ cho sang trọng hơn
  redMid:   "#C01C42",
  redSoft:  "#E11D48",
  redLight: "#FDA4AF",
  redPale:  "#FFF1F2",
  cream:    "#F8F9FA", // Chuyển sang tone xám/trắng nhạt để giao diện clean hơn
  warmGray: "#737373",
  border:   "rgba(138,25,48,0.12)",
  white:    "#FFFFFF",
  dark:     "#171717",
};

// ─── Toggle Switch ─────────────────────────────────────────────────
function ToggleSwitch({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) {
  const anim = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    anim.value = withSpring(value ? 1 : 0, {
      mass: 0.4,
      stiffness: 200,
      damping: 18,
    });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      anim.value,
      [0, 1],
      ["#E5E5E5", C.redSoft]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(anim.value, [0, 1], [2, 20]),
      },
    ],
  }));

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85}>
      <Animated.View style={[s.toggleTrack, trackStyle]}>
        <Animated.View style={[s.toggleThumb, thumbStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Input field ───────────────────────────────────────────────────
function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secure,
  showToggle,
  isShown,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: "default" | "email-address";
  secure?: boolean;
  showToggle?: boolean;
  isShown?: boolean;
  onToggle?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useSharedValue(0);

  const handleFocus = () => {
    setFocused(true);
    borderAnim.value = withTiming(1, { duration: 250 });
  };
  const handleBlur = () => {
    setFocused(false);
    borderAnim.value = withTiming(0, { duration: 250 });
  };

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      borderAnim.value,
      [0, 1],
      [C.border, C.redSoft]
    ),
    backgroundColor: interpolateColor(
      borderAnim.value,
      [0, 1],
      [C.white, C.white]
    ),
    shadowOpacity: interpolate(borderAnim.value, [0, 1], [0.02, 0.08]),
    transform: [{ scale: interpolate(borderAnim.value, [0, 1], [1, 1.01]) }],
  }));

  return (
    <Animated.View style={[s.fieldWrap, borderStyle]}>
      <Ionicons
        name={icon}
        size={18}
        color={focused ? C.redSoft : "#A3A3A3"}
        style={{ marginRight: 10 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A3A3A3"
        secureTextEntry={secure === true && isShown !== true}
        keyboardType={keyboardType ?? "default"}
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor={C.redSoft}
        cursorColor={C.redSoft}
        style={s.fieldInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showToggle && (
        <TouchableOpacity onPress={onToggle} hitSlop={15}>
          <Ionicons
            name={isShown ? "eye-outline" : "eye-off-outline"}
            size={18}
            color={focused ? C.redSoft : "#A3A3A3"}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

// ─── Floating particle for splash ─────────────────────────────────
function SplashParticle({
  delay,
  x,
  size,
  opacity,
}: {
  delay: number;
  x: number;
  size: number;
  opacity: number;
}) {
  const y = useSharedValue(0);
  const alpha = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(
        withTiming(-220, { duration: 3200, easing: Easing.linear }),
        -1,
        false
      )
    );
    alpha.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(opacity, { duration: 600 }),
          withTiming(opacity, { duration: 2000 }),
          withTiming(0, { duration: 600 })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: alpha.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 40,
          left: x,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "rgba(225,29,72,0.35)",
        },
        style,
      ]}
    />
  );
}

// ─── Stat pill ────────────────────────────────────────────────────
function StatPill({ num, label }: { num: string; label: string }) {
  return (
    <View style={s.statPill}>
      <Text style={s.statNum}>{num}</Text>
      <Text style={s.statLbl}>{label}</Text>
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────
export default function Index() {
  const { width } = useWindowDimensions();
  const isTablet  = width >= 768;
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  // Form state
  const [email,     setEmail]    = useState("");
  const [password,  setPassword] = useState("");
  const [showPwd,   setShowPwd]  = useState(false);
  const [remember,  setRemember] = useState(false);
  const [loading,   setLoading]  = useState(false);

  // ── Splash values ──
  const splashOpacity = useSharedValue(1);

  const logoScale    = useSharedValue(0);
  const logoY        = useSharedValue(0);
  const logoRotate   = useSharedValue(-8);

  const titleY       = useSharedValue(24);
  const titleOpacity = useSharedValue(0);

  const subOpacity   = useSharedValue(0);

  const ringScale    = useSharedValue(1);
  const ringOpacity  = useSharedValue(0.4);

  const [splashDone, setSplashDone] = useState(false);

  // ── Form values ──
  const formOpacity    = useSharedValue(0);
  const formTranslateY = useSharedValue(32);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    logoScale.value = withSpring(1, {
      mass: 0.7,
      stiffness: 160,
      damping: 12,
    });
    logoRotate.value = withSpring(0, {
      mass: 0.6,
      stiffness: 140,
      damping: 14,
    });

    logoY.value = withDelay(
      700,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0,  { duration: 1200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );

    titleOpacity.value = withDelay(350, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(
      350,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    subOpacity.value = withDelay(650, withTiming(1, { duration: 500 }));

    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(1,    { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 1400 }),
        withTiming(0.4,  { duration: 1400 })
      ),
      -1,
      false
    );

    const t1 = setTimeout(() => {
      splashOpacity.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      setTimeout(() => setSplashDone(true), 750);
    }, 2000);

    const t2 = setTimeout(() => {
      setShowForm(true);
      formOpacity.value    = withTiming(1, { duration: 700 });
      formTranslateY.value = withTiming(0, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      });
    }, 2400);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const splashContainerStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { translateY: logoY.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: subOpacity.value,
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity:   formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const handleLogin = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/home");
    }, 2000);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* ── Main layout ── */}
      <View style={[s.layout, isTablet && s.layoutRow]}>

        {/* LEFT PANEL */}
        <LinearGradient
          colors={["#5A0F1A", C.redDeep, "#A31631"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.panelLeft, isTablet && s.panelLeftTablet]}
        >
          <View style={s.brand}>
            <Image
              source={require("../assets/images/logo100.png")}
              style={s.brandLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={s.brandTitle}>HHIS</Text>
              <Text style={s.brandSub}>Hospital Health Information System</Text>
            </View>
          </View>

          {isTablet && (
            <View style={s.heroBlock}>
              <Text style={s.heroTitle}>
                {"Hệ thống\nquản lý "}
                <Text style={s.heroItalic}>{"thông minh\n"}</Text>
                {"bệnh viện"}
              </Text>
              <Text style={s.heroDesc}>
                Nền tảng số hóa toàn diện — kết nối bác sĩ, bệnh nhân và dữ
                liệu y tế trong một hệ sinh thái thống nhất.
              </Text>
              <View style={s.statsRow}>
                <StatPill num="99.9%" label="Uptime"     />
                <StatPill num="2.4M+" label="Hồ sơ"      />
                <StatPill num="340+"  label="Cơ sở y tế" />
              </View>
            </View>
          )}

          <Text style={s.panelFooter}>© 2026 HHIS — Bảo mật ISO 27001</Text>
        </LinearGradient>

        {/* RIGHT PANEL */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            s.panelRight,
            isTablet && s.panelRightTablet,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {showForm && (
            <Animated.View style={[s.formWrap, formStyle]}>

              {/* ── Header ── */}
              <View style={s.formHeader}>
                <View style={s.headingBlock}>
                  <View style={s.accentLine} />
                  <View style={s.headingInner}>
                    <Text style={s.headingMain}>Đăng nhập</Text>
                    <View style={s.headingBadge}>
                      <Text style={s.headingBadgeText}>HHIS</Text>
                    </View>
                  </View>
                  <Text style={s.headingDesc}>
                    Nhập thông tin tài khoản để tiếp tục làm việc.
                  </Text>
                </View>
              </View>

              {/* ── Email ── */}
              <Text style={s.fieldLabel}>Email / Mã nhân viên</Text>
              <Field
                icon="mail-outline"
                placeholder="example@hospital.vn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              {/* ── Password ── */}
              <Text style={[s.fieldLabel, { marginTop: 20 }]}>Mật khẩu</Text>
              <Field
                icon="lock-closed-outline"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
                secure
                showToggle
                isShown={showPwd}
                onToggle={() => setShowPwd((p) => !p)}
              />

              {/* ── Options row ── */}
              <View style={s.optRow}>
                <View style={s.rememberRow}>
                  <ToggleSwitch
                    value={remember}
                    onToggle={() => setRemember((r) => !r)}
                  />
                  <Text style={s.rememberText}>Ghi nhớ đăng nhập</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={s.forgotText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              {/* ── Login button ── */}
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={handleLogin}
                style={s.btnLoginWrap}
              >
                <LinearGradient
                  colors={[C.redMid, C.redDeep]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.btnLogin}
                >
                  <Ionicons
                    name={loading ? "refresh-outline" : "arrow-forward-circle-outline"}
                    size={22}
                    color={C.white}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={s.btnLoginText}>
                    {loading ? "ĐANG XÁC THỰC..." : "ĐĂNG NHẬP"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* ── Divider ── */}
              <View style={s.divider}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>hoặc</Text>
                <View style={s.dividerLine} />
              </View>

              {/* ── Card login ── */}
              <TouchableOpacity activeOpacity={0.82} style={s.btnSecondary}>
                <Ionicons name="card-outline" size={20} color={C.redDeep} />
                <Text style={s.btnSecondaryText}>
                  Đăng nhập bằng thẻ nhân viên
                </Text>
              </TouchableOpacity>

              <Text style={s.disclaimer}>
                Chỉ dành cho nhân viên được cấp quyền truy cập.{"\n"}
                Mọi hoạt động đều được ghi lại và giám sát.
              </Text>

            </Animated.View>
          )}
        </ScrollView>
      </View>

      {/* ── Splash overlay ── */}
      <Animated.View
        style={[StyleSheet.absoluteFill, s.splash, splashContainerStyle]}
        pointerEvents={splashDone ? "none" : "auto"}
      >
        <LinearGradient
          colors={["#FFF1F2", "#FFFFFF", C.cream]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <SplashParticle delay={0}    x={40}  size={5} opacity={0.35} />
        <SplashParticle delay={600}  x={90}  size={3} opacity={0.25} />
        <SplashParticle delay={300}  x={160} size={6} opacity={0.3}  />
        <SplashParticle delay={900}  x={240} size={4} opacity={0.2}  />
        <SplashParticle delay={200}  x={290} size={5} opacity={0.28} />
        <SplashParticle delay={1100} x={340} size={3} opacity={0.22} />

        <Animated.View style={[s.splashRing, ringStyle]} />

        <Animated.View style={[s.splashLogoWrap, logoStyle]}>
          <Image
            source={require("../assets/images/logo100.png")}
            style={s.splashLogo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text style={[s.splashTitle, titleStyle]}>
          HHIS
        </Animated.Text>

        <Animated.Text style={[s.splashSub, subStyle]}>
          Hospital Health Information System
        </Animated.Text>

        <Animated.View style={[s.splashBottom, subStyle]}>
          <View style={s.splashDot} />
          <View style={[s.splashDot, s.splashDotActive]} />
          <View style={s.splashDot} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },
  layout:    { flex: 1 },
  layoutRow: { flexDirection: "row" },

  // ── Splash ──
  splash: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
    overflow: "hidden",
  },
  splashRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: "rgba(225,29,72,0.12)",
    backgroundColor: "rgba(225,29,72,0.03)",
  },
  splashLogoWrap: {
    width: 110,
    height: 110,
    borderRadius: 32,
    backgroundColor: C.redPale,
    borderWidth: 1.5,
    borderColor: "rgba(225,29,72,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 26,
    ...Platform.select({
      ios: {
        shadowColor: C.redDeep,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  splashLogo: { width: 74, height: 74 },
  splashTitle: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 44,
    color: C.redDeep,
    letterSpacing: 6,
  },
  splashSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: C.warmGray,
    marginTop: 10,
    letterSpacing: 0.4,
  },
  splashBottom: {
    position: "absolute",
    bottom: 52,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  splashDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(225,29,72,0.2)",
  },
  splashDotActive: {
    width: 20,
    backgroundColor: C.redSoft,
  },

  // ── Left panel ──
  panelLeft: {
    paddingHorizontal: 32,
    paddingVertical: 56,
    justifyContent: "space-between",
  },
  panelLeftTablet: { flex: 1.1 },

  brand: { flexDirection: "row", alignItems: "center", gap: 14 },
  brandLogo: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  brandTitle: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 22,
    color: C.white,
    letterSpacing: 2,
  },
  brandSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  heroBlock: { flex: 1, justifyContent: "center", paddingVertical: 28 },
  heroTitle: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 44,
    color: C.white,
    lineHeight: 56,
    marginBottom: 20,
  },
  heroItalic: {
    fontFamily: "DMSerifDisplay_400Regular_Italic",
    color: C.redLight,
  },
  heroDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
    maxWidth: 320,
  },
  statsRow: { flexDirection: "row", marginTop: 46 },
  statPill: {
    borderLeftWidth: 1.5,
    borderLeftColor: "rgba(255,255,255,0.2)",
    paddingLeft: 18,
    marginRight: 32,
  },
  statNum: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 26,
    color: C.white,
  },
  statLbl: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  panelFooter: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginTop: 8,
  },

  // ── Right panel ──
  panelRight: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 42,
  },
  panelRightTablet: {
    paddingHorizontal: 60,
    paddingVertical: 56,
  },
  formWrap: { maxWidth: 420, width: "100%", alignSelf: "center" },

  // ── Form header ──
  formHeader: { marginBottom: 36 },
  headingBlock: { gap: 0 },
  accentLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.redSoft,
    marginBottom: 16,
  },
  headingInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  headingMain: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 34,
    color: C.dark,
    lineHeight: 40,
  },
  headingBadge: {
    backgroundColor: C.redPale,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "rgba(225,29,72,0.15)",
  },
  headingBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: C.redDeep,
    letterSpacing: 1.5,
  },
  headingDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: C.warmGray,
    lineHeight: 22,
  },

  // ── Fields ──
  fieldLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: C.warmGray,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  fieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16, // Bo tròn nhiều hơn
    paddingHorizontal: 16,
    minHeight: 56, // Cao hơn để dễ chạm
    backgroundColor: C.white,
    ...Platform.select({
      ios: {
        shadowColor: C.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: C.dark,
    ...({ outline: "none" } as any),
  },

  // ── Options ──
  optRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rememberText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: C.warmGray,
  },
  forgotText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: C.redSoft,
  },

  // Toggle switch
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // ── Buttons ──
  btnLoginWrap: { 
    borderRadius: 16, 
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: C.redDeep,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  btnLogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18, // Tăng diện tích bấm
    borderRadius: 16,
  },
  btnLoginText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: C.white,
    letterSpacing: 1.8,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 26,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)", // Mềm mại hơn
  },
  dividerText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#A3A3A3",
  },

  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(138,25,48,0.15)",
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: C.white,
    ...Platform.select({
      ios: {
        shadowColor: C.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  btnSecondaryText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: C.redDeep,
  },

  disclaimer: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#A3A3A3",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 36,
  },
});