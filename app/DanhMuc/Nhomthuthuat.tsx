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
};

const PHONG_CHUC_NANG = [
  "Phòng khám tổng quát",
  "Phòng răng hàm mặt",
  "Phòng X-quang",
  "Phòng phẫu thuật",
  "Phòng điều dưỡng",
  "Phòng xét nghiệm",
];

interface ThuThuat {
  id: number;
  tenThuThuat: string;
  donGia: number;
  giamGia: number;
  hienThi: boolean;
}

interface NhomThuThuat {
  id: number;
  tenNhom: string;
  phongChucNang: string;
  hienThi: boolean;
  danhSachThuThuat: ThuThuat[];
}

const SAMPLE_DATA: NhomThuThuat[] = [
  {
    id: 1,
    tenNhom: "Khám & Chẩn đoán",
    phongChucNang: "Phòng khám tổng quát",
    hienThi: true,
    danhSachThuThuat: [
      {
        id: 1,
        tenThuThuat: "Khám tổng quát",
        donGia: 200000,
        giamGia: 0,
        hienThi: true,
      },
      {
        id: 2,
        tenThuThuat: "Khám chuyên khoa răng",
        donGia: 150000,
        giamGia: 10000,
        hienThi: true,
      },
      {
        id: 3,
        tenThuThuat: "Tư vấn điều trị",
        donGia: 100000,
        giamGia: 0,
        hienThi: false,
      },
    ],
  },
  {
    id: 2,
    tenNhom: "X-quang & Hình ảnh",
    phongChucNang: "Phòng X-quang",
    hienThi: true,
    danhSachThuThuat: [
      {
        id: 4,
        tenThuThuat: "Chụp X-quang toàn cảnh",
        donGia: 300000,
        giamGia: 0,
        hienThi: true,
      },
      {
        id: 5,
        tenThuThuat: "Chụp X-quang quanh chóp",
        donGia: 80000,
        giamGia: 0,
        hienThi: true,
      },
      {
        id: 6,
        tenThuThuat: "Chụp CT Cone Beam",
        donGia: 800000,
        giamGia: 50000,
        hienThi: true,
      },
    ],
  },
  {
    id: 3,
    tenNhom: "Phẫu thuật Nha khoa",
    phongChucNang: "Phòng phẫu thuật",
    hienThi: true,
    danhSachThuThuat: [
      {
        id: 7,
        tenThuThuat: "Nhổ răng thường",
        donGia: 200000,
        giamGia: 0,
        hienThi: true,
      },
      {
        id: 8,
        tenThuThuat: "Nhổ răng khôn mọc thẳng",
        donGia: 800000,
        giamGia: 0,
        hienThi: true,
      },
      {
        id: 9,
        tenThuThuat: "Nhổ răng khôn nằm ngang",
        donGia: 1500000,
        giamGia: 100000,
        hienThi: true,
      },
      {
        id: 10,
        tenThuThuat: "Cắt lợi trùm",
        donGia: 500000,
        giamGia: 0,
        hienThi: false,
      },
    ],
  },
  {
    id: 4,
    tenNhom: "Điều trị Nha khoa",
    phongChucNang: "Phòng răng hàm mặt",
    hienThi: false,
    danhSachThuThuat: [
      {
        id: 11,
        tenThuThuat: "Trám răng Composite",
        donGia: 350000,
        giamGia: 0,
        hienThi: true,
      },
      {
        id: 12,
        tenThuThuat: "Lấy cao răng siêu âm",
        donGia: 150000,
        giamGia: 10000,
        hienThi: true,
      },
    ],
  },
];

