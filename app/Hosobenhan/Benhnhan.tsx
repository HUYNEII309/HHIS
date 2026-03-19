import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";

// Bảng màu đồng bộ với Dashboard
const B = {
  primary: "#8A1930",
  background: "#F1F5F9",
  white: "#FFFFFF",
  border: "#E2E8F0",
  textTitle: "#1E293B",
  textSub: "#64748B",
};

const MEDICAL_HISTORY_LABELS = [
  "Chảy máu lâu",
  "Dị ứng thuốc",
  "Thấp khớp",
  "Huyết áp",
  "Tim mạch",
  "Tiểu đường",
  "Dạ dày",
  "Phổi",
  "Truyền nhiễm",
  "Thai sản",
];

// ============ INTERFACE ============
interface CCCDInfo {
  name?: string;
  dob?: string;
  gender?: string;
  cccd?: string;
  address?: string;
}

// ============ UTILITY FUNCTIONS ============

// Validate số CCCD (12 chữ số)
const isValidCCCD = (cccd: string): boolean => {
  return /^\d{12}$/.test(cccd?.trim() || "");
};

// Chuẩn hóa giới tính
const normalizeGender = (genderStr: string): string => {
  const normalized = genderStr?.trim().toUpperCase() || "";
  if (normalized === "F" || normalized === "2" || normalized === "NỮ")
    return "Nữ";
  return "Nam";
};

