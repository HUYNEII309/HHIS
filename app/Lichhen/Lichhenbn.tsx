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

interface LichHen {
  id: number;
  ngayHen: string;   // "2026-03-20"
  gioHen: string;    // "08:30"
  tenBenhNhan: string;
  dienThoai: string;
  diaChi: string;
  nguoiHen: string;
  noiDung: string;
  trangThai: "cho" | "xacnhan" | "huy";
}

const SAMPLE_DATA: LichHen[] = [
  {
    id: 1,
    ngayHen: "2026-03-20",
    gioHen: "08:30",
    tenBenhNhan: "Nguyễn Văn An",
    dienThoai: "0901234567",
    diaChi: "123 Trần Phú, Hà Nội",
    nguoiHen: "BS. Nguyễn Thị Hoa",
    noiDung: "Khám răng định kỳ, tái khám sau nhổ răng khôn",
    trangThai: "xacnhan",
  },
  {
    id: 2,
    ngayHen: "2026-03-20",
    gioHen: "09:00",
    tenBenhNhan: "Trần Thị Bình",
    dienThoai: "0912345678",
    diaChi: "45 Lê Lợi, Nam Định",
    nguoiHen: "Lễ tân Minh",
    noiDung: "Lấy cao răng, tư vấn niềng răng",
    trangThai: "cho",
  },
  {
    id: 3,
    ngayHen: "2026-03-20",
    gioHen: "10:15",
    tenBenhNhan: "Lê Minh Cường",
    dienThoai: "0923456789",
    diaChi: "78 Nguyễn Huệ, TP. HCM",
    nguoiHen: "BS. Trần Văn Bộ",
    noiDung: "Trám răng số 6, kiểm tra tủy răng",
    trangThai: "cho",
  },
  {
    id: 4,
    ngayHen: "2026-03-21",
    gioHen: "08:00",
    tenBenhNhan: "Phạm Thị Dung",
    dienThoai: "0934567890",
    diaChi: "12 Hoàng Diệu, Đà Nẵng",
    nguoiHen: "Lễ tân Mai",
    noiDung: "Nhổ răng sữa cho trẻ, tư vấn chỉnh nha",
    trangThai: "huy",
  },
  {
    id: 5,
    ngayHen: "2026-03-21",
    gioHen: "14:30",
    tenBenhNhan: "Hoàng Văn Em",
    dienThoai: "0945678901",
    diaChi: "56 Lý Thường Kiệt, Hải Phòng",
    nguoiHen: "BS. Nguyễn Thị Hoa",
    noiDung: "Làm răng sứ thẩm mỹ, tẩy trắng răng",
    trangThai: "xacnhan",
  },
];

const STATUS_CONFIG = {
  cho: { label: "Chờ xác nhận", color: B.warning, bg: "#FFF7ED", icon: "time-outline" as const },
  xacnhan: { label: "Đã xác nhận", color: B.success, bg: "#ECFDF5", icon: "checkmark-circle-outline" as const },
  huy: { label: "Đã huỷ", color: B.danger, bg: "#FEF2F2", icon: "close-circle-outline" as const },
};