const Nhomthuthuat: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<NhomThuThuat[]>(SAMPLE_DATA);
  const [search, setSearch] = useState("");

  // Accordion
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
    new Set([1, 2]),
  );

  // Modal nhóm
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [editGroup, setEditGroup] = useState<NhomThuThuat | null>(null);
  const [groupForm, setGroupForm] = useState({
    tenNhom: "",
    phongChucNang: PHONG_CHUC_NANG[0],
  });
  const [showPhongPicker, setShowPhongPicker] = useState(false);

  // Modal thủ thuật
  const [ttModalVisible, setTtModalVisible] = useState(false);
  const [editTt, setEditTt] = useState<ThuThuat | null>(null);
  const [targetGroupId, setTargetGroupId] = useState<number | null>(null);
  const [ttForm, setTtForm] = useState({
    tenThuThuat: "",
    donGia: "",
    giamGia: "",
  });

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);

  const toggleGroup = (id: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Nhóm CRUD ──
  const openAddGroup = () => {
    setEditGroup(null);
    setGroupForm({ tenNhom: "", phongChucNang: PHONG_CHUC_NANG[0] });
    setGroupModalVisible(true);
  };

  const openEditGroup = (g: NhomThuThuat) => {
    setEditGroup(g);
    setGroupForm({ tenNhom: g.tenNhom, phongChucNang: g.phongChucNang });
    setGroupModalVisible(true);
  };

  const saveGroup = () => {
    if (!groupForm.tenNhom.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên nhóm thủ thuật.");
      return;
    }
    if (editGroup) {
      setData((prev) =>
        prev.map((g) =>
          g.id === editGroup.id
            ? {
                ...g,
                tenNhom: groupForm.tenNhom,
                phongChucNang: groupForm.phongChucNang,
              }
            : g,
        ),
      );
    } else {
      const newId = Math.max(...data.map((g) => g.id), 0) + 1;
      const newGroup: NhomThuThuat = {
        id: newId,
        tenNhom: groupForm.tenNhom,
        phongChucNang: groupForm.phongChucNang,
        hienThi: true,
        danhSachThuThuat: [],
      };
      setData((prev) => [...prev, newGroup]);
      setExpandedGroups((prev) => new Set([...prev, newId]));
    }
    setGroupModalVisible(false);
  };

  const deleteGroup = (id: number) => {
    Alert.alert(
      "Xác nhận xoá",
      "Xoá nhóm thủ thuật sẽ xoá toàn bộ thủ thuật bên trong. Tiếp tục?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () => setData((prev) => prev.filter((g) => g.id !== id)),
        },
      ],
    );
  };

  const toggleGroupVisible = (id: number) => {
    setData((prev) =>
      prev.map((g) => (g.id === id ? { ...g, hienThi: !g.hienThi } : g)),
    );
  };

  // ── Thủ thuật CRUD ──
  const openAddTt = (groupId: number) => {
    setEditTt(null);
    setTargetGroupId(groupId);
    setTtForm({ tenThuThuat: "", donGia: "", giamGia: "" });
    setTtModalVisible(true);
  };

  const openEditTt = (groupId: number, tt: ThuThuat) => {
    setEditTt(tt);
    setTargetGroupId(groupId);
    setTtForm({
      tenThuThuat: tt.tenThuThuat,
      donGia: String(tt.donGia),
      giamGia: String(tt.giamGia),
    });
    setTtModalVisible(true);
  };

  const saveTt = () => {
    if (!ttForm.tenThuThuat.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên thủ thuật.");
      return;
    }
    const donGia = Number(ttForm.donGia.replace(/\D/g, "")) || 0;
    const giamGia = Number(ttForm.giamGia.replace(/\D/g, "")) || 0;

    setData((prev) =>
      prev.map((g) => {
        if (g.id !== targetGroupId) return g;
        if (editTt) {
          return {
            ...g,
            danhSachThuThuat: g.danhSachThuThuat.map((t) =>
              t.id === editTt.id
                ? { ...t, tenThuThuat: ttForm.tenThuThuat, donGia, giamGia }
                : t,
            ),
          };
        } else {
          const newId =
            Math.max(
              ...g.danhSachThuThuat.map((t) => t.id),
              0,
              ...data.flatMap((gg) => gg.danhSachThuThuat.map((t) => t.id)),
            ) + 1;
          return {
            ...g,
            danhSachThuThuat: [
              ...g.danhSachThuThuat,
              {
                id: newId,
                tenThuThuat: ttForm.tenThuThuat,
                donGia,
                giamGia,
                hienThi: true,
              },
            ],
          };
        }
      }),
    );
    setTtModalVisible(false);
  };

  const deleteTt = (groupId: number, ttId: number) => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá thủ thuật này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () =>
          setData((prev) =>
            prev.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    danhSachThuThuat: g.danhSachThuThuat.filter(
                      (t) => t.id !== ttId,
                    ),
                  }
                : g,
            ),
          ),
      },
    ]);
  };

  const toggleTtVisible = (groupId: number, ttId: number) => {
    setData((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              danhSachThuThuat: g.danhSachThuThuat.map((t) =>
                t.id === ttId ? { ...t, hienThi: !t.hienThi } : t,
              ),
            }
          : g,
      ),
    );
  };

  // Lọc
  const filteredData = data.filter(
    (g) =>
      search === "" ||
      g.tenNhom.toLowerCase().includes(search.toLowerCase()) ||
      g.phongChucNang.toLowerCase().includes(search.toLowerCase()) ||
      g.danhSachThuThuat.some((t) =>
        t.tenThuThuat.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  const totalGroups = data.length;
  const totalVisible = data.filter((g) => g.hienThi).length;
  const totalTt = data.reduce((s, g) => s + g.danhSachThuThuat.length, 0);

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
            <Text style={styles.headerTitle}>Nhóm thủ thuật</Text>
            <Text style={styles.headerSub}>Quản lý danh mục thủ thuật</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={openAddGroup}>
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
              placeholder="Tìm nhóm, phòng, thủ thuật..."
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

        {/* THỐNG KÊ */}
        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: "#FEF2F2" }]}>
            <Ionicons name="grid-outline" size={16} color={B.primary} />
            <Text style={[styles.statNum, { color: B.primary }]}>
              {totalGroups}
            </Text>
            <Text style={styles.statLabel}>Nhóm</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: "#ECFDF5" }]}>
            <Ionicons name="eye-outline" size={16} color={B.success} />
            <Text style={[styles.statNum, { color: B.success }]}>
              {totalVisible}
            </Text>
            <Text style={styles.statLabel}>Đang hiện</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: "#EFF6FF" }]}>
            <Ionicons name="medkit-outline" size={16} color={B.info} />
            <Text style={[styles.statNum, { color: B.info }]}>{totalTt}</Text>
            <Text style={styles.statLabel}>Thủ thuật</Text>
          </View>
        </View>

        {/* DANH SÁCH NHÓM */}
        {filteredData.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="grid-outline" size={52} color={B.border} />
            <Text style={styles.emptyText}>Chưa có nhóm thủ thuật nào</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAddGroup}>
              <Ionicons name="add-circle" size={16} color={B.primary} />
              <Text style={styles.emptyAddText}>Thêm nhóm thủ thuật</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredData.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            const ttCount = group.danhSachThuThuat.length;
            const ttHienThi = group.danhSachThuThuat.filter(
              (t) => t.hienThi,
            ).length;

            return (
              <View
                key={group.id}
                style={[
                  styles.groupCard,
                  !group.hienThi && styles.groupCardHidden,
                ]}>
                {/* ── Header nhóm ── */}
                <TouchableOpacity
                  style={styles.groupHeader}
                  onPress={() => toggleGroup(group.id)}
                  activeOpacity={0.75}>
                  {/* Màu nhóm */}
                  <View
                    style={[
                      styles.groupColorBar,
                      { backgroundColor: group.hienThi ? B.primary : B.border },
                    ]}
                  />

                  <View style={styles.groupHeaderContent}>
                    <View style={styles.groupTitleRow}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.groupNameRow}>
                          <Text
                            style={[
                              styles.groupName,
                              !group.hienThi && { color: B.textSub },
                            ]}>
                            {group.tenNhom}
                          </Text>
                          {!group.hienThi && (
                            <View style={styles.hiddenBadge}>
                              <Ionicons
                                name="eye-off-outline"
                                size={10}
                                color={B.textSub}
                              />
                              <Text style={styles.hiddenBadgeText}>Ẩn</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.groupMeta}>
                          <Ionicons
                            name="business-outline"
                            size={11}
                            color={B.textSub}
                          />
                          <Text style={styles.groupMetaText}>
                            {group.phongChucNang}
                          </Text>
                        </View>
                      </View>

                      {/* Chips số lượng */}
                      <View style={styles.groupChips}>
                        <View style={styles.groupChip}>
                          <Text style={styles.groupChipNum}>{ttCount}</Text>
                          <Text style={styles.groupChipLabel}>TT</Text>
                        </View>
                        <View
                          style={[
                            styles.groupChip,
                            { backgroundColor: "#ECFDF5" },
                          ]}>
                          <Text
                            style={[styles.groupChipNum, { color: B.success }]}>
                            {ttHienThi}
                          </Text>
                          <Text
                            style={[
                              styles.groupChipLabel,
                              { color: B.success },
                            ]}>
                            Hiện
                          </Text>
                        </View>
                      </View>

                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={B.textSub}
                        style={{ marginLeft: 6 }}
                      />
                    </View>

                    {/* Nút nhóm */}
                    <View style={styles.groupActions}>
                      <TouchableOpacity
                        style={styles.groupActionBtn}
                        onPress={() => openAddTt(group.id)}>
                        <Ionicons
                          name="add-circle-outline"
                          size={14}
                          color={B.success}
                        />
                        <Text
                          style={[
                            styles.groupActionText,
                            { color: B.success },
                          ]}>
                          Thêm TT
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.groupActionBtn}
                        onPress={() => openEditGroup(group)}>
                        <Ionicons
                          name="create-outline"
                          size={14}
                          color={B.info}
                        />
                        <Text
                          style={[styles.groupActionText, { color: B.info }]}>
                          Sửa
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.groupActionBtn}
                        onPress={() => toggleGroupVisible(group.id)}>
                        <Ionicons
                          name={
                            group.hienThi ? "eye-off-outline" : "eye-outline"
                          }
                          size={14}
                          color={B.warning}
                        />
                        <Text
                          style={[
                            styles.groupActionText,
                            { color: B.warning },
                          ]}>
                          {group.hienThi ? "Ẩn" : "Hiện"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.groupActionBtn}
                        onPress={() => deleteGroup(group.id)}>
                        <Ionicons
                          name="trash-outline"
                          size={14}
                          color={B.danger}
                        />
                        <Text
                          style={[styles.groupActionText, { color: B.danger }]}>
                          Xoá
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* ── Danh sách thủ thuật ── */}
                {isExpanded && (
                  <View style={styles.ttList}>
                    {group.danhSachThuThuat.length === 0 ? (
                      <View style={styles.ttEmpty}>
                        <Ionicons
                          name="medkit-outline"
                          size={28}
                          color={B.border}
                        />
                        <Text style={styles.ttEmptyText}>
                          Chưa có thủ thuật nào
                        </Text>
                        <TouchableOpacity
                          style={styles.ttEmptyAdd}
                          onPress={() => openAddTt(group.id)}>
                          <Ionicons name="add" size={13} color={B.primary} />
                          <Text style={styles.ttEmptyAddText}>
                            Thêm thủ thuật
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        {/* Header bảng */}
                        <View style={styles.ttTableHeader}>
                          <Text style={[styles.ttHeaderCell, { flex: 2.5 }]}>
                            Tên thủ thuật
                          </Text>
                          <Text
                            style={[
                              styles.ttHeaderCell,
                              { flex: 1.3, textAlign: "right" },
                            ]}>
                            Đơn giá
                          </Text>
                          <Text
                            style={[
                              styles.ttHeaderCell,
                              { flex: 1, textAlign: "right" },
                            ]}>
                            Giảm giá
                          </Text>
                          <Text
                            style={[
                              styles.ttHeaderCell,
                              { flex: 0.9, textAlign: "center" },
                            ]}>
                            Hiện
                          </Text>
                          <Text
                            style={[
                              styles.ttHeaderCell,
                              { flex: 1.2, textAlign: "center" },
                            ]}>
                            Thao tác
                          </Text>
                        </View>

                        {group.danhSachThuThuat.map((tt, idx) => (
                          <View
                            key={tt.id}
                            style={[
                              styles.ttRow,
                              idx % 2 !== 0 && styles.ttRowAlt,
                              !tt.hienThi && styles.ttRowHidden,
                            ]}>
                            {/* Tên */}
                            <View
                              style={{
                                flex: 2.5,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                              }}>
                              <View
                                style={[
                                  styles.ttDot,
                                  {
                                    backgroundColor: tt.hienThi
                                      ? B.primary
                                      : B.border,
                                  },
                                ]}
                              />
                              <Text
                                style={[
                                  styles.ttNameText,
                                  !tt.hienThi && { color: B.textSub },
                                ]}
                                numberOfLines={2}>
                                {tt.tenThuThuat}
                              </Text>
                            </View>
                            {/* Đơn giá */}
                            <Text
                              style={[
                                styles.ttCell,
                                {
                                  flex: 1.3,
                                  textAlign: "right",
                                  color: B.primary,
                                  fontWeight: "700",
                                },
                              ]}>
                              {formatMoney(tt.donGia)}
                            </Text>
                            {/* Giảm giá */}
                            <Text
                              style={[
                                styles.ttCell,
                                {
                                  flex: 1,
                                  textAlign: "right",
                                  color: tt.giamGia > 0 ? B.warning : B.border,
                                },
                              ]}>
                              {tt.giamGia > 0
                                ? `-${formatMoney(tt.giamGia)}`
                                : "—"}
                            </Text>
                            {/* Toggle hiện/ẩn */}
                            <View style={{ flex: 0.9, alignItems: "center" }}>
                              <Switch
                                value={tt.hienThi}
                                onValueChange={() =>
                                  toggleTtVisible(group.id, tt.id)
                                }
                                trackColor={{
                                  false: B.border,
                                  true: B.success + "60",
                                }}
                                thumbColor={tt.hienThi ? B.success : "#ccc"}
                                style={{
                                  transform: [
                                    { scaleX: 0.75 },
                                    { scaleY: 0.75 },
                                  ],
                                }}
                              />
                            </View>
                            {/* Nút sửa/xóa */}
                            <View
                              style={{
                                flex: 1.2,
                                flexDirection: "row",
                                justifyContent: "center",
                                gap: 4,
                              }}>
                              <TouchableOpacity
                                style={styles.ttActionBtn}
                                onPress={() => openEditTt(group.id, tt)}>
                                <Ionicons
                                  name="create-outline"
                                  size={14}
                                  color={B.info}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.ttActionBtn,
                                  { backgroundColor: "#FFF0F0" },
                                ]}
                                onPress={() => deleteTt(group.id, tt.id)}>
                                <Ionicons
                                  name="trash-outline"
                                  size={14}
                                  color={B.danger}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}

                        {/* Footer tổng */}
                        <View style={styles.ttTableFooter}>
                          <Text style={styles.ttFooterLabel}>
                            {ttCount} thủ thuật · {ttHienThi} đang hiển thị
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── MODAL NHÓM ── */}
      <Modal
        visible={groupModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setGroupModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {editGroup ? "Sửa nhóm thủ thuật" : "Thêm nhóm thủ thuật"}
              </Text>
              <TouchableOpacity
                onPress={() => setGroupModalVisible(false)}
                style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}>
              <View style={{ gap: 16, paddingBottom: 30 }}>
                {/* Tên nhóm */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>
                    Tên nhóm thủ thuật{" "}
                    <Text style={{ color: B.danger }}>*</Text>
                  </Text>
                  <View style={styles.formInputWrap}>
                    <Ionicons name="grid-outline" size={15} color={B.primary} />
                    <TextInput
                      style={styles.formInput}
                      value={groupForm.tenNhom}
                      onChangeText={(v) =>
                        setGroupForm({ ...groupForm, tenNhom: v })
                      }
                      placeholder="Nhập tên nhóm thủ thuật"
                    />
                  </View>
                </View>

                {/* Phòng chức năng */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>
                    Thuộc phòng chức năng{" "}
                    <Text style={{ color: B.danger }}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.formInputWrap}
                    onPress={() => setShowPhongPicker(!showPhongPicker)}>
                    <Ionicons
                      name="business-outline"
                      size={15}
                      color={B.primary}
                    />
                    <Text
                      style={[
                        styles.formInput,
                        {
                          color: groupForm.phongChucNang
                            ? B.textTitle
                            : B.textSub,
                        },
                      ]}>
                      {groupForm.phongChucNang || "Chọn phòng chức năng"}
                    </Text>
                    <Ionicons
                      name={showPhongPicker ? "chevron-up" : "chevron-down"}
                      size={15}
                      color={B.textSub}
                    />
                  </TouchableOpacity>

                  {showPhongPicker && (
                    <View style={styles.pickerDropdown}>
                      {PHONG_CHUC_NANG.map((phong) => (
                        <TouchableOpacity
                          key={phong}
                          style={[
                            styles.pickerItem,
                            groupForm.phongChucNang === phong &&
                              styles.pickerItemActive,
                          ]}
                          onPress={() => {
                            setGroupForm({
                              ...groupForm,
                              phongChucNang: phong,
                            });
                            setShowPhongPicker(false);
                          }}>
                          <Ionicons
                            name="business-outline"
                            size={13}
                            color={
                              groupForm.phongChucNang === phong
                                ? B.primary
                                : B.textSub
                            }
                          />
                          <Text
                            style={[
                              styles.pickerItemText,
                              groupForm.phongChucNang === phong && {
                                color: B.primary,
                                fontWeight: "700",
                              },
                            ]}>
                            {phong}
                          </Text>
                          {groupForm.phongChucNang === phong && (
                            <Ionicons
                              name="checkmark"
                              size={14}
                              color={B.primary}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setGroupModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveGroup}>
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>
                  {editGroup ? "Lưu thay đổi" : "Thêm nhóm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL THỦ THUẬT ── */}
      <Modal
        visible={ttModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setTtModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {editTt ? "Sửa thủ thuật" : "Thêm thủ thuật"}
              </Text>
              <TouchableOpacity
                onPress={() => setTtModalVisible(false)}
                style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            {/* Tên nhóm */}
            {targetGroupId && (
              <View style={styles.ttModalGroup}>
                <Ionicons name="grid-outline" size={13} color={B.primary} />
                <Text style={styles.ttModalGroupText}>
                  {data.find((g) => g.id === targetGroupId)?.tenNhom}
                </Text>
              </View>
            )}

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}>
              <View style={{ gap: 16, paddingBottom: 30 }}>
                {/* Tên thủ thuật */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>
                    Tên thủ thuật <Text style={{ color: B.danger }}>*</Text>
                  </Text>
                  <View style={styles.formInputWrap}>
                    <Ionicons
                      name="medkit-outline"
                      size={15}
                      color={B.primary}
                    />
                    <TextInput
                      style={styles.formInput}
                      value={ttForm.tenThuThuat}
                      onChangeText={(v) =>
                        setTtForm({ ...ttForm, tenThuThuat: v })
                      }
                      placeholder="Nhập tên thủ thuật"
                    />
                  </View>
                </View>

                {/* Đơn giá + Giảm giá */}
                <View style={styles.formRow}>
                  <View style={[styles.formField, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Đơn giá (₫)</Text>
                    <View style={styles.formInputWrap}>
                      <Ionicons
                        name="cash-outline"
                        size={15}
                        color={B.primary}
                      />
                      <TextInput
                        style={styles.formInput}
                        value={ttForm.donGia}
                        onChangeText={(v) =>
                          setTtForm({ ...ttForm, donGia: v.replace(/\D/g, "") })
                        }
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    {ttForm.donGia !== "" && (
                      <Text style={styles.moneyPreview}>
                        {formatMoney(Number(ttForm.donGia))}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.formField, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Giảm giá (₫)</Text>
                    <View style={styles.formInputWrap}>
                      <Ionicons
                        name="pricetag-outline"
                        size={15}
                        color={B.warning}
                      />
                      <TextInput
                        style={styles.formInput}
                        value={ttForm.giamGia}
                        onChangeText={(v) =>
                          setTtForm({
                            ...ttForm,
                            giamGia: v.replace(/\D/g, ""),
                          })
                        }
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    {ttForm.giamGia !== "" && Number(ttForm.giamGia) > 0 && (
                      <Text style={[styles.moneyPreview, { color: B.warning }]}>
                        -{formatMoney(Number(ttForm.giamGia))}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Preview thành tiền */}
                {ttForm.donGia !== "" && (
                  <View style={styles.previewBox}>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Đơn giá</Text>
                      <Text style={styles.previewVal}>
                        {formatMoney(Number(ttForm.donGia) || 0)}
                      </Text>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Giảm giá</Text>
                      <Text style={[styles.previewVal, { color: B.warning }]}>
                        {Number(ttForm.giamGia) > 0
                          ? `-${formatMoney(Number(ttForm.giamGia))}`
                          : "—"}
                      </Text>
                    </View>
                    <View style={styles.previewDivider} />
                    <View style={styles.previewRow}>
                      <Text
                        style={[
                          styles.previewLabel,
                          { fontWeight: "700", color: B.textTitle },
                        ]}>
                        Thành tiền
                      </Text>
                      <Text
                        style={[
                          styles.previewVal,
                          { fontWeight: "800", color: B.primary, fontSize: 15 },
                        ]}>
                        {formatMoney(
                          (Number(ttForm.donGia) || 0) -
                            (Number(ttForm.giamGia) || 0),
                        )}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setTtModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveTt}>
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>
                  {editTt ? "Lưu thay đổi" : "Thêm thủ thuật"}
                </Text>
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

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 3,
    borderWidth: 1,
    borderColor: B.border,
  },
  statNum: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, color: B.textSub, fontWeight: "600" },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 13, color: B.textSub },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: B.primary,
  },
  emptyAddText: { fontSize: 13, fontWeight: "700", color: B.primary },

  // Group card
  groupCard: {
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
  groupCardHidden: { opacity: 0.65 },
  groupHeader: { flexDirection: "row" },
  groupColorBar: { width: 5 },
  groupHeaderContent: { flex: 1, padding: 12 },
  groupTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  groupNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  groupName: { fontSize: 15, fontWeight: "800", color: B.textTitle },
  hiddenBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hiddenBadgeText: { fontSize: 10, color: B.textSub, fontWeight: "600" },
  groupMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  groupMetaText: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  groupChips: { flexDirection: "row", gap: 5 },
  groupChip: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  groupChipNum: { fontSize: 14, fontWeight: "800", color: B.primary },
  groupChipLabel: { fontSize: 9, color: B.primary, fontWeight: "600" },
  groupActions: { flexDirection: "row", gap: 6 },
  groupActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "#F8FAFC",
  },
  groupActionText: { fontSize: 11, fontWeight: "700" },

  // TT list
  ttList: { borderTopWidth: 1, borderTopColor: B.border },
  ttEmpty: { alignItems: "center", paddingVertical: 24, gap: 6 },
  ttEmptyText: { fontSize: 12, color: B.textSub },
  ttEmptyAdd: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.primary,
  },
  ttEmptyAddText: { fontSize: 12, fontWeight: "700", color: B.primary },

  ttTableHeader: {
    flexDirection: "row",
    backgroundColor: B.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  ttHeaderCell: { fontSize: 10, fontWeight: "700", color: "#fff" },

  ttRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  ttRowAlt: { backgroundColor: "#FAFAFA" },
  ttRowHidden: { opacity: 0.5 },
  ttCell: { fontSize: 11, color: B.textTitle },
  ttCellView: {}, // View container - no text styles
  ttDot: { width: 7, height: 7, borderRadius: 4 },
  ttNameText: { flex: 1, fontSize: 11, color: B.textTitle, fontWeight: "600" },
  ttActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  ttTableFooter: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  ttFooterLabel: { fontSize: 11, color: B.textSub, fontWeight: "500" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: B.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
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
  modalBody: { paddingHorizontal: 16, paddingTop: 16 },
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

  // Form
  formRow: { flexDirection: "row", gap: 10 },
  formField: { gap: 6 },
  formLabel: { fontSize: 12, fontWeight: "700", color: B.textSub },
  formInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: B.white,
  },
  formInput: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
  moneyPreview: {
    fontSize: 11,
    color: B.primary,
    fontWeight: "600",
    marginTop: 3,
    marginLeft: 4,
  },

  pickerDropdown: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: B.white,
  },
  pickerItemActive: { backgroundColor: "#FEF2F2" },
  pickerItemText: {
    flex: 1,
    fontSize: 13,
    color: B.textTitle,
    fontWeight: "500",
  },

  ttModalGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FEF2F2",
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  ttModalGroupText: { fontSize: 12, fontWeight: "700", color: B.primary },

  previewBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: B.border,
    gap: 6,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  previewVal: { fontSize: 13, color: B.textTitle, fontWeight: "600" },
  previewDivider: { height: 1, backgroundColor: B.border },
});

export default Nhomthuthuat;
