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
  KeyboardAvoidingView,
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

interface NhomThuoc {
  id: number;
  tenNhom: string;
  moTa: string;
  soLuongThuoc: number;
}

const SAMPLE_DATA: NhomThuoc[] = [
  {
    id: 1,
    tenNhom: "Kháng sinh",
    moTa: "Thuốc kháng khuẩn và kháng sinh điều trị nhiễm trùng",
    soLuongThuoc: 12,
  },
  {
    id: 2,
    tenNhom: "Giảm đau - Hạ sốt",
    moTa: "Thuốc giảm đau, hạ sốt thông thường",
    soLuongThuoc: 8,
  },
  {
    id: 3,
    tenNhom: "Kháng viêm",
    moTa: "Thuốc kháng viêm steroid và non-steroid",
    soLuongThuoc: 6,
  },
  {
    id: 4,
    tenNhom: "Vitamin & Khoáng chất",
    moTa: "Các loại vitamin và khoáng chất bổ sung",
    soLuongThuoc: 10,
  },
  {
    id: 5,
    tenNhom: "Răng miệng",
    moTa: "Thuốc và dung dịch chuyên dùng cho nha khoa",
    soLuongThuoc: 7,
  },
  {
    id: 6,
    tenNhom: "Tiêu hoá",
    moTa: "Thuốc hỗ trợ tiêu hoá, dạ dày, ruột",
    soLuongThuoc: 5,
  },
];

const NHOM_ICONS = ["medkit", "heart", "leaf", "star", "water", "nutrition"];
const NHOM_COLORS = [
  B.primary,
  B.info,
  B.success,
  B.warning,
  "#8B5CF6",
  "#EC4899",
];

