import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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

const GENDERS = ["Nam", "Nữ"];

const ROLES = [
  "Bác sỹ thực hiện",
  "Bác sỹ chỉ định",
  "Bác sỹ kê đơn",
  "Người giới thiệu",
  "Lễ tân",
  "Kế toán",
  "Dược",
  "Bác sỹ siêu âm",
  "KTV X-Quang",
  "Điều dưỡng",
  "Bác sỹ giải phẫu bệnh",
  "Bác sỹ nội",
  "KTV-Xét nghiệm",
  "Bác sỹ Sản phụ khoa",
  "Cử nhân xét nghiệm",
  "Khác",
];

const EMPLOYEE_ICONS = [
  "person",
  "person-add",
  "person-circle",
  "happy",
  "person-outline",
  "people",
];
const EMPLOYEE_COLORS = [
  B.primary,
  B.success,
  B.info,
  B.warning,
  "#8B5CF6",
  "#EC4899",
];

interface Employee {
  id: string;
  fullName: string;
  yearOfBirth: string;
  gender: string;
  cccd: string;
  phone: string;
  address: string;
  notes: string;
  role: string;
  isVisible: boolean;
}

export default function QuanLyNhanVien() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      fullName: "Nguyễn Văn A",
      yearOfBirth: "1985",
      gender: "Nam",
      cccd: "123456789012",
      phone: "0901234567",
      address: "123 Đường Nguyễn Huệ, Quận 1, TP HCM",
      notes: "Bác sỹ giỏi, có kinh nghiệm 15 năm",
      role: "Bác sỹ thực hiện",
      isVisible: true,
    },
    {
      id: "2",
      fullName: "Trần Thị B",
      yearOfBirth: "1990",
      gender: "Nữ",
      cccd: "234567890123",
      phone: "0912345678",
      address: "456 Đường Lê Lợi, Quận 1, TP HCM",
      notes: "Quản lý y tế chuyên nghiệp",
      role: "Điều dưỡng",
      isVisible: true,
    },
    {
      id: "3",
      fullName: "Phạm Minh C",
      yearOfBirth: "1988",
      gender: "Nam",
      cccd: "345678901234",
      phone: "0923456789",
      address: "789 Đường Trần Hưng Đạo, Quận 5, TP HCM",
      notes: "Chuyên khoa về dược",
      role: "Dược",
      isVisible: true,
    },
    {
      id: "4",
      fullName: "Hồ Thảo D",
      yearOfBirth: "1992",
      gender: "Nữ",
      cccd: "456789012345",
      phone: "0934567890",
      address: "321 Đường Ngô Quyền, Quận 3, TP HCM",
      notes: "Xét nghiệm y học lâm sàng",
      role: "KTV-Xét nghiệm",
      isVisible: true,
    },
    {
      id: "5",
      fullName: "Lê Hùng E",
      yearOfBirth: "1987",
      gender: "Nam",
      cccd: "567890123456",
      phone: "0945678901",
      address: "654 Đường Cách Mạng Tháng 8, Quận 10, TP HCM",
      notes: "Kỹ thuật viên X-Quang",
      role: "KTV X-Quang",
      isVisible: true,
    },
    {
      id: "6",
      fullName: "Đặng Hương F",
      yearOfBirth: "1995",
      gender: "Nữ",
      cccd: "678901234567",
      phone: "0956789012",
      address: "987 Đường Phan Xích Long, Quận Phú Nhuận, TP HCM",
      notes: "Lễ tân, chuyên phục vụ khách hàng",
      role: "Lễ tân",
      isVisible: true,
    },
  ]);
  const [formVisible, setFormVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editItem, setEditItem] = useState<Employee | null>(null);
  const [genderDropVisible, setGenderDropVisible] = useState(false);
  const [roleDropVisible, setRoleDropVisible] = useState(false);
  const [roleFilterDropVisible, setRoleFilterDropVisible] = useState(false);
  const [formError, setFormError] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string>("");

  const [form, setForm] = useState({
    fullName: "",
    yearOfBirth: "",
    gender: "",
    cccd: "",
    phone: "",
    address: "",
    notes: "",
    role: "",
  });

  const filteredData = employees.filter(
    (e) =>
      (roleFilter === "" || e.role === roleFilter) &&
      (search === "" ||
        e.fullName.toLowerCase().includes(search.toLowerCase()) ||
        e.phone.toLowerCase().includes(search.toLowerCase())),
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({
      fullName: "",
      yearOfBirth: "",
      gender: "",
      cccd: "",
      phone: "",
      address: "",
      notes: "",
      role: "",
    });
    setFormError([]);
    setFormVisible(true);
  };

  const openEdit = (item: Employee) => {
    setEditItem(item);
    setForm({
      fullName: item.fullName,
      yearOfBirth: item.yearOfBirth,
      gender: item.gender,
      cccd: item.cccd,
      phone: item.phone,
      address: item.address,
      notes: item.notes,
      role: item.role,
    });
    setFormError([]);
    setFormVisible(true);
  };

  const handleSave = () => {
    const errors: string[] = [];

    if (!form.fullName.trim()) {
      errors.push("Họ và tên nhân viên");
    }
    if (!form.gender) {
      errors.push("Giới tính");
    }
    if (!form.role) {
      errors.push("Vai trò");
    }

    if (errors.length > 0) {
      setFormError(errors);
      return;
    }

    if (editItem) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === editItem.id
            ? {
                ...e,
                fullName: form.fullName.trim(),
                yearOfBirth: form.yearOfBirth.trim(),
                gender: form.gender,
                cccd: form.cccd.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                notes: form.notes.trim(),
                role: form.role,
              }
            : e,
        ),
      );
    } else {
      const newId = Date.now().toString();
      setEmployees((prev) => [
        ...prev,
        {
          id: newId,
          fullName: form.fullName.trim(),
          yearOfBirth: form.yearOfBirth.trim(),
          gender: form.gender,
          cccd: form.cccd.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          notes: form.notes.trim(),
          role: form.role,
          isVisible: true,
        },
      ]);
    }
    setFormVisible(false);
  };

  const handleDelete = (item: Employee) => {
    Alert.alert(
      "Xác nhận xoá",
      `Bạn có chắc muốn xoá nhân viên "${item.fullName}"?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () =>
            setEmployees((prev) => prev.filter((e) => e.id !== item.id)),
        },
      ],
    );
  };

  const toggleVisibility = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isVisible: !e.isVisible } : e)),
    );
  };

  const getEmpColor = (idx: number) =>
    EMPLOYEE_COLORS[idx % EMPLOYEE_COLORS.length];
  const getEmpIcon = (idx: number) =>
    EMPLOYEE_ICONS[idx % EMPLOYEE_ICONS.length];
  const totalEmployees = employees.length;
  const visibleCount = employees.filter((e) => e.isVisible).length;

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
            <Text style={styles.headerTitle}>Quản Lý Nhân Viên</Text>
            <Text style={styles.headerSub}>Danh sách nhân viên y tế</Text>
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
        {/* SEARCH */}
        <View style={styles.searchCard}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm tên, SĐT nhân viên..."
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
              <Ionicons name="people" size={20} color={B.primary} />
            </View>
            <View>
              <Text style={[styles.statNum, { color: B.primary }]}>
                {totalEmployees}
              </Text>
              <Text style={styles.statLabel}>Tổng nhân viên</Text>
            </View>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#EFF6FF" }]}>
            <View style={[styles.statIcon, { backgroundColor: B.info + "20" }]}>
              <Ionicons name="eye" size={20} color={B.info} />
            </View>
            <View>
              <Text style={[styles.statNum, { color: B.info }]}>
                {visibleCount}
              </Text>
              <Text style={styles.statLabel}>Đang hiển thị</Text>
            </View>
          </View>
        </View>

        {/* DANH SÁCH */}
        {filteredData.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={56} color={B.border} />
            <Text style={styles.emptyTitle}>Chưa có nhân viên nào</Text>
            <Text style={styles.emptyText}>
              Nhấn nút + để thêm nhân viên mới
            </Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
              <Ionicons name="add-circle" size={16} color={B.primary} />
              <Text style={styles.emptyAddText}>Thêm nhân viên</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filteredData.map((item, idx) => {
              const color = getEmpColor(idx);
              const icon = getEmpIcon(idx);
              return (
                <View key={item.id} style={styles.empCard}>
                  <View
                    style={[styles.empAccent, { backgroundColor: color }]}
                  />
                  <View style={styles.empContent}>
                    {/* ROW 1: Avatar + Name + Role + Visibility */}
                    <View style={styles.empRow1}>
                      <View
                        style={[styles.empAvatar, { backgroundColor: color }]}>
                        <Ionicons name={icon as any} size={22} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.empName}>{item.fullName}</Text>
                        <Text style={styles.empRole}>{item.role}</Text>
                      </View>
                      <View
                        style={[
                          styles.empVisibility,
                          {
                            backgroundColor: item.isVisible
                              ? "#D1FAE5"
                              : "#FEE2E2",
                          },
                        ]}>
                        <Ionicons
                          name={item.isVisible ? "eye" : "eye-off"}
                          size={13}
                          color={item.isVisible ? B.success : B.danger}
                        />
                      </View>
                    </View>

                    {/* ROW 2: Year of Birth + Gender + Phone */}
                    <View style={styles.empRow2}>
                      <View style={styles.infoItem}>
                        <Ionicons
                          name="calendar"
                          size={10}
                          color={B.textSub}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.empSmallText} numberOfLines={1}>
                          {item.yearOfBirth || "N/A"}
                        </Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.infoItem}>
                        <Ionicons
                          name={item.gender === "Nam" ? "male" : "female"}
                          size={10}
                          color={B.textSub}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.empSmallText}>{item.gender}</Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.infoItem}>
                        <Ionicons
                          name="call"
                          size={10}
                          color={B.textSub}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.empSmallText} numberOfLines={1}>
                          {item.phone || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* ROW 3: Address */}
                    <View style={styles.empRow3}>
                      <Ionicons
                        name="location"
                        size={10}
                        color={B.textSub}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.empSmallText} numberOfLines={2}>
                        {item.address || "N/A"}
                      </Text>
                    </View>

                    <View style={styles.empActions}>
                      <TouchableOpacity
                        style={styles.empActionBtn}
                        onPress={() => toggleVisibility(item.id)}>
                        <Ionicons
                          name={item.isVisible ? "eye" : "eye-off"}
                          size={14}
                          color={B.primary}
                        />
                        <Text style={styles.empActionText}>
                          {item.isVisible ? "Ẩn" : "Hiện"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.empActionBtn, styles.empActionEdit]}
                        onPress={() => openEdit(item)}>
                        <Ionicons name="pencil" size={14} color={B.info} />
                        <Text style={[styles.empActionText, { color: B.info }]}>
                          Sửa
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.empActionBtn, styles.empActionDelete]}
                        onPress={() => handleDelete(item)}>
                        <Ionicons name="trash" size={14} color={B.danger} />
                        <Text
                          style={[styles.empActionText, { color: B.danger }]}>
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
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 32}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              {/* Header */}
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalHeaderLeft}>
                  <View style={styles.modalHeaderIcon}>
                    <Ionicons
                      name={editItem ? "person" : "person-add"}
                      size={18}
                      color={B.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>
                      {editItem ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên Mới"}
                    </Text>
                    {focusedField && (
                      <Text style={styles.focusedFieldLabel}>
                        Đang chỉnh sửa: {focusedField}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setFormVisible(false)}
                  style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={B.textTitle} />
                </TouchableOpacity>
              </View>

              {/* Body */}
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={true}
                contentContainerStyle={styles.modalBodyContent}>
                {/* Full Name */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>
                    Họ và tên <Text style={{ color: B.danger }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.formInputWrap,
                      formError && !form.fullName.trim()
                        ? styles.formInputError
                        : {},
                    ]}>
                    <Ionicons
                      name="person-outline"
                      size={15}
                      color={B.primary}
                    />
                    <TextInput
                      style={styles.formInput}
                      value={form.fullName}
                      onChangeText={(v) => setForm({ ...form, fullName: v })}
                      onFocus={() => setFocusedField("Họ và tên")}
                      onBlur={() => setFocusedField("")}
                      placeholder="Vd: Nguyễn Văn A"
                      placeholderTextColor={B.textSub}
                      autoFocus
                    />
                    {form.fullName && (
                      <TouchableOpacity
                        onPress={() => setForm({ ...form, fullName: "" })}>
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={B.border}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Year of Birth */}
                <View style={[styles.formField, { marginTop: 10 }]}>
                  <Text style={styles.formLabel}>Năm sinh</Text>
                  <View style={styles.formInputWrap}>
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color={B.primary}
                    />
                    <TextInput
                      style={styles.formInput}
                      value={form.yearOfBirth}
                      onChangeText={(v) => setForm({ ...form, yearOfBirth: v })}
                      onFocus={() => setFocusedField("Năm sinh")}
                      onBlur={() => setFocusedField("")}
                      placeholder="YYYY"
                      placeholderTextColor={B.textSub}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Gender */}
                <View style={[styles.formField, { marginTop: 10 }]}>
                  <Text style={styles.formLabel}>
                    Giới tính <Text style={{ color: B.danger }}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.formCombo,
                      formError && !form.gender ? styles.formInputError : {},
                    ]}
                    onPress={() => setGenderDropVisible(true)}>
                    <Ionicons
                      name={form.gender === "Nam" ? "male" : "female"}
                      size={15}
                      color={B.primary}
                    />
                    <Text
                      style={[
                        styles.formComboText,
                        !form.gender && { color: B.textSub },
                      ]}>
                      {form.gender || "Chọn giới tính"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={B.primary} />
                  </TouchableOpacity>
                </View>

                {/* Gender Dropdown */}
                <Modal
                  visible={genderDropVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setGenderDropVisible(false)}>
                  <TouchableOpacity
                    style={styles.dropdownBg}
                    onPress={() => setGenderDropVisible(false)}
                    activeOpacity={1}>
                    <View style={styles.dropdownBox}>
                      {GENDERS.map((g) => (
                        <TouchableOpacity
                          key={g}
                          style={styles.dropdownItemBox}
                          onPress={() => {
                            setForm({ ...form, gender: g });
                            setGenderDropVisible(false);
                          }}>
                          <Ionicons
                            name={g === "Nam" ? "male" : "female"}
                            size={14}
                            color={B.primary}
                            style={{ marginRight: 8 }}
                          />
                          <Text style={styles.dropdownItemText}>{g}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* CCCD */}
                <View style={[styles.formField, { marginTop: 10 }]}>
                  <Text style={styles.formLabel}>Số CCCD</Text>
                  <View style={styles.formInputWrap}>
                    <Ionicons name="card-outline" size={15} color={B.primary} />
                    <TextInput
                      style={styles.formInput}
                      value={form.cccd}
                      onChangeText={(v) => setForm({ ...form, cccd: v })}
                      onFocus={() => setFocusedField("Số CCCD")}
                      onBlur={() => setFocusedField("")}
                      placeholder="Nhập số CCCD"
                      placeholderTextColor={B.textSub}
                    />
                  </View>
                </View>

                {/* Phone */}
                <View style={[styles.formField, { marginTop: 10 }]}>
                  <Text style={styles.formLabel}>Điện thoại</Text>
                  <View style={styles.formInputWrap}>
                    <Ionicons name="call-outline" size={15} color={B.primary} />
                    <TextInput
                      style={styles.formInput}
                      value={form.phone}
                      onChangeText={(v) => setForm({ ...form, phone: v })}
                      onFocus={() => setFocusedField("Điện thoại")}
                      onBlur={() => setFocusedField("")}
                      placeholder="+84 ..."
                      placeholderTextColor={B.textSub}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Address */}
                <View style={[styles.formField, { marginTop: 10 }]}>
                  <Text style={styles.formLabel}>Địa chỉ</Text>
                  <View style={styles.formInputWrap}>
                    <Ionicons
                      name="location-outline"
                      size={15}
                      color={B.primary}
                    />
                    <TextInput
                      style={styles.formInput}
                      value={form.address}
                      onChangeText={(v) => setForm({ ...form, address: v })}
                      onFocus={() => setFocusedField("Địa chỉ")}
                      onBlur={() => setFocusedField("")}
                      placeholder="Nhập địa chỉ"
                      placeholderTextColor={B.textSub}
                    />
                  </View>
                </View>

                {/* Notes */}
                <View style={[styles.formField, { marginTop: 10 }]}>
                  <Text style={styles.formLabel}>Ghi chú</Text>
                  <TextInput
                    style={styles.formTextArea}
                    value={form.notes}
                    onChangeText={(v) => setForm({ ...form, notes: v })}
                    onFocus={() => setFocusedField("Ghi chú")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Nhập ghi chú..."
                    placeholderTextColor={B.textSub}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Role */}
                <View style={[styles.formField, { marginTop: 10 }]}>
                  <Text style={styles.formLabel}>
                    Vai trò <Text style={{ color: B.danger }}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.formCombo,
                      formError && !form.role ? styles.formInputError : {},
                    ]}
                    onPress={() => setRoleDropVisible(true)}>
                    <Ionicons
                      name="briefcase-outline"
                      size={15}
                      color={B.primary}
                    />
                    <Text
                      style={[
                        styles.formComboText,
                        !form.role && { color: B.textSub },
                      ]}>
                      {form.role || "Chọn vai trò"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={B.primary} />
                  </TouchableOpacity>
                </View>

                {/* Role Dropdown */}
                <Modal
                  visible={roleDropVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setRoleDropVisible(false)}>
                  <TouchableOpacity
                    style={styles.dropdownBg}
                    onPress={() => setRoleDropVisible(false)}
                    activeOpacity={1}>
                    <View style={styles.dropdownBox}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {ROLES.map((role) => (
                          <TouchableOpacity
                            key={role}
                            style={styles.dropdownItemBox}
                            onPress={() => {
                              setForm({ ...form, role });
                              setRoleDropVisible(false);
                            }}>
                            <Ionicons
                              name="briefcase"
                              size={14}
                              color={B.primary}
                              style={{ marginRight: 8 }}
                            />
                            <Text style={styles.dropdownItemText}>{role}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {formError ? (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={14} color={B.danger} />
                    <Text style={styles.errorText}>{formError}</Text>
                  </View>
                ) : null}

                {/* Preview */}
                {form.fullName.trim() && (
                  <View style={styles.previewBox}>
                    <Text style={styles.previewTitle}>Xem trước</Text>
                    <View style={styles.previewCard}>
                      <View
                        style={[
                          styles.previewAccent,
                          { backgroundColor: B.primary },
                        ]}
                      />
                      <View style={styles.previewContent}>
                        <Text style={styles.previewName}>{form.fullName}</Text>
                        <Text style={styles.previewRole}>
                          {form.role || "Chưa chọn vai trò"}
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
                    {editItem ? "Cập Nhật" : "Thêm Mới"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

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
    gap: 8,
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
  roleFilterBtn: {
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
  roleFilterText: {
    flex: 1,
    fontSize: 13,
    color: B.textTitle,
    fontWeight: "500",
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

  listWrap: { gap: 8 },

  empCard: {
    flexDirection: "row",
    backgroundColor: B.white,
    borderRadius: 12,
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
  empAccent: { width: 4 },
  empContent: { flex: 1, padding: 10, gap: 6 },

  empRow1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  empRow2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  empRow3: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },

  empAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  empName: {
    fontSize: 14,
    fontWeight: "800",
    color: B.textTitle,
    marginBottom: 2,
  },
  empRole: { fontSize: 10, color: B.textSub, fontWeight: "500" },
  empVisibility: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: B.border,
    marginHorizontal: 3,
  },
  empSmallText: { fontSize: 9, color: B.textSub, fontWeight: "400" },

  notesBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 2,
  },
  notesText: { fontSize: 9, color: B.textSub, lineHeight: 13 },

  empActions: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginTop: 2,
  },
  empActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.border,
    backgroundColor: "#F8FAFC",
  },
  empActionEdit: { borderColor: B.info + "50", backgroundColor: "#EFF6FF" },
  empActionDelete: {
    borderColor: B.danger + "50",
    backgroundColor: "#FFF0F0",
  },
  empActionText: { fontSize: 10, fontWeight: "700", color: B.primary },

  // MODAL STYLES
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
    minHeight: "75%",
    maxHeight: "98%",
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
  focusedFieldLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: B.primary,
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBody: { flex: 1 },
  modalBodyContent: { padding: 12, paddingBottom: 20 },

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
  formCombo: {
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
  formComboText: {
    flex: 1,
    fontSize: 14,
    color: B.textTitle,
  },
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
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF0F0",
    borderLeftWidth: 3,
    borderLeftColor: B.danger,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: B.danger,
    fontWeight: "600",
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
  previewContent: { flex: 1, paddingLeft: 12 },
  previewName: {
    fontSize: 13,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 2,
  },
  previewRole: { fontSize: 11, color: B.textSub },

  dropdownBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingTop: 0,
  },
  dropdownBox: {
    marginHorizontal: 16,
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    maxHeight: 300,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 5 },
    }),
  },
  dropdownItemBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  dropdownItemText: {
    fontSize: 13,
    color: B.textTitle,
    fontWeight: "500",
  },

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
