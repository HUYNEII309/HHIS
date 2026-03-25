import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

export default function DangKyBanQuyen() {
  const router = useRouter();

  const [tenCoSo, setTenCoSo] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [dienThoai, setDienThoai] = useState("");
  const [giayPhepKCB, setGiayPhepKCB] = useState("");
  const [facebook, setFacebook] = useState("");
  const [anhLogo, setAnhLogo] = useState<string | null>(null);

  const pickImage = async () => {
    Alert.alert("Chọn ảnh", "Chọn nguồn ảnh", [
      {
        text: "Camera",
        onPress: () => openCamera(),
      },
      {
        text: "Thư viện",
        onPress: () => openGallery(),
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAnhLogo(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAnhLogo(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!tenCoSo.trim() || !diaChi.trim() || !dienThoai.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    Alert.alert("Thành công", "Đăng ký bản quyền thành công!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={B.primary} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          <View style={styles.pageHeaderRow}>
            <TouchableOpacity
              style={styles.pageBackBtn}
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color={B.primary} />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Đăng Ký Bản Quyền</Text>
            <View style={styles.pageBackBtnPlaceholder} />
          </View>

          {/* Registration Form */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Thông Tin Cơ Sở</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Tên cơ sở <Text style={{ color: B.danger }}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <Ionicons name="business" size={16} color={B.textSub} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên cơ sở y tế"
                  value={tenCoSo}
                  onChangeText={setTenCoSo}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Địa chỉ <Text style={{ color: B.danger }}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <Ionicons name="location" size={16} color={B.textSub} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập địa chỉ cơ sở"
                  value={diaChi}
                  onChangeText={setDiaChi}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Điện thoại <Text style={{ color: B.danger }}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <Ionicons name="call" size={16} color={B.textSub} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  value={dienThoai}
                  onChangeText={setDienThoai}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Giấy phép KCB</Text>
              <View style={styles.inputBox}>
                <Ionicons name="document-text" size={16} color={B.textSub} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số giấy phép KCB"
                  value={giayPhepKCB}
                  onChangeText={setGiayPhepKCB}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Facebook</Text>
              <View style={styles.inputBox}>
                <Ionicons name="logo-facebook" size={16} color={B.textSub} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập link Facebook (không bắt buộc)"
                  value={facebook}
                  onChangeText={setFacebook}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ảnh Logo Cơ Sở</Text>
              {anhLogo ? (
                <View style={styles.logoPreview}>
                  <Image source={{ uri: anhLogo }} style={styles.logoImage} />
                  <TouchableOpacity
                    style={styles.changeLogoBtn}
                    onPress={pickImage}>
                    <Ionicons name="camera" size={16} color="#fff" />
                    <Text style={styles.changeLogoText}>Đổi ảnh</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.logoUploadBtn}
                  onPress={pickImage}>
                  <Ionicons name="camera" size={24} color={B.primary} />
                  <Text style={styles.logoUploadText}>Chọn ảnh logo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.inlineFooter}>
            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Ionicons name="save-outline" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Lưu Lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => router.back()}>
                <Ionicons name="close-circle" size={18} color="#fff" />
                <Text style={styles.closeBtnText}>ĐÓNG</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: B.background },

  scrollView: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 20 },

  pageHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pageBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  pageBackBtnPlaceholder: {
    width: 36,
    height: 36,
  },
  pageTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: B.primary,
  },

  sectionCard: {
    backgroundColor: B.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: B.border,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: B.primary,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: B.textTitle,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  input: { flex: 1, fontSize: 14, color: B.textTitle },

  logoUploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    borderStyle: "dashed",
    paddingVertical: 20,
  },
  logoUploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: B.primary,
  },

  logoPreview: {
    alignItems: "center",
    gap: 12,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: B.primary,
  },
  changeLogoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: B.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: B.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  changeLogoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  inlineFooter: {
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  footerRow: {
    flexDirection: "row",
    gap: 12,
  },

  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: B.success,
    ...Platform.select({
      ios: {
        shadowColor: B.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  saveBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },

  closeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: B.danger,
    ...Platform.select({
      ios: {
        shadowColor: B.danger,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
});
