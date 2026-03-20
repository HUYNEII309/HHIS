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

interface KhoThuoc {
  id: number;
  tenKho: string;
  moTa: string;
  soLuongThuoc: number;
}

const SAMPLE_DATA: KhoThuoc[] = [
  {
    id: 1,
    tenKho: "Kho chính",
    moTa: "Kho thuốc tổng hợp toàn phòng khám",
    soLuongThuoc: 45,
  },
  {
    id: 2,
    tenKho: "Kho nha khoa",
    moTa: "Thuốc và vật tư chuyên dùng nha khoa",
    soLuongThuoc: 18,
  },
  {
    id: 3,
    tenKho: "Kho phẫu thuật",
    moTa: "Thuốc dùng trong ca phẫu thuật",
    soLuongThuoc: 12,
  },
  {
    id: 4,
    tenKho: "Kho ngoại trú",
    moTa: "Thuốc cấp phát cho bệnh nhân ngoại trú",
    soLuongThuoc: 30,
  },
];

const KHO_ICONS = ["archive", "medkit", "cube", "folder", "layers", "server"];
const KHO_COLORS = [
  B.primary,
  B.info,
  B.success,
  B.warning,
  "#8B5CF6",
  "#EC4899",
];

const Khothuocpk: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<KhoThuoc[]>(SAMPLE_DATA);
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editItem, setEditItem] = useState<KhoThuoc | null>(null);
  const [form, setForm] = useState({ tenKho: "", moTa: "" });
  const [formError, setFormError] = useState("");

  const filteredData = data.filter(
    (k) =>
      search === "" ||
      k.tenKho.toLowerCase().includes(search.toLowerCase()) ||
      k.moTa.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ tenKho: "", moTa: "" });
    setFormError("");
    setFormVisible(true);
  };

  const openEdit = (item: KhoThuoc) => {
    setEditItem(item);
    setForm({ tenKho: item.tenKho, moTa: item.moTa });
    setFormError("");
    setFormVisible(true);
  };

  const handleSave = () => {
    if (!form.tenKho.trim()) {
      setFormError("Vui lòng nhập tên kho thuốc.");
      return;
    }
    const isDuplicate = data.some(
      (k) =>
        k.tenKho.toLowerCase() === form.tenKho.trim().toLowerCase() &&
        k.id !== editItem?.id,
    );
    if (isDuplicate) {
      setFormError("Tên kho thuốc đã tồn tại.");
      return;
    }
    if (editItem) {
      setData((prev) =>
        prev.map((k) =>
          k.id === editItem.id
            ? { ...k, tenKho: form.tenKho.trim(), moTa: form.moTa.trim() }
            : k,
        ),
      );
    } else {
      const newId = Math.max(...data.map((k) => k.id), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          tenKho: form.tenKho.trim(),
          moTa: form.moTa.trim(),
          soLuongThuoc: 0,
        },
      ]);
    }
    setFormVisible(false);
  };

  const handleDelete = (item: KhoThuoc) => {
    Alert.alert(
      "Xác nhận xoá",
      `Xoá kho "${item.tenKho}"?\n${item.soLuongThuoc > 0 ? `⚠️ Kho đang chứa ${item.soLuongThuoc} loại thuốc.` : ""}`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () =>
            setData((prev) => prev.filter((k) => k.id !== item.id)),
        },
      ],
    );
  };

  const getKhoColor = (idx: number) => KHO_COLORS[idx % KHO_COLORS.length];
  const getKhoIcon = (idx: number) => KHO_ICONS[idx % KHO_ICONS.length];
  const totalKho = data.length;
  const totalThuoc = data.reduce((s, k) => s + k.soLuongThuoc, 0);

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
            <Text style={styles.headerTitle}>Kho thuốc</Text>
            <Text style={styles.headerSub}>Quản lý kho thuốc phòng khám</Text>
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
              placeholder="Tìm tên kho, mô tả..."
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
              <Ionicons name="archive" size={20} color={B.primary} />
            </View>
            <View>
              <Text style={[styles.statNum, { color: B.primary }]}>
                {totalKho}
              </Text>
              <Text style={styles.statLabel}>Tổng kho</Text>
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
            <Ionicons name="archive-outline" size={56} color={B.border} />
            <Text style={styles.emptyTitle}>Chưa có kho thuốc nào</Text>
            <Text style={styles.emptyText}>
              Nhấn nút + để thêm kho thuốc mới
            </Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
              <Ionicons name="add-circle" size={16} color={B.primary} />
              <Text style={styles.emptyAddText}>Thêm kho thuốc</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filteredData.map((item, idx) => {
              const color = getKhoColor(idx);
              const icon = getKhoIcon(idx);
              return (
                <View key={item.id} style={styles.khoCard}>
                  <View
                    style={[styles.khoAccent, { backgroundColor: color }]}
                  />
                  <View style={styles.khoContent}>
                    <View style={styles.khoTopRow}>
                      <View
                        style={[
                          styles.khoAvatar,
                          { backgroundColor: color + "20" },
                        ]}>
                        <Ionicons name={icon as any} size={20} color={color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.khoName}>{item.tenKho}</Text>
                        {item.moTa ? (
                          <Text style={styles.khoMoTa} numberOfLines={1}>
                            {item.moTa}
                          </Text>
                        ) : (
                          <Text
                            style={[styles.khoMoTa, { fontStyle: "italic" }]}>
                            Chưa có mô tả
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.khoBadge,
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
                        <Text style={[styles.khoBadgeText, { color }]}>
                          {item.soLuongThuoc}
                        </Text>
                        <Text style={[styles.khoBadgeLabel, { color }]}>
                          loại
                        </Text>
                      </View>
                    </View>
                    <View style={styles.khoActions}>
                      <View style={styles.khoIdBadge}>
                        <Text style={styles.khoIdText}>
                          #{String(item.id).padStart(3, "0")}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        style={[styles.khoActionBtn, styles.khoActionEdit]}
                        onPress={() => openEdit(item)}>
                        <Ionicons
                          name="create-outline"
                          size={14}
                          color={B.info}
                        />
                        <Text style={[styles.khoActionText, { color: B.info }]}>
                          Sửa
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.khoActionBtn, styles.khoActionDelete]}
                        onPress={() => handleDelete(item)}>
                        <Ionicons
                          name="trash-outline"
                          size={14}
                          color={B.danger}
                        />
                        <Text
                          style={[styles.khoActionText, { color: B.danger }]}>
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
                    <Ionicons name="archive" size={18} color={B.primary} />
                  </View>
                  <Text style={styles.modalTitle}>
                    {editItem ? "Sửa kho thuốc" : "Thêm kho thuốc"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setFormVisible(false)}
                  style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={B.textTitle} />
                </TouchableOpacity>
              </View>

              {/* Body cuộn được */}
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalBodyContent}>
                {/* Tên kho */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>
                    Tên kho thuốc <Text style={{ color: B.danger }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.formInputWrap,
                      formError && !form.tenKho.trim() && styles.formInputError,
                    ]}>
                    <Ionicons
                      name="archive-outline"
                      size={15}
                      color={B.primary}
                    />
                    <TextInput
                      style={styles.formInput}
                      value={form.tenKho}
                      onChangeText={(v) => {
                        setForm({ ...form, tenKho: v });
                        setFormError("");
                      }}
                      placeholder="Nhập tên kho thuốc"
                      placeholderTextColor={B.textSub}
                      autoFocus
                    />
                    {form.tenKho.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setForm({ ...form, tenKho: "" })}>
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
                    placeholder="Nhập mô tả kho thuốc (tuỳ chọn)..."
                    placeholderTextColor={B.textSub}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Preview */}
                {form.tenKho.trim().length > 0 && (
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
                        <Ionicons name="archive" size={16} color={B.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.previewName}>{form.tenKho}</Text>
                        <Text style={styles.previewMoTa} numberOfLines={1}>
                          {form.moTa || "Chưa có mô tả"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.khoBadge,
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
                          style={[styles.khoBadgeText, { color: B.primary }]}>
                          {editItem?.soLuongThuoc ?? 0}
                        </Text>
                        <Text
                          style={[styles.khoBadgeLabel, { color: B.primary }]}>
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
                    {editItem ? "Lưu thay đổi" : "Thêm kho"}
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

  khoCard: {
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
  khoAccent: { width: 5 },
  khoContent: { flex: 1, padding: 14, gap: 10 },
  khoTopRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  khoAvatar: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  khoName: {
    fontSize: 15,
    fontWeight: "800",
    color: B.textTitle,
    marginBottom: 3,
  },
  khoMoTa: { fontSize: 12, color: B.textSub },
  khoBadge: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  khoBadgeText: { fontSize: 16, fontWeight: "800" },
  khoBadgeLabel: { fontSize: 9, fontWeight: "600" },
  khoActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  khoIdBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  khoIdText: { fontSize: 11, color: B.textSub, fontWeight: "700" },
  khoActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  khoActionEdit: { borderColor: B.info + "50", backgroundColor: "#EFF6FF" },
  khoActionDelete: { borderColor: B.danger + "50", backgroundColor: "#FFF0F0" },
  khoActionText: { fontSize: 12, fontWeight: "700" },

  // Modal
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
    // chiều cao tối thiểu 65% màn hình
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

  // Body dùng ScrollView — flex: 1 để chiếm phần còn lại giữa header và footer
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

export default Khothuocpk;
