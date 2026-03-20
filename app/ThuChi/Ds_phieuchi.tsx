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
  purple: "#8B5CF6",
  orange: "#EA580C",
};

type LoaiChi = "muavp" | "luong" | "dichvu" | "khac";
type HinhThuc = "tienmat" | "chuyenkhoan";

interface PhieuChi {
  id: number;
  maPhieu: string;
  thoiGian: string;
  nguoiChi: string;
  nguoiNhan: string;
  dienThoai: string;
  diaChi: string;
  soTien: number;
  noiDung: string;
  loaiChi: LoaiChi;
  hinhThuc: HinhThuc;
}

const LOAI_CONFIG: Record<
  LoaiChi,
  { label: string; color: string; bg: string; icon: string }
> = {
  muavp: {
    label: "Mua vật phẩm / thuốc",
    color: B.orange,
    bg: "#FFF7ED",
    icon: "cart-outline",
  },
  luong: {
    label: "Chi lương nhân viên",
    color: B.primary,
    bg: "#FEF2F2",
    icon: "people-outline",
  },
  dichvu: {
    label: "Chi dịch vụ / tiện ích",
    color: B.info,
    bg: "#EFF6FF",
    icon: "construct-outline",
  },
  khac: {
    label: "Chi khác",
    color: B.purple,
    bg: "#F5F3FF",
    icon: "ellipsis-horizontal-circle-outline",
  },
};

const HINH_THUC_CONFIG: Record<
  HinhThuc,
  { label: string; color: string; bg: string; icon: string }
> = {
  tienmat: {
    label: "Tiền mặt",
    color: B.warning,
    bg: "#FFFBEB",
    icon: "cash-outline",
  },
  chuyenkhoan: {
    label: "Chuyển khoản",
    color: B.info,
    bg: "#EFF6FF",
    icon: "card-outline",
  },
};

const getCurrentDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const getCurrentDateTime = () => {
  const now = new Date();
  const d = getCurrentDate();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${d} ${h}:${m}`;
};

const SAMPLE_DATA: PhieuChi[] = [
  {
    id: 1,
    maPhieu: "PC0001",
    thoiGian: "2026-03-20 08:00",
    nguoiChi: "Nguyễn Thị Mai",
    nguoiNhan: "Công ty TNHH Dược Hà Nội",
    dienThoai: "0241234567",
    diaChi: "12 Bà Triệu, Hà Nội",
    soTien: 4500000,
    noiDung: "Mua thuốc kháng sinh, giảm đau tháng 3/2026",
    loaiChi: "muavp",
    hinhThuc: "chuyenkhoan",
  },
  {
    id: 2,
    maPhieu: "PC0002",
    thoiGian: "2026-03-20 09:30",
    nguoiChi: "Trần Văn Bình",
    nguoiNhan: "Nguyễn Thị Lan",
    dienThoai: "0901111222",
    diaChi: "56 Trần Hưng Đạo, Nam Định",
    soTien: 8000000,
    noiDung: "Chi lương tháng 3/2026 - BS. Nguyễn Thị Hoa",
    loaiChi: "luong",
    hinhThuc: "chuyenkhoan",
  },
  {
    id: 3,
    maPhieu: "PC0003",
    thoiGian: "2026-03-20 10:00",
    nguoiChi: "Lê Thị Hoa",
    nguoiNhan: "Điện lực Nam Định",
    dienThoai: "0251888999",
    diaChi: "78 Hàng Đồng, Nam Định",
    soTien: 1250000,
    noiDung: "Thanh toán tiền điện tháng 3/2026",
    loaiChi: "dichvu",
    hinhThuc: "chuyenkhoan",
  },
  {
    id: 4,
    maPhieu: "PC0004",
    thoiGian: "2026-03-20 11:00",
    nguoiChi: "Nguyễn Thị Mai",
    nguoiNhan: "Cửa hàng văn phòng phẩm Minh Khai",
    dienThoai: "0912333444",
    diaChi: "34 Minh Khai, Nam Định",
    soTien: 350000,
    noiDung: "Mua văn phòng phẩm: giấy A4, bút, hồ sơ",
    loaiChi: "muavp",
    hinhThuc: "tienmat",
  },
  {
    id: 5,
    maPhieu: "PC0005",
    thoiGian: "2026-03-20 14:00",
    nguoiChi: "Trần Văn Bình",
    nguoiNhan: "Công ty TNHH Sửa chữa Thiết bị Y tế",
    dienThoai: "0281234567",
    diaChi: "90 Lê Lợi, Hà Nội",
    soTien: 2200000,
    noiDung: "Sửa chữa máy X-quang, thay linh kiện định kỳ",
    loaiChi: "dichvu",
    hinhThuc: "tienmat",
  },
  {
    id: 6,
    maPhieu: "PC0006",
    thoiGian: "2026-03-20 15:00",
    nguoiChi: "Lê Thị Hoa",
    nguoiNhan: "Phạm Văn Toàn",
    dienThoai: "0934567890",
    diaChi: "22 Hoàng Văn Thụ, Nam Định",
    soTien: 500000,
    noiDung: "Chi phí vận chuyển thiết bị từ Hà Nội về Nam Định",
    loaiChi: "khac",
    hinhThuc: "tienmat",
  },
  {
    id: 7,
    maPhieu: "PC0007",
    thoiGian: "2026-03-19 09:00",
    nguoiChi: "Nguyễn Thị Mai",
    nguoiNhan: "Công ty Nước sạch Nam Định",
    dienThoai: "0251777888",
    diaChi: "15 Trần Phú, Nam Định",
    soTien: 180000,
    noiDung: "Thanh toán tiền nước tháng 3/2026",
    loaiChi: "dichvu",
    hinhThuc: "chuyenkhoan",
  },
  {
    id: 8,
    maPhieu: "PC0008",
    thoiGian: "2026-03-19 14:30",
    nguoiChi: "Trần Văn Bình",
    nguoiNhan: "Trần Thị Nhung",
    dienThoai: "0923456789",
    diaChi: "67 Nguyễn Trãi, Nam Định",
    soTien: 5500000,
    noiDung: "Chi lương tháng 3/2026 - Điều dưỡng Trần Thị Nhung",
    loaiChi: "luong",
    hinhThuc: "chuyenkhoan",
  },
];

const EMPTY_FORM: Omit<PhieuChi, "id" | "maPhieu"> = {
  thoiGian: getCurrentDateTime(),
  nguoiChi: "",
  nguoiNhan: "",
  dienThoai: "",
  diaChi: "",
  soTien: 0,
  noiDung: "",
  loaiChi: "muavp",
  hinhThuc: "tienmat",
};

const Ds_phieuchi: React.FC = () => {
  const router = useRouter();

  const [tuNgay, setTuNgay] = useState(getCurrentDate());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [search, setSearch] = useState("");
  const [filterLoai, setFilterLoai] = useState<"all" | LoaiChi>("all");
  const [filterHinhThuc, setFilterHinhThuc] = useState<"all" | HinhThuc>("all");
  const [data, setData] = useState<PhieuChi[]>(SAMPLE_DATA);

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<PhieuChi | null>(null);
  const [form, setForm] =
    useState<Omit<PhieuChi, "id" | "maPhieu">>(EMPTY_FORM);

  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [printItem, setPrintItem] = useState<PhieuChi | null>(null);

  const formatDate = (s: string) => {
    const [y, m, d] = s.split(" ")[0].split("-");
    return `${d}/${m}/${y}`;
  };

  const formatDateTime = (s: string) => {
    const [date, time] = s.split(" ");
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y} ${time ?? ""}`;
  };

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);

  const getDate = (s: string) => s.split(" ")[0];

  const baseData = data.filter((item) => {
    const d = getDate(item.thoiGian);
    const inRange = d >= tuNgay && d <= denNgay;
    const q = search.toLowerCase();
    const matchSearch =
      search === "" ||
      item.nguoiNhan.toLowerCase().includes(q) ||
      item.nguoiChi.toLowerCase().includes(q) ||
      item.maPhieu.toLowerCase().includes(q) ||
      item.noiDung.toLowerCase().includes(q) ||
      item.dienThoai.includes(search);
    return inRange && matchSearch;
  });

  const filteredData = baseData.filter((item) => {
    const matchLoai = filterLoai === "all" || item.loaiChi === filterLoai;
    const matchHT =
      filterHinhThuc === "all" || item.hinhThuc === filterHinhThuc;
    return matchLoai && matchHT;
  });

  const grouped = filteredData.reduce<Record<string, PhieuChi[]>>(
    (acc, item) => {
      const d = getDate(item.thoiGian);
      if (!acc[d]) acc[d] = [];
      acc[d].push(item);
      return acc;
    },
    {},
  );
  const groupedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const tongChi = filteredData.reduce((s, i) => s + i.soTien, 0);
  const tongTienMat = filteredData
    .filter((i) => i.hinhThuc === "tienmat")
    .reduce((s, i) => s + i.soTien, 0);
  const tongCK = filteredData
    .filter((i) => i.hinhThuc === "chuyenkhoan")
    .reduce((s, i) => s + i.soTien, 0);

  const handleAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, thoiGian: getCurrentDateTime() });
    setFormModalVisible(true);
  };

  const handleEdit = (item: PhieuChi) => {
    setEditItem(item);
    setForm({
      thoiGian: item.thoiGian,
      nguoiChi: item.nguoiChi,
      nguoiNhan: item.nguoiNhan,
      dienThoai: item.dienThoai,
      diaChi: item.diaChi,
      soTien: item.soTien,
      noiDung: item.noiDung,
      loaiChi: item.loaiChi,
      hinhThuc: item.hinhThuc,
    });
    setFormModalVisible(true);
  };

  const handleSave = () => {
    if (!form.nguoiChi || !form.nguoiNhan || form.soTien <= 0) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập đầy đủ người chi, người nhận và số tiền.",
      );
      return;
    }
    if (editItem) {
      setData((prev) =>
        prev.map((i) => (i.id === editItem.id ? { ...editItem, ...form } : i)),
      );
    } else {
      const newId = Math.max(...data.map((i) => i.id), 0) + 1;
      setData((prev) => [
        ...prev,
        { id: newId, maPhieu: `PC${String(newId).padStart(4, "0")}`, ...form },
      ]);
    }
    setFormModalVisible(false);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá phiếu chi này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => setData((prev) => prev.filter((i) => i.id !== id)),
      },
    ]);
  };

  const handlePrint = (item: PhieuChi) => {
    setPrintItem(item);
    setPrintModalVisible(true);
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
            <Text style={styles.headerTitle}>Danh sách phiếu chi</Text>
            <Text style={styles.headerSub}>Quản lý chi phí phòng khám</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
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
              placeholder="Tìm mã phiếu, người nhận, người chi, nội dung..."
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

          {/* Lọc loại chi */}
          <View>
            <Text style={styles.filterGroupLabel}>Loại phiếu chi</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipRow}>
              {(
                [
                  {
                    key: "all",
                    label: "Tất cả",
                    color: B.textTitle,
                    activeBg: B.primary,
                  },
                  {
                    key: "muavp",
                    label: "Mua vật phẩm/thuốc",
                    color: B.orange,
                    activeBg: B.orange,
                  },
                  {
                    key: "luong",
                    label: "Chi lương",
                    color: B.primary,
                    activeBg: B.primary,
                  },
                  {
                    key: "dichvu",
                    label: "Dịch vụ/tiện ích",
                    color: B.info,
                    activeBg: B.info,
                  },
                  {
                    key: "khac",
                    label: "Chi khác",
                    color: B.purple,
                    activeBg: B.purple,
                  },
                ] as any[]
              ).map((c) => {
                const isA = filterLoai === c.key;
                return (
                  <TouchableOpacity
                    key={c.key}
                    style={[
                      styles.filterChip,
                      isA && {
                        backgroundColor: c.activeBg,
                        borderColor: c.activeBg,
                      },
                    ]}
                    onPress={() => setFilterLoai(c.key)}>
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isA ? "#fff" : c.color },
                      ]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Lọc hình thức */}
          <View>
            <Text style={styles.filterGroupLabel}>Hình thức thanh toán</Text>
            <View style={styles.filterChipRow}>
              {(
                [
                  { key: "all", label: "Tất cả", activeBg: B.primary },
                  { key: "tienmat", label: "💵 Tiền mặt", activeBg: B.warning },
                  {
                    key: "chuyenkhoan",
                    label: "🏦 C.Khoản",
                    activeBg: B.info,
                  },
                ] as any[]
              ).map((c) => {
                const isA = filterHinhThuc === c.key;
                return (
                  <TouchableOpacity
                    key={c.key}
                    style={[
                      styles.filterChip,
                      { flex: 1 },
                      isA && {
                        backgroundColor: c.activeBg,
                        borderColor: c.activeBg,
                      },
                    ]}
                    onPress={() => setFilterHinhThuc(c.key)}>
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isA ? "#fff" : B.textSub },
                      ]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* THỐNG KÊ */}
        <View style={styles.statsCard}>
          <View style={styles.statMain}>
            <Text style={styles.statMainLabel}>Tổng chi</Text>
            <Text style={styles.statMainValue}>{formatMoney(tongChi)}</Text>
            <Text style={styles.statMainSub}>
              {filteredData.length} phiếu chi
            </Text>
          </View>
          <View style={styles.statDividerV} />
          <View style={styles.statSide}>
            <View style={styles.statSideItem}>
              <View
                style={[styles.statSideDot, { backgroundColor: B.warning }]}
              />
              <View>
                <Text style={styles.statSideLabel}>Tiền mặt</Text>
                <Text style={[styles.statSideValue, { color: B.warning }]}>
                  {formatMoney(tongTienMat)}
                </Text>
              </View>
            </View>
            <View style={styles.statSideDivider} />
            <View style={styles.statSideItem}>
              <View style={[styles.statSideDot, { backgroundColor: B.info }]} />
              <View>
                <Text style={styles.statSideLabel}>Chuyển khoản</Text>
                <Text style={[styles.statSideValue, { color: B.info }]}>
                  {formatMoney(tongCK)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* DANH SÁCH */}
        {groupedDates.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="document-outline" size={52} color={B.border} />
            <Text style={styles.emptyText}>
              Không có phiếu chi trong khoảng thời gian này
            </Text>
          </View>
        ) : (
          groupedDates.map((date) => {
            const tongNgay = grouped[date].reduce((s, i) => s + i.soTien, 0);
            return (
              <View key={date} style={styles.dateGroup}>
                <View style={styles.dateGroupHeader}>
                  <View style={styles.dateGroupDot} />
                  <Text style={styles.dateGroupTitle}>{formatDate(date)}</Text>
                  <View style={styles.dateGroupLine} />
                  <Text style={styles.dateGroupCount}>
                    {grouped[date].length} phiếu
                  </Text>
                  <Text style={styles.dateGroupTotal}>
                    {formatMoney(tongNgay)}
                  </Text>
                </View>

                {grouped[date].map((item) => {
                  const loai = LOAI_CONFIG[item.loaiChi];
                  const ht = HINH_THUC_CONFIG[item.hinhThuc];
                  return (
                    <View key={item.id} style={styles.chiCard}>
                      <View
                        style={[
                          styles.cardAccent,
                          { backgroundColor: loai.color },
                        ]}
                      />
                      <View style={styles.cardContent}>
                        {/* Hàng 1: Mã + Giờ + Badge hình thức */}
                        <View style={styles.cardTopRow}>
                          <View style={styles.maPhieuBox}>
                            <Ionicons
                              name="document-outline"
                              size={12}
                              color={B.primary}
                            />
                            <Text style={styles.maPhieuText}>
                              {item.maPhieu}
                            </Text>
                          </View>
                          <View style={styles.timeBox}>
                            <Ionicons
                              name="time-outline"
                              size={11}
                              color={B.textSub}
                            />
                            <Text style={styles.timeText}>
                              {item.thoiGian.split(" ")[1]}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }} />
                          <View
                            style={[
                              styles.hinhThucBadge,
                              { backgroundColor: ht.bg },
                            ]}>
                            <Ionicons
                              name={ht.icon as any}
                              size={11}
                              color={ht.color}
                            />
                            <Text
                              style={[
                                styles.hinhThucText,
                                { color: ht.color },
                              ]}>
                              {ht.label}
                            </Text>
                          </View>
                        </View>

                        {/* Badge loại chi */}
                        <View
                          style={[
                            styles.loaiBadge,
                            { backgroundColor: loai.bg },
                          ]}>
                          <Ionicons
                            name={loai.icon as any}
                            size={12}
                            color={loai.color}
                          />
                          <Text
                            style={[styles.loaiText, { color: loai.color }]}>
                            {loai.label}
                          </Text>
                        </View>

                        {/* Người chi */}
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="person-circle-outline"
                            size={13}
                            color={B.primary}
                          />
                          <Text style={styles.infoLabel}>Người chi:</Text>
                          <Text style={styles.infoValue}>{item.nguoiChi}</Text>
                        </View>

                        {/* Người nhận */}
                        <View style={styles.nguoiNhanBox}>
                          <View style={styles.nguoiNhanAvatar}>
                            <Text style={styles.nguoiNhanAvatarText}>
                              {item.nguoiNhan
                                .trim()
                                .split(" ")
                                .slice(-1)[0]?.[0]
                                ?.toUpperCase() || "N"}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={styles.nguoiNhanName}
                              numberOfLines={1}>
                              {item.nguoiNhan}
                            </Text>
                            <View style={styles.nguoiNhanMeta}>
                              {item.dienThoai ? (
                                <View style={styles.metaItem}>
                                  <Ionicons
                                    name="call-outline"
                                    size={11}
                                    color={B.textSub}
                                  />
                                  <Text style={styles.metaText}>
                                    {item.dienThoai}
                                  </Text>
                                </View>
                              ) : null}
                              {item.diaChi ? (
                                <>
                                  <View style={styles.metaDot} />
                                  <View style={[styles.metaItem, { flex: 1 }]}>
                                    <Ionicons
                                      name="location-outline"
                                      size={11}
                                      color={B.textSub}
                                    />
                                    <Text
                                      style={styles.metaText}
                                      numberOfLines={1}>
                                      {item.diaChi}
                                    </Text>
                                  </View>
                                </>
                              ) : null}
                            </View>
                          </View>
                        </View>

                        {/* Nội dung */}
                        <View style={styles.noiDungBox}>
                          <Ionicons
                            name="document-text-outline"
                            size={12}
                            color={B.textSub}
                          />
                          <Text style={styles.noiDungText} numberOfLines={2}>
                            {item.noiDung}
                          </Text>
                        </View>

                        {/* Số tiền + Nút */}
                        <View style={styles.cardBottomRow}>
                          <View>
                            <Text style={styles.soTienLabel}>Số tiền chi</Text>
                            <Text style={styles.soTienValue}>
                              {formatMoney(item.soTien)}
                            </Text>
                          </View>
                          <View style={styles.cardActions}>
                            <TouchableOpacity
                              style={[styles.actionBtn, styles.actionEdit]}
                              onPress={() => handleEdit(item)}>
                              <Ionicons
                                name="create-outline"
                                size={13}
                                color={B.info}
                              />
                              <Text
                                style={[styles.actionText, { color: B.info }]}>
                                Sửa
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.actionBtn, styles.actionPrint]}
                              onPress={() => handlePrint(item)}>
                              <Ionicons
                                name="print-outline"
                                size={13}
                                color={B.primary}
                              />
                              <Text
                                style={[
                                  styles.actionText,
                                  { color: B.primary },
                                ]}>
                                In
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.actionBtn, styles.actionDelete]}
                              onPress={() => handleDelete(item.id)}>
                              <Ionicons
                                name="trash-outline"
                                size={13}
                                color={B.danger}
                              />
                              <Text
                                style={[
                                  styles.actionText,
                                  { color: B.danger },
                                ]}>
                                Xoá
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── MODAL THÊM / SỬA ── */}
      <Modal
        visible={formModalVisible}
        animationType="slide"
        onRequestClose={() => setFormModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editItem ? "Sửa phiếu chi" : "Thêm phiếu chi"}
              </Text>
              <TouchableOpacity
                onPress={() => setFormModalVisible(false)}
                style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}>
              <View style={{ gap: 14, paddingBottom: 30 }}>
                {/* Thời gian */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Thời gian</Text>
                  <View style={styles.formInputWrap}>
                    <Ionicons name="time-outline" size={14} color={B.primary} />
                    <TextInput
                      style={styles.formInput}
                      value={form.thoiGian}
                      onChangeText={(v) => setForm({ ...form, thoiGian: v })}
                      placeholder="YYYY-MM-DD HH:MM"
                    />
                  </View>
                </View>

                {/* Người chi + Người nhận */}
                <View style={styles.formRow}>
                  <View style={[styles.formField, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Người chi</Text>
                    <View style={styles.formInputWrap}>
                      <Ionicons
                        name="person-circle-outline"
                        size={14}
                        color={B.primary}
                      />
                      <TextInput
                        style={styles.formInput}
                        value={form.nguoiChi}
                        onChangeText={(v) => setForm({ ...form, nguoiChi: v })}
                        placeholder="Tên người chi"
                      />
                    </View>
                  </View>
                  <View style={[styles.formField, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Người nhận</Text>
                    <View style={styles.formInputWrap}>
                      <Ionicons
                        name="person-outline"
                        size={14}
                        color={B.primary}
                      />
                      <TextInput
                        style={styles.formInput}
                        value={form.nguoiNhan}
                        onChangeText={(v) => setForm({ ...form, nguoiNhan: v })}
                        placeholder="Tên người nhận"
                      />
                    </View>
                  </View>
                </View>

                {/* Điện thoại + Địa chỉ */}
                <View style={styles.formRow}>
                  <View style={[styles.formField, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Điện thoại</Text>
                    <View style={styles.formInputWrap}>
                      <Ionicons
                        name="call-outline"
                        size={14}
                        color={B.primary}
                      />
                      <TextInput
                        style={styles.formInput}
                        value={form.dienThoai}
                        onChangeText={(v) => setForm({ ...form, dienThoai: v })}
                        keyboardType="phone-pad"
                        placeholder="Số điện thoại"
                      />
                    </View>
                  </View>
                  <View style={[styles.formField, { flex: 1.5 }]}>
                    <Text style={styles.formLabel}>Địa chỉ</Text>
                    <View style={styles.formInputWrap}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color={B.primary}
                      />
                      <TextInput
                        style={styles.formInput}
                        value={form.diaChi}
                        onChangeText={(v) => setForm({ ...form, diaChi: v })}
                        placeholder="Địa chỉ người nhận"
                      />
                    </View>
                  </View>
                </View>

                {/* Số tiền */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Số tiền chi (VNĐ)</Text>
                  <View style={styles.formInputWrap}>
                    <Ionicons name="cash-outline" size={14} color={B.primary} />
                    <TextInput
                      style={styles.formInput}
                      value={form.soTien === 0 ? "" : String(form.soTien)}
                      onChangeText={(v) =>
                        setForm({
                          ...form,
                          soTien: Number(v.replace(/\D/g, "")),
                        })
                      }
                      keyboardType="numeric"
                      placeholder="0"
                    />
                    <Text style={{ fontSize: 12, color: B.textSub }}>₫</Text>
                  </View>
                </View>

                {/* Nội dung */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Nội dung phiếu chi</Text>
                  <TextInput
                    style={styles.formTextArea}
                    value={form.noiDung}
                    onChangeText={(v) => setForm({ ...form, noiDung: v })}
                    placeholder="Nhập nội dung chi tiêu..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Loại chi */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Loại phiếu chi</Text>
                  <View style={styles.optionGroup}>
                    {(
                      Object.entries(LOAI_CONFIG) as [
                        LoaiChi,
                        (typeof LOAI_CONFIG)[LoaiChi],
                      ][]
                    ).map(([key, cfg]) => {
                      const isA = form.loaiChi === key;
                      return (
                        <TouchableOpacity
                          key={key}
                          style={[
                            styles.optionBtn,
                            isA && {
                              backgroundColor: cfg.bg,
                              borderColor: cfg.color,
                            },
                          ]}
                          onPress={() => setForm({ ...form, loaiChi: key })}>
                          <Ionicons
                            name={cfg.icon as any}
                            size={14}
                            color={isA ? cfg.color : B.textSub}
                          />
                          <Text
                            style={[
                              styles.optionText,
                              { color: isA ? cfg.color : B.textSub },
                            ]}>
                            {cfg.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Hình thức */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Hình thức thanh toán</Text>
                  <View style={styles.formRow}>
                    {(
                      Object.entries(HINH_THUC_CONFIG) as [
                        HinhThuc,
                        (typeof HINH_THUC_CONFIG)[HinhThuc],
                      ][]
                    ).map(([key, cfg]) => {
                      const isA = form.hinhThuc === key;
                      return (
                        <TouchableOpacity
                          key={key}
                          style={[
                            styles.optionBtn,
                            { flex: 1 },
                            isA && {
                              backgroundColor: cfg.bg,
                              borderColor: cfg.color,
                            },
                          ]}
                          onPress={() => setForm({ ...form, hinhThuc: key })}>
                          <Ionicons
                            name={cfg.icon as any}
                            size={14}
                            color={isA ? cfg.color : B.textSub}
                          />
                          <Text
                            style={[
                              styles.optionText,
                              { color: isA ? cfg.color : B.textSub },
                            ]}>
                            {cfg.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setFormModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>
                  {editItem ? "Lưu thay đổi" : "Thêm phiếu chi"}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* ── MODAL IN PHIẾU ── */}
      <Modal
        visible={printModalVisible}
        animationType="slide"
        onRequestClose={() => setPrintModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>In phiếu chi</Text>
              <TouchableOpacity
                onPress={() => setPrintModalVisible(false)}
                style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}>
              {printItem &&
                (() => {
                  const loai = LOAI_CONFIG[printItem.loaiChi];
                  const ht = HINH_THUC_CONFIG[printItem.hinhThuc];
                  return (
                    <View style={styles.printPaper}>
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

                      <View style={styles.printTitleWrap}>
                        <Text style={styles.printTitle}>PHIẾU CHI TIỀN</Text>
                        <View
                          style={[
                            styles.printLoaiBadge,
                            { backgroundColor: loai.bg },
                          ]}>
                          <Ionicons
                            name={loai.icon as any}
                            size={12}
                            color={loai.color}
                          />
                          <Text
                            style={[
                              styles.printLoaiText,
                              { color: loai.color },
                            ]}>
                            {loai.label}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.printInfoBox}>
                        {[
                          {
                            label: "Mã phiếu",
                            value: printItem.maPhieu,
                            bold: true,
                          },
                          {
                            label: "Thời gian",
                            value: formatDateTime(printItem.thoiGian),
                          },
                          { label: "Người chi", value: printItem.nguoiChi },
                          { label: "Người nhận", value: printItem.nguoiNhan },
                          {
                            label: "Điện thoại",
                            value: printItem.dienThoai || "—",
                          },
                          { label: "Địa chỉ", value: printItem.diaChi || "—" },
                          { label: "Hình thức", value: ht.label },
                          { label: "Nội dung", value: printItem.noiDung },
                        ].map((row) => (
                          <View key={row.label} style={styles.printInfoRow}>
                            <Text style={styles.printInfoLabel}>
                              {row.label}:
                            </Text>
                            <Text
                              style={[
                                styles.printInfoValue,
                                (row as any).bold && {
                                  fontWeight: "800",
                                  color: B.primary,
                                },
                              ]}>
                              {row.value}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.printAmountBox}>
                        <Text style={styles.printAmountLabel}>SỐ TIỀN CHI</Text>
                        <Text style={styles.printAmountValue}>
                          {formatMoney(printItem.soTien)}
                        </Text>
                        <Text style={styles.printAmountSub}>({ht.label})</Text>
                      </View>

                      <View style={styles.printFooter}>
                        <View style={styles.printSignBox}>
                          <Text style={styles.printSignTitle}>
                            Người nhận tiền
                          </Text>
                          <Text style={styles.printSignSub}>
                            (Ký, ghi rõ họ tên)
                          </Text>
                          <View style={{ height: 50 }} />
                          <Text
                            style={[
                              styles.printSignSub,
                              { fontWeight: "700", color: B.textTitle },
                            ]}>
                            {printItem.nguoiNhan}
                          </Text>
                        </View>
                        <View style={styles.printSignBox}>
                          <Text style={styles.printSignTitle}>
                            Người chi tiền
                          </Text>
                          <Text style={styles.printSignSub}>
                            (Ký, ghi rõ họ tên)
                          </Text>
                          <View style={{ height: 50 }} />
                          <Text
                            style={[
                              styles.printSignSub,
                              { fontWeight: "700", color: B.textTitle },
                            ]}>
                            {printItem.nguoiChi}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })()}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setPrintModalVisible(false)}>
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
    gap: 12,
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
  filterGroupLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: B.textSub,
    marginBottom: 6,
  },
  filterChipRow: { flexDirection: "row", gap: 7 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: B.border,
    backgroundColor: B.white,
    alignItems: "center",
  },
  filterChipText: { fontSize: 12, fontWeight: "700" },

  statsCard: {
    flexDirection: "row",
    backgroundColor: B.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: B.border,
    marginBottom: 14,
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
  statMain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: B.primary,
  },
  statMainLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    marginBottom: 4,
  },
  statMainValue: { fontSize: 18, fontWeight: "800", color: "#fff" },
  statMainSub: { fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 3 },
  statDividerV: { width: 1, backgroundColor: B.border },
  statSide: { flex: 1.2, padding: 12, justifyContent: "center", gap: 8 },
  statSideItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  statSideDot: { width: 8, height: 8, borderRadius: 4 },
  statSideLabel: { fontSize: 10, color: B.textSub, fontWeight: "500" },
  statSideValue: { fontSize: 13, fontWeight: "800" },
  statSideDivider: { height: 1, backgroundColor: B.border },

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
  dateGroupTotal: { fontSize: 12, fontWeight: "800", color: B.danger },

  chiCard: {
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

  cardTopRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  maPhieuBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  maPhieuText: { fontSize: 12, fontWeight: "800", color: B.primary },
  timeBox: { flexDirection: "row", alignItems: "center", gap: 3 },
  timeText: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  hinhThucBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hinhThucText: { fontSize: 10, fontWeight: "700" },
  loaiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  loaiText: { fontSize: 11, fontWeight: "700" },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  infoLabel: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  infoValue: { fontSize: 12, color: B.textTitle, fontWeight: "700" },

  nguoiNhanBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: B.border,
  },
  nguoiNhanAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: B.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  nguoiNhanAvatarText: { fontSize: 14, fontWeight: "800", color: B.primary },
  nguoiNhanName: {
    fontSize: 13,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 3,
  },
  nguoiNhanMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },

  noiDungBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    backgroundColor: "#F8FAFC",
    borderRadius: 7,
    padding: 8,
    borderWidth: 1,
    borderColor: B.border,
  },
  noiDungText: { flex: 1, fontSize: 11, color: B.textSub, lineHeight: 16 },

  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  soTienLabel: { fontSize: 10, color: B.textSub, fontWeight: "500" },
  soTienValue: { fontSize: 16, fontWeight: "800", color: B.danger },

  cardActions: { flexDirection: "row", gap: 6 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionEdit: { borderColor: B.info + "50", backgroundColor: "#EFF6FF" },
  actionPrint: { borderColor: B.primary + "50", backgroundColor: "#FEF2F2" },
  actionDelete: { borderColor: B.danger + "50", backgroundColor: "#FFF0F0" },
  actionText: { fontSize: 11, fontWeight: "700" },

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

  formRow: { flexDirection: "row", gap: 10 },
  formField: { gap: 5 },
  formLabel: { fontSize: 12, fontWeight: "700", color: B.textSub },
  formInputWrap: {
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
  formInput: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
  formTextArea: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: B.textTitle,
    backgroundColor: B.white,
    minHeight: 80,
  },
  optionGroup: { gap: 8 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: B.border,
    backgroundColor: B.white,
  },
  optionText: { fontSize: 12, fontWeight: "700" },

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
  printTitleWrap: { alignItems: "center", marginBottom: 16, gap: 8 },
  printTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: B.textTitle,
    letterSpacing: 1,
  },
  printLoaiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  printLoaiText: { fontSize: 12, fontWeight: "700" },
  printInfoBox: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  printInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 8,
  },
  printInfoLabel: {
    fontSize: 12,
    color: B.textSub,
    fontWeight: "500",
    width: 100,
  },
  printInfoValue: {
    flex: 1,
    fontSize: 12,
    color: B.textTitle,
    fontWeight: "600",
  },
  printAmountBox: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: B.primary + "30",
  },
  printAmountLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: B.textSub,
    letterSpacing: 1,
    marginBottom: 6,
  },
  printAmountValue: { fontSize: 26, fontWeight: "800", color: B.danger },
  printAmountSub: { fontSize: 11, color: B.textSub, marginTop: 4 },
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

export default Ds_phieuchi;