const Lichhen: React.FC = () => {
  const router = useRouter();

  const getCurrentDate = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const [tuNgay, setTuNgay] = useState(getCurrentDate());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "cho" | "xacnhan" | "huy">("all");
  const [data, setData] = useState<LichHen[]>(SAMPLE_DATA);

  // Modal sửa
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<LichHen | null>(null);

  // Modal in
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [printItem, setPrintItem] = useState<LichHen | null>(null);

  // Format ngày
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  // Lọc dữ liệu
  // Lọc cơ bản (ngày + search) — dùng để đếm stats
  const baseData = data.filter((item) => {
    const inRange = item.ngayHen >= tuNgay && item.ngayHen <= denNgay;
    const matchSearch =
      search === "" ||
      item.tenBenhNhan.toLowerCase().includes(search.toLowerCase()) ||
      item.dienThoai.includes(search) ||
      item.nguoiHen.toLowerCase().includes(search.toLowerCase());
    return inRange && matchSearch;
  });

  // Lọc đầy đủ (ngày + search + status) — dùng để hiển thị danh sách
  const filteredData = filterStatus === "all"
    ? baseData
    : baseData.filter((item) => item.trangThai === filterStatus);

  // Group by ngày
  const grouped = filteredData.reduce<Record<string, LichHen[]>>((acc, item) => {
    if (!acc[item.ngayHen]) acc[item.ngayHen] = [];
    acc[item.ngayHen].push(item);
    return acc;
  }, {});
  const groupedDates = Object.keys(grouped).sort();

  // Xoá
  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá lịch hẹn này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => setData((prev) => prev.filter((i) => i.id !== id)),
      },
    ]);
  };

  // Mở modal sửa
  const handleEdit = (item: LichHen) => {
    setEditItem({ ...item });
    setEditModalVisible(true);
  };

  // Lưu sửa
  const handleSaveEdit = () => {
    if (!editItem) return;
    setData((prev) => prev.map((i) => (i.id === editItem.id ? editItem : i)));
    setEditModalVisible(false);
    setEditItem(null);
  };

  // Mở modal in
  const handlePrint = (item: LichHen) => {
    setPrintItem(item);
    setPrintModalVisible(true);
  };

  const totalToday = baseData.length;
  const totalConfirmed = baseData.filter((i) => i.trangThai === "xacnhan").length;
  const totalWaiting = baseData.filter((i) => i.trangThai === "cho").length;
  const totalCancelled = baseData.filter((i) => i.trangThai === "huy").length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={B.primary} />

      {/* HEADER */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Lịch hẹn</Text>
            <Text style={styles.headerSub}>Quản lý lịch hẹn bệnh nhân</Text>
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
          {/* Tìm kiếm */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm bệnh nhân, SĐT, người hẹn..."
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

          {/* Từ ngày - Đến ngày */}
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

        {/* THỐNG KÊ NHANH */}
        <View style={styles.statsRow}>
          {[
            { key: "all", num: totalToday, label: "Tổng", color: B.textTitle, bg: "#F1F5F9", activeBg: B.primary, activeColor: "#fff" },
            { key: "xacnhan", num: totalConfirmed, label: "Đã xác nhận", color: B.success, bg: B.success + "18", activeBg: B.success, activeColor: "#fff" },
            { key: "cho", num: totalWaiting, label: "Chờ xác nhận", color: B.warning, bg: B.warning + "18", activeBg: B.warning, activeColor: "#fff" },
            { key: "huy", num: totalCancelled, label: "Đã huỷ", color: B.danger, bg: B.danger + "18", activeBg: B.danger, activeColor: "#fff" },
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
                <Text style={[styles.statNum, { color: isActive ? chip.activeColor : chip.color }]}>
                  {chip.num}
                </Text>
                <Text style={[styles.statLabel, { color: isActive ? chip.activeColor : B.textSub }]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DANH SÁCH LỊCH HẸN */}
        {groupedDates.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="calendar-outline" size={48} color={B.border} />
            <Text style={styles.emptyText}>Không có lịch hẹn trong khoảng thời gian này</Text>
          </View>
        ) : (
          groupedDates.map((date) => (
            <View key={date} style={styles.dateGroup}>
              {/* Tiêu đề ngày */}
              <View style={styles.dateGroupHeader}>
                <View style={styles.dateGroupDot} />
                <Text style={styles.dateGroupTitle}>
                  {formatDate(date)}
                </Text>
                <View style={styles.dateGroupLine} />
                <Text style={styles.dateGroupCount}>{grouped[date].length} lịch</Text>
              </View>

              {/* Các lịch hẹn trong ngày */}
              {grouped[date].map((item, idx) => {
                const status = STATUS_CONFIG[item.trangThai];
                return (
                  <View key={item.id} style={[styles.appointmentCard, idx === grouped[date].length - 1 && { marginBottom: 0 }]}>
                    {/* Thanh màu trái */}
                    <View style={[styles.cardAccent, { backgroundColor: B.primary }]} />

                    <View style={styles.cardContent}>
                      {/* Hàng 1: Giờ hẹn + Tên + Badge trạng thái */}
                      <View style={styles.cardTopRow}>
                        <View style={styles.timeBox}>
                          <Ionicons name="time-outline" size={12} color={B.primary} />
                          <Text style={styles.timeText}>{item.gioHen}</Text>
                        </View>
                        <Text style={styles.patientName} numberOfLines={1}>{item.tenBenhNhan}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                          <Ionicons name={status.icon} size={11} color={status.color} />
                          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                        </View>
                      </View>

                      {/* Hàng 2: SĐT + Địa chỉ */}
                      <View style={styles.cardMetaRow}>
                        <View style={styles.metaItem}>
                          <Ionicons name="call-outline" size={11} color={B.textSub} />
                          <Text style={styles.metaText}>{item.dienThoai}</Text>
                        </View>
                        <View style={styles.metaDot} />
                        <View style={[styles.metaItem, { flex: 1 }]}>
                          <Ionicons name="location-outline" size={11} color={B.textSub} />
                          <Text style={styles.metaText} numberOfLines={1}>{item.diaChi}</Text>
                        </View>
                      </View>

                      {/* Hàng 3: Người hẹn + Nội dung */}
                      <View style={styles.cardMetaRow}>
                        <View style={styles.metaItem}>
                          <Ionicons name="person-outline" size={11} color={B.textSub} />
                          <Text style={styles.metaText}>{item.nguoiHen}</Text>
                        </View>
                      </View>

                      <View style={styles.noiDungBox}>
                        <Ionicons name="document-text-outline" size={11} color={B.textSub} />
                        <Text style={styles.noiDungText} numberOfLines={2}>{item.noiDung}</Text>
                      </View>

                      {/* Hàng nút hành động */}
                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.actionBtnEdit]}
                          onPress={() => handleEdit(item)}>
                          <Ionicons name="create-outline" size={14} color={B.info} />
                          <Text style={[styles.actionBtnText, { color: B.info }]}>Sửa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionBtn, styles.actionBtnPrint]}
                          onPress={() => handlePrint(item)}>
                          <Ionicons name="print-outline" size={14} color={B.primary} />
                          <Text style={[styles.actionBtnText, { color: B.primary }]}>In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionBtn, styles.actionBtnDelete]}
                          onPress={() => handleDelete(item.id)}>
                          <Ionicons name="trash-outline" size={14} color={B.danger} />
                          <Text style={[styles.actionBtnText, { color: B.danger }]}>Xoá</Text>
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

      {/* ── MODAL SỬA ── */}
      <Modal visible={editModalVisible} animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sửa lịch hẹn</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {editItem && (
                <View style={{ gap: 14, paddingBottom: 30 }}>
                  {/* Ngày & Giờ */}
                  <View style={styles.editRow}>
                    <View style={[styles.editField, { flex: 1.5 }]}>
                      <Text style={styles.editLabel}>Ngày hẹn</Text>
                      <View style={styles.editInputWrap}>
                        <Ionicons name="calendar-outline" size={14} color={B.primary} />
                        <TextInput
                          style={styles.editInput}
                          value={editItem.ngayHen}
                          onChangeText={(v) => setEditItem({ ...editItem, ngayHen: v })}
                          placeholder="YYYY-MM-DD"
                        />
                      </View>
                    </View>
                    <View style={styles.editField}>
                      <Text style={styles.editLabel}>Giờ hẹn</Text>
                      <View style={styles.editInputWrap}>
                        <Ionicons name="time-outline" size={14} color={B.primary} />
                        <TextInput
                          style={styles.editInput}
                          value={editItem.gioHen}
                          onChangeText={(v) => setEditItem({ ...editItem, gioHen: v })}
                          placeholder="HH:MM"
                        />
                      </View>
                    </View>
                  </View>

                  {/* Tên bệnh nhân */}
                  <View style={styles.editField}>
                    <Text style={styles.editLabel}>Tên bệnh nhân</Text>
                    <View style={styles.editInputWrap}>
                      <Ionicons name="person-outline" size={14} color={B.primary} />
                      <TextInput
                        style={styles.editInput}
                        value={editItem.tenBenhNhan}
                        onChangeText={(v) => setEditItem({ ...editItem, tenBenhNhan: v })}
                        placeholder="Nhập tên bệnh nhân"
                      />
                    </View>
                  </View>

                  {/* Điện thoại */}
                  <View style={styles.editField}>
                    <Text style={styles.editLabel}>Điện thoại</Text>
                    <View style={styles.editInputWrap}>
                      <Ionicons name="call-outline" size={14} color={B.primary} />
                      <TextInput
                        style={styles.editInput}
                        value={editItem.dienThoai}
                        onChangeText={(v) => setEditItem({ ...editItem, dienThoai: v })}
                        keyboardType="phone-pad"
                        placeholder="Số điện thoại"
                      />
                    </View>
                  </View>

                  {/* Địa chỉ */}
                  <View style={styles.editField}>
                    <Text style={styles.editLabel}>Địa chỉ</Text>
                    <View style={styles.editInputWrap}>
                      <Ionicons name="location-outline" size={14} color={B.primary} />
                      <TextInput
                        style={styles.editInput}
                        value={editItem.diaChi}
                        onChangeText={(v) => setEditItem({ ...editItem, diaChi: v })}
                        placeholder="Địa chỉ bệnh nhân"
                      />
                    </View>
                  </View>

                  {/* Người hẹn */}
                  <View style={styles.editField}>
                    <Text style={styles.editLabel}>Người hẹn</Text>
                    <View style={styles.editInputWrap}>
                      <Ionicons name="medical-outline" size={14} color={B.primary} />
                      <TextInput
                        style={styles.editInput}
                        value={editItem.nguoiHen}
                        onChangeText={(v) => setEditItem({ ...editItem, nguoiHen: v })}
                        placeholder="Bác sĩ / nhân viên đặt hẹn"
                      />
                    </View>
                  </View>

                  {/* Nội dung */}
                  <View style={styles.editField}>
                    <Text style={styles.editLabel}>Nội dung</Text>
                    <TextInput
                      style={styles.editTextArea}
                      value={editItem.noiDung}
                      onChangeText={(v) => setEditItem({ ...editItem, noiDung: v })}
                      placeholder="Nội dung lịch hẹn..."
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>

                  {/* Trạng thái */}
                  <View style={styles.editField}>
                    <Text style={styles.editLabel}>Trạng thái</Text>
                    <View style={styles.statusRow}>
                      {(["cho", "xacnhan", "huy"] as const).map((s) => {
                        const cfg = STATUS_CONFIG[s];
                        const isActive = editItem.trangThai === s;
                        return (
                          <TouchableOpacity
                            key={s}
                            style={[
                              styles.statusOption,
                              { borderColor: isActive ? cfg.color : B.border, backgroundColor: isActive ? cfg.bg : B.white },
                            ]}
                            onPress={() => setEditItem({ ...editItem, trangThai: s })}>
                            <Ionicons name={cfg.icon} size={14} color={isActive ? cfg.color : B.textSub} />
                            <Text style={[styles.statusOptionText, { color: isActive ? cfg.color : B.textSub }]}>
                              {cfg.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* ── MODAL IN ── */}
      <Modal visible={printModalVisible} animationType="slide" onRequestClose={() => setPrintModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phiếu xác nhận lịch hẹn</Text>
              <TouchableOpacity onPress={() => setPrintModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {printItem && (
                <View style={styles.printPaper}>
                  {/* Clinic header */}
                  <View style={styles.printClinicHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.printClinicName}>HHIS MANAGE 2026</Text>
                      <Text style={styles.printClinicSub}>An Châu, Yên Khang, Ý Yên, Nam Định</Text>
                      <Text style={styles.printClinicSub}>Hotline: 0338.300901</Text>
                    </View>
                    <Ionicons name="medical" size={32} color={B.primary} />
                  </View>

                  {/* Title */}
                  <View style={styles.printTitleWrap}>
                    <Text style={styles.printTitle}>PHIẾU XÁC NHẬN LỊCH HẸN</Text>
                    <Text style={styles.printTitleSub}>
                      {formatDate(printItem.ngayHen)} — {printItem.gioHen}
                    </Text>
                  </View>

                  {/* Nội dung phiếu */}
                  <View style={styles.printBody}>
                    {[
                      { label: "Họ và tên", value: printItem.tenBenhNhan, icon: "person" },
                      { label: "Điện thoại", value: printItem.dienThoai, icon: "call" },
                      { label: "Địa chỉ", value: printItem.diaChi, icon: "location" },
                      { label: "Ngày hẹn", value: `${formatDate(printItem.ngayHen)} lúc ${printItem.gioHen}`, icon: "calendar" },
                      { label: "Người hẹn", value: printItem.nguoiHen, icon: "medical" },
                      { label: "Nội dung", value: printItem.noiDung, icon: "document-text" },
                    ].map((row) => (
                      <View key={row.label} style={styles.printRow}>
                        <View style={styles.printRowLeft}>
                          <Ionicons name={row.icon as any} size={13} color={B.primary} />
                          <Text style={styles.printRowLabel}>{row.label}</Text>
                        </View>
                        <Text style={styles.printRowValue}>{row.value}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Trạng thái */}
                  <View style={[styles.printStatusBox, { backgroundColor: STATUS_CONFIG[printItem.trangThai].bg }]}>
                    <Ionicons name={STATUS_CONFIG[printItem.trangThai].icon} size={16} color={STATUS_CONFIG[printItem.trangThai].color} />
                    <Text style={[styles.printStatusText, { color: STATUS_CONFIG[printItem.trangThai].color }]}>
                      {STATUS_CONFIG[printItem.trangThai].label}
                    </Text>
                  </View>

                  {/* Chữ ký */}
                  <View style={styles.printFooter}>
                    <View style={styles.printSignBox}>
                      <Text style={styles.printSignTitle}>Bệnh nhân xác nhận</Text>
                      <Text style={styles.printSignSub}>(Ký, ghi rõ họ tên)</Text>
                      <View style={{ height: 50 }} />
                    </View>
                    <View style={styles.printSignBox}>
                      <Text style={styles.printSignTitle}>Người lập phiếu</Text>
                      <Text style={styles.printSignSub}>(Ký, ghi rõ họ tên)</Text>
                      <View style={{ height: 50 }} />
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setPrintModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn}>
                <Ionicons name="print" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Xuất & In phiếu</Text>
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

  // Header
  header: {
    backgroundColor: B.primary,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
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

  scrollView: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 40 },

  // Filter card
  filterCard: {
    backgroundColor: B.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 12,
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
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
  dateFieldLabel: { fontSize: 11, fontWeight: "600", color: B.textSub, marginBottom: 4 },
  dateInputWrap: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#FEF2F2", borderRadius: 8,
    borderWidth: 1, borderColor: B.primary + "40",
    paddingHorizontal: 10, paddingVertical: 8,
  },
  dateInput: { flex: 1, fontSize: 13, color: B.textTitle, fontWeight: "600", padding: 0 },
  dateSepWrap: { paddingTop: 18, alignItems: "center" },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  statChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 2,
  },
  statChipActive: {
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  statNum: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 9, color: B.textSub, fontWeight: "600", textAlign: "center" },

  // Empty
  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: { fontSize: 13, color: B.textSub, textAlign: "center", maxWidth: 240 },

  // Date group
  dateGroup: { marginBottom: 16 },
  dateGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  dateGroupDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: B.primary,
  },
  dateGroupTitle: { fontSize: 14, fontWeight: "800", color: B.primary },
  dateGroupLine: { flex: 1, height: 1, backgroundColor: B.border },
  dateGroupCount: { fontSize: 11, fontWeight: "600", color: B.textSub },

  // Appointment card
  appointmentCard: {
    flexDirection: "row",
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 10,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  cardAccent: { width: 4 },
  cardContent: { flex: 1, padding: 12, gap: 6 },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeText: { fontSize: 12, fontWeight: "800", color: B.primary },
  patientName: { flex: 1, fontSize: 14, fontWeight: "800", color: B.textTitle },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: "700" },

  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },

  noiDungBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    padding: 7,
    borderWidth: 1,
    borderColor: B.border,
  },
  noiDungText: { flex: 1, fontSize: 11, color: B.textSub, lineHeight: 16 },

  cardActions: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 4,
  },
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

  // Modal chung
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
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center", alignItems: "center",
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
    flex: 1, paddingVertical: 13, borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: B.textSub },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: B.primary,
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Edit modal fields
  editRow: { flexDirection: "row", gap: 10 },
  editField: { flex: 1, gap: 4 },
  editLabel: { fontSize: 12, fontWeight: "700", color: B.textSub },
  editInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: B.white,
  },
  editInput: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
  editTextArea: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: B.textTitle,
    backgroundColor: B.white,
    minHeight: 80,
  },
  statusRow: { flexDirection: "row", gap: 8 },
  statusOption: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 4,
    paddingVertical: 9, borderRadius: 10, borderWidth: 1.5,
  },
  statusOptionText: { fontSize: 11, fontWeight: "700" },

  // Print modal
  printPaper: {
    backgroundColor: B.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: B.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  printClinicHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: B.primary,
    paddingBottom: 12,
    marginBottom: 16,
    gap: 10,
  },
  printClinicName: { fontSize: 16, fontWeight: "800", color: B.primary, marginBottom: 3 },
  printClinicSub: { fontSize: 11, color: B.textSub, marginBottom: 1 },
  printTitleWrap: { alignItems: "center", marginBottom: 18 },
  printTitle: { fontSize: 16, fontWeight: "800", color: B.textTitle, letterSpacing: 0.5 },
  printTitleSub: { fontSize: 12, color: B.textSub, fontStyle: "italic", marginTop: 4 },
  printBody: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  printRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 10,
  },
  printRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: 110,
  },
  printRowLabel: { fontSize: 12, fontWeight: "600", color: B.textSub },
  printRowValue: { flex: 1, fontSize: 12, color: B.textTitle, fontWeight: "600", lineHeight: 18 },
  printStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  printStatusText: { fontSize: 13, fontWeight: "700" },
  printFooter: { flexDirection: "row", justifyContent: "space-between", gap: 20 },
  printSignBox: { flex: 1, alignItems: "center" },
  printSignTitle: { fontSize: 13, fontWeight: "700", color: B.textTitle },
  printSignSub: { fontSize: 11, color: B.textSub, fontStyle: "italic", marginTop: 2 },
});

export default Lichhen;