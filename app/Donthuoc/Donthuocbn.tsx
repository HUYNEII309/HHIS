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

interface Thuoc {
  id: number;
  tenThuoc: string;
  soLuong: number;
  donVi: string;
  donGia: number;
  huongDan: string;
}

interface DonThuoc {
  id: number;
  ngayKeDon: string;
  tenBenhNhan: string;
  dienThoai: string;
  diaChi: string;
  bacSi: string;
  chuanDoan: string;
  danhSachThuoc: Thuoc[];
  trangThai: "moi" | "dalay" | "huy";
}

const SAMPLE_DATA: DonThuoc[] = [
  {
    id: 1,
    ngayKeDon: "2026-03-20",
    tenBenhNhan: "Nguyễn Văn An",
    dienThoai: "0901234567",
    diaChi: "123 Trần Phú, Hà Nội",
    bacSi: "BS. Nguyễn Thị Hoa",
    chuanDoan: "Viêm lợi mãn tính",
    trangThai: "moi",
    danhSachThuoc: [
      {
        id: 1,
        tenThuoc: "Amoxicillin 500mg",
        soLuong: 21,
        donVi: "viên",
        donGia: 5000,
        huongDan: "Uống 3 lần/ngày, sau ăn, mỗi lần 1 viên",
      },
      {
        id: 2,
        tenThuoc: "Paracetamol 500mg",
        soLuong: 10,
        donVi: "viên",
        donGia: 2000,
        huongDan: "Uống khi đau, cách nhau tối thiểu 4 giờ",
      },
      {
        id: 3,
        tenThuoc: "Nước muối sinh lý NaCl 0.9%",
        soLuong: 2,
        donVi: "chai",
        donGia: 15000,
        huongDan: "Súc miệng 3-4 lần/ngày sau ăn",
      },
    ],
  },
  {
    id: 2,
    ngayKeDon: "2026-03-20",
    tenBenhNhan: "Trần Thị Bình",
    dienThoai: "0912345678",
    diaChi: "45 Lê Lợi, Nam Định",
    bacSi: "BS. Trần Văn Bộ",
    chuanDoan: "Sâu răng số 6, viêm tủy",
    trangThai: "dalay",
    danhSachThuoc: [
      {
        id: 4,
        tenThuoc: "Metronidazole 250mg",
        soLuong: 14,
        donVi: "viên",
        donGia: 3500,
        huongDan: "Uống 2 lần/ngày, sau ăn sáng và tối",
      },
      {
        id: 5,
        tenThuoc: "Ibuprofen 400mg",
        soLuong: 10,
        donVi: "viên",
        donGia: 4000,
        huongDan: "Uống khi đau, không quá 3 lần/ngày",
      },
    ],
  },
  {
    id: 3,
    ngayKeDon: "2026-03-19",
    tenBenhNhan: "Lê Minh Cường",
    dienThoai: "0923456789",
    diaChi: "78 Nguyễn Huệ, TP. HCM",
    bacSi: "BS. Nguyễn Thị Hoa",
    chuanDoan: "Nhổ răng khôn hàm dưới",
    trangThai: "dalay",
    danhSachThuoc: [
      {
        id: 6,
        tenThuoc: "Amoxicillin + Clavulanic 625mg",
        soLuong: 14,
        donVi: "viên",
        donGia: 18000,
        huongDan: "Uống 2 lần/ngày, sáng và tối sau ăn",
      },
      {
        id: 7,
        tenThuoc: "Dexamethasone 0.5mg",
        soLuong: 6,
        donVi: "viên",
        donGia: 3000,
        huongDan: "Uống 2 viên/lần, 3 lần trong ngày đầu",
      },
      {
        id: 8,
        tenThuoc: "Paracetamol 500mg",
        soLuong: 15,
        donVi: "viên",
        donGia: 2000,
        huongDan: "Uống khi đau, cách 4-6 giờ/lần",
      },
    ],
  },
  {
    id: 4,
    ngayKeDon: "2026-03-18",
    tenBenhNhan: "Phạm Thị Dung",
    dienThoai: "0934567890",
    diaChi: "12 Hoàng Diệu, Đà Nẵng",
    bacSi: "BS. Trần Văn Bộ",
    chuanDoan: "Áp xe răng cấp",
    trangThai: "huy",
    danhSachThuoc: [
      {
        id: 9,
        tenThuoc: "Clindamycin 300mg",
        soLuong: 21,
        donVi: "viên",
        donGia: 8000,
        huongDan: "Uống 3 lần/ngày, cách đều nhau 8 giờ",
      },
    ],
  },
];