// Chuyển đổi DDMMYYYY sang DD/MM/YYYY
const formatDOB = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(0, 2)}/${dateStr.substring(2, 4)}/${dateStr.substring(4, 8)}`;
};

// ============ PARSE CCCD QR DATA ============
const parseCCCDQRData = (qrData: string): CCCDInfo => {
  const parts = qrData.split("|").map((p) => p?.trim());

  if (parts.length < 5) return {};

  // Định dạng chuẩn:
  // [0]: Số CCCD
  // [1]: Phần phụ (thường trống)
  // [2]: Họ và tên
  // [3]: Ngày sinh DDMMYYYY
  // [4]: Giới tính
  // [5+]: Địa chỉ (nhiều phần, có thể bị lặp lại)

  const cccd = parts[0] || "";
  const name = parts[2] || "";
  const dob = parts[3] || "";
  const genderRaw = parts[4] || "";

  // Kiểm tra CCCD hợp lệ
  if (!isValidCCCD(cccd)) {
    return {};
  }

  // Lấy các phần địa chỉ từ [5] trở đi
  const addressParts: string[] = [];
  for (let i = 5; i < parts.length; i++) {
    const part = parts[i];

    // Bỏ qua phần trống
    if (!part || part.length === 0) {
      continue;
    }

    // Bỏ qua ngày tháng DDMMYYYY
    if (/^\d{8}$/.test(part)) {
      continue;
    }

    // Bỏ qua các phần toàn số (mã vùng)
    if (/^\d+$/.test(part)) {
      continue;
    }

    addressParts.push(part);
  }

  // Loại bỏ các phần trùng lặp, giữ lần đầu tiên
  const uniqueAddressParts = Array.from(new Set(addressParts));

  // Chỉ lấy 3 phần đầu tiên
  const finalAddressParts = uniqueAddressParts.slice(0, 3);
  const address = finalAddressParts.join(", ");

  const gender = normalizeGender(genderRaw);

  return {
    cccd: cccd,
    name: name,
    dob: dob,
    gender: gender,
    address: address,
  };
};

// ==========================================

export default function Benhnhan() {
  const router = useRouter();
  const [history, setHistory] = useState<Record<string, boolean>>({});

  // Form states
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("--");
  const [gender, setGender] = useState("Nam");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cccd, setCCCD] = useState("");
  const [profession, setProfession] = useState("");
  const [bhyt, setBHYT] = useState("");
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const cameraRef = useRef(null);

  // ============ CAMERA FUNCTIONS ============
  const handleScannerButtonPress = async () => {
    if (cameraPermission?.status !== "granted") {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert(
          "Lỗi",
          "Ứng dụng cần quyền truy cập camera để quét CCCD"
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (!isScanning) return;

    setIsScanning(false);

    try {
      // Parse dữ liệu QR
      const cccdInfo = parseCCCDQRData(data);

      // Điền thông tin vào form
      if (cccdInfo.name) setFullName(cccdInfo.name);
      if (cccdInfo.cccd) setCCCD(cccdInfo.cccd);
      if (cccdInfo.dob) {
        const formattedDob = formatDOB(cccdInfo.dob);
        setDob(formattedDob);

        // Tính tuổi
        const currentYear = new Date().getFullYear();
        const year = parseInt(cccdInfo.dob.substring(4, 8));
        if (year > 1900 && year <= currentYear) {
          setAge((currentYear - year).toString());
        }
      }
      if (cccdInfo.gender) setGender(cccdInfo.gender);
      if (cccdInfo.address) setAddress(cccdInfo.address);

      // Đóng camera tự động
      setShowCamera(false);
      setIsScanning(true);
    } catch (error) {
      console.error("❌ Lỗi:", error);
      Alert.alert("Lỗi", "Không thể đọc thông tin từ QR code này");
      setIsScanning(true);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setIsScanning(true);
  };

  // ==========================================

  const handleDobChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    setDob(formatted);

    const currentYear = new Date().getFullYear();
    if (cleaned.length === 4) {
      const year = parseInt(cleaned);
      if (year > 1900 && year <= currentYear)
        setAge((currentYear - year).toString());
    } else if (cleaned.length === 8) {
      const year = parseInt(cleaned.slice(4, 8));
      if (year > 1900 && year <= currentYear)
        setAge((currentYear - year).toString());
    } else {
      setAge("--");
    }
  };

  const toggleHistory = (item: string) => {
    setHistory((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const SectionTitle = ({ title, icon }: { title: string; icon: any }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color={B.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={B.textTitle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hồ Sơ Bệnh Nhân</Text>
          <TouchableOpacity
            onPress={handleScannerButtonPress}
            style={styles.scanBtn}
          >
            <Ionicons name="scan-outline" size={24} color={B.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        <View style={styles.card}>
          <SectionTitle
            title="Thông tin cơ bản"
            icon="person-circle-outline"
          />

          <CustomInput
            label="Họ và tên"
            placeholder="NGUYỄN VĂN A"
            required
            autoCapitalize="characters"
            value={fullName}
            onChangeText={setFullName}
          />

          <View style={styles.row}>
            <View style={{ flex: 1.5, marginRight: 8 }}>
              <CustomInput
                label="Ngày sinh"
                placeholder="1990 hoặc 01011990"
                value={dob}
                onChangeText={handleDobChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={{ flex: 0.5, marginRight: 8 }}>
              <CustomInput
                label="Tuổi"
                value={age}
                editable={false}
                style={[
                  styles.input,
                  {
                    textAlign: "center",
                    backgroundColor: "#F1F5F9",
                    fontWeight: "700",
                  },
                ]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Giới tính</Text>
              <TouchableOpacity
                style={styles.genderSelector}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={styles.genderValue}>{gender}</Text>
                <Ionicons name="chevron-down" size={16} color={B.textSub} />
              </TouchableOpacity>
            </View>
          </View>

          <CustomInput
            label="Điện thoại"
            placeholder="090..."
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <CustomInput
            label="Địa chỉ"
            placeholder="Số nhà, tên đường..."
            value={address}
            onChangeText={setAddress}
          />
          <CustomInput
            label="Nghề nghiệp"
            placeholder="Công nhân, nhân viên..."
            value={profession}
            onChangeText={setProfession}
          />
          <CustomInput
            label="Số thẻ BHYT"
            placeholder="Nhập số thẻ..."
            value={bhyt}
            onChangeText={setBHYT}
          />
          <CustomInput
            label="Số CCCD"
            placeholder="Nhập 12 số..."
            keyboardType="numeric"
            value={cccd}
            onChangeText={setCCCD}
          />
          <CustomInput
            label="Lý do khám"
            placeholder="Đau răng, nhổ răng..."
            multiline
            value={reason}
            onChangeText={setReason}
          />
          <CustomInput
            label="Người liên hệ (khi cần)"
            placeholder="Tên & SĐT người thân"
            value={contact}
            onChangeText={setContact}
          />
        </View>

        {/* NHÓM 2: CHỈ SỐ SỨC KHỎE */}
        <View style={styles.card}>
          <SectionTitle title="Chỉ số sinh tồn" icon="pulse-outline" />
          <View style={styles.row}>
            <View style={styles.col3}>
              <CustomInput
                label="Mạch (l/ph)"
                placeholder="75"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.col3}>
              <CustomInput
                label="Nhịp thở"
                placeholder="20"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.col3}>
              <CustomInput
                label="Nhiệt độ (°C)"
                placeholder="36.5"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <CustomInput
                label="Cân nặng (kg)"
                placeholder="60"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CustomInput label="Huyết áp (mHg)" placeholder="120/80" keyboardType="numeric" />
            </View>
          </View>
        </View>

        {/* NHÓM 3: TIỀN SỬ BỆNH */}
        <View style={styles.card}>
          <SectionTitle title="Tiền sử bệnh" icon="medical-outline" />
          <View style={styles.historyGrid}>
            {MEDICAL_HISTORY_LABELS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleHistory(item)}
                style={[
                  styles.historyItem,
                  history[item] && styles.historyItemActive,
                ]}
              >
                <Ionicons
                  name={history[item] ? "checkbox" : "square-outline"}
                  size={20}
                  color={history[item] ? B.primary : B.textSub}
                />
                <Text
                  style={[
                    styles.historyLabel,
                    history[item] && styles.textActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <CustomInput
            label="Tiền sử khác"
            placeholder="Các dị ứng đặc biệt khác..."
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => router.back()}
          >
            <Text style={styles.btnTextCancel}>Đóng lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSave}>
            <Ionicons
              name="save-outline"
              size={20}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnTextSave}>Lưu hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ============ CAMERA MODAL ============ */}
      <Modal visible={showCamera} animationType="slide">
        <SafeAreaView style={styles.cameraContainer}>
          <View style={styles.cameraHeader}>
            <TouchableOpacity onPress={handleCloseCamera}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Quét QR CCCD</Text>
            <View style={{ width: 28 }} />
          </View>

          {cameraPermission?.granted ? (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              onBarcodeScanned={
                isScanning ? handleBarCodeScanned : undefined
              }
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.scanFrame} />
                <Text style={styles.scanHint}>
                  Đặt QR code CCCD vào khung để quét
                </Text>
              </View>
            </CameraView>
          ) : (
            <View style={styles.noCameraPermission}>
              <Ionicons
                name="alert-circle-outline"
                size={64}
                color={B.textSub}
              />
              <Text style={styles.noCameraText}>
                Không có quyền truy cập camera
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* MODAL CHỌN GIỚI TÍNH */}
      <Modal visible={showGenderModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.genderModalContent}>
            <Text style={styles.modalTitle}>Chọn giới tính</Text>
            {["Nam", "Nữ", "Khác"].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.genderOption}
                onPress={() => {
                  setGender(item);
                  setShowGenderModal(false);
                }}
              >
                <Text
                  style={[
                    styles.genderOptionText,
                    gender === item && {
                      color: B.primary,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {item}
                </Text>
                {gender === item && (
                  <Ionicons name="checkmark" size={20} color={B.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const CustomInput = ({ label, required, style, ...props }: any) => {
  const isAddressField = label === "Địa chỉ";

  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={{ color: "red", marginLeft: 4 }}>*</Text>}
      </View>
      <TextInput
        style={[
          styles.input,
          style,
          props.multiline && { height: 80, textAlignVertical: "top" },
          isAddressField &&
            !props.multiline && {
              minHeight: 80,
              height: "auto",
              textAlignVertical: "top",
              paddingTop: 10,
            },
        ]}
        placeholderTextColor="#94A3B8"
        multiline={isAddressField ? true : props.multiline}
        scrollEnabled={true}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: B.background },
  header: {
    backgroundColor: B.white,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  headerContent: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: B.textTitle },
  backBtn: { padding: 4 },
  scanBtn: { padding: 4 },
  scrollBody: { padding: 16 },
  card: {
    backgroundColor: B.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: B.primary,
    textTransform: "uppercase",
  },
  inputGroup: { marginBottom: 12 },
  labelRow: { flexDirection: "row", marginBottom: 6 },
  label: { fontSize: 13, fontWeight: "600", color: B.textSub },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: B.textTitle,
  },
  row: { flexDirection: "row", alignItems: "flex-end" },
  col3: { flex: 1, marginHorizontal: 4 },
  genderSelector: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  genderValue: { fontSize: 15, color: B.textTitle },
  historyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  historyItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  historyItemActive: { backgroundColor: "#FFF1F2", borderColor: "#FECDD3" },
  historyLabel: { marginLeft: 8, fontSize: 14, color: B.textTitle },
  textActive: { fontWeight: "600", color: B.primary },
  footer: { flexDirection: "row", gap: 12, marginTop: 10, paddingBottom: 40 },
  btnSave: {
    flex: 2,
    backgroundColor: B.primary,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextSave: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  btnTextCancel: { color: B.textTitle, fontSize: 16, fontWeight: "600" },

  // ============ CAMERA STYLES ============
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#000",
  },
  cameraTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  camera: { flex: 1 },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: B.primary,
    borderRadius: 20,
    backgroundColor: "rgba(138, 25, 48, 0.1)",
  },
  scanHint: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  noCameraPermission: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCameraText: {
    color: B.textSub,
    fontSize: 16,
    marginTop: 12,
  },

  // ============ MODAL STYLES ============
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  genderModalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: B.textTitle,
    marginBottom: 15,
    textAlign: "center",
  },
  genderOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  genderOptionText: { fontSize: 16, color: B.textTitle },
});