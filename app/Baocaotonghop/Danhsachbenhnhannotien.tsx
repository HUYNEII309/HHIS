import React, { useState } from "react";
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

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );

const fmtDate = (s: string) => {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

interface ThuThuat {
  tenThuThuat: string;
  soLuong: number;
  donGia: number;
  giamGia: number;
}

interface BenhNhanNo {
  id: number;
  hoTen: string;
  dienThoai: string;
  diaChi: string;
  ngayKham: string;
  daThu: number;
  danhSachTT: ThuThuat[];
}

const tinhPhaiTra = (tt: ThuThuat[]) =>
  tt.reduce((s, t) => s + t.soLuong * t.donGia, 0);
const tinhGiam = (tt: ThuThuat[]) => tt.reduce((s, t) => s + t.giamGia, 0);
const tinhThanhTien = (tt: ThuThuat[]) =>
  tt.reduce((s, t) => s + t.soLuong * t.donGia - t.giamGia, 0);

const SAMPLE: BenhNhanNo[] = [
  {
    id: 1,
    hoTen: "Nguyễn Văn An",
    dienThoai: "0912345678",
    diaChi: "Xã Yên Khang, Ý Yên, Nam Định",
    ngayKham: getCurrentDate(),
    daThu: 500000,
    danhSachTT: [
      { tenThuThuat: "Khám tổng quát", soLuong: 1, donGia: 200000, giamGia: 0 },
      {
        tenThuThuat: "Nhổ răng khôn",
        soLuong: 1,
        donGia: 800000,
        giamGia: 100000,
      },
      { tenThuThuat: "Chụp X-quang", soLuong: 2, donGia: 80000, giamGia: 0 },
    ],
  },
  {
    id: 2,
    hoTen: "Trần Thị Bình",
    dienThoai: "0987654321",
    diaChi: "Thị trấn Lâm, Ý Yên, Nam Định",
    ngayKham: getCurrentDate(),
    daThu: 300000,
    danhSachTT: [
      { tenThuThuat: "Lấy cao răng", soLuong: 1, donGia: 150000, giamGia: 0 },
      {
        tenThuThuat: "Trám răng Composite",
        soLuong: 2,
        donGia: 350000,
        giamGia: 0,
      },
    ],
  },
  {
    id: 3,
    hoTen: "Lê Văn Cường",
    dienThoai: "0901234567",
    diaChi: "Xã Yên Bằng, Ý Yên, Nam Định",
    ngayKham: getCurrentDate(),
    daThu: 1000000,
    danhSachTT: [
      {
        tenThuThuat: "Nhổ răng khôn nằm ngang",
        soLuong: 1,
        donGia: 1500000,
        giamGia: 200000,
      },
      {
        tenThuThuat: "Chụp CT Cone Beam",
        soLuong: 1,
        donGia: 800000,
        giamGia: 0,
      },
    ],
  },
  {
    id: 4,
    hoTen: "Phạm Thị Dung",
    dienThoai: "0934567890",
    diaChi: "Xã Yên Trị, Ý Yên, Nam Định",
    ngayKham: getCurrentDate(),
    daThu: 0,
    danhSachTT: [
      {
        tenThuThuat: "Khám chuyên khoa răng",
        soLuong: 1,
        donGia: 150000,
        giamGia: 0,
      },
      {
        tenThuThuat: "Chụp X-quang quanh chóp",
        soLuong: 2,
        donGia: 80000,
        giamGia: 50000,
      },
    ],
  },
  {
    id: 5,
    hoTen: "Hoàng Văn Em",
    dienThoai: "0945678901",
    diaChi: "Xã Yên Đồng, Ý Yên, Nam Định",
    ngayKham: getCurrentDate(),
    daThu: 2000000,
    danhSachTT: [
      {
        tenThuThuat: "Nhổ răng khôn mọc thẳng",
        soLuong: 2,
        donGia: 800000,
        giamGia: 0,
      },
      { tenThuThuat: "Cắt lợi trùm", soLuong: 1, donGia: 500000, giamGia: 0 },
      {
        tenThuThuat: "Tư vấn điều trị",
        soLuong: 1,
        donGia: 100000,
        giamGia: 0,
      },
    ],
  },
];

export default function Danhsachbenhnhannotien() {
  const router = useRouter();
  const [data] = useState<BenhNhanNo[]>(SAMPLE);
  const [tuNgay, setTuNgay] = useState(getCurrentDate());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [search, setSearch] = useState("");
  const [printVisible, setPrintVisible] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1]));
