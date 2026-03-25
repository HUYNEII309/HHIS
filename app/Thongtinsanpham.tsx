import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const B = {
  primary: "#8A1930",
  primaryLight: "#C01C42",
  primaryDark: "#8A1930",
  background: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
  textTitle: "#1E293B",
  textSub: "#64748B",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
};

const TEAM_PROFILES = [
  {
    id: 1,
    name: "Nguyễn Văn Huy",
    role: "Lead Developer & Architect",
    avatar: "👨‍💻",
    initials: "HV",
    bio: "Chuyên gia phát triển phần mềm với hơn 8 năm kinh nghiệm trong lĩnh vực y tế. Đam mê tạo ra các giải pháp công nghệ giúp cải thiện chất lượng chăm sóc sức khỏe.",
    skills: ["React Native", "Node.js", "TypeScript", "Healthcare Systems"],
    achievements: [
      { icon: "code-slash", label: "100+ Projects" },
      { icon: "people", label: "50+ Clients" },
      { icon: "heart", label: "5+ Yrs Healthcare" },
    ],
    color: "#10B981",
    gradientStart: "#D1FAE5",
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    role: "UI/UX Designer & Product Manager",
    avatar: "👩‍🎨",
    initials: "MT",
    bio: "Thiết kế trải nghiệm người dùng xuất sắc với tâm huyết dành cho ngành y tế. Tạo ra giao diện thân thiện, dễ sử dụng cho cả nhân viên y tế và bệnh nhân.",
    skills: ["UI/UX Design", "Figma", "User Research", "Product Strategy"],
    achievements: [
      { icon: "brush", label: "50+ Designs" },
      { icon: "trophy", label: "Award Winner" },
      { icon: "school", label: "UX Certified" },
    ],
    color: "#F59E0B",
    gradientStart: "#FEF3C7",
  },
  {
    id: 3,
    name: "Lê Minh Tuấn",
    role: "Backend Developer & Database Architect",
    avatar: "👨‍🔧",
    initials: "TL",
    bio: "Chuyên gia cơ sở dữ liệu và API với kinh nghiệm xây dựng hệ thống y tế lớn. Đảm bảo dữ liệu bệnh nhân luôn an toàn và hệ thống hoạt động ổn định 24/7.",
    skills: ["PostgreSQL", "MongoDB", "REST APIs", "Security"],
    achievements: [
      { icon: "server", label: "99.9% Uptime" },
      { icon: "layers", label: "1M+ Records" },
      { icon: "shield-checkmark", label: "Security Expert" },
    ],
    color: "#3B82F6",
    gradientStart: "#DBEAFE",
  },
  {
    id: 4,
    name: "Phạm Thu Hương",
    role: "Quality Assurance & Testing Lead",
    avatar: "👩‍🔬",
    initials: "HP",
    bio: "Đảm bảo chất lượng sản phẩm với quy trình kiểm thử nghiêm ngặt. Chuyên gia phát hiện và ngăn chặn lỗi trước khi sản phẩm đến tay người dùng.",
    skills: [
      "Automated Testing",
      "Manual Testing",
      "Quality Assurance",
      "Bug Tracking",
    ],
    achievements: [
      { icon: "checkmark-circle", label: "Zero Critical Bugs" },
      { icon: "analytics", label: "100% Coverage" },
      { icon: "ribbon", label: "QA Certified" },
    ],
    color: "#F43F5E",
    gradientStart: "#FFE4E6",
  },
  {
    id: 5,
    name: "Đỗ Quang Vinh",
    role: "DevOps Engineer & Cloud Architect",
    avatar: "👨‍🚀",
    initials: "VD",
    bio: "Quản lý hạ tầng đám mây và triển khai tự động. Đảm bảo hệ thống luôn sẵn sàng và có thể mở rộng theo nhu cầu của bệnh viện.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    achievements: [
      { icon: "cloud", label: "Auto-scaling" },
      { icon: "flash", label: "99.99% SLA" },
      { icon: "planet", label: "Cloud Certified" },
    ],
    color: "#8B5CF6",
    gradientStart: "#EDE9FE",
  },
];

