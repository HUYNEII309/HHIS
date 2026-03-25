import React, { useState, useEffect, useMemo } from "react";
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
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const B = {
  primary: "#8A1930",
  primaryLight: "#C01C42",
  background: "#F8FAFC",
  white: "#FFFFFF",
  textTitle: "#0F172A",
  textSub: "#64748B",
  highlight: "#FFF1F2",
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
};

const ROUTES: Record<string, string> = {
  "Đăng ký khám bệnh": "/Hosobenhan/Benhnhan",
  "Danh sách bệnh nhân": "/Hosobenhan/Danhsachbenhnhan",
  "Danh sách kê đơn thuốc": "/Donthuoc/Donthuocbn",
  "Danh sách lịch hẹn": "/Lichhen/Lichhenbn",
  "Phiếu thu": "/ThuChi/Ds_phieuthu",
  "Phiếu chi": "/ThuChi/Ds_phieuchi",
  "Nhóm thủ thuật": "/DanhMuc/Nhomthuthuat",
  "Thuốc - mẫu đơn thuốc": "/DanhMuc/Thuoc_Maudonthuoc",
  "Kho thuốc": "/DanhMuc/Khothuocpk",
  "Nhóm thuốc": "/DanhMuc/Nhomthuocvattu",
  "Các khoản thu": "/DanhMuc/Cacloaikhoanthu",
  "Các khoản chi": "/DanhMuc/Cacloaikhoanchi",
  "Phòng chức năng": "/DanhMuc/Phongchucnang",
  "Nhập thuốc": "/Khothuocpk/Nhapthuocpk",
  "Xuất thuốc": "/Khothuocpk/Xuatthuocpk",
  "Báo cáo nhập kho": "/Khothuocpk/Baocaonhapthuoc",
  "Báo cáo xuất kho": "/Khothuocpk/Baocaoxuatthuoc",
  "Báo cáo nhập xuất tồn": "/Khothuocpk/Nhapxuatton",
  "Danh sách bệnh nhân khám bệnh": "/Baocaotonghop/Danhsachbenhnhankhambenh",
  "Báo cáo thủ thuật theo bác sĩ": "/Baocaotonghop/Baocaothuthuattheobacsi",
  "Danh sách bệnh nhân nợ tiền": "/Baocaotonghop/Danhsachbenhnhannotien",
  "Báo cáo tổng hợp thu chi": "/Baocaotonghop/Baocaothuchi",
  "Quản lý nhân viên": "/HeThong/Quanlynhanvien",
  "Phân quyền chức năng": "/HeThong/Phanquyenchucnang",
  "Gửi email tự động": "/HeThong/Guiemailtudong",
  "Đăng ký bản quyền": "/HeThong/Dangkybanquyen",
  "Thông tin sản phẩm": "/Thongtinsanpham",
};

// 1. DATA ĐÃ SẮP XẾP THEO TRÌNH TỰ: Hồ sơ bệnh nhân -> Danh mục -> Kho thuốc -> Báo cáo -> Hệ thống
const DATA = [
  {
    title: "Hồ sơ bệnh án",
    icon: "reader-sharp",
    color: "#10B981",
    items: [
      { title: "Đăng ký khám bệnh", icon: "create-outline"},
      { title: "Danh sách bệnh nhân", icon: "people"},
      { title: "Danh sách kê đơn thuốc", icon: "receipt-outline" },
      { title: "Danh sách lịch hẹn", icon: "alarm-outline" },
      { title: "Phiếu thu", icon: "wallet-outline" },
      { title: "Phiếu chi", icon: "card-outline" },
    ],
  },
  {
    title: "Danh mục",
    icon: "grid-sharp",
    color: "#0EA5E9",
    items: [
      { title: "Nhóm thủ thuật", icon: "flask-outline" },
      { title: "Thuốc - mẫu đơn thuốc", icon: "document-attach-outline" },
      { title: "Kho thuốc", icon: "archive-outline" },
      { title: "Nhóm thuốc", icon: "layers-outline" },
      { title: "Các khoản thu", icon: "trending-up-outline" },
      { title: "Các khoản chi", icon: "trending-down-outline" },
      { title: "Phòng chức năng", icon: "business-outline" },
    ],
  },
  {
    title: "Kho thuốc",
    icon: "medkit-sharp",
    color: "#F43F5E",
    items: [
      { title: "Nhập thuốc", icon: "download-outline" },
      { title: "Xuất thuốc", icon: "share-outline" },
      { title: "Báo cáo nhập kho", icon: "stats-chart-outline" },
      { title: "Báo cáo xuất kho", icon: "bar-chart-outline" },
      { title: "Báo cáo nhập xuất tồn", icon: "analytics-outline" },
    ],
  },
  {
    title: "Báo cáo",
    icon: "pie-chart-sharp",
    color: "#F59E0B",
    items: [
      { title: "Danh sách bệnh nhân khám bệnh", icon: "list-outline" },
      { title: "Báo cáo thủ thuật theo bác sĩ", icon: "medkit-outline" },
      { title: "Danh sách bệnh nhân nợ tiền", icon: "warning-outline" },
      { title: "Báo cáo tổng hợp thu chi", icon: "pie-chart-outline" },
    ],
  },
  {
    title: "Hệ thống",
    icon: "settings-sharp",
    color: "#6366F1",
    items: [
      { title: "Quản lý nhân viên", icon: "people-outline" },
      { title: "Phân quyền chức năng", icon: "shield-half-outline" },
      { title: "Gửi email tự động", icon: "mail-open-outline" },
      { title: "Đăng ký bản quyền", icon: "ribbon-outline" },
    ],
  },
  {
    title: "Thông tin sản phẩm",
    icon: "information-circle-sharp",
    color: "#8B5CF6",
    items: [
      { title: "Thông tin sản phẩm", icon: "information-circle-outline" },
    ],
  },
];

