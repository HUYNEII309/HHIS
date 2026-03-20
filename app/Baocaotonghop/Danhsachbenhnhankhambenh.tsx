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
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );

const fmtDate = (s: string) => {
  if (!s) return "—";
  const parts = s.split("-");
  if (parts.length !== 3) return s;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

interface ThuThuat {
  id: number;
  tenThuThuat: string;
  soLuong: number;
  donGia: number;
  bacSi: string;
}

interface BenhNhan {
  id: number;
  ngayKham: string;
  hoTen: string;
  ngaySinh: string;
  dienThoai: string;
  diaChi: string;
  chanDoan: string;
  thuThuat: ThuThuat[];
}

const SAMPLE: BenhNhan[] = [
  {
    id: 1,
    ngayKham: getCurrentDate(),
    hoTen: "Nguyễn Văn An",
    ngaySinh: "1985-03-15",
    dienThoai: "0912345678",
    diaChi: "Số 12, Đường Trần Hưng Đạo, Hà Nội",
    chanDoan: "Viêm họng cấp tính",
    thuThuat: [
      {
        id: 1,
        tenThuThuat: "Khám bệnh tổng quát",
        soLuong: 1,
        donGia: 150000,
        bacSi: "BS. Nguyễn Minh Tuấn",
      },
      {
        id: 2,
        tenThuThuat: "Xét nghiệm máu cơ bản",
        soLuong: 1,
        donGia: 200000,
        bacSi: "BS. Trần Thị Lan",
      },
    ],
  },
  {
    id: 2,
    ngayKham: getCurrentDate(),
    hoTen: "Trần Thị Bình",
    ngaySinh: "1992-07-22",
    dienThoai: "0987654321",
    diaChi: "Tổ 5, Thôn Đông, Xã Yên Khang, Ý Yên, Nam Định",
    chanDoan: "Tăng huyết áp độ 1",
    thuThuat: [
      {
        id: 3,
        tenThuThuat: "Đo huyết áp",
        soLuong: 2,
        donGia: 30000,
        bacSi: "BS. Nguyễn Minh Tuấn",
      },
      {
        id: 4,
        tenThuThuat: "Khám tim mạch",
        soLuong: 1,
        donGia: 180000,
        bacSi: "BS. Nguyễn Minh Tuấn",
      },
      {
        id: 5,
        tenThuThuat: "Điện tâm đồ (ECG)",
        soLuong: 1,
        donGia: 120000,
        bacSi: "BS. Phạm Văn Hùng",
      },
    ],
  },
  {
    id: 3,
    ngayKham: getCurrentDate(),
    hoTen: "Lê Minh Cường",
    ngaySinh: "1978-11-08",
    dienThoai: "0345678912",
    diaChi: "Phường Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội",
    chanDoan: "Đái tháo đường type 2",
    thuThuat: [
      {
        id: 6,
        tenThuThuat: "Xét nghiệm đường huyết",
        soLuong: 1,
        donGia: 85000,
        bacSi: "BS. Trần Thị Lan",
      },
      {
        id: 7,
        tenThuThuat: "Khám nội tiết",
        soLuong: 1,
        donGia: 200000,
        bacSi: "BS. Trần Thị Lan",
      },
    ],
  },
  {
    id: 4,
    ngayKham: getCurrentDate(),
    hoTen: "Phạm Thu Hà",
    ngaySinh: "2000-05-30",
    dienThoai: "0778899001",
    diaChi: "Số 88, Đường Nguyễn Huệ, TP. Hồ Chí Minh",
    chanDoan: "Viêm dạ dày cấp",
    thuThuat: [
      {
        id: 8,
        tenThuThuat: "Siêu âm ổ bụng",
        soLuong: 1,
        donGia: 250000,
        bacSi: "BS. Phạm Văn Hùng",
      },
      {
        id: 9,
        tenThuThuat: "Nội soi dạ dày",
        soLuong: 1,
        donGia: 450000,
        bacSi: "BS. Phạm Văn Hùng",
      },
      {
        id: 10,
        tenThuThuat: "Xét nghiệm H.pylori",
        soLuong: 1,
        donGia: 150000,
        bacSi: "BS. Trần Thị Lan",
      },
    ],
  },
  {
    id: 5,
    ngayKham: getFirstDayOfMonth(),
    hoTen: "Hoàng Đức Thành",
    ngaySinh: "1965-09-12",
    dienThoai: "0654321987",
    diaChi: "Thị trấn Lâm, Huyện Ý Yên, Nam Định",
    chanDoan: "Viêm phế quản mãn",
    thuThuat: [
      {
        id: 11,
        tenThuThuat: "Chụp X-quang phổi",
        soLuong: 1,
        donGia: 180000,
        bacSi: "BS. Nguyễn Minh Tuấn",
      },
      {
        id: 12,
        tenThuThuat: "Đo chức năng hô hấp",
        soLuong: 1,
        donGia: 220000,
        bacSi: "BS. Nguyễn Minh Tuấn",
      },
    ],
  },
];

export default function Danhsachbenhnhankhambenh() {
  const router = useRouter();
  const [tuNgay, setTuNgay] = useState(getFirstDayOfMonth());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<BenhNhan[]>([]);
  const [searched, setSearched] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [printModalVisible, setPrintModalVisible] = useState(false);

  const doSearch = (tu: string, den: string, kw: string) => {
    const filtered = SAMPLE.filter((p) => {
      const d = p.ngayKham;
      const inRange = d >= tu && d <= den;
      const matchKw =
        kw === "" ||
        p.hoTen.toLowerCase().includes(kw.toLowerCase()) ||
        p.dienThoai.includes(kw) ||
        p.chanDoan.toLowerCase().includes(kw.toLowerCase()) ||
        p.thuThuat.some((t) =>
          t.tenThuThuat.toLowerCase().includes(kw.toLowerCase()),
        );
      return inRange && matchKw;
    });
    setResults(filtered);
    setSearched(true);
    setExpandedIds(new Set(filtered.map((p) => p.id)));
  };

  useEffect(() => {
    doSearch(getFirstDayOfMonth(), getCurrentDate(), "");
  }, []);

  const handleSearch = () => doSearch(tuNgay, denNgay, searchText);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tongTien = results.reduce(
    (s, p) => s + p.thuThuat.reduce((ss, t) => ss + t.soLuong * t.donGia, 0),
    0,
  );
  const tongThuThuat = results.reduce((s, p) => s + p.thuThuat.length, 0);

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
            <Text style={s.headerTitle}>Danh sách bệnh nhân</Text>
            <Text style={s.headerSub}>Lịch sử khám bệnh & thủ thuật</Text>
          </View>
          {searched && results.length > 0 && (
            <TouchableOpacity
              style={s.addBtn}
              onPress={() => setPrintModalVisible(true)}>
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
          <View style={s.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={s.searchInput}
              placeholder="Tìm họ tên, SĐT, chẩn đoán, thủ thuật..."
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
        {searched && results.length > 0 && (
          <>
            <View style={s.statsRow}>
              <View style={[s.statCard, { backgroundColor: "#FEF2F2" }]}>
                <View
                  style={[s.statIcon, { backgroundColor: B.primary + "20" }]}>
                  <Ionicons name="people" size={17} color={B.primary} />
                </View>
                <View>
                  <Text style={[s.statNum, { color: B.primary }]}>
                    {results.length}
                  </Text>
                  <Text style={s.statLabel}>Bệnh nhân</Text>
                </View>
              </View>
              <View style={[s.statCard, { backgroundColor: "#EFF6FF" }]}>
                <View style={[s.statIcon, { backgroundColor: B.info + "20" }]}>
                  <Ionicons name="medical" size={17} color={B.info} />
                </View>
                <View>
                  <Text style={[s.statNum, { color: B.info }]}>
                    {tongThuThuat}
                  </Text>
                  <Text style={s.statLabel}>Thủ thuật</Text>
                </View>
              </View>
            </View>
            {/* Tổng tiền */}
            <View style={s.tongTienCard}>
              <View style={s.tongTienLeft}>
                <View style={s.tongTienIconBox}>
                  <Ionicons name="cash" size={22} color="#fff" />
                </View>
                <View>
                  <Text style={s.tongTienLabel}>Tổng tiền khám bệnh</Text>
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
            <Ionicons name="people-outline" size={56} color={B.border} />
            <Text style={s.emptyTitle}>Không có dữ liệu</Text>
            <Text style={s.emptyText}>
              Không tìm thấy bệnh nhân trong khoảng thời gian này
            </Text>
          </View>
        )}

        {/* ── DANH SÁCH BỆNH NHÂN ── */}
        {searched &&
          results.map((bn) => {
            const exp = expandedIds.has(bn.id);
            const tongBn = bn.thuThuat.reduce(
              (s, t) => s + t.soLuong * t.donGia,
              0,
            );
            return (
              <View key={bn.id} style={s.bnCard}>
                {/* Accent */}
                <View style={s.bnAccent} />
                <View style={s.bnBody}>
                  {/* ── Header: ngày + chevron ── */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(bn.id)}
                    activeOpacity={0.75}
                    style={s.bnTopRow}>
                    <View style={s.ngayBadge}>
                      <Ionicons
                        name="calendar-outline"
                        size={11}
                        color={B.primary}
                      />
                      <Text style={s.ngayBadgeTxt}>{fmtDate(bn.ngayKham)}</Text>
                    </View>
                    <View style={s.thuThuatChip}>
                      <Ionicons
                        name="medical-outline"
                        size={10}
                        color={B.info}
                      />
                      <Text style={s.thuThuatChipTxt}>
                        {bn.thuThuat.length} thủ thuật
                      </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <Text style={s.tongBnTxt}>{fmtMoney(tongBn)}</Text>
                    <Ionicons
                      name={exp ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={B.textSub}
                      style={{ marginLeft: 6 }}
                    />
                  </TouchableOpacity>

                  {/* ── Thông tin bệnh nhân ── */}
                  <View style={s.bnInfoBlock}>
                    {/* Họ tên */}
                    <View style={s.bnNameRow}>
                      <View style={s.bnAvatarBox}>
                        <Text style={s.bnAvatarTxt}>
                          {bn.hoTen.charAt(bn.hoTen.lastIndexOf(" ") + 1)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.bnName}>{bn.hoTen}</Text>
                        <View style={s.bnMetaRow}>
                          <Ionicons
                            name="calendar-outline"
                            size={11}
                            color={B.textSub}
                          />
                          <Text style={s.bnMetaTxt}>
                            {fmtDate(bn.ngaySinh)}
                          </Text>
                          <View style={s.dot} />
                          <Ionicons
                            name="call-outline"
                            size={11}
                            color={B.textSub}
                          />
                          <Text style={s.bnMetaTxt}>{bn.dienThoai}</Text>
                        </View>
                        <View style={s.bnMetaRow}>
                          <Ionicons
                            name="location-outline"
                            size={11}
                            color={B.textSub}
                          />
                          <Text style={s.bnMetaTxtAddr} numberOfLines={1}>
                            {bn.diaChi}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Chẩn đoán */}
                    <View style={s.chanDoanRow}>
                      <View style={s.chanDoanIcon}>
                        <Ionicons
                          name="clipboard-outline"
                          size={12}
                          color={B.warning}
                        />
                      </View>
                      <Text style={s.chanDoanTxt}>{bn.chanDoan}</Text>
                    </View>
                  </View>

                  {/* ── Chi tiết thủ thuật ── */}
                  {exp && (
                    <View style={s.thuThuatWrap}>
                      {/* Header bảng */}
                      <View style={s.ttHeader}>
                        <Text style={[s.ttHeaderTxt, { flex: 1 }]}>
                          Thủ thuật / Dịch vụ
                        </Text>
                        <Text
                          style={[
                            s.ttHeaderTxt,
                            { width: 28, textAlign: "center" },
                          ]}>
                          SL
                        </Text>
                        <Text
                          style={[
                            s.ttHeaderTxt,
                            { width: 80, textAlign: "right" },
                          ]}>
                          Đơn giá
                        </Text>
                        <Text
                          style={[
                            s.ttHeaderTxt,
                            { width: 86, textAlign: "right" },
                          ]}>
                          Thành tiền
                        </Text>
                      </View>

                      {bn.thuThuat.map((tt, idx) => (
                        <View
                          key={tt.id}
                          style={[
                            s.ttRow,
                            idx % 2 !== 0 && { backgroundColor: "#FAFAFA" },
                          ]}>
                          <View style={{ flex: 1 }}>
                            <Text style={s.ttName}>{tt.tenThuThuat}</Text>
                            <View style={s.ttBacSiRow}>
                              <Ionicons
                                name="person-outline"
                                size={9}
                                color={B.success}
                              />
                              <Text style={s.ttBacSiTxt}>{tt.bacSi}</Text>
                            </View>
                          </View>
                          <Text
                            style={[
                              s.ttTd,
                              {
                                width: 28,
                                textAlign: "center",
                                fontWeight: "700",
                              },
                            ]}>
                            {tt.soLuong}
                          </Text>
                          <Text
                            style={[s.ttTd, { width: 80, textAlign: "right" }]}>
                            {fmtMoney(tt.donGia)}
                          </Text>
                          <Text
                            style={[
                              s.ttTd,
                              {
                                width: 86,
                                textAlign: "right",
                                color: B.primary,
                                fontWeight: "800",
                              },
                            ]}>
                            {fmtMoney(tt.soLuong * tt.donGia)}
                          </Text>
                        </View>
                      ))}

                      {/* Tổng bệnh nhân */}
                      <View style={s.ttTongRow}>
                        <Text style={s.ttTongLabel}>
                          Tổng tiền khám ({bn.thuThuat.length} dịch vụ)
                        </Text>
                        <Text style={s.ttTongVal}>{fmtMoney(tongBn)}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}

        {/* Tổng kết */}
        {searched && results.length > 0 && (
          <View style={s.summaryCard}>
            <View style={s.summaryHeader}>
              <Ionicons name="calculator" size={14} color={B.primary} />
              <Text style={s.summaryHeaderTxt}>Tổng kết</Text>
              <Text style={s.summaryPeriod}>
                {fmtDate(tuNgay)} – {fmtDate(denNgay)}
              </Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Số bệnh nhân khám</Text>
              <Text style={[s.summaryVal, { color: B.primary }]}>
                {results.length} người
              </Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Tổng số thủ thuật</Text>
              <Text style={[s.summaryVal, { color: B.info }]}>
                {tongThuThuat} thủ thuật
              </Text>
            </View>
            <View style={[s.summaryRow, { borderBottomWidth: 0 }]}>
              <Text
                style={[
                  s.summaryLabel,
                  { fontWeight: "800", color: B.success },
                ]}>
                Tổng tiền khám bệnh
              </Text>
              <Text style={[s.summaryVal, { color: B.success, fontSize: 16 }]}>
                {fmtMoney(tongTien)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Nút in */}
      {searched && results.length > 0 && (
        <View style={s.fabWrap}>
          <TouchableOpacity
            style={s.fabBtn}
            onPress={() => setPrintModalVisible(true)}>
            <Ionicons name="print-outline" size={18} color="#fff" />
            <Text style={s.fabBtnTxt}>In danh sách bệnh nhân</Text>
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
                <View
                  style={[s.modalHeaderIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="print" size={17} color={B.success} />
                </View>
                <Text style={s.modalTitle}>Danh sách bệnh nhân</Text>
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
              contentContainerStyle={[
                s.modalBodyContent,
                { paddingBottom: 30 },
              ]}>
              {/* Header phòng khám */}
              <View style={s.printClinic}>
                <View style={s.printClinicTop}>
                  <View style={s.printLogoBox}>
                    <Ionicons name="medical" size={24} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.printClinicName}>HHIS MANAGE 2026</Text>
                    <Text style={s.printClinicTagline}>
                      Phần mềm quản lý phòng khám
                    </Text>
                  </View>
                </View>
                <View style={s.printClinicDivider} />
                <View style={s.printClinicBottom}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}>
                    <Ionicons
                      name="location-outline"
                      size={11}
                      color={B.primary}
                    />
                    <Text style={s.printClinicSub}>
                      An Châu Yên Khang · Ý Yên · Nam Định
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}>
                    <Ionicons name="call-outline" size={11} color={B.primary} />
                    <Text style={s.printClinicSub}>0338.300901</Text>
                  </View>
                </View>
              </View>

              {/* Tiêu đề */}
              <View style={s.printTitleBox}>
                <Text style={s.printTitle}>DANH SÁCH BỆNH NHÂN KHÁM BỆNH</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 4,
                  }}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={B.textSub}
                  />
                  <Text style={s.printPeriodTxt}>
                    Từ {fmtDate(tuNgay)} đến {fmtDate(denNgay)}
                  </Text>
                </View>
              </View>

              {/* Tổng quan */}
              <View style={s.printInfoBox}>
                {[
                  {
                    icon: "people-outline",
                    label: "Số bệnh nhân",
                    val: `${results.length} người`,
                    color: B.primary,
                  },
                  {
                    icon: "medical-outline",
                    label: "Tổng thủ thuật",
                    val: `${tongThuThuat} thủ thuật`,
                    color: B.info,
                  },
                  {
                    icon: "cash-outline",
                    label: "Tổng tiền khám bệnh",
                    val: fmtMoney(tongTien),
                    color: B.success,
                  },
                ].map((row, i, arr) => (
                  <View
                    key={row.label}
                    style={[
                      s.printInfoRow,
                      i === arr.length - 1
                        ? { backgroundColor: "#ECFDF5", borderBottomWidth: 0 }
                        : {},
                    ]}>
                    <View style={s.printInfoLeft}>
                      <Ionicons
                        name={row.icon as any}
                        size={12}
                        color={row.color}
                      />
                      <Text
                        style={[
                          s.printInfoLabel,
                          { color: row.color, fontWeight: "700" },
                        ]}>
                        {row.label}
                      </Text>
                    </View>
                    <Text
                      style={[
                        s.printInfoVal,
                        { color: row.color, fontWeight: "800" },
                      ]}>
                      {row.val}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Chi tiết từng bệnh nhân */}
              <Text style={s.printSecLabel}>Chi tiết bệnh nhân</Text>

              {results.map((bn, bnIdx) => {
                const tongBn = bn.thuThuat.reduce(
                  (s, t) => s + t.soLuong * t.donGia,
                  0,
                );
                return (
                  <View key={bn.id} style={s.pBnCard}>
                    {/* Header BN */}
                    <View style={s.pBnHeader}>
                      <View style={s.pBnSttBox}>
                        <Text style={s.pBnSttTxt}>
                          {String(bnIdx + 1).padStart(2, "0")}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.pBnName}>{bn.hoTen}</Text>
                        <View style={s.pBnMetaRow}>
                          <Ionicons
                            name="calendar-outline"
                            size={10}
                            color={B.textSub}
                          />
                          <Text style={s.pBnMeta}>{fmtDate(bn.ngaySinh)}</Text>
                          <View style={s.pDot} />
                          <Ionicons
                            name="call-outline"
                            size={10}
                            color={B.textSub}
                          />
                          <Text style={s.pBnMeta}>{bn.dienThoai}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 2,
                          }}>
                          <Ionicons
                            name="location-outline"
                            size={10}
                            color={B.textSub}
                          />
                          <Text style={[s.pBnMeta, { flexShrink: 1 }]}>
                            {bn.diaChi}
                          </Text>
                        </View>
                      </View>
                      {/* Ngày khám + tổng */}
                      <View style={{ alignItems: "flex-end", gap: 4 }}>
                        <View style={s.pNgayKhamBadge}>
                          <Text style={s.pNgayKhamTxt}>
                            {fmtDate(bn.ngayKham)}
                          </Text>
                        </View>
                        <Text style={s.pTongBnTxt}>{fmtMoney(tongBn)}</Text>
                      </View>
                    </View>

                    {/* Chẩn đoán */}
                    <View style={s.pChanDoanRow}>
                      <Ionicons
                        name="clipboard-outline"
                        size={12}
                        color={B.warning}
                      />
                      <Text style={s.pChanDoanTxt}>{bn.chanDoan}</Text>
                    </View>

                    {/* Bảng thủ thuật */}
                    <View style={s.pTtWrap}>
                      <View style={s.pTtHeader}>
                        <Text style={[s.pTtTh, { flex: 1 }]}>
                          Thủ thuật / Dịch vụ
                        </Text>
                        <Text
                          style={[s.pTtTh, { width: 24, textAlign: "center" }]}>
                          SL
                        </Text>
                        <Text
                          style={[s.pTtTh, { width: 76, textAlign: "right" }]}>
                          Đơn giá
                        </Text>
                        <Text
                          style={[s.pTtTh, { width: 82, textAlign: "right" }]}>
                          Thành tiền
                        </Text>
                      </View>
                      {bn.thuThuat.map((tt, i) => (
                        <View
                          key={tt.id}
                          style={[
                            s.pTtRow,
                            i % 2 !== 0 && { backgroundColor: "#F8FAFC" },
                          ]}>
                          <View style={{ flex: 1 }}>
                            <Text style={s.pTtName}>{tt.tenThuThuat}</Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 3,
                                marginTop: 2,
                              }}>
                              <Ionicons
                                name="person-outline"
                                size={9}
                                color={B.success}
                              />
                              <Text style={s.pTtBacSi}>{tt.bacSi}</Text>
                            </View>
                          </View>
                          <Text
                            style={[
                              s.pTtTd,
                              {
                                width: 24,
                                textAlign: "center",
                                fontWeight: "700",
                              },
                            ]}>
                            {tt.soLuong}
                          </Text>
                          <Text
                            style={[
                              s.pTtTd,
                              { width: 76, textAlign: "right" },
                            ]}>
                            {fmtMoney(tt.donGia)}
                          </Text>
                          <Text
                            style={[
                              s.pTtTd,
                              {
                                width: 82,
                                textAlign: "right",
                                color: B.primary,
                                fontWeight: "800",
                              },
                            ]}>
                            {fmtMoney(tt.soLuong * tt.donGia)}
                          </Text>
                        </View>
                      ))}
                      <View style={s.pTtFooter}>
                        <Text style={s.pTtFooterLabel}>
                          Tổng ({bn.thuThuat.length} dịch vụ)
                        </Text>
                        <Text style={s.pTtFooterVal}>{fmtMoney(tongBn)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Grand total */}
              <View style={s.pGrandTotal}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flex: 1,
                  }}>
                  <Ionicons name="cash" size={16} color="#fff" />
                  <Text style={s.pGrandLabel}>
                    TỔNG CỘNG ({results.length} bệnh nhân · {tongThuThuat} thủ
                    thuật)
                  </Text>
                </View>
                <Text style={s.pGrandVal}>{fmtMoney(tongTien)}</Text>
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
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setPrintModalVisible(false)}>
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
  headerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginTop: 1,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 110 },

  filterCard: {
    backgroundColor: B.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 12,
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
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
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: B.primary,
    borderRadius: 10,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: B.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  searchBtnTxt: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: 12,
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
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statNum: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, color: B.textSub, fontWeight: "500" },

  tongTienCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: B.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: B.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  tongTienLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  tongTienIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  tongTienLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tongTienPeriod: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  tongTienVal: { fontSize: 15, fontWeight: "900", color: "#fff" },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  emptyText: { fontSize: 12, color: B.textSub, textAlign: "center" },

  // Bệnh nhân card
  bnCard: {
    flexDirection: "row",
    backgroundColor: B.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  bnAccent: { width: 5, backgroundColor: B.primary },
  bnBody: { flex: 1, padding: 12, gap: 10 },
  bnTopRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ngayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: B.primary + "25",
  },
  ngayBadgeTxt: { fontSize: 11, fontWeight: "700", color: B.primary },
  thuThuatChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  thuThuatChipTxt: { fontSize: 10, color: B.info, fontWeight: "600" },
  tongBnTxt: { fontSize: 13, fontWeight: "800", color: B.success },

  bnInfoBlock: { gap: 8 },
  bnNameRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bnAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  bnAvatarTxt: { fontSize: 16, fontWeight: "800", color: "#fff" },
  bnName: { fontSize: 15, fontWeight: "800", color: B.textTitle },
  bnMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
    flexWrap: "wrap",
  },
  bnMetaTxt: { fontSize: 11, color: B.textSub },
  bnMetaTxtAddr: { fontSize: 11, color: B.textSub, flex: 1 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },

  chanDoanRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.warning + "40",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chanDoanIcon: { marginTop: 1 },
  chanDoanTxt: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
    lineHeight: 17,
  },

  // Thủ thuật
  thuThuatWrap: { borderTopWidth: 1, borderTopColor: B.border, paddingTop: 8 },
  ttHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 7,
    marginBottom: 3,
  },
  ttHeaderTxt: { fontSize: 10, fontWeight: "700", color: B.primary },
  ttRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  ttName: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  ttBacSiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  ttBacSiTxt: { fontSize: 10, color: B.success, fontWeight: "500" },
  ttTd: { fontSize: 11, color: B.textSub },
  ttTongRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    marginTop: 4,
  },
  ttTongLabel: { fontSize: 11, fontWeight: "600", color: B.textSub },
  ttTongVal: { fontSize: 14, fontWeight: "800", color: B.primary },

  summaryCard: {
    backgroundColor: B.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  summaryHeaderTxt: {
    fontSize: 13,
    fontWeight: "800",
    color: B.primary,
    flex: 1,
  },
  summaryPeriod: { fontSize: 11, color: B.textSub },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  summaryLabel: { fontSize: 13, color: B.textSub, fontWeight: "500" },
  summaryVal: { fontSize: 14, fontWeight: "800" },

  fabWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    paddingTop: 10,
    backgroundColor: B.background,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  fabBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: B.primary,
    borderRadius: 12,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: B.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  fabBtnTxt: { fontSize: 15, fontWeight: "800", color: "#fff" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: B.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "95%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: { elevation: 12 },
    }),
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: B.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
    backgroundColor: B.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: { fontSize: 15, fontWeight: "800", color: B.textTitle },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: { flex: 1 },
  modalBodyContent: { padding: 14 },
  modalFooter: {
    flexDirection: "row",
    padding: 14,
    gap: 10,
    backgroundColor: B.white,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  cancelBtnTxt: { fontSize: 14, fontWeight: "700", color: B.textSub },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
  },
  saveBtnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Print
  printClinic: {
    backgroundColor: B.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 14,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  printClinicTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  printLogoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  printClinicName: { fontSize: 15, fontWeight: "900", color: B.primary },
  printClinicTagline: { fontSize: 10, color: B.textSub, marginTop: 2 },
  printClinicDivider: {
    height: 1,
    backgroundColor: B.border,
    marginHorizontal: 14,
  },
  printClinicBottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 16,
    flexWrap: "wrap",
  },
  printClinicSub: { fontSize: 10, color: B.textSub },
  printTitleBox: { alignItems: "center", marginBottom: 14, gap: 2 },
  printTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: B.textTitle,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textAlign: "center",
  },
  printPeriodTxt: { fontSize: 12, color: B.textSub, fontWeight: "600" },
  printSecLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: B.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  printInfoBox: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginBottom: 14,
  },
  printInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  printInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 130,
  },
  printInfoLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  printInfoVal: {
    flex: 1,
    fontSize: 12,
    color: B.textTitle,
    fontWeight: "700",
    textAlign: "right",
  },

  // Print BN card
  pBnCard: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    overflow: "hidden",
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
  pBnHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    gap: 10,
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pBnSttBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  pBnSttTxt: { fontSize: 11, fontWeight: "800", color: B.primary },
  pBnName: { fontSize: 14, fontWeight: "800", color: B.textTitle },
  pBnMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
    flexWrap: "wrap",
  },
  pBnMeta: { fontSize: 10, color: B.textSub },
  pDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },
  pNgayKhamBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: B.primary + "25",
  },
  pNgayKhamTxt: { fontSize: 11, fontWeight: "700", color: B.primary },
  pTongBnTxt: { fontSize: 13, fontWeight: "900", color: B.success },
  pChanDoanRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  pChanDoanTxt: { flex: 1, fontSize: 12, fontWeight: "600", color: "#92400E" },

  // Print thủ thuật table
  pTtWrap: { overflow: "hidden" },
  pTtHeader: {
    flexDirection: "row",
    backgroundColor: "#1E3A5F",
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  pTtTh: { fontSize: 9, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  pTtRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pTtName: { fontSize: 11, fontWeight: "700", color: B.textTitle },
  pTtBacSi: { fontSize: 9, color: B.success, fontWeight: "500" },
  pTtTd: { fontSize: 10, color: B.textSub, paddingHorizontal: 2 },
  pTtFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1.5,
    borderTopColor: B.primary + "40",
  },
  pTtFooterLabel: { fontSize: 11, fontWeight: "600", color: B.textSub },
  pTtFooterVal: { fontSize: 13, fontWeight: "900", color: B.primary },

  pGrandTotal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: B.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: B.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 5 },
    }),
  },
  pGrandLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    flexShrink: 1,
  },
  pGrandVal: { fontSize: 16, fontWeight: "900", color: "#fff" },

  printSigRow: { flexDirection: "row", gap: 10 },
  printSigBox: { flex: 1, alignItems: "center", gap: 4 },
  printSigTitle: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  printSigSub: { fontSize: 10, color: B.textSub, fontStyle: "italic" },
  printSigLine: {
    width: "100%",
    height: 1,
    backgroundColor: B.border,
    marginTop: 40,
  },
});
