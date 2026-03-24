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

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const fmtDate = (s: string) => {
  if (!s) return "—";
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

interface ProcedureRow {
  id: number;
  ngayKham: string;
  tenBenhNhan: string;
  tenThuThuat: string;
  donGia: number;
  soLuong: number;
  giamGia: number; // tiền giảm
  tienBS: number;  // tiền bác sĩ (%)
  tienHH: number;  // tiền hoa hồng (%)
  bacSi: string;
}

interface BacSiGroup {
  bacSi: string;
  rows: ProcedureRow[];
}

const BAC_SI_LIST = ["Tất cả", "BS. Nguyễn Minh Tuấn", "BS. Trần Thị Lan", "BS. Phạm Văn Hùng"];

const SAMPLE_DATA: ProcedureRow[] = [
  // BS. Nguyễn Minh Tuấn
  { id: 1, ngayKham: getCurrentDate(), tenBenhNhan: "Nguyễn Văn An", tenThuThuat: "Khám bệnh tổng quát", donGia: 150000, soLuong: 1, giamGia: 0, tienBS: 45000, tienHH: 15000, bacSi: "BS. Nguyễn Minh Tuấn" },
  { id: 2, ngayKham: getCurrentDate(), tenBenhNhan: "Trần Thị Bình", tenThuThuat: "Đo huyết áp", donGia: 30000, soLuong: 2, giamGia: 0, tienBS: 9000, tienHH: 3000, bacSi: "BS. Nguyễn Minh Tuấn" },
  { id: 3, ngayKham: getCurrentDate(), tenBenhNhan: "Trần Thị Bình", tenThuThuat: "Khám tim mạch", donGia: 180000, soLuong: 1, giamGia: 18000, tienBS: 48600, tienHH: 16200, bacSi: "BS. Nguyễn Minh Tuấn" },
  { id: 4, ngayKham: getFirstDayOfMonth(), tenBenhNhan: "Hoàng Đức Thành", tenThuThuat: "Chụp X-quang phổi", donGia: 180000, soLuong: 1, giamGia: 0, tienBS: 54000, tienHH: 18000, bacSi: "BS. Nguyễn Minh Tuấn" },
  { id: 5, ngayKham: getFirstDayOfMonth(), tenBenhNhan: "Hoàng Đức Thành", tenThuThuat: "Đo chức năng hô hấp", donGia: 220000, soLuong: 1, giamGia: 22000, tienBS: 59400, tienHH: 19800, bacSi: "BS. Nguyễn Minh Tuấn" },
  // BS. Trần Thị Lan
  { id: 6, ngayKham: getCurrentDate(), tenBenhNhan: "Nguyễn Văn An", tenThuThuat: "Xét nghiệm máu cơ bản", donGia: 200000, soLuong: 1, giamGia: 0, tienBS: 50000, tienHH: 20000, bacSi: "BS. Trần Thị Lan" },
  { id: 7, ngayKham: getCurrentDate(), tenBenhNhan: "Lê Minh Cường", tenThuThuat: "Xét nghiệm đường huyết", donGia: 85000, soLuong: 1, giamGia: 0, tienBS: 25500, tienHH: 8500, bacSi: "BS. Trần Thị Lan" },
  { id: 8, ngayKham: getCurrentDate(), tenBenhNhan: "Lê Minh Cường", tenThuThuat: "Khám nội tiết", donGia: 200000, soLuong: 1, giamGia: 20000, tienBS: 54000, tienHH: 18000, bacSi: "BS. Trần Thị Lan" },
  { id: 9, ngayKham: getCurrentDate(), tenBenhNhan: "Phạm Thu Hà", tenThuThuat: "Xét nghiệm H.pylori", donGia: 150000, soLuong: 1, giamGia: 0, tienBS: 45000, tienHH: 15000, bacSi: "BS. Trần Thị Lan" },
  // BS. Phạm Văn Hùng
  { id: 10, ngayKham: getCurrentDate(), tenBenhNhan: "Trần Thị Bình", tenThuThuat: "Điện tâm đồ (ECG)", donGia: 120000, soLuong: 1, giamGia: 12000, tienBS: 32400, tienHH: 10800, bacSi: "BS. Phạm Văn Hùng" },
  { id: 11, ngayKham: getCurrentDate(), tenBenhNhan: "Phạm Thu Hà", tenThuThuat: "Siêu âm ổ bụng", donGia: 250000, soLuong: 1, giamGia: 0, tienBS: 75000, tienHH: 25000, bacSi: "BS. Phạm Văn Hùng" },
  { id: 12, ngayKham: getCurrentDate(), tenBenhNhan: "Phạm Thu Hà", tenThuThuat: "Nội soi dạ dày", donGia: 450000, soLuong: 1, giamGia: 45000, tienBS: 121500, tienHH: 40500, bacSi: "BS. Phạm Văn Hùng" },
];

function thanhTien(r: ProcedureRow) {
  return r.donGia * r.soLuong - r.giamGia;
}

export default function Baocaothuthuattheobacsi() {
  const router = useRouter();
  const [tuNgay, setTuNgay] = useState(getFirstDayOfMonth());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [selectedBS, setSelectedBS] = useState("Tất cả");
  const [bsDropdown, setBsDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<BacSiGroup[]>([]);
  const [searched, setSearched] = useState(false);
  const [expandedBS, setExpandedBS] = useState<Set<string>>(new Set());
  const [printModalVisible, setPrintModalVisible] = useState(false);

  const doSearch = (tu: string, den: string, bs: string, kw: string) => {
    const filtered = SAMPLE_DATA.filter((r) => {
      const inRange = r.ngayKham >= tu && r.ngayKham <= den;
      const matchBS = bs === "Tất cả" || r.bacSi === bs;
      const matchKw =
        kw === "" ||
        r.tenThuThuat.toLowerCase().includes(kw.toLowerCase()) ||
        r.tenBenhNhan.toLowerCase().includes(kw.toLowerCase());
      return inRange && matchBS && matchKw;
    });

    // Nhóm theo bác sĩ
    const grouped: Record<string, ProcedureRow[]> = {};
    filtered.forEach((r) => {
      if (!grouped[r.bacSi]) grouped[r.bacSi] = [];
      grouped[r.bacSi].push(r);
    });
    const groupList: BacSiGroup[] = Object.entries(grouped).map(([bacSi, rows]) => ({ bacSi, rows }));
    setResults(groupList);
    setSearched(true);
    setExpandedBS(new Set(groupList.map((g) => g.bacSi)));
  };

  useEffect(() => {
    doSearch(getFirstDayOfMonth(), getCurrentDate(), "Tất cả", "");
  }, []);

  const handleSearch = () => {
    setBsDropdown(false);
    doSearch(tuNgay, denNgay, selectedBS, searchText);
  };

  const toggleBS = (bs: string) => {
    setExpandedBS((prev) => {
      const next = new Set(prev);
      next.has(bs) ? next.delete(bs) : next.add(bs);
      return next;
    });
  };

  const allRows = results.flatMap((g) => g.rows);
  const totals = allRows.reduce(
    (acc, r) => ({
      soLuong: acc.soLuong + r.soLuong,
      giamGia: acc.giamGia + r.giamGia,
      thanhTien: acc.thanhTien + thanhTien(r),
      tienBS: acc.tienBS + r.tienBS,
      tienHH: acc.tienHH + r.tienHH,
    }),
    { soLuong: 0, giamGia: 0, thanhTien: 0, tienBS: 0, tienHH: 0 }
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
            <Text style={s.headerTitle}>Thủ thuật theo bác sĩ</Text>
            <Text style={s.headerSub}>Báo cáo doanh thu thủ thuật</Text>
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
              placeholder="Tìm tên thủ thuật, bệnh nhân..."
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

          {/* Chọn bác sĩ */}
          <View>
            <Text style={s.fieldLabel}>Bác sĩ</Text>
            <TouchableOpacity
              style={s.comboBox}
              onPress={() => setBsDropdown(!bsDropdown)}
              activeOpacity={0.85}>
              <View style={s.comboAvatarBox}>
                <Ionicons name="person" size={13} color={B.primary} />
              </View>
              <Text style={s.comboBoxTxt} numberOfLines={1}>{selectedBS}</Text>
              <Ionicons name={bsDropdown ? "chevron-up" : "chevron-down"} size={14} color={B.textSub} />
            </TouchableOpacity>
            {bsDropdown && (
              <View style={s.dropdownList}>
                {BAC_SI_LIST.map((bs) => (
                  <TouchableOpacity
                    key={bs}
                    style={[s.dropdownItem, selectedBS === bs && s.dropdownItemActive]}
                    onPress={() => { setSelectedBS(bs); setBsDropdown(false); }}>
                    <View style={s.dropdownItemLeft}>
                      <View style={[s.dropdownDot, { backgroundColor: bs === "Tất cả" ? B.border : B.success }]} />
                      <Text style={[s.dropdownItemTxt, selectedBS === bs && { color: B.primary, fontWeight: "700" }]}>
                        {bs}
                      </Text>
                    </View>
                    {selectedBS === bs && <Ionicons name="checkmark-circle" size={16} color={B.primary} />}
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

        {/* ── STATS ── */}
        {searched && results.length > 0 && (
          <>
            <View style={s.statsRow}>
              <View style={[s.statCard, { backgroundColor: "#FEF2F2" }]}>
                <View style={[s.statIcon, { backgroundColor: B.primary + "20" }]}>
                  <Ionicons name="person" size={16} color={B.primary} />
                </View>
                <View>
                  <Text style={[s.statNum, { color: B.primary }]}>{results.length}</Text>
                  <Text style={s.statLabel}>Bác sĩ</Text>
                </View>
              </View>
              <View style={[s.statCard, { backgroundColor: "#EFF6FF" }]}>
                <View style={[s.statIcon, { backgroundColor: B.info + "20" }]}>
                  <Ionicons name="medical" size={16} color={B.info} />
                </View>
                <View>
                  <Text style={[s.statNum, { color: B.info }]}>{allRows.length}</Text>
                  <Text style={s.statLabel}>Thủ thuật</Text>
                </View>
              </View>
            </View>

            {/* Tổng thu card */}
            <View style={s.tongTienCard}>
              <View style={s.tongTienLeft}>
                <View style={s.tongTienIconBox}>
                  <Ionicons name="cash" size={22} color="#fff" />
                </View>
                <View>
                  <Text style={s.tongTienLabel}>Tổng thành tiền</Text>
                  <Text style={s.tongTienPeriod}>{fmtDate(tuNgay)} — {fmtDate(denNgay)}</Text>
                </View>
              </View>
              <Text style={s.tongTienVal}>{fmtMoney(totals.thanhTien)}</Text>
            </View>

            {/* Mini stats: Tiền BS + Tiền HH */}
            <View style={s.miniStatsRow}>
              <View style={s.miniStatCard}>
                <View style={[s.miniStatIcon, { backgroundColor: B.success + "18" }]}>
                  <Ionicons name="medkit" size={14} color={B.success} />
                </View>
                <View>
                  <Text style={s.miniStatLabel}>Tiền BS</Text>
                  <Text style={[s.miniStatVal, { color: B.success }]}>{fmtMoney(totals.tienBS)}</Text>
                </View>
              </View>
              <View style={s.miniStatCard}>
                <View style={[s.miniStatIcon, { backgroundColor: B.warning + "18" }]}>
                  <Ionicons name="gift" size={14} color={B.warning} />
                </View>
                <View>
                  <Text style={s.miniStatLabel}>Tiền HH</Text>
                  <Text style={[s.miniStatVal, { color: B.warning }]}>{fmtMoney(totals.tienHH)}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ── EMPTY ── */}
        {searched && results.length === 0 && (
          <View style={s.emptyBox}>
            <Ionicons name="person-outline" size={56} color={B.border} />
            <Text style={s.emptyTitle}>Không có dữ liệu</Text>
            <Text style={s.emptyText}>Không tìm thấy thủ thuật trong khoảng thời gian này</Text>
          </View>
        )}

        {/* ── DANH SÁCH THEO BÁC SĨ ── */}
        {searched && results.map((group) => {
          const exp = expandedBS.has(group.bacSi);
          const groupTotals = group.rows.reduce(
            (acc, r) => ({
              thanhTien: acc.thanhTien + thanhTien(r),
              tienBS: acc.tienBS + r.tienBS,
              tienHH: acc.tienHH + r.tienHH,
              giamGia: acc.giamGia + r.giamGia,
            }),
            { thanhTien: 0, tienBS: 0, tienHH: 0, giamGia: 0 }
          );

          return (
            <View key={group.bacSi} style={s.bsBlock}>
              {/* Header bác sĩ */}
              <TouchableOpacity
                onPress={() => toggleBS(group.bacSi)}
                activeOpacity={0.8}
                style={s.bsHeader}>
                <View style={s.bsAvatarBox}>
                  <Text style={s.bsAvatarTxt}>
                    {group.bacSi.replace("BS. ", "").split(" ").pop()?.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.bsName}>{group.bacSi}</Text>
                  <View style={s.bsMetaRow}>
                    <View style={s.bsCountChip}>
                      <Text style={s.bsCountTxt}>{group.rows.length} thủ thuật</Text>
                    </View>
                    <Text style={s.bsTongTxt}>{fmtMoney(groupTotals.thanhTien)}</Text>
                  </View>
                </View>
                <Ionicons
                  name={exp ? "chevron-up" : "chevron-down"}
                  size={18} color={B.textSub}
                />
              </TouchableOpacity>

              {/* Danh sách thủ thuật — card per item giống in */}
              {exp && (
                <View style={s.bsRows}>
                  {group.rows.map((r, idx) => (
                    <View key={r.id} style={[s.ttCard, idx % 2 !== 0 && { backgroundColor: "#FAFAFA" }]}>

                      {/* ── Dòng 1: STT · Tên TT · Ngày khám ── */}
                      <View style={s.ttCardRow1}>
                        <View style={s.ttCardSttBox}>
                          <Text style={s.ttCardSttTxt}>{idx + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.ttCardName}>{r.tenThuThuat}</Text>
                          <View style={s.ttCardMetaRow}>
                            <Ionicons name="person-outline" size={10} color={B.textSub} />
                            <Text style={s.ttCardMeta}>{r.tenBenhNhan}</Text>
                            <View style={s.ttCardDot} />
                            <Ionicons name="calendar-outline" size={10} color={B.textSub} />
                            <Text style={s.ttCardMeta}>{fmtDate(r.ngayKham)}</Text>
                          </View>
                        </View>
                        {/* Thành tiền nổi bật góc phải */}
                        <Text style={s.ttCardTT}>{fmtMoney(thanhTien(r))}</Text>
                      </View>

                      {/* ── Divider ── */}
                      <View style={s.ttCardDiv} />

                      {/* ── Dòng 2: SL · Đơn giá · Giảm · Tiền BS · Tiền HH ── */}
                      <View style={s.ttCardRow2}>
                        <View style={s.ttCardStatCell}>
                          <Text style={s.ttCardStatLabel}>SL</Text>
                          <Text style={s.ttCardStatVal}>{r.soLuong}</Text>
                        </View>
                        <View style={s.ttCardStatSep} />
                        <View style={s.ttCardStatCell}>
                          <Text style={s.ttCardStatLabel}>Đơn giá</Text>
                          <Text style={s.ttCardStatVal}>{fmtMoney(r.donGia)}</Text>
                        </View>
                        <View style={s.ttCardStatSep} />
                        <View style={s.ttCardStatCell}>
                          <Text style={s.ttCardStatLabel}>Giảm</Text>
                          {r.giamGia > 0 ? (
                            <Text style={[s.ttCardStatVal, { color: B.danger }]}>-{fmtMoney(r.giamGia)}</Text>
                          ) : (
                            <Text style={[s.ttCardStatVal, { color: "#CBD5E1" }]}>—</Text>
                          )}
                        </View>
                        <View style={s.ttCardStatSep} />
                        <View style={s.ttCardStatCell}>
                          <Text style={s.ttCardStatLabel}>Tiền BS</Text>
                          <Text style={[s.ttCardStatVal, { color: B.success }]}>{fmtMoney(r.tienBS)}</Text>
                        </View>
                        <View style={s.ttCardStatSep} />
                        <View style={[s.ttCardStatCell, { alignItems: "flex-end" }]}>
                          <Text style={s.ttCardStatLabel}>Tiền HH</Text>
                          <Text style={[s.ttCardStatVal, { color: B.warning }]}>{fmtMoney(r.tienHH)}</Text>
                        </View>
                      </View>

                    </View>
                  ))}

                  {/* Tổng theo bác sĩ */}
                  <View style={s.bsFooter}>
                    <View style={s.bsFooterMain}>
                      <Text style={s.bsFooterLabel}>Tổng {group.bacSi} ({group.rows.length} TT)</Text>
                      <Text style={s.bsFooterVal}>{fmtMoney(groupTotals.thanhTien)}</Text>
                    </View>
                    <View style={s.bsFooterSub}>
                      <View style={s.bsChipLarge}>
                        <Ionicons name="medkit-outline" size={11} color={B.success} />
                        <Text style={s.bsChipLargeTxt}>Tiền BS: {fmtMoney(groupTotals.tienBS)}</Text>
                      </View>
                      <View style={s.hhChipLarge}>
                        <Ionicons name="gift-outline" size={11} color={B.warning} />
                        <Text style={s.hhChipLargeTxt}>Tiền HH: {fmtMoney(groupTotals.tienHH)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* ── TỔNG KẾT ── */}
        {searched && results.length > 0 && (
          <View style={s.summaryCard}>
            {/* Header */}
            <View style={s.summaryHeader}>
              <Ionicons name="calculator" size={14} color={B.primary} />
              <Text style={s.summaryHeaderTxt}>Tổng kết báo cáo</Text>
              <Text style={s.summaryPeriod}>{fmtDate(tuNgay)} – {fmtDate(denNgay)}</Text>
            </View>

            {/* Grid 2×2: Thành tiền + Giảm giá + Tiền BS + Tiền HH */}
            <View style={s.summaryGrid}>
              <View style={[s.summaryGridCell, { borderRightWidth: 1, borderBottomWidth: 1 }]}>
                <View style={s.summaryGridIcon}>
                  <Ionicons name="cash-outline" size={14} color={B.primary} />
                </View>
                <Text style={s.summaryGridLabel}>Thành tiền</Text>
                <Text style={[s.summaryGridVal, { color: B.primary }]}>{fmtMoney(totals.thanhTien)}</Text>
              </View>
              <View style={[s.summaryGridCell, { borderBottomWidth: 1, backgroundColor: "#FFF5F5" }]}>
                <View style={[s.summaryGridIcon, { backgroundColor: B.danger + "15" }]}>
                  <Ionicons name="remove-circle-outline" size={14} color={B.danger} />
                </View>
                <Text style={[s.summaryGridLabel, { color: B.danger }]}>Giảm giá</Text>
                <Text style={[s.summaryGridVal, { color: B.danger }]}>-{fmtMoney(totals.giamGia)}</Text>
              </View>
              <View style={[s.summaryGridCell, { borderRightWidth: 1, backgroundColor: "#F0FDF4" }]}>
                <View style={[s.summaryGridIcon, { backgroundColor: B.success + "18" }]}>
                  <Ionicons name="medkit-outline" size={14} color={B.success} />
                </View>
                <Text style={[s.summaryGridLabel, { color: B.success }]}>Tiền BS</Text>
                <Text style={[s.summaryGridVal, { color: B.success }]}>{fmtMoney(totals.tienBS)}</Text>
              </View>
              <View style={[s.summaryGridCell, { backgroundColor: "#FFFBEB" }]}>
                <View style={[s.summaryGridIcon, { backgroundColor: B.warning + "18" }]}>
                  <Ionicons name="gift-outline" size={14} color={B.warning} />
                </View>
                <Text style={[s.summaryGridLabel, { color: B.warning }]}>Tiền HH</Text>
                <Text style={[s.summaryGridVal, { color: B.warning }]}>{fmtMoney(totals.tienHH)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Nút in */}
      {searched && results.length > 0 && (
        <View style={s.fabWrap}>
          <TouchableOpacity style={s.fabBtn} onPress={() => setPrintModalVisible(true)}>
            <Ionicons name="print-outline" size={18} color="#fff" />
            <Text style={s.fabBtnTxt}>In báo cáo thủ thuật</Text>
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
                <Text style={s.modalTitle}>Báo cáo thủ thuật theo BS</Text>
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
                <Text style={s.printTitle}>BÁO CÁO THỦ THUẬT THEO BÁC SĨ</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <Ionicons name="calendar-outline" size={12} color={B.textSub} />
                  <Text style={s.printPeriodTxt}>Từ {fmtDate(tuNgay)} đến {fmtDate(denNgay)}</Text>
                </View>
                {selectedBS !== "Tất cả" && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                    <Ionicons name="person-outline" size={11} color={B.primary} />
                    <Text style={[s.printPeriodTxt, { color: B.primary, fontWeight: "700" }]}>{selectedBS}</Text>
                  </View>
                )}
              </View>

              {/* Tổng quan */}
              <View style={s.printInfoBox}>
                {[
                  { icon: "person-outline", label: "Số bác sĩ", val: `${results.length} bác sĩ`, color: B.primary },
                  { icon: "medical-outline", label: "Tổng thủ thuật", val: `${allRows.length} thủ thuật`, color: B.info },
                  { icon: "remove-circle-outline", label: "Tổng giảm giá", val: fmtMoney(totals.giamGia), color: B.danger },
                  { icon: "cash-outline", label: "Tổng thành tiền", val: fmtMoney(totals.thanhTien), color: B.primary },
                  { icon: "medkit-outline", label: "Tiền BS", val: fmtMoney(totals.tienBS), color: B.success },
                  { icon: "gift-outline", label: "Tiền HH", val: fmtMoney(totals.tienHH), color: B.warning },
                ].map((row, i, arr) => (
                  <View key={row.label} style={[s.printInfoRow,
                    i === arr.length - 1 ? { backgroundColor: "#FFFBEB", borderBottomWidth: 0 } :
                    i === arr.length - 2 ? { backgroundColor: "#ECFDF5" } : {}]}>
                    <View style={s.printInfoLeft}>
                      <Ionicons name={row.icon as any} size={12} color={row.color} />
                      <Text style={[s.printInfoLabel, { color: row.color, fontWeight: "700" }]}>{row.label}</Text>
                    </View>
                    <Text style={[s.printInfoVal, { color: row.color, fontWeight: "800" }]}>{row.val}</Text>
                  </View>
                ))}
              </View>

              {/* Chi tiết từng bác sĩ */}
              <Text style={s.printSecLabel}>Chi tiết theo bác sĩ</Text>

              {results.map((group, gIdx) => {
                const groupTotals = group.rows.reduce(
                  (acc, r) => ({
                    thanhTien: acc.thanhTien + thanhTien(r),
                    tienBS: acc.tienBS + r.tienBS,
                    tienHH: acc.tienHH + r.tienHH,
                    giamGia: acc.giamGia + r.giamGia,
                  }),
                  { thanhTien: 0, tienBS: 0, tienHH: 0, giamGia: 0 }
                );
                return (
                  <View key={group.bacSi} style={s.pBsCard}>
                    {/* Header bác sĩ */}
                    <View style={s.pBsHeader}>
                      <View style={s.pBsSttBox}>
                        <Text style={s.pBsSttTxt}>{String(gIdx + 1).padStart(2, "0")}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.pBsName}>{group.bacSi}</Text>
                        <Text style={[s.printPeriodTxt, { marginTop: 2 }]}>{group.rows.length} thủ thuật</Text>
                      </View>
                      <View style={{ alignItems: "flex-end", gap: 3 }}>
                        <Text style={s.pBsTongVal}>{fmtMoney(groupTotals.thanhTien)}</Text>
                        <View style={{ flexDirection: "row", gap: 6 }}>
                          <Text style={[s.pBsMiniTxt, { color: B.success }]}>BS:{fmtMoney(groupTotals.tienBS)}</Text>
                          <Text style={[s.pBsMiniTxt, { color: B.warning }]}>HH:{fmtMoney(groupTotals.tienHH)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Bảng thủ thuật */}
                    <View style={s.pTblWrap}>
                      <View style={s.pTblHeader}>
                        <Text style={[s.pTh, { width: 22, textAlign: "center" }]}>STT</Text>
                        <Text style={[s.pTh, { flex: 1 }]}>Thủ thuật / Bệnh nhân</Text>
                        <Text style={[s.pTh, { width: 24, textAlign: "center" }]}>SL</Text>
                        <Text style={[s.pTh, { width: 64, textAlign: "right" }]}>Đơn giá</Text>
                        <Text style={[s.pTh, { width: 50, textAlign: "right" }]}>Giảm</Text>
                        <Text style={[s.pTh, { width: 68, textAlign: "right" }]}>T.Tiền</Text>
                      </View>

                      {group.rows.map((r, idx) => (
                        <View key={r.id} style={[s.pTblRow, idx % 2 !== 0 && { backgroundColor: "#F8FAFC" }]}>
                          <Text style={[s.pTd, { width: 22, textAlign: "center", color: B.textSub }]}>{idx + 1}</Text>
                          <View style={{ flex: 1, paddingHorizontal: 3 }}>
                            <Text style={s.pTtName}>{r.tenThuThuat}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 }}>
                              <Ionicons name="person-outline" size={9} color={B.textSub} />
                              <Text style={s.pTtMeta}>{r.tenBenhNhan}</Text>
                              <Text style={[s.pTtMeta, { color: B.textSub }]}>· {fmtDate(r.ngayKham)}</Text>
                            </View>
                            <View style={{ flexDirection: "row", gap: 5, marginTop: 2 }}>
                              <Text style={[s.pTtMeta, { color: B.success, fontWeight: "600" }]}>BS:{fmtMoney(r.tienBS)}</Text>
                              <Text style={[s.pTtMeta, { color: B.warning, fontWeight: "600" }]}>HH:{fmtMoney(r.tienHH)}</Text>
                            </View>
                          </View>
                          <Text style={[s.pTd, { width: 24, textAlign: "center", fontWeight: "700" }]}>{r.soLuong}</Text>
                          <Text style={[s.pTd, { width: 64, textAlign: "right", fontSize: 9 }]}>{fmtMoney(r.donGia)}</Text>
                          <Text style={[s.pTd, { width: 50, textAlign: "right", color: r.giamGia > 0 ? B.danger : B.textSub, fontSize: 9 }]}>
                            {r.giamGia > 0 ? `-${fmtMoney(r.giamGia)}` : "—"}
                          </Text>
                          <Text style={[s.pTd, { width: 68, textAlign: "right", color: B.primary, fontWeight: "800", fontSize: 9 }]}>
                            {fmtMoney(thanhTien(r))}
                          </Text>
                        </View>
                      ))}

                      {/* Footer nhóm */}
                      <View style={s.pTblFooter}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.pFooterLabel}>Tổng {group.bacSi}</Text>
                          <View style={{ flexDirection: "row", gap: 8, marginTop: 3 }}>
                            <Text style={[s.pFooterSub, { color: B.success }]}>Tiền BS: {fmtMoney(groupTotals.tienBS)}</Text>
                            <Text style={[s.pFooterSub, { color: B.warning }]}>Tiền HH: {fmtMoney(groupTotals.tienHH)}</Text>
                          </View>
                        </View>
                        <Text style={s.pFooterVal}>{fmtMoney(groupTotals.thanhTien)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Grand total */}
              <View style={s.pGrandWrap}>
                {/* Header tổng */}
                <View style={s.pGrandHeader}>
                  <Ionicons name="calculator" size={14} color="#fff" />
                  <Text style={s.pGrandHeaderTxt}>TỔNG CỘNG — {allRows.length} thủ thuật</Text>
                </View>
                {/* Grid 2×2 */}
                <View style={s.pGrandGrid}>
                  <View style={[s.pGrandCell, { borderRightWidth: 1, borderBottomWidth: 1 }]}>
                    <Text style={s.pGrandCellLabel}>Thành tiền</Text>
                    <Text style={[s.pGrandCellVal, { color: B.primary, fontSize: 14 }]}>{fmtMoney(totals.thanhTien)}</Text>
                  </View>
                  <View style={[s.pGrandCell, { borderBottomWidth: 1, backgroundColor: "#FFF5F5" }]}>
                    <Text style={[s.pGrandCellLabel, { color: B.danger }]}>Giảm giá</Text>
                    <Text style={[s.pGrandCellVal, { color: B.danger }]}>-{fmtMoney(totals.giamGia)}</Text>
                  </View>
                  <View style={[s.pGrandCell, { borderRightWidth: 1, backgroundColor: "#F0FDF4" }]}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 }}>
                      <Ionicons name="medkit-outline" size={11} color={B.success} />
                      <Text style={[s.pGrandCellLabel, { color: B.success }]}>Tiền BS</Text>
                    </View>
                    <Text style={[s.pGrandCellVal, { color: B.success }]}>{fmtMoney(totals.tienBS)}</Text>
                  </View>
                  <View style={[s.pGrandCell, { backgroundColor: "#FFFBEB" }]}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 }}>
                      <Ionicons name="gift-outline" size={11} color={B.warning} />
                      <Text style={[s.pGrandCellLabel, { color: B.warning }]}>Tiền HH</Text>
                    </View>
                    <Text style={[s.pGrandCellVal, { color: B.warning }]}>{fmtMoney(totals.tienHH)}</Text>
                  </View>
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
                  <Text style={s.printSigTitle}>Trưởng khoa</Text>
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
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "500", marginTop: 1 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },

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
    borderWidth: 1, borderColor: B.border, paddingHorizontal: 12, paddingVertical: 9,
  },
  searchInput: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
  fieldLabel: { fontSize: 11, fontWeight: "600", color: B.textSub, marginBottom: 5 },
  comboBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FEF2F2", borderRadius: 8,
    borderWidth: 1.5, borderColor: B.primary + "40",
    paddingHorizontal: 12, paddingVertical: 10,
  },
  comboAvatarBox: {
    width: 24, height: 24, borderRadius: 7,
    backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: B.primary + "30",
    justifyContent: "center", alignItems: "center",
  },
  comboBoxTxt: { flex: 1, fontSize: 13, color: B.textTitle, fontWeight: "600" },
  dropdownList: {
    borderWidth: 1, borderColor: B.border, borderRadius: 10, marginTop: 4, overflow: "hidden",
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
  dropdownItemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  dropdownDot: { width: 8, height: 8, borderRadius: 4 },
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
    paddingVertical: 14, paddingHorizontal: 16, marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: B.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 6 },
    }),
  },
  tongTienLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  tongTienIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  tongTienLabel: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },
  tongTienPeriod: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  tongTienVal: { fontSize: 15, fontWeight: "900", color: "#fff" },

  miniStatsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  miniStatCard: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: B.white, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: B.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  miniStatIcon: { width: 32, height: 32, borderRadius: 9, justifyContent: "center", alignItems: "center" },
  miniStatLabel: { fontSize: 10, color: B.textSub, fontWeight: "600" },
  miniStatVal: { fontSize: 13, fontWeight: "800", marginTop: 1 },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  emptyText: { fontSize: 12, color: B.textSub, textAlign: "center" },

  // Bác sĩ block
  bsBlock: {
    backgroundColor: B.white, borderRadius: 14, borderWidth: 1, borderColor: B.border,
    marginBottom: 14, overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 7 },
      android: { elevation: 3 },
    }),
  },
  bsHeader: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, backgroundColor: "#FAFAFA",
    borderBottomWidth: 1, borderBottomColor: B.border,
  },
  bsAvatarBox: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: B.primary,
    justifyContent: "center", alignItems: "center",
  },
  bsAvatarTxt: { fontSize: 18, fontWeight: "900", color: "#fff" },
  bsName: { fontSize: 15, fontWeight: "800", color: B.textTitle },
  bsMetaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  bsCountChip: {
    backgroundColor: "#EFF6FF", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  bsCountTxt: { fontSize: 10, fontWeight: "700", color: B.info },
  bsTongTxt: { fontSize: 13, fontWeight: "800", color: B.success },

  bsRows: { paddingHorizontal: 0 },

  // ── Card per thủ thuật (main screen) ──
  ttCard: {
    backgroundColor: B.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  ttCardRow1: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  ttCardSttBox: {
    width: 22, height: 22, borderRadius: 7,
    backgroundColor: "#FEF2F2",
    justifyContent: "center", alignItems: "center",
    marginTop: 2,
  },
  ttCardSttTxt: { fontSize: 10, fontWeight: "800", color: B.primary },
  ttCardName: { fontSize: 13, fontWeight: "800", color: B.textTitle, lineHeight: 18 },
  ttCardMetaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3, flexWrap: "wrap" },
  ttCardMeta: { fontSize: 10, color: B.textSub },
  ttCardDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },
  ttCardTT: { fontSize: 13, fontWeight: "900", color: B.primary, paddingTop: 2 },
  ttCardDiv: { height: 1, backgroundColor: "#F1F5F9" },
  ttCardRow2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 0,
  },
  ttCardStatCell: { flex: 1, alignItems: "center", gap: 2 },
  ttCardStatLabel: {
    fontSize: 9, fontWeight: "600", color: B.textSub,
    textTransform: "uppercase", letterSpacing: 0.3,
  },
  ttCardStatVal: { fontSize: 10, fontWeight: "700", color: B.textTitle, textAlign: "center" },
  ttCardStatSep: { width: 1, height: 26, backgroundColor: "#E2E8F0", marginHorizontal: 2 },

  rowHeader: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FEF2F2", paddingVertical: 7, paddingHorizontal: 10,
  },
  rowTh: { fontSize: 9, fontWeight: "700", color: B.primary, textTransform: "uppercase", letterSpacing: 0.3 },
  dataRow: {
    flexDirection: "row", alignItems: "center",
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
    paddingHorizontal: 10, paddingVertical: 0,
  },
  dataCell: { paddingVertical: 9, paddingHorizontal: 2, justifyContent: "center" },
  sttTxt: { fontSize: 10, fontWeight: "700", color: "#94A3B8" },
  ttName: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  ttMetaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  ttMeta: { fontSize: 10, color: B.textSub },
  ttDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },
  ttBSHHRow: { flexDirection: "row", gap: 6, marginTop: 3 },
  bsChip: { backgroundColor: "#ECFDF5", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  bsChipTxt: { fontSize: 9, fontWeight: "700", color: B.success },
  hhChip: { backgroundColor: "#FFFBEB", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  hhChipTxt: { fontSize: 9, fontWeight: "700", color: B.warning },
  slTxt: { fontSize: 13, fontWeight: "800", color: B.textTitle },
  donGiaTxt: { fontSize: 10, color: B.textSub },
  giamTxt: { fontSize: 10, color: B.danger, fontWeight: "600" },
  giamZero: { fontSize: 10, color: "#CBD5E1" },
  thanhTienTxt: { fontSize: 11, fontWeight: "800", color: B.primary },

  bsFooter: {
    backgroundColor: "#FEF2F2", borderTopWidth: 1.5, borderTopColor: B.primary + "40",
    paddingHorizontal: 10, paddingVertical: 10, gap: 6,
  },
  bsFooterMain: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bsFooterLabel: { fontSize: 12, fontWeight: "700", color: B.primary },
  bsFooterVal: { fontSize: 14, fontWeight: "900", color: B.primary },
  bsFooterSub: { flexDirection: "row", gap: 10 },
  bsChipLarge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 },
  bsChipLargeTxt: { fontSize: 11, fontWeight: "700", color: B.success },
  hhChipLarge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFBEB", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 },
  hhChipLargeTxt: { fontSize: 11, fontWeight: "700", color: B.warning },

  summaryCard: {
    backgroundColor: B.white, borderRadius: 14, borderWidth: 1, borderColor: B.border,
    overflow: "hidden", marginTop: 4,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  summaryHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FEF2F2", paddingHorizontal: 16, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: B.border,
  },
  summaryHeaderTxt: { fontSize: 13, fontWeight: "800", color: B.primary, flex: 1 },
  summaryPeriod: { fontSize: 11, color: B.textSub },
  summaryGrid: {
    flexDirection: "row", flexWrap: "wrap",
  },
  summaryGridCell: {
    width: "50%", padding: 14, gap: 5,
    borderColor: "#E2E8F0",
  },
  summaryGridIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: B.primary + "12",
    justifyContent: "center", alignItems: "center",
    marginBottom: 2,
  },
  summaryGridLabel: {
    fontSize: 10, fontWeight: "600", color: B.textSub,
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  summaryGridVal: {
    fontSize: 13, fontWeight: "900", color: B.textTitle,
  },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  summaryLabel: { fontSize: 13, color: B.textSub, fontWeight: "500" },
  summaryVal: { fontSize: 14, fontWeight: "800" },

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
    backgroundColor: B.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "95%",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 14 },
      android: { elevation: 12 },
    }),
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: B.border, alignSelf: "center", marginTop: 12, marginBottom: 4 },
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
  printTitle: { fontSize: 14, fontWeight: "900", color: B.textTitle, letterSpacing: 0.8, textTransform: "uppercase", textAlign: "center" },
  printPeriodTxt: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  printSecLabel: { fontSize: 11, fontWeight: "800", color: B.primary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  printInfoBox: {
    backgroundColor: B.white, borderRadius: 12, borderWidth: 1, borderColor: B.border,
    overflow: "hidden", marginBottom: 14,
  },
  printInfoRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  printInfoLeft: { flexDirection: "row", alignItems: "center", gap: 6, width: 120 },
  printInfoLabel: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  printInfoVal: { flex: 1, fontSize: 11, color: B.textTitle, fontWeight: "700", textAlign: "right" },

  // Print BS card
  pBsCard: {
    backgroundColor: B.white, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0",
    marginBottom: 14, overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  pBsHeader: {
    flexDirection: "row", alignItems: "flex-start",
    padding: 12, gap: 10, backgroundColor: "#FAFAFA",
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  pBsSttBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: "#FEF2F2", justifyContent: "center", alignItems: "center" },
  pBsSttTxt: { fontSize: 11, fontWeight: "800", color: B.primary },
  pBsName: { fontSize: 13, fontWeight: "800", color: B.textTitle },
  pBsTongVal: { fontSize: 13, fontWeight: "900", color: B.primary },
  pBsMiniTxt: { fontSize: 9, fontWeight: "600" },
  pTblWrap: { overflow: "hidden" },
  pTblHeader: {
    flexDirection: "row", backgroundColor: "#1E3A5F",
    paddingVertical: 7, paddingHorizontal: 10,
  },
  pTh: { fontSize: 9, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  pTblRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  pTd: { fontSize: 10, color: B.textTitle },
  pTtName: { fontSize: 11, fontWeight: "700", color: B.textTitle },
  pTtMeta: { fontSize: 9, color: B.textSub },
  pTblFooter: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FEF2F2", paddingHorizontal: 10, paddingVertical: 9,
    borderTopWidth: 1.5, borderTopColor: B.primary + "40",
  },
  pFooterLabel: { fontSize: 11, fontWeight: "700", color: B.primary },
  pFooterSub: { fontSize: 9, fontWeight: "600" },
  pFooterVal: { fontSize: 13, fontWeight: "900", color: B.primary },

  pGrandWrap: {
    borderRadius: 14, overflow: "hidden", marginBottom: 20,
    borderWidth: 1, borderColor: B.primary + "30",
    ...Platform.select({
      ios: { shadowColor: B.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  pGrandHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 14, paddingVertical: 10,
  },
  pGrandHeaderTxt: { fontSize: 12, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  pGrandGrid: {
    flexDirection: "row", flexWrap: "wrap",
    backgroundColor: B.white,
  },
  pGrandCell: {
    width: "50%", padding: 12, gap: 3,
    borderColor: "#E2E8F0",
  },
  pGrandCellLabel: {
    fontSize: 10, fontWeight: "600", color: B.textSub,
    textTransform: "uppercase", letterSpacing: 0.4,
  },
  pGrandCellVal: { fontSize: 12, fontWeight: "800", color: B.textTitle },
  pGrandTotal: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: B.primary, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13, marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: B.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8 },
      android: { elevation: 5 },
    }),
  },
  pGrandLabel: { fontSize: 12, fontWeight: "700", color: "rgba(255,255,255,0.9)" },
  pGrandSub: { fontSize: 10, fontWeight: "600", color: "rgba(255,255,255,0.75)" },
  pGrandVal: { fontSize: 16, fontWeight: "900", color: "#fff" },

  printSigRow: { flexDirection: "row", gap: 10 },
  printSigBox: { flex: 1, alignItems: "center", gap: 4 },
  printSigTitle: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  printSigSub: { fontSize: 10, color: B.textSub, fontStyle: "italic" },
  printSigLine: { width: "100%", height: 1, backgroundColor: B.border, marginTop: 40 },
});