const QUICK_ACTIONS = [
  {
    title: "Đăng ký khám",
    icon: "add-circle",
    color: "#10B981",
    route: "/Hosobenhan/Benhnhan", // Đã cập nhật đường dẫn mới
  },
  {
    title: "DS bệnh nhân",
    icon: "people",
    color: "#6366F1",
    route: "/Hosobenhan/Danhsachbenhnhan",
  },
  {
    title: "Lịch hẹn",
    icon: "calendar",
    color: "#F59E0B",
    route: "/Lichhen/Lichhenbn", // Đã cập nhật đường dẫn mới
  },
  { title: "Phiếu thu", icon: "wallet", color: "#F43F5E", route: "/ThuChi/Ds_phieuthu" },
];

const AnimatedNumber = ({ value, color, fontSize = 20 }: any) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = parseInt(value.toString().replace(/[^0-9]/g, ""));
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <Text style={{ color, fontSize, fontFamily: "DMSans_700Bold" }}>
      {displayValue.toLocaleString("vi-VN")}
    </Text>
  );
};

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState<number | null>(0);
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return DATA;
    return DATA.map((group) => {
      const matchedItems = group.items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return matchedItems.length > 0 ? { ...group, items: matchedItems } : null;
    }).filter((group) => group !== null);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() !== "" && filteredData.length > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setActive(0);
    }
  }, [searchQuery]);

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.safe, { backgroundColor: B.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {/* HEADER */}
        <LinearGradient
          colors={[B.primary, B.primaryLight]}
          style={styles.headerGradient}>
          <SafeAreaView edges={["top"]}>
            <View style={styles.headerTop}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>AD</Text>
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.helloText}>Xin chào,</Text>
                  <Text style={styles.nameText}>QUẢN TRỊ VIÊN</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="notifications" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* DOANH THU CÙNG DÒNG */}
            <View style={styles.balanceAreaRow}>
              <View style={styles.balanceTextGroup}>
                <Text style={styles.balanceLabelInline}>
                  Doanh thu hôm nay:
                </Text>
                {showBalance ? (
                  <AnimatedNumber value="15000000" color="#FFF" fontSize={22} />
                ) : (
                  <Text style={styles.hiddenBalanceText}>••••••••</Text>
                )}
                <Text style={styles.currencyText}>VND</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setShowBalance(!showBalance);
                }}>
                <Ionicons
                  name={showBalance ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="rgba(255,255,255,0.8)"
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* DASHBOARD STATS */}
        <View style={styles.dashboard}>
          <DashCard icon="people" label="Chờ khám" value="12" color="#0EA5E9" />
          <DashCard
            icon="calendar"
            label="Lịch hẹn"
            value="8"
            color="#10B981"
          />
          <DashCard
            icon="receipt"
            label="Phiếu thu"
            value="5"
            color="#F59E0B"
          />
          <DashCard
            icon="alert-circle"
            label="Nợ tiền"
            value="3"
            color="#F43F5E"
          />
        </View>

        {/* TÁC VỤ NHANH */}
        <View style={styles.quickActionContainer}>
          {QUICK_ACTIONS.map((action, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickActionItem}
              onPress={() => router.push(action.route as any)}>
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + "15" },
                ]}>
                <Ionicons
                  name={action.icon as any}
                  size={24}
                  color={action.color}
                />
              </View>
              <Text style={styles.quickActionLabel}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MENU VỚI Ô TÌM KIẾM */}
        <View style={styles.menuSection}>
          <View style={styles.searchContainerRow}>
            <Text style={styles.sectionTitle}>Chức năng</Text>
            <View style={styles.searchBox}>
              <Ionicons
                name="search"
                size={16}
                color={B.textSub}
                style={{ marginRight: 6 }}
              />
              <TextInput
                placeholder="Tìm nhanh..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94A3B8"
              />
              {searchQuery !== "" && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={16} color="#CBD5E1" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {filteredData.length > 0 ? (
            filteredData.map((item: any, i) => {
              const isActive = active === i;
              return (
                <View
                  key={i}
                  style={[styles.menuCard, isActive && styles.activeMenuCard]}>
                  {isActive && (
                    <View
                      style={[
                        styles.activeAccent,
                        { backgroundColor: item.color },
                      ]}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.menuHeader}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
                      setActive(isActive ? null : i);
                    }}>
                    <View style={styles.menuHeaderLeft}>
                      <View
                        style={[
                          styles.menuIconBox,
                          { backgroundColor: item.color + "12" },
                        ]}>
                        <Ionicons
                          name={item.icon as any}
                          size={22}
                          color={item.color}
                        />
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.menuTitle,
                            isActive && { color: B.primary },
                          ]}>
                          {item.title}
                        </Text>
                        <Text style={styles.menuSubCount}>
                          {item.items.length}{" "}
                          {searchQuery ? "kết quả" : "chức năng"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.chevronCircle,
                        isActive && { backgroundColor: "#F1F5F9" },
                      ]}>
                      <Ionicons
                        name={isActive ? "chevron-up" : "chevron-forward"}
                        size={16}
                        color={isActive ? B.primary : "#94A3B8"}
                      />
                    </View>
                  </TouchableOpacity>

                  {isActive && (
                    <View style={styles.subGrid}>
                      {item.items.map((sub: any, idx: number) => {
                        const isMatched =
                          searchQuery !== "" &&
                          sub.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase());
                        return (
                          <TouchableOpacity
                            key={idx}
                            style={[
                              styles.subGridItem,
                              isMatched && styles.matchedItem,
                            ]}
                            onPress={() =>
                              router.push(ROUTES[sub.title] as any)
                            }>
                            <View
                              style={[
                                styles.subIconWrapper,
                                {
                                  backgroundColor: isMatched
                                    ? "#FECDD3"
                                    : item.color + "08",
                                },
                              ]}>
                              <Ionicons
                                name={sub.icon as any}
                                size={16}
                                color={isMatched ? "#E11D48" : item.color}
                              />
                            </View>
                            <Text
                              style={[
                                styles.subGridText,
                                isMatched && {
                                  color: "#9F1239",
                                  fontFamily: "DMSans_700Bold",
                                },
                              ]}
                              numberOfLines={2}>
                              {sub.title}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>Không tìm thấy chức năng</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const DashCard = ({ icon, label, value, color }: any) => (
  <TouchableOpacity style={styles.dashCard}>
    <View style={[styles.dashIconBox, { backgroundColor: color + "12" }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.dashInfo}>
      <AnimatedNumber value={value} color={B.textTitle} fontSize={18} />
      <Text style={styles.dashLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: { fontFamily: "DMSans_700Bold", color: "#FFF", fontSize: 16 },
  helloText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  nameText: { color: "#FFF", fontSize: 15, fontFamily: "DMSans_700Bold" },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceAreaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  balanceTextGroup: { flexDirection: "row", alignItems: "baseline", flex: 1 },
  balanceLabelInline: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    marginRight: 8,
  },
  currencyText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    marginLeft: 6,
  },
  hiddenBalanceText: {
    color: "#FFF",
    fontSize: 20,
    letterSpacing: 2,
    fontFamily: "DMSans_700Bold",
  },
  dashboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: -20,
    justifyContent: "space-between",
  },
  dashCard: {
    width: "48.5%",
    backgroundColor: B.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    ...B.cardShadow,
  },
  dashIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dashInfo: { marginLeft: 10, flex: 1 },
  dashLabel: {
    fontSize: 11,
    color: B.textSub,
    fontFamily: "DMSans_500Medium",
    marginTop: -2,
  },
  quickActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
  },
  quickActionItem: { alignItems: "center", width: "22%" },
  quickActionIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    ...B.cardShadow,
  },
  quickActionLabel: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: "#334155",
    textAlign: "center",
  },
  menuSection: { paddingHorizontal: 20, marginTop: 20 },
  searchContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
    color: B.textTitle,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF2F7",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: B.textTitle,
    padding: 0,
  },
  menuCard: {
    backgroundColor: B.white,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    ...B.cardShadow,
  },
  activeMenuCard: { borderColor: "#E2E8F0" },
  activeAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  menuHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTitle: { fontSize: 15, fontFamily: "DMSans_700Bold", color: B.textTitle },
  menuSubCount: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: "DMSans_400Regular",
    marginTop: 2,
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  subGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingBottom: 16,
    backgroundColor: "#FBFCFE",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  subGridItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  matchedItem: {
    backgroundColor: B.highlight,
    borderWidth: 0.5,
    borderColor: "#FECDD3",
  },
  subIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  subGridText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: B.textTitle,
    flex: 1,
    lineHeight: 16,
  },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: B.textTitle,
    marginTop: 12,
  },
});
