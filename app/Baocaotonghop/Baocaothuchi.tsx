import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [printModalVisible, setPrintModalVisible] = useState(false);

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
    {
      id: 2,
      tenKhoan: "Tiền điện tháng 4",
      nguoiChi: "Kế toán Hạnh 123",
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
      Alert.alert(
        "Thông báo",
        "Định dạng ngày không hợp lệ. Vui lòng nhập YYYY-MM-DD.",
      );
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
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => setPrintModalVisible(true)}>
            <Ionicons name="print-outline" size={20} color="#fff" />
          </TouchableOpacity>
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
            ]}>
            <Text style={[s.summaryLabel, { color: B.success }]}>TỔNG THU</Text>
            <Text style={[s.summaryVal, { color: B.success }]}>
              {fmtMoney(tongThu)}
            </Text>
          </View>

          <View
            style={[
              s.summaryCard,
              { backgroundColor: "#FEF2F2", borderColor: "#EF444430" },
            ]}>
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
            ]}>
            <View style={s.conLaiRow}>
              <Text
                style={[s.summaryLabel, { color: B.info, marginBottom: 0 }]}>
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
          {dataFiltered.thuKhamBenh.length > 0 ? (
            <View>
              {dataFiltered.thuKhamBenh.map((item, idx) => (
                <View key={item.id} style={s.dataItem}>
                  <View style={s.dataItemHeader}>
                    <View style={s.dataItemNum}>
                      <Text style={s.dataItemNumTxt}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dataItemName}>{item.tenBN}</Text>
                      <Text style={s.dataItemSub}>{item.diaChi}</Text>
                    </View>
                    <Text style={s.dataItemDate}>{fmtDate(item.ngay)}</Text>
                  </View>
                  <View style={s.dataItemMoney}>
                    <View style={s.dataMoneyCol}>
                      <Text style={s.dataMoneyLabel}>Tiền mặt</Text>
                      <Text style={[s.dataMoneyVal, { color: B.success }]}>
                        {fmtMoney(item.tienMat)}
                      </Text>
                    </View>
                    <View style={s.dataMoneyCol}>
                      <Text style={s.dataMoneyLabel}>CK</Text>
                      <Text style={[s.dataMoneyVal, { color: B.info }]}>
                        {fmtMoney(item.chuyenKhoan)}
                      </Text>
                    </View>
                    <View
                      style={[
                        s.dataMoneyCol,
                        {
                          borderLeftWidth: 1,
                          borderLeftColor: B.border,
                          paddingLeft: 8,
                        },
                      ]}>
                      <Text style={s.dataMoneyLabel}>Tổng</Text>
                      <Text style={[s.dataMoneyVal, { color: B.primary }]}>
                        {fmtMoney(item.tienMat + item.chuyenKhoan)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
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
          ) : (
            <Text style={s.emptyText}>Không có dữ liệu</Text>
          )}
        </View>

        {/* Thu tiền thuốc */}
        <View style={s.card}>
          <Text style={s.cardTitle}>2. Thu tiền bán thuốc</Text>
          {dataFiltered.thuBanThuoc.length > 0 ? (
            <View>
              {dataFiltered.thuBanThuoc.map((item, idx) => (
                <View key={item.id} style={s.dataItem}>
                  <View style={s.dataItemHeader}>
                    <View style={s.dataItemNum}>
                      <Text style={s.dataItemNumTxt}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dataItemName}>{item.tenBN}</Text>
                      <Text style={s.dataItemSub}>{item.diaChi}</Text>
                    </View>
                    <Text style={s.dataItemDate}>{fmtDate(item.ngay)}</Text>
                  </View>
                  <View style={s.dataItemMoney}>
                    <View style={s.dataMoneyCol}>
                      <Text style={s.dataMoneyLabel}>Tiền mặt</Text>
                      <Text style={[s.dataMoneyVal, { color: B.success }]}>
                        {fmtMoney(item.tienMat)}
                      </Text>
                    </View>
                    <View style={s.dataMoneyCol}>
                      <Text style={s.dataMoneyLabel}>CK</Text>
                      <Text style={[s.dataMoneyVal, { color: B.info }]}>
                        {fmtMoney(item.chuyenKhoan)}
                      </Text>
                    </View>
                    <View
                      style={[
                        s.dataMoneyCol,
                        {
                          borderLeftWidth: 1,
                          borderLeftColor: B.border,
                          paddingLeft: 8,
                        },
                      ]}>
                      <Text style={s.dataMoneyLabel}>Tổng</Text>
                      <Text style={[s.dataMoneyVal, { color: B.primary }]}>
                        {fmtMoney(item.tienMat + item.chuyenKhoan)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
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
          ) : (
            <Text style={s.emptyText}>Không có dữ liệu</Text>
          )}
        </View>

        {/* Thu khác */}
        <View style={s.card}>
          <Text style={s.cardTitle}>3. Khoản thu khác</Text>
          {dataFiltered.thuKhac.length > 0 ? (
            <View>
              {dataFiltered.thuKhac.map((item, idx) => (
                <View key={item.id} style={s.dataItem}>
                  <View style={s.dataItemHeader}>
                    <View style={s.dataItemNum}>
                      <Text style={s.dataItemNumTxt}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dataItemName}>{item.tenKhoan}</Text>
                      <Text style={s.dataItemSub}>{item.nguoiThu}</Text>
                    </View>
                    <Text style={s.dataItemDate}>{fmtDate(item.ngay)}</Text>
                  </View>
                  <View style={s.dataItemMoneySimple}>
                    <Text style={s.dataMoneyLabel}>Số tiền</Text>
                    <Text style={[s.dataMoneyVal, { color: B.success }]}>
                      {fmtMoney(item.soTien)}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={s.cardFooter}>
                <Text style={s.footerTotal}>
                  Tổng thu khác: {fmtMoney(tongThuKhac)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={s.emptyText}>Không có dữ liệu</Text>
          )}
        </View>

        {/* II. KHOẢN CHI */}
        <View style={[s.groupHeader, { marginTop: 10 }]}>
          <View style={[s.groupIcon, { backgroundColor: B.danger }]}>
            <Ionicons name="trending-down" size={16} color="#fff" />
          </View>
          <Text style={[s.groupTitle, { color: B.danger }]}>
            II. CÁC KHOẢN CHI
          </Text>
        </View>

        {/* Chi NCC */}
        <View style={s.card}>
          <Text style={[s.cardTitle, { color: B.danger }]}>
            1. Chi cho nhà cung cấp
          </Text>
          {dataFiltered.chiNCC.length > 0 ? (
            <View>
              {dataFiltered.chiNCC.map((item, idx) => (
                <View key={item.id} style={s.dataItem}>
                  <View style={s.dataItemHeader}>
                    <View style={s.dataItemNum}>
                      <Text style={s.dataItemNumTxt}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dataItemName}>{item.tenNCC}</Text>
                      <Text style={s.dataItemSub}>{item.diaChi}</Text>
                    </View>
                    <Text style={s.dataItemDate}>{fmtDate(item.ngay)}</Text>
                  </View>
                  <View style={s.dataItemMoneySimple}>
                    <Text style={s.dataMoneyLabel}>Số tiền</Text>
                    <Text style={[s.dataMoneyVal, { color: B.danger }]}>
                      {fmtMoney(item.soTien)}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={s.cardFooter}>
                <Text style={[s.footerTotal, { color: B.danger }]}>
                  Tổng chi NCC: {fmtMoney(tongChiNCC)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={s.emptyText}>Không có dữ liệu</Text>
          )}
        </View>

        {/* Chi trả thuốc */}
        <View style={s.card}>
          <Text style={[s.cardTitle, { color: B.danger }]}>
            2. Chi bệnh nhân trả lại thuốc
          </Text>
          {dataFiltered.chiTraThuoc.length > 0 ? (
            <View>
              {dataFiltered.chiTraThuoc.map((item, idx) => (
                <View key={item.id} style={s.dataItem}>
                  <View style={s.dataItemHeader}>
                    <View style={s.dataItemNum}>
                      <Text style={s.dataItemNumTxt}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dataItemName}>{item.tenBN}</Text>
                      <Text style={s.dataItemSub}>{item.nguoiChi}</Text>
                    </View>
                    <Text style={s.dataItemDate}>{fmtDate(item.ngay)}</Text>
                  </View>
                  <View style={s.dataItemMoneySimple}>
                    <Text style={s.dataMoneyLabel}>Số tiền</Text>
                    <Text style={[s.dataMoneyVal, { color: B.danger }]}>
                      {fmtMoney(item.soTien)}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={s.cardFooter}>
                <Text style={[s.footerTotal, { color: B.danger }]}>
                  Tổng chi trả lại: {fmtMoney(tongChiTraThuoc)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={s.emptyText}>Không có dữ liệu</Text>
          )}
        </View>

        {/* Chi khác */}
        <View style={s.card}>
          <Text style={[s.cardTitle, { color: B.danger }]}>
            3. Khoản chi khác
          </Text>
          {dataFiltered.chiKhac.length > 0 ? (
            <View>
              {dataFiltered.chiKhac.map((item, idx) => (
                <View key={item.id} style={s.dataItem}>
                  <View style={s.dataItemHeader}>
                    <View style={s.dataItemNum}>
                      <Text style={s.dataItemNumTxt}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dataItemName}>{item.tenKhoan}</Text>
                      <Text style={s.dataItemSub}>{item.nguoiChi}</Text>
                    </View>
                    <Text style={s.dataItemDate}>{fmtDate(item.ngay)}</Text>
                  </View>
                  <View style={s.dataItemMoneySimple}>
                    <Text style={s.dataMoneyLabel}>Số tiền</Text>
                    <Text style={[s.dataMoneyVal, { color: B.danger }]}>
                      {fmtMoney(item.soTien)}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={s.cardFooter}>
                <Text style={[s.footerTotal, { color: B.danger }]}>
                  Tổng chi khác: {fmtMoney(tongChiKhac)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={s.emptyText}>Không có dữ liệu</Text>
          )}
        </View>
      </ScrollView>

      {/* Nút in */}
      <View style={s.fabWrap}>
        <TouchableOpacity
          style={s.fabBtn}
          onPress={() => setPrintModalVisible(true)}>
          <Ionicons name="print-outline" size={18} color="#fff" />
          <Text style={s.fabBtnTxt}>In báo cáo Thu - Chi</Text>
        </TouchableOpacity>
      </View>

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
                <Text style={s.modalTitle}>Báo cáo Thu - Chi</Text>
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
                <Text style={s.printTitle}>BÁO CÁO THU - CHI</Text>
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
                    icon: "trending-up-outline",
                    label: "Tổng Thu",
                    val: fmtMoney(tongThu),
                    color: B.success,
                  },
                  {
                    icon: "trending-down-outline",
                    label: "Tổng Chi",
                    val: fmtMoney(tongChi),
                    color: B.danger,
                  },
                  {
                    icon: "wallet-outline",
                    label: "Còn lại",
                    val: fmtMoney(conLai),
                    color: B.info,
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

              {/* Chi tiết */}
              <Text style={s.printSecLabel}>Chi tiết báo cáo</Text>

              {/* Thu */}
              <Text style={[s.printSecSubLabel, { color: B.success }]}>
                I. CÁC KHOẢN THU
              </Text>
              {dataFiltered.thuKhamBenh.length > 0 && (
                <View style={s.pDetailCard}>
                  <Text style={s.pDetailTitle}>1. Thu tiền khám bệnh</Text>
                  {dataFiltered.thuKhamBenh.map((item, idx) => (
                    <View key={item.id} style={s.pPrintItem}>
                      <View style={s.pPrintItemRow1}>
                        <Text style={s.pPrintIdx}>{idx + 1}.</Text>
                        <Text style={s.pPrintName}>{item.tenBN}</Text>
                        <Text style={s.pPrintDate}>{fmtDate(item.ngay)}</Text>
                      </View>
                      <View style={s.pPrintItemRow2}>
                        <Text style={s.pPrintAddr}>{item.diaChi}</Text>
                      </View>
                      <View style={s.pPrintItemRow3}>
                        <View style={s.pPrintMoneyBox}>
                          <Text style={s.pPrintMoneyLabel}>Tiền mặt</Text>
                          <Text
                            style={[s.pPrintMoneyVal, { color: B.success }]}>
                            {fmtMoney(item.tienMat)}
                          </Text>
                        </View>
                        <View style={s.pPrintMoneyBox}>
                          <Text style={s.pPrintMoneyLabel}>CK</Text>
                          <Text style={[s.pPrintMoneyVal, { color: B.info }]}>
                            {fmtMoney(item.chuyenKhoan)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  <View style={s.pDetailMoneyBox}>
                    <View style={s.pMoneyItem}>
                      <Text style={s.pMoneyLabel}>Tiền mặt</Text>
                      <Text style={[s.pMoneyVal, { color: B.success }]}>
                        {fmtMoney(tongThuKhamMat)}
                      </Text>
                    </View>
                    <View style={s.pMoneyItem}>
                      <Text style={s.pMoneyLabel}>CK</Text>
                      <Text style={[s.pMoneyVal, { color: B.info }]}>
                        {fmtMoney(tongThuKhamCK)}
                      </Text>
                    </View>
                    <View style={s.pMoneyItem}>
                      <Text style={s.pMoneyLabel}>Tổng</Text>
                      <Text style={[s.pMoneyVal, { color: B.primary }]}>
                        {fmtMoney(tongThuKham)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {dataFiltered.thuBanThuoc.length > 0 && (
                <View style={s.pDetailCard}>
                  <Text style={s.pDetailTitle}>2. Thu tiền bán thuốc</Text>
                  {dataFiltered.thuBanThuoc.map((item, idx) => (
                    <View key={item.id} style={s.pPrintItem}>
                      <View style={s.pPrintItemRow1}>
                        <Text style={s.pPrintIdx}>{idx + 1}.</Text>
                        <Text style={s.pPrintName}>{item.tenBN}</Text>
                        <Text style={s.pPrintDate}>{fmtDate(item.ngay)}</Text>
                      </View>
                      <View style={s.pPrintItemRow2}>
                        <Text style={s.pPrintAddr}>{item.diaChi}</Text>
                      </View>
                      <View style={s.pPrintItemRow3}>
                        <View style={s.pPrintMoneyBox}>
                          <Text style={s.pPrintMoneyLabel}>Tiền mặt</Text>
                          <Text
                            style={[s.pPrintMoneyVal, { color: B.success }]}>
                            {fmtMoney(item.tienMat)}
                          </Text>
                        </View>
                        <View style={s.pPrintMoneyBox}>
                          <Text style={s.pPrintMoneyLabel}>CK</Text>
                          <Text style={[s.pPrintMoneyVal, { color: B.info }]}>
                            {fmtMoney(item.chuyenKhoan)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  <View style={s.pDetailMoneyBox}>
                    <View style={s.pMoneyItem}>
                      <Text style={s.pMoneyLabel}>Tiền mặt</Text>
                      <Text style={[s.pMoneyVal, { color: B.success }]}>
                        {fmtMoney(tongThuThuocMat)}
                      </Text>
                    </View>
                    <View style={s.pMoneyItem}>
                      <Text style={s.pMoneyLabel}>CK</Text>
                      <Text style={[s.pMoneyVal, { color: B.info }]}>
                        {fmtMoney(tongThuThuocCK)}
                      </Text>
                    </View>
                    <View style={s.pMoneyItem}>
                      <Text style={s.pMoneyLabel}>Tổng</Text>
                      <Text style={[s.pMoneyVal, { color: B.primary }]}>
                        {fmtMoney(tongThuThuoc)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {dataFiltered.thuKhac.length > 0 && (
                <View style={s.pDetailCard}>
                  <Text style={s.pDetailTitle}>3. Khoản thu khác</Text>
                  {dataFiltered.thuKhac.map((item, idx) => (
                    <View key={item.id} style={s.pPrintItem}>
                      <View style={s.pPrintItemRow1}>
                        <Text style={s.pPrintIdx}>{idx + 1}.</Text>
                        <Text style={s.pPrintName}>{item.tenKhoan}</Text>
                        <Text style={s.pPrintDate}>{fmtDate(item.ngay)}</Text>
                      </View>
                      <View style={s.pPrintItemRow2}>
                        <Text style={s.pPrintAddr}>{item.nguoiThu}</Text>
                      </View>
                      <View style={s.pPrintItemRow3}>
                        <View style={s.pPrintMoneyBox}>
                          <Text style={s.pPrintMoneyLabel}>Số tiền</Text>
                          <Text
                            style={[s.pPrintMoneyVal, { color: B.success }]}>
                            {fmtMoney(item.soTien)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  <View style={s.pDetailFooter}>
                    <Text style={s.pDetailFooterLabel}>Tổng</Text>
                    <Text style={[s.pDetailFooterVal, { color: B.success }]}>
                      {fmtMoney(tongThuKhac)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Chi */}
              <Text
                style={[
                  s.printSecSubLabel,
                  { color: B.danger, marginTop: 16 },
                ]}>
                II. CÁC KHOẢN CHI
              </Text>
              {dataFiltered.chiNCC.length > 0 && (
                <View style={s.pDetailCard}>
                  <Text style={[s.pDetailTitle, { color: B.danger }]}>
                    1. Chi cho nhà cung cấp
                  </Text>
                  {dataFiltered.chiNCC.map((item, idx) => (
                    <View key={item.id} style={s.pDetailRow}>
                      <Text style={s.pDetailIdx}>{idx + 1}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={s.pDetailName}>{item.tenNCC}</Text>
                        <Text style={s.pDetailSub}>{item.diaChi}</Text>
                      </View>
                      <Text style={[s.pDetailMoney, { color: B.danger }]}>
                        {fmtMoney(item.soTien)}
                      </Text>
                    </View>
                  ))}
                  <View style={s.pDetailFooter}>
                    <Text style={s.pDetailFooterLabel}>Tổng</Text>
                    <Text style={[s.pDetailFooterVal, { color: B.danger }]}>
                      {fmtMoney(tongChiNCC)}
                    </Text>
                  </View>
                </View>
              )}
              {dataFiltered.chiTraThuoc.length > 0 && (
                <View style={s.pDetailCard}>
                  <Text style={[s.pDetailTitle, { color: B.danger }]}>
                    2. Chi bệnh nhân trả lại thuốc
                  </Text>
                  {dataFiltered.chiTraThuoc.map((item, idx) => (
                    <View key={item.id} style={s.pDetailRow}>
                      <Text style={s.pDetailIdx}>{idx + 1}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={s.pDetailName}>{item.tenBN}</Text>
                        <Text style={s.pDetailSub}>{item.nguoiChi}</Text>
                      </View>
                      <Text style={[s.pDetailMoney, { color: B.danger }]}>
                        {fmtMoney(item.soTien)}
                      </Text>
                    </View>
                  ))}
                  <View style={s.pDetailFooter}>
                    <Text style={s.pDetailFooterLabel}>Tổng</Text>
                    <Text style={[s.pDetailFooterVal, { color: B.danger }]}>
                      {fmtMoney(tongChiTraThuoc)}
                    </Text>
                  </View>
                </View>
              )}
              {dataFiltered.chiKhac.length > 0 && (
                <View style={s.pDetailCard}>
                  <Text style={[s.pDetailTitle, { color: B.danger }]}>
                    3. Khoản chi khác
                  </Text>
                  {dataFiltered.chiKhac.map((item, idx) => (
                    <View key={item.id} style={s.pDetailRow}>
                      <Text style={s.pDetailIdx}>{idx + 1}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={s.pDetailName}>{item.tenKhoan}</Text>
                        <Text style={s.pDetailSub}>{item.nguoiChi}</Text>
                      </View>
                      <Text style={[s.pDetailMoney, { color: B.danger }]}>
                        {fmtMoney(item.soTien)}
                      </Text>
                    </View>
                  ))}
                  <View style={s.pDetailFooter}>
                    <Text style={s.pDetailFooterLabel}>Tổng</Text>
                    <Text style={[s.pDetailFooterVal, { color: B.danger }]}>
                      {fmtMoney(tongChiKhac)}
                    </Text>
                  </View>
                </View>
              )}

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

  // Compact Data Display Styles
  dataItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: B.border,
  },
  dataItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dataItemNum: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  dataItemNumTxt: {
    fontSize: 11,
    fontWeight: "800",
    color: B.textSub,
  },
  dataItemName: {
    fontSize: 12,
    fontWeight: "700",
    color: B.textTitle,
  },
  dataItemSub: {
    fontSize: 10,
    color: B.textSub,
    marginTop: 2,
  },
  dataItemDate: {
    fontSize: 10,
    color: B.textSub,
    fontWeight: "600",
  },
  dataItemMoney: {
    flexDirection: "row",
    gap: 8,
  },
  dataMoneyCol: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  dataMoneyLabel: {
    fontSize: 9,
    color: B.textSub,
    fontWeight: "600",
    marginBottom: 2,
  },
  dataMoneyVal: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  dataItemMoneySimple: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 12,
    color: B.textSub,
    textAlign: "center",
    paddingVertical: 20,
    fontStyle: "italic",
  },

  // Print Button & Modal
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "column",
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: B.border,
    marginTop: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: B.textTitle,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: { flex: 1 },
  modalBodyContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnTxt: {
    fontSize: 13,
    fontWeight: "800",
    color: B.textTitle,
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: B.primary,
    borderRadius: 10,
    paddingVertical: 12,
  },
  saveBtnTxt: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
  },

  printClinic: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginBottom: 16,
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
    borderRadius: 10,
    backgroundColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  printClinicName: {
    fontSize: 14,
    fontWeight: "800",
    color: B.textTitle,
  },
  printClinicTagline: {
    fontSize: 11,
    color: B.textSub,
    marginTop: 2,
  },
  printClinicDivider: {
    height: 1,
    backgroundColor: B.border,
  },
  printClinicBottom: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  printClinicSub: {
    fontSize: 10,
    color: B.textSub,
  },

  printTitleBox: {
    alignItems: "center",
    marginBottom: 16,
  },
  printTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: B.textTitle,
    letterSpacing: 0.5,
  },
  printPeriodTxt: {
    fontSize: 11,
    color: B.textSub,
  },

  printInfoBox: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginBottom: 16,
  },
  printInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  printInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  printInfoLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  printInfoVal: {
    fontSize: 12,
    fontWeight: "800",
  },

  printSecLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: B.textTitle,
    marginBottom: 12,
    marginTop: 4,
  },
  printSecSubLabel: {
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  pDetailCard: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginBottom: 12,
  },
  pDetailTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: B.success,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  pDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: B.border,
  },
  pDetailIdx: {
    fontSize: 10,
    fontWeight: "800",
    color: B.textSub,
    minWidth: 18,
  },
  pDetailName: {
    fontSize: 11,
    fontWeight: "700",
    color: B.textTitle,
  },
  pDetailSub: {
    fontSize: 9,
    color: B.textSub,
    marginTop: 2,
  },
  pDetailMoney: {
    fontSize: 11,
    fontWeight: "800",
    minWidth: 80,
    textAlign: "right",
  },
  pDetailFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  pDetailFooterLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: B.textSub,
  },
  pDetailFooterVal: {
    fontSize: 12,
    fontWeight: "900",
  },

  pDetailTableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  pDetailTableCol: {
    fontSize: 9,
    fontWeight: "800",
    color: B.textSub,
    textAlign: "center",
    textTransform: "uppercase",
  },
  pDetailTableRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: B.border,
    alignItems: "center",
  },
  pDetailTableCell: {
    fontSize: 9,
    fontWeight: "600",
    color: B.textTitle,
    textAlign: "center",
  },
  pDetailMoneyBox: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  pMoneyItem: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: B.border,
    alignItems: "center",
  },
  pMoneyLabel: {
    fontSize: 9,
    color: B.textSub,
    marginBottom: 2,
    fontWeight: "600",
  },
  pMoneyVal: {
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },

  // Print Compact Display
  pPrintItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: B.border,
  },
  pPrintItemRow1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  pPrintIdx: {
    fontSize: 9,
    fontWeight: "800",
    color: B.textSub,
    minWidth: 16,
  },
  pPrintName: {
    fontSize: 10,
    fontWeight: "700",
    color: B.textTitle,
    flex: 1,
  },
  pPrintDate: {
    fontSize: 8,
    color: B.textSub,
    fontWeight: "600",
  },
  pPrintItemRow2: {
    marginBottom: 4,
  },
  pPrintAddr: {
    fontSize: 8,
    color: B.textSub,
    marginLeft: 24,
  },
  pPrintItemRow3: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 24,
  },
  pPrintMoneyBox: {
    flex: 1,
    alignItems: "center",
  },
  pPrintMoneyLabel: {
    fontSize: 7,
    color: B.textSub,
    fontWeight: "600",
  },
  pPrintMoneyVal: {
    fontSize: 8,
    fontWeight: "800",
  },

  printSigRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  printSigBox: {
    flex: 1,
    alignItems: "center",
  },
  printSigTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: B.textTitle,
  },
  printSigSub: {
    fontSize: 9,
    color: B.textSub,
    marginTop: 2,
  },
  printSigLine: {
    width: "100%",
    height: 1,
    backgroundColor: B.border,
    marginTop: 24,
  },
});
