import React, { useState, useEffect } from "react";
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

interface ChiTietXuat {
  id: number;
  tenThuoc: string;
  donVi: string;
  soLuong: number;
  giaXuat: number;
}

interface PhieuXuat {
  id: number;
  maPhieu: string;
  ngayXuat: string;
  nguoiNhan: string;
  chiTiet: ChiTietXuat[];
}

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const fmtDate = (s: string) => {
  if (!s) return "—";
  const [date, time] = s.split(" ");
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}${time ? ` ${time}` : ""}`;
};

const SAMPLE_DATA: PhieuXuat[] = [
  {
    id: 1, maPhieu: "PX001", ngayXuat: getCurrentDate(),
    nguoiNhan: "Nguyễn Văn An",
    chiTiet: [
      { id: 1, tenThuoc: "Amoxicillin 500mg", donVi: "viên", soLuong: 20, giaXuat: 5000 },
      { id: 2, tenThuoc: "Paracetamol 500mg", donVi: "viên", soLuong: 30, giaXuat: 2000 },
    ],
  },
  {
    id: 2, maPhieu: "PX002", ngayXuat: getCurrentDate(),
    nguoiNhan: "Trần Thị Bình",
    chiTiet: [
      { id: 3, tenThuoc: "Nước muối NaCl 0.9%", donVi: "chai", soLuong: 5, giaXuat: 15000 },
      { id: 4, tenThuoc: "Chlorhexidine 0.12%", donVi: "chai", soLuong: 2, giaXuat: 35000 },
      { id: 5, tenThuoc: "Vitamin C 1000mg", donVi: "hộp", soLuong: 3, giaXuat: 75000 },
    ],
  },
  {
    id: 3, maPhieu: "PX003", ngayXuat: getFirstDayOfMonth(),
    nguoiNhan: "Lê Minh Cường",
    chiTiet: [
      { id: 6, tenThuoc: "Omeprazole 20mg", donVi: "hộp", soLuong: 2, giaXuat: 120000 },
      { id: 7, tenThuoc: "Cetirizine 10mg", donVi: "hộp", soLuong: 4, giaXuat: 85000 },
    ],
  },
  {
    id: 4, maPhieu: "PX004", ngayXuat: getFirstDayOfMonth(),
    nguoiNhan: "Phạm Thu Hà",
    chiTiet: [
      { id: 8, tenThuoc: "Metformin 850mg", donVi: "hộp", soLuong: 3, giaXuat: 145000 },
      { id: 9, tenThuoc: "Atorvastatin 20mg", donVi: "hộp", soLuong: 1, giaXuat: 350000 },
    ],
  },
];

export default function Baocaoxuatthuoc() {
  const router = useRouter();
  const [tuNgay, setTuNgay] = useState(getCurrentDate());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<PhieuXuat[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [printModalVisible, setPrintModalVisible] = useState(false);

  const doSearch = (tu: string, den: string, keyword: string) => {
    const filtered = SAMPLE_DATA.filter((p) => {
      const d = p.ngayXuat.split(" ")[0];
      return (
        d >= tu &&
        d <= den &&
        (keyword === "" ||
          p.nguoiNhan.toLowerCase().includes(keyword.toLowerCase()) ||
          p.maPhieu.toLowerCase().includes(keyword.toLowerCase()) ||
          p.chiTiet.some((t) =>
            t.tenThuoc.toLowerCase().includes(keyword.toLowerCase())
          ))
      );
    });
    setResults(filtered);
    setSearched(true);
    setExpandedIds(new Set(filtered.map((p) => p.id)));
  };

  useEffect(() => {
    doSearch(getCurrentDate(), getCurrentDate(), "");
  }, []);

  const handleSearch = () => {
    doSearch(tuNgay, denNgay, searchText);
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tongTien = results.reduce(
    (s, p) => s + p.chiTiet.reduce((ss, t) => ss + t.soLuong * t.giaXuat, 0),
    0,
  );
  const tongSoLuong = results.reduce(
    (s, p) => s + p.chiTiet.reduce((ss, t) => ss + t.soLuong, 0),
    0,
  );
  const allItems: (ChiTietXuat & { ngayXuat: string; nguoiNhan: string; maPhieu: string })[] =
    results.flatMap((p) =>
      p.chiTiet.map((t) => ({
        ...t,
        ngayXuat: p.ngayXuat,
        nguoiNhan: p.nguoiNhan,
        maPhieu: p.maPhieu,
      }))
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
            <Text style={s.headerTitle}>Báo cáo xuất thuốc</Text>
            <Text style={s.headerSub}>Thống kê chi tiết xuất kho</Text>
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
        contentContainerStyle={s.scrollContent}>

        {/* ── BỘ LỌC ── */}
        <View style={s.filterCard}>
          <View style={s.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={s.searchInput}
              placeholder="Tìm tên thuốc, người nhận, mã phiếu..."
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

        {/* ── STATS ── */}
        {searched && (
          <>
            <View style={s.statsRow}>
              <View style={[s.statCard, { backgroundColor: "#FEF2F2" }]}>
                <View style={[s.statIcon, { backgroundColor: B.primary + "20" }]}>
                  <Ionicons name="receipt" size={18} color={B.primary} />
                </View>
                <View>
                  <Text style={[s.statNum, { color: B.primary }]}>{results.length}</Text>
                  <Text style={s.statLabel}>Phiếu xuất</Text>
                </View>
              </View>
              <View style={[s.statCard, { backgroundColor: "#EFF6FF" }]}>
                <View style={[s.statIcon, { backgroundColor: B.info + "20" }]}>
                  <Ionicons name="layers" size={18} color={B.info} />
                </View>
                <View>
                  <Text style={[s.statNum, { color: B.info }]}>
                    {tongSoLuong.toLocaleString("vi-VN")}
                  </Text>
                  <Text style={s.statLabel}>Tổng số lượng</Text>
                </View>
              </View>
            </View>

            {/* Tổng tiền xuất nổi bật */}
            <View style={s.tongTienCard}>
              <View style={s.tongTienLeft}>
                <View style={s.tongTienIconBox}>
                  <Ionicons name="cash" size={22} color="#fff" />
                </View>
                <View>
                  <Text style={s.tongTienLabel}>Tổng tiền xuất kho</Text>
                  <Text style={s.tongTienPeriod}>
                    {fmtDate(tuNgay)} — {fmtDate(denNgay)}
                  </Text>
                </View>
              </View>
              <Text style={s.tongTienVal}>{fmtMoney(tongTien)}</Text>
            </View>
          </>
        )}

        {/* ── EMPTY ── */}
        {searched && results.length === 0 && (
          <View style={s.emptyBox}>
            <Ionicons name="document-outline" size={56} color={B.border} />
            <Text style={s.emptyTitle}>Không có dữ liệu</Text>
            <Text style={s.emptyText}>
              Không tìm thấy phiếu xuất trong khoảng thời gian này
            </Text>
          </View>
        )}

        {/* ── DANH SÁCH PHIẾU ── */}
        {searched &&
          results.map((phieu) => {
            const exp = expandedIds.has(phieu.id);
            const tongPhieu = phieu.chiTiet.reduce(
              (ss, t) => ss + t.soLuong * t.giaXuat,
              0,
            );
            return (
              <View key={phieu.id} style={s.phieuCard}>
                <View style={s.phieuAccent} />
                <View style={s.phieuBody}>

                  {/* Mã phiếu + ngày + chevron */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(phieu.id)}
                    activeOpacity={0.75}
                    style={s.phieuTopRow}>
                    <View style={s.maBox}>
                      <Ionicons name="receipt-outline" size={11} color={B.primary} />
                      <Text style={s.maText}>{phieu.maPhieu}</Text>
                    </View>
                    <View style={s.ngayBox}>
                      <Ionicons name="calendar-outline" size={11} color={B.textSub} />
                      <Text style={s.ngayText}>{fmtDate(phieu.ngayXuat)}</Text>
                    </View>
                    <Ionicons
                      name={exp ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={B.textSub}
                    />
                  </TouchableOpacity>

                  {/* Tên người nhận */}
                  <View style={s.nguoiNhanRow}>
                    <Ionicons name="person-circle-outline" size={15} color={B.primary} />
                    <Text style={s.nguoiNhanName} numberOfLines={1}>
                      {phieu.nguoiNhan}
                    </Text>
                  </View>

                  {/* Meta: số loại + tổng tiền */}
                  <View style={s.metaRow}>
                    <View style={s.soLoaiChip}>
                      <Ionicons name="medkit-outline" size={10} color={B.textSub} />
                      <Text style={s.soLoaiTxt}>{phieu.chiTiet.length} loại thuốc</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <Text style={s.tongInline}>{fmtMoney(tongPhieu)}</Text>
                  </View>

                  {/* Chi tiết bảng */}
                  {exp && (
                    <View style={s.chiTietWrap}>
                      {/* Header bảng */}
                      <View style={s.tblHeaderRow}>
                        <Text style={[s.tblHeaderTxt, { flex: 2.5 }]}>Tên thuốc</Text>
                        <Text style={[s.tblHeaderTxt, { flex: 0.8, textAlign: "center" }]}>ĐVT</Text>
                        <Text style={[s.tblHeaderTxt, { flex: 0.7, textAlign: "right" }]}>SL</Text>
                        <Text style={[s.tblHeaderTxt, { flex: 1.3, textAlign: "right" }]}>Giá xuất</Text>
                        <Text style={[s.tblHeaderTxt, { flex: 1.4, textAlign: "right" }]}>Thành tiền</Text>
                      </View>

                      {phieu.chiTiet.map((t, i) => (
                        <View
                          key={t.id}
                          style={[
                            s.tblRow,
                            i % 2 !== 0 && { backgroundColor: "#FAFAFA" },
                          ]}>
                          <View style={{ flex: 2.5 }}>
                            <Text style={s.tblName} numberOfLines={2}>{t.tenThuoc}</Text>
                          </View>
                          <View style={{ flex: 0.8, alignItems: "center", paddingTop: 2 }}>
                            <View style={s.dvMiniChip}>
                              <Text style={s.dvMiniTxt}>{t.donVi}</Text>
                            </View>
                          </View>
                          <Text style={[s.tblTd, { flex: 0.7, textAlign: "right", fontWeight: "700", color: B.textTitle }]}>
                            {t.soLuong.toLocaleString("vi-VN")}
                          </Text>
                          <Text style={[s.tblTd, { flex: 1.3, textAlign: "right" }]}>
                            {fmtMoney(t.giaXuat)}
                          </Text>
                          <Text style={[s.tblTd, { flex: 1.4, textAlign: "right", color: B.success, fontWeight: "800" }]}>
                            {fmtMoney(t.soLuong * t.giaXuat)}
                          </Text>
                        </View>
                      ))}

                      <View style={s.tongRow}>
                        <Text style={s.tongLabel}>
                          Tổng tiền xuất ({phieu.chiTiet.length} loại):
                        </Text>
                        <Text style={[s.tongVal, { color: B.success }]}>{fmtMoney(tongPhieu)}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}

        {/* Tổng kết cuối */}
        {searched && results.length > 0 && (
          <View style={s.summaryCard}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Tổng số phiếu xuất</Text>
              <Text style={s.summaryVal}>{results.length} phiếu</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Tổng mặt hàng</Text>
              <Text style={s.summaryVal}>{allItems.length} loại</Text>
            </View>
            <View style={[s.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={[s.summaryLabel, { color: B.success, fontWeight: "800" }]}>
                Tổng tiền xuất kho
              </Text>
              <Text style={[s.summaryVal, { color: B.success, fontSize: 16 }]}>
                {fmtMoney(tongTien)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Nút in báo cáo */}
      {searched && results.length > 0 && (
        <View style={s.fabWrap}>
          <TouchableOpacity style={[s.fabBtn, { backgroundColor: B.success }]} onPress={() => setPrintModalVisible(true)}>
            <Ionicons name="print-outline" size={18} color="#fff" />
            <Text style={s.fabBtnTxt}>In báo cáo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── MODAL IN BÁO CÁO XUẤT THUỐC ── */}
      <Modal
        visible={printModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPrintModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { minHeight: "90%" }]}>
            <View style={s.modalHandle} />

            <View style={s.modalHeader}>
              <View style={s.modalHeaderLeft}>
                <View style={[s.modalHeaderIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="print" size={17} color={B.success} />
                </View>
                <Text style={s.modalTitle}>Báo cáo xuất thuốc</Text>
              </View>
              <TouchableOpacity
                onPress={() => setPrintModalVisible(false)}
                style={s.closeBtn}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={s.modalBody}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[s.modalBodyContent, { paddingBottom: 30 }]}>

              {/* Tiêu đề phòng khám */}
              <View style={s.printClinic}>
                <View style={s.printClinicTop}>
                  <View style={s.printLogoBox}>
                    <Ionicons name="medical" size={26} color="#fff" />
                  </View>
                  <View style={s.printClinicInfo}>
                    <Text style={s.printClinicName}>HHIS MANAGE 2026</Text>
                    <Text style={s.printClinicTagline}>Phần mềm quản lý phòng khám</Text>
                  </View>
                </View>
                <View style={s.printClinicDivider} />
                <View style={s.printClinicBottom}>
                  <View style={s.printClinicBottomItem}>
                    <Ionicons name="location-outline" size={12} color={B.primary} />
                    <Text style={s.printClinicSub}>An Châu Yên Khang · Ý Yên · Nam Định</Text>
                  </View>
                  <View style={s.printClinicBottomItem}>
                    <Ionicons name="call-outline" size={12} color={B.primary} />
                    <Text style={s.printClinicSub}>0338.300901</Text>
                  </View>
                </View>
              </View>

              {/* Tiêu đề báo cáo */}
              <View style={s.printTitleBox}>
                <Text style={s.printTitle}>BÁO CÁO XUẤT THUỐC</Text>
                <View style={s.printPeriodRow}>
                  <Ionicons name="calendar-outline" size={13} color={B.textSub} />
                  <Text style={s.printPeriodTxt}>
                    Từ {fmtDate(tuNgay)} đến {fmtDate(denNgay)}
                  </Text>
                </View>
              </View>

              {/* Tổng quan */}
              <View style={s.printInfoBox}>
                {[
                  { icon: "receipt-outline", label: "Số phiếu xuất", val: `${results.length} phiếu` },
                  { icon: "medkit-outline", label: "Tổng mặt hàng", val: `${allItems.length} loại` },
                  { icon: "layers-outline", label: "Tổng số lượng", val: tongSoLuong.toLocaleString("vi-VN") },
                ].map((row) => (
                  <View key={row.label} style={s.printInfoRow}>
                    <View style={s.printInfoLeft}>
                      <Ionicons name={row.icon as any} size={13} color={B.primary} />
                      <Text style={s.printInfoLabel}>{row.label}</Text>
                    </View>
                    <Text style={s.printInfoVal}>{row.val}</Text>
                  </View>
                ))}
                <View style={[s.printInfoRow, { backgroundColor: "#ECFDF5", borderBottomWidth: 0 }]}>
                  <View style={s.printInfoLeft}>
                    <Ionicons name="cash-outline" size={13} color={B.success} />
                    <Text style={[s.printInfoLabel, { color: B.success, fontWeight: "700" }]}>
                      Tổng tiền xuất
                    </Text>
                  </View>
                  <Text style={[s.printInfoVal, { color: B.success, fontSize: 14, fontWeight: "900" }]}>
                    {fmtMoney(tongTien)}
                  </Text>
                </View>
              </View>

              {/* Tổng hợp chi tiết xuất — nhóm theo ngày */}
              <Text style={[s.printSecLabel, { marginTop: 4 }]}>Tổng hợp chi tiết xuất</Text>

              {(() => {
                // Nhóm allItems theo ngày xuất
                const grouped: Record<string, typeof allItems> = {};
                allItems.forEach((t) => {
                  const day = t.ngayXuat.split(" ")[0];
                  if (!grouped[day]) grouped[day] = [];
                  grouped[day].push(t);
                });
                const days = Object.keys(grouped).sort();
                let globalStt = 0;

                return (
                  <>
                    {days.map((day) => {
                      const rows = grouped[day];
                      const tongNgay = rows.reduce((s, t) => s + t.soLuong * t.giaXuat, 0);
                      return (
                        <View key={day} style={s.xlDayBlock}>
                          {/* ── Header ngày ── */}
                          <View style={s.xlDayHeader}>
                            <View style={s.xlDayHeaderLeft}>
                              <Ionicons name="calendar" size={13} color="#fff" />
                              <Text style={s.xlDayHeaderTxt}>Ngày xuất: {fmtDate(day)}</Text>
                            </View>
                            <View style={s.xlDayHeaderRight}>
                              <Text style={s.xlDayHeaderCount}>{rows.length} mặt hàng</Text>
                            </View>
                          </View>

                          {/* ── Header cột ── */}
                          <View style={s.xlColHeader}>
                            <Text style={[s.xlColTh, { width: 24, textAlign: "center" }]}>STT</Text>
                            <Text style={[s.xlColTh, { flex: 1 }]}>Tên thuốc</Text>
                            <Text style={[s.xlColTh, { width: 28, textAlign: "right" }]}>SL</Text>
                            <Text style={[s.xlColTh, { width: 70, textAlign: "right" }]}>Đơn giá</Text>
                            <Text style={[s.xlColTh, { width: 78, textAlign: "right" }]}>Thành tiền</Text>
                          </View>

                          {/* ── Hàng dữ liệu ── */}
                          {rows.map((t, i) => {
                            globalStt++;
                            const stt = globalStt;
                            return (
                              <View
                                key={`${t.maPhieu}-${t.id}`}
                                style={[s.xlDataRow, i % 2 === 0 ? s.xlRowEven : s.xlRowOdd]}>
                                {/* STT */}
                                <View style={[s.xlDataCell, { width: 24, alignItems: "center" }]}>
                                  <Text style={s.xlSttTxt}>{stt}</Text>
                                </View>
                                {/* Tên thuốc */}
                                <View style={[s.xlDataCell, { flex: 1 }]}>
                                  <Text style={s.xlDrugTxt}>{t.tenThuoc}</Text>
                                </View>
                                {/* SL */}
                                <View style={[s.xlDataCell, { width: 28, alignItems: "flex-end" }]}>
                                  <Text style={s.xlSlTxt}>{t.soLuong}</Text>
                                </View>
                                {/* Đơn giá */}
                                <View style={[s.xlDataCell, { width: 70, alignItems: "flex-end" }]}>
                                  <Text style={s.xlPriceTxt}>{fmtMoney(t.giaXuat)}</Text>
                                </View>
                                {/* Thành tiền */}
                                <View style={[s.xlDataCell, { width: 78, alignItems: "flex-end", borderRightWidth: 0 }]}>
                                  <Text style={s.xlTotalTxt}>{fmtMoney(t.soLuong * t.giaXuat)}</Text>
                                </View>
                              </View>
                            );
                          })}

                          {/* ── Tổng tiền theo ngày ── */}
                          <View style={s.xlDayFooter}>
                            <Text style={s.xlDayFooterLabel}>
                              Tổng ngày {fmtDate(day)}
                            </Text>
                            <Text style={s.xlDayFooterVal}>{fmtMoney(tongNgay)}</Text>
                          </View>
                        </View>
                      );
                    })}

                    {/* ── Tổng cộng toàn bộ ── */}
                    <View style={s.xlGrandFooter}>
                      <View style={s.xlGrandFooterLeft}>
                        <Ionicons name="calculator" size={14} color="#fff" />
                        <Text style={s.xlGrandFooterLabel}>
                          TỔNG CỘNG ({days.length} ngày · {allItems.length} mặt hàng)
                        </Text>
                      </View>
                      <Text style={s.xlGrandFooterVal}>{fmtMoney(tongTien)}</Text>
                    </View>
                  </>
                );
              })()}

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

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  statCard: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, padding: 12, borderWidth: 1, borderColor: B.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  statIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, color: B.textSub, fontWeight: "500" },

  tongTienCard: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: B.primary, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 16, marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: B.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 6 },
    }),
  },
  tongTienLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  tongTienIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
  },
  tongTienLabel: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },
  tongTienPeriod: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  tongTienVal: { fontSize: 15, fontWeight: "900", color: "#fff" },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  emptyText: { fontSize: 12, color: B.textSub, textAlign: "center" },

  phieuCard: {
    flexDirection: "row", backgroundColor: B.white,
    borderRadius: 14, borderWidth: 1, borderColor: B.border,
    marginBottom: 12, overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  phieuAccent: { width: 5, backgroundColor: B.success },
  phieuBody: { flex: 1, padding: 12, gap: 8 },
  phieuTopRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  maBox: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#FEF2F2", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  maText: { fontSize: 12, fontWeight: "800", color: B.primary },
  ngayBox: { flexDirection: "row", alignItems: "center", gap: 3, flex: 1 },
  ngayText: { fontSize: 11, color: B.textSub },
  nguoiNhanRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  nguoiNhanName: { flex: 1, fontSize: 14, fontWeight: "800", color: B.textTitle },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  soLoaiChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#F1F5F9", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5,
  },
  soLoaiTxt: { fontSize: 10, color: B.textSub },
  tongInline: { fontSize: 13, fontWeight: "800", color: B.success },

  chiTietWrap: { borderTopWidth: 1, borderTopColor: B.border, paddingTop: 8 },
  tblHeaderRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ECFDF5", paddingVertical: 6, paddingHorizontal: 6,
    borderRadius: 6, marginBottom: 2,
  },
  tblHeaderTxt: { fontSize: 10, fontWeight: "700", color: B.success },
  tblRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 7, paddingHorizontal: 6,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  tblName: { fontSize: 12, fontWeight: "700", color: B.textTitle, marginBottom: 2 },
  tblTd: { fontSize: 11, color: B.textSub },
  dvMiniChip: { backgroundColor: "#EFF6FF", paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  dvMiniTxt: { fontSize: 9, fontWeight: "700", color: B.info },
  tongRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 6, paddingVertical: 9,
    backgroundColor: "#ECFDF5", borderRadius: 8, marginTop: 4,
  },
  tongLabel: { fontSize: 11, fontWeight: "600", color: B.textSub },
  tongVal: { fontSize: 14, fontWeight: "800" },

  summaryCard: {
    backgroundColor: B.white, borderRadius: 14,
    borderWidth: 1, borderColor: B.border, overflow: "hidden", marginTop: 4,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: B.border,
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
    gap: 8, borderRadius: 12, paddingVertical: 14,
    ...Platform.select({
      ios: { shadowColor: B.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  fabBtnTxt: { fontSize: 15, fontWeight: "800", color: "#fff" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: B.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: "95%",
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
  modalTitle: { fontSize: 16, fontWeight: "800", color: B.textTitle },
  closeBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center",
  },
  modalBody: { flex: 1 },
  modalBodyContent: { padding: 14 },
  modalFooter: {
    flexDirection: "row", padding: 14, gap: 10,
    backgroundColor: B.white, borderTopWidth: 1, borderTopColor: B.border,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 12,
    backgroundColor: "#F1F5F9", alignItems: "center",
  },
  cancelBtnTxt: { fontSize: 14, fontWeight: "700", color: B.textSub },
  saveBtn: {
    flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 13, borderRadius: 12,
  },
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
  printLogoBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: B.primary, justifyContent: "center", alignItems: "center" },
  printClinicInfo: { flex: 1 },
  printClinicName: { fontSize: 16, fontWeight: "900", color: B.primary, letterSpacing: 0.3 },
  printClinicTagline: { fontSize: 11, color: B.textSub, fontWeight: "500", marginTop: 2 },
  printClinicDivider: { height: 1, backgroundColor: B.border, marginHorizontal: 14 },
  printClinicBottom: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 16 },
  printClinicBottomItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  printClinicSub: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  printTitleBox: { alignItems: "center", gap: 8, marginBottom: 14 },
  printTitle: { fontSize: 17, fontWeight: "900", color: B.textTitle, letterSpacing: 1, textTransform: "uppercase" },
  printPeriodRow: { flexDirection: "row", alignItems: "center", gap: 5 },
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
  printInfoLeft: { flexDirection: "row", alignItems: "center", gap: 6, width: 130 },
  printInfoLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  printInfoVal: { flex: 1, fontSize: 12, color: B.textTitle, fontWeight: "700" },
  printTableWrap: {
    backgroundColor: B.white, borderRadius: 12, borderWidth: 1, borderColor: B.border,
    overflow: "hidden", marginBottom: 16,
  },
  printTblHeader: { flexDirection: "row", backgroundColor: B.primary, paddingVertical: 8, paddingHorizontal: 10 },
  printTh: { fontSize: 9, fontWeight: "700", color: "#fff" },
  printItemRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 9, paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
    gap: 6,
  },
  printSttBox: { width: 22, alignItems: "center", alignSelf: "center" },
  printSttTxt: { fontSize: 11, fontWeight: "700", color: B.textSub },
  printDrugInfo: { flex: 1, gap: 4 },
  printDrugName: { fontSize: 12, fontWeight: "800", color: B.textTitle, lineHeight: 16 },
  printDrugMeta: {
    flexDirection: "row", flexWrap: "nowrap", gap: 4, alignItems: "center", marginTop: 3,
  },
  printMetaChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#F1F5F9", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4,
  },
  printMetaChipTxt: { fontSize: 9, color: B.textSub, fontWeight: "500" },
  printNumCol: { width: 34, alignItems: "center", alignSelf: "center" },
  printNumTxt: { fontSize: 11, fontWeight: "800", color: B.textTitle, textAlign: "center" },
  printPriceCol: { width: 78, alignItems: "flex-end", alignSelf: "center" },
  printPriceTxt: { fontSize: 10, color: B.textSub, textAlign: "right" },
  printTotalCol: { width: 86, alignItems: "flex-end", alignSelf: "center" },
  printTotalColTxt: { fontSize: 11, fontWeight: "800", textAlign: "right" },
  printTblRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  printTdName: { fontSize: 11, fontWeight: "700", color: B.textTitle },
  printTd: { fontSize: 10, color: B.textTitle },
  printTotalRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 10, paddingVertical: 12, backgroundColor: "#ECFDF5",
  },
  printTotalLabel: { fontSize: 12, fontWeight: "700", color: B.textSub },
  printTotalVal: { fontSize: 16, fontWeight: "900", color: B.success },
  printSigRow: { flexDirection: "row", gap: 10 },
  printSigBox: { flex: 1, alignItems: "center", gap: 4 },
  printSigTitle: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  printSigSub: { fontSize: 10, color: B.textSub, fontStyle: "italic" },
  printSigLine: { width: "100%", height: 1, backgroundColor: B.border, marginTop: 40 },

  // Phiếu xuất block trong print
  printPhieuBlock: { marginBottom: 16 },
  printPhieuHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#ECFDF5", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6,
    borderWidth: 1, borderColor: B.success + "30",
  },
  printPhieuHeaderLeft: { flex: 1, gap: 5 },
  printPhieuMaBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  printPhieuMaTxt: { fontSize: 13, fontWeight: "800", color: B.primary, letterSpacing: 0.3 },
  printPhieuHeaderMeta: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 4 },
  printPhieuMetaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  printPhieuMetaTxt: { fontSize: 11, color: B.textSub, fontWeight: "500", flexShrink: 1 },
  printPhieuDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },
  printPhieuTongBox: { alignItems: "flex-end", paddingLeft: 10 },
  printPhieuTongLabel: { fontSize: 9, color: B.textSub, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },
  printPhieuTongVal: { fontSize: 13, fontWeight: "900" },
  printPhieuSubTotal: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 10, paddingVertical: 9,
  },
  printPhieuSubTotalLabel: { fontSize: 11, fontWeight: "600", color: B.textSub },
  printPhieuSubTotalVal: { fontSize: 13, fontWeight: "800" },
  printGrandTotal: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: B.success, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8 },
      android: { elevation: 5 },
    }),
  },
  printGrandTotalLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  printGrandTotalLabel: { fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.9)", flexShrink: 1 },
  printGrandTotalVal: { fontSize: 16, fontWeight: "900", color: "#fff" },

  // ── Bảng tổng hợp nhóm theo ngày ──
  xlDayBlock: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: B.white,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 5 },
      android: { elevation: 3 },
    }),
  },
  xlDayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  xlDayHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  xlDayHeaderTxt: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  xlDayHeaderRight: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  xlDayHeaderCount: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
  },
  xlColHeader: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderBottomWidth: 1,
    borderBottomColor: "#BFDBFE",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  xlColTh: {
    fontSize: 9,
    fontWeight: "700",
    color: "#1E40AF",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  xlDataRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 8,
  },
  xlRowEven: { backgroundColor: "#FFFFFF" },
  xlRowOdd: { backgroundColor: "#F8FAFC" },
  xlDataCell: {
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    justifyContent: "center",
  },
  xlSttTxt: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
  },
  xlDrugTxt: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
    lineHeight: 16,
  },
  xlDvChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  xlDvTxt: {
    fontSize: 9,
    fontWeight: "700",
    color: "#2563EB",
  },
  xlSlTxt: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  xlPriceTxt: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
    textAlign: "right",
  },
  xlTotalTxt: {
    fontSize: 11,
    fontWeight: "800",
    color: "#059669",
  },
  xlDayFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1.5,
    borderTopColor: "#93C5FD",
  },
  xlDayFooterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E40AF",
  },
  xlDayFooterVal: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1D4ED8",
  },
  xlGrandFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: B.success,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: B.success, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8 },
      android: { elevation: 5 },
    }),
  },
  xlGrandFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  xlGrandFooterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    flexShrink: 1,
  },
  xlGrandFooterVal: {
    fontSize: 15,
    fontWeight: "900",
    color: "#fff",
  },
  // legacy xl kept for compatibility
  xlWrap: { marginBottom: 0 },
  xlHeader: { flexDirection: "row" },
  xlTh: { fontSize: 9, fontWeight: "700", color: "#fff" },
  xlRow: { flexDirection: "row" },
  xlCell: { paddingVertical: 8, paddingHorizontal: 4 },
  xlDateTxt: { fontSize: 11, color: B.textSub },
  xlFooter: { flexDirection: "row", justifyContent: "space-between", padding: 10 },
  xlFooterLabel: { fontSize: 12, fontWeight: "700", color: B.textSub },
  xlFooterVal: { fontSize: 14, fontWeight: "900", color: B.success },
});