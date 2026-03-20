import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  StatusBar,
  Modal,
  FlatList,
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
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const getFirstDayOfMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const fmtDate = (s: string) => {
  if (!s) return "—";
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

interface TonKhoItem {
  id: number;
  tenThuoc: string;
  donVi: string;
  kho: string;
  // Tồn đầu
  slTonDau: number;
  giaTonDau: number; // giá đơn vị tồn đầu
  // Nhập trong kì
  slNhap: number;
  giaNhap: number;
  // Xuất trong kì
  slXuat: number;
  giaXuat: number;
}

const KHO_LIST = ["Tất cả", "Kho chính", "Kho phụ", "Tủ thuốc A", "Tủ thuốc B"];

const SAMPLE_DATA: TonKhoItem[] = [
  { id: 1, tenThuoc: "Amoxicillin 500mg", donVi: "viên", kho: "Kho chính", slTonDau: 300, giaTonDau: 3000, slNhap: 500, giaNhap: 3000, slXuat: 200, giaXuat: 5000 },
  { id: 2, tenThuoc: "Paracetamol 500mg", donVi: "viên", kho: "Kho chính", slTonDau: 500, giaTonDau: 800, slNhap: 1000, giaNhap: 800, slXuat: 600, giaXuat: 2000 },
  { id: 3, tenThuoc: "Nước muối NaCl 0.9%", donVi: "chai", kho: "Kho phụ", slTonDau: 20, giaTonDau: 8000, slNhap: 50, giaNhap: 8000, slXuat: 30, giaXuat: 15000 },
  { id: 4, tenThuoc: "Chlorhexidine 0.12%", donVi: "chai", kho: "Kho phụ", slTonDau: 15, giaTonDau: 20000, slNhap: 30, giaNhap: 20000, slXuat: 25, giaXuat: 35000 },
  { id: 5, tenThuoc: "Vitamin C 1000mg", donVi: "hộp", kho: "Tủ thuốc A", slTonDau: 40, giaTonDau: 45000, slNhap: 100, giaNhap: 45000, slXuat: 80, giaXuat: 75000 },
  { id: 6, tenThuoc: "Omeprazole 20mg", donVi: "hộp", kho: "Tủ thuốc A", slTonDau: 30, giaTonDau: 95000, slNhap: 80, giaNhap: 95000, slXuat: 60, giaXuat: 120000 },
  { id: 7, tenThuoc: "Cetirizine 10mg", donVi: "hộp", kho: "Kho chính", slTonDau: 60, giaTonDau: 62000, slNhap: 120, giaNhap: 62000, slXuat: 100, giaXuat: 85000 },
  { id: 8, tenThuoc: "Metformin 850mg", donVi: "hộp", kho: "Tủ thuốc B", slTonDau: 20, giaTonDau: 110000, slNhap: 60, giaNhap: 110000, slXuat: 45, giaXuat: 145000 },
  { id: 9, tenThuoc: "Atorvastatin 20mg", donVi: "hộp", kho: "Tủ thuốc B", slTonDau: 10, giaTonDau: 280000, slNhap: 50, giaNhap: 280000, slXuat: 30, giaXuat: 350000 },
  { id: 10, tenThuoc: "Ibuprofen 400mg", donVi: "viên", kho: "Kho chính", slTonDau: 200, giaTonDau: 1500, slNhap: 300, giaNhap: 1500, slXuat: 250, giaXuat: 3500 },
];

function calcItem(t: TonKhoItem) {
  const tienTonDau = t.slTonDau * t.giaTonDau;
  const tienNhap = t.slNhap * t.giaNhap;
  const tienXuat = t.slXuat * t.giaXuat;
  const slCuoi = t.slTonDau + t.slNhap - t.slXuat;
  const giaTriTon = slCuoi * t.giaTonDau; // tồn theo giá nhập
  const lai = tienXuat - (t.slXuat * t.giaTonDau); // doanh thu - giá vốn
  return { tienTonDau, tienNhap, tienXuat, slCuoi, giaTriTon, lai };
}

export default function Nhapxuatton() {
  const router = useRouter();
  const [tuNgay, setTuNgay] = useState(getFirstDayOfMonth());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [searchText, setSearchText] = useState("");
  const [selectedKho, setSelectedKho] = useState("Tất cả");
  const [khoDropdown, setKhoDropdown] = useState(false);
  const [results, setResults] = useState<TonKhoItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);

  const doSearch = (tu: string, den: string, keyword: string, kho: string) => {
    const filtered = SAMPLE_DATA.filter((t) => {
      const matchKho = kho === "Tất cả" || t.kho === kho;
      const matchSearch =
        keyword === "" ||
        t.tenThuoc.toLowerCase().includes(keyword.toLowerCase()) ||
        t.donVi.toLowerCase().includes(keyword.toLowerCase());
      return matchKho && matchSearch;
    });
    setResults(filtered);
    setSearched(true);
  };

  useEffect(() => {
    doSearch(getFirstDayOfMonth(), getCurrentDate(), "", "Tất cả");
  }, []);

  const handleSearch = () => {
    doSearch(tuNgay, denNgay, searchText, selectedKho);
    setKhoDropdown(false);
  };

  // Tổng hợp
  const totals = results.reduce(
    (acc, t) => {
      const c = calcItem(t);
      return {
        tienTonDau: acc.tienTonDau + c.tienTonDau,
        tienNhap: acc.tienNhap + c.tienNhap,
        tienXuat: acc.tienXuat + c.tienXuat,
        giaTriTon: acc.giaTriTon + c.giaTriTon,
        lai: acc.lai + c.lai,
      };
    },
    { tienTonDau: 0, tienNhap: 0, tienXuat: 0, giaTriTon: 0, lai: 0 }
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={B.primary} />

      {/* ── HEADER ── */}
      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Nhập Xuất Tồn</Text>
            <Text style={s.headerSub}>Báo cáo tồn kho thuốc</Text>
          </View>
          {searched && results.length > 0 && (
            <TouchableOpacity style={s.addBtn} onPress={() => setPrintModalVisible(true)}>
              <Ionicons name="print-outline" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled">

        {/* ── BỘ LỌC ── */}
        <View style={s.filterCard}>

          {/* Tìm kiếm */}
          <View style={s.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={s.searchInput}
              placeholder="Tìm tên thuốc..."
              placeholderTextColor={B.textSub}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText !== "" && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={16} color={B.textSub} />
              </TouchableOpacity>
            )}
          </View>

          {/* Combobox chọn kho */}
          <View>
            <Text style={s.fieldLabel}>Kho thuốc</Text>
            <TouchableOpacity
              style={s.comboBox}
              onPress={() => setKhoDropdown(!khoDropdown)}
              activeOpacity={0.8}>
              <Ionicons name="business-outline" size={14} color={B.primary} />
              <Text style={s.comboBoxTxt}>{selectedKho}</Text>
              <Ionicons
                name={khoDropdown ? "chevron-up" : "chevron-down"}
                size={14}
                color={B.textSub}
              />
            </TouchableOpacity>
            {khoDropdown && (
              <View style={s.dropdownList}>
                {KHO_LIST.map((kho) => (
                  <TouchableOpacity
                    key={kho}
                    style={[s.dropdownItem, selectedKho === kho && s.dropdownItemActive]}
                    onPress={() => { setSelectedKho(kho); setKhoDropdown(false); }}>
                    <Text style={[s.dropdownItemTxt, selectedKho === kho && { color: B.primary, fontWeight: "700" }]}>
                      {kho}
                    </Text>
                    {selectedKho === kho && <Ionicons name="checkmark" size={14} color={B.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Khoảng ngày */}
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

          <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
            <Ionicons name="search" size={16} color="#fff" />
            <Text style={s.searchBtnTxt}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>

        {/* ── EMPTY ── */}
        {searched && results.length === 0 && (
          <View style={s.emptyBox}>
            <Ionicons name="cube-outline" size={56} color={B.border} />
            <Text style={s.emptyTitle}>Không có dữ liệu</Text>
            <Text style={s.emptyText}>Không tìm thấy dữ liệu tồn kho phù hợp</Text>
          </View>
        )}

        {/* ── DANH SÁCH ── */}
        {searched && results.length > 0 && (
          <>
            {/* Stats nhanh */}
            <View style={s.statsRow}>
              <View style={[s.statCard, { backgroundColor: "#FEF2F2" }]}>
                <View style={[s.statIcon, { backgroundColor: B.primary + "20" }]}>
                  <Ionicons name="cube" size={16} color={B.primary} />
                </View>
                <View>
                  <Text style={[s.statNum, { color: B.primary }]}>{results.length}</Text>
                  <Text style={s.statLabel}>Mặt hàng</Text>
                </View>
              </View>
              <View style={[s.statCard, { backgroundColor: "#ECFDF5" }]}>
                <View style={[s.statIcon, { backgroundColor: B.success + "20" }]}>
                  <Ionicons name="trending-up" size={16} color={B.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.statNum, { color: B.success, fontSize: 12 }]} numberOfLines={1}>
                    {fmtMoney(totals.lai)}
                  </Text>
                  <Text style={s.statLabel}>Tổng lãi</Text>
                </View>
              </View>
            </View>

            {/* Danh sách thuốc */}
            {results.map((item) => {
              const c = calcItem(item);
              return (
                <View key={item.id} style={s.itemCard}>
                  {/* ── Header card: tên thuốc + badges ── */}
                  <View style={s.itemHeader}>
                    <View style={s.itemHeaderLeft}>
                      <View style={s.itemIconBox}>
                        <Ionicons name="medkit" size={16} color={B.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.itemName}>{item.tenThuoc}</Text>
                        <View style={s.itemBadgeRow}>
                          <View style={s.dvChip}>
                            <Text style={s.dvChipTxt}>{item.donVi}</Text>
                          </View>
                          <View style={s.khoChip}>
                            <Ionicons name="business-outline" size={9} color={B.textSub} />
                            <Text style={s.khoChipTxt}>{item.kho}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* Lãi badge */}
                    <View style={[s.laiBadge, { backgroundColor: c.lai >= 0 ? "#ECFDF5" : "#FEF2F2", borderColor: c.lai >= 0 ? B.success + "40" : B.danger + "40" }]}>
                      <Ionicons name={c.lai >= 0 ? "trending-up" : "trending-down"} size={11} color={c.lai >= 0 ? B.success : B.danger} />
                      <View>
                        <Text style={[s.laiLabel2, { color: c.lai >= 0 ? B.success : B.danger }]}>Lãi</Text>
                        <Text style={[s.laiVal2, { color: c.lai >= 0 ? B.success : B.danger }]}>{fmtMoney(c.lai)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* ── Đường phân cách ── */}
                  <View style={s.itemDivider} />

                  {/* ── Flow: Tồn đầu → Nhập → Xuất → Tồn cuối ── */}
                  <View style={s.flowRow}>
                    {/* Tồn đầu */}
                    <View style={s.flowBlock}>
                      <View style={[s.flowDot, { backgroundColor: "#94A3B8" }]} />
                      <Text style={s.flowLabel}>Tồn đầu</Text>
                      <Text style={s.flowSL}>{item.slTonDau.toLocaleString()}</Text>
                      <Text style={s.flowMoney}>{fmtMoney(c.tienTonDau)}</Text>
                    </View>

                    {/* Mũi tên + Nhập */}
                    <View style={s.flowArrow}>
                      <Ionicons name="add-circle" size={14} color={B.info} />
                    </View>
                    <View style={s.flowBlock}>
                      <View style={[s.flowDot, { backgroundColor: B.info }]} />
                      <Text style={[s.flowLabel, { color: B.info }]}>Nhập kỳ</Text>
                      <Text style={[s.flowSL, { color: B.info }]}>{item.slNhap.toLocaleString()}</Text>
                      <Text style={[s.flowMoney, { color: B.info }]}>{fmtMoney(c.tienNhap)}</Text>
                    </View>

                    {/* Mũi tên + Xuất */}
                    <View style={s.flowArrow}>
                      <Ionicons name="remove-circle" size={14} color={B.warning} />
                    </View>
                    <View style={s.flowBlock}>
                      <View style={[s.flowDot, { backgroundColor: B.warning }]} />
                      <Text style={[s.flowLabel, { color: B.warning }]}>Xuất kỳ</Text>
                      <Text style={[s.flowSL, { color: B.warning }]}>{item.slXuat.toLocaleString()}</Text>
                      <Text style={[s.flowMoney, { color: B.warning }]}>{fmtMoney(c.tienXuat)}</Text>
                    </View>

                    {/* Kết quả tồn cuối */}
                    <View style={s.flowArrow}>
                      <Ionicons name="chevron-forward" size={14} color={B.success} />
                    </View>
                    <View style={[s.flowBlock, s.flowBlockLast]}>
                      <View style={[s.flowDot, { backgroundColor: B.success }]} />
                      <Text style={[s.flowLabel, { color: B.success }]}>Tồn cuối</Text>
                      <Text style={[s.flowSL, { color: B.success, fontWeight: "800" }]}>{c.slCuoi.toLocaleString()}</Text>
                      <Text style={[s.flowMoney, { color: B.success, fontWeight: "700" }]}>{fmtMoney(c.giaTriTon)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* ── TỔNG KẾT CUỐI ── */}
            <View style={s.summaryCard}>
              <View style={s.summaryHeader}>
                <Ionicons name="calculator" size={15} color={B.primary} />
                <Text style={s.summaryHeaderTxt}>Tổng kết báo cáo</Text>
                <Text style={s.summaryPeriod}>{fmtDate(tuNgay)} – {fmtDate(denNgay)}</Text>
              </View>
              {[
                { label: "Tiền tồn đầu kỳ", val: totals.tienTonDau, color: B.textTitle },
                { label: "Tiền nhập trong kỳ", val: totals.tienNhap, color: B.info },
                { label: "Tiền xuất trong kỳ", val: totals.tienXuat, color: B.warning },
                { label: "Giá trị tồn kho", val: totals.giaTriTon, color: B.success },
              ].map((row) => (
                <View key={row.label} style={s.summaryRow}>
                  <Text style={s.summaryLabel}>{row.label}</Text>
                  <Text style={[s.summaryVal, { color: row.color }]}>{fmtMoney(row.val)}</Text>
                </View>
              ))}
              <View style={[s.summaryRow, { backgroundColor: totals.lai >= 0 ? "#ECFDF5" : "#FEF2F2", borderRadius: 8, marginTop: 4, borderBottomWidth: 0 }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="trending-up" size={14} color={totals.lai >= 0 ? B.success : B.danger} />
                  <Text style={[s.summaryLabel, { fontWeight: "800", color: totals.lai >= 0 ? B.success : B.danger }]}>Tổng lãi</Text>
                </View>
                <Text style={[s.summaryVal, { fontSize: 16, color: totals.lai >= 0 ? B.success : B.danger }]}>
                  {fmtMoney(totals.lai)}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Nút in */}
      {searched && results.length > 0 && (
        <View style={s.fabWrap}>
          <TouchableOpacity style={s.fabBtn} onPress={() => setPrintModalVisible(true)}>
            <Ionicons name="print-outline" size={18} color="#fff" />
            <Text style={s.fabBtnTxt}>In báo cáo xuất nhập tồn</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── MODAL IN ── */}
      <Modal
        visible={printModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPrintModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { minHeight: "92%" }]}>
            <View style={s.modalHandle} />

            <View style={s.modalHeader}>
              <View style={s.modalHeaderLeft}>
                <View style={[s.modalHeaderIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="print" size={17} color={B.success} />
                </View>
                <Text style={s.modalTitle}>Báo cáo Nhập Xuất Tồn</Text>
              </View>
              <TouchableOpacity onPress={() => setPrintModalVisible(false)} style={s.closeBtn}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={s.modalBody}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[s.modalBodyContent, { paddingBottom: 30 }]}>

              {/* Header phòng khám */}
              <View style={s.printClinic}>
                <View style={s.printClinicTop}>
                  <View style={s.printLogoBox}>
                    <Ionicons name="medical" size={24} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.printClinicName}>HHIS MANAGE 2026</Text>
                    <Text style={s.printClinicTagline}>Phần mềm quản lý phòng khám</Text>
                  </View>
                </View>
                <View style={s.printClinicDivider} />
                <View style={s.printClinicBottom}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Ionicons name="location-outline" size={11} color={B.primary} />
                    <Text style={s.printClinicSub}>An Châu Yên Khang · Ý Yên · Nam Định</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Ionicons name="call-outline" size={11} color={B.primary} />
                    <Text style={s.printClinicSub}>0338.300901</Text>
                  </View>
                </View>
              </View>

              {/* Tiêu đề */}
              <View style={s.printTitleBox}>
                <Text style={s.printTitle}>BÁO CÁO NHẬP XUẤT TỒN</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <Ionicons name="calendar-outline" size={12} color={B.textSub} />
                  <Text style={s.printPeriodTxt}>Từ {fmtDate(tuNgay)} đến {fmtDate(denNgay)}</Text>
                </View>
                {selectedKho !== "Tất cả" && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                    <Ionicons name="business-outline" size={11} color={B.textSub} />
                    <Text style={[s.printPeriodTxt, { color: B.primary }]}>Kho: {selectedKho}</Text>
                  </View>
                )}
              </View>

              {/* Tổng quan */}
              <View style={s.printInfoBox}>
                {[
                  { icon: "cube-outline", label: "Số mặt hàng", val: `${results.length} loại` },
                  { icon: "archive-outline", label: "Tiền tồn đầu kỳ", val: fmtMoney(totals.tienTonDau) },
                  { icon: "arrow-down-circle-outline", label: "Tiền nhập trong kỳ", val: fmtMoney(totals.tienNhap), color: B.info },
                  { icon: "arrow-up-circle-outline", label: "Tiền xuất trong kỳ", val: fmtMoney(totals.tienXuat), color: B.warning },
                  { icon: "wallet-outline", label: "Giá trị tồn kho", val: fmtMoney(totals.giaTriTon), color: B.success },
                  { icon: "trending-up-outline", label: "Tổng lãi", val: fmtMoney(totals.lai), color: totals.lai >= 0 ? B.success : B.danger },
                ].map((row) => (
                  <View key={row.label} style={[s.printInfoRow, row.label === "Tổng lãi" ? { backgroundColor: totals.lai >= 0 ? "#ECFDF5" : "#FEF2F2", borderBottomWidth: 0 } : {}]}>
                    <View style={s.printInfoLeft}>
                      <Ionicons name={row.icon as any} size={12} color={row.color ?? B.primary} />
                      <Text style={[s.printInfoLabel, row.color ? { color: row.color, fontWeight: "700" } : {}]}>{row.label}</Text>
                    </View>
                    <Text style={[s.printInfoVal, row.color ? { color: row.color, fontWeight: "800" } : {}]}>{row.val}</Text>
                  </View>
                ))}
              </View>

              {/* Bảng chi tiết */}
              <Text style={s.printSecLabel}>Chi tiết nhập xuất tồn</Text>

              {results.map((item, i) => {
                const c = calcItem(item);
                return (
                  <View key={item.id} style={s.pCard}>
                    {/* ── Header card: STT + tên + kho ── */}
                    <View style={s.pCardHeader}>
                      <View style={s.pCardStt}>
                        <Text style={s.pCardSttTxt}>{String(i + 1).padStart(2, "0")}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.pCardName}>{item.tenThuoc}</Text>
                        <View style={s.pCardMeta}>
                          <View style={s.pDvChip}>
                            <Text style={s.pDvChipTxt}>{item.donVi}</Text>
                          </View>
                          <View style={s.pKhoChip}>
                            <Ionicons name="business-outline" size={9} color={B.textSub} />
                            <Text style={s.pKhoChipTxt}>{item.kho}</Text>
                          </View>
                        </View>
                      </View>
                      {/* Lãi */}
                      <View style={[s.pLaiBadge, { backgroundColor: c.lai >= 0 ? "#ECFDF5" : "#FEF2F2" }]}>
                        <Ionicons name={c.lai >= 0 ? "trending-up" : "trending-down"} size={11} color={c.lai >= 0 ? B.success : B.danger} />
                        <View style={{ alignItems: "flex-end" }}>
                          <Text style={[s.pLaiLabel, { color: c.lai >= 0 ? B.success : B.danger }]}>Lãi</Text>
                          <Text style={[s.pLaiVal, { color: c.lai >= 0 ? B.success : B.danger }]}>{fmtMoney(c.lai)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* ── 4 ô số liệu dạng 2×2 ── */}
                    <View style={s.pGrid}>
                      <View style={[s.pGridCell, { borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#E2E8F0" }]}>
                        <Text style={s.pGridLabel}>Tồn đầu kỳ</Text>
                        <Text style={s.pGridSL}>{item.slTonDau.toLocaleString()} <Text style={s.pGridUnit}>{item.donVi}</Text></Text>
                        <Text style={s.pGridMoney}>{fmtMoney(c.tienTonDau)}</Text>
                      </View>
                      <View style={[s.pGridCell, { borderBottomWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#EFF6FF" }]}>
                        <Text style={[s.pGridLabel, { color: B.info }]}>Nhập trong kỳ</Text>
                        <Text style={[s.pGridSL, { color: B.info }]}>{item.slNhap.toLocaleString()} <Text style={s.pGridUnit}>{item.donVi}</Text></Text>
                        <Text style={[s.pGridMoney, { color: B.info }]}>{fmtMoney(c.tienNhap)}</Text>
                      </View>
                      <View style={[s.pGridCell, { borderRightWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#FFF7ED" }]}>
                        <Text style={[s.pGridLabel, { color: B.warning }]}>Xuất trong kỳ</Text>
                        <Text style={[s.pGridSL, { color: B.warning }]}>{item.slXuat.toLocaleString()} <Text style={s.pGridUnit}>{item.donVi}</Text></Text>
                        <Text style={[s.pGridMoney, { color: B.warning }]}>{fmtMoney(c.tienXuat)}</Text>
                      </View>
                      <View style={[s.pGridCell, { borderColor: "#E2E8F0", backgroundColor: "#ECFDF5" }]}>
                        <Text style={[s.pGridLabel, { color: B.success }]}>Tồn cuối kỳ</Text>
                        <Text style={[s.pGridSL, { color: B.success, fontWeight: "800" }]}>{c.slCuoi.toLocaleString()} <Text style={s.pGridUnit}>{item.donVi}</Text></Text>
                        <Text style={[s.pGridMoney, { color: B.success, fontWeight: "700" }]}>{fmtMoney(c.giaTriTon)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* ── Tổng kết cuối ── */}
              <View style={s.pSummaryCard}>
                <View style={s.pSummaryHeader}>
                  <Ionicons name="calculator" size={15} color="#fff" />
                  <Text style={s.pSummaryHeaderTxt}>TỔNG KẾT — {results.length} mặt hàng</Text>
                </View>
                <View style={s.pSummaryGrid}>
                  {[
                    { label: "Tồn đầu kỳ", val: totals.tienTonDau, color: B.textTitle, bg: "#F8FAFC" },
                    { label: "Nhập kỳ", val: totals.tienNhap, color: B.info, bg: "#EFF6FF" },
                    { label: "Xuất kỳ", val: totals.tienXuat, color: B.warning, bg: "#FFF7ED" },
                    { label: "Giá trị tồn", val: totals.giaTriTon, color: B.success, bg: "#ECFDF5" },
                  ].map((row) => (
                    <View key={row.label} style={[s.pSummaryItem, { backgroundColor: row.bg }]}>
                      <Text style={[s.pSummaryLabel, { color: row.color }]}>{row.label}</Text>
                      <Text style={[s.pSummaryVal, { color: row.color }]}>{fmtMoney(row.val)}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.pSummaryLai}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name={totals.lai >= 0 ? "trending-up" : "trending-down"} size={16} color="#fff" />
                    <Text style={s.pSummaryLaiLabel}>Tổng lãi</Text>
                  </View>
                  <Text style={s.pSummaryLaiVal}>{fmtMoney(totals.lai)}</Text>
                </View>
              </View>

              {/* Chữ ký */}
              <View style={s.printSigRow}>
                <View style={s.printSigBox}>
                  <Text style={s.printSigTitle}>Người lập báo cáo</Text>
                  <Text style={s.printSigSub}>(Ký, ghi rõ họ tên)</Text>
                  <View style={s.printSigLine} />
                </View>
                <View style={s.printSigBox}>
                  <Text style={s.printSigTitle}>Thủ kho</Text>
                  <Text style={s.printSigSub}>(Ký, ghi rõ họ tên)</Text>
                  <View style={s.printSigLine} />
                </View>
                <View style={s.printSigBox}>
                  <Text style={s.printSigTitle}>Giám đốc</Text>
                  <Text style={s.printSigSub}>(Ký, đóng dấu)</Text>
                  <View style={s.printSigLine} />
                </View>
              </View>
            </ScrollView>

            <View style={s.modalFooter}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setPrintModalVisible(false)}>
                <Text style={s.cancelBtnTxt}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveBtn, { backgroundColor: B.success }]}
                onPress={() => setPrintModalVisible(false)}>
                <Ionicons name="print-outline" size={18} color="#fff" />
                <Text style={s.saveBtnTxt}>In báo cáo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: B.background },

  header: { backgroundColor: B.primary, paddingHorizontal: 16, paddingBottom: 14 },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "500", marginTop: 1 },
  addBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 110 },

  filterCard: {
    backgroundColor: B.white, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: B.border, marginBottom: 12, gap: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  searchBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#F8FAFC", borderRadius: 10,
    borderWidth: 1, borderColor: B.border,
    paddingHorizontal: 12, paddingVertical: 9,
  },
  searchInput: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
  fieldLabel: { fontSize: 11, fontWeight: "600", color: B.textSub, marginBottom: 5 },
  comboBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FEF2F2", borderRadius: 8,
    borderWidth: 1.5, borderColor: B.primary + "40",
    paddingHorizontal: 12, paddingVertical: 10,
  },
  comboBoxTxt: { flex: 1, fontSize: 13, color: B.textTitle, fontWeight: "600" },
  dropdownList: {
    borderWidth: 1, borderColor: B.border, borderRadius: 10,
    marginTop: 4, overflow: "hidden",
    backgroundColor: B.white,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  dropdownItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  dropdownItemActive: { backgroundColor: "#FEF2F2" },
  dropdownItemTxt: { fontSize: 13, color: B.textTitle },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateField: { flex: 1 },
  dateLabel: { fontSize: 11, fontWeight: "600", color: B.textSub, marginBottom: 4 },
  dateInputWrap: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#FEF2F2", borderRadius: 8,
    borderWidth: 1, borderColor: B.primary + "40",
    paddingHorizontal: 10, paddingVertical: 8,
  },
  dateInput: { flex: 1, fontSize: 13, color: B.textTitle, fontWeight: "600", padding: 0 },
  dateSep: { paddingTop: 18 },
  searchBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: B.primary, borderRadius: 10, paddingVertical: 12,
    ...Platform.select({
      ios: { shadowColor: B.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  searchBtnTxt: { fontSize: 14, fontWeight: "800", color: "#fff", letterSpacing: 0.3 },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  emptyText: { fontSize: 12, color: B.textSub, textAlign: "center" },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, padding: 12, borderWidth: 1, borderColor: B.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  statNum: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 10, color: B.textSub, fontWeight: "500" },

  itemCard: {
    backgroundColor: B.white,
    borderRadius: 14, borderWidth: 1, borderColor: B.border,
    marginBottom: 12, overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  // ── Item header ──
  itemHeader: {
    flexDirection: "row", alignItems: "flex-start",
    padding: 12, gap: 10,
  },
  itemHeaderLeft: {
    flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 10,
  },
  itemIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#FEF2F2",
    justifyContent: "center", alignItems: "center",
    marginTop: 1,
  },
  itemName: { fontSize: 14, fontWeight: "800", color: B.textTitle, lineHeight: 20, flex: 1 },
  itemBadgeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 5 },
  laiBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 8, paddingVertical: 5,
    minWidth: 80,
  },
  laiLabel2: { fontSize: 9, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },
  laiVal2: { fontSize: 12, fontWeight: "900", marginTop: 1 },

  itemDivider: { height: 1, backgroundColor: "#F1F5F9", marginHorizontal: 12 },

  // ── Flow row: Tồn đầu → Nhập → Xuất → Tồn cuối ──
  flowRow: {
    flexDirection: "row", alignItems: "flex-start",
    paddingHorizontal: 10, paddingVertical: 12, gap: 0,
  },
  flowBlock: {
    flex: 1, alignItems: "center", gap: 3,
  },
  flowBlockLast: {
    backgroundColor: "#ECFDF5",
    borderRadius: 10, paddingVertical: 6, paddingHorizontal: 4,
  },
  flowDot: {
    width: 8, height: 8, borderRadius: 4, marginBottom: 2,
  },
  flowLabel: {
    fontSize: 9, fontWeight: "700", color: B.textSub,
    textTransform: "uppercase", letterSpacing: 0.4, textAlign: "center",
  },
  flowSL: {
    fontSize: 14, fontWeight: "800", color: B.textTitle, textAlign: "center",
  },
  flowMoney: {
    fontSize: 9, color: B.textSub, textAlign: "center", fontWeight: "500",
  },
  flowArrow: {
    alignItems: "center", justifyContent: "center",
    paddingTop: 18, width: 18,
  },
  dvChip: { backgroundColor: "#EFF6FF", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  dvChipTxt: { fontSize: 10, fontWeight: "700", color: B.info },
  khoChip: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#F1F5F9", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  khoChipTxt: { fontSize: 10, color: B.textSub, fontWeight: "500" },

  summaryCard: {
    backgroundColor: B.white, borderRadius: 14,
    borderWidth: 1, borderColor: B.border, overflow: "hidden", marginTop: 4,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  summaryHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FEF2F2", paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: B.border,
  },
  summaryHeaderTxt: { fontSize: 14, fontWeight: "800", color: B.primary, flex: 1 },
  summaryPeriod: { fontSize: 11, color: B.textSub },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  summaryLabel: { fontSize: 13, color: B.textSub, fontWeight: "500" },
  summaryVal: { fontSize: 14, fontWeight: "800", color: B.textTitle },

  fabWrap: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingBottom: Platform.OS === "ios" ? 24 : 16, paddingTop: 10,
    backgroundColor: B.background, borderTopWidth: 1, borderTopColor: B.border,
  },
  fabBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: B.primary, borderRadius: 12, paddingVertical: 14,
    ...Platform.select({
      ios: { shadowColor: B.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  fabBtnTxt: { fontSize: 15, fontWeight: "800", color: "#fff" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: B.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "95%",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 14 },
      android: { elevation: 12 },
    }),
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: B.border,
    alignSelf: "center", marginTop: 12, marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: B.border,
    backgroundColor: B.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalHeaderIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  modalTitle: { fontSize: 15, fontWeight: "800", color: B.textTitle },
  closeBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center" },
  modalBody: { flex: 1 },
  modalBodyContent: { padding: 14 },
  modalFooter: {
    flexDirection: "row", padding: 14, gap: 10,
    backgroundColor: B.white, borderTopWidth: 1, borderTopColor: B.border,
  },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: "#F1F5F9", alignItems: "center" },
  cancelBtnTxt: { fontSize: 14, fontWeight: "700", color: B.textSub },
  saveBtn: { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 13, borderRadius: 12 },
  saveBtnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Print
  printClinic: {
    backgroundColor: B.white, borderRadius: 14, borderWidth: 1, borderColor: B.border,
    marginBottom: 14, overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  printClinicTop: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  printLogoBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: B.primary, justifyContent: "center", alignItems: "center" },
  printClinicName: { fontSize: 15, fontWeight: "900", color: B.primary },
  printClinicTagline: { fontSize: 10, color: B.textSub, marginTop: 2 },
  printClinicDivider: { height: 1, backgroundColor: B.border, marginHorizontal: 14 },
  printClinicBottom: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 16, flexWrap: "wrap" },
  printClinicSub: { fontSize: 10, color: B.textSub },
  printTitleBox: { alignItems: "center", marginBottom: 14, gap: 2 },
  printTitle: { fontSize: 16, fontWeight: "900", color: B.textTitle, letterSpacing: 1, textTransform: "uppercase" },
  printPeriodTxt: { fontSize: 12, color: B.textSub, fontWeight: "600" },
  printSecLabel: { fontSize: 11, fontWeight: "800", color: B.primary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  printInfoBox: {
    backgroundColor: B.white, borderRadius: 12, borderWidth: 1, borderColor: B.border,
    overflow: "hidden", marginBottom: 14,
  },
  printInfoRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  printInfoLeft: { flexDirection: "row", alignItems: "center", gap: 6, width: 140 },
  printInfoLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  printInfoVal: { flex: 1, fontSize: 12, color: B.textTitle, fontWeight: "700", textAlign: "right" },
  printTableWrap: {
    backgroundColor: B.white, borderRadius: 12, borderWidth: 1, borderColor: B.border,
    overflow: "hidden", marginBottom: 10,
  },
  xlDayHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#1E3A5F", paddingHorizontal: 10, paddingVertical: 9,
  },
  xlDayHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 7 },
  xlDayHeaderTxt: { fontSize: 13, fontWeight: "800", color: "#fff", letterSpacing: 0.2 },
  xlDayHeaderRight: { backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  xlDayHeaderCount: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.9)" },
  xlColHeader: {
    flexDirection: "row", backgroundColor: "#EFF6FF",
    borderBottomWidth: 1, borderBottomColor: "#BFDBFE", paddingVertical: 6, paddingHorizontal: 8,
  },
  xlColTh: { fontSize: 9, fontWeight: "700", color: "#1E40AF", letterSpacing: 0.4, textTransform: "uppercase" },
  xlColTh2: { fontSize: 9, fontWeight: "700", letterSpacing: 0.3, paddingHorizontal: 3 },
  printItemRow2: {
    flexDirection: "row", alignItems: "center",
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
    paddingVertical: 7, paddingHorizontal: 8,
  },
  p2Td: { fontSize: 10, color: B.textTitle, paddingHorizontal: 2 },
  p2Cell: { paddingHorizontal: 3 },
  p2DrugName: { fontSize: 11, fontWeight: "700", color: B.textTitle },
  p2Sub: { fontSize: 9, marginTop: 1 },
  printTableFooter: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FEF2F2", paddingHorizontal: 10, paddingVertical: 10,
    borderTopWidth: 1.5, borderTopColor: B.primary + "50",
  },
  printNoteBox: {
    backgroundColor: "#F8FAFC", borderRadius: 8, borderWidth: 1, borderColor: B.border,
    padding: 10, marginBottom: 14,
  },
  printNoteTitle: { fontSize: 10, fontWeight: "700", color: B.textSub, marginBottom: 3 },
  printNoteTxt: { fontSize: 10, color: B.textSub, lineHeight: 15 },

  // ── Print card per item ──
  pCard: {
    backgroundColor: B.white,
    borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0",
    marginBottom: 12, overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  pCardHeader: {
    flexDirection: "row", alignItems: "flex-start",
    padding: 11, gap: 9,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  pCardStt: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: "#FEF2F2",
    justifyContent: "center", alignItems: "center",
    marginTop: 1,
  },
  pCardSttTxt: { fontSize: 11, fontWeight: "800", color: B.primary },
  pCardName: { fontSize: 13, fontWeight: "800", color: B.textTitle, lineHeight: 18 },
  pCardMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  pDvChip: { backgroundColor: "#EFF6FF", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pDvChipTxt: { fontSize: 9, fontWeight: "700", color: B.info },
  pKhoChip: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#F1F5F9", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pKhoChipTxt: { fontSize: 9, color: B.textSub, fontWeight: "500" },
  pLaiBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5,
    minWidth: 82,
  },
  pLaiLabel: { fontSize: 9, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.3 },
  pLaiVal: { fontSize: 11, fontWeight: "900" },
  pGrid: {
    flexDirection: "row", flexWrap: "wrap",
  },
  pGridCell: {
    width: "50%", padding: 10, gap: 3,
  },
  pGridLabel: {
    fontSize: 9, fontWeight: "700", color: B.textSub,
    textTransform: "uppercase", letterSpacing: 0.4,
  },
  pGridSL: { fontSize: 14, fontWeight: "800", color: B.textTitle },
  pGridUnit: { fontSize: 10, fontWeight: "500", color: B.textSub },
  pGridMoney: { fontSize: 10, color: B.textSub, fontWeight: "500" },

  // ── Print summary card ──
  pSummaryCard: {
    borderRadius: 14, overflow: "hidden", marginBottom: 20,
    borderWidth: 1, borderColor: B.success + "40",
    ...Platform.select({
      ios: { shadowColor: B.success, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  pSummaryHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 14, paddingVertical: 10,
  },
  pSummaryHeaderTxt: { fontSize: 12, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  pSummaryGrid: {
    flexDirection: "row", flexWrap: "wrap",
    backgroundColor: B.white,
  },
  pSummaryItem: {
    width: "50%", padding: 12,
    borderBottomWidth: 1, borderRightWidth: 1, borderColor: "#E2E8F0",
  },
  pSummaryLabel: { fontSize: 10, fontWeight: "600", color: B.textSub, textTransform: "uppercase", letterSpacing: 0.4 },
  pSummaryVal: { fontSize: 13, fontWeight: "800", marginTop: 3 },
  pSummaryLai: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: B.success,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  pSummaryLaiLabel: { fontSize: 13, fontWeight: "700", color: "#fff" },
  pSummaryLaiVal: { fontSize: 16, fontWeight: "900", color: "#fff" },
  printSigRow: { flexDirection: "row", gap: 10 },
  printSigBox: { flex: 1, alignItems: "center", gap: 4 },
  printSigTitle: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  printSigSub: { fontSize: 10, color: B.textSub, fontStyle: "italic" },
  printSigLine: { width: "100%", height: 1, backgroundColor: B.border, marginTop: 40 },
});