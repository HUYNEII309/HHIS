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
  Switch,
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
  purple: "#8B5CF6",
};

const NHOM_THUOC_LIST = [
  "Kháng sinh",
  "Giảm đau - Hạ sốt",
  "Kháng viêm",
  "Vitamin & Khoáng chất",
  "Tiêu hoá",
  "Tim mạch & Huyết áp",
  "Răng miệng",
  "Khác",
];

const KHO_THUOC_LIST = [
  "Kho chính",
  "Kho nha khoa",
  "Kho phẫu thuật",
  "Kho ngoại trú",
];

const DON_VI_LIST = ["viên", "gói", "chai", "ống", "lọ", "tuýp", "hộp", "vỉ", "ml", "mg"];

interface Thuoc {
  id: number;
  maThuoc: string;
  tenThuoc: string;
  donVi: string;
  huongDanSuDung: string;
  hoatChat: string;
  giaNhap: number;
  giaBan: number;
  maVach: string;
  nhomThuoc: string;
  khoThuoc: string;
  hienThi: boolean;
}

const SAMPLE_DATA: Thuoc[] = [
  { id: 1, maThuoc: "TH001", tenThuoc: "Amoxicillin 500mg", donVi: "viên", huongDanSuDung: "Uống 3 lần/ngày, sau bữa ăn, mỗi lần 1 viên", hoatChat: "Amoxicillin Trihydrate", giaNhap: 3000, giaBan: 5000, maVach: "8934588011234", nhomThuoc: "Kháng sinh", khoThuoc: "Kho chính", hienThi: true },
  { id: 2, maThuoc: "TH002", tenThuoc: "Metronidazole 250mg", donVi: "viên", huongDanSuDung: "Uống 2 lần/ngày, sáng và tối sau ăn", hoatChat: "Metronidazole", giaNhap: 2000, giaBan: 3500, maVach: "8934588012345", nhomThuoc: "Kháng sinh", khoThuoc: "Kho chính", hienThi: true },
  { id: 3, maThuoc: "TH003", tenThuoc: "Clindamycin 300mg", donVi: "viên", huongDanSuDung: "Uống 3-4 lần/ngày, cách đều 6-8 giờ", hoatChat: "Clindamycin HCl", giaNhap: 5000, giaBan: 8000, maVach: "8934588013456", nhomThuoc: "Kháng sinh", khoThuoc: "Kho chính", hienThi: false },
  { id: 4, maThuoc: "TH004", tenThuoc: "Paracetamol 500mg", donVi: "viên", huongDanSuDung: "Uống khi đau hoặc sốt, cách 4-6 giờ/lần, không quá 4g/ngày", hoatChat: "Paracetamol", giaNhap: 800, giaBan: 2000, maVach: "8934588014567", nhomThuoc: "Giảm đau - Hạ sốt", khoThuoc: "Kho chính", hienThi: true },
  { id: 5, maThuoc: "TH005", tenThuoc: "Ibuprofen 400mg", donVi: "viên", huongDanSuDung: "Uống sau ăn, 2-3 lần/ngày, không dùng quá 5 ngày", hoatChat: "Ibuprofen", giaNhap: 2500, giaBan: 4000, maVach: "8934588015678", nhomThuoc: "Giảm đau - Hạ sốt", khoThuoc: "Kho chính", hienThi: true },
  { id: 6, maThuoc: "TH006", tenThuoc: "Dexamethasone 0.5mg", donVi: "viên", huongDanSuDung: "Theo chỉ định bác sĩ, thường 2-4 lần/ngày", hoatChat: "Dexamethasone", giaNhap: 1500, giaBan: 3000, maVach: "8934588016789", nhomThuoc: "Kháng viêm", khoThuoc: "Kho chính", hienThi: true },
  { id: 7, maThuoc: "TH007", tenThuoc: "Vitamin C 1000mg", donVi: "viên", huongDanSuDung: "Uống 1 viên/ngày sau ăn sáng", hoatChat: "Ascorbic Acid", giaNhap: 3000, giaBan: 8000, maVach: "8934588017890", nhomThuoc: "Vitamin & Khoáng chất", khoThuoc: "Kho chính", hienThi: true },
  { id: 8, maThuoc: "TH008", tenThuoc: "Nước muối sinh lý NaCl 0.9%", donVi: "chai", huongDanSuDung: "Súc miệng 3-4 lần/ngày sau khi ăn", hoatChat: "Sodium Chloride", giaNhap: 8000, giaBan: 15000, maVach: "8934588018901", nhomThuoc: "Răng miệng", khoThuoc: "Kho nha khoa", hienThi: true },
  { id: 9, maThuoc: "TH009", tenThuoc: "Chlorhexidine 0.12%", donVi: "chai", huongDanSuDung: "Súc miệng 30 giây, không nuốt, dùng 2 lần/ngày", hoatChat: "Chlorhexidine Gluconate", giaNhap: 20000, giaBan: 35000, maVach: "8934588019012", nhomThuoc: "Răng miệng", khoThuoc: "Kho nha khoa", hienThi: true },
];

