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

const getCurrentDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const getCurrentDateTime = () => {
  const now = new Date();
  return `${getCurrentDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

// ── Danh sách thuốc tồn kho mẫu ──
interface ThuocKho {
  id: number;
  tenThuoc: string;
  donVi: string;
  giaBan: number;
  tonKho: number;
  hangSanXuat: string;
}
const KHO_THUOC: ThuocKho[] = [
  {
    id: 1,
    tenThuoc: "Amoxicillin 500mg",
    donVi: "viên",
    giaBan: 5000,
    tonKho: 480,
    hangSanXuat: "Domesco",
  },
  {
    id: 2,
    tenThuoc: "Paracetamol 500mg",
    donVi: "viên",
    giaBan: 2000,
    tonKho: 950,
    hangSanXuat: "Imexpharm",
  },
  {
    id: 3,
    tenThuoc: "Ibuprofen 400mg",
    donVi: "viên",
    giaBan: 4000,
    tonKho: 280,
    hangSanXuat: "DHG Pharma",
  },
  {
    id: 4,
    tenThuoc: "Nước muối NaCl 0.9%",
    donVi: "chai",
    giaBan: 15000,
    tonKho: 45,
    hangSanXuat: "B.Braun",
  },
  {
    id: 5,
    tenThuoc: "Chlorhexidine 0.12%",
    donVi: "chai",
    giaBan: 35000,
    tonKho: 28,
    hangSanXuat: "Colgate",
  },
  {
    id: 6,
    tenThuoc: "Metronidazole 250mg",
    donVi: "viên",
    giaBan: 3500,
    tonKho: 0,
    hangSanXuat: "Stada",
  },
  {
    id: 7,
    tenThuoc: "Dexamethasone 0.5mg",
    donVi: "viên",
    giaBan: 3000,
    tonKho: 120,
    hangSanXuat: "DHG Pharma",
  },
  {
    id: 8,
    tenThuoc: "Vitamin C 1000mg",
    donVi: "viên",
    giaBan: 8000,
    tonKho: 60,
    hangSanXuat: "Blackmores",
  },
];

interface ChiTietXuat {
  id: number;
  thuocId: number;
  tenThuoc: string;
  donVi: string;
  soLuong: number;
  giaBan: number;
}
interface PhieuXuat {
  id: number;
  maPhieu: string;
  ngayXuat: string;
  nguoiNhan: string;
  dienThoai: string;
  lyDoXuat: string;
  chiTiet: ChiTietXuat[];
  daTT: number;
}

const EMPTY_CHITIET = {
  thuocId: 0,
  tenThuoc: "",
  donVi: "",
  soLuong: 0,
  giaBan: 0,
};

const SAMPLE: PhieuXuat[] = [
  {
    id: 1,
    maPhieu: "PX001",
    ngayXuat: `${getCurrentDate()} 09:00`,
    nguoiNhan: "Nguyễn Văn An",
    dienThoai: "0912345678",
    lyDoXuat: "Cấp phát điều trị nội trú",
    chiTiet: [
      {
        id: 1,
        thuocId: 1,
        tenThuoc: "Amoxicillin 500mg",
        donVi: "viên",
        soLuong: 20,
        giaBan: 5000,
      },
      {
        id: 2,
        thuocId: 2,
        tenThuoc: "Paracetamol 500mg",
        donVi: "viên",
        soLuong: 30,
        giaBan: 2000,
      },
    ],
    daTT: 100000,
  },
  {
    id: 2,
    maPhieu: "PX002",
    ngayXuat: `${getCurrentDate()} 11:30`,
    nguoiNhan: "Trần Thị Bình",
    dienThoai: "0987654321",
    lyDoXuat: "Bán lẻ",
    chiTiet: [
      {
        id: 3,
        thuocId: 4,
        tenThuoc: "Nước muối NaCl 0.9%",
        donVi: "chai",
        soLuong: 5,
        giaBan: 15000,
      },
      {
        id: 4,
        thuocId: 5,
        tenThuoc: "Chlorhexidine 0.12%",
        donVi: "chai",
        soLuong: 2,
        giaBan: 35000,
      },
    ],
    daTT: 145000,
  },
];

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );
const fmtDate = (s: string) => {
  const [date, time] = s.split(" ");
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}${time ? ` ${time}` : ""}`;
};