const Nhomthuocvattu: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<NhomThuoc[]>(SAMPLE_DATA);
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editItem, setEditItem] = useState<NhomThuoc | null>(null);
  const [form, setForm] = useState({ tenNhom: "", moTa: "" });
  const [formError, setFormError] = useState("");

  const filteredData = data.filter(
    (n) =>
      search === "" ||
      n.tenNhom.toLowerCase().includes(search.toLowerCase()) ||
      n.moTa.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ tenNhom: "", moTa: "" });
    setFormError("");
    setFormVisible(true);
  };

  const openEdit = (item: NhomThuoc) => {
    setEditItem(item);
    setForm({ tenNhom: item.tenNhom, moTa: item.moTa });
    setFormError("");
    setFormVisible(true);
  };

  const handleSave = () => {
    if (!form.tenNhom.trim()) {
      setFormError("Vui lòng nhập tên nhóm thuốc.");
      return;
    }
    const isDuplicate = data.some(
      (n) =>
        n.tenNhom.toLowerCase() === form.tenNhom.trim().toLowerCase() &&
        n.id !== editItem?.id,
    );
    if (isDuplicate) {
      setFormError("Tên nhóm thuốc đã tồn tại.");
      return;
    }
    if (editItem) {
      setData((prev) =>
        prev.map((n) =>
          n.id === editItem.id
            ? { ...n, tenNhom: form.tenNhom.trim(), moTa: form.moTa.trim() }
            : n,
        ),
      );
    } else {
      const newId = Math.max(...data.map((n) => n.id), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          tenNhom: form.tenNhom.trim(),
          moTa: form.moTa.trim(),
          soLuongThuoc: 0,
        },
      ]);
    }
    setFormVisible(false);
  };

  const handleDelete = (item: NhomThuoc) => {
    Alert.alert(
      "Xác nhận xoá",
      `Xoá nhóm "${item.tenNhom}"?\n${item.soLuongThuoc > 0 ? `⚠️ Nhóm đang chứa ${item.soLuongThuoc} loại thuốc.` : ""}`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () =>
            setData((prev) => prev.filter((n) => n.id !== item.id)),
        },
      ],
    );
  };

  const getNhomColor = (idx: number) => NHOM_COLORS[idx % NHOM_COLORS.length];
  const getNhomIcon = (idx: number) => NHOM_ICONS[idx % NHOM_ICONS.length];
  const totalNhom = data.length;
  const totalThuoc = data.reduce((s, n) => s + n.soLuongThuoc, 0);

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
            <Text style={styles.headerTitle}>Nhóm thuốc & Vật tư</Text>
            <Text style={styles.headerSub}>Quản lý nhóm thuốc phòng khám</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* TÌM KIẾM */}
        <View style={styles.searchCard}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm tên nhóm thuốc, mô tả..."
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
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#FEF2F2" }]}>
            <View
              style={[styles.statIcon, { backgroundColor: B.primary + "20" }]}>
              <Ionicons name="grid" size={20} color={B.primary} />
            </View>
            <View>
              <Text style={[styles.statNum, { color: B.primary }]}>
                {totalNhom}
              </Text>
              <Text style={styles.statLabel}>Tổng nhóm</Text>
            </View>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#EFF6FF" }]}>
            <View style={[styles.statIcon, { backgroundColor: B.info + "20" }]}>
              <Ionicons name="medkit" size={20} color={B.info} />
            </View>
            <View>
              <Text style={[styles.statNum, { color: B.info }]}>
                {totalThuoc}
              </Text>
              <Text style={styles.statLabel}>Tổng loại thuốc</Text>
            </View>
          </View>
        </View>

        {/* DANH SÁCH */}
        {filteredData.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="grid-outline" size={56} color={B.border} />
            <Text style={styles.emptyTitle}>Chưa có nhóm thuốc nào</Text>
            <Text style={styles.emptyText}>
              Nhấn nút + để thêm nhóm thuốc mới
            </Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
              <Ionicons name="add-circle" size={16} color={B.primary} />
              <Text style={styles.emptyAddText}>Thêm nhóm thuốc</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filteredData.map((item, idx) => {
              const color = getNhomColor(idx);
              const icon = getNhomIcon(idx);
              return (
                <View key={item.id} style={styles.nhomCard}>
                  <View
                    style={[styles.nhomAccent, { backgroundColor: color }]}
                  />
                  <View style={styles.nhomContent}>
                    <View style={styles.nhomTopRow}>
                      <View
                        style={[
                          styles.nhomAvatar,
                          { backgroundColor: color + "20" },
                        ]}>
                        <Ionicons name={icon as any} size={20} color={color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.nhomName}>{item.tenNhom}</Text>
                        {item.moTa ? (
                          <Text style={styles.nhomMoTa} numberOfLines={1}>
                            {item.moTa}
                          </Text>
                        ) : (
                          <Text
                            style={[styles.nhomMoTa, { fontStyle: "italic" }]}>
                            Chưa có mô tả
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.nhomBadge,
                          {
                            backgroundColor: color + "15",
                            borderColor: color + "40",
                          },
                        ]}>
                        <Ionicons
                          name="medkit-outline"
                          size={11}
                          color={color}
                        />
                        <Text style={[styles.nhomBadgeText, { color }]}>
                          {item.soLuongThuoc}
                        </Text>
                        <Text style={[styles.nhomBadgeLabel, { color }]}>
                          loại
                        </Text>
                      </View>
                    </View>
                    <View style={styles.nhomActions}>
                      <View style={styles.nhomIdBadge}>
                        <Text style={styles.nhomIdText}>
                          #{String(item.id).padStart(3, "0")}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        style={[styles.nhomActionBtn, styles.nhomActionEdit]}
                        onPress={() => openEdit(item)}>
                        <Ionicons
                          name="create-outline"
                          size={14}
                          color={B.info}
                        />
                        <Text
                          style={[styles.nhomActionText, { color: B.info }]}>
                          Sửa
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.nhomActionBtn, styles.nhomActionDelete]}
                        onPress={() => handleDelete(item)}>
                        <Ionicons
                          name="trash-outline"
                          size={14}
                          color={B.danger}
                        />
                        <Text
                          style={[styles.nhomActionText, { color: B.danger }]}>
                          Xoá
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ── MODAL THÊM / SỬA ── */}
      <Modal
        visible={formVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFormVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalKAV}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              {/* Header */}
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalHeaderLeft}>
                  <View style={styles.modalHeaderIcon}>
                    <Ionicons name="grid" size={18} color={B.primary} />
                  </View>
                  <Text style={styles.modalTitle}>
                    {editItem ? "Sửa nhóm thuốc" : "Thêm nhóm thuốc"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setFormVisible(false)}
                  style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={B.textTitle} />
                </TouchableOpacity>
              </View>

              {/* Body cuộn */}
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalBodyContent}>
                {/* Tên nhóm */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>
                    Tên nhóm thuốc <Text style={{ color: B.danger }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.formInputWrap,
                      formError &&
                        !form.tenNhom.trim() &&
                        styles.formInputError,
                    ]}>
                    <Ionicons name="grid-outline" size={15} color={B.primary} />
                    <TextInput
                      style={styles.formInput}
                      value={form.tenNhom}
                      onChangeText={(v) => {
                        setForm({ ...form, tenNhom: v });
                        setFormError("");
                      }}
                      placeholder="Nhập tên nhóm thuốc"
                      placeholderTextColor={B.textSub}
                      autoFocus
                    />
                    {form.tenNhom.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setForm({ ...form, tenNhom: "" })}>
                        <Ionicons
                          name="close-circle"
                          size={15}
                          color={B.textSub}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {formError ? (
                    <Text style={styles.formErrorText}>{formError}</Text>
                  ) : null}
                </View>

                {/* Mô tả */}
                <View style={[styles.formField, { marginTop: 16 }]}>
                  <Text style={styles.formLabel}>Mô tả</Text>
                  <TextInput
                    style={styles.formTextArea}
                    value={form.moTa}
                    onChangeText={(v) => setForm({ ...form, moTa: v })}
                    placeholder="Nhập mô tả nhóm thuốc (tuỳ chọn)..."
                    placeholderTextColor={B.textSub}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Preview */}
                {form.tenNhom.trim().length > 0 && (
                  <View style={styles.previewBox}>
                    <Text style={styles.previewTitle}>Xem trước</Text>
                    <View style={styles.previewCard}>
                      <View
                        style={[
                          styles.previewAccent,
                          { backgroundColor: B.primary },
                        ]}
                      />
                      <View
                        style={[
                          styles.previewAvatar,
                          { backgroundColor: B.primary + "20" },
                        ]}>
                        <Ionicons name="medkit" size={16} color={B.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.previewName}>{form.tenNhom}</Text>
                        <Text style={styles.previewMoTa} numberOfLines={1}>
                          {form.moTa || "Chưa có mô tả"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.nhomBadge,
                          {
                            backgroundColor: B.primary + "15",
                            borderColor: B.primary + "40",
                          },
                        ]}>
                        <Ionicons
                          name="medkit-outline"
                          size={10}
                          color={B.primary}
                        />
                        <Text
                          style={[styles.nhomBadgeText, { color: B.primary }]}>
                          {editItem?.soLuongThuoc ?? 0}
                        </Text>
                        <Text
                          style={[styles.nhomBadgeLabel, { color: B.primary }]}>
                          loại
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setFormVisible(false)}>
                  <Text style={styles.cancelBtnText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Ionicons
                    name={editItem ? "checkmark" : "add"}
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.saveBtnText}>
                    {editItem ? "Lưu thay đổi" : "Thêm nhóm"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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

  searchCard: {
    backgroundColor: B.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 12,
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

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 14,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statNum: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 11, color: B.textSub, fontWeight: "500" },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  emptyText: { fontSize: 12, color: B.textSub },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: B.primary,
  },
  emptyAddText: { fontSize: 13, fontWeight: "700", color: B.primary },

  listWrap: { gap: 10 },

  nhomCard: {
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
  nhomAccent: { width: 5 },
  nhomContent: { flex: 1, padding: 14, gap: 10 },
  nhomTopRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  nhomAvatar: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  nhomName: {
    fontSize: 15,
    fontWeight: "800",
    color: B.textTitle,
    marginBottom: 3,
  },
  nhomMoTa: { fontSize: 12, color: B.textSub },
  nhomBadge: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  nhomBadgeText: { fontSize: 16, fontWeight: "800" },
  nhomBadgeLabel: { fontSize: 9, fontWeight: "600" },
  nhomActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  nhomIdBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nhomIdText: { fontSize: 11, color: B.textSub, fontWeight: "700" },
  nhomActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  nhomActionEdit: { borderColor: B.info + "50", backgroundColor: "#EFF6FF" },
  nhomActionDelete: {
    borderColor: B.danger + "50",
    backgroundColor: "#FFF0F0",
  },
  nhomActionText: { fontSize: 12, fontWeight: "700" },

  modalKAV: { flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: B.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "65%",
    maxHeight: "90%",
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
  modalHeaderRow: {
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
  modalTitle: { fontSize: 17, fontWeight: "800", color: B.textTitle },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBody: { flex: 1 },
  modalBodyContent: { padding: 16, paddingBottom: 8 },

  formField: {},
  formLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: B.textSub,
    marginBottom: 6,
  },
  formInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: B.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: B.white,
  },
  formInputError: { borderColor: B.danger },
  formInput: { flex: 1, fontSize: 14, color: B.textTitle, padding: 0 },
  formTextArea: {
    borderWidth: 1.5,
    borderColor: B.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
    color: B.textTitle,
    backgroundColor: B.white,
    minHeight: 90,
  },
  formErrorText: {
    fontSize: 11,
    color: B.danger,
    fontWeight: "600",
    marginTop: 5,
  },

  previewBox: { marginTop: 18, gap: 8 },
  previewTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: B.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    paddingVertical: 10,
    paddingRight: 12,
    overflow: "hidden",
  },
  previewAccent: {
    width: 4,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  previewAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  previewName: {
    fontSize: 13,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 2,
  },
  previewMoTa: { fontSize: 11, color: B.textSub },

  modalFooter: {
    flexDirection: "row",
    padding: 16,
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
});

export default Nhomthuocvattu;