const EMPTY_FORM: Omit<Thuoc, "id"> = {
  maThuoc: "",
  tenThuoc: "",
  donVi: "viên",
  huongDanSuDung: "",
  hoatChat: "",
  giaNhap: 0,
  giaBan: 0,
  maVach: "",
  nhomThuoc: NHOM_THUOC_LIST[0],
  khoThuoc: KHO_THUOC_LIST[0],
  hienThi: true,
};

const Thuoc_Maudonthuoc: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<Thuoc[]>(SAMPLE_DATA);
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Kháng sinh", "Răng miệng"]));

  // Modal form
  const [formVisible, setFormVisible] = useState(false);
  const [editItem, setEditItem] = useState<Thuoc | null>(null);
  const [form, setForm] = useState<Omit<Thuoc, "id">>(EMPTY_FORM);

  // Dropdown states
  const [showDonVi, setShowDonVi] = useState(false);
  const [showNhom, setShowNhom] = useState(false);
  const [showKho, setShowKho] = useState(false);

  // Detail modal
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailItem, setDetailItem] = useState<Thuoc | null>(null);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const toggleGroup = (nhom: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(nhom) ? next.delete(nhom) : next.add(nhom);
      return next;
    });
  };

  // Group by nhomThuoc
  const filteredData = data.filter((t) =>
    search === "" ||
    t.tenThuoc.toLowerCase().includes(search.toLowerCase()) ||
    t.maThuoc.toLowerCase().includes(search.toLowerCase()) ||
    t.hoatChat.toLowerCase().includes(search.toLowerCase()) ||
    t.maVach.includes(search)
  );

  const groupMap: Record<string, Thuoc[]> = {};
  NHOM_THUOC_LIST.forEach((nhom) => {
    const items = filteredData.filter((t) => t.nhomThuoc === nhom);
    if (items.length > 0) groupMap[nhom] = items;
  });
  // Other groups not in list
  filteredData.forEach((t) => {
    if (!NHOM_THUOC_LIST.includes(t.nhomThuoc) && t.nhomThuoc) {
      if (!groupMap[t.nhomThuoc]) groupMap[t.nhomThuoc] = [];
      if (!groupMap[t.nhomThuoc].find((x) => x.id === t.id)) groupMap[t.nhomThuoc].push(t);
    }
  });

  const totalThuoc = data.length;
  const totalHienThi = data.filter((t) => t.hienThi).length;
  const totalNhom = Object.keys(groupMap).length;

  const openAdd = () => {
    setEditItem(null);
    const nextId = Math.max(...data.map((t) => t.id), 0) + 1;
    setForm({ ...EMPTY_FORM, maThuoc: `TH${String(nextId).padStart(3, "0")}` });
    setFormVisible(true);
  };

  const openEdit = (t: Thuoc) => {
    setEditItem(t);
    setForm({ maThuoc: t.maThuoc, tenThuoc: t.tenThuoc, donVi: t.donVi, huongDanSuDung: t.huongDanSuDung, hoatChat: t.hoatChat, giaNhap: t.giaNhap, giaBan: t.giaBan, maVach: t.maVach, nhomThuoc: t.nhomThuoc, khoThuoc: t.khoThuoc, hienThi: t.hienThi });
    setFormVisible(true);
  };

  const openDetail = (t: Thuoc) => { setDetailItem(t); setDetailVisible(true); };

  const saveThuoc = () => {
    if (!form.tenThuoc.trim()) { Alert.alert("Thiếu thông tin", "Vui lòng nhập tên thuốc."); return; }
    if (editItem) {
      setData((prev) => prev.map((t) => t.id === editItem.id ? { ...editItem, ...form } : t));
    } else {
      const newId = Math.max(...data.map((t) => t.id), 0) + 1;
      setData((prev) => [...prev, { id: newId, ...form }]);
    }
    setFormVisible(false);
  };

  const deleteThuoc = (id: number) => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá thuốc này?", [
      { text: "Huỷ", style: "cancel" },
      { text: "Xoá", style: "destructive", onPress: () => setData((prev) => prev.filter((t) => t.id !== id)) },
    ]);
  };

  const toggleHienThi = (id: number) => {
    setData((prev) => prev.map((t) => t.id === id ? { ...t, hienThi: !t.hienThi } : t));
  };

  const DropdownField = ({ label, value, options, show, onToggle, onSelect, icon }: {
    label: string; value: string; options: string[]; show: boolean;
    onToggle: () => void; onSelect: (v: string) => void; icon: string;
  }) => (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>
      <TouchableOpacity style={formStyles.inputWrap} onPress={onToggle}>
        <Ionicons name={icon as any} size={14} color={B.primary} />
        <Text style={[formStyles.input, { color: B.textTitle }]}>{value}</Text>
        <Ionicons name={show ? "chevron-up" : "chevron-down"} size={14} color={B.textSub} />
      </TouchableOpacity>
      {show && (
        <View style={formStyles.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity key={opt} style={[formStyles.dropItem, value === opt && formStyles.dropItemActive]} onPress={() => onSelect(opt)}>
              <Text style={[formStyles.dropItemText, value === opt && { color: B.primary, fontWeight: "700" }]}>{opt}</Text>
              {value === opt && <Ionicons name="checkmark" size={14} color={B.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

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
            <Text style={styles.headerTitle}>Danh mục thuốc</Text>
            <Text style={styles.headerSub}>Quản lý thuốc & mẫu đơn thuốc</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* TÌM KIẾM */}
        <View style={styles.searchCard}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput style={styles.searchInput} placeholder="Tìm tên thuốc, mã thuốc, hoạt chất, mã vạch..." placeholderTextColor={B.textSub} value={search} onChangeText={setSearch} />
            {search !== "" && <TouchableOpacity onPress={() => setSearch("")}><Ionicons name="close-circle" size={16} color={B.textSub} /></TouchableOpacity>}
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: "#FEF2F2" }]}>
            <Ionicons name="medkit-outline" size={16} color={B.primary} />
            <Text style={[styles.statNum, { color: B.primary }]}>{totalThuoc}</Text>
            <Text style={styles.statLabel}>Tổng thuốc</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: "#ECFDF5" }]}>
            <Ionicons name="eye-outline" size={16} color={B.success} />
            <Text style={[styles.statNum, { color: B.success }]}>{totalHienThi}</Text>
            <Text style={styles.statLabel}>Đang hiện</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: "#EFF6FF" }]}>
            <Ionicons name="grid-outline" size={16} color={B.info} />
            <Text style={[styles.statNum, { color: B.info }]}>{totalNhom}</Text>
            <Text style={styles.statLabel}>Nhóm thuốc</Text>
          </View>
        </View>

        {/* DANH SÁCH THEO NHÓM */}
        {Object.keys(groupMap).length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="medkit-outline" size={52} color={B.border} />
            <Text style={styles.emptyText}>Chưa có thuốc nào</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
              <Ionicons name="add-circle" size={16} color={B.primary} />
              <Text style={styles.emptyAddText}>Thêm thuốc mới</Text>
            </TouchableOpacity>
          </View>
        ) : (
          Object.entries(groupMap).map(([nhom, items]) => {
            const isExpanded = expandedGroups.has(nhom);
            const hienThiCount = items.filter((t) => t.hienThi).length;

            return (
              <View key={nhom} style={styles.groupCard}>
                {/* Header nhóm */}
                <TouchableOpacity style={styles.groupHeader} onPress={() => toggleGroup(nhom)} activeOpacity={0.75}>
                  <View style={styles.groupColorBar} />
                  <View style={styles.groupHeaderContent}>
                    <View style={styles.groupTitleRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.groupName}>{nhom}</Text>
                        <Text style={styles.groupSub}>{items.length} thuốc · {hienThiCount} đang hiện</Text>
                      </View>
                      <View style={styles.groupChips}>
                        <View style={styles.groupChip}>
                          <Text style={styles.groupChipNum}>{items.length}</Text>
                          <Text style={styles.groupChipLabel}>Thuốc</Text>
                        </View>
                        <View style={[styles.groupChip, { backgroundColor: "#ECFDF5" }]}>
                          <Text style={[styles.groupChipNum, { color: B.success }]}>{hienThiCount}</Text>
                          <Text style={[styles.groupChipLabel, { color: B.success }]}>Hiện</Text>
                        </View>
                      </View>
                      <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={B.textSub} style={{ marginLeft: 8 }} />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Danh sách thuốc */}
                {isExpanded && (
                  <View style={styles.thuocList}>
                    {items.map((thuoc, idx) => (
                      <TouchableOpacity
                        key={thuoc.id}
                        style={[styles.thuocCard, !thuoc.hienThi && styles.thuocCardHidden]}
                        onPress={() => openDetail(thuoc)}
                        activeOpacity={0.75}>

                        {/* Chỉ thị số thứ tự */}
                        <View style={[styles.thuocIndex, { backgroundColor: thuoc.hienThi ? B.primary + "15" : "#F1F5F9" }]}>
                          <Text style={[styles.thuocIndexText, { color: thuoc.hienThi ? B.primary : B.textSub }]}>
                            {String(idx + 1).padStart(2, "0")}
                          </Text>
                        </View>

                        {/* Nội dung chính */}
                        <View style={{ flex: 1, gap: 4 }}>
                          {/* Dòng 1: Tên thuốc + badge ẩn */}
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <Text
                              style={[styles.thuocName, !thuoc.hienThi && { color: B.textSub }]}
                              numberOfLines={1}>
                              {thuoc.tenThuoc}
                            </Text>
                            {!thuoc.hienThi && (
                              <View style={styles.thuocHiddenBadge}>
                                <Ionicons name="eye-off-outline" size={9} color={B.textSub} />
                                <Text style={styles.thuocHiddenText}>Ẩn</Text>
                              </View>
                            )}
                          </View>

                          {/* Dòng 2: ĐV · Giá nhập · Giá bán */}
                          <View style={styles.thuocMetaRow}>
                            <View style={styles.thuocDonViChip}>
                              <Text style={styles.thuocDonViText}>{thuoc.donVi}</Text>
                            </View>
                            <View style={styles.thuocPriceGroup}>
                              <View style={styles.thuocPriceItem}>
                                <Text style={styles.thuocPriceLabel}>Nhập</Text>
                                <Text style={styles.thuocGiaNhap}>{formatMoney(thuoc.giaNhap)}</Text>
                              </View>
                              <View style={styles.thuocPriceSep} />
                              <View style={styles.thuocPriceItem}>
                                <Text style={styles.thuocPriceLabel}>Bán</Text>
                                <Text style={styles.thuocGiaBan}>{formatMoney(thuoc.giaBan)}</Text>
                              </View>
                            </View>
                          </View>

                          {/* Dòng 3: HDSD */}
                          {thuoc.huongDanSuDung ? (
                            <View style={styles.thuocHDSDRow}>
                              <Ionicons name="information-circle-outline" size={11} color={B.info} />
                              <Text style={styles.thuocHDSD} numberOfLines={1}>{thuoc.huongDanSuDung}</Text>
                            </View>
                          ) : null}
                        </View>

                        {/* Cột phải: Switch + nút */}
                        <View style={styles.thuocRightCol}>
                          <Switch
                            value={thuoc.hienThi}
                            onValueChange={() => toggleHienThi(thuoc.id)}
                            trackColor={{ false: B.border, true: B.success + "60" }}
                            thumbColor={thuoc.hienThi ? B.success : "#ccc"}
                            style={{ transform: [{ scaleX: 0.72 }, { scaleY: 0.72 }] }}
                          />
                          <View style={styles.thuocBtnRow}>
                            <TouchableOpacity style={styles.miniBtn} onPress={() => openEdit(thuoc)}>
                              <Ionicons name="create-outline" size={13} color={B.info} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.miniBtn, { backgroundColor: "#FFF0F0" }]}
                              onPress={() => deleteThuoc(thuoc.id)}>
                              <Ionicons name="trash-outline" size={13} color={B.danger} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}

                    {/* Footer */}
                    <View style={styles.groupFooter}>
                      <Text style={styles.groupFooterText}>
                        {items.length} thuốc · {hienThiCount} đang hiển thị
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── MODAL CHI TIẾT ── */}
      <Modal visible={detailVisible} animationType="slide" transparent onRequestClose={() => setDetailVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Chi tiết thuốc</Text>
              <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>
            {detailItem && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Tên + mã */}
                <View style={styles.detailTopBox}>
                  <View style={styles.detailAvatar}>
                    <Ionicons name="medkit" size={28} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailName}>{detailItem.tenThuoc}</Text>
                    <View style={styles.detailBadgeRow}>
                      <View style={styles.detailBadge}>
                        <Text style={styles.detailBadgeText}>{detailItem.maThuoc}</Text>
                      </View>
                      <View style={[styles.detailBadge, { backgroundColor: "#EFF6FF" }]}>
                        <Text style={[styles.detailBadgeText, { color: B.info }]}>{detailItem.donVi}</Text>
                      </View>
                      {!detailItem.hienThi && (
                        <View style={[styles.detailBadge, { backgroundColor: "#F1F5F9" }]}>
                          <Ionicons name="eye-off-outline" size={10} color={B.textSub} />
                          <Text style={[styles.detailBadgeText, { color: B.textSub }]}>Đang ẩn</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Giá */}
                <View style={styles.priceRow}>
                  <View style={[styles.priceBox, { backgroundColor: "#F8FAFC" }]}>
                    <Text style={styles.priceLabel}>Giá nhập</Text>
                    <Text style={styles.priceVal}>{formatMoney(detailItem.giaNhap)}</Text>
                  </View>
                  <View style={styles.priceArrow}>
                    <Ionicons name="arrow-forward" size={16} color={B.textSub} />
                  </View>
                  <View style={[styles.priceBox, { backgroundColor: "#FEF2F2" }]}>
                    <Text style={styles.priceLabel}>Giá bán</Text>
                    <Text style={[styles.priceVal, { color: B.primary }]}>{formatMoney(detailItem.giaBan)}</Text>
                  </View>
                  <View style={[styles.priceBox, { backgroundColor: "#ECFDF5" }]}>
                    <Text style={styles.priceLabel}>Lợi nhuận</Text>
                    <Text style={[styles.priceVal, { color: B.success }]}>{formatMoney(detailItem.giaBan - detailItem.giaNhap)}</Text>
                  </View>
                </View>

                {/* Thông tin chi tiết */}
                {[
                  { icon: "flask-outline", label: "Hoạt chất", value: detailItem.hoatChat },
                  { icon: "business-outline", label: "Nhóm thuốc", value: detailItem.nhomThuoc },
                  { icon: "archive-outline", label: "Kho thuốc", value: detailItem.khoThuoc },
                  { icon: "barcode-outline", label: "Mã vạch", value: detailItem.maVach || "—" },
                  { icon: "document-text-outline", label: "Hướng dẫn sử dụng", value: detailItem.huongDanSuDung },
                ].map((row) => (
                  <View key={row.label} style={styles.detailRow}>
                    <View style={styles.detailRowLeft}>
                      <Ionicons name={row.icon as any} size={14} color={B.primary} />
                      <Text style={styles.detailRowLabel}>{row.label}</Text>
                    </View>
                    <Text style={styles.detailRowValue}>{row.value}</Text>
                  </View>
                ))}

                <View style={{ height: 20 }} />
              </ScrollView>
            )}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setDetailVisible(false)}>
                <Text style={styles.cancelBtnText}>Đóng</Text>
              </TouchableOpacity>
              {detailItem && (
                <TouchableOpacity style={styles.saveBtn} onPress={() => { setDetailVisible(false); openEdit(detailItem); }}>
                  <Ionicons name="create-outline" size={16} color="#fff" />
                  <Text style={styles.saveBtnText}>Sửa thuốc</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL THÊM/SỬA ── */}
      <Modal visible={formVisible} animationType="slide" transparent onRequestClose={() => setFormVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: "95%" }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{editItem ? "Sửa thông tin thuốc" : "Thêm thuốc mới"}</Text>
              <TouchableOpacity onPress={() => setFormVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View style={{ gap: 14, paddingBottom: 30 }}>

                {/* Mã thuốc + Tên thuốc */}
                <View style={formStyles.row}>
                  <View style={[formStyles.field, { flex: 0.8 }]}>
                    <Text style={formStyles.label}>Mã thuốc</Text>
                    <View style={formStyles.inputWrap}>
                      <Ionicons name="barcode-outline" size={14} color={B.primary} />
                      <TextInput style={formStyles.input} value={form.maThuoc} onChangeText={(v) => setForm({ ...form, maThuoc: v })} placeholder="TH001" />
                    </View>
                  </View>
                  <View style={[formStyles.field, { flex: 2 }]}>
                    <Text style={formStyles.label}>Tên thuốc <Text style={{ color: B.danger }}>*</Text></Text>
                    <View style={formStyles.inputWrap}>
                      <Ionicons name="medkit-outline" size={14} color={B.primary} />
                      <TextInput style={formStyles.input} value={form.tenThuoc} onChangeText={(v) => setForm({ ...form, tenThuoc: v })} placeholder="Nhập tên thuốc" />
                    </View>
                  </View>
                </View>

                {/* Hoạt chất */}
                <View style={formStyles.field}>
                  <Text style={formStyles.label}>Hoạt chất</Text>
                  <View style={formStyles.inputWrap}>
                    <Ionicons name="flask-outline" size={14} color={B.primary} />
                    <TextInput style={formStyles.input} value={form.hoatChat} onChangeText={(v) => setForm({ ...form, hoatChat: v })} placeholder="Tên hoạt chất" />
                  </View>
                </View>

                {/* Đơn vị dropdown */}
                <DropdownField
                  label="Đơn vị"
                  value={form.donVi}
                  options={DON_VI_LIST}
                  show={showDonVi}
                  onToggle={() => { setShowDonVi(!showDonVi); setShowNhom(false); setShowKho(false); }}
                  onSelect={(v) => { setForm({ ...form, donVi: v }); setShowDonVi(false); }}
                  icon="cube-outline"
                />

                {/* Giá nhập + Giá bán */}
                <View style={formStyles.row}>
                  <View style={[formStyles.field, { flex: 1 }]}>
                    <Text style={formStyles.label}>Giá nhập (₫)</Text>
                    <View style={formStyles.inputWrap}>
                      <Ionicons name="arrow-down-circle-outline" size={14} color={B.textSub} />
                      <TextInput style={formStyles.input} value={form.giaNhap === 0 ? "" : String(form.giaNhap)} onChangeText={(v) => setForm({ ...form, giaNhap: Number(v.replace(/\D/g, "")) })} keyboardType="numeric" placeholder="0" />
                    </View>
                    {form.giaNhap > 0 && <Text style={formStyles.moneyHint}>{formatMoney(form.giaNhap)}</Text>}
                  </View>
                  <View style={[formStyles.field, { flex: 1 }]}>
                    <Text style={formStyles.label}>Giá bán (₫)</Text>
                    <View style={[formStyles.inputWrap, { borderColor: B.primary + "60" }]}>
                      <Ionicons name="arrow-up-circle-outline" size={14} color={B.primary} />
                      <TextInput style={formStyles.input} value={form.giaBan === 0 ? "" : String(form.giaBan)} onChangeText={(v) => setForm({ ...form, giaBan: Number(v.replace(/\D/g, "")) })} keyboardType="numeric" placeholder="0" />
                    </View>
                    {form.giaBan > 0 && <Text style={[formStyles.moneyHint, { color: B.primary }]}>{formatMoney(form.giaBan)}</Text>}
                  </View>
                </View>

                {/* Preview lợi nhuận */}
                {form.giaBan > 0 && form.giaNhap > 0 && (
                  <View style={formStyles.profitBox}>
                    <Ionicons name="trending-up" size={14} color={form.giaBan > form.giaNhap ? B.success : B.danger} />
                    <Text style={formStyles.profitLabel}>Lợi nhuận:</Text>
                    <Text style={[formStyles.profitVal, { color: form.giaBan > form.giaNhap ? B.success : B.danger }]}>
                      {formatMoney(form.giaBan - form.giaNhap)}
                    </Text>
                    <Text style={formStyles.profitPct}>
                      ({form.giaNhap > 0 ? Math.round(((form.giaBan - form.giaNhap) / form.giaNhap) * 100) : 0}%)
                    </Text>
                  </View>
                )}

                {/* Mã vạch */}
                <View style={formStyles.field}>
                  <Text style={formStyles.label}>Mã vạch</Text>
                  <View style={formStyles.inputWrap}>
                    <Ionicons name="barcode-outline" size={14} color={B.primary} />
                    <TextInput style={formStyles.input} value={form.maVach} onChangeText={(v) => setForm({ ...form, maVach: v })} placeholder="Nhập hoặc quét mã vạch" keyboardType="numeric" />
                    <TouchableOpacity>
                      <Ionicons name="scan-outline" size={18} color={B.textSub} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Nhóm thuốc */}
                <DropdownField
                  label="Nhóm thuốc"
                  value={form.nhomThuoc}
                  options={NHOM_THUOC_LIST}
                  show={showNhom}
                  onToggle={() => { setShowNhom(!showNhom); setShowDonVi(false); setShowKho(false); }}
                  onSelect={(v) => { setForm({ ...form, nhomThuoc: v }); setShowNhom(false); }}
                  icon="grid-outline"
                />

                {/* Kho thuốc */}
                <DropdownField
                  label="Kho thuốc"
                  value={form.khoThuoc}
                  options={KHO_THUOC_LIST}
                  show={showKho}
                  onToggle={() => { setShowKho(!showKho); setShowDonVi(false); setShowNhom(false); }}
                  onSelect={(v) => { setForm({ ...form, khoThuoc: v }); setShowKho(false); }}
                  icon="archive-outline"
                />

                {/* Hướng dẫn sử dụng */}
                <View style={formStyles.field}>
                  <Text style={formStyles.label}>Hướng dẫn sử dụng</Text>
                  <TextInput style={formStyles.textArea} value={form.huongDanSuDung} onChangeText={(v) => setForm({ ...form, huongDanSuDung: v })} placeholder="Nhập hướng dẫn sử dụng thuốc..." multiline numberOfLines={3} textAlignVertical="top" />
                </View>

                {/* Hiển thị */}
                <View style={formStyles.switchRow}>
                  <View>
                    <Text style={formStyles.label}>Hiển thị thuốc</Text>
                    <Text style={formStyles.switchSub}>Thuốc sẽ xuất hiện trong danh sách kê đơn</Text>
                  </View>
                  <Switch
                    value={form.hienThi}
                    onValueChange={(v) => setForm({ ...form, hienThi: v })}
                    trackColor={{ false: B.border, true: B.success + "60" }}
                    thumbColor={form.hienThi ? B.success : "#ccc"}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setFormVisible(false)}>
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveThuoc}>
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>{editItem ? "Lưu thay đổi" : "Thêm thuốc"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: B.background },
  header: { backgroundColor: B.primary, paddingHorizontal: 16, paddingBottom: 14 },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "500", marginTop: 1 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },

  scrollView: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 40 },

  searchCard: {
    backgroundColor: B.white, borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: B.border, marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2 } }),
  },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F8FAFC", borderRadius: 10, borderWidth: 1, borderColor: B.border, paddingHorizontal: 12, paddingVertical: 9 },
  searchInput: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statChip: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, gap: 3, borderWidth: 1, borderColor: B.border },
  statNum: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, color: B.textSub, fontWeight: "600" },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 13, color: B.textSub },
  emptyAddBtn: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: B.primary },
  emptyAddText: { fontSize: 13, fontWeight: "700", color: B.primary },

  groupCard: {
    backgroundColor: B.white, borderRadius: 14, borderWidth: 1, borderColor: B.border, marginBottom: 12, overflow: "hidden",
    ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 }, android: { elevation: 3 } }),
  },
  groupHeader: { flexDirection: "row" },
  groupColorBar: { width: 5, backgroundColor: B.primary },
  groupHeaderContent: { flex: 1, padding: 12 },
  groupTitleRow: { flexDirection: "row", alignItems: "center" },
  groupName: { fontSize: 15, fontWeight: "800", color: B.textTitle, marginBottom: 2 },
  groupSub: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  groupChips: { flexDirection: "row", gap: 5 },
  groupChip: { alignItems: "center", backgroundColor: "#FEF2F2", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  groupChipNum: { fontSize: 13, fontWeight: "800", color: B.primary },
  groupChipLabel: { fontSize: 9, color: B.primary, fontWeight: "600" },

  thuocList: { borderTopWidth: 1, borderTopColor: B.border, padding: 8, gap: 6 },

  thuocCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: B.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
      android: { elevation: 1 },
    }),
  },
  thuocCardHidden: { opacity: 0.55, backgroundColor: "#F8FAFC" },

  thuocIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 2,
  },
  thuocIndexText: { fontSize: 11, fontWeight: "800" },

  thuocName: { flex: 1, fontSize: 13, fontWeight: "700", color: B.textTitle },
  thuocHiddenBadge: { flexDirection: "row", alignItems: "center", gap: 2, backgroundColor: "#F1F5F9", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  thuocHiddenText: { fontSize: 9, color: B.textSub, fontWeight: "600" },

  thuocMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  thuocDonViChip: { backgroundColor: "#EFF6FF", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  thuocDonViText: { fontSize: 10, fontWeight: "700", color: B.info },

  thuocPriceGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
  },
  thuocPriceItem: { flex: 1, alignItems: "center", paddingVertical: 3 },
  thuocPriceSep: { width: 1, height: "100%", backgroundColor: B.border },
  thuocPriceLabel: { fontSize: 9, color: B.textSub, fontWeight: "500" },
  thuocGiaNhap: { fontSize: 10, color: B.textSub, fontWeight: "600" },
  thuocGiaBan: { fontSize: 11, color: B.primary, fontWeight: "800" },

  thuocHDSDRow: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  thuocHDSD: { flex: 1, fontSize: 10, color: B.textSub, lineHeight: 14 },

  thuocRightCol: { alignItems: "center", gap: 4 },
  thuocBtnRow: { flexDirection: "row", gap: 4 },

  // old styles kept for compat
  thuocRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  thuocRowAlt: { backgroundColor: "#FAFAFA" },
  thuocRowHidden: { opacity: 0.5 },
  thuocMetaSep: { fontSize: 10, color: B.border, fontWeight: "700" },
  tdCell: { fontSize: 11, color: B.textTitle },

  miniBtn: { width: 26, height: 26, borderRadius: 7, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center" },
  groupFooter: { backgroundColor: "#F8FAFC", paddingVertical: 7, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: B.border },
  groupFooterText: { fontSize: 11, color: B.textSub, fontWeight: "500" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: B.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "90%",
    ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 }, android: { elevation: 10 } }),
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: B.border, alignSelf: "center", marginTop: 12, marginBottom: 4 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: B.border, backgroundColor: B.white },
  modalTitle: { fontSize: 17, fontWeight: "800", color: B.textTitle },
  closeBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center" },
  modalBody: { paddingHorizontal: 16, paddingTop: 14 },
  modalFooter: { flexDirection: "row", padding: 14, gap: 10, backgroundColor: B.white, borderTopWidth: 1, borderTopColor: B.border },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: "#F1F5F9", alignItems: "center" },
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: B.textSub },
  saveBtn: { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 13, borderRadius: 12, backgroundColor: B.primary },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Detail modal
  detailTopBox: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  detailAvatar: { width: 52, height: 52, borderRadius: 14, backgroundColor: B.primary, justifyContent: "center", alignItems: "center" },
  detailName: { fontSize: 16, fontWeight: "800", color: B.textTitle, marginBottom: 6 },
  detailBadgeRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  detailBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#FEF2F2", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  detailBadgeText: { fontSize: 11, fontWeight: "700", color: B.primary },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 6 },
  priceBox: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10, gap: 3 },
  priceArrow: { alignItems: "center" },
  priceLabel: { fontSize: 10, color: B.textSub, fontWeight: "500" },
  priceVal: { fontSize: 13, fontWeight: "800", color: B.textTitle },
  detailRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", gap: 10 },
  detailRowLeft: { flexDirection: "row", alignItems: "center", gap: 5, width: 130 },
  detailRowLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  detailRowValue: { flex: 1, fontSize: 12, color: B.textTitle, fontWeight: "600", lineHeight: 18 },
});

const formStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  field: { gap: 5 },
  label: { fontSize: 12, fontWeight: "700", color: B.textSub },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: B.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: B.white },
  input: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
  textArea: { borderWidth: 1, borderColor: B.border, borderRadius: 10, padding: 12, fontSize: 13, color: B.textTitle, backgroundColor: B.white, minHeight: 80 },
  moneyHint: { fontSize: 11, color: B.success, fontWeight: "600", marginTop: 3, marginLeft: 4 },
  profitBox: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F0FDF4", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: B.success + "40" },
  profitLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  profitVal: { fontSize: 13, fontWeight: "800" },
  profitPct: { fontSize: 11, color: B.textSub },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  switchSub: { fontSize: 11, color: B.textSub, marginTop: 2 },
  dropdown: { borderWidth: 1, borderColor: B.border, borderRadius: 10, overflow: "hidden", marginTop: 4 },
  dropItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", backgroundColor: B.white },
  dropItemActive: { backgroundColor: "#FEF2F2" },
  dropItemText: { flex: 1, fontSize: 13, color: B.textTitle },
});

export default Thuoc_Maudonthuoc;