const STATUS_CONFIG = {
  moi: {
    label: "Mới",
    color: B.info,
    bg: "#EFF6FF",
    icon: "document-text-outline" as const,
  },
  dalay: {
    label: "Đã lấy thuốc",
    color: B.success,
    bg: "#ECFDF5",
    icon: "checkmark-circle-outline" as const,
  },
  huy: {
    label: "Đã huỷ",
    color: B.danger,
    bg: "#FEF2F2",
    icon: "close-circle-outline" as const,
  },
};

const getCurrentDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const Donthuocbn: React.FC = () => {
  const router = useRouter();

  const [tuNgay, setTuNgay] = useState(getCurrentDate());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "moi" | "dalay" | "huy"
  >("all");
  const [data, setData] = useState<DonThuoc[]>(SAMPLE_DATA);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Modal in
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [printItem, setPrintItem] = useState<DonThuoc | null>(null);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const tinhTongDon = (thuoc: Thuoc[]) =>
    thuoc.reduce((s, t) => s + t.soLuong * t.donGia, 0);

  // Base data (ngày + search)
  const baseData = data.filter((item) => {
    const inRange = item.ngayKeDon >= tuNgay && item.ngayKeDon <= denNgay;
    const matchSearch =
      search === "" ||
      item.tenBenhNhan.toLowerCase().includes(search.toLowerCase()) ||
      item.dienThoai.includes(search) ||
      item.bacSi.toLowerCase().includes(search.toLowerCase());
    return inRange && matchSearch;
  });

  const filteredData =
    filterStatus === "all"
      ? baseData
      : baseData.filter((i) => i.trangThai === filterStatus);

  // Group by date
  const grouped = filteredData.reduce<Record<string, DonThuoc[]>>(
    (acc, item) => {
      if (!acc[item.ngayKeDon]) acc[item.ngayKeDon] = [];
      acc[item.ngayKeDon].push(item);
      return acc;
    },
    {},
  );
  const groupedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const totalAll = baseData.length;
  const totalMoi = baseData.filter((i) => i.trangThai === "moi").length;
  const totalDalay = baseData.filter((i) => i.trangThai === "dalay").length;
  const totalHuy = baseData.filter((i) => i.trangThai === "huy").length;

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá đơn thuốc này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => setData((prev) => prev.filter((i) => i.id !== id)),
      },
    ]);
  };

  const handlePrint = (item: DonThuoc) => {
    setPrintItem(item);
    setPrintModalVisible(true);
  };

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={B.primary} />

      {/* HEADER */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Đơn thuốc bệnh nhân</Text>
            <Text style={styles.headerSub}>Quản lý đơn thuốc & kê đơn</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* BỘ LỌC */}
        <View style={styles.filterCard}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm bệnh nhân, SĐT, bác sĩ..."
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

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.dateFieldLabel}>Từ ngày</Text>
              <View style={styles.dateInputWrap}>
                <Ionicons name="calendar-outline" size={14} color={B.primary} />
                <TextInput
                  style={styles.dateInput}
                  value={tuNgay}
                  onChangeText={setTuNgay}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={B.textSub}
                />
              </View>
            </View>
            <View style={styles.dateSepWrap}>
              <Ionicons name="arrow-forward" size={16} color={B.textSub} />
            </View>
            <View style={styles.dateField}>
              <Text style={styles.dateFieldLabel}>Đến ngày</Text>
              <View style={styles.dateInputWrap}>
                <Ionicons name="calendar-outline" size={14} color={B.primary} />
                <TextInput
                  style={styles.dateInput}
                  value={denNgay}
                  onChangeText={setDenNgay}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={B.textSub}
                />
              </View>
            </View>
          </View>
        </View>

        {/* THỐNG KÊ */}
        <View style={styles.statsRow}>
          {[
            {
              key: "all",
              num: totalAll,
              label: "Tổng đơn",
              color: B.textTitle,
              bg: "#F1F5F9",
              activeBg: B.primary,
              activeColor: "#fff",
            },
            {
              key: "moi",
              num: totalMoi,
              label: "Mới",
              color: B.info,
              bg: B.info + "18",
              activeBg: B.info,
              activeColor: "#fff",
            },
            {
              key: "dalay",
              num: totalDalay,
              label: "Đã lấy",
              color: B.success,
              bg: B.success + "18",
              activeBg: B.success,
              activeColor: "#fff",
            },
            {
              key: "huy",
              num: totalHuy,
              label: "Đã huỷ",
              color: B.danger,
              bg: B.danger + "18",
              activeBg: B.danger,
              activeColor: "#fff",
            },
          ].map((chip) => {
            const isActive = filterStatus === chip.key;
            return (
              <TouchableOpacity
                key={chip.key}
                activeOpacity={0.75}
                style={[
                  styles.statChip,
                  { backgroundColor: isActive ? chip.activeBg : chip.bg },
                  isActive && styles.statChipActive,
                ]}
                onPress={() => setFilterStatus(chip.key as any)}>
                <Text
                  style={[
                    styles.statNum,
                    { color: isActive ? chip.activeColor : chip.color },
                  ]}>
                  {chip.num}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: isActive ? chip.activeColor : B.textSub },
                  ]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DANH SÁCH */}
        {groupedDates.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={52} color={B.border} />
            <Text style={styles.emptyText}>
              Không có đơn thuốc trong khoảng thời gian này
            </Text>
          </View>
        ) : (
          groupedDates.map((date) => (
            <View key={date} style={styles.dateGroup}>
              {/* Tiêu đề ngày */}
              <View style={styles.dateGroupHeader}>
                <View style={styles.dateGroupDot} />
                <Text style={styles.dateGroupTitle}>{formatDate(date)}</Text>
                <View style={styles.dateGroupLine} />
                <Text style={styles.dateGroupCount}>
                  {grouped[date].length} đơn
                </Text>
              </View>

              {grouped[date].map((item) => {
                const status = STATUS_CONFIG[item.trangThai];
                const isExpanded = expandedId === item.id;
                const tongTien = tinhTongDon(item.danhSachThuoc);

                return (
                  <View key={item.id} style={styles.prescriptionCard}>
                    {/* Thanh màu trái */}
                    <View
                      style={[
                        styles.cardAccent,
                        { backgroundColor: B.primary },
                      ]}
                    />

                    <View style={styles.cardContent}>
                      {/* Hàng 1: Tên BN + Badge */}
                      <View style={styles.cardTopRow}>
                        <View style={styles.avatarSmall}>
                          <Text style={styles.avatarSmallText}>
                            {item.tenBenhNhan.split(" ").slice(-1)[0]?.[0] ||
                              "B"}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.patientName} numberOfLines={1}>
                            {item.tenBenhNhan}
                          </Text>
                          <View style={styles.metaRow}>
                            <Ionicons
                              name="call-outline"
                              size={11}
                              color={B.textSub}
                            />
                            <Text style={styles.metaText}>
                              {item.dienThoai}
                            </Text>
                            <View style={styles.metaDot} />
                            <Ionicons
                              name="location-outline"
                              size={11}
                              color={B.textSub}
                            />
                            <Text style={styles.metaText} numberOfLines={1}>
                              {item.diaChi}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: status.bg },
                          ]}>
                          <Ionicons
                            name={status.icon}
                            size={11}
                            color={status.color}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              { color: status.color },
                            ]}>
                            {status.label}
                          </Text>
                        </View>
                      </View>

                      {/* Hàng 2: Bác sĩ + Chẩn đoán */}
                      <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                          <Ionicons
                            name="medical-outline"
                            size={12}
                            color={B.primary}
                          />
                          <Text style={styles.infoLabel}>Bác sĩ:</Text>
                          <Text style={styles.infoValue}>{item.bacSi}</Text>
                        </View>
                      </View>
                      <View style={styles.chuanDoanBox}>
                        <Ionicons
                          name="clipboard-outline"
                          size={12}
                          color={B.textSub}
                        />
                        <Text style={styles.chuanDoanText} numberOfLines={1}>
                          <Text style={{ fontWeight: "600", color: B.textSub }}>
                            Chẩn đoán:{" "}
                          </Text>
                          {item.chuanDoan}
                        </Text>
                      </View>

                      {/* Summary: số thuốc + tổng tiền + toggle */}
                      <TouchableOpacity
                        style={styles.summaryRow}
                        onPress={() => toggleExpand(item.id)}
                        activeOpacity={0.7}>
                        <View style={styles.summaryLeft}>
                          <View style={styles.summaryChip}>
                            <Ionicons
                              name="medkit-outline"
                              size={12}
                              color={B.primary}
                            />
                            <Text style={styles.summaryChipText}>
                              {item.danhSachThuoc.length} loại thuốc
                            </Text>
                          </View>
                          <View style={styles.summaryChip}>
                            <Ionicons
                              name="cash-outline"
                              size={12}
                              color={B.success}
                            />
                            <Text
                              style={[
                                styles.summaryChipText,
                                { color: B.success },
                              ]}>
                              {formatMoney(tongTien)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.expandBtn}>
                          <Text style={styles.expandBtnText}>
                            {isExpanded ? "Thu gọn" : "Xem thuốc"}
                          </Text>
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={13}
                            color={B.primary}
                          />
                        </View>
                      </TouchableOpacity>

                      {/* Bảng thuốc - expand */}
                      {isExpanded && (
                        <View style={styles.thuocTable}>
                          {/* Header */}
                          <View style={styles.thuocHeader}>
                            <Text
                              style={[styles.thuocHeaderText, { flex: 2.5 }]}>
                              Tên thuốc
                            </Text>
                            <Text
                              style={[
                                styles.thuocHeaderText,
                                { flex: 0.8, textAlign: "center" },
                              ]}>
                              SL
                            </Text>
                            <Text
                              style={[
                                styles.thuocHeaderText,
                                { flex: 1.2, textAlign: "right" },
                              ]}>
                              Đơn giá
                            </Text>
                            <Text
                              style={[
                                styles.thuocHeaderText,
                                { flex: 1.2, textAlign: "right" },
                              ]}>
                              T.Tiền
                            </Text>
                          </View>

                          {item.danhSachThuoc.map((thuoc, idx) => (
                            <View key={thuoc.id}>
                              <View
                                style={[
                                  styles.thuocRow,
                                  idx % 2 !== 0 && {
                                    backgroundColor: "#FAFAFA",
                                  },
                                ]}>
                                <Text
                                  style={[styles.thuocCell, { flex: 2.5 }]}
                                  numberOfLines={1}>
                                  {thuoc.tenThuoc}
                                </Text>
                                <Text
                                  style={[
                                    styles.thuocCell,
                                    { flex: 0.8, textAlign: "center" },
                                  ]}>
                                  {thuoc.soLuong} {thuoc.donVi}
                                </Text>
                                <Text
                                  style={[
                                    styles.thuocCell,
                                    { flex: 1.2, textAlign: "right" },
                                  ]}>
                                  {formatMoney(thuoc.donGia)}
                                </Text>
                                <Text
                                  style={[
                                    styles.thuocCell,
                                    {
                                      flex: 1.2,
                                      textAlign: "right",
                                      fontWeight: "700",
                                      color: B.primary,
                                    },
                                  ]}>
                                  {formatMoney(thuoc.soLuong * thuoc.donGia)}
                                </Text>
                              </View>
                              {/* Hướng dẫn sử dụng */}
                              <View style={styles.huongDanRow}>
                                <Ionicons
                                  name="information-circle-outline"
                                  size={11}
                                  color={B.info}
                                />
                                <Text style={styles.huongDanText}>
                                  {thuoc.huongDan}
                                </Text>
                              </View>
                            </View>
                          ))}

                          {/* Tổng cộng */}
                          <View style={styles.thuocTotalRow}>
                            <Text style={styles.thuocTotalLabel}>
                              Tổng cộng:
                            </Text>
                            <Text style={styles.thuocTotalValue}>
                              {formatMoney(tongTien)}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Nút hành động */}
                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.actionBtnEdit]}>
                          <Ionicons
                            name="create-outline"
                            size={13}
                            color={B.info}
                          />
                          <Text
                            style={[styles.actionBtnText, { color: B.info }]}>
                            Sửa
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.actionBtnPrint]}
                          onPress={() => handlePrint(item)}>
                          <Ionicons
                            name="print-outline"
                            size={13}
                            color={B.primary}
                          />
                          <Text
                            style={[
                              styles.actionBtnText,
                              { color: B.primary },
                            ]}>
                            In đơn
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.actionBtnDelete]}
                          onPress={() => handleDelete(item.id)}>
                          <Ionicons
                            name="trash-outline"
                            size={13}
                            color={B.danger}
                          />
                          <Text
                            style={[styles.actionBtnText, { color: B.danger }]}>
                            Xoá
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      {/* ── MODAL IN ĐƠN THUỐC ── */}
      <Modal
        visible={printModalVisible}
        animationType="slide"
        onRequestClose={() => setPrintModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>In đơn thuốc</Text>
              <TouchableOpacity
                onPress={() => setPrintModalVisible(false)}
                style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}>
              {printItem && (
                <View style={styles.printPaper}>
                  {/* Clinic header */}
                  <View style={styles.printClinicHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.printClinicName}>
                        HHIS MANAGE 2026
                      </Text>
                      <Text style={styles.printClinicSub}>
                        An Châu, Yên Khang, Ý Yên, Nam Định
                      </Text>
                      <Text style={styles.printClinicSub}>
                        Hotline: 0338.300901
                      </Text>
                    </View>
                    <Ionicons name="medical" size={32} color={B.primary} />
                  </View>

                  {/* Title */}
                  <View style={styles.printTitleWrap}>
                    <Text style={styles.printTitle}>ĐƠN THUỐC</Text>
                    <Text style={styles.printTitleSub}>
                      Ngày kê: {formatDate(printItem.ngayKeDon)}
                    </Text>
                  </View>

                  {/* Thông tin bệnh nhân */}
                  <View style={styles.printPatientBox}>
                    <View style={styles.printPatientRow}>
                      <Text style={styles.printPatientLabel}>Họ và tên:</Text>
                      <Text style={styles.printPatientValue}>
                        {printItem.tenBenhNhan}
                      </Text>
                    </View>
                    <View style={styles.printPatientRowGroup}>
                      <View style={[styles.printPatientRow, { flex: 1 }]}>
                        <Text style={styles.printPatientLabel}>
                          Điện thoại:
                        </Text>
                        <Text style={styles.printPatientValue}>
                          {printItem.dienThoai}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.printPatientRow}>
                      <Text style={styles.printPatientLabel}>Địa chỉ:</Text>
                      <Text style={styles.printPatientValue}>
                        {printItem.diaChi}
                      </Text>
                    </View>
                    <View style={styles.printPatientRow}>
                      <Text style={styles.printPatientLabel}>Chẩn đoán:</Text>
                      <Text
                        style={[
                          styles.printPatientValue,
                          { color: B.primary, fontWeight: "700" },
                        ]}>
                        {printItem.chuanDoan}
                      </Text>
                    </View>
                    <View style={styles.printPatientRow}>
                      <Text style={styles.printPatientLabel}>Bác sĩ:</Text>
                      <Text style={styles.printPatientValue}>
                        {printItem.bacSi}
                      </Text>
                    </View>
                  </View>

                  {/* Danh sách thuốc */}
                  <Text style={styles.printSectionTitle}>DANH SÁCH THUỐC</Text>
                  <View style={styles.printThuocTable}>
                    {/* Header */}
                    <View style={styles.printThuocHeader}>
                      <Text
                        style={[styles.printThuocHeaderText, { flex: 0.5 }]}>
                        STT
                      </Text>
                      <Text
                        style={[styles.printThuocHeaderText, { flex: 2.5 }]}>
                        Tên thuốc
                      </Text>
                      <Text
                        style={[
                          styles.printThuocHeaderText,
                          { flex: 1, textAlign: "center" },
                        ]}>
                        SL
                      </Text>
                      <Text
                        style={[
                          styles.printThuocHeaderText,
                          { flex: 1.3, textAlign: "right" },
                        ]}>
                        Đơn giá
                      </Text>
                      <Text
                        style={[
                          styles.printThuocHeaderText,
                          { flex: 1.3, textAlign: "right" },
                        ]}>
                        T.Tiền
                      </Text>
                    </View>

                    {printItem.danhSachThuoc.map((thuoc, idx) => (
                      <View key={thuoc.id}>
                        <View
                          style={[
                            styles.printThuocRow,
                            idx % 2 !== 0 && { backgroundColor: "#FAFAFA" },
                          ]}>
                          <Text
                            style={[
                              styles.printThuocCell,
                              { flex: 0.5, textAlign: "center" },
                            ]}>
                            {idx + 1}
                          </Text>
                          <Text style={[styles.printThuocCell, { flex: 2.5 }]}>
                            {thuoc.tenThuoc}
                          </Text>
                          <Text
                            style={[
                              styles.printThuocCell,
                              { flex: 1, textAlign: "center" },
                            ]}>
                            {thuoc.soLuong} {thuoc.donVi}
                          </Text>
                          <Text
                            style={[
                              styles.printThuocCell,
                              { flex: 1.3, textAlign: "right" },
                            ]}>
                            {formatMoney(thuoc.donGia)}
                          </Text>
                          <Text
                            style={[
                              styles.printThuocCell,
                              {
                                flex: 1.3,
                                textAlign: "right",
                                fontWeight: "700",
                                color: B.primary,
                              },
                            ]}>
                            {formatMoney(thuoc.soLuong * thuoc.donGia)}
                          </Text>
                        </View>
                        {/* Hướng dẫn dùng thuốc */}
                        <View style={styles.printHuongDanRow}>
                          <Text style={styles.printHuongDanText}>
                            ↳ {thuoc.huongDan}
                          </Text>
                        </View>
                      </View>
                    ))}

                    {/* Tổng cộng */}
                    <View style={styles.printTotalRow}>
                      <Text style={styles.printTotalLabel}>TỔNG CỘNG:</Text>
                      <Text style={styles.printTotalValue}>
                        {formatMoney(tinhTongDon(printItem.danhSachThuoc))}
                      </Text>
                    </View>
                  </View>

                  {/* Lưu ý */}
                  <View style={styles.printNoteBox}>
                    <Ionicons
                      name="warning-outline"
                      size={14}
                      color={B.warning}
                    />
                    <Text style={styles.printNoteText}>
                      Uống thuốc đúng theo hướng dẫn. Không tự ý tăng/giảm liều.
                      Tái khám theo lịch hẹn.
                    </Text>
                  </View>

                  {/* Chữ ký */}
                  <View style={styles.printFooter}>
                    <View style={styles.printSignBox}>
                      <Text style={styles.printSignTitle}>Bệnh nhân</Text>
                      <Text style={styles.printSignSub}>
                        (Ký, ghi rõ họ tên)
                      </Text>
                      <View style={{ height: 50 }} />
                    </View>
                    <View style={styles.printSignBox}>
                      <Text style={styles.printSignTitle}>Bác sĩ kê đơn</Text>
                      <Text style={styles.printSignSub}>
                        (Ký, ghi rõ họ tên)
                      </Text>
                      <Text
                        style={[
                          styles.printSignSub,
                          {
                            marginTop: 40,
                            fontWeight: "700",
                            color: B.textTitle,
                          },
                        ]}>
                        {printItem.bacSi}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setPrintModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.printBtn}>
                <Ionicons name="print" size={18} color="#fff" />
                <Text style={styles.printBtnText}>Xuất & In đơn</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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

  scrollView: { flex: 1 },
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
  dateFieldLabel: {
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
  dateSepWrap: { paddingTop: 18, alignItems: "center" },

  statsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  statChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 2,
  },
  statChipActive: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  statNum: { fontSize: 18, fontWeight: "800" },
  statLabel: {
    fontSize: 9,
    color: B.textSub,
    fontWeight: "600",
    textAlign: "center",
  },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: {
    fontSize: 13,
    color: B.textSub,
    textAlign: "center",
    maxWidth: 240,
  },

  dateGroup: { marginBottom: 16 },
  dateGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  dateGroupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: B.primary,
  },
  dateGroupTitle: { fontSize: 14, fontWeight: "800", color: B.primary },
  dateGroupLine: { flex: 1, height: 1, backgroundColor: B.border },
  dateGroupCount: { fontSize: 11, fontWeight: "600", color: B.textSub },

  prescriptionCard: {
    flexDirection: "row",
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 10,
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
  cardAccent: { width: 4 },
  cardContent: { flex: 1, padding: 12, gap: 7 },

  cardTopRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSmallText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  patientName: { fontSize: 14, fontWeight: "800", color: B.textTitle },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
    marginTop: 2,
  },
  metaText: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: "700" },

  infoRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  infoLabel: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  infoValue: { fontSize: 11, color: B.textTitle, fontWeight: "700" },

  chuanDoanBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: B.primary,
  },
  chuanDoanText: { flex: 1, fontSize: 11, color: B.textSub },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: B.border,
  },
  summaryLeft: { flexDirection: "row", gap: 8 },
  summaryChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  summaryChipText: { fontSize: 11, fontWeight: "700", color: B.primary },
  expandBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
  expandBtnText: { fontSize: 11, fontWeight: "700", color: B.primary },

  thuocTable: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  thuocHeader: {
    flexDirection: "row",
    backgroundColor: B.primary,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  thuocHeaderText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  thuocRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 8 },
  thuocCell: { fontSize: 10, color: B.textTitle },
  huongDanRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    paddingHorizontal: 8,
    paddingBottom: 7,
    backgroundColor: "#FAFAFA",
  },
  huongDanText: {
    flex: 1,
    fontSize: 10,
    color: B.info,
    fontStyle: "italic",
    lineHeight: 14,
  },
  thuocTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: B.border,
    backgroundColor: "#FEF2F2",
  },
  thuocTotalLabel: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  thuocTotalValue: { fontSize: 14, fontWeight: "800", color: B.primary },

  cardActions: { flexDirection: "row", gap: 8, paddingTop: 2 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnEdit: { borderColor: B.info + "50", backgroundColor: "#EFF6FF" },
  actionBtnPrint: { borderColor: B.primary + "50", backgroundColor: "#FEF2F2" },
  actionBtnDelete: { borderColor: B.danger + "50", backgroundColor: "#FEF2F2" },
  actionBtnText: { fontSize: 12, fontWeight: "700" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  modalSafeArea: {
    flex: 1,
    backgroundColor: B.background,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: B.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  modalTitle: { fontSize: 17, fontWeight: "800", color: B.textTitle },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: { flex: 1, padding: 16 },
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
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: B.textSub },
  printBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: B.primary,
  },
  printBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  printPaper: {
    backgroundColor: B.white,
    borderRadius: 10,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: B.border,
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
  printClinicHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: B.primary,
    paddingBottom: 12,
    marginBottom: 14,
    gap: 10,
  },
  printClinicName: {
    fontSize: 16,
    fontWeight: "800",
    color: B.primary,
    marginBottom: 3,
  },
  printClinicSub: { fontSize: 11, color: B.textSub, marginBottom: 1 },
  printTitleWrap: { alignItems: "center", marginBottom: 14 },
  printTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: B.textTitle,
    letterSpacing: 1,
  },
  printTitleSub: {
    fontSize: 12,
    color: B.textSub,
    fontStyle: "italic",
    marginTop: 3,
  },

  printPatientBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: B.border,
    gap: 6,
  },
  printPatientRowGroup: { flexDirection: "row", gap: 10 },
  printPatientRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  printPatientLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: B.textSub,
    width: 80,
  },
  printPatientValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: B.textTitle,
  },

  printSectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: B.primary,
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  printThuocTable: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 14,
  },
  printThuocHeader: {
    flexDirection: "row",
    backgroundColor: B.primary,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  printThuocHeaderText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  printThuocRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  printThuocCell: { fontSize: 11, color: B.textTitle },
  printHuongDanRow: {
    paddingHorizontal: 8,
    paddingBottom: 7,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  printHuongDanText: { fontSize: 10, color: B.info, fontStyle: "italic" },
  printTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: B.primary,
    backgroundColor: "#FEF2F2",
  },
  printTotalLabel: { fontSize: 13, fontWeight: "700", color: B.textTitle },
  printTotalValue: { fontSize: 16, fontWeight: "800", color: B.primary },

  printNoteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: B.warning + "50",
    marginBottom: 20,
  },
  printNoteText: { flex: 1, fontSize: 11, color: "#92400E", lineHeight: 16 },

  printFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  printSignBox: { flex: 1, alignItems: "center" },
  printSignTitle: { fontSize: 13, fontWeight: "700", color: B.textTitle },
  printSignSub: {
    fontSize: 11,
    color: B.textSub,
    fontStyle: "italic",
    marginTop: 2,
  },
});

export default Donthuocbn;