// ================== 1. THÊM STATE ==================
const [filterTuNgay, setFilterTuNgay] = useState(tuNgay);
const [filterDenNgay, setFilterDenNgay] = useState(denNgay);
const [filterSearch, setFilterSearch] = useState(search);
  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ================== 2. SỬA FILTER ==================
const filtered = data.filter((bn) => {
  const inDate =
    bn.ngayKham >= filterTuNgay && bn.ngayKham <= filterDenNgay;

  const inSearch =
    filterSearch === "" ||
    bn.hoTen.toLowerCase().includes(filterSearch.toLowerCase()) ||
    bn.dienThoai.includes(filterSearch);

  const conNo = tinhThanhTien(bn.danhSachTT) - bn.daThu;

  return inDate && inSearch && conNo > 0;
});

  const tongPhaiTra = filtered.reduce(
    (s, bn) => s + tinhPhaiTra(bn.danhSachTT),
    0,
  );
  const tongGiam = filtered.reduce((s, bn) => s + tinhGiam(bn.danhSachTT), 0);
  const tongTT = filtered.reduce(
    (s, bn) => s + tinhThanhTien(bn.danhSachTT),
    0,
  );
  const tongDaThu = filtered.reduce((s, bn) => s + bn.daThu, 0);
  const tongConNo = filtered.reduce(
    (s, bn) => s + tinhThanhTien(bn.danhSachTT) - bn.daThu,
    0,
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={B.primary} />

      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Bệnh nhân nợ tiền</Text>
            <Text style={s.headerSub}>Danh sách bệnh nhân còn nợ</Text>
          </View>
          <TouchableOpacity
            style={s.printBtn}
            onPress={() => setPrintVisible(true)}>
            <Ionicons name="print-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}>
        {/* BỘ LỌC */}
        <View style={s.filterCard}>
          <View style={s.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={s.searchInput}
              placeholder="Tìm tên, điện thoại..."
              placeholderTextColor={B.textSub}
              value={search}
              onChangeText={setSearch}
            />
            {search !== "" && (
              <TouchableOpacity onPress={() => setSearch("")}>
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

<View style={s.searchBtnWrap}>
  <TouchableOpacity
    style={[
      s.searchBtn,
      (!tuNgay || !denNgay) && { opacity: 0.5 },
    ]}
    disabled={!tuNgay || !denNgay}
    onPress={() => {
      setFilterTuNgay(tuNgay);
      setFilterDenNgay(denNgay);
      setFilterSearch(search);
    }}
  >
    <Ionicons name="search" size={16} color="#fff" />
    <Text style={s.searchBtnText}>Tìm kiếm</Text>
  </TouchableOpacity>
</View>


        </View>

        {/* STATS */}
        <View style={s.statsGrid}>
          {[
            {
              label: "Phải trả",
              val: tongPhaiTra,
              color: B.primary,
              bg: "#FEF2F2",
            },
            {
              label: "Giảm giá",
              val: -tongGiam,
              color: B.warning,
              bg: "#FFFBEB",
            },
            { label: "Thành tiền", val: tongTT, color: B.info, bg: "#EFF6FF" },
            {
              label: "Đã thu",
              val: tongDaThu,
              color: B.success,
              bg: "#ECFDF5",
            },
          ].map((st) => (
            <View
              key={st.label}
              style={[s.statCell, { backgroundColor: st.bg }]}>
              <Text style={s.statCellLabel}>{st.label}</Text>
              <Text style={[s.statCellVal, { color: st.color }]}>
                {st.val < 0 ? `-${fmtMoney(-st.val)}` : fmtMoney(st.val)}
              </Text>
            </View>
          ))}
        </View>

        {/* Tổng còn nợ nổi bật */}
        <View style={s.conNoBar}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="people-outline" size={15} color={B.danger} />
            <Text style={s.conNoBarLabel}>
              {filtered.length} bệnh nhân còn nợ
            </Text>
          </View>
          <Text style={s.conNoBarVal}>{fmtMoney(tongConNo)}</Text>
        </View>

        {/* DANH SÁCH */}
        {filtered.length === 0 ? (
          <View style={s.emptyBox}>
            <Ionicons
              name="checkmark-circle-outline"
              size={56}
              color={B.success}
            />
            <Text style={s.emptyTitle}>Không có bệnh nhân nợ tiền</Text>
            <Text style={s.emptyText}>Trong khoảng thời gian đã chọn</Text>
          </View>
        ) : (
          <View style={s.listWrap}>
            {filtered.map((bn, idx) => {
              const phaiTra = tinhPhaiTra(bn.danhSachTT);
              const giam = tinhGiam(bn.danhSachTT);
              const thanhTien = tinhThanhTien(bn.danhSachTT);
              const conNo = thanhTien - bn.daThu;
              const exp = expandedIds.has(bn.id);

              return (
                <View key={bn.id} style={s.bnCard}>
                  <View style={s.bnAccent} />
                  <View style={s.bnBody}>
                    {/* Header: STT + tên + chevron */}
                    <TouchableOpacity
                      style={s.bnHeader}
                      onPress={() => toggleExpand(bn.id)}
                      activeOpacity={0.75}>
                      <View style={s.sttBox}>
                        <Text style={s.sttTxt}>
                          {String(idx + 1).padStart(2, "0")}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.bnName}>{bn.hoTen}</Text>
                        <View style={s.bnMeta}>
                          <Ionicons
                            name="call-outline"
                            size={11}
                            color={B.textSub}
                          />
                          <Text style={s.bnMetaTxt}>{bn.dienThoai}</Text>
                          <View style={s.dot} />
                          <Ionicons
                            name="calendar-outline"
                            size={11}
                            color={B.textSub}
                          />
                          <Text style={s.bnMetaTxt}>
                            {fmtDate(bn.ngayKham)}
                          </Text>
                        </View>
                      </View>
                      {/* Badge còn nợ */}
                      <View style={s.conNoBadge}>
                        <Text style={s.conNoBadgeLbl}>Còn nợ</Text>
                        <Text style={s.conNoBadgeVal}>{fmtMoney(conNo)}</Text>
                      </View>
                      <Ionicons
                        name={exp ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={B.textSub}
                        style={{ marginLeft: 6 }}
                      />
                    </TouchableOpacity>

                    {/* Chi tiết thủ thuật — expand */}
                    {exp && (
                      <View style={s.ttWrap}>
                        {/* Header bảng */}
                        <View style={s.ttTblHeader}>
                          <Text style={[s.ttTh, { flex: 2.4 }]}>Thủ thuật</Text>
                          <Text
                            style={[
                              s.ttTh,
                              { flex: 0.5, textAlign: "center" },
                            ]}>
                            SL
                          </Text>
                          <Text
                            style={[s.ttTh, { flex: 1.2, textAlign: "right" }]}>
                            Phải trả
                          </Text>
                          <Text
                            style={[s.ttTh, { flex: 1.0, textAlign: "right" }]}>
                            Giảm
                          </Text>
                          <Text
                            style={[s.ttTh, { flex: 1.2, textAlign: "right" }]}>
                            T.Tiền
                          </Text>
                        </View>

                        {bn.danhSachTT.map((tt, i) => {
                          const ttPT = tt.soLuong * tt.donGia;
                          const ttTT = ttPT - tt.giamGia;
                          return (
                            <View
                              key={i}
                              style={[
                                s.ttRow,
                                i % 2 !== 0 && { backgroundColor: "#FAFAFA" },
                              ]}>
                              <Text
                                style={[s.ttTd, { flex: 2.4 }]}
                                numberOfLines={1}>
                                {tt.tenThuThuat}
                              </Text>
                              <Text
                                style={[
                                  s.ttTd,
                                  {
                                    flex: 0.5,
                                    textAlign: "center",
                                    color: B.info,
                                  },
                                ]}>
                                {tt.soLuong}
                              </Text>
                              <Text
                                style={[
                                  s.ttTd,
                                  { flex: 1.2, textAlign: "right" },
                                ]}>
                                {fmtMoney(ttPT)}
                              </Text>
                              <Text
                                style={[
                                  s.ttTd,
                                  {
                                    flex: 1.0,
                                    textAlign: "right",
                                    color:
                                      tt.giamGia > 0 ? B.warning : B.border,
                                  },
                                ]}>
                                {tt.giamGia > 0 ? fmtMoney(tt.giamGia) : "—"}
                              </Text>
                              <Text
                                style={[
                                  s.ttTd,
                                  {
                                    flex: 1.2,
                                    textAlign: "right",
                                    color: B.primary,
                                    fontWeight: "700",
                                  },
                                ]}>
                                {fmtMoney(ttTT)}
                              </Text>
                            </View>
                          );
                        })}

                        {/* Tổng hàng BN */}
                        <View style={s.bnPaySummary}>
                          <View style={s.bnPayCell}>
                            <Text style={s.bnPayLbl}>Phải trả</Text>
                            <Text style={s.bnPayVal}>{fmtMoney(phaiTra)}</Text>
                          </View>
                          <View style={s.bnPaySep} />
                          <View style={s.bnPayCell}>
                            <Text style={s.bnPayLbl}>Giảm giá</Text>
                            <Text
                              style={[
                                s.bnPayVal,
                                { color: giam > 0 ? B.warning : B.border },
                              ]}>
                              {giam > 0 ? `-${fmtMoney(giam)}` : "—"}
                            </Text>
                          </View>
                          <View style={s.bnPaySep} />
                          <View style={s.bnPayCell}>
                            <Text style={s.bnPayLbl}>Thành tiền</Text>
                            <Text style={[s.bnPayVal, { color: B.primary }]}>
                              {fmtMoney(thanhTien)}
                            </Text>
                          </View>
                          <View style={s.bnPaySep} />
                          <View style={s.bnPayCell}>
                            <Text style={s.bnPayLbl}>Đã thu</Text>
                            <Text style={[s.bnPayVal, { color: B.success }]}>
                              {fmtMoney(bn.daThu)}
                            </Text>
                          </View>
                          <View style={s.bnPaySep} />
                          <View
                            style={[
                              s.bnPayCell,
                              { backgroundColor: "#FFF0F0" },
                            ]}>
                            <Text style={[s.bnPayLbl, { color: B.danger }]}>
                              Còn nợ
                            </Text>
                            <Text
                              style={[
                                s.bnPayVal,
                                { color: B.danger, fontWeight: "900" },
                              ]}>
                              {fmtMoney(conNo)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Tổng kết */}
            <View style={s.summaryBox}>
              <View style={s.summaryHeader}>
                <Ionicons
                  name="calculator-outline"
                  size={14}
                  color={B.primary}
                />
                <Text style={s.summaryHeaderTxt}>
                  Tổng kết — {filtered.length} bệnh nhân
                </Text>
              </View>
              <View style={s.summaryGrid}>
                {[
                  {
                    label: "Phải trả",
                    val: tongPhaiTra,
                    color: B.primary,
                    bg: "#FEF2F2",
                  },
                  {
                    label: "Giảm giá",
                    val: -tongGiam,
                    color: B.warning,
                    bg: "#FFFBEB",
                  },
                  {
                    label: "Thành tiền",
                    val: tongTT,
                    color: B.info,
                    bg: "#EFF6FF",
                  },
                  {
                    label: "Đã thu",
                    val: tongDaThu,
                    color: B.success,
                    bg: "#ECFDF5",
                  },
                ].map((c) => (
                  <View
                    key={c.label}
                    style={[s.summaryCell, { backgroundColor: c.bg }]}>
                    <Text style={s.summaryCellLbl}>{c.label}</Text>
                    <Text style={[s.summaryCellVal, { color: c.color }]}>
                      {c.val < 0 ? `-${fmtMoney(-c.val)}` : fmtMoney(c.val)}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={s.summaryConNo}>
                <Text style={s.summaryConNoLbl}>Tổng còn nợ</Text>
                <Text style={s.summaryConNoVal}>{fmtMoney(tongConNo)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

{/* Nút in danh sách bệnh nhân nợ tiền - LUÔN HIỂN THỊ bên dưới */}
      <View style={s.fabWrap}>
        <TouchableOpacity
          style={s.fabBtn}
          onPress={() => setPrintVisible(true)}
        >
          <Ionicons name="print-outline" size={18} color="#fff" />
          <Text style={s.fabBtnTxt}>In danh sách bệnh nhân nợ tiền</Text>
        </TouchableOpacity>
      </View>

      {/* ── MODAL IN ── */}
      <Modal
        visible={printVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPrintVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <View style={s.modalHeaderLeft}>
                <View
                  style={[s.modalHeaderIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="print" size={17} color={B.success} />
                </View>
                <Text style={s.modalTitle}>In danh sách nợ tiền</Text>
              </View>
              <TouchableOpacity
                onPress={() => setPrintVisible(false)}
                style={s.closeBtn}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={s.modalBody}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 14, paddingBottom: 30 }}>
              {/* Phòng khám */}
              <View style={s.printClinic}>
                <View style={s.printClinicTop}>
                  <View style={s.printLogoBox}>
                    <Ionicons name="medical" size={24} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.printClinicName}>HHIS MANAGE 2026</Text>
                    <Text style={s.printClinicSub}>
                      Phần mềm quản lý phòng khám
                    </Text>
                  </View>
                </View>
                <View style={s.printClinicDivider} />
                <View style={s.printClinicBottom}>
                  <View style={s.printClinicItem}>
                    <Ionicons
                      name="location-outline"
                      size={11}
                      color={B.primary}
                    />
                    <Text style={s.printClinicAddr}>
                      An Châu Yên Khang · Ý Yên · Nam Định
                    </Text>
                  </View>
                  <View style={s.printClinicItem}>
                    <Ionicons name="call-outline" size={11} color={B.primary} />
                    <Text style={s.printClinicAddr}>0338.300901</Text>
                  </View>
                </View>
              </View>

              {/* Tiêu đề */}
              <View style={s.printTitleBox}>
                <Text style={s.printTitle}>DANH SÁCH BỆNH NHÂN NỢ TIỀN</Text>
                <View style={s.printTitleMeta}>
                  <View style={s.printTitleMetaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={11}
                      color={B.textSub}
                    />
                    <Text style={s.printTitleMetaTxt}>
                      {fmtDate(tuNgay)} — {fmtDate(denNgay)}
                    </Text>
                  </View>
                  <View
                    style={[
                      s.printTitleMetaItem,
                      {
                        backgroundColor: "#FFF0F0",
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      },
                    ]}>
                    <Ionicons
                      name="people-outline"
                      size={11}
                      color={B.danger}
                    />
                    <Text
                      style={[
                        s.printTitleMetaTxt,
                        { color: B.danger, fontWeight: "800" },
                      ]}>
                      {filtered.length} BN · Nợ: {fmtMoney(tongConNo)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Danh sách */}
              {filtered.map((bn, idx) => {
                const phaiTra = tinhPhaiTra(bn.danhSachTT);
                const giam = tinhGiam(bn.danhSachTT);
                const thanhTien = tinhThanhTien(bn.danhSachTT);
                const conNo = thanhTien - bn.daThu;
                return (
                  <View key={bn.id} style={s.printCard}>
                    {/* Header BN */}
                    <View style={s.printCardHead}>
                      <View style={s.printSttBox}>
                        <Text style={s.printSttTxt}>{idx + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.printBnName}>{bn.hoTen}</Text>
                        <Text style={s.printBnMeta}>
                          {bn.dienThoai} · {fmtDate(bn.ngayKham)}
                        </Text>
                      </View>
                      <View style={s.printConNoBadge}>
                        <Text style={s.printConNoBadgeLbl}>Còn nợ</Text>
                        <Text style={s.printConNoBadgeVal}>
                          {fmtMoney(conNo)}
                        </Text>
                      </View>
                    </View>

                    {/* Bảng thủ thuật */}
                    <View style={s.printTtTable}>
                      <View style={s.printTtHeader}>
                        <Text style={[s.printTtTh, { flex: 2.2 }]}>
                          Thủ thuật / dịch vụ
                        </Text>
                        <Text
                          style={[
                            s.printTtTh,
                            { flex: 0.45, textAlign: "center" },
                          ]}>
                          SL
                        </Text>
                        <Text
                          style={[
                            s.printTtTh,
                            { flex: 1.1, textAlign: "right" },
                          ]}>
                          Phải trả
                        </Text>
                        <Text
                          style={[
                            s.printTtTh,
                            { flex: 0.9, textAlign: "right" },
                          ]}>
                          Giảm
                        </Text>
                        <Text
                          style={[
                            s.printTtTh,
                            { flex: 1.1, textAlign: "right" },
                          ]}>
                          T.Tiền
                        </Text>
                      </View>
                      {bn.danhSachTT.map((tt, i) => {
                        const ttPT = tt.soLuong * tt.donGia;
                        const ttTT = ttPT - tt.giamGia;
                        return (
                          <View
                            key={i}
                            style={[
                              s.printTtRow,
                              i % 2 !== 0 && { backgroundColor: "#FAFAFA" },
                            ]}>
                            <Text
                              style={[s.printTtTd, { flex: 2.2 }]}
                              numberOfLines={2}>
                              {tt.tenThuThuat}
                            </Text>
                            <Text
                              style={[
                                s.printTtTd,
                                {
                                  flex: 0.45,
                                  textAlign: "center",
                                  color: B.info,
                                },
                              ]}>
                              {tt.soLuong}
                            </Text>
                            <Text
                              style={[
                                s.printTtTd,
                                { flex: 1.1, textAlign: "right" },
                              ]}>
                              {fmtMoney(ttPT)}
                            </Text>
                            <Text
                              style={[
                                s.printTtTd,
                                {
                                  flex: 0.9,
                                  textAlign: "right",
                                  color: tt.giamGia > 0 ? B.warning : B.border,
                                },
                              ]}>
                              {tt.giamGia > 0 ? fmtMoney(tt.giamGia) : "—"}
                            </Text>
                            <Text
                              style={[
                                s.printTtTd,
                                {
                                  flex: 1.1,
                                  textAlign: "right",
                                  color: B.primary,
                                  fontWeight: "700",
                                },
                              ]}>
                              {fmtMoney(ttTT)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {/* Tổng BN */}
                    <View style={s.printBnTotal}>
                      <View style={s.printBnTotalCell}>
                        <Text style={s.printBnTotalLbl}>Thành tiền</Text>
                        <Text style={[s.printBnTotalVal, { color: B.primary }]}>
                          {fmtMoney(thanhTien)}
                        </Text>
                      </View>
                      <View style={s.printBnTotalSep} />
                      <View style={s.printBnTotalCell}>
                        <Text style={s.printBnTotalLbl}>Đã thu</Text>
                        <Text style={[s.printBnTotalVal, { color: B.success }]}>
                          {fmtMoney(bn.daThu)}
                        </Text>
                      </View>
                      <View style={s.printBnTotalSep} />
                      <View
                        style={[
                          s.printBnTotalCell,
                          { backgroundColor: "#FFF0F0" },
                        ]}>
                        <Text style={[s.printBnTotalLbl, { color: B.danger }]}>
                          Còn nợ
                        </Text>
                        <Text
                          style={[
                            s.printBnTotalVal,
                            { color: B.danger, fontWeight: "900" },
                          ]}>
                          {fmtMoney(conNo)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Tổng kết */}
              <View style={s.printTotalBox}>
                <View style={s.printTotalHeader}>
                  <Ionicons
                    name="calculator-outline"
                    size={12}
                    color={B.primary}
                  />
                  <Text style={s.printTotalHeaderTxt}>
                    TỔNG KẾT TOÀN DANH SÁCH
                  </Text>
                </View>
                <View style={s.printTotalGrid}>
                  {[
                    {
                      label: "Tổng phải trả",
                      val: tongPhaiTra,
                      color: B.primary,
                      bg: "#FEF2F2",
                    },
                    {
                      label: "Tổng giảm giá",
                      val: tongGiam,
                      color: B.warning,
                      bg: "#FFFBEB",
                    },
                    {
                      label: "Tổng thành tiền",
                      val: tongTT,
                      color: B.info,
                      bg: "#EFF6FF",
                    },
                    {
                      label: "Tổng đã thu",
                      val: tongDaThu,
                      color: B.success,
                      bg: "#ECFDF5",
                    },
                  ].map((c) => (
                    <View
                      key={c.label}
                      style={[s.printTotalCell, { backgroundColor: c.bg }]}>
                      <Text style={s.printTotalCellLbl}>{c.label}</Text>
                      <Text style={[s.printTotalCellVal, { color: c.color }]}>
                        {fmtMoney(c.val)}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={s.printConNoRow}>
                  <View>
                    <Text style={s.printConNoLbl}>Tổng còn nợ</Text>
                    <Text style={s.printConNoSub}>
                      Cần thu từ {filtered.length} bệnh nhân
                    </Text>
                  </View>
                  <Text style={s.printConNoVal}>{fmtMoney(tongConNo)}</Text>
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
                  <Text style={s.printSigTitle}>Trưởng phòng</Text>
                  <Text style={s.printSigSub}>(Ký, ghi rõ họ tên)</Text>
                  <View style={s.printSigLine} />
                </View>
              </View>
            </ScrollView>

            <View style={s.modalFooter}>
              <TouchableOpacity
                style={s.footerBtnCancel}
                onPress={() => setPrintVisible(false)}>
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color={B.textSub}
                />
                <Text style={s.footerBtnCancelTxt}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.footerBtnSave,
                  { backgroundColor: B.success, flex: 2 },
                ]}
                onPress={() => setPrintVisible(false)}>
                <Ionicons name="print" size={18} color="#fff" />
                <Text style={s.footerBtnTxt}>In danh sách</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  // ================== NÚT IN LUÔN HIỂN THỊ BÊN DƯỚI ==================
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
  fabBtnTxt: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },


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
  printBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 40 },

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

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  statCell: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: B.border,
    gap: 3,
  },
  statCellLabel: {
    fontSize: 10,
    color: B.textSub,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statCellVal: { fontSize: 13, fontWeight: "800" },

  conNoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.danger + "30",
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 12,
  },
  conNoBarLabel: { fontSize: 13, fontWeight: "700", color: B.danger },
  conNoBarVal: { fontSize: 17, fontWeight: "900", color: B.danger },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  emptyText: { fontSize: 12, color: B.textSub },

  listWrap: { gap: 10 },

  bnCard: {
    flexDirection: "row",
    backgroundColor: B.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
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
  bnAccent: { width: 5, backgroundColor: B.danger },
  bnBody: { flex: 1 },

  bnHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  sttBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: B.danger + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  sttTxt: { fontSize: 11, fontWeight: "800", color: B.danger },
  bnName: {
    fontSize: 14,
    fontWeight: "800",
    color: B.textTitle,
    marginBottom: 2,
  },
  bnMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  bnMetaTxt: { fontSize: 11, color: B.textSub },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },
  conNoBadge: { alignItems: "flex-end" },
  conNoBadgeLbl: {
    fontSize: 9,
    color: B.danger,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  conNoBadgeVal: { fontSize: 14, fontWeight: "900", color: B.danger },

  ttWrap: { borderTopWidth: 1, borderTopColor: B.border },
  ttTblHeader: {
    flexDirection: "row",
    backgroundColor: B.primary,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  ttTh: { fontSize: 9, fontWeight: "700", color: "#fff" },
  ttRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: B.white,
  },
  ttTd: { fontSize: 11, color: B.textTitle },

  bnPaySummary: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: B.border,
    overflow: "hidden",
  },
  bnPayCell: { flex: 1, alignItems: "center", paddingVertical: 8 },
  bnPaySep: { width: 1, backgroundColor: B.border },
  bnPayLbl: {
    fontSize: 8,
    color: B.textSub,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  bnPayVal: { fontSize: 10, fontWeight: "700", color: B.textTitle },

  summaryBox: {
    backgroundColor: B.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: B.danger + "40",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#FEF2F2",
    borderBottomWidth: 1,
    borderBottomColor: B.danger + "20",
  },
  summaryHeaderTxt: { fontSize: 13, fontWeight: "700", color: B.primary },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap" },
  summaryCell: {
    flex: 1,
    minWidth: "50%",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: B.border,
  },
  summaryCellLbl: {
    fontSize: 9,
    color: B.textSub,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  summaryCellVal: { fontSize: 12, fontWeight: "800" },
  summaryConNo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: B.danger + "20",
  },
  summaryConNoLbl: { fontSize: 13, fontWeight: "800", color: B.danger },
  summaryConNoVal: { fontSize: 18, fontWeight: "900", color: B.danger },

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
    minHeight: "85%",
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
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: B.textTitle },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: { flex: 1 },
  modalFooter: {
    flexDirection: "row",
    padding: 14,
    gap: 8,
    backgroundColor: B.white,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  footerBtnCancel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: B.border,
  },
  footerBtnCancelTxt: { fontSize: 13, fontWeight: "700", color: B.textSub },
  footerBtnSave: {
    flex: 1.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: B.primary,
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
  footerBtnTxt: { fontSize: 13, fontWeight: "800", color: "#fff" },

  // Print
  printClinic: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 12,
    overflow: "hidden",
  },
  printClinicTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
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
  printClinicSub: { fontSize: 11, color: B.textSub, marginTop: 2 },
  printClinicDivider: {
    height: 1,
    backgroundColor: B.border,
    marginHorizontal: 12,
  },
  printClinicBottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 14,
  },
  printClinicItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  printClinicAddr: { fontSize: 11, color: B.textSub },

  printTitleBox: { alignItems: "center", gap: 8, marginBottom: 12 },
  printTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: B.textTitle,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  printTitleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  printTitleMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  printTitleMetaTxt: { fontSize: 11, color: B.textSub },

  // Print patient cards
  printCard: {
    backgroundColor: B.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 10,
    overflow: "hidden",
  },
  printCardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    backgroundColor: "#FEF2F2",
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  printSttBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: B.danger + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  printSttTxt: { fontSize: 11, fontWeight: "800", color: B.danger },
  printBnName: { fontSize: 13, fontWeight: "800", color: B.textTitle },
  printBnMeta: { fontSize: 10, color: B.textSub, marginTop: 1 },
  printConNoBadge: { alignItems: "flex-end" },
  printConNoBadgeLbl: {
    fontSize: 8,
    color: B.danger,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  printConNoBadgeVal: { fontSize: 13, fontWeight: "900", color: B.danger },

  printTtTable: {},
  printTtHeader: {
    flexDirection: "row",
    backgroundColor: B.primary + "E0",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  printTtTh: { fontSize: 9, fontWeight: "700", color: "#fff" },
  printTtRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: B.white,
  },
  printTtTd: { fontSize: 10, color: B.textTitle },

  printBnTotal: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: B.border,
    overflow: "hidden",
  },
  printBnTotalCell: { flex: 1, alignItems: "center", paddingVertical: 8 },
  printBnTotalSep: { width: 1, backgroundColor: B.border },
  printBnTotalLbl: {
    fontSize: 8,
    color: B.textSub,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  printBnTotalVal: { fontSize: 11, fontWeight: "700", color: B.textTitle },

  printTotalBox: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginBottom: 18,
  },
  printTotalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    backgroundColor: "#FEF2F2",
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  printTotalHeaderTxt: {
    fontSize: 11,
    fontWeight: "800",
    color: B.primary,
    letterSpacing: 0.5,
  },
  printTotalGrid: { flexDirection: "row", flexWrap: "wrap" },
  printTotalCell: {
    flex: 1,
    minWidth: "50%",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: B.border,
  },
  printTotalCellLbl: {
    fontSize: 9,
    color: B.textSub,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  printTotalCellVal: { fontSize: 12, fontWeight: "800" },
  printConNoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: B.danger + "30",
  },
  printConNoLbl: { fontSize: 13, fontWeight: "800", color: B.danger },
  printConNoSub: { fontSize: 10, color: B.danger + "90", marginTop: 2 },
  printConNoVal: { fontSize: 20, fontWeight: "900", color: B.danger },

  printSigRow: { flexDirection: "row", gap: 16 },
  printSigBox: { flex: 1, alignItems: "center", gap: 4 },
  printSigTitle: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  printSigSub: { fontSize: 10, color: B.textSub, fontStyle: "italic" },
  printSigLine: {
    width: "100%",
    height: 1,
    backgroundColor: B.border,
    marginTop: 38,
  },
  // ================== 4. THÊM STYLE ==================
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
});
