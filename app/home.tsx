import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

/* Enable animation Android */
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ================= ROUTE MAP ================= */

const ROUTES: Record<string, string> = {
  "Quản lý nhân viên": "/staff",
  "Phân quyền chức năng": "/permission",
  "Gửi email tự động": "/email",
  "Đăng ký bản quyền": "/license",

  "Nhóm thủ thuật": "/procedure-group",
  "Thuốc - mẫu đơn thuốc": "/medicine",
  "Kho thuốc": "/warehouse",
  "Nhóm thuốc": "/drug-group",
  "Các khoản thu": "/income",
  "Các khoản chi": "/expense",
  "Phòng chức năng": "/department",

  "Đăng ký khám bệnh": "/register",
  "Danh sách kê đơn thuốc": "/prescription",
  "Danh sách lịch hẹn": "/appointment",
  "Phiếu thu": "/receipt",
  "Phiếu chi": "/payment",

  "Nhập thuốc": "/import",
  "Xuất thuốc": "/export",
  "Báo cáo nhập kho": "/report-import",
  "Báo cáo xuất kho": "/report-export",
  "Báo cáo nhập xuất tồn": "/report-stock",

  "Danh sách bệnh nhân khám bệnh": "/patient-list",
  "Báo cáo thủ thuật theo bác sĩ": "/report-doctor",
  "Danh sách bệnh nhân nợ tiền": "/debt",
  "Báo cáo tổng hợp thu chi": "/report-finance",

  "Thông tin sản phẩm": "/about",
  Hotline: "/hotline",
};

/* ================= DATA ================= */

const DATA = [
  {
    title: "Hệ thống",
    icon: "settings",
    color: "#6366f1",
    items: [
      { title: "Quản lý nhân viên", icon: "people-outline" },
      { title: "Phân quyền chức năng", icon: "lock-closed-outline" },
      { title: "Gửi email tự động", icon: "mail-outline" },
      { title: "Đăng ký bản quyền", icon: "shield-checkmark-outline" },
    ],
  },
  {
    title: "Danh mục",
    icon: "grid",
    color: "#0ea5e9",
    items: [
      { title: "Nhóm thủ thuật", icon: "construct-outline" },
      { title: "Thuốc - mẫu đơn thuốc", icon: "medkit-outline" },
      { title: "Kho thuốc", icon: "cube-outline" },
      { title: "Nhóm thuốc", icon: "layers-outline" },
      { title: "Các khoản thu", icon: "cash-outline" },
      { title: "Các khoản chi", icon: "card-outline" },
      { title: "Phòng chức năng", icon: "business-outline" },
    ],
  },
  {
    title: "Hồ sơ bệnh án",
    icon: "document-text",
    color: "#10b981",
    items: [
      { title: "Đăng ký khám bệnh", icon: "clipboard-outline" },
      { title: "Danh sách kê đơn thuốc", icon: "document-text-outline" },
      { title: "Danh sách lịch hẹn", icon: "calendar-outline" },
      { title: "Phiếu thu", icon: "wallet-outline" },
      { title: "Phiếu chi", icon: "cash-outline" },
    ],
  },
  {
    title: "Kho thuốc",
    icon: "medkit",
    color: "#ef4444",
    items: [
      { title: "Nhập thuốc", icon: "download-outline" },
      { title: "Xuất thuốc", icon: "exit-outline" },
      { title: "Báo cáo nhập kho", icon: "stats-chart-outline" },
      { title: "Báo cáo xuất kho", icon: "bar-chart-outline" },
      { title: "Báo cáo nhập xuất tồn", icon: "analytics-outline" },
    ],
  },
  {
    title: "Báo cáo",
    icon: "stats-chart",
    color: "#f59e0b",
    items: [
      { title: "Danh sách bệnh nhân khám bệnh", icon: "people-outline" },
      { title: "Báo cáo thủ thuật theo bác sĩ", icon: "pulse-outline" },
      { title: "Danh sách bệnh nhân nợ tiền", icon: "alert-circle-outline" },
      { title: "Báo cáo tổng hợp thu chi", icon: "pie-chart-outline" },
    ],
  },
  {
    title: "Trợ giúp",
    icon: "help-circle",
    color: "#8b5cf6",
    items: [
      { title: "Thông tin sản phẩm", icon: "information-circle-outline" },
      { title: "Hotline", icon: "call-outline" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Home() {
  const { colors, dark } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);

  const toggle = (i: number) => {
    LayoutAnimation.easeInEaseOut();
    setActive(active === i ? null : i);
  };

  const go = (title: string) => {
    const path = ROUTES[title];
    if (path) {
      router.push(path as any);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Home
            </Text>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        </View>

        {/* ===== DASHBOARD ===== */}
        <View style={styles.dashboard}>
          <View style={[styles.dashCard, { backgroundColor: "#3b82f620" }]}>
            <Ionicons name="people-outline" size={20} color="#3b82f6" />
            <Text style={styles.dashValue}>12</Text>
            <Text style={styles.dashLabel}>Chờ khám</Text>
          </View>

          <View style={[styles.dashCard, { backgroundColor: "#10b98120" }]}>
            <Ionicons name="calendar-outline" size={20} color="#10b981" />
            <Text style={styles.dashValue}>8</Text>
            <Text style={styles.dashLabel}>Lịch hẹn</Text>
          </View>

          <View style={[styles.dashCard, { backgroundColor: "#f59e0b20" }]}>
            <Ionicons name="wallet-outline" size={20} color="#f59e0b" />
            <Text style={styles.dashValue}>5</Text>
            <Text style={styles.dashLabel}>Phiếu thu</Text>
          </View>

          <View style={[styles.dashCard, { backgroundColor: "#ef444420" }]}>
            <Ionicons name="cash-outline" size={20} color="#ef4444" />
            <Text style={styles.dashValue}>15tr</Text>
            <Text style={styles.dashLabel}>Doanh thu</Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.container}>
          {DATA.map((item, i) => (
            <View
              key={i}
              style={[styles.card, { backgroundColor: colors.card }]}
            >
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggle(i)}
              >
                <View style={styles.left}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: item.color + "25" },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                    />
                  </View>

                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                </View>

                <Ionicons
                  name={active === i ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>

              {active === i && (
                <View style={styles.subWrap}>
                  {item.items.map((sub, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.subItem}
                      onPress={() => go(sub.title)}
                    >
                      <View style={styles.subLeft}>
                        <Ionicons
                          name={sub.icon as any}
                          size={16}
                          color="#8e8e93"
                          style={{ marginRight: 10 }}
                        />
                        <Text style={[styles.subText, { color: colors.text }]}>
                          {sub.title}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#c7c7cc"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },

  hello: {
    fontSize: 14,
    opacity: 0.6,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#c81e4a",
    justifyContent: "center",
    alignItems: "center",
  },

  dashboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  dashCard: {
    width: "48%",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  dashValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },

  dashLabel: {
    fontSize: 12,
    opacity: 0.7,
  },

  container: {
    paddingHorizontal: 16,
  },

  card: {
    borderRadius: 22,
    marginBottom: 14,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  subWrap: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  subItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: "rgba(0,0,0,0.03)",
  },

  subLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  subText: {
    fontSize: 14,
  },
});