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

interface Permission {
  id: string;
  name: string;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  print: boolean;
}

interface PermissionGroup {
  group: string;
  permissions: Permission[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    group: "HỒ SƠ BỆNH ÁN",
    permissions: [
      {
        id: "1",
        name: "Đăng kí khám bệnh",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "2",
        name: "Danh sách bệnh nhân khám bệnh",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "3",
        name: "Danh sách kê đơn thuốc",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "4",
        name: "Danh sách lịch hẹn",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "5",
        name: "Phiếu thu",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "6",
        name: "Phiếu chi",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
    ],
  },
  {
    group: "DANH MỤC",
    permissions: [
      {
        id: "7",
        name: "Nhóm thủ thuật",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "8",
        name: "Thuốc – mẫu đơn thuốc",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "9",
        name: "Kho thuốc",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "10",
        name: "Nhóm thuốc",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "11",
        name: "Các khoản thu",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "12",
        name: "Các khoản chi",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "13",
        name: "Phòng chức năng",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
    ],
  },
  {
    group: "KHO THUỐC",
    permissions: [
      {
        id: "14",
        name: "Nhập thuốc",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "15",
        name: "Xuất thuốc",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "16",
        name: "Báo cáo nhập kho",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "17",
        name: "Báo cáo xuất kho",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "18",
        name: "Báo cáo nhập xuất tồn",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
    ],
  },
  {
    group: "BÁO CÁO",
    permissions: [
      {
        id: "19",
        name: "Danh sách bệnh nhân khám bệnh",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "20",
        name: "Báo cáo thủ thuật theo bác sĩ",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "21",
        name: "Danh sách bệnh nhân nợ tiền",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "22",
        name: "Báo cáo tổng hợp thu chi",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
    ],
  },
  {
    group: "HỆ THỐNG",
    permissions: [
      {
        id: "23",
        name: "Quản lý nhân viên",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "24",
        name: "Phân quyền chức năng",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "25",
        name: "Gửi email tự động",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
      {
        id: "26",
        name: "Đăng ký bản quyền",
        view: false,
        add: false,
        edit: false,
        delete: false,
        print: false,
      },
    ],
  },
];

const EMPLOYEE_DATA: Employee[] = [
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

export default function PhanQuyenChucNang() {
  const router = useRouter();
  const [employees] = useState<Employee[]>(EMPLOYEE_DATA);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissions, setPermissions] =
    useState<PermissionGroup[]>(PERMISSION_GROUPS);
  const [employeePermissions, setEmployeePermissions] = useState<{
    [empId: string]: PermissionGroup[];
  }>({});

  const filteredEmployees = employees.filter(
    (e) =>
      search === "" ||
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.toLowerCase().includes(search.toLowerCase()),
  );

  const openPermissionModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    const savedPerms = employeePermissions[employee.id];
    if (savedPerms) {
      setPermissions(JSON.parse(JSON.stringify(savedPerms)));
    } else {
      setPermissions(JSON.parse(JSON.stringify(PERMISSION_GROUPS)));
    }
    setPermissionModalVisible(true);
  };

  const togglePermission = (
    groupIndex: number,
    permIndex: number,
    permType: keyof Omit<Permission, "id" | "name">,
  ) => {
    const newPermissions = [...permissions];
    const perm = newPermissions[groupIndex].permissions[permIndex];
    (perm[permType] as boolean) = !(perm[permType] as boolean);
    setPermissions(newPermissions);
  };

  const toggleAllPermissions = (
    groupIndex: number,
    permType: keyof Omit<Permission, "id" | "name">,
    value: boolean,
  ) => {
    const newPermissions = [...permissions];
    newPermissions[groupIndex].permissions.forEach((p) => {
      (p[permType] as boolean) = value;
    });
    setPermissions(newPermissions);
  };

  const savePermissions = () => {
    if (selectedEmployee) {
      setEmployeePermissions((prev) => ({
        ...prev,
        [selectedEmployee.id]: JSON.parse(JSON.stringify(permissions)),
      }));
      Alert.alert(
        "Thành công",
        `Đã lưu quyền cho ${selectedEmployee.fullName}`,
        [
          {
            text: "OK",
            onPress: () => setPermissionModalVisible(false),
          },
        ],
      );
    }
  };

  const countPermissions = (empId: string): number => {
    const empPerms = employeePermissions[empId];
    if (!empPerms) return 0;
    let count = 0;
    empPerms.forEach((group) => {
      group.permissions.forEach((perm) => {
        if (perm.view || perm.add || perm.edit || perm.delete || perm.print) {
          count++;
        }
      });
    });
    return count;
  };

  const getDetailedPermissions = (
    empId: string,
  ): { name: string; types: string[] }[] => {
    const empPerms = employeePermissions[empId];
    if (!empPerms) return [];
    const result: { name: string; types: string[] }[] = [];

    const typeMap = {
      view: "Xem",
      add: "Thêm",
      edit: "Sửa",
      delete: "Xóa",
      print: "In",
    };

    empPerms.forEach((group) => {
      group.permissions.forEach((perm) => {
        const types: string[] = [];
        if (perm.view) types.push(typeMap.view);
        if (perm.add) types.push(typeMap.add);
        if (perm.edit) types.push(typeMap.edit);
        if (perm.delete) types.push(typeMap.delete);
        if (perm.print) types.push(typeMap.print);

        if (types.length > 0) {
          result.push({
            name: perm.name,
            types,
          });
        }
      });
    });

    return result;
  };

  const getEmpColor = (idx: number) =>
    EMPLOYEE_COLORS[idx % EMPLOYEE_COLORS.length];
  const getEmpIcon = (idx: number) =>
    EMPLOYEE_ICONS[idx % EMPLOYEE_ICONS.length];

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
            <Text style={styles.headerTitle}>Phân quyền chức năng</Text>
            <Text style={styles.headerSub}>Quản lý quyền truy cập</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* SEARCH */}
        <View style={styles.searchCard}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={B.textSub} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm nhân viên..."
              placeholderTextColor={B.textSub}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* EMPLOYEE LIST */}
        {filteredEmployees.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={48} color={B.border} />
            <Text style={styles.emptyTitle}>Không có nhân viên</Text>
            <Text style={styles.emptyText}>
              Hãy thêm nhân viên để phân quyền
            </Text>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filteredEmployees.map((e, idx) => {
              const color = getEmpColor(idx);
              const icon = getEmpIcon(idx);

              return (
                <TouchableOpacity
                  key={e.id}
                  style={styles.empCard}
                  onPress={() => openPermissionModal(e)}>
                  <View
                    style={[styles.empAccent, { backgroundColor: color }]}
                  />
                  <View style={styles.empContent}>
                    <View style={styles.empRow1}>
                      <View
                        style={[styles.empAvatar, { backgroundColor: color }]}>
                        <Ionicons name={icon as any} size={22} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.empName}>{e.fullName}</Text>
                        <Text style={styles.empRole}>{e.role}</Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={B.border}
                      />
                    </View>
                    <View style={styles.empRow2}>
                      <View style={styles.infoItem}>
                        <Ionicons
                          name="calendar"
                          size={10}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.empSmallText}>{e.yearOfBirth}</Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.infoItem}>
                        <Ionicons
                          name={e.gender === "Nam" ? "male" : "female"}
                          size={10}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.empSmallText}>{e.gender}</Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.infoItem}>
                        <Ionicons
                          name="call"
                          size={10}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.empSmallText}>{e.phone}</Text>
                      </View>
                    </View>
                    <View style={styles.empRow3Perms}>
                      <Ionicons
                        name="shield-checkmark"
                        size={10}
                        color={B.primary}
                      />
                      <View style={{ flex: 1 }}>
                        {getDetailedPermissions(e.id).length === 0 ? (
                          <Text style={styles.empPermsText}>
                            Chưa cấp quyền
                          </Text>
                        ) : (
                          <>
                            {getDetailedPermissions(e.id)
                              .slice(0, 2)
                              .map((perm, idx) => (
                                <Text
                                  key={idx}
                                  style={styles.empPermItem}
                                  numberOfLines={1}>
                                  {perm.name}: {perm.types.join(", ")}
                                </Text>
                              ))}
                            {getDetailedPermissions(e.id).length > 2 && (
                              <Text style={styles.empPermMore}>
                                +{getDetailedPermissions(e.id).length - 2} chức
                                năng khác
                              </Text>
                            )}
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* PERMISSION MODAL */}
      <Modal
        visible={permissionModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPermissionModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {/* MODAL HEADER */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalHeaderIcon}>
                  <Ionicons name="lock-closed" size={18} color={B.danger} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>
                    {selectedEmployee?.fullName}
                  </Text>
                  <Text style={styles.modalSub}>{selectedEmployee?.role}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setPermissionModalVisible(false)}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            {/* PERMISSIONS */}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}>
              <View style={styles.modalBodyContent}>
                {permissions.map((group, groupIdx) => (
                  <View key={groupIdx} style={styles.groupBox}>
                    <Text style={styles.groupTitle}>{group.group}</Text>

                    {group.permissions.map((perm, permIdx) => (
                      <View key={perm.id} style={styles.permissionItem}>
                        <Text style={styles.permissionName}>{perm.name}</Text>
                        <View style={styles.permissionCheckboxes}>
                          <TouchableOpacity
                            style={[
                              styles.permissionPill,
                              perm.view && styles.permissionPillActive,
                            ]}
                            onPress={() =>
                              togglePermission(groupIdx, permIdx, "view")
                            }>
                            <Ionicons
                              name={perm.view ? "eye" : "eye-outline"}
                              size={12}
                              color={perm.view ? "#fff" : B.primary}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={[
                                styles.permissionPillText,
                                perm.view && styles.permissionPillTextActive,
                              ]}>
                              Xem
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.permissionPill,
                              perm.add && styles.permissionPillActive,
                            ]}
                            onPress={() =>
                              togglePermission(groupIdx, permIdx, "add")
                            }>
                            <Ionicons
                              name={
                                perm.add ? "add-circle" : "add-circle-outline"
                              }
                              size={12}
                              color={perm.add ? "#fff" : B.primary}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={[
                                styles.permissionPillText,
                                perm.add && styles.permissionPillTextActive,
                              ]}>
                              Thêm
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.permissionPill,
                              perm.edit && styles.permissionPillActive,
                            ]}
                            onPress={() =>
                              togglePermission(groupIdx, permIdx, "edit")
                            }>
                            <Ionicons
                              name={perm.edit ? "pencil" : "pencil-outline"}
                              size={12}
                              color={perm.edit ? "#fff" : B.primary}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={[
                                styles.permissionPillText,
                                perm.edit && styles.permissionPillTextActive,
                              ]}>
                              Sửa
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.permissionPill,
                              perm.delete && styles.permissionPillActive,
                            ]}
                            onPress={() =>
                              togglePermission(groupIdx, permIdx, "delete")
                            }>
                            <Ionicons
                              name={perm.delete ? "trash" : "trash-outline"}
                              size={12}
                              color={perm.delete ? "#fff" : B.danger}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={[
                                styles.permissionPillText,
                                perm.delete &&
                                  styles.permissionPillDeleteActive,
                              ]}>
                              Xóa
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.permissionPill,
                              perm.print && styles.permissionPillActive,
                            ]}
                            onPress={() =>
                              togglePermission(groupIdx, permIdx, "print")
                            }>
                            <Ionicons
                              name={perm.print ? "print" : "print-outline"}
                              size={12}
                              color={perm.print ? "#fff" : B.primary}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={[
                                styles.permissionPillText,
                                perm.print && styles.permissionPillTextActive,
                              ]}>
                              In
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setPermissionModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={savePermissions}>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Lưu quyền</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  emptyText: { fontSize: 12, color: B.textSub },

  listWrap: { gap: 8 },

  empCard: {
    flexDirection: "row",
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    padding: 0,
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

  empRow3Perms: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginTop: 4,
  },
  empPermsText: {
    fontSize: 9,
    color: B.primary,
    fontWeight: "600",
  },
  empPermItem: {
    fontSize: 8,
    color: B.primary,
    fontWeight: "500",
    lineHeight: 12,
  },
  empPermMore: {
    fontSize: 8,
    color: B.textSub,
    fontWeight: "400",
    fontStyle: "italic",
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: B.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "92%",
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
  modalSub: { fontSize: 11, color: B.textSub, marginTop: 2 },
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

  groupBox: { marginBottom: 18 },
  groupTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: B.primary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  permissionItem: {
    backgroundColor: B.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    padding: 10,
    marginBottom: 6,
  },
  permissionName: {
    fontSize: 12,
    fontWeight: "600",
    color: B.textTitle,
    marginBottom: 8,
  },
  permissionCheckboxes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  permissionPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: B.primary,
    backgroundColor: B.white,
    minWidth: 60,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: B.border,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  permissionPillActive: {
    backgroundColor: B.primary,
    borderColor: B.primary,
    ...Platform.select({
      ios: {
        shadowColor: B.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  permissionPillText: {
    fontSize: 11,
    color: B.primary,
    fontWeight: "600",
  },
  permissionPillTextActive: {
    color: "#fff",
  },
  permissionPillDeleteActive: {
    color: "#fff",
  },
  checkboxWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 55,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: B.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: B.white,
  },
  checkboxActive: {
    backgroundColor: B.primary,
    borderColor: B.primary,
  },
  checkboxLabel: {
    fontSize: 9,
    color: B.textSub,
    fontWeight: "500",
    marginTop: 0,
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
