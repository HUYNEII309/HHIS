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
import { useRouter, useLocalSearchParams } from "expo-router";

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
};

const MEDICAL_HISTORY_LABELS = [
  "Chảy máu lâu",
  "Dị ứng thuốc",
  "Thấp khớp",
  "Huyết áp",
  "Tim mạch",
  "Tiểu đường",
  "Dạ dày",
  "Phổi",
  "Truyền nhiễm",
  "Thai sản",
];

interface DichVu {
  id: number;
  tenDichVu: string;
  soLuong: number;
  donGia: number;
  giamGia: number;
}

interface DotKham {
  ngayKham: string;
  dichVu: DichVu[];
  daTT: number;
}

const Khambenhdieutri: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Thông tin bệnh nhân từ params
  const benhNhan = {
    hoTen: (params.hoTen as string) || "Nguyễn Văn A",
    ngaySinh: (params.ngaySinh as string) || "1990-01-01",
    gioiTinh: (params.gioiTinh as string) || "Nam",
    dienThoai: (params.dienThoai as string) || "0901234567",
    soCCCD: (params.soCCCD as string) || "001090123456",
    diaChi: (params.diaChi as string) || "Hà Nội",
  };

  const [chuanDoan, setChuanDoan] = useState("");
  const [ghiChu, setGhiChu] = useState("");

  // State Tiền sử bệnh
  const [tienSuBenh, setTienSuBenh] = useState<string[]>([]);
  const [isEditingTienSu, setIsEditingTienSu] = useState(false);

  // State accordion đợt khám
  const [expandedDotKham, setExpandedDotKham] = useState<string | null>(null);

  const toggleDotKham = (ngay: string) => {
    setExpandedDotKham((prev) => (prev === ngay ? null : ngay));
  };

  const [dotKhamList, setDotKhamList] = useState<DotKham[]>([
    {
      ngayKham: "2026-03-19",
      daTT: 300000,
      dichVu: [
        {
          id: 1,
          tenDichVu: "Khám tổng quát",
          soLuong: 1,
          donGia: 200000,
          giamGia: 0,
        },
        {
          id: 2,
          tenDichVu: "Lấy cao răng",
          soLuong: 1,
          donGia: 150000,
          giamGia: 10000,
        },
        {
          id: 3,
          tenDichVu: "Chụp X-quang",
          soLuong: 1,
          donGia: 300000,
          giamGia: 0,
        },
      ],
    },
    {
      ngayKham: "2026-03-15",
      daTT: 0,
      dichVu: [
        {
          id: 4,
          tenDichVu: "Nhổ răng khôn",
          soLuong: 1,
          donGia: 1500000,
          giamGia: 0,
        },
        {
          id: 5,
          tenDichVu: "Thuốc kháng sinh",
          soLuong: 1,
          donGia: 250000,
          giamGia: 20000,
        },
      ],
    },
  ]);

  // Quản lý trạng thái Modal In ấn
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [printType, setPrintType] = useState<"single" | "all">("single");
  const [selectedDotKham, setSelectedDotKham] = useState<string>("");

  const [khuyenMai, setKhuyenMai] = useState(50000);
  const [daThanhToan, setDaThanhToan] = useState(300000);

  // Xử lý chọn tiền sử bệnh
  const toggleTienSuBenh = (label: string) => {
    setTienSuBenh((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // Format ngày
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format tiền
  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tính tổng tiền toàn bộ
  const tinhTongTien = () => {
    let tong = 0;
    dotKhamList.forEach((dot) => {
      dot.dichVu.forEach((dv) => {
        tong += dv.soLuong * dv.donGia - dv.giamGia;
      });
    });
    return tong;
  };

  const tongTien = tinhTongTien();
  const thanhTien = tongTien - khuyenMai;
  const conNo = thanhTien - daThanhToan;

  // Mở modal in 1 đợt
  const handlePrintSingle = (ngay: string) => {
    setSelectedDotKham(ngay);
    setPrintType("single");
    setPrintModalVisible(true);
  };

  // Mở modal in toàn bộ lịch sử
  const handlePrintAll = () => {
    setPrintType("all");
    setPrintModalVisible(true);
  };

  const getDichVuByNgay = (ngay: string) => {
    const dot = dotKhamList.find((d) => d.ngayKham === ngay);
    return dot ? dot.dichVu : [];
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={B.textTitle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Khám bệnh & Điều trị</Text>
          <TouchableOpacity style={styles.saveBtn}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* THÔNG TIN BỆNH NHÂN */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.compactPatientHeader}>
              <View style={styles.avatarMedium}>
                <Text style={styles.avatarMediumText}>
                  {benhNhan.hoTen?.split(" ").slice(-1)[0]?.[0] || "BN"}
                </Text>
              </View>
              <View style={styles.compactPatientInfo}>
                <Text style={styles.compactPatientName}>{benhNhan.hoTen}</Text>
                <View style={styles.compactMeta}>
                  <View
                    style={[
                      styles.genderBadge,
                      {
                        backgroundColor:
                          benhNhan.gioiTinh === "Nam" ? "#DBEAFE" : "#FCE7F3",
                      },
                    ]}>
                    <Ionicons
                      name={benhNhan.gioiTinh === "Nam" ? "male" : "female"}
                      size={10}
                      color={
                        benhNhan.gioiTinh === "Nam" ? "#1E40AF" : "#BE185D"
                      }
                    />
                    <Text
                      style={[
                        styles.genderText,
                        {
                          color:
                            benhNhan.gioiTinh === "Nam" ? "#1E40AF" : "#BE185D",
                        },
                      ]}>
                      {benhNhan.gioiTinh}
                    </Text>
                  </View>
                  <Text style={styles.compactInfoText}>
                    {formatDate(benhNhan.ngaySinh)}
                  </Text>
                  <Text style={styles.compactInfoText}>
                    {benhNhan.dienThoai}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* CHUẨN ĐOÁN & TIỀN SỬ BỆNH */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={20} color={B.primary} />
            <Text style={styles.sectionTitle}>Chuẩn đoán & Thông tin</Text>
          </View>

          <View style={styles.card}>
            {/* ---- TIỀN SỬ BỆNH ---- */}
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Tiền sử bệnh</Text>
              <TouchableOpacity
                style={[
                  styles.editTagBtn,
                  isEditingTienSu && styles.editTagBtnActive,
                ]}
                onPress={() => setIsEditingTienSu((v) => !v)}>
                <Ionicons
                  name={
                    isEditingTienSu ? "checkmark-circle" : "create-outline"
                  }
                  size={15}
                  color={isEditingTienSu ? B.success : B.primary}
                />
                <Text
                  style={[
                    styles.editTagBtnText,
                    { color: isEditingTienSu ? B.success : B.primary },
                  ]}>
                  {isEditingTienSu ? "Xong" : "Sửa"}
                </Text>
              </TouchableOpacity>
            </View>

            {isEditingTienSu ? (
              /* Chế độ sửa: hiện tất cả tags */
              <View style={styles.tagsContainer}>
                {MEDICAL_HISTORY_LABELS.map((label) => {
                  const isSelected = tienSuBenh.includes(label);
                  return (
                    <TouchableOpacity
                      key={label}
                      style={[styles.tag, isSelected && styles.tagSelected]}
                      onPress={() => toggleTienSuBenh(label)}>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={12}
                          color={B.primary}
                        />
                      )}
                      <Text
                        style={[
                          styles.tagText,
                          isSelected && styles.tagTextSelected,
                        ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              /* Chế độ xem: hiển thị dạng *Item1 , *Item2 */
              <View style={styles.tienSuTextBox}>
                {tienSuBenh.length === 0 ? (
                  <TouchableOpacity
                    style={styles.emptyTagHint}
                    onPress={() => setIsEditingTienSu(true)}>
                    <Ionicons
                      name="add-circle-outline"
                      size={14}
                      color={B.textSub}
                    />
                    <Text style={styles.emptyTagHintText}>
                      Chưa có tiền sử bệnh, nhấn Sửa để thêm
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.tienSuTextValue}>
                    {tienSuBenh.map((label, index) => (
                      <Text key={label}>
                        <Text style={styles.tienSuStar}>*</Text>
                        <Text>{label}</Text>
                        {index < tienSuBenh.length - 1 && (
                          <Text style={styles.tienSuComma}> ,  </Text>
                        )}
                      </Text>
                    ))}
                  </Text>
                )}
              </View>
            )}

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>
              Chẩn đoán bệnh
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder="Nhập chẩn đoán bệnh..."
              value={chuanDoan}
              onChangeText={setChuanDoan}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Ghi chú</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Nhập ghi chú thêm..."
              value={ghiChu}
              onChangeText={setGhiChu}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* CHI TIẾT KHÁM BỆNH */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color={B.primary} />
            <Text style={styles.sectionTitle}>Chi tiết khám bệnh</Text>
            <TouchableOpacity style={styles.addServiceBtn}>
              <Ionicons name="add-circle" size={20} color={B.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {dotKhamList.map((dotKham, dotIndex) => {
              const isExpanded = expandedDotKham === dotKham.ngayKham;
              const tongTienDot = dotKham.dichVu.reduce(
                (sum, dv) => sum + dv.soLuong * dv.donGia, 0
              );
              const giamGiaDot = dotKham.dichVu.reduce(
                (sum, dv) => sum + dv.giamGia, 0
              );
              const thanhTienDot = tongTienDot - giamGiaDot;
              const conNoDot = thanhTienDot - dotKham.daTT;

              return (
                <View key={dotIndex} style={styles.dotKhamContainer}>

                  {/* ── HEADER: Ngày khám + In đợt này ── */}
                  <View style={styles.ngayKhamHeader}>
                    <TouchableOpacity
                      style={styles.ngayKhamBadge}
                      onPress={() => toggleDotKham(dotKham.ngayKham)}
                      activeOpacity={0.7}>
                      <Ionicons name="calendar" size={14} color={B.primary} />
                      <Text style={styles.ngayKhamText}>
                        {formatDate(dotKham.ngayKham)}
                      </Text>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={14}
                        color={B.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnInDotKham}
                      onPress={() => handlePrintSingle(dotKham.ngayKham)}>
                      <Ionicons name="print-outline" size={16} color={B.primary} />
                      <Text style={styles.btnInDotKhamText}>In đợt này</Text>
                    </TouchableOpacity>
                  </View>

                  {/* ── BẢNG DỊCH VỤ: chỉ hiện khi expand ── */}
                  {isExpanded && (
                    <View style={[styles.tableContainer, { marginBottom: 10 }]}>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Dịch vụ</Text>
                        <Text style={[styles.tableHeaderText, { flex: 0.8, textAlign: "center" }]}>SL</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1.2, textAlign: "right" }]}>Đơn giá</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Giảm</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1.2, textAlign: "right" }]}>T.Tiền</Text>
                      </View>
                      {dotKham.dichVu.map((dv, index) => {
                        const thanhTienDv = dv.soLuong * dv.donGia - dv.giamGia;
                        return (
                          <View
                            key={dv.id}
                            style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                            <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>
                              {dv.tenDichVu}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 0.8, textAlign: "center" }]}>
                              {dv.soLuong}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 1.2, textAlign: "right" }]}>
                              {formatMoney(dv.donGia)}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 1, textAlign: "right", color: B.warning }]}>
                              {dv.giamGia > 0 ? `-${formatMoney(dv.giamGia)}` : "-"}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 1.2, textAlign: "right", fontWeight: "700", color: B.primary }]}>
                              {formatMoney(thanhTienDv)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* ── TỔNG KẾT ĐỢT: luôn hiện ── */}
                  <View style={styles.dotKhamSummaryBox}>
                    <View style={styles.dotKhamSummaryRow}>
                      <View style={styles.dotKhamSummaryItem}>
                        <Text style={styles.dotKhamSummaryLabel}>Tổng tiền</Text>
                        <Text style={styles.dotKhamSummaryValue}>
                          {formatMoney(tongTienDot)}
                        </Text>
                      </View>
                      <View style={styles.dotKhamSummarySep} />
                      <View style={styles.dotKhamSummaryItem}>
                        <Text style={styles.dotKhamSummaryLabel}>Giảm giá</Text>
                        <Text style={[styles.dotKhamSummaryValue, { color: B.warning }]}>
                          {giamGiaDot > 0 ? `-${formatMoney(giamGiaDot)}` : "-"}
                        </Text>
                      </View>
                      <View style={styles.dotKhamSummarySep} />
                      <View style={styles.dotKhamSummaryItem}>
                        <Text style={styles.dotKhamSummaryLabel}>Thành tiền</Text>
                        <Text style={[styles.dotKhamSummaryValue, { color: B.primary, fontWeight: "700" }]}>
                          {formatMoney(thanhTienDot)}
                        </Text>
                      </View>
                      <View style={styles.dotKhamSummarySep} />
                      <View style={styles.dotKhamSummaryItem}>
                        <Text style={styles.dotKhamSummaryLabel}>Đã thanh toán</Text>
                        <Text style={[styles.dotKhamSummaryValue, { color: B.success, fontWeight: "700" }]}>
                          {formatMoney(dotKham.daTT)}
                        </Text>
                      </View>
                      <View style={styles.dotKhamSummarySep} />
                      <View style={styles.dotKhamSummaryItem}>
                        <Text style={styles.dotKhamSummaryLabel}>Còn nợ</Text>
                        <Text style={[styles.dotKhamSummaryValue, { color: conNoDot > 0 ? B.danger : B.success, fontWeight: "700" }]}>
                          {formatMoney(conNoDot)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {dotIndex < dotKhamList.length - 1 && (
                    <View style={styles.dotKhamDivider} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* TỔNG KẾT THANH TOÁN */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash" size={20} color={B.primary} />
            <Text style={styles.sectionTitle}>Thanh toán</Text>
          </View>

          <View style={styles.paymentCard}>
            {/* Hàng 1: Tổng tiền | Khuyến mãi | Thành tiền */}
            <View style={styles.paymentTopRow}>
              <View style={styles.paymentCell}>
                <Text style={styles.paymentCellLabel}>Tổng tiền</Text>
                <Text style={styles.paymentCellValue}>{formatMoney(tongTien)}</Text>
              </View>
              <View style={styles.paymentArrow}>
                <Ionicons name="remove-outline" size={16} color={B.textSub} />
              </View>
              <View style={styles.paymentCell}>
                <Text style={styles.paymentCellLabel}>Khuyến mãi</Text>
                <Text style={[styles.paymentCellValue, { color: B.warning }]}>
                  {formatMoney(khuyenMai)}
                </Text>
              </View>
              <View style={styles.paymentArrow}>
                <Ionicons name="return-down-forward-outline" size={16} color={B.textSub} />
              </View>
              <View style={[styles.paymentCell, styles.paymentCellHighlight]}>
                <Text style={[styles.paymentCellLabel, { color: B.primary }]}>Thành tiền</Text>
                <Text style={[styles.paymentCellValue, { color: B.primary, fontWeight: "800", fontSize: 13 }]}>
                  {formatMoney(thanhTien)}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.paymentDivider} />

            {/* Hàng 2: Đã thanh toán | Còn nợ */}
            <View style={styles.paymentBottomRow}>
              <View style={styles.paymentBottomCell}>
                <View style={styles.paymentBottomIcon}>
                  <Ionicons name="checkmark-circle" size={18} color={B.success} />
                </View>
                <View>
                  <Text style={styles.paymentCellLabel}>Đã thanh toán</Text>
                  <Text style={[styles.paymentCellValue, { color: B.success, fontWeight: "700", fontSize: 14 }]}>
                    {formatMoney(daThanhToan)}
                  </Text>
                </View>
              </View>

              <View style={styles.paymentBottomSep} />

              <View style={[styles.paymentBottomCell, {
                backgroundColor: conNo > 0 ? "#FEF2F2" : "#ECFDF5",
                borderRadius: 10,
                padding: 10,
              }]}>
                <View style={styles.paymentBottomIcon}>
                  <Ionicons
                    name={conNo > 0 ? "alert-circle" : "checkmark-circle"}
                    size={18}
                    color={conNo > 0 ? B.danger : B.success}
                  />
                </View>
                <View>
                  <Text style={styles.paymentCellLabel}>Còn nợ</Text>
                  <Text style={[styles.paymentCellValue, {
                    color: conNo > 0 ? B.danger : B.success,
                    fontWeight: "800",
                    fontSize: 16,
                  }]}>
                    {formatMoney(conNo)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.printBtn} onPress={handlePrintAll}>
            <Ionicons name="documents-outline" size={20} color={B.primary} />
            <Text style={styles.printBtnText}>In toàn bộ hồ sơ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.payBtn}>
            <Ionicons name="card-outline" size={20} color="#fff" />
            <Text style={styles.payBtnText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL IN PHIẾU */}
      <Modal
        visible={printModalVisible}
        animationType="slide"
        onRequestClose={() => setPrintModalVisible(false)}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {printType === "single"
                  ? `Phiếu khám ngày ${formatDate(selectedDotKham)}`
                  : "Hồ sơ khám bệnh chi tiết"}
              </Text>
              <TouchableOpacity
                onPress={() => setPrintModalVisible(false)}
                style={styles.closeIconBtn}>
                <Ionicons name="close" size={24} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.printPaper}>
                {/* Header Phòng Khám */}
                <View style={styles.invoiceHeader}>
                  <View style={styles.clinicInfo}>
                    <Text style={styles.clinicName}>HHIS MANAGE 2026</Text>
                    <Text style={styles.clinicSub}>
                      An Châu, Yên Khang, Ý Yên, Nam Định
                    </Text>
                    <Text style={styles.clinicSub}>Hotline: 0338.300901</Text>
                  </View>
                  <View style={styles.invoiceLogo}>
                    <Ionicons name="medical" size={32} color={B.primary} />
                  </View>
                </View>

                <View style={styles.invoiceTitleContainer}>
                  <Text style={styles.invoiceMainTitle}>
                    {printType === "single"
                      ? "PHIẾU THANH TOÁN DỊCH VỤ"
                      : "HỒ SƠ KHÁM VÀ ĐIỀU TRỊ"}
                  </Text>
                  {printType === "single" && (
                    <Text style={styles.invoiceDate}>
                      Ngày: {formatDate(selectedDotKham)}
                    </Text>
                  )}
                </View>

                {/* Thông tin bệnh nhân */}
                <View style={styles.invoicePatientBox}>
                  {/* Tên bệnh nhân nổi bật */}
                  <View style={styles.invPatientNameRow}>
                    <View style={styles.invPatientAvatar}>
                      <Text style={styles.invPatientAvatarText}>
                        {benhNhan.hoTen?.split(" ").slice(-1)[0]?.[0] || "BN"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.invPatientName}>{benhNhan.hoTen}</Text>
                      <View style={styles.invPatientBadgeRow}>
                        <View style={[styles.invGenderBadge, {
                          backgroundColor: benhNhan.gioiTinh === "Nam" ? "#DBEAFE" : "#FCE7F3"
                        }]}>
                          <Ionicons
                            name={benhNhan.gioiTinh === "Nam" ? "male" : "female"}
                            size={10}
                            color={benhNhan.gioiTinh === "Nam" ? "#1E40AF" : "#BE185D"}
                          />
                          <Text style={[styles.invGenderText, {
                            color: benhNhan.gioiTinh === "Nam" ? "#1E40AF" : "#BE185D"
                          }]}>
                            {benhNhan.gioiTinh}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.invDividerLight} />

                  {/* Grid thông tin */}
                  <View style={styles.invInfoGrid}>
                    <View style={styles.invInfoItem}>
                      <Text style={styles.invInfoLabel}>Ngày sinh</Text>
                      <Text style={styles.invInfoValue}>{formatDate(benhNhan.ngaySinh)}</Text>
                    </View>
                    <View style={styles.invInfoItem}>
                      <Text style={styles.invInfoLabel}>Điện thoại</Text>
                      <Text style={styles.invInfoValue}>{benhNhan.dienThoai}</Text>
                    </View>
                    <View style={[styles.invInfoItem, { flex: 2 }]}>
                      <Text style={styles.invInfoLabel}>Địa chỉ</Text>
                      <Text style={styles.invInfoValue}>{benhNhan.diaChi}</Text>
                    </View>
                  </View>

                  {tienSuBenh.length > 0 && (
                    <View style={styles.invInfoRow}>
                      <Text style={styles.invInfoLabel}>Tiền sử bệnh: </Text>
                      <Text style={[styles.invInfoValue, { flex: 1 }]}>
                        {tienSuBenh.map((l, i) => (
                          <Text key={l}>
                            <Text style={{ color: B.primary, fontWeight: "700" }}>*</Text>
                            {l}{i < tienSuBenh.length - 1 ? "  " : ""}
                          </Text>
                        ))}
                      </Text>
                    </View>
                  )}

                  {chuanDoan ? (
                    <View style={[styles.invInfoRow, { marginTop: 4 }]}>
                      <Text style={styles.invInfoLabel}>Chẩn đoán: </Text>
                      <Text style={[styles.invInfoValue, { flex: 1, color: B.primary, fontWeight: "600" }]}>
                        {chuanDoan}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Danh sách Dịch vụ/Thủ thuật */}
                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceSectionTitle}>
                    CHI TIẾT DỊCH VỤ / THỦ THUẬT
                  </Text>

                  {/* Nếu in 1 đợt */}
                  {printType === "single" && (
                    <View style={styles.invoiceTable}>
                      <View style={styles.invTh}>
                        <Text style={[styles.invThText, { flex: 3 }]}>Nội dung</Text>
                        <Text style={[styles.invThText, { flex: 0.8, textAlign: "center" }]}>SL</Text>
                        <Text style={[styles.invThText, { flex: 1.5, textAlign: "right" }]}>Đơn giá</Text>
                        <Text style={[styles.invThText, { flex: 1.2, textAlign: "right" }]}>Giảm</Text>
                        <Text style={[styles.invThText, { flex: 1.5, textAlign: "right" }]}>T.Tiền</Text>
                      </View>
                      {getDichVuByNgay(selectedDotKham).map((dv, index) => (
                        <View key={dv.id} style={[styles.invTr, index % 2 === 0 && { backgroundColor: "#FAFAFA" }]}>
                          <Text style={[styles.invTd, { flex: 3 }]} numberOfLines={1}>
                            {index + 1}. {dv.tenDichVu}
                          </Text>
                          <Text style={[styles.invTd, { flex: 0.8, textAlign: "center" }]}>{dv.soLuong}</Text>
                          <Text style={[styles.invTd, { flex: 1.5, textAlign: "right" }]}>{formatMoney(dv.donGia)}</Text>
                          <Text style={[styles.invTd, { flex: 1.2, textAlign: "right", color: B.warning }]}>
                            {dv.giamGia > 0 ? `-${formatMoney(dv.giamGia)}` : "-"}
                          </Text>
                          <Text style={[styles.invTd, { flex: 1.5, textAlign: "right", fontWeight: "700", color: B.primary }]}>
                            {formatMoney(dv.soLuong * dv.donGia - dv.giamGia)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Nếu in tất cả */}
                  {printType === "all" &&
                    dotKhamList.map((dotKham, idx) => (
                      <View key={idx} style={styles.invoiceGroup}>
                        <Text style={styles.invoiceGroupDate}>
                          Ngày khám: {formatDate(dotKham.ngayKham)}
                        </Text>
                        <View style={styles.invoiceTable}>
                          <View style={styles.invTh}>
                            <Text style={[styles.invThText, { flex: 3 }]}>Thủ thuật / Dịch vụ</Text>
                            <Text style={[styles.invThText, { flex: 0.8, textAlign: "center" }]}>SL</Text>
                            <Text style={[styles.invThText, { flex: 1.5, textAlign: "right" }]}>Đơn giá</Text>
                            <Text style={[styles.invThText, { flex: 1.2, textAlign: "right" }]}>Giảm</Text>
                            <Text style={[styles.invThText, { flex: 1.5, textAlign: "right" }]}>T.Tiền</Text>
                          </View>
                          {dotKham.dichVu.map((dv, index) => (
                            <View key={dv.id} style={[styles.invTr, index % 2 === 0 && { backgroundColor: "#FAFAFA" }]}>
                              <Text style={[styles.invTd, { flex: 3 }]} numberOfLines={1}>- {dv.tenDichVu}</Text>
                              <Text style={[styles.invTd, { flex: 0.8, textAlign: "center" }]}>{dv.soLuong}</Text>
                              <Text style={[styles.invTd, { flex: 1.5, textAlign: "right" }]}>{formatMoney(dv.donGia)}</Text>
                              <Text style={[styles.invTd, { flex: 1.2, textAlign: "right", color: B.warning }]}>
                                {dv.giamGia > 0 ? `-${formatMoney(dv.giamGia)}` : "-"}
                              </Text>
                              <Text style={[styles.invTd, { flex: 1.5, textAlign: "right", fontWeight: "700", color: B.primary }]}>
                                {formatMoney(dv.soLuong * dv.donGia - dv.giamGia)}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                </View>

                {/* Tổng kết thanh toán */}
                {(() => {
                  const dichVuList = printType === "single"
                    ? getDichVuByNgay(selectedDotKham)
                    : dotKhamList.flatMap(d => d.dichVu);
                  const dotKhamSingle = printType === "single"
                    ? dotKhamList.find(d => d.ngayKham === selectedDotKham)
                    : null;

                  const tongCong = dichVuList.reduce((s, dv) => s + dv.soLuong * dv.donGia, 0);
                  const tongGiam = dichVuList.reduce((s, dv) => s + dv.giamGia, 0);
                  const thanhTienPrint = tongCong - tongGiam;
                  const daTTPrint = printType === "single"
                    ? (dotKhamSingle?.daTT ?? 0)
                    : daThanhToan;
                  const conNoPrint = thanhTienPrint - daTTPrint;

                  return (
                    <View style={styles.invoiceSummaryBox}>
                      {/* Hàng trên: Tổng cộng | Giảm giá | Thành tiền */}
                      <View style={styles.invSummaryTopRow}>
                        <View style={styles.invSummaryCell}>
                          <Text style={styles.invSummaryCellLabel}>Tổng cộng</Text>
                          <Text style={styles.invSummaryCellValue}>{formatMoney(tongCong)}</Text>
                        </View>
                        <View style={styles.invSummaryCellSep} />
                        <View style={styles.invSummaryCell}>
                          <Text style={styles.invSummaryCellLabel}>Giảm giá</Text>
                          <Text style={[styles.invSummaryCellValue, { color: B.warning }]}>
                            {tongGiam > 0 ? `- ${formatMoney(tongGiam)}` : "—"}
                          </Text>
                        </View>
                        <View style={styles.invSummaryCellSep} />
                        <View style={styles.invSummaryCell}>
                          <Text style={styles.invSummaryCellLabel}>Thành tiền</Text>
                          <Text style={[styles.invSummaryCellValue, { color: B.primary, fontWeight: "700" }]}>
                            {formatMoney(thanhTienPrint)}
                          </Text>
                        </View>
                      </View>

                      {/* Hàng dưới: Đã thanh toán | Còn nợ */}
                      <View style={styles.invSummaryBottomRow}>
                        <View style={[styles.invSummaryCell, { flex: 1 }]}>
                          <Text style={styles.invSummaryCellLabel}>Đã thanh toán</Text>
                          <Text style={[styles.invSummaryCellValue, { color: B.success, fontWeight: "700" }]}>
                            {formatMoney(daTTPrint)}
                          </Text>
                        </View>
                        <View style={styles.invSummaryCellSep} />
                        <View style={[styles.invSummaryCell, { flex: 1, backgroundColor: conNoPrint > 0 ? "#FEF2F2" : "#ECFDF5" }]}>
                          <Text style={styles.invSummaryCellLabel}>Còn nợ</Text>
                          <Text style={[styles.invSummaryCellValue, {
                            color: conNoPrint > 0 ? B.danger : B.success,
                            fontWeight: "800",
                            fontSize: 14,
                          }]}>
                            {formatMoney(conNoPrint)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })()}

                <View style={styles.invoiceFooter}>
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.signatureTitle}>Bác sĩ điều trị</Text>
                    <Text style={styles.signatureSub}>
                      (Ký và ghi rõ họ tên)
                    </Text>
                    <View style={{ height: 60 }} />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooterActions}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPrintModalVisible(false)}>
                <Text style={styles.closeButtonText}>Đóng lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.printActionBtn}>
                <Ionicons name="print" size={20} color="#fff" />
                <Text style={styles.printActionText}>Xuất & In phiếu</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: B.background,
  },
  header: {
    backgroundColor: B.white,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: B.textTitle,
  },
  saveBtn: {
    backgroundColor: B.primary,
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: B.textTitle,
    flex: 1,
  },
  addServiceBtn: {
    padding: 4,
  },
  card: {
    backgroundColor: B.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: B.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },

  // Patient Info
  compactPatientHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatarMedium: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarMediumText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  compactPatientInfo: { flex: 1 },
  compactPatientName: {
    fontSize: 16,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  compactInfoText: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  genderBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  genderText: { fontSize: 10, fontWeight: "600" },

  // Tiền sử bệnh
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  editTagBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.primary,
    backgroundColor: "#FEF2F2",
  },
  editTagBtnActive: {
    borderColor: B.success,
    backgroundColor: "#ECFDF5",
  },
  editTagBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyTagHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  emptyTagHintText: {
    fontSize: 12,
    color: B.textSub,
    fontStyle: "italic",
  },

  // Tags
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: B.border,
  },
  tagSelected: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: B.primary + "15",
    borderWidth: 1,
    borderColor: B.primary,
  },
  tagText: {
    fontSize: 13,
    color: B.textSub,
    fontWeight: "500",
  },
  tagTextSelected: {
    fontSize: 13,
    color: B.primary,
    fontWeight: "600",
  },

  tienSuTextBox: {
    paddingVertical: 6,
    marginBottom: 4,
  },
  tienSuTextValue: {
    fontSize: 13,
    color: B.textTitle,
    lineHeight: 22,
    flexWrap: "wrap",
  },
  tienSuStar: {
    color: B.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  tienSuComma: {
    color: B.textSub,
    fontWeight: "400",
  },

  dotKhamSummaryBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
  },
  dotKhamSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: B.white,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  dotKhamSummaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  dotKhamSummarySep: {
    width: 1,
    height: 32,
    backgroundColor: B.border,
  },
  dotKhamSummaryLabel: {
    fontSize: 10,
    color: B.textSub,
    fontWeight: "500",
    textAlign: "center",
  },
  dotKhamSummaryValue: {
    fontSize: 11,
    color: B.textTitle,
    fontWeight: "600",
    textAlign: "center",
  },

  // Đợt khám
  dotKhamContainer: { marginBottom: 12 },
  ngayKhamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ngayKhamBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  ngayKhamText: { fontSize: 13, fontWeight: "700", color: B.primary },
  btnInDotKham: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.primary,
  },
  btnInDotKhamText: { fontSize: 12, fontWeight: "600", color: B.primary },
  dotKhamDivider: { height: 2, backgroundColor: B.border, marginVertical: 16 },

  tableContainer: { borderRadius: 8, overflow: "hidden" },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: B.primary,
    borderRadius: 6,
    marginBottom: 6,
  },
  tableHeaderText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tableRowEven: { backgroundColor: "#FAFAFA" },
  tableCell: { fontSize: 11, color: B.textTitle },

  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: B.textTitle,
  },
  textArea: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: B.textTitle,
    backgroundColor: "#FAFAFA",
    minHeight: 70,
  },

  // Thanh toán card mới
  paymentCard: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  paymentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#FAFAFA",
  },
  paymentCell: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  paymentCellHighlight: {
    backgroundColor: B.primary + "10",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  paymentCellLabel: {
    fontSize: 11,
    color: B.textSub,
    fontWeight: "500",
    textAlign: "center",
  },
  paymentCellValue: {
    fontSize: 12,
    color: B.textTitle,
    fontWeight: "600",
    textAlign: "center",
  },
  paymentArrow: {
    paddingHorizontal: 4,
    alignItems: "center",
  },
  paymentDivider: {
    height: 1,
    backgroundColor: B.border,
  },
  paymentBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  paymentBottomCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paymentBottomSep: {
    width: 1,
    height: 36,
    backgroundColor: B.border,
  },
  paymentBottomIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  // Thanh toán
  moneyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  moneyLabel: { fontSize: 13, color: B.textSub, fontWeight: "500" },
  moneyValue: { fontSize: 13, color: B.textTitle, fontWeight: "600" },
  moneyLabelBold: { fontSize: 14, color: B.textTitle, fontWeight: "700" },
  moneyValueBold: { fontSize: 15, color: B.primary, fontWeight: "700" },
  divider: { height: 1, backgroundColor: B.border, marginVertical: 6 },
  debtRow: {
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  debtLabel: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  debtValue: { fontSize: 17, fontWeight: "700" },

  actionButtons: { flexDirection: "row", gap: 10, marginTop: 8 },
  printBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: B.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: B.primary,
  },
  printBtnText: { fontSize: 14, fontWeight: "600", color: B.primary },
  payBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: B.primary,
    borderRadius: 10,
  },
  payBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },

  // --- MODAL IN ẤN ---
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: B.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: B.textTitle },
  closeIconBtn: { padding: 4 },
  modalContent: { flex: 1, padding: 16 },

  printPaper: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: B.primary,
    paddingBottom: 12,
    marginBottom: 16,
  },
  clinicInfo: { flex: 1 },
  clinicName: {
    fontSize: 18,
    fontWeight: "800",
    color: B.primary,
    marginBottom: 4,
  },
  clinicSub: { fontSize: 12, color: B.textSub, marginBottom: 2 },
  invoiceLogo: { justifyContent: "center", alignItems: "center", width: 50 },

  invoiceTitleContainer: { alignItems: "center", marginBottom: 20 },
  invoiceMainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: B.textTitle,
    marginBottom: 4,
  },
  invoiceDate: { fontSize: 13, color: B.textSub, fontStyle: "italic" },

  invoicePatientBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: B.border,
  },
  invoicePatientText: {
    fontSize: 13,
    color: B.textTitle,
    marginBottom: 6,
    lineHeight: 20,
  },
  bold: { fontWeight: "700" },
  row: { flexDirection: "row" },

  invoiceDetails: { marginBottom: 20 },
  invoiceSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: B.primary,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  invoiceGroup: { marginBottom: 16 },
  invoiceGroupDate: {
    fontSize: 13,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 8,
    backgroundColor: "#F1F5F9",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },

  invoiceTable: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  invTh: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  invThText: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  invTr: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  invTd: { fontSize: 12, color: B.textTitle },


  // Invoice patient info redesign
  invPatientNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  invPatientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  invPatientAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  invPatientName: {
    fontSize: 16,
    fontWeight: "800",
    color: B.textTitle,
    marginBottom: 4,
  },
  invPatientBadgeRow: {
    flexDirection: "row",
    gap: 6,
  },
  invGenderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  invGenderText: {
    fontSize: 10,
    fontWeight: "600",
  },
  invDividerLight: {
    height: 1,
    backgroundColor: B.border,
    marginBottom: 10,
  },
  invInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  invInfoItem: {
    flex: 1,
    minWidth: "40%",
  },
  invInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
  },
  invInfoLabel: {
    fontSize: 11,
    color: B.textSub,
    fontWeight: "500",
    marginBottom: 2,
  },
  invInfoValue: {
    fontSize: 12,
    color: B.textTitle,
    fontWeight: "600",
  },

  // Invoice summary compact grid
  invoiceSummaryBox: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
  },
  invSummaryTopRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  invSummaryBottomRow: {
    flexDirection: "row",
  },
  invSummaryCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 4,
  },
  invSummaryCellSep: {
    width: 1,
    backgroundColor: B.border,
  },
  invSummaryCellLabel: {
    fontSize: 10,
    color: B.textSub,
    fontWeight: "500",
    textAlign: "center",
  },
  invSummaryCellValue: {
    fontSize: 12,
    color: B.textTitle,
    fontWeight: "600",
    textAlign: "center",
  },

  invoiceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  signatureTitle: { fontSize: 14, fontWeight: "700", color: B.textTitle },
  signatureSub: {
    fontSize: 12,
    color: B.textSub,
    fontStyle: "italic",
    marginTop: 2,
  },

  modalFooterActions: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: B.white,
    borderTopWidth: 1,
    borderTopColor: B.border,
    gap: 12,
  },
  closeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: { fontSize: 15, fontWeight: "600", color: B.textTitle },
  printActionBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: B.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  printActionText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});

export default Khambenhdieutri;