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
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
// Thêm import này
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
  redDeep:  "#9b1c35",
  redMid:   "#c81e4a",
  redSoft:  "#e11d48",
  redLight: "#fda4af",
  redPale:  "#fff1f2",
  cream:    "#fdfaf8",
  warmGray: "#8a7e7e",
  border:   "rgba(155,28,53,0.18)",
  white:    "#ffffff",
  dark:     "#1a0a10",
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
      ["#e2d6d8", C.redSoft]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(anim.value, [0, 1], [2, 18]),
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
    borderAnim.value = withTiming(1, { duration: 200 });
  };
  const handleBlur = () => {
    setFocused(false);
    borderAnim.value = withTiming(0, { duration: 200 });
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
      [C.white, "#fffbfc"]
    ),
  }));

  return (
    <Animated.View style={[s.fieldWrap, borderStyle]}>
      <Ionicons
        name={icon}
        size={17}
        color={focused ? C.redSoft : C.redLight}
        style={{ marginRight: 6 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#d0bfc1"
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
        <TouchableOpacity onPress={onToggle} hitSlop={10}>
          <Ionicons
            name={isShown ? "eye-outline" : "eye-off-outline"}
            size={17}
            color={focused ? C.redSoft : C.redLight}
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

  // Trong function Index()
const router = useRouter();

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  // Form state
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPwd,   setShowPwd]   = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [loading,   setLoading]   = useState(false);

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

  // Sửa handleLogin
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
          colors={["#6b1122", C.redDeep, "#b8223f"]}
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
              <Text style={[s.fieldLabel, { marginTop: 18 }]}>Mật khẩu</Text>
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
                  colors={["#6b1122", C.redDeep, C.redMid]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.btnLogin}
                >
                  <Ionicons
                    name={loading ? "refresh-outline" : "arrow-forward-circle-outline"}
                    size={20}
                    color={C.white}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={s.btnLoginText}>
                    {loading ? "Đang xác thực..." : "ĐĂNG NHẬP"}
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
                <Ionicons name="card-outline" size={18} color={C.redDeep} />
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
          colors={["#fff1f2", "#ffffff", C.cream]}
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
    borderWidth: 1,
    borderColor: "rgba(155,28,53,0.18)",
    backgroundColor: "rgba(225,29,72,0.05)",
  },
  splashLogoWrap: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: C.redPale,
    borderWidth: 1.5,
    borderColor: "rgba(155,28,53,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 26,
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
    fontSize: 13,
    color: C.warmGray,
    marginTop: 10,
    letterSpacing: 0.4,
  },
  splashBottom: {
    position: "absolute",
    bottom: 52,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  splashDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(225,29,72,0.25)",
  },
  splashDotActive: {
    width: 18,
    backgroundColor: C.redSoft,
  },

  // ── Left panel ──
  panelLeft: {
    paddingHorizontal: 28,
    paddingVertical: 50,
    justifyContent: "space-between",
  },
  panelLeftTablet: { flex: 1.1 },

  brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandLogo: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  brandTitle: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 20,
    color: C.white,
    letterSpacing: 2,
  },
  brandSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "rgba(255,255,255,0.44)",
    marginTop: 2,
  },
  heroBlock: { flex: 1, justifyContent: "center", paddingVertical: 28 },
  heroTitle: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 40,
    color: C.white,
    lineHeight: 52,
    marginBottom: 18,
  },
  heroItalic: {
    fontFamily: "DMSerifDisplay_400Regular_Italic",
    color: C.redLight,
  },
  heroDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.46)",
    lineHeight: 23,
    maxWidth: 310,
  },
  statsRow: { flexDirection: "row", marginTop: 40 },
  statPill: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.18)",
    paddingLeft: 16,
    marginRight: 30,
  },
  statNum: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 24,
    color: C.white,
  },
  statLbl: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.36)",
    marginTop: 2,
  },
  panelFooter: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.2)",
    marginTop: 8,
  },

  // ── Right panel ──
  panelRight: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 38,
  },
  panelRightTablet: {
    paddingHorizontal: 56,
    paddingVertical: 52,
  },
  formWrap: { maxWidth: 400, width: "100%", alignSelf: "center" },

  // ── Form header ──
  formHeader: { marginBottom: 32 },
  headingBlock: { gap: 0 },
  accentLine: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.redSoft,
    marginBottom: 14,
  },
  headingInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  headingMain: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 32,
    color: C.dark,
    lineHeight: 38,
  },
  headingBadge: {
    backgroundColor: C.redDeep,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  headingBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: C.white,
    letterSpacing: 1.5,
  },
  headingDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: C.warmGray,
    lineHeight: 20,
  },

  // ── Fields ──
  fieldLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    color: C.warmGray,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  fieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 13,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: C.dark,
    ...({ outline: "none" } as any),
  },

  // ── Options ──
  optRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 26,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rememberText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: C.warmGray,
  },
  forgotText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: C.redSoft,
  },

  // Toggle switch
  toggleTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  // ── Buttons ──
  btnLoginWrap: { borderRadius: 13, overflow: "hidden" },
  btnLogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 13,
  },
  btnLoginText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: C.white,
    letterSpacing: 1.6,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
    gap: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(155,28,53,0.1)",
  },
  dividerText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#c4b0b3",
  },

  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "rgba(155,28,53,0.22)",
    borderRadius: 13,
    paddingVertical: 13,
    backgroundColor: C.cream,
  },
  btnSecondaryText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: C.redDeep,
  },

  disclaimer: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#c4b0b3",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 30,
  },
});