const APP_STATS = [
  { icon: "people", value: "500+", label: "Bệnh viện", color: B.success },
  { icon: "person", value: "50K+", label: "Người dùng", color: B.info },
  { icon: "document-text", value: "2M+", label: "Hồ sơ", color: B.warning },
  { icon: "star", value: "4.9", label: "Đánh giá", color: B.primary },
];

const TypeWriter = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => {
        setDisplayText((p) => p + text[idx]);
        setIdx((p) => p + 1);
      }, speed);
      return () => clearTimeout(t);
    }
  }, [idx, text, speed]);
  return <Text style={st.bioText}>{displayText}</Text>;
};

const MemberCard = ({
  profile,
  index,
}: {
  profile: (typeof TEAM_PROFILES)[0];
  index: number;
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 700,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        st.memberCard,
        { opacity: fade, transform: [{ translateY: slide }] },
      ]}>
      {/* Color bar top */}
      <View style={[st.memberColorBar, { backgroundColor: profile.color }]} />

      <View style={st.memberCardInner}>
        {/* Header row */}
        <View style={st.memberHeader}>
          <View
            style={[
              st.memberAvatarWrap,
              { backgroundColor: profile.gradientStart },
            ]}>
            <Text style={st.memberAvatarEmoji}>{profile.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.memberName}>{profile.name}</Text>
            <View
              style={[st.roleChip, { backgroundColor: profile.color + "18" }]}>
              <Text style={[st.roleChipTxt, { color: profile.color }]}>
                {profile.role}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={[st.expandBtn, { backgroundColor: profile.color + "15" }]}>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={profile.color}
            />
          </TouchableOpacity>
        </View>

        {/* Achievements always visible */}
        <View style={st.achieveRow}>
          {profile.achievements.map((a, i) => (
            <View
              key={i}
              style={[
                st.achieveChip,
                { backgroundColor: profile.gradientStart },
              ]}>
              <Ionicons name={a.icon as any} size={11} color={profile.color} />
              <Text style={[st.achieveLabel, { color: profile.color }]}>
                {a.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Expanded: bio + skills */}
        {expanded && (
          <View style={st.expandedContent}>
            <View
              style={[st.bioBox, { backgroundColor: profile.gradientStart }]}>
              <TypeWriter text={profile.bio} speed={20} />
            </View>

            <View style={st.skillsWrap}>
              <Text style={[st.skillsTitle, { color: profile.color }]}>
                Kỹ năng
              </Text>
              <View style={st.skillsList}>
                {profile.skills.map((skill, i) => (
                  <View
                    key={i}
                    style={[
                      st.skillTag,
                      {
                        borderColor: profile.color + "60",
                        backgroundColor: profile.gradientStart,
                      },
                    ]}>
                    <Text style={[st.skillTxt, { color: profile.color }]}>
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default function ThongTinSanPham() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const heroScale = scrollY.interpolate({
    inputRange: [-80, 0, 200],
    outputRange: [1.1, 1, 0.92],
    extrapolate: "clamp",
  });
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const heroTranslate = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={B.primaryDark} />

      {/* ── FLOATING BACK BUTTON ── */}
      <SafeAreaView edges={["top"]} style={st.topBar} pointerEvents="box-none">
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={B.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}>
        {/* ── HERO ── */}
        <Animated.View
          style={[
            st.hero,
            {
              transform: [{ scale: heroScale }, { translateY: heroTranslate }],
              opacity: heroOpacity,
            },
          ]}>
          {/* Background pattern */}
          <View style={st.heroPattern}>
            {[...Array(8)].map((_, i) => (
              <View
                key={i}
                style={[
                  st.heroDot,
                  {
                    top: Math.random() * 200,
                    left: Math.random() * width,
                    opacity: 0.12 + i * 0.04,
                  },
                ]}
              />
            ))}
          </View>

          {/* Logo */}
          <View style={st.heroLogoWrap}>
            <View style={st.heroLogoOuter}>
              <View style={st.heroLogoInner}>
                <Ionicons name="medkit" size={38} color={B.primary} />
              </View>
            </View>
          </View>
          <Text style={st.heroAppName}>HHIS</Text>
          <View style={st.heroBadge}>
            <View style={st.heroBadgeDot} />
            <Text style={st.heroBadgeTxt}>
              Phiên bản 1.4.0 · Đang hoạt động
            </Text>
          </View>
        </Animated.View>

        <View style={st.body}>
          {/* ── STATS ROW ── */}
          <View style={st.statsCard}>
            {APP_STATS.map((stat, i) => (
              <View
                key={i}
                style={[
                  st.statItem,
                  i < APP_STATS.length - 1 && st.statBorder,
                ]}>
                <View
                  style={[
                    st.statIconBox,
                    { backgroundColor: stat.color + "18" },
                  ]}>
                  <Ionicons
                    name={stat.icon as any}
                    size={16}
                    color={stat.color}
                  />
                </View>
                <Text style={[st.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={st.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* ── APP FEATURES ── */}
          <View style={st.section}>
            <View style={st.sectionHeader}>
              <View style={st.sectionAccent} />
              <Text style={st.sectionTitle}>Tính năng nổi bật</Text>
            </View>
            <View style={st.featureGrid}>
              {[
                {
                  icon: "document-text",
                  label: "Hồ sơ điện tử",
                  desc: "Quản lý bệnh án số",
                  color: B.info,
                },
                {
                  icon: "calendar",
                  label: "Đặt lịch khám",
                  desc: "Lịch hẹn thông minh",
                  color: B.success,
                },
                {
                  icon: "stats-chart",
                  label: "Thống kê",
                  desc: "Báo cáo chi tiết",
                  color: B.warning,
                },
                {
                  icon: "shield-checkmark",
                  label: "Bảo mật",
                  desc: "Mã hoá dữ liệu",
                  color: B.primary,
                },
                {
                  icon: "notifications",
                  label: "Thông báo",
                  desc: "Nhắc nhở tự động",
                  color: "#8B5CF6",
                },
                {
                  icon: "phone-portrait",
                  label: "Đa nền tảng",
                  desc: "iOS & Android",
                  color: "#F43F5E",
                },
              ].map((f, i) => (
                <View key={i} style={st.featureItem}>
                  <View
                    style={[
                      st.featureIcon,
                      { backgroundColor: f.color + "14" },
                    ]}>
                    <Ionicons name={f.icon as any} size={20} color={f.color} />
                  </View>
                  <Text style={st.featureName}>{f.label}</Text>
                  <Text style={st.featureDesc}>{f.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── TEAM ── */}
          <View style={st.section}>
            <View style={st.sectionHeader}>
              <View style={st.sectionAccent} />
              <Text style={st.sectionTitle}>Đội ngũ phát triển</Text>
            </View>
            <Text style={st.sectionSub}>
              Những chuyên gia đam mê công nghệ & y tế, kiến tạo nên HHIS
            </Text>

            {TEAM_PROFILES.map((p, i) => (
              <MemberCard key={p.id} profile={p} index={i} />
            ))}
          </View>

          {/* ── CONTACT ── */}
          <View style={st.contactCard}>
            <View style={st.contactTop}>
              <View style={st.contactIconBox}>
                <Ionicons name="mail" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.contactTitle}>Liên hệ & Hỗ trợ</Text>
                <Text style={st.contactSub}>
                  Chúng tôi luôn sẵn sàng hỗ trợ 24/7
                </Text>
              </View>
            </View>
            <View style={st.contactDivider} />
            {[
              { icon: "call-outline", text: "0338.300.901", label: "Hotline" },
              { icon: "mail-outline", text: "Huyanchau309@gmail.com", label: "Email" },
              {
                icon: "location-outline",
                text: "An Châu Yên Khang · Ý Yên · Nam Định",
                label: "Địa chỉ",
              },
            ].map((c, i) => (
              <View key={i} style={st.contactRow}>
                <View style={st.contactRowIcon}>
                  <Ionicons name={c.icon as any} size={14} color={B.primary} />
                </View>
                <View>
                  <Text style={st.contactRowLabel}>{c.label}</Text>
                  <Text style={st.contactRowText}>{c.text}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── FOOTER ── */}
          <View style={st.footer}>
            <View style={st.footerLogoRow}>
              <View style={st.footerLogo}>
                <Ionicons name="medkit" size={18} color="#fff" />
              </View>
              <Text style={st.footerLogoTxt}>HHIS</Text>
            </View>
            <Text style={st.footerTagline}>Phát triển với ❤️ tại Việt Nam</Text>
            <Text style={st.footerCopy}>© 2026 HHIS. All rights reserved.</Text>
            <Text style={st.footerThanks}>
              Cảm ơn bạn đã tin tưởng và sử dụng sản phẩm của chúng tôi
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: B.background },

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },

  // Hero
  hero: {
    height: 340,
    backgroundColor: B.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    overflow: "hidden",
  },
  heroPattern: { position: "absolute", inset: 0 },
  heroDot: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
  },
  heroLogoWrap: { marginBottom: 16, marginTop: 20 },
  heroLogoOuter: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroLogoInner: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: B.white,
    justifyContent: "center",
    alignItems: "center",
  },
  heroAppName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroTagline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 6,
    fontWeight: "500",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: B.success,
  },
  heroBadgeTxt: {
    fontSize: 11,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },

  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },

  // Stats
  statsCard: {
    flexDirection: "row",
    backgroundColor: B.white,
    borderRadius: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.09,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 16, gap: 4 },
  statBorder: { borderRightWidth: 1, borderRightColor: B.border },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  statValue: { fontSize: 16, fontWeight: "900" },
  statLabel: {
    fontSize: 9,
    color: B.textSub,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // Section
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: B.primary,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: B.textTitle },
  sectionSub: {
    fontSize: 13,
    color: B.textSub,
    marginBottom: 16,
    lineHeight: 19,
    paddingLeft: 14,
  },

  // Features
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 10,
  },
  featureItem: {
    width: (width - 32 - 10) / 3,
    backgroundColor: B.white,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: B.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  featureName: {
    fontSize: 11,
    fontWeight: "700",
    color: B.textTitle,
    textAlign: "center",
  },
  featureDesc: { fontSize: 9, color: B.textSub, textAlign: "center" },

  // Member card
  memberCard: {
    backgroundColor: B.white,
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: B.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  memberColorBar: { height: 4, width: "100%" },
  memberCardInner: { padding: 14, gap: 12 },
  memberHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  memberAvatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  memberAvatarEmoji: { fontSize: 26 },
  memberName: {
    fontSize: 15,
    fontWeight: "800",
    color: B.textTitle,
    marginBottom: 5,
  },
  roleChip: {
    alignSelf: "flex-start",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleChipTxt: { fontSize: 10, fontWeight: "700" },
  expandBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  achieveRow: { flexDirection: "row", gap: 7, flexWrap: "wrap" },
  achieveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  achieveLabel: { fontSize: 10, fontWeight: "700" },
  expandedContent: { gap: 12 },
  bioBox: { borderRadius: 10, padding: 12, minHeight: 50 },
  bioText: { fontSize: 13, color: B.textSub, lineHeight: 19 },
  skillsWrap: { gap: 8 },
  skillsTitle: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  skillsList: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillTag: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillTxt: { fontSize: 11, fontWeight: "600" },

  // Contact
  contactCard: {
    backgroundColor: B.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginBottom: 22,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  contactTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: B.primary,
    padding: 16,
  },
  contactIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contactTitle: { fontSize: 15, fontWeight: "800", color: "#fff" },
  contactSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  contactDivider: { height: 1, backgroundColor: B.border },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  contactRowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  contactRowLabel: {
    fontSize: 10,
    color: B.textSub,
    fontWeight: "600",
    marginBottom: 2,
  },
  contactRowText: { fontSize: 13, color: B.textTitle, fontWeight: "600" },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: B.border,
    marginTop: 6,
  },
  footerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  footerLogo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLogoTxt: {
    fontSize: 22,
    fontWeight: "900",
    color: B.primary,
    letterSpacing: 2,
  },
  footerTagline: {
    fontSize: 13,
    fontWeight: "600",
    color: B.textTitle,
    marginBottom: 4,
  },
  footerCopy: { fontSize: 11, color: B.textSub, marginBottom: 6 },
  footerThanks: {
    fontSize: 12,
    color: B.textSub,
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 20,
  },
});
