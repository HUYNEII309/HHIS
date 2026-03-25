import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
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

interface Report {
  id: string;
  name: string;
  selected: boolean;
}

const REPORTS: Report[] = [
  {
    id: "1",
    name: "Danh sách bệnh nhân khám bệnh",
    selected: false,
  },
  {
    id: "2",
    name: "Báo cáo thủ thuật theo bác sĩ",
    selected: false,
  },
  {
    id: "3",
    name: "Danh sách bệnh nhân nợ tiền",
    selected: false,
  },
  {
    id: "4",
    name: "Báo cáo thu chi",
    selected: false,
  },
];

export default function GuiEmailTuDong() {
  const router = useRouter();

  const [senderEmail, setSenderEmail] = useState("");
  const [senderPassword, setSenderPassword] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [sendDate, setSendDate] = useState("");
  const [sendHour, setSendHour] = useState("");
  const [sendMinute, setSendMinute] = useState("");
  const [reports, setReports] = useState<Report[]>(REPORTS);

  const minuteInputRef = useRef<TextInput>(null);

  const addRecipient = () => {
    if (!recipientEmail.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email người nhận");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail.trim())) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    if (recipients.includes(recipientEmail.trim())) {
      Alert.alert("Lỗi", "Email này đã được thêm");
      return;
    }

    setRecipients([...recipients, recipientEmail.trim()]);
    setRecipientEmail("");
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const toggleReport = (id: string) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, selected: !report.selected } : report,
      ),
    );
  };

  const handleLogin = () => {
    if (!senderEmail.trim() || !senderPassword.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin đăng nhập");
      return;
    }
    Alert.alert("Thành công", "Đăng nhập thành công!");
  };

  const handleUpdateConfig = () => {
    Alert.alert("Thành công", "Cập nhật cấu hình gửi email thành công!");
  };

  const handleSendEmail = () => {
    const selectedReports = reports.filter((r) => r.selected);
    if (selectedReports.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một báo cáo để gửi");
      return;
    }
    if (recipients.length === 0) {
      Alert.alert("Lỗi", "Vui lòng thêm ít nhất một người nhận");
      return;
    }
    Alert.alert("Thành công", "Email đã được gửi thành công!");
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
              onPress={() => router.push("/home")}>
              <Ionicons name="chevron-back" size={20} color={B.primary} />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Cấu Hình Email</Text>
            <View style={styles.pageBackBtnPlaceholder} />
          </View>
          {/* Sender Information */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Thông Tin Người Gửi</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Người gửi email</Text>
              <View style={styles.inputBox}>
                <Ionicons name="mail" size={16} color={B.textSub} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email người gửi"
                  value={senderEmail}
                  onChangeText={setSenderEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu người gửi email</Text>
              <View style={styles.inputBox}>
                <Ionicons name="lock-closed" size={16} color={B.textSub} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  value={senderPassword}
                  onChangeText={setSenderPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginBtnText}>Đăng nhập</Text>
              </TouchableOpacity>

              <View style={styles.orDivider}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>hoặc</Text>
                <View style={styles.orLine} />
              </View>

              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() =>
                  Alert.alert(
                    "Thông báo",
                    "Tính năng đăng nhập Google đang phát triển",
                  )
                }>
                <Ionicons name="logo-google" size={18} color="#DB4437" />
                <Text style={styles.googleBtnText}>Đăng nhập bằng Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recipients */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Người Nhận Email</Text>

            <View style={styles.inputGroup}>
              <View style={styles.addRecipientRow}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Ionicons name="person-add" size={16} color={B.textSub} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập email người nhận"
                    value={recipientEmail}
                    onChangeText={setRecipientEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity
                  style={styles.addRecipientBtn}
                  onPress={addRecipient}>
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {recipients.length > 0 && (
              <View style={styles.recipientsList}>
                <Text style={styles.recipientsTitle}>
                  Danh sách người nhận:
                </Text>
                {recipients.map((email, index) => (
                  <View key={index} style={styles.recipientItem}>
                    <Text style={styles.recipientEmail}>{email}</Text>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeRecipient(email)}>
                      <Ionicons name="close" size={16} color={B.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Previous Email Sending */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Gửi Email Trước Đó</Text>

            <View style={styles.timeRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Gửi trước đó:</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="calendar" size={16} color={B.textSub} />
                  <TextInput
                    style={styles.input}
                    placeholder="Số ngày"
                    value={sendDate}
                    onChangeText={setSendDate}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Lúc</Text>
                <View style={styles.timeInputRow}>
                  <View style={[styles.inputBox, { flex: 1, marginRight: 4 }]}>
                    <TextInput
                      style={styles.input}
                      placeholder="HH"
                      value={sendHour}
                      onChangeText={(text) => {
                        setSendHour(text);
                        if (text.length === 2) {
                          minuteInputRef.current?.focus();
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={[styles.inputBox, { flex: 1, marginLeft: 4 }]}>
                    <TextInput
                      ref={minuteInputRef}
                      style={styles.input}
                      placeholder="MM"
                      value={sendMinute}
                      onChangeText={setSendMinute}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Report Selection */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Chọn Báo Cáo Để Gửi Email</Text>

            <View style={styles.reportsGrid}>
              {reports.map((report) => (
                <TouchableOpacity
                  key={report.id}
                  style={[
                    styles.reportToggle,
                    report.selected && styles.reportToggleActive,
                  ]}
                  onPress={() => toggleReport(report.id)}>
                  <Text
                    style={[
                      styles.reportToggleText,
                      report.selected && styles.reportToggleTextActive,
                    ]}>
                    {report.name}
                  </Text>
                  <View
                    style={[
                      styles.toggleIndicator,
                      report.selected && styles.toggleIndicatorActive,
                    ]}>
                    <Ionicons
                      name={
                        report.selected ? "checkmark-circle" : "close-circle"
                      }
                      size={20}
                      color={report.selected ? B.success : B.danger}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.inlineFooter}>
            <View style={styles.footerRow}>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={handleUpdateConfig}>
                <Ionicons name="settings-outline" size={16} color="#fff" />
                <Text style={styles.updateBtnText}>Update Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendEmail}>
                <Ionicons name="send-outline" size={16} color="#fff" />
                <Text style={styles.sendBtnText}>Gửi Email</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => router.back()}>
              <Ionicons name="close-circle" size={18} color="#fff" />
              <Text style={styles.closeBtnText}>ĐÓNG LẠI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: B.background },
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
  scrollContent: { padding: 14, paddingBottom: 20 },

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

  buttonGroup: { gap: 12 },
  loginBtn: {
    backgroundColor: B.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  orLine: { flex: 1, height: 1, backgroundColor: B.border },
  orText: { fontSize: 12, color: B.textSub, fontWeight: "500" },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: B.white,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: B.border,
  },
  googleBtnText: { fontSize: 14, fontWeight: "600", color: B.textTitle },

  addRecipientRow: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  addRecipientBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: B.success,
    justifyContent: "center",
    alignItems: "center",
  },

  recipientsList: { marginTop: 12 },
  recipientsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: B.textTitle,
    marginBottom: 8,
  },
  recipientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  recipientEmail: { fontSize: 13, color: B.textTitle, flex: 1 },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  timeRow: { flexDirection: "row", gap: 12 },

  timeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timeSeparator: {
    fontSize: 16,
    fontWeight: "600",
    color: B.textTitle,
    marginHorizontal: 4,
  },

  reportsGrid: { gap: 8 },
  reportToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
    padding: 12,
  },
  reportToggleActive: {
    backgroundColor: B.primary,
    borderColor: B.primary,
  },
  reportToggleText: {
    fontSize: 13,
    color: B.textTitle,
    fontWeight: "500",
    flex: 1,
  },
  reportToggleTextActive: { color: "#fff" },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: B.white,
    borderWidth: 1,
    borderColor: B.border,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleIndicatorActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
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
  updateBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: B.warning,
    ...Platform.select({
      ios: {
        shadowColor: B.warning,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  updateBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  sendBtn: {
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
  sendBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});
