import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const B = {
  primary: "#8A1930",
  primaryLight: "#C01C42",
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

const getCurrentDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")}`;
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );

const fmtDate = (s: string) => {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

const toDateValue = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
};

export default function Baocaothuchi() {
  const router = useRouter();
  const [tuNgay, setTuNgay] = useState(getCurrentDate());
  const [denNgay, setDenNgay] = useState(getCurrentDate());

  const today = getCurrentDate();

  // --- MOCK DATA ---
  const thuKhamBenh = [
    {
      id: 1,
      tenBN: "Nguyễn Văn An",
      diaChi: "Yên Khang, Ý Yên",
      ngay: today,
      tienMat: 20000000,
      chuyenKhoan: 0,
    },
    {
      id: 2,
      tenBN: "Trần Thị Bình",
      diaChi: "TT Lâm, Ý Yên",
      ngay: today,
      tienMat: 0,
      chuyenKhoan: 15000000,
    },
  ];

  const thuBanThuoc = [
    {
      id: 1,
      tenBN: "Lê Văn Cường",
      diaChi: "Yên Bằng, Ý Yên",
      ngay: today,
      tienMat: 500000,
      chuyenKhoan: 0,
    },
  ];

  const thuKhac = [
    {
      id: 1,
      tenKhoan: "Thanh lý thiết bị cũ",
      nguoiThu: "Kế toán Hạnh",
      ngay: today,
      soTien: 1000000,
    },
  ];

  const chiNCC = [
    {
      id: 1,
      tenNCC: "Dược phẩm Trung Ương",
      diaChi: "Quận Hoàn Kiếm, Hà Nội",
      ngay: today,
      soTien: 5000000,
    },
  ];

  const chiTraThuoc = [
    {
      id: 1,
      tenBN: "Phạm Thị Dung",
      nguoiChi: "BS. Huy",
      ngay: today,
      soTien: 120000,
    },
  ];

  const chiKhac = [
    {
      id: 1,
      tenKhoan: "Tiền điện tháng 3",
      nguoiChi: "Kế toán Hạnh",
      ngay: today,
      soTien: 2500000,
    },
  ];

  const [dataFiltered, setDataFiltered] = useState({
    thuKhamBenh,
    thuBanThuoc,
    thuKhac,
    chiNCC,
    chiTraThuoc,
    chiKhac,
  });

  const TableHeader = ({
    cols,
    widths,
  }: {
    cols: string[];
    widths: number[];
  }) => (
    <View style={s.tableHeader}>
      {cols.map((c, i) => (
        <Text key={i} style={[s.headerCell, { width: widths[i] }]}>
          {c}
        </Text>
      ))}
    </View>
  );

  const handleSearch = () => {
    if (!tuNgay || !denNgay) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ từ ngày và đến ngày.");
      return;
    }

    const from = toDateValue(tuNgay);
    const to = toDateValue(denNgay);

    if (Number.isNaN(from) || Number.isNaN(to)) {
      Alert.alert("Thông báo", "Định dạng ngày không hợp lệ. Vui lòng nhập YYYY-MM-DD.");
      return;
    }

    if (from > to) {
      Alert.alert("Thông báo", "Từ ngày không được lớn hơn đến ngày.");
      return;
    }

    const isInRange = (date: string) => {
      const d = toDateValue(date);
      return d >= from && d <= to;
    };

    const filtered = {
      thuKhamBenh: thuKhamBenh.filter((i) => isInRange(i.ngay)),
      thuBanThuoc: thuBanThuoc.filter((i) => isInRange(i.ngay)),
      thuKhac: thuKhac.filter((i) => isInRange(i.ngay)),
      chiNCC: chiNCC.filter((i) => isInRange(i.ngay)),
      chiTraThuoc: chiTraThuoc.filter((i) => isInRange(i.ngay)),
      chiKhac: chiKhac.filter((i) => isInRange(i.ngay)),
    };

    setDataFiltered(filtered);
  };

  // Tính toán theo dữ liệu đã lọc
  const tongThuKham = dataFiltered.thuKhamBenh.reduce(
    (s, i) => s + i.tienMat + i.chuyenKhoan,
    0,
  );
  const tongThuKhamMat = dataFiltered.thuKhamBenh.reduce(
    (s, i) => s + i.tienMat,
    0,
  );
  const tongThuKhamCK = dataFiltered.thuKhamBenh.reduce(
    (s, i) => s + i.chuyenKhoan,
    0,
  );

  const tongThuThuoc = dataFiltered.thuBanThuoc.reduce(
    (s, i) => s + i.tienMat + i.chuyenKhoan,
    0,
  );
  const tongThuThuocMat = dataFiltered.thuBanThuoc.reduce(
    (s, i) => s + i.tienMat,
    0,
  );
  const tongThuThuocCK = dataFiltered.thuBanThuoc.reduce(
    (s, i) => s + i.chuyenKhoan,
    0,
  );

  const tongThuKhac = dataFiltered.thuKhac.reduce((s, i) => s + i.soTien, 0);

  const tongThu = tongThuKham + tongThuThuoc + tongThuKhac;

  const tongChiNCC = dataFiltered.chiNCC.reduce((s, i) => s + i.soTien, 0);
  const tongChiTraThuoc = dataFiltered.chiTraThuoc.reduce(
    (s, i) => s + i.soTien,
    0,
  );
  const tongChiKhac = dataFiltered.chiKhac.reduce((s, i) => s + i.soTien, 0);

  const tongChi = tongChiNCC + tongChiTraThuoc + tongChiKhac;
  const conLai = tongThu - tongChi;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={B.primary} />

      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Báo cáo Thu - Chi</Text>
            <Text style={s.headerSub}>Chi tiết dòng tiền hệ thống</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        {/* BỘ LỌC TỪ NGÀY ĐẾN NGÀY */}
        <View style={s.filterCard}>
          <View style={s.dateRow}>
            <View style={s.dateField}>
              <Text style={s.dateLabel}>Từ ngày</Text>
              <View style={s.dateInputWrap}>
                <Ionicons name="calendar-outline" size={14} color={B.primary} />
                <TextInput
                  style={s.dateInput}
                  value={tuNgay}
                  onChangeText={setTuNgay}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={B.textSub}
                />
              </View>
            </View>

            <View style={s.dateSep}>
              <Ionicons name="arrow-forward" size={16} color={B.textSub} />
            </View>

            <View style={s.dateField}>
              <Text style={s.dateLabel}>Đến ngày</Text>
              <View style={s.dateInputWrap}>
                <Ionicons name="calendar-outline" size={14} color={B.primary} />
                <TextInput
                  style={s.dateInput}
                  value={denNgay}
                  onChangeText={setDenNgay}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={B.textSub}
                />
              </View>
            </View>
          </View>

          <View style={s.searchBtnWrap}>
            <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
              <Ionicons name="search" size={16} color="#fff" />
              <Text style={s.searchBtnText}>Tìm kiếm báo cáo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TỔNG KẾT */}
        <View style={s.summaryGrid}>
          <View
            style={[
              s.summaryCard,
              { backgroundColor: "#ECFDF5", borderColor: "#10B98130" },
            ]}
          >
            <Text style={[s.summaryLabel, { color: B.success }]}>TỔNG THU</Text>
            <Text style={[s.summaryVal, { color: B.success }]}>
              {fmtMoney(tongThu)}
            </Text>
          </View>

          <View
            style={[
              s.summaryCard,
              { backgroundColor: "#FEF2F2", borderColor: "#EF444430" },
            ]}
          >
            <Text style={[s.summaryLabel, { color: B.danger }]}>TỔNG CHI</Text>
            <Text style={[s.summaryVal, { color: B.danger }]}>
              {fmtMoney(tongChi)}
            </Text>
          </View>

          <View
            style={[
              s.summaryCard,
              {
                backgroundColor: "#EFF6FF",
                borderColor: "#3B82F630",
                width: "100%",
              },
            ]}
          >
            <View style={s.conLaiRow}>
              <Text style={[s.summaryLabel, { color: B.info, marginBottom: 0 }]}>
                CÒN LẠI (THU - CHI)
              </Text>
              <Text style={[s.summaryVal, { color: B.info, fontSize: 18 }]}>
                {fmtMoney(conLai)}
              </Text>
            </View>
          </View>
        </View>

        {/* I. KHOẢN THU */}
        <View style={s.groupHeader}>
          <View style={[s.groupIcon, { backgroundColor: B.success }]}>
            <Ionicons name="trending-up" size={16} color="#fff" />
          </View>
          <Text style={[s.groupTitle, { color: B.success }]}>
            I. CÁC KHOẢN THU
          </Text>
        </View>

        {/* Thu tiền khám */}
        <View style={s.card}>
          <Text style={s.cardTitle}>1. Thu tiền khám bệnh</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <TableHeader
                cols={[
                  "STT",
                  "Tên bệnh nhân",
                  "Địa chỉ",
                  "Ngày thu",
                  "Tiền mặt",
                  "Chuyển khoản",
                ]}
                widths={[40, 150, 120, 100, 100, 100]}
              />
              {dataFiltered.thuKhamBenh.map((item, idx) => (
                <View key={item.id} style={s.tableRow}>
                  <Text style={[s.cell, { width: 40 }]}>{idx + 1}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 150, fontWeight: "700", textAlign: "left" },
                    ]}
                  >
                    {item.tenBN}
                  </Text>
                  <Text style={[s.cell, { width: 120, textAlign: "left" }]}>
                    {item.diaChi}
                  </Text>
                  <Text style={[s.cell, { width: 100 }]}>{fmtDate(item.ngay)}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 100, color: B.success, fontWeight: "600" },
                    ]}
                  >
                    {fmtMoney(item.tienMat)}
                  </Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 100, color: B.info, fontWeight: "600" },
                    ]}
                  >
                    {fmtMoney(item.chuyenKhoan)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={s.cardFooterBox}>
            <View style={s.moneyBox}>
              <Text style={s.moneyLabel}>Tiền mặt</Text>
              <Text style={[s.moneyValue, { color: B.success }]}>
                {fmtMoney(tongThuKhamMat)}
              </Text>
            </View>

            <View style={s.moneyBox}>
              <Text style={s.moneyLabel}>CK</Text>
              <Text style={[s.moneyValue, { color: B.info }]}>
                {fmtMoney(tongThuKhamCK)}
              </Text>
            </View>

            <View style={s.moneyBox}>
              <Text style={s.moneyLabel}>Tổng</Text>
              <Text style={[s.moneyValue, { color: B.primary }]}>
                {fmtMoney(tongThuKham)}
              </Text>
            </View>
          </View>
        </View>

        {/* Thu tiền thuốc */}
        <View style={s.card}>
          <Text style={s.cardTitle}>2. Thu tiền bán thuốc</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <TableHeader
                cols={[
                  "STT",
                  "Tên bệnh nhân",
                  "Địa chỉ",
                  "Ngày thu",
                  "Tiền mặt",
                  "Chuyển khoản",
                ]}
                widths={[40, 150, 120, 100, 100, 100]}
              />
              {dataFiltered.thuBanThuoc.map((item, idx) => (
                <View key={item.id} style={s.tableRow}>
                  <Text style={[s.cell, { width: 40 }]}>{idx + 1}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 150, fontWeight: "700", textAlign: "left" },
                    ]}
                  >
                    {item.tenBN}
                  </Text>
                  <Text style={[s.cell, { width: 120, textAlign: "left" }]}>
                    {item.diaChi}
                  </Text>
                  <Text style={[s.cell, { width: 100 }]}>{fmtDate(item.ngay)}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 100, color: B.success, fontWeight: "600" },
                    ]}
                  >
                    {fmtMoney(item.tienMat)}
                  </Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 100, color: B.info, fontWeight: "600" },
                    ]}
                  >
                    {fmtMoney(item.chuyenKhoan)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={s.cardFooterBox}>
            <View style={s.moneyBox}>
              <Text style={s.moneyLabel}>Tiền mặt</Text>
              <Text style={[s.moneyValue, { color: B.success }]}>
                {fmtMoney(tongThuThuocMat)}
              </Text>
            </View>

            <View style={s.moneyBox}>
              <Text style={s.moneyLabel}>CK</Text>
              <Text style={[s.moneyValue, { color: B.info }]}>
                {fmtMoney(tongThuThuocCK)}
              </Text>
            </View>

            <View style={s.moneyBox}>
              <Text style={s.moneyLabel}>Tổng</Text>
              <Text style={[s.moneyValue, { color: B.primary }]}>
                {fmtMoney(tongThuThuoc)}
              </Text>
            </View>
          </View>
        </View>

        {/* Thu khác */}
        <View style={s.card}>
          <Text style={s.cardTitle}>3. Khoản thu khác</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <TableHeader
                cols={["STT", "Tên khoản thu", "Người thu", "Ngày thu", "Số tiền"]}
                widths={[40, 180, 120, 100, 120]}
              />
              {dataFiltered.thuKhac.map((item, idx) => (
                <View key={item.id} style={s.tableRow}>
                  <Text style={[s.cell, { width: 40 }]}>{idx + 1}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 180, textAlign: "left", fontWeight: "600" },
                    ]}
                  >
                    {item.tenKhoan}
                  </Text>
                  <Text style={[s.cell, { width: 120 }]}>{item.nguoiThu}</Text>
                  <Text style={[s.cell, { width: 100 }]}>{fmtDate(item.ngay)}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 120, fontWeight: "700", color: B.success },
                    ]}
                  >
                    {fmtMoney(item.soTien)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={s.cardFooter}>
            <Text style={s.footerTotal}>Tổng thu khác: {fmtMoney(tongThuKhac)}</Text>
          </View>
        </View>

        {/* II. KHOẢN CHI */}
        <View style={[s.groupHeader, { marginTop: 10 }]}>
          <View style={[s.groupIcon, { backgroundColor: B.danger }]}>
            <Ionicons name="trending-down" size={16} color="#fff" />
          </View>
          <Text style={[s.groupTitle, { color: B.danger }]}>II. CÁC KHOẢN CHI</Text>
        </View>

        {/* Chi NCC */}
        <View style={s.card}>
          <Text style={[s.cardTitle, { color: B.danger }]}>
            1. Chi cho nhà cung cấp
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <TableHeader
                cols={["STT", "Tên NCC", "Địa chỉ", "Ngày chi", "Số tiền"]}
                widths={[40, 180, 150, 100, 120]}
              />
              {dataFiltered.chiNCC.map((item, idx) => (
                <View key={item.id} style={s.tableRow}>
                  <Text style={[s.cell, { width: 40 }]}>{idx + 1}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 180, textAlign: "left", fontWeight: "600" },
                    ]}
                  >
                    {item.tenNCC}
                  </Text>
                  <Text style={[s.cell, { width: 150, textAlign: "left" }]}>
                    {item.diaChi}
                  </Text>
                  <Text style={[s.cell, { width: 100 }]}>{fmtDate(item.ngay)}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 120, fontWeight: "700", color: B.danger },
                    ]}
                  >
                    {fmtMoney(item.soTien)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={s.cardFooter}>
            <Text style={[s.footerTotal, { color: B.danger }]}>
              Tổng chi NCC: {fmtMoney(tongChiNCC)}
            </Text>
          </View>
        </View>

        {/* Chi trả thuốc */}
        <View style={s.card}>
          <Text style={[s.cardTitle, { color: B.danger }]}>
            2. Chi bệnh nhân trả lại thuốc
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <TableHeader
                cols={["STT", "Tên bệnh nhân", "Người chi", "Ngày chi", "Số tiền"]}
                widths={[40, 180, 120, 100, 120]}
              />
              {dataFiltered.chiTraThuoc.map((item, idx) => (
                <View key={item.id} style={s.tableRow}>
                  <Text style={[s.cell, { width: 40 }]}>{idx + 1}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 180, textAlign: "left", fontWeight: "600" },
                    ]}
                  >
                    {item.tenBN}
                  </Text>
                  <Text style={[s.cell, { width: 120 }]}>{item.nguoiChi}</Text>
                  <Text style={[s.cell, { width: 100 }]}>{fmtDate(item.ngay)}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 120, fontWeight: "700", color: B.danger },
                    ]}
                  >
                    {fmtMoney(item.soTien)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={s.cardFooter}>
            <Text style={[s.footerTotal, { color: B.danger }]}>
              Tổng chi trả lại: {fmtMoney(tongChiTraThuoc)}
            </Text>
          </View>
        </View>

        {/* Chi khác */}
        <View style={s.card}>
          <Text style={[s.cardTitle, { color: B.danger }]}>3. Khoản chi khác</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <TableHeader
                cols={["STT", "Tên khoản chi", "Người chi", "Ngày chi", "Số tiền"]}
                widths={[40, 180, 120, 100, 120]}
              />
              {dataFiltered.chiKhac.map((item, idx) => (
                <View key={item.id} style={s.tableRow}>
                  <Text style={[s.cell, { width: 40 }]}>{idx + 1}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 180, textAlign: "left", fontWeight: "600" },
                    ]}
                  >
                    {item.tenKhoan}
                  </Text>
                  <Text style={[s.cell, { width: 120 }]}>{item.nguoiChi}</Text>
                  <Text style={[s.cell, { width: 100 }]}>{fmtDate(item.ngay)}</Text>
                  <Text
                    style={[
                      s.cell,
                      { width: 120, fontWeight: "700", color: B.danger },
                    ]}
                  >
                    {fmtMoney(item.soTien)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={s.cardFooter}>
            <Text style={[s.footerTotal, { color: B.danger }]}>
              Tổng chi khác: {fmtMoney(tongChiKhac)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: B.background },
  header: {
    backgroundColor: B.primary,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 40 },

  // ================= STYLE CHO BỘ LỌC =================
  filterCard: {
    backgroundColor: B.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 16,
    gap: 10,
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
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateField: { flex: 1 },
  dateLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: B.textSub,
    marginBottom: 4,
  },
  dateInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.primary + "40",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateInput: {
    flex: 1,
    fontSize: 13,
    color: B.textTitle,
    fontWeight: "600",
    padding: 0,
  },
  dateSep: { paddingTop: 18 },
  searchBtnWrap: {
    marginTop: 6,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: B.primary,
    paddingVertical: 11,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: B.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  // ===================================================

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: "45%",
  },
  summaryLabel: { fontSize: 10, fontWeight: "800", marginBottom: 4 },
  summaryVal: { fontSize: 15, fontWeight: "900" },
  conLaiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  groupIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  groupTitle: { fontSize: 15, fontWeight: "900" },
  card: {
    backgroundColor: B.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: B.success,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: "800",
    color: B.textSub,
    textAlign: "center",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F1F5F9",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cell: { fontSize: 11, color: B.textTitle, textAlign: "center" },
  cardFooter: {
    padding: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  footerTotal: { fontSize: 12, fontWeight: "900", color: B.success },
  cardFooterBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: B.border,
    backgroundColor: "#F8FAFC",
  },
  moneyBox: {
    minWidth: "30%",
    flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 6,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: B.border,
    alignItems: "center",
  },
  moneyLabel: {
    fontSize: 10,
    color: B.textSub,
    marginBottom: 2,
  },
  moneyValue: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
});