export default function Xuatthuocpk() {
  const router = useRouter();
  const [data, setData] = useState<PhieuXuat[]>(SAMPLE);
  const [tuNgay, setTuNgay] = useState(getCurrentDate());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1]));
  const [filterTT, setFilterTT] = useState<"tatca" | "dathanhtoan" | "conno">(
    "tatca",
  );

  // Quick payment modal
  const [payModalId, setPayModalId] = useState<number | null>(null);
  const [payInput, setPayInput] = useState("");

  // Modal phiếu
  const [modalVisible, setModalVisible] = useState(false);
  const [editPhieu, setEditPhieu] = useState<PhieuXuat | null>(null);
  const [phieuForm, setPhieuForm] = useState({
    ngayXuat: getCurrentDateTime(),
    nguoiNhan: "",
    dienThoai: "",
    lyDoXuat: "",
  });
  const [chiTietList, setChiTietList] = useState<Omit<ChiTietXuat, "id">[]>([]);
  const [daTT, setDaTT] = useState("0");
  const [phieuError, setPhieuError] = useState("");

  // Inline thuốc form
  const [thuocFormVisible, setThuocFormVisible] = useState(false);
  const [editThuocIdx, setEditThuocIdx] = useState<number | null>(null);
  const [thuocForm, setThuocForm] = useState({ ...EMPTY_CHITIET });
  const [soLuongStr, setSoLuongStr] = useState("");
  const [thuocSearch, setThuocSearch] = useState("");
  const [thuocError, setThuocError] = useState("");
  const [showThuocPicker, setShowThuocPicker] = useState(false);

  // Print modal
  const [printPhieu, setPrintPhieu] = useState<PhieuXuat | null>(null);

  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const closeModal = () => {
    setModalVisible(false);
    setEditPhieu(null);
    setPhieuForm({
      ngayXuat: getCurrentDateTime(),
      nguoiNhan: "",
      dienThoai: "",
      lyDoXuat: "",
    });
    setChiTietList([]);
    setDaTT("0");
    setPhieuError("");
    setThuocFormVisible(false);
    setThuocError("");
  };

  const openAdd = () => {
    setEditPhieu(null);
    setPhieuForm({
      ngayXuat: getCurrentDateTime(),
      nguoiNhan: "",
      dienThoai: "",
      lyDoXuat: "",
    });
    setChiTietList([]);
    setDaTT("0");
    setPhieuError("");
    setThuocFormVisible(false);
    setModalVisible(true);
  };

  const openEdit = (p: PhieuXuat) => {
    setEditPhieu(p);
    setPhieuForm({
      ngayXuat: p.ngayXuat,
      nguoiNhan: p.nguoiNhan,
      dienThoai: p.dienThoai,
      lyDoXuat: p.lyDoXuat,
    });
    setChiTietList(p.chiTiet.map(({ id, ...rest }) => rest));
    setDaTT(String(p.daTT));
    setPhieuError("");
    setThuocFormVisible(false);
    setModalVisible(true);
  };

  const getTongTien = (list: Omit<ChiTietXuat, "id">[]) =>
    list.reduce((s, t) => s + t.soLuong * t.giaBan, 0);

  const doSave = (andPrint = false) => {
    if (!phieuForm.nguoiNhan.trim()) {
      setPhieuError("Vui lòng nhập tên người nhận.");
      return;
    }
    const valid = chiTietList.filter((t) => t.tenThuoc.trim() && t.soLuong > 0);
    if (valid.length === 0) {
      setPhieuError("Vui lòng thêm ít nhất 1 loại thuốc.");
      return;
    }
    const daTTNum = Number(daTT.replace(/\D/g, "")) || 0;
    let idC =
      Math.max(...data.flatMap((p) => p.chiTiet.map((t) => t.id)), 0) + 1;
    let saved: PhieuXuat;
    if (editPhieu) {
      saved = {
        ...editPhieu,
        ...phieuForm,
        daTT: daTTNum,
        chiTiet: valid.map((t, i) => ({
          ...t,
          id: editPhieu.chiTiet[i]?.id ?? idC++,
        })),
      };
      setData((prev) => prev.map((p) => (p.id === editPhieu.id ? saved : p)));
    } else {
      const newId = Math.max(...data.map((p) => p.id), 0) + 1;
      saved = {
        id: newId,
        maPhieu: `PX${String(newId).padStart(3, "0")}`,
        ...phieuForm,
        daTT: daTTNum,
        chiTiet: valid.map((t) => ({ ...t, id: idC++ })),
      };
      setData((prev) => [...prev, saved]);
      setExpandedIds((prev) => new Set([...prev, newId]));
    }
    closeModal();
    if (andPrint) setTimeout(() => setPrintPhieu(saved), 300);
  };

  const deletePhieu = (id: number) => {
    const p = data.find((x) => x.id === id);
    Alert.alert(
      "Xác nhận xoá",
      `Bạn có chắc muốn xoá phiếu "${p?.maPhieu}" của "${p?.nguoiNhan}" không?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () => setData((prev) => prev.filter((x) => x.id !== id)),
        },
      ],
    );
  };

  // Thuốc inline
  const openAddThuoc = () => {
    setEditThuocIdx(null);
    setThuocForm({ ...EMPTY_CHITIET });
    setSoLuongStr("");
    setThuocSearch("");
    setThuocError("");
    setShowThuocPicker(false);
    setThuocFormVisible(true);
  };
  const openEditThuoc = (idx: number) => {
    setEditThuocIdx(idx);
    setThuocForm({ ...chiTietList[idx] });
    setSoLuongStr(String(chiTietList[idx].soLuong));
    setThuocSearch("");
    setThuocError("");
    setShowThuocPicker(false);
    setThuocFormVisible(true);
  };
  const selectThuoc = (t: ThuocKho) => {
    setThuocForm((f) => ({
      ...f,
      thuocId: t.id,
      tenThuoc: t.tenThuoc,
      donVi: t.donVi,
      giaBan: t.giaBan,
    }));
    setSoLuongStr("");
    setShowThuocPicker(false);
    setThuocSearch("");
  };
  const saveThuoc = () => {
    if (!thuocForm.tenThuoc) {
      setThuocError("Vui lòng chọn thuốc.");
      return;
    }
    const sl = Number(soLuongStr) || 0;
    if (sl <= 0) {
      setThuocError("Số lượng phải lớn hơn 0.");
      return;
    }
    const kho = KHO_THUOC.find((k) => k.id === thuocForm.thuocId);
    if (kho && kho.tonKho < sl) {
      setThuocError(
        `Tồn kho chỉ còn ${kho.tonKho} ${kho.donVi}. Vui lòng nhập lại.`,
      );
      return;
    }
    const item = { ...thuocForm, soLuong: sl };
    if (editThuocIdx !== null) {
      setChiTietList((prev) =>
        prev.map((t, i) => (i === editThuocIdx ? item : t)),
      );
    } else {
      setChiTietList((prev) => [...prev, item]);
    }
    setThuocFormVisible(false);
    setEditThuocIdx(null);
    setThuocError("");
  };
  const cancelThuoc = () => {
    setThuocFormVisible(false);
    setEditThuocIdx(null);
    setThuocError("");
    setShowThuocPicker(false);
  };
  const removeThuoc = (idx: number) =>
    setChiTietList((prev) => prev.filter((_, i) => i !== idx));

  const selectedKho = KHO_THUOC.find((k) => k.id === thuocForm.thuocId);
  const filteredKho = KHO_THUOC.filter(
    (k) =>
      thuocSearch === "" ||
      k.tenThuoc.toLowerCase().includes(thuocSearch.toLowerCase()),
  );

  const filtered = data.filter((p) => {
    const d = p.ngayXuat.split(" ")[0];
    const inDate = d >= tuNgay && d <= denNgay;
    const inSearch =
      search === "" ||
      p.nguoiNhan.toLowerCase().includes(search.toLowerCase()) ||
      p.maPhieu.toLowerCase().includes(search.toLowerCase());
    const tong = getTongTien(p.chiTiet);
    const conNo = tong - p.daTT;
    const inTT =
      filterTT === "tatca" ||
      (filterTT === "dathanhtoan" && conNo <= 0) ||
      (filterTT === "conno" && conNo > 0);
    return inDate && inSearch && inTT;
  });

  const savePayment = () => {
    const them = Number(payInput.replace(/\D/g, "")) || 0;
    if (them <= 0) return;
    setData((prev) =>
      prev.map((p) => {
        if (p.id !== payModalId) return p;
        const tong = getTongTien(p.chiTiet);
        const newDaTT = Math.min(p.daTT + them, tong);
        return { ...p, daTT: newDaTT };
      }),
    );
    setPayModalId(null);
    setPayInput("");
  };

  const tongAll = filtered.reduce((s, p) => s + getTongTien(p.chiTiet), 0);
  const tongForm = getTongTien(chiTietList);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={B.primary} />

      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Xuất thuốc</Text>
            <Text style={s.headerSub}>Quản lý phiếu xuất thuốc</Text>
          </View>
          <TouchableOpacity style={s.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}>
        {/* BỘ LỌC */}
        <View style={s.filterCard}>
          <View style={s.searchBox}>
            <Ionicons name="search-outline" size={16} color={B.textSub} />
            <TextInput
              style={s.searchInput}
              placeholder="Tìm mã phiếu, người nhận..."
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
          <View style={s.dateRow}>
            <View style={s.dateField}>
              <Text style={s.dateLabel}>Từ ngày</Text>
              <View style={s.dateInputWrap}>
                <Ionicons name="calendar-outline" size={14} color={B.primary} />
                <TextInput
                  style={s.dateInput}
                  value={tuNgay}
                  onChangeText={setTuNgay}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={B.textSub}
                />
              </View>
            </View>
            <View style={s.dateSep}>
              <Ionicons name="arrow-forward" size={16} color={B.textSub} />
            </View>
            <View style={s.dateField}>
              <Text style={s.dateLabel}>Đến ngày</Text>
              <View style={s.dateInputWrap}>
                <Ionicons name="calendar-outline" size={14} color={B.primary} />
                <TextInput
                  style={s.dateInput}
                  value={denNgay}
                  onChangeText={setDenNgay}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={B.textSub}
                />
              </View>
            </View>
          </View>
        </View>

        {/* STATS */}
        <View style={s.statsRow}>
          <View style={[s.statCard, { backgroundColor: "#FEF2F2" }]}>
            <View style={[s.statIcon, { backgroundColor: B.primary + "20" }]}>
              <Ionicons name="receipt" size={18} color={B.primary} />
            </View>
            <View>
              <Text style={[s.statNum, { color: B.primary }]}>
                {filtered.length}
              </Text>
              <Text style={s.statLabel}>Phiếu xuất</Text>
            </View>
          </View>
          <View style={[s.statCard, { backgroundColor: "#ECFDF5" }]}>
            <View style={[s.statIcon, { backgroundColor: B.success + "20" }]}>
              <Ionicons name="cash" size={18} color={B.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[s.statNum, { color: B.success, fontSize: 13 }]}
                numberOfLines={1}>
                {fmtMoney(tongAll)}
              </Text>
              <Text style={s.statLabel}>Tổng tiền xuất</Text>
            </View>
          </View>
        </View>

        {/* FILTER CHIPS */}
        <View style={s.filterChipsRow}>
          {(
            [
              { key: "tatca", label: "Tất cả", icon: "list-outline" },
              {
                key: "dathanhtoan",
                label: "Đã thanh toán",
                icon: "checkmark-circle-outline",
              },
              { key: "conno", label: "Còn nợ", icon: "alert-circle-outline" },
            ] as const
          ).map((chip) => {
            const active = filterTT === chip.key;
            const chipColor =
              chip.key === "dathanhtoan"
                ? B.success
                : chip.key === "conno"
                  ? B.danger
                  : B.primary;
            return (
              <TouchableOpacity
                key={chip.key}
                style={[
                  s.filterChip,
                  active && {
                    backgroundColor: chipColor,
                    borderColor: chipColor,
                  },
                ]}
                onPress={() => setFilterTT(chip.key)}>
                <Ionicons
                  name={chip.icon}
                  size={13}
                  color={active ? "#fff" : chipColor}
                />
                <Text
                  style={[
                    s.filterChipTxt,
                    { color: active ? "#fff" : chipColor },
                  ]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DANH SÁCH */}
        {filtered.length === 0 ? (
          <View style={s.emptyBox}>
            <Ionicons name="receipt-outline" size={56} color={B.border} />
            <Text style={s.emptyTitle}>Chưa có phiếu xuất nào</Text>
            <Text style={s.emptyText}>Nhấn + để tạo phiếu xuất thuốc mới</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={openAdd}>
              <Ionicons name="add-circle" size={16} color={B.primary} />
              <Text style={s.emptyBtnText}>Tạo phiếu xuất</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((phieu) => {
            const exp = expandedIds.has(phieu.id);
            const tong = getTongTien(phieu.chiTiet);
            const conNo = tong - phieu.daTT;
            return (
              <View key={phieu.id} style={s.phieuCard}>
                <View style={[s.phieuAccent, { backgroundColor: B.success }]} />
                <View style={s.phieuBody}>
                  {/* Dòng 1: Mã + ngày + chevron */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(phieu.id)}
                    activeOpacity={0.75}
                    style={s.phieuTopRow}>
                    <View style={[s.maBox, { backgroundColor: "#ECFDF5" }]}>
                      <Ionicons
                        name="receipt-outline"
                        size={11}
                        color={B.success}
                      />
                      <Text style={[s.maText, { color: B.success }]}>
                        {phieu.maPhieu}
                      </Text>
                    </View>
                    <View style={s.ngayBox}>
                      <Ionicons
                        name="time-outline"
                        size={11}
                        color={B.textSub}
                      />
                      <Text style={s.ngayText}>{fmtDate(phieu.ngayXuat)}</Text>
                    </View>
                    <Ionicons
                      name={exp ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={B.textSub}
                    />
                  </TouchableOpacity>

                  {/* Dòng 2: Người nhận + nút */}
                  <View style={s.nhaCCRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.nhaCCName} numberOfLines={1}>
                        {phieu.nguoiNhan}
                      </Text>
                      {phieu.lyDoXuat ? (
                        <Text style={s.lyDoText} numberOfLines={1}>
                          {phieu.lyDoXuat}
                        </Text>
                      ) : null}
                    </View>
                    {conNo > 0 && (
                      <TouchableOpacity
                        style={s.thanhToanBtn}
                        onPress={() => {
                          setPayModalId(phieu.id);
                          setPayInput("");
                        }}>
                        <Ionicons name="card-outline" size={13} color="#fff" />
                        <Text style={s.thanhToanBtnTxt}>Thanh toán</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[
                        s.iconBtn,
                        {
                          backgroundColor: "#ECFDF5",
                          borderWidth: 1,
                          borderColor: B.success + "50",
                        },
                      ]}
                      onPress={() => setPrintPhieu(phieu)}>
                      <Ionicons
                        name="print-outline"
                        size={14}
                        color={B.success}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.iconBtn, { backgroundColor: B.info }]}
                      onPress={() => openEdit(phieu)}>
                      <Ionicons name="create-outline" size={14} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        s.iconBtn,
                        {
                          backgroundColor: "#FFF0F0",
                          borderWidth: 1,
                          borderColor: B.danger + "40",
                        },
                      ]}
                      onPress={() => deletePhieu(phieu.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={14}
                        color={B.danger}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Dòng 3: SĐT · Số loại + thanh toán gọn */}
                  <View style={s.metaRow}>
                    {phieu.dienThoai ? (
                      <>
                        <Ionicons
                          name="call-outline"
                          size={11}
                          color={B.textSub}
                        />
                        <Text style={s.metaText}>{phieu.dienThoai}</Text>
                        <View style={s.dot} />
                      </>
                    ) : null}
                    <View style={s.soLoaiChip}>
                      <Ionicons
                        name="medkit-outline"
                        size={10}
                        color={B.textSub}
                      />
                      <Text style={s.soLoaiTxt}>
                        {phieu.chiTiet.length} loại
                      </Text>
                    </View>
                  </View>

                  {/* Dòng 4: Tổng / Đã TT / Còn nợ compact */}
                  <View style={s.paySummaryRow}>
                    <View style={s.payCell}>
                      <Text style={s.payCellLabel}>Tổng tiền</Text>
                      <Text style={[s.payCellVal, { color: B.success }]}>
                        {fmtMoney(tong)}
                      </Text>
                    </View>
                    <View style={s.payCellSep} />
                    <View style={s.payCell}>
                      <Text style={s.payCellLabel}>Đã thanh toán</Text>
                      <Text style={[s.payCellVal, { color: B.info }]}>
                        {fmtMoney(phieu.daTT)}
                      </Text>
                    </View>
                    <View style={s.payCellSep} />
                    <View style={s.payCell}>
                      <Text style={s.payCellLabel}>Còn nợ</Text>
                      <Text
                        style={[
                          s.payCellVal,
                          {
                            color: conNo > 0 ? B.danger : B.success,
                            fontWeight: "900",
                          },
                        ]}>
                        {fmtMoney(conNo > 0 ? conNo : 0)}
                      </Text>
                    </View>
                  </View>

                  {/* Chi tiết */}
                  {exp && (
                    <View style={s.chiTietWrap}>
                      {phieu.chiTiet.map((t, i) => (
                        <View
                          key={t.id}
                          style={[
                            s.tblRow,
                            i % 2 !== 0 && { backgroundColor: "#FAFAFA" },
                          ]}>
                          <View style={{ flex: 1 }}>
                            <Text style={s.tblName} numberOfLines={1}>
                              {t.tenThuoc}
                            </Text>
                            <View style={s.tblMeta}>
                              <View style={s.dvMiniChip}>
                                <Text style={s.dvMiniTxt}>{t.donVi}</Text>
                              </View>
                              <Text
                                style={[
                                  s.tblMetaTxt,
                                  { color: B.success, fontWeight: "700" },
                                ]}>
                                {fmtMoney(t.giaBan)}/lần
                              </Text>
                            </View>
                          </View>
                          <View style={s.tblRight}>
                            <Text style={s.tblSL}>× {t.soLuong}</Text>
                            <Text style={[s.tblTT, { color: B.success }]}>
                              {fmtMoney(t.soLuong * t.giaBan)}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── MODAL PHIẾU (duy nhất) ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={s.modalOverlay}>
            <View style={s.modalSheet}>
              <View style={s.modalHandle} />

              <View style={s.modalHeader}>
                <View style={s.modalHeaderLeft}>
                  <View style={s.modalHeaderIcon}>
                    <Ionicons
                      name={thuocFormVisible ? "medkit" : "receipt"}
                      size={17}
                      color={B.primary}
                    />
                  </View>
                  <Text style={s.modalTitle}>
                    {thuocFormVisible
                      ? editThuocIdx !== null
                        ? "Sửa thuốc xuất"
                        : "Thêm thuốc xuất"
                      : editPhieu
                        ? "Sửa phiếu xuất"
                        : "Tạo phiếu xuất thuốc"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={thuocFormVisible ? cancelThuoc : closeModal}
                  style={s.closeBtn}>
                  <Ionicons
                    name={thuocFormVisible ? "arrow-back" : "close"}
                    size={19}
                    color={B.textTitle}
                  />
                </TouchableOpacity>
              </View>

              {editPhieu && !thuocFormVisible && (
                <View style={s.editBanner}>
                  <Ionicons name="create" size={13} color={B.warning} />
                  <Text style={s.editBannerTxt}>
                    Đang sửa{" "}
                    <Text style={{ fontWeight: "800" }}>
                      {editPhieu.maPhieu}
                    </Text>{" "}
                    — {editPhieu.nguoiNhan}
                  </Text>
                </View>
              )}

              <ScrollView
                style={s.modalBody}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={s.modalBodyContent}>
                {/* ══ FORM THUỐC INLINE ══ */}
                {thuocFormVisible ? (
                  <View>
                    {/* Chọn thuốc */}
                    <View style={s.fField}>
                      <Text style={s.fLabel}>
                        Chọn thuốc <Text style={{ color: B.danger }}>*</Text>
                      </Text>
                      <TouchableOpacity
                        style={[
                          s.fInput,
                          {
                            borderColor: thuocForm.tenThuoc
                              ? B.primary + "60"
                              : B.border,
                          },
                        ]}
                        onPress={() => setShowThuocPicker(!showThuocPicker)}>
                        <Ionicons
                          name="medkit-outline"
                          size={14}
                          color={B.primary}
                        />
                        <Text
                          style={[
                            s.fTxt,
                            {
                              color: thuocForm.tenThuoc
                                ? B.textTitle
                                : B.textSub,
                            },
                          ]}>
                          {thuocForm.tenThuoc || "Chọn thuốc..."}
                        </Text>
                        <Ionicons
                          name={showThuocPicker ? "chevron-up" : "chevron-down"}
                          size={13}
                          color={B.textSub}
                        />
                      </TouchableOpacity>

                      {showThuocPicker && (
                        <View style={s.thuocPickerWrap}>
                          <View style={s.thuocPickerSearch}>
                            <Ionicons
                              name="search-outline"
                              size={14}
                              color={B.textSub}
                            />
                            <TextInput
                              style={s.thuocPickerInput}
                              value={thuocSearch}
                              onChangeText={setThuocSearch}
                              placeholder="Tìm thuốc..."
                              placeholderTextColor={B.textSub}
                              autoFocus
                            />
                          </View>
                          <ScrollView
                            style={{ maxHeight: 200 }}
                            nestedScrollEnabled>
                            {filteredKho.map((k) => (
                              <TouchableOpacity
                                key={k.id}
                                style={[
                                  s.thuocPickerItem,
                                  thuocForm.thuocId === k.id &&
                                    s.thuocPickerItemActive,
                                  k.tonKho === 0 && { opacity: 0.5 },
                                ]}
                                onPress={() => k.tonKho > 0 && selectThuoc(k)}>
                                <View style={{ flex: 1 }}>
                                  <Text
                                    style={[
                                      s.thuocPickerName,
                                      thuocForm.thuocId === k.id && {
                                        color: B.primary,
                                      },
                                    ]}>
                                    {k.tenThuoc}
                                  </Text>
                                  <Text style={s.thuocPickerMeta}>
                                    {k.donVi} · {k.hangSanXuat} ·{" "}
                                    {fmtMoney(k.giaBan)}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    s.tonKhoBadge,
                                    {
                                      backgroundColor:
                                        k.tonKho === 0
                                          ? "#FFF0F0"
                                          : k.tonKho < 10
                                            ? "#FFFBEB"
                                            : "#ECFDF5",
                                    },
                                  ]}>
                                  <Text
                                    style={[
                                      s.tonKhoNum,
                                      {
                                        color:
                                          k.tonKho === 0
                                            ? B.danger
                                            : k.tonKho < 10
                                              ? B.warning
                                              : B.success,
                                      },
                                    ]}>
                                    {k.tonKho}
                                  </Text>
                                  <Text
                                    style={[
                                      s.tonKhoLabel,
                                      {
                                        color:
                                          k.tonKho === 0
                                            ? B.danger
                                            : k.tonKho < 10
                                              ? B.warning
                                              : B.success,
                                      },
                                    ]}>
                                    {k.tonKho === 0 ? "Hết" : "còn"}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* Tồn kho info */}
                    {selectedKho && !showThuocPicker && (
                      <View
                        style={[
                          s.tonKhoInfoBox,
                          {
                            borderColor:
                              selectedKho.tonKho === 0
                                ? B.danger + "40"
                                : selectedKho.tonKho < 10
                                  ? B.warning + "40"
                                  : B.success + "40",
                          },
                        ]}>
                        <Ionicons
                          name="cube-outline"
                          size={14}
                          color={
                            selectedKho.tonKho === 0
                              ? B.danger
                              : selectedKho.tonKho < 10
                                ? B.warning
                                : B.success
                          }
                        />
                        <Text style={s.tonKhoInfoTxt}>
                          Tồn kho:{" "}
                          <Text
                            style={{
                              fontWeight: "800",
                              color:
                                selectedKho.tonKho === 0
                                  ? B.danger
                                  : selectedKho.tonKho < 10
                                    ? B.warning
                                    : B.success,
                            }}>
                            {selectedKho.tonKho} {selectedKho.donVi}
                          </Text>
                          {selectedKho.tonKho === 0
                            ? "  ⚠️ Hết hàng"
                            : selectedKho.tonKho < 10
                              ? "  ⚠️ Sắp hết"
                              : "  ✓ Còn hàng"}
                        </Text>
                      </View>
                    )}

                    {/* Đơn vị (auto) + Số lượng */}
                    <View style={s.fRow}>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Đơn vị</Text>
                        <View
                          style={[s.fInput, { backgroundColor: "#F8FAFC" }]}>
                          <Ionicons
                            name="cube-outline"
                            size={14}
                            color={B.textSub}
                          />
                          <Text
                            style={[
                              s.fTxt,
                              {
                                color: thuocForm.donVi
                                  ? B.textTitle
                                  : B.textSub,
                              },
                            ]}>
                            {thuocForm.donVi || "Tự động"}
                          </Text>
                        </View>
                      </View>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>
                          Số lượng xuất{" "}
                          <Text style={{ color: B.danger }}>*</Text>
                        </Text>
                        <View
                          style={[
                            s.fInput,
                            thuocError && !soLuongStr && s.fInputErr,
                          ]}>
                          <Ionicons
                            name="layers-outline"
                            size={14}
                            color={B.primary}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={soLuongStr}
                            onChangeText={(v) => {
                              setSoLuongStr(v.replace(/\D/g, ""));
                              setThuocError("");
                            }}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Giá bán (auto) */}
                    <View style={s.fField}>
                      <Text style={s.fLabel}>Giá bán / đơn vị</Text>
                      <View style={[s.fInput, { backgroundColor: "#F8FAFC" }]}>
                        <Ionicons
                          name="cash-outline"
                          size={14}
                          color={B.textSub}
                        />
                        <Text
                          style={[
                            s.fTxt,
                            {
                              color: thuocForm.giaBan ? B.primary : B.textSub,
                              fontWeight: thuocForm.giaBan ? "700" : "400",
                            },
                          ]}>
                          {thuocForm.giaBan
                            ? fmtMoney(thuocForm.giaBan)
                            : "Chọn thuốc để lấy giá"}
                        </Text>
                      </View>
                    </View>

                    {/* Preview thành tiền */}
                    {Number(soLuongStr) > 0 && thuocForm.giaBan > 0 && (
                      <View style={s.previewBox}>
                        <View style={s.previewRow}>
                          <Text style={s.previewLabel}>Thành tiền</Text>
                          <Text
                            style={[
                              s.previewVal,
                              {
                                color: B.success,
                                fontWeight: "800",
                                fontSize: 15,
                              },
                            ]}>
                            {fmtMoney(Number(soLuongStr) * thuocForm.giaBan)}
                          </Text>
                        </View>
                      </View>
                    )}

                    {thuocError ? (
                      <Text style={[s.errTxt, { marginBottom: 8 }]}>
                        {thuocError}
                      </Text>
                    ) : null}

                    <View style={s.thuocBtnRow}>
                      <TouchableOpacity
                        style={s.footerBtnCancel}
                        onPress={cancelThuoc}>
                        <Text style={s.cancelBtnTxt}>Huỷ</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.saveBtn} onPress={saveThuoc}>
                        <Ionicons name="checkmark" size={17} color="#fff" />
                        <Text style={s.saveBtnTxt}>
                          {editThuocIdx !== null ? "Lưu thuốc" : "Thêm thuốc"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* ══ FORM PHIẾU ══ */
                  <>
                    <Text style={s.secLabel}>Thông tin phiếu xuất</Text>

                    <View style={s.fField}>
                      <Text style={s.fLabel}>Ngày xuất thuốc</Text>
                      <View style={s.fInput}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={B.primary}
                        />
                        <TextInput
                          style={s.fTxt}
                          value={phieuForm.ngayXuat}
                          onChangeText={(v) =>
                            setPhieuForm((f) => ({ ...f, ngayXuat: v }))
                          }
                          placeholder="YYYY-MM-DD HH:MM"
                          placeholderTextColor={B.textSub}
                        />
                      </View>
                    </View>

                    <View style={s.fField}>
                      <Text style={s.fLabel}>
                        Người nhận <Text style={{ color: B.danger }}>*</Text>
                      </Text>
                      <View
                        style={[
                          s.fInput,
                          phieuError &&
                            !phieuForm.nguoiNhan.trim() &&
                            s.fInputErr,
                        ]}>
                        <Ionicons
                          name="person-outline"
                          size={14}
                          color={B.primary}
                        />
                        <TextInput
                          style={s.fTxt}
                          value={phieuForm.nguoiNhan}
                          onChangeText={(v) => {
                            setPhieuForm((f) => ({ ...f, nguoiNhan: v }));
                            setPhieuError("");
                          }}
                          placeholder="Tên người nhận thuốc"
                          placeholderTextColor={B.textSub}
                        />
                      </View>
                    </View>

                    <View style={s.fRow}>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Điện thoại</Text>
                        <View style={s.fInput}>
                          <Ionicons
                            name="call-outline"
                            size={14}
                            color={B.primary}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={phieuForm.dienThoai}
                            onChangeText={(v) =>
                              setPhieuForm((f) => ({ ...f, dienThoai: v }))
                            }
                            keyboardType="phone-pad"
                            placeholder="SĐT"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                      </View>
                      <View style={[s.fField, { flex: 1.5 }]}>
                        <Text style={s.fLabel}>Lý do xuất</Text>
                        <View style={s.fInput}>
                          <Ionicons
                            name="document-text-outline"
                            size={14}
                            color={B.primary}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={phieuForm.lyDoXuat}
                            onChangeText={(v) =>
                              setPhieuForm((f) => ({ ...f, lyDoXuat: v }))
                            }
                            placeholder="VD: Cấp phát điều trị"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Danh sách thuốc */}
                    <View style={s.secLabelRow}>
                      <Text style={s.secLabel}>Danh sách thuốc xuất</Text>
                      <TouchableOpacity
                        style={s.addThuocBtn}
                        onPress={openAddThuoc}>
                        <Ionicons
                          name="add-circle"
                          size={15}
                          color={B.success}
                        />
                        <Text style={s.addThuocTxt}>Thêm thuốc</Text>
                      </TouchableOpacity>
                    </View>

                    {chiTietList.length === 0 ? (
                      <View style={s.emptyThuoc}>
                        <Ionicons
                          name="medkit-outline"
                          size={28}
                          color={B.border}
                        />
                        <Text style={s.emptyThuocTxt}>
                          Chưa có thuốc. Nhấn "Thêm thuốc"
                        </Text>
                      </View>
                    ) : (
                      <View style={s.thuocList}>
                        {chiTietList.map((t, idx) => (
                          <View key={idx} style={s.thuocCard}>
                            <View
                              style={[
                                s.thuocIdx,
                                { backgroundColor: B.success + "15" },
                              ]}>
                              <Text
                                style={[s.thuocIdxTxt, { color: B.success }]}>
                                {String(idx + 1).padStart(2, "0")}
                              </Text>
                            </View>
                            <View style={{ flex: 1, gap: 3 }}>
                              <Text style={s.thuocCardName} numberOfLines={1}>
                                {t.tenThuoc}
                              </Text>
                              <View style={s.thuocCardMeta}>
                                <View
                                  style={[
                                    s.dvChip,
                                    { backgroundColor: "#ECFDF5" },
                                  ]}>
                                  <Text
                                    style={[s.dvChipTxt, { color: B.success }]}>
                                    {t.donVi}
                                  </Text>
                                </View>
                                <Text style={s.thuocMetaTxt}>
                                  SL: {t.soLuong}
                                </Text>
                                <View style={s.dot} />
                                <Text
                                  style={[
                                    s.thuocMetaTxt,
                                    { color: B.success, fontWeight: "700" },
                                  ]}>
                                  {fmtMoney(t.soLuong * t.giaBan)}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={s.thuocBtn}
                              onPress={() => openEditThuoc(idx)}>
                              <Ionicons
                                name="create-outline"
                                size={14}
                                color={B.info}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                s.thuocBtn,
                                { backgroundColor: "#FFF0F0" },
                              ]}
                              onPress={() => removeThuoc(idx)}>
                              <Ionicons
                                name="trash-outline"
                                size={14}
                                color={B.danger}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}

                        {/* Tổng tiền phiếu */}
                        <View style={s.formPayBox}>
                          <View style={s.formPayHeader}>
                            <Ionicons
                              name="receipt-outline"
                              size={13}
                              color={B.success}
                            />
                            <Text style={s.formPayHeaderTxt}>
                              Tổng kết phiếu xuất
                            </Text>
                          </View>
                          <View style={s.formPayGrid}>
                            <View
                              style={[
                                s.formPayGridCell,
                                {
                                  borderColor: B.success + "40",
                                  backgroundColor: "#F0FDF4",
                                  flex: 1,
                                  minWidth: "100%",
                                },
                              ]}>
                              <Text style={s.formPayGridLabel}>
                                Tổng tiền xuất
                              </Text>
                              <Text
                                style={[
                                  s.formPayGridVal,
                                  { color: B.success, fontSize: 20 },
                                ]}>
                                {fmtMoney(tongForm)}
                              </Text>
                              <Text
                                style={[
                                  s.formPayGridLabel,
                                  { color: B.textSub, marginTop: 2 },
                                ]}>
                                Đã thanh toán có thể thực hiện sau khi lưu phiếu
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}

                    {phieuError ? (
                      <Text style={[s.errTxt, { marginTop: 8 }]}>
                        {phieuError}
                      </Text>
                    ) : null}
                  </>
                )}
              </ScrollView>

              {/* Footer 3 nút khi form phiếu */}
              {!thuocFormVisible && (
                <View style={s.modalFooter}>
                  {/* Huỷ */}
                  <TouchableOpacity
                    style={s.footerBtnCancel}
                    onPress={closeModal}>
                    <Ionicons
                      name="close-circle-outline"
                      size={18}
                      color={B.textSub}
                    />
                    <Text style={s.footerBtnCancelTxt}>Huỷ</Text>
                  </TouchableOpacity>
                  {/* Lưu */}
                  <TouchableOpacity
                    style={s.footerBtnSave}
                    onPress={() => doSave(false)}>
                    <Ionicons
                      name="cloud-done-outline"
                      size={18}
                      color="#fff"
                    />
                    <Text style={s.footerBtnTxt}>Lưu phiếu</Text>
                  </TouchableOpacity>
                  {/* Lưu & In */}
                  <TouchableOpacity
                    style={[s.footerBtnSave, { backgroundColor: B.success }]}
                    onPress={() => doSave(true)}>
                    <Ionicons name="print-outline" size={18} color="#fff" />
                    <Text style={s.footerBtnTxt}>Lưu & In</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── MODAL IN PHIẾU XUẤT ── */}
      <Modal
        visible={printPhieu !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setPrintPhieu(null)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { minHeight: "85%" }]}>
            <View style={s.modalHandle} />

            <View style={s.modalHeader}>
              <View style={s.modalHeaderLeft}>
                <View
                  style={[s.modalHeaderIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="print" size={17} color={B.success} />
                </View>
                <Text style={s.modalTitle}>Phiếu xuất thuốc</Text>
              </View>
              <TouchableOpacity
                onPress={() => setPrintPhieu(null)}
                style={s.closeBtn}>
                <Ionicons name="close" size={20} color={B.textTitle} />
              </TouchableOpacity>
            </View>

            {printPhieu && (
              <ScrollView
                style={s.modalBody}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  s.modalBodyContent,
                  { paddingBottom: 30 },
                ]}>
                {/* Tiêu đề phòng khám */}
                <View style={s.printClinic}>
                  <View style={s.printClinicTop}>
                    <View style={s.printLogoBox}>
                      <Ionicons name="medical" size={26} color="#fff" />
                    </View>
                    <View style={s.printClinicInfo}>
                      <Text style={s.printClinicName}>HHIS MANAGE 2026</Text>
                      <Text style={s.printClinicTagline}>
                        Phần mềm quản lý phòng khám
                      </Text>
                    </View>
                  </View>
                  <View style={s.printClinicDivider} />
                  <View style={s.printClinicBottom}>
                    <View style={s.printClinicBottomItem}>
                      <Ionicons
                        name="location-outline"
                        size={12}
                        color={B.primary}
                      />
                      <Text style={s.printClinicSub}>
                        An Châu Yên Khang · Ý Yên · Nam Định
                      </Text>
                    </View>
                    <View style={s.printClinicBottomItem}>
                      <Ionicons
                        name="call-outline"
                        size={12}
                        color={B.primary}
                      />
                      <Text style={s.printClinicSub}>0338.300901</Text>
                    </View>
                  </View>
                </View>

                {/* Tiêu đề phiếu */}
                <View style={s.printTitleBox}>
                  <Text style={s.printTitle}>PHIẾU XUẤT THUỐC</Text>
                  <View
                    style={[
                      s.maBox,
                      { backgroundColor: "#ECFDF5", alignSelf: "center" },
                    ]}>
                    <Ionicons
                      name="receipt-outline"
                      size={11}
                      color={B.success}
                    />
                    <Text style={[s.maText, { color: B.success }]}>
                      {printPhieu.maPhieu}
                    </Text>
                  </View>
                </View>

                {/* Thông tin phiếu */}
                <View style={s.printInfoBox}>
                  {[
                    {
                      icon: "calendar-outline",
                      label: "Ngày xuất",
                      val: fmtDate(printPhieu.ngayXuat),
                    },
                    {
                      icon: "person-outline",
                      label: "Người nhận",
                      val: printPhieu.nguoiNhan,
                    },
                    {
                      icon: "call-outline",
                      label: "Điện thoại",
                      val: printPhieu.dienThoai || "—",
                    },
                    {
                      icon: "document-text-outline",
                      label: "Lý do xuất",
                      val: printPhieu.lyDoXuat || "—",
                    },
                  ].map((row) => (
                    <View key={row.label} style={s.printInfoRow}>
                      <View style={s.printInfoLeft}>
                        <Ionicons
                          name={row.icon as any}
                          size={13}
                          color={B.primary}
                        />
                        <Text style={s.printInfoLabel}>{row.label}</Text>
                      </View>
                      <Text style={s.printInfoVal}>{row.val}</Text>
                    </View>
                  ))}
                </View>

                {/* Bảng thuốc */}
                <View style={s.printTableWrap}>
                  <View
                    style={[s.printTblHeader, { backgroundColor: B.success }]}>
                    <Text
                      style={[s.printTh, { flex: 0.5, textAlign: "center" }]}>
                      STT
                    </Text>
                    <Text style={[s.printTh, { flex: 2.5 }]}>Tên thuốc</Text>
                    <Text
                      style={[s.printTh, { flex: 0.8, textAlign: "center" }]}>
                      ĐV
                    </Text>
                    <Text
                      style={[s.printTh, { flex: 0.7, textAlign: "center" }]}>
                      SL
                    </Text>
                    <Text
                      style={[s.printTh, { flex: 1.2, textAlign: "right" }]}>
                      Đơn giá
                    </Text>
                    <Text
                      style={[s.printTh, { flex: 1.3, textAlign: "right" }]}>
                      T.Tiền
                    </Text>
                  </View>
                  {printPhieu.chiTiet.map((t, i) => (
                    <View
                      key={t.id}
                      style={[
                        s.printTblRow,
                        i % 2 !== 0 && { backgroundColor: "#F8FAFC" },
                      ]}>
                      <Text
                        style={[
                          s.printTd,
                          { flex: 0.5, textAlign: "center", color: B.textSub },
                        ]}>
                        {i + 1}
                      </Text>
                      <Text
                        style={[s.printTdName, { flex: 2.5 }]}
                        numberOfLines={2}>
                        {t.tenThuoc}
                      </Text>
                      <Text
                        style={[s.printTd, { flex: 0.8, textAlign: "center" }]}>
                        {t.donVi}
                      </Text>
                      <Text
                        style={[
                          s.printTd,
                          { flex: 0.7, textAlign: "center", fontWeight: "700" },
                        ]}>
                        {t.soLuong}
                      </Text>
                      <Text
                        style={[s.printTd, { flex: 1.2, textAlign: "right" }]}>
                        {fmtMoney(t.giaBan)}
                      </Text>
                      <Text
                        style={[
                          s.printTd,
                          {
                            flex: 1.3,
                            textAlign: "right",
                            color: B.success,
                            fontWeight: "800",
                          },
                        ]}>
                        {fmtMoney(t.soLuong * t.giaBan)}
                      </Text>
                    </View>
                  ))}
                  {/* Thanh toán in */}
                  {(() => {
                    const tong = getTongTien(printPhieu.chiTiet);
                    const conNo = tong - printPhieu.daTT;
                    return (
                      <View style={s.printPayBox}>
                        <View style={s.printPayGrid}>
                          <View
                            style={[
                              s.printPayGridCell,
                              {
                                backgroundColor: "#F0FDF4",
                                borderColor: B.success + "40",
                              },
                            ]}>
                            <Text style={s.printPayGridLabel}>Tổng cộng</Text>
                            <Text
                              style={[s.printPayGridVal, { color: B.success }]}>
                              {fmtMoney(tong)}
                            </Text>
                          </View>
                          <View
                            style={[
                              s.printPayGridCell,
                              {
                                backgroundColor: "#EFF6FF",
                                borderColor: B.info + "40",
                              },
                            ]}>
                            <Text style={s.printPayGridLabel}>
                              Đã thanh toán
                            </Text>
                            <Text
                              style={[s.printPayGridVal, { color: B.info }]}>
                              {fmtMoney(printPhieu.daTT)}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            s.printPayConNo,
                            {
                              backgroundColor:
                                conNo > 0 ? "#FFF0F0" : "#F0FDF4",
                              borderColor:
                                conNo > 0 ? B.danger + "40" : B.success + "40",
                            },
                          ]}>
                          <Text
                            style={[
                              s.printPayConNoLabel,
                              { color: conNo > 0 ? B.danger : B.success },
                            ]}>
                            {conNo > 0 ? "Còn nợ" : "Đã thanh toán đủ ✓"}
                          </Text>
                          <Text
                            style={[
                              s.printPayConNoVal,
                              { color: conNo > 0 ? B.danger : B.success },
                            ]}>
                            {fmtMoney(conNo > 0 ? conNo : 0)}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}
                </View>

                {/* Chữ ký */}
                <View style={s.printSigRow}>
                  <View style={s.printSigBox}>
                    <Text style={s.printSigTitle}>Người lập phiếu</Text>
                    <Text style={s.printSigSub}>(Ký, ghi rõ họ tên)</Text>
                    <View style={s.printSigLine} />
                  </View>
                  <View style={s.printSigBox}>
                    <Text style={s.printSigTitle}>Người nhận</Text>
                    <Text style={s.printSigSub}>(Ký, ghi rõ họ tên)</Text>
                    <View style={s.printSigLine} />
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={s.modalFooter}>
              <TouchableOpacity
                style={s.footerBtnCancel}
                onPress={() => setPrintPhieu(null)}>
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color={B.textSub}
                />
                <Text style={s.footerBtnCancelTxt}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.footerBtnSave,
                  { backgroundColor: B.success, flex: 2 },
                ]}
                onPress={() => setPrintPhieu(null)}>
                <Ionicons name="print" size={18} color="#fff" />
                <Text style={s.footerBtnTxt}>In phiếu xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* ── MODAL THANH TOÁN NHANH ── */}
      <Modal
        visible={payModalId !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setPayModalId(null)}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={s.payModalOverlay}>
            <View style={s.payModalCard}>
              <View style={s.payModalHeader}>
                <View
                  style={[s.modalHeaderIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="card" size={17} color={B.success} />
                </View>
                <Text style={s.modalTitle}>Thanh toán</Text>
                <TouchableOpacity
                  onPress={() => setPayModalId(null)}
                  style={s.closeBtn}>
                  <Ionicons name="close" size={18} color={B.textTitle} />
                </TouchableOpacity>
              </View>

              {payModalId &&
                (() => {
                  const p = data.find((x) => x.id === payModalId)!;
                  const tong = getTongTien(p.chiTiet);
                  const conNo = tong - p.daTT;
                  return (
                    <View style={s.payModalBody}>
                      {/* Thông tin phiếu */}
                      <View style={s.payModalInfo}>
                        <View
                          style={[
                            s.maBox,
                            {
                              backgroundColor: "#ECFDF5",
                              alignSelf: "flex-start",
                            },
                          ]}>
                          <Ionicons
                            name="receipt-outline"
                            size={11}
                            color={B.success}
                          />
                          <Text style={[s.maText, { color: B.success }]}>
                            {p.maPhieu}
                          </Text>
                        </View>
                        <Text style={s.payModalName}>{p.nguoiNhan}</Text>
                      </View>

                      {/* Số tiền nợ */}
                      <View style={s.payModalConNoBox}>
                        <Text style={s.payModalConNoLabel}>Còn nợ</Text>
                        <Text style={s.payModalConNoVal}>
                          {fmtMoney(conNo)}
                        </Text>
                      </View>

                      {/* Nhập số tiền thanh toán */}
                      <Text style={s.fLabel}>Số tiền thanh toán</Text>
                      <View
                        style={[
                          s.fInput,
                          { borderColor: B.success, marginBottom: 8 },
                        ]}>
                        <Ionicons
                          name="cash-outline"
                          size={15}
                          color={B.success}
                        />
                        <TextInput
                          style={[
                            s.fTxt,
                            {
                              color: B.success,
                              fontWeight: "800",
                              fontSize: 16,
                            },
                          ]}
                          value={payInput}
                          onChangeText={(v) =>
                            setPayInput(v.replace(/\D/g, ""))
                          }
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={B.textSub}
                          autoFocus
                        />
                        {conNo > 0 && (
                          <TouchableOpacity
                            onPress={() => setPayInput(String(conNo))}
                            style={s.payAllBtn}>
                            <Text style={s.payAllBtnTxt}>Đủ</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      {payInput && Number(payInput) > 0 && (
                        <Text
                          style={[
                            s.moneyHint,
                            { color: B.success, marginBottom: 4 },
                          ]}>
                          {fmtMoney(Number(payInput))} — Còn nợ sau:{" "}
                          {fmtMoney(Math.max(0, conNo - Number(payInput)))}
                        </Text>
                      )}

                      <View style={s.payModalFooter}>
                        <TouchableOpacity
                          style={s.footerBtnCancel}
                          onPress={() => setPayModalId(null)}>
                          <Ionicons
                            name="close-circle-outline"
                            size={17}
                            color={B.textSub}
                          />
                          <Text style={s.footerBtnCancelTxt}>Huỷ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            s.footerBtnSave,
                            { backgroundColor: B.success, flex: 2 },
                          ]}
                          onPress={savePayment}>
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#fff"
                          />
                          <Text style={s.footerBtnTxt}>
                            Xác nhận thanh toán
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })()}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
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

  scroll: { flex: 1 },
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
  dateLabel: {
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
  dateSep: { paddingTop: 18 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: 12,
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
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statNum: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, color: B.textSub, fontWeight: "500" },

  emptyBox: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: B.textTitle },
  emptyText: { fontSize: 12, color: B.textSub },
  emptyBtn: {
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
  emptyBtnText: { fontSize: 13, fontWeight: "700", color: B.primary },

  phieuCard: {
    flexDirection: "row",
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
  phieuAccent: { width: 5 },
  phieuBody: { flex: 1, padding: 12, gap: 8 },
  phieuTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  maBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  maText: { fontSize: 12, fontWeight: "800", color: B.primary },
  ngayBox: { flexDirection: "row", alignItems: "center", gap: 3, flex: 1 },
  ngayText: { fontSize: 11, color: B.textSub },
  nhaCCRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  nhaCCName: { flex: 1, fontSize: 14, fontWeight: "800", color: B.textTitle },
  lyDoText: { fontSize: 11, color: B.textSub, marginTop: 1 },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 11, color: B.textSub },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: B.border },
  soLoaiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  soLoaiTxt: { fontSize: 10, color: B.textSub },
  tongInline: { fontSize: 12, fontWeight: "800" },

  chiTietWrap: { borderTopWidth: 1, borderTopColor: B.border, paddingTop: 6 },
  tblRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tblName: {
    fontSize: 12,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 2,
  },
  tblMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  tblMetaTxt: { fontSize: 10, color: B.textSub },
  dvMiniChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dvMiniTxt: { fontSize: 9, fontWeight: "700", color: B.info },
  tblRight: { alignItems: "flex-end", gap: 2, paddingLeft: 8 },
  tblSL: { fontSize: 10, color: B.textSub },
  tblTT: { fontSize: 12, fontWeight: "800" },

  paymentBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: B.border,
    gap: 6,
    marginTop: 8,
  },
  payRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  payVal: { fontSize: 13, color: B.textTitle, fontWeight: "600" },
  payDivider: { height: 1, backgroundColor: B.border },

  // Pay summary row in list card
  paySummaryRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
  },
  payCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  payCellSep: { width: 1, backgroundColor: B.border },
  payCellLabel: {
    fontSize: 9,
    color: B.textSub,
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  payCellVal: { fontSize: 12, fontWeight: "800" },

  // Form pay grid
  formPayBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginTop: 4,
  },
  formPayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
    backgroundColor: "#F0FDF4",
  },
  formPayHeaderTxt: { fontSize: 12, fontWeight: "700", color: B.success },
  formPayGrid: { flexDirection: "row", flexWrap: "wrap", padding: 8, gap: 8 },
  formPayGridCell: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  formPayGridLabel: {
    fontSize: 10,
    color: B.textSub,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  formPayGridVal: { fontSize: 15, fontWeight: "900" },
  daTTInputWrap: {
    borderWidth: 1.5,
    borderColor: B.info + "60",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: B.white,
  },
  daTTInput: {
    fontSize: 14,
    fontWeight: "800",
    color: B.info,
    textAlign: "center",
    padding: 0,
    minWidth: 90,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: B.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "80%",
    maxHeight: "95%",
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
  modalHeader: {
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
  modalTitle: { fontSize: 16, fontWeight: "800", color: B.textTitle },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  editBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderBottomWidth: 1,
    borderBottomColor: B.warning + "40",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  editBannerTxt: { fontSize: 12, color: "#92400E", fontWeight: "500", flex: 1 },
  modalBody: { flex: 1 },
  modalBodyContent: { padding: 14, paddingBottom: 10 },
  modalFooter: {
    flexDirection: "row",
    padding: 14,
    gap: 8,
    backgroundColor: B.white,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },

  secLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: B.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  secLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  addThuocBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  addThuocTxt: { fontSize: 12, fontWeight: "700", color: B.success },

  fRow: { flexDirection: "row", gap: 10 },
  fField: { gap: 5, marginBottom: 12 },
  fLabel: { fontSize: 12, fontWeight: "700", color: B.textSub },
  fInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: B.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: B.white,
  },
  fInputErr: { borderColor: B.danger },
  fTxt: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
  errTxt: { fontSize: 11, color: B.danger, fontWeight: "600" },

  // Thuốc picker
  thuocPickerWrap: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  thuocPickerSearch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
    backgroundColor: "#F8FAFC",
  },
  thuocPickerInput: { flex: 1, fontSize: 13, color: B.textTitle, padding: 0 },
  thuocPickerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: B.white,
  },
  thuocPickerItemActive: { backgroundColor: "#ECFDF5" },
  thuocPickerName: {
    fontSize: 13,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 2,
  },
  thuocPickerMeta: { fontSize: 11, color: B.textSub },
  tonKhoBadge: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 44,
  },
  tonKhoNum: { fontSize: 15, fontWeight: "900" },
  tonKhoLabel: { fontSize: 9, fontWeight: "600" },
  tonKhoInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#F8FAFC",
    marginBottom: 12,
  },
  tonKhoInfoTxt: { fontSize: 12, color: B.textSub, flex: 1 },

  previewBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: B.success + "40",
    gap: 6,
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  previewVal: { fontSize: 13, fontWeight: "600" },

  emptyThuoc: { alignItems: "center", paddingVertical: 20, gap: 8 },
  emptyThuocTxt: { fontSize: 12, color: B.textSub, textAlign: "center" },

  thuocList: { gap: 8, marginBottom: 4 },
  thuocCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: B.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    paddingHorizontal: 10,
    paddingVertical: 9,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  thuocIdx: {
    width: 26,
    height: 26,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  thuocIdxTxt: { fontSize: 11, fontWeight: "800" },
  thuocCardName: { fontSize: 13, fontWeight: "700", color: B.textTitle },
  thuocCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
    marginTop: 2,
  },
  dvChip: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  dvChipTxt: { fontSize: 10, fontWeight: "700" },
  thuocMetaTxt: { fontSize: 10, color: B.textSub },
  thuocBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  thuocBtnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },

  filterChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: B.border,
    backgroundColor: B.white,
  },
  filterChipTxt: { fontSize: 12, fontWeight: "700" },

  thanhToanBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: B.warning,
  },
  thanhToanBtnTxt: { fontSize: 11, fontWeight: "800", color: "#fff" },

  payModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  payModalCard: {
    backgroundColor: B.white,
    borderRadius: 20,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  payModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  payModalBody: { padding: 16, gap: 10 },
  payModalInfo: { gap: 4 },
  payModalName: { fontSize: 15, fontWeight: "800", color: B.textTitle },
  payModalConNoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: B.danger + "40",
  },
  payModalConNoLabel: { fontSize: 13, fontWeight: "600", color: B.danger },
  payModalConNoVal: { fontSize: 20, fontWeight: "900", color: B.danger },
  payAllBtn: {
    backgroundColor: B.success + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  payAllBtnTxt: { fontSize: 11, fontWeight: "800", color: B.success },
  payModalFooter: { flexDirection: "row", gap: 10, paddingTop: 8 },
  moneyHint: { fontSize: 11, fontWeight: "600" },
  cancelBtnTxt: { fontSize: 14, fontWeight: "700", color: B.textSub },
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
  saveBtnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },

  footerBtnCancel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: B.border,
  },
  footerBtnCancelTxt: { fontSize: 13, fontWeight: "700", color: B.textSub },
  footerBtnSave: {
    flex: 1.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: B.primary,
    ...Platform.select({
      ios: {
        shadowColor: B.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  footerBtnTxt: { fontSize: 13, fontWeight: "800", color: "#fff" },

  // Print
  printClinic: {
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
  printClinicTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  printLogoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  printClinicInfo: { flex: 1 },
  printClinicName: {
    fontSize: 16,
    fontWeight: "900",
    color: B.primary,
    letterSpacing: 0.3,
  },
  printClinicTagline: {
    fontSize: 11,
    color: B.textSub,
    fontWeight: "500",
    marginTop: 2,
  },
  printClinicDivider: {
    height: 1,
    backgroundColor: B.border,
    marginHorizontal: 14,
  },
  printClinicBottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 16,
  },
  printClinicBottomItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  printClinicSub: { fontSize: 11, color: B.textSub, fontWeight: "500" },
  printTitleBox: { alignItems: "center", gap: 8, marginBottom: 14 },
  printTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: B.textTitle,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  printInfoBox: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginBottom: 14,
  },
  printInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  printInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 120,
  },
  printInfoLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  printInfoVal: {
    flex: 1,
    fontSize: 12,
    color: B.textTitle,
    fontWeight: "700",
  },
  printTableWrap: {
    backgroundColor: B.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: B.border,
    overflow: "hidden",
    marginBottom: 20,
  },
  printTblHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  printTh: { fontSize: 10, fontWeight: "700", color: "#fff" },
  printTblRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  printTdName: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  printTd: { fontSize: 11, color: B.textTitle },
  printPayBox: { padding: 10, gap: 8, backgroundColor: "#F8FAFC" },
  printPayGrid: { flexDirection: "row", gap: 8 },
  printPayGridCell: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
  },
  printPayGridLabel: {
    fontSize: 10,
    color: B.textSub,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  printPayGridVal: { fontSize: 14, fontWeight: "800" },
  printPayConNo: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  printPayConNoLabel: { fontSize: 13, fontWeight: "700" },
  printPayConNoVal: { fontSize: 17, fontWeight: "900" },
  printPayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  printPayLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  printPayVal: { fontSize: 14, fontWeight: "700" },
  printSigRow: { flexDirection: "row", gap: 16 },
  printSigBox: { flex: 1, alignItems: "center", gap: 4 },
  printSigTitle: { fontSize: 12, fontWeight: "700", color: B.textTitle },
  printSigSub: { fontSize: 10, color: B.textSub, fontStyle: "italic" },
  printSigLine: {
    width: "100%",
    height: 1,
    backgroundColor: B.border,
    marginTop: 40,
  },
});
