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

interface ChiTietNhap {
  id: number;
  tenThuoc: string;
  soLuong: number;
  donVi: string;
  giaNhap: number;
  giaBan: number;
  hanSuDung: string;
  hangSanXuat: string;
}
interface PhieuNhap {
  id: number;
  maPhieu: string;
  ngayNhap: string;
  nhaCungCap: string;
  dienThoai: string;
  nguoiLienHe: string;
  chiTiet: ChiTietNhap[];
}

const EMPTY_CHITIET = {
  tenThuoc: "",
  soLuong: 0,
  donVi: "viên",
  giaNhap: 0,
  giaBan: 0,
  hanSuDung: "",
  hangSanXuat: "",
};
const DON_VI_LIST = ["viên", "gói", "chai", "ống", "lọ", "tuýp", "hộp", "vỉ"];

const SAMPLE: PhieuNhap[] = [
  {
    id: 1,
    maPhieu: "PN001",
    ngayNhap: `${getCurrentDate()} 08:30`,
    nhaCungCap: "Công ty TNHH Dược Hà Nội",
    dienThoai: "0241234567",
    nguoiLienHe: "Nguyễn Thị Lan",
    chiTiet: [
      {
        id: 1,
        tenThuoc: "Amoxicillin 500mg",
        soLuong: 500,
        donVi: "viên",
        giaNhap: 3000,
        giaBan: 5000,
        hanSuDung: "2027-06-30",
        hangSanXuat: "Domesco",
      },
      {
        id: 2,
        tenThuoc: "Paracetamol 500mg",
        soLuong: 1000,
        donVi: "viên",
        giaNhap: 800,
        giaBan: 2000,
        hanSuDung: "2027-12-31",
        hangSanXuat: "Imexpharm",
      },
    ],
  },
  {
    id: 2,
    maPhieu: "PN002",
    ngayNhap: `${getCurrentDate()} 14:00`,
    nhaCungCap: "Công ty CP Dược phẩm Minh Khai",
    dienThoai: "0281234567",
    nguoiLienHe: "Trần Văn Bộ",
    chiTiet: [
      {
        id: 3,
        tenThuoc: "Nước muối NaCl 0.9%",
        soLuong: 50,
        donVi: "chai",
        giaNhap: 8000,
        giaBan: 15000,
        hanSuDung: "2026-12-31",
        hangSanXuat: "B.Braun",
      },
      {
        id: 4,
        tenThuoc: "Chlorhexidine 0.12%",
        soLuong: 30,
        donVi: "chai",
        giaNhap: 20000,
        giaBan: 35000,
        hanSuDung: "2027-03-31",
        hangSanXuat: "Colgate",
      },
    ],
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

export default function Nhapthuocpk() {
  const router = useRouter();
  const [data, setData] = useState<PhieuNhap[]>(SAMPLE);
  const [tuNgay, setTuNgay] = useState(getCurrentDate());
  const [denNgay, setDenNgay] = useState(getCurrentDate());
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1]));

  // ── Modal phiếu ──
  const [modalVisible, setModalVisible] = useState(false);
  const [editPhieu, setEditPhieu] = useState<PhieuNhap | null>(null);
  const [phieuForm, setPhieuForm] = useState({
    ngayNhap: getCurrentDateTime(),
    nhaCungCap: "",
    dienThoai: "",
    nguoiLienHe: "",
  });
  const [chiTietList, setChiTietList] = useState<Omit<ChiTietNhap, "id">[]>([]);
  const [phieuError, setPhieuError] = useState("");

  // ── Print modal ──
  const [printPhieu, setPrintPhieu] = useState<PhieuNhap | null>(null);

  // ── Inline thuốc form (bên trong modal, KHÔNG dùng Modal thứ 2) ──
  const [thuocFormVisible, setThuocFormVisible] = useState(false);
  const [editThuocIdx, setEditThuocIdx] = useState<number | null>(null);
  const [thuocForm, setThuocForm] = useState({ ...EMPTY_CHITIET });
  const [showDonViPicker, setShowDonViPicker] = useState(false);
  const [thuocError, setThuocError] = useState("");

  // ── Helpers ──
  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const openAdd = () => {
    setEditPhieu(null);
    setPhieuForm({
      ngayNhap: getCurrentDateTime(),
      nhaCungCap: "",
      dienThoai: "",
      nguoiLienHe: "",
    });
    setChiTietList([]);
    setPhieuError("");
    setThuocFormVisible(false);
    setModalVisible(true);
  };

  const openEdit = (p: PhieuNhap) => {
    setEditPhieu(p);
    setPhieuForm({
      ngayNhap: p.ngayNhap,
      nhaCungCap: p.nhaCungCap,
      dienThoai: p.dienThoai,
      nguoiLienHe: p.nguoiLienHe,
    });
    setChiTietList(p.chiTiet.map(({ id, ...rest }) => rest));
    setPhieuError("");
    setThuocFormVisible(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditPhieu(null);
    setPhieuForm({
      ngayNhap: getCurrentDateTime(),
      nhaCungCap: "",
      dienThoai: "",
      nguoiLienHe: "",
    });
    setChiTietList([]);
    setPhieuError("");
    setThuocFormVisible(false);
    setThuocError("");
  };

  const savePhieu = () => {
    if (!phieuForm.nhaCungCap.trim()) {
      setPhieuError("Vui lòng nhập tên nhà cung cấp.");
      return;
    }
    const valid = chiTietList.filter((t) => t.tenThuoc.trim());
    if (valid.length === 0) {
      setPhieuError("Vui lòng thêm ít nhất 1 loại thuốc.");
      return;
    }
    let idC =
      Math.max(...data.flatMap((p) => p.chiTiet.map((t) => t.id)), 0) + 1;
    if (editPhieu) {
      setData((prev) =>
        prev.map((p) =>
          p.id === editPhieu.id
            ? {
                ...p,
                ...phieuForm,
                chiTiet: valid.map((t, i) => ({
                  ...t,
                  id: editPhieu.chiTiet[i]?.id ?? idC++,
                })),
              }
            : p,
        ),
      );
    } else {
      const newId = Math.max(...data.map((p) => p.id), 0) + 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          maPhieu: `PN${String(newId).padStart(3, "0")}`,
          ...phieuForm,
          chiTiet: valid.map((t) => ({ ...t, id: idC++ })),
        },
      ]);
      setExpandedIds((prev) => new Set([...prev, newId]));
    }
    closeModal();
  };

  const deletePhieu = (id: number) => {
    const phieu = data.find((p) => p.id === id);
    Alert.alert(
      "Xác nhận xoá",
      `Bạn có chắc muốn xoá phiếu "${phieu?.maPhieu}" của "${phieu?.nhaCungCap}" không?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () => setData((prev) => prev.filter((p) => p.id !== id)),
        },
      ],
    );
  };

  // ── Thuốc inline form ──
  const openAddThuoc = () => {
    setEditThuocIdx(null);
    setThuocForm({ ...EMPTY_CHITIET });
    setThuocError("");
    setShowDonViPicker(false);
    setThuocFormVisible(true);
  };

  const openEditThuoc = (idx: number) => {
    setEditThuocIdx(idx);
    setThuocForm({ ...chiTietList[idx] });
    setThuocError("");
    setShowDonViPicker(false);
    setThuocFormVisible(true);
  };

  const saveThuoc = () => {
    if (!thuocForm.tenThuoc.trim()) {
      setThuocError("Vui lòng nhập tên thuốc.");
      return;
    }
    if (editThuocIdx !== null) {
      setChiTietList((prev) =>
        prev.map((t, i) => (i === editThuocIdx ? { ...thuocForm } : t)),
      );
    } else {
      setChiTietList((prev) => [...prev, { ...thuocForm }]);
    }
    setThuocFormVisible(false);
    setEditThuocIdx(null);
    setThuocError("");
  };

  const cancelThuoc = () => {
    setThuocFormVisible(false);
    setEditThuocIdx(null);
    setThuocError("");
    setShowDonViPicker(false);
  };

  const removeThuoc = (idx: number) => {
    setChiTietList((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Filter ──
  const filtered = data.filter((p) => {
    const d = p.ngayNhap.split(" ")[0];
    return (
      d >= tuNgay &&
      d <= denNgay &&
      (search === "" ||
        p.nhaCungCap.toLowerCase().includes(search.toLowerCase()) ||
        p.maPhieu.toLowerCase().includes(search.toLowerCase()) ||
        p.nguoiLienHe.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const tongTien = filtered.reduce(
    (s, p) => s + p.chiTiet.reduce((ss, t) => ss + t.soLuong * t.giaNhap, 0),
    0,
  );
  const tongForm = chiTietList.reduce((s, t) => s + t.soLuong * t.giaNhap, 0);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={B.primary} />

      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Nhập thuốc</Text>
            <Text style={s.headerSub}>Quản lý phiếu nhập thuốc</Text>
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
              placeholder="Tìm mã phiếu, nhà cung cấp..."
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
              <Text style={s.statLabel}>Phiếu nhập</Text>
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
                {fmtMoney(tongTien)}
              </Text>
              <Text style={s.statLabel}>Tổng tiền nhập</Text>
            </View>
          </View>
        </View>

        {/* DANH SÁCH */}
        {filtered.length === 0 ? (
          <View style={s.emptyBox}>
            <Ionicons name="receipt-outline" size={56} color={B.border} />
            <Text style={s.emptyTitle}>Chưa có phiếu nhập nào</Text>
            <Text style={s.emptyText}>Nhấn + để tạo phiếu nhập thuốc mới</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={openAdd}>
              <Ionicons name="add-circle" size={16} color={B.primary} />
              <Text style={s.emptyBtnText}>Tạo phiếu nhập</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((phieu) => {
            const exp = expandedIds.has(phieu.id);
            const tong = phieu.chiTiet.reduce(
              (ss, t) => ss + t.soLuong * t.giaNhap,
              0,
            );
            return (
              <View key={phieu.id} style={s.phieuCard}>
                <View style={s.phieuAccent} />
                <View style={s.phieuBody}>
                  {/* Header: mã + ngày + chevron */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(phieu.id)}
                    activeOpacity={0.75}
                    style={s.phieuTopRow}>
                    <View style={s.maBox}>
                      <Ionicons
                        name="receipt-outline"
                        size={11}
                        color={B.primary}
                      />
                      <Text style={s.maText}>{phieu.maPhieu}</Text>
                    </View>
                    <View style={s.ngayBox}>
                      <Ionicons
                        name="time-outline"
                        size={11}
                        color={B.textSub}
                      />
                      <Text style={s.ngayText}>{fmtDate(phieu.ngayNhap)}</Text>
                    </View>
                    <Ionicons
                      name={exp ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={B.textSub}
                    />
                  </TouchableOpacity>

                  {/* Tên NCC + nút In/Sửa/Xóa cùng dòng */}
                  <View style={s.nhaCCRow}>
                    <Text style={s.nhaCCName} numberOfLines={1}>
                      {phieu.nhaCungCap}
                    </Text>
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

                  {/* SĐT + người LH + tổng tiền */}
                  <View style={s.metaRow}>
                    <Ionicons name="call-outline" size={11} color={B.textSub} />
                    <Text style={s.metaText}>{phieu.dienThoai}</Text>
                    <View style={s.dot} />
                    <Ionicons
                      name="person-outline"
                      size={11}
                      color={B.textSub}
                    />
                    <Text style={s.metaText}>{phieu.nguoiLienHe}</Text>
                    <View style={{ flex: 1 }} />
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
                    <Text style={s.tongInline}>{fmtMoney(tong)}</Text>
                  </View>

                  {/* Chi tiết dạng card nhỏ gọn */}
                  {exp && (
                    <View style={s.chiTietWrap}>
                      {phieu.chiTiet.map((t, i) => (
                        <View
                          key={t.id}
                          style={[
                            s.tblRow,
                            i % 2 !== 0 && { backgroundColor: "#FAFAFA" },
                          ]}>
                          {/* Cột trái: tên + meta */}
                          <View style={{ flex: 1 }}>
                            <Text style={s.tblName} numberOfLines={1}>
                              {t.tenThuoc}
                            </Text>
                            <View style={s.tblMeta}>
                              <View style={s.dvMiniChip}>
                                <Text style={s.dvMiniTxt}>{t.donVi}</Text>
                              </View>
                              {t.hangSanXuat ? (
                                <Text style={s.tblMetaTxt}>
                                  {t.hangSanXuat}
                                </Text>
                              ) : null}
                              <Text
                                style={[
                                  s.tblMetaTxt,
                                  { color: B.success, fontWeight: "700" },
                                ]}>
                                {fmtMoney(t.giaBan)}
                              </Text>
                              {t.hanSuDung ? (
                                <Text
                                  style={[s.tblMetaTxt, { color: B.warning }]}>
                                  HSD:{fmtDate(t.hanSuDung)}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                          {/* Cột phải: SL × giá = thành tiền */}
                          <View style={s.tblRight}>
                            <Text style={s.tblSL}>
                              {t.soLuong} × {fmtMoney(t.giaNhap)}
                            </Text>
                            <Text style={s.tblTT}>
                              {fmtMoney(t.soLuong * t.giaNhap)}
                            </Text>
                          </View>
                        </View>
                      ))}
                      <View style={s.tongRow}>
                        <Text style={s.tongLabel}>
                          Tổng tiền nhập ({phieu.chiTiet.length} loại):
                        </Text>
                        <Text style={s.tongVal}>{fmtMoney(tong)}</Text>
                      </View>
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

              {/* Header */}
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
                        ? "Sửa thông tin thuốc"
                        : "Thêm thuốc nhập"
                      : editPhieu
                        ? "Sửa phiếu nhập"
                        : "Tạo phiếu nhập thuốc"}
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

              {/* Banner sửa phiếu */}
              {editPhieu && !thuocFormVisible && (
                <View style={s.editBanner}>
                  <Ionicons name="create" size={13} color={B.warning} />
                  <Text style={s.editBannerTxt}>
                    Đang sửa{" "}
                    <Text style={{ fontWeight: "800" }}>
                      {editPhieu.maPhieu}
                    </Text>{" "}
                    — {editPhieu.nhaCungCap}
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
                  <View style={s.inlineThuocForm}>
                    <View style={s.fField}>
                      <Text style={s.fLabel}>
                        Tên thuốc <Text style={{ color: B.danger }}>*</Text>
                      </Text>
                      <View
                        style={[
                          s.fInput,
                          thuocError &&
                            !thuocForm.tenThuoc.trim() &&
                            s.fInputErr,
                        ]}>
                        <Ionicons
                          name="medkit-outline"
                          size={14}
                          color={B.primary}
                        />
                        <TextInput
                          style={s.fTxt}
                          value={thuocForm.tenThuoc}
                          onChangeText={(v) => {
                            setThuocForm((f) => ({ ...f, tenThuoc: v }));
                            setThuocError("");
                          }}
                          placeholder="Nhập tên thuốc"
                          placeholderTextColor={B.textSub}
                          autoFocus
                        />
                      </View>
                      {thuocError ? (
                        <Text style={s.errTxt}>{thuocError}</Text>
                      ) : null}
                    </View>

                    <View style={s.fRow}>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Số lượng</Text>
                        <View style={s.fInput}>
                          <Ionicons
                            name="layers-outline"
                            size={14}
                            color={B.primary}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={
                              thuocForm.soLuong === 0
                                ? ""
                                : String(thuocForm.soLuong)
                            }
                            onChangeText={(v) =>
                              setThuocForm((f) => ({
                                ...f,
                                soLuong: Number(v.replace(/\D/g, "")),
                              }))
                            }
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                      </View>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Đơn vị</Text>
                        <TouchableOpacity
                          style={s.fInput}
                          onPress={() => setShowDonViPicker(!showDonViPicker)}>
                          <Ionicons
                            name="cube-outline"
                            size={14}
                            color={B.primary}
                          />
                          <Text style={[s.fTxt, { color: B.textTitle }]}>
                            {thuocForm.donVi}
                          </Text>
                          <Ionicons
                            name={
                              showDonViPicker ? "chevron-up" : "chevron-down"
                            }
                            size={13}
                            color={B.textSub}
                          />
                        </TouchableOpacity>
                        {showDonViPicker && (
                          <View style={s.picker}>
                            {DON_VI_LIST.map((dv) => (
                              <TouchableOpacity
                                key={dv}
                                style={[
                                  s.pickerItem,
                                  thuocForm.donVi === dv && s.pickerItemActive,
                                ]}
                                onPress={() => {
                                  setThuocForm((f) => ({ ...f, donVi: dv }));
                                  setShowDonViPicker(false);
                                }}>
                                <Text
                                  style={[
                                    s.pickerTxt,
                                    thuocForm.donVi === dv && {
                                      color: B.primary,
                                      fontWeight: "700",
                                    },
                                  ]}>
                                  {dv}
                                </Text>
                                {thuocForm.donVi === dv && (
                                  <Ionicons
                                    name="checkmark"
                                    size={13}
                                    color={B.primary}
                                  />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={s.fRow}>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Giá nhập (₫)</Text>
                        <View style={s.fInput}>
                          <Ionicons
                            name="arrow-down-circle-outline"
                            size={14}
                            color={B.textSub}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={
                              thuocForm.giaNhap === 0
                                ? ""
                                : String(thuocForm.giaNhap)
                            }
                            onChangeText={(v) =>
                              setThuocForm((f) => ({
                                ...f,
                                giaNhap: Number(v.replace(/\D/g, "")),
                              }))
                            }
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                        {thuocForm.giaNhap > 0 && (
                          <Text style={s.moneyHint}>
                            {fmtMoney(thuocForm.giaNhap)}
                          </Text>
                        )}
                      </View>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Giá bán (₫)</Text>
                        <View
                          style={[s.fInput, { borderColor: B.primary + "60" }]}>
                          <Ionicons
                            name="arrow-up-circle-outline"
                            size={14}
                            color={B.primary}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={
                              thuocForm.giaBan === 0
                                ? ""
                                : String(thuocForm.giaBan)
                            }
                            onChangeText={(v) =>
                              setThuocForm((f) => ({
                                ...f,
                                giaBan: Number(v.replace(/\D/g, "")),
                              }))
                            }
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                        {thuocForm.giaBan > 0 && (
                          <Text style={[s.moneyHint, { color: B.primary }]}>
                            {fmtMoney(thuocForm.giaBan)}
                          </Text>
                        )}
                      </View>
                    </View>

                    {thuocForm.soLuong > 0 && thuocForm.giaNhap > 0 && (
                      <View style={s.previewBox}>
                        <View style={s.previewRow}>
                          <Text style={s.previewLabel}>Thành tiền nhập</Text>
                          <Text
                            style={[
                              s.previewVal,
                              { color: B.primary, fontWeight: "800" },
                            ]}>
                            {fmtMoney(thuocForm.soLuong * thuocForm.giaNhap)}
                          </Text>
                        </View>
                        {thuocForm.giaBan > 0 && (
                          <View style={s.previewRow}>
                            <Text style={s.previewLabel}>
                              Lợi nhuận dự kiến
                            </Text>
                            <Text
                              style={[
                                s.previewVal,
                                {
                                  color:
                                    thuocForm.giaBan > thuocForm.giaNhap
                                      ? B.success
                                      : B.danger,
                                },
                              ]}>
                              {fmtMoney(
                                (thuocForm.giaBan - thuocForm.giaNhap) *
                                  thuocForm.soLuong,
                              )}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    <View style={s.fRow}>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Hãng sản xuất</Text>
                        <View style={s.fInput}>
                          <Ionicons
                            name="business-outline"
                            size={14}
                            color={B.primary}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={thuocForm.hangSanXuat}
                            onChangeText={(v) =>
                              setThuocForm((f) => ({ ...f, hangSanXuat: v }))
                            }
                            placeholder="Tên hãng"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                      </View>
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Hạn sử dụng</Text>
                        <View style={s.fInput}>
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color={B.warning}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={thuocForm.hanSuDung}
                            onChangeText={(v) =>
                              setThuocForm((f) => ({ ...f, hanSuDung: v }))
                            }
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Nút lưu/huỷ thuốc */}
                    <View style={s.thuocBtnRow}>
                      <TouchableOpacity
                        style={s.cancelBtn}
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
                    <Text style={s.secLabel}>Thông tin phiếu nhập</Text>

                    <View style={s.fField}>
                      <Text style={s.fLabel}>Ngày nhập thuốc</Text>
                      <View style={s.fInput}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={B.primary}
                        />
                        <TextInput
                          style={s.fTxt}
                          value={phieuForm.ngayNhap}
                          onChangeText={(v) =>
                            setPhieuForm((f) => ({ ...f, ngayNhap: v }))
                          }
                          placeholder="YYYY-MM-DD HH:MM"
                          placeholderTextColor={B.textSub}
                        />
                      </View>
                    </View>

                    <View style={s.fField}>
                      <Text style={s.fLabel}>
                        Nhà cung cấp <Text style={{ color: B.danger }}>*</Text>
                      </Text>
                      <View
                        style={[
                          s.fInput,
                          phieuError &&
                            !phieuForm.nhaCungCap.trim() &&
                            s.fInputErr,
                        ]}>
                        <Ionicons
                          name="business-outline"
                          size={14}
                          color={B.primary}
                        />
                        <TextInput
                          style={s.fTxt}
                          value={phieuForm.nhaCungCap}
                          onChangeText={(v) => {
                            setPhieuForm((f) => ({ ...f, nhaCungCap: v }));
                            setPhieuError("");
                          }}
                          placeholder="Tên nhà cung cấp"
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
                      <View style={[s.fField, { flex: 1 }]}>
                        <Text style={s.fLabel}>Người liên hệ</Text>
                        <View style={s.fInput}>
                          <Ionicons
                            name="person-outline"
                            size={14}
                            color={B.primary}
                          />
                          <TextInput
                            style={s.fTxt}
                            value={phieuForm.nguoiLienHe}
                            onChangeText={(v) =>
                              setPhieuForm((f) => ({ ...f, nguoiLienHe: v }))
                            }
                            placeholder="Tên người LH"
                            placeholderTextColor={B.textSub}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Danh sách thuốc */}
                    <View style={s.secLabelRow}>
                      <Text style={s.secLabel}>Danh sách thuốc nhập</Text>
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
                                { backgroundColor: B.primary + "15" },
                              ]}>
                              <Text
                                style={[s.thuocIdxTxt, { color: B.primary }]}>
                                {String(idx + 1).padStart(2, "0")}
                              </Text>
                            </View>
                            <View style={{ flex: 1, gap: 3 }}>
                              <Text style={s.thuocCardName} numberOfLines={1}>
                                {t.tenThuoc || "Chưa nhập tên"}
                              </Text>
                              <View style={s.thuocCardMeta}>
                                <View style={s.dvChip}>
                                  <Text style={s.dvChipTxt}>{t.donVi}</Text>
                                </View>
                                <Text style={s.thuocMetaTxt}>
                                  SL: {t.soLuong}
                                </Text>
                                <View style={s.dot} />
                                <Text style={s.thuocMetaTxt}>
                                  {fmtMoney(t.giaNhap)}
                                </Text>
                                <View style={s.dot} />
                                <Text
                                  style={[
                                    s.thuocMetaTxt,
                                    { color: B.primary, fontWeight: "700" },
                                  ]}>
                                  {fmtMoney(t.soLuong * t.giaNhap)}
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
                        <View style={s.tongFormRow}>
                          <Text style={s.tongFormLabel}>
                            Tổng tiền phiếu nhập:
                          </Text>
                          <Text style={s.tongFormVal}>
                            {fmtMoney(tongForm)}
                          </Text>
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

              {/* Footer — chỉ hiện khi form phiếu, form thuốc tự có nút riêng */}
              {!thuocFormVisible && (
                <View style={s.modalFooter}>
                  <TouchableOpacity style={s.cancelBtn} onPress={closeModal}>
                    <Text style={s.cancelBtnTxt}>Huỷ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.saveBtn} onPress={savePhieu}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                    <Text style={s.saveBtnTxt}>
                      {editPhieu ? "Lưu thay đổi" : "Tạo phiếu nhập"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* ── MODAL IN PHIẾU NHẬP ── */}
      <Modal
        visible={printPhieu !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setPrintPhieu(null)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { minHeight: "85%" }]}>
            <View style={s.modalHandle} />

            {/* Header */}
            <View style={s.modalHeader}>
              <View style={s.modalHeaderLeft}>
                <View
                  style={[s.modalHeaderIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="print" size={17} color={B.success} />
                </View>
                <Text style={s.modalTitle}>Phiếu nhập thuốc</Text>
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
                  {/* Logo + tên */}
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
                  {/* Địa chỉ + SĐT */}
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
                  <Text style={s.printTitle}>PHIẾU NHẬP THUỐC</Text>
                  <View style={s.printMaRow}>
                    <View style={s.maBox}>
                      <Ionicons
                        name="receipt-outline"
                        size={11}
                        color={B.primary}
                      />
                      <Text style={s.maText}>{printPhieu.maPhieu}</Text>
                    </View>
                  </View>
                </View>

                {/* Thông tin phiếu */}
                <View style={s.printInfoBox}>
                  {[
                    {
                      icon: "calendar-outline",
                      label: "Ngày nhập",
                      val: fmtDate(printPhieu.ngayNhap),
                    },
                    {
                      icon: "business-outline",
                      label: "Nhà cung cấp",
                      val: printPhieu.nhaCungCap,
                    },
                    {
                      icon: "call-outline",
                      label: "Điện thoại",
                      val: printPhieu.dienThoai || "—",
                    },
                    {
                      icon: "person-outline",
                      label: "Người liên hệ",
                      val: printPhieu.nguoiLienHe || "—",
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
                  {/* Header */}
                  <View style={s.printTblHeader}>
                    <Text
                      style={[s.printTh, { flex: 0.5, textAlign: "center" }]}>
                      STT
                    </Text>
                    <Text style={[s.printTh, { flex: 2.2 }]}>Tên thuốc</Text>
                    <Text
                      style={[s.printTh, { flex: 0.7, textAlign: "center" }]}>
                      SL
                    </Text>
                    <Text
                      style={[s.printTh, { flex: 1.2, textAlign: "right" }]}>
                      Giá nhập
                    </Text>
                    <Text
                      style={[s.printTh, { flex: 1.3, textAlign: "right" }]}>
                      Thành tiền
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
                      <View style={{ flex: 2.2 }}>
                        <Text style={s.printTdName} numberOfLines={1}>
                          {t.tenThuoc}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            flexWrap: "wrap",
                          }}>
                          <View style={s.dvMiniChip}>
                            <Text style={s.dvMiniTxt}>{t.donVi}</Text>
                          </View>
                          {t.hangSanXuat ? (
                            <Text
                              style={[
                                s.printTd,
                                { fontSize: 9, color: B.textSub },
                              ]}>
                              {t.hangSanXuat}
                            </Text>
                          ) : null}
                          <Text
                            style={[
                              s.printTd,
                              {
                                fontSize: 9,
                                color: B.success,
                                fontWeight: "700",
                              },
                            ]}>
                            Bán: {fmtMoney(t.giaBan)}
                          </Text>
                          {t.hanSuDung ? (
                            <Text
                              style={[
                                s.printTd,
                                { fontSize: 9, color: B.warning },
                              ]}>
                              HSD: {fmtDate(t.hanSuDung)}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                      <Text
                        style={[s.printTd, { flex: 0.7, textAlign: "center" }]}>
                        {t.soLuong}
                      </Text>
                      <Text
                        style={[s.printTd, { flex: 1.2, textAlign: "right" }]}>
                        {fmtMoney(t.giaNhap)}
                      </Text>
                      <Text
                        style={[
                          s.printTd,
                          {
                            flex: 1.3,
                            textAlign: "right",
                            color: B.primary,
                            fontWeight: "800",
                          },
                        ]}>
                        {fmtMoney(t.soLuong * t.giaNhap)}
                      </Text>
                    </View>
                  ))}

                  {/* Tổng */}
                  <View style={s.printTotalRow}>
                    <Text style={s.printTotalLabel}>
                      Tổng cộng ({printPhieu.chiTiet.length} loại thuốc)
                    </Text>
                    <Text style={s.printTotalVal}>
                      {fmtMoney(
                        printPhieu.chiTiet.reduce(
                          (ss, t) => ss + t.soLuong * t.giaNhap,
                          0,
                        ),
                      )}
                    </Text>
                  </View>
                </View>

                {/* Chữ ký */}
                <View style={s.printSigRow}>
                  <View style={s.printSigBox}>
                    <Text style={s.printSigTitle}>Người lập phiếu</Text>
                    <Text style={s.printSigSub}>(Ký, ghi rõ họ tên)</Text>
                    <View style={s.printSigLine} />
                  </View>
                  <View style={s.printSigBox}>
                    <Text style={s.printSigTitle}>Thủ kho</Text>
                    <Text style={s.printSigSub}>(Ký, ghi rõ họ tên)</Text>
                    <View style={s.printSigLine} />
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={s.modalFooter}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setPrintPhieu(null)}>
                <Text style={s.cancelBtnTxt}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveBtn, { backgroundColor: B.success }]}
                onPress={() => setPrintPhieu(null)}>
                <Ionicons name="print-outline" size={18} color="#fff" />
                <Text style={s.saveBtnTxt}>In phiếu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  phieuAccent: { width: 5, backgroundColor: B.primary },
  phieuBody: { flex: 1, padding: 12, gap: 8 },
  phieuTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
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
  nhaCCName: { flex: 1, fontSize: 14, fontWeight: "800", color: B.textTitle },
  nhaCCRow: { flexDirection: "row", alignItems: "center", gap: 6 },
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
  dotSm: { fontSize: 10, color: B.border },
  dvMiniChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dvMiniTxt: { fontSize: 9, fontWeight: "700", color: B.info },
  tblRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 2,
    paddingLeft: 8,
  },
  tblSL: { fontSize: 10, color: B.textSub },
  tblTT: { fontSize: 12, fontWeight: "800", color: B.primary },
  giaBanTxt: { fontSize: 10, color: B.textSub },
  td: { fontSize: 11, color: B.textTitle },
  tongRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 9,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    marginTop: 4,
  },
  tongLabel: { fontSize: 11, fontWeight: "600", color: B.textSub },
  tongVal: { fontSize: 14, fontWeight: "800", color: B.primary },

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
  tongInline: { fontSize: 12, fontWeight: "800", color: B.primary },

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
    gap: 10,
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
  moneyHint: {
    fontSize: 11,
    color: B.success,
    fontWeight: "600",
    marginTop: 3,
  },

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
  dvChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dvChipTxt: { fontSize: 10, fontWeight: "700", color: B.info },
  thuocMetaTxt: { fontSize: 10, color: B.textSub },
  thuocBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  tongFormRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: B.primary + "30",
    marginTop: 4,
  },
  tongFormLabel: { fontSize: 12, fontWeight: "700", color: B.textSub },
  tongFormVal: { fontSize: 16, fontWeight: "800", color: B.primary },

  inlineThuocForm: { gap: 0 },
  thuocBtnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },

  previewBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: B.border,
    gap: 6,
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontSize: 12, color: B.textSub, fontWeight: "500" },
  previewVal: { fontSize: 13, color: B.textTitle, fontWeight: "600" },

  picker: {
    borderWidth: 1,
    borderColor: B.border,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: B.white,
  },
  pickerItemActive: { backgroundColor: "#FEF2F2" },
  pickerTxt: { flex: 1, fontSize: 13, color: B.textTitle },

  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
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
  printClinicPhone: { fontSize: 11, color: B.textSub },
  printTitleBox: { alignItems: "center", gap: 8, marginBottom: 14 },
  printTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: B.textTitle,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  printMaRow: { flexDirection: "row", justifyContent: "center" },
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
    width: 130,
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
    backgroundColor: B.primary,
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
  printTdName: {
    fontSize: 12,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 2,
  },
  printTd: { fontSize: 11, color: B.textTitle },
  printTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#FEF2F2",
  },
  printTotalLabel: { fontSize: 12, fontWeight: "700", color: B.textSub },
  printTotalVal: { fontSize: 16, fontWeight: "900", color: B.primary },
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
