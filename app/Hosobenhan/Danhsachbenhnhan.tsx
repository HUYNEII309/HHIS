import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

const B = {
  primary: "#8A1930",
  primaryLight: "#C01C42",
  background: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
  textTitle: "#1E293B",
  textSub: "#64748B",
  success: "#10B981",
  danger: "#EF4444"
};

interface BenhNhan {
  id: number;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: 'Nam' | 'Nữ' | 'Khác';
  dienThoai: string;
  soCCCD: string;
  diaChi: string;
  ngayKham: string;
}

const Danhsachbenhnhan: React.FC = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  
  const [danhSachBenhNhan, setDanhSachBenhNhan] = useState<BenhNhan[]>([
    { id: 1, hoTen: 'NGUYỄN VĂN AN', ngaySinh: '1985-03-15', gioiTinh: 'Nam', dienThoai: '0912345678', soCCCD: '001085012345', diaChi: 'Hà Nội', ngayKham: '2026-03-20' },
    { id: 2, hoTen: 'TRẦN THỊ BÌNH', ngaySinh: '1990-07-20', gioiTinh: 'Nữ', dienThoai: '0987654321', soCCCD: '001090067890', diaChi: 'TP. Hồ Chí Minh', ngayKham: '2026-03-20' },
  ]);

  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');
  const [timKiem, setTimKiem] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Lấy ngày hôm nay với định dạng dd/mm/yyyy
  const getNgayHomNay = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Set ngày mặc định khi component mount
  useEffect(() => {
    const ngayHomNay = getNgayHomNay();
    setTuNgay(ngayHomNay);
    setDenNgay(ngayHomNay);
  }, []);

  // Format ngày tự động: 19032026 -> 19/03/2026
  const formatDateInput = (text: string, setter: (val: string) => void) => {
    // Chỉ cho phép nhập số
    const numbers = text.replace(/[^\d]/g, '');
    
    if (numbers.length <= 8) {
      let formatted = numbers;
      
      // Tự động thêm dấu /
      if (numbers.length > 2) {
        formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
      }
      if (numbers.length > 4) {
        formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4);
      }
      
      setter(formatted);
    }
  };

  // Chuyển đổi định dạng ngày để so sánh (dd/mm/yyyy -> yyyy-mm-dd)
  const convertDateForCompare = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 10) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // yyyy-mm-dd
    }
    return dateStr;
  };

  // Format ngày hiển thị
  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const danhSachLoc = danhSachBenhNhan.filter(bn => {
    const searchLower = timKiem.toLowerCase();
    const matchSearch = timKiem === '' || 
      bn.hoTen.toLowerCase().includes(searchLower) ||
      bn.dienThoai.includes(timKiem) ||
      bn.soCCCD.includes(timKiem);
    
    let matchNgay = true;
    const tuNgayConverted = convertDateForCompare(tuNgay);
    const denNgayConverted = convertDateForCompare(denNgay);
    
    if (tuNgayConverted && denNgayConverted) {
      matchNgay = bn.ngayKham >= tuNgayConverted && bn.ngayKham <= denNgayConverted;
    } else if (tuNgayConverted) {
      matchNgay = bn.ngayKham >= tuNgayConverted;
    } else if (denNgayConverted) {
      matchNgay = bn.ngayKham <= denNgayConverted;
    }
    
    return matchSearch && matchNgay;
  });

  const xoaBenhNhan = (id: number) => {
    Alert.alert('Xác nhận', 'Xóa bệnh nhân này khỏi danh sách?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => setDanhSachBenhNhan(prev => prev.filter(bn => bn.id !== id)) }
    ]);
  };

  // Xử lý mở camera quét QR
  const handleOpenScanner = async () => {
    if (!permission) {
      // Chưa có permission object
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền camera để quét mã QR');
        return;
      }
    } else if (!permission.granted) {
      // Đã có permission object nhưng chưa granted
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền camera để quét mã QR');
        return;
      }
    }
    
    setScanned(false);
    setShowScanner(true);
  };

  // Xử lý kết quả quét mã
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setShowScanner(false);

    // Xử lý dữ liệu QR từ CCCD
    // Format CCCD QR thường chứa nhiều thông tin cách nhau bởi |
    // VD: 001234567890|NGUYEN VAN A|01/01/1990|...
    
    try {
      const parts = data.split('|');
      let soCCCD = '';

      // Tìm số CCCD (thường là chuỗi số 12 chữ số)
      for (const part of parts) {
        const trimmed = part.trim();
        if (/^\d{12}$/.test(trimmed)) {
          soCCCD = trimmed;
          break;
        }
      }

      // Nếu không tìm thấy định dạng chuẩn, thử lấy phần đầu tiên
      if (!soCCCD && parts.length > 0) {
        const firstPart = parts[0].trim();
        if (/^\d+$/.test(firstPart) && firstPart.length >= 9) {
          soCCCD = firstPart;
        }
      }

      if (soCCCD) {
        setTimKiem(soCCCD);
      } else {
        // Nếu không parse được, hiển thị toàn bộ data
        setTimKiem(data);
      }
    } catch (error) {
      setTimKiem(data);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER SECTION */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.replace('/home')} style={styles.iconBtn}>
            <Ionicons name="home-outline" size={24} color={B.textTitle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quản lý bệnh nhân</Text>
          <TouchableOpacity onPress={() => router.push('/Hosobenhan/Benhnhan')} style={styles.btnAdd}>
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* SEARCH & FILTER CARD */}
        <View style={styles.filterCard}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={B.textSub} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm tên, SĐT hoặc CCCD..."
              value={timKiem}
              onChangeText={setTimKiem}
            />
            <TouchableOpacity style={styles.btnScan} onPress={handleOpenScanner}>
              <Ionicons name="qr-code-outline" size={20} color={B.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateInputGroup}>
              <Ionicons name="calendar-outline" size={16} color={B.textSub} />
              <TextInput 
                style={styles.dateInput} 
                placeholder="dd/mm/yyyy" 
                value={tuNgay} 
                onChangeText={(text) => formatDateInput(text, setTuNgay)}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
            <View style={styles.dateInputGroup}>
              <Ionicons name="calendar-outline" size={16} color={B.textSub} />
              <TextInput 
                style={styles.dateInput} 
                placeholder="dd/mm/yyyy" 
                value={denNgay} 
                onChangeText={(text) => formatDateInput(text, setDenNgay)}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.listCount}>Kết quả: {danhSachLoc.length} bệnh nhân</Text>
        
        {danhSachLoc.map((bn) => (
          <TouchableOpacity 
            key={bn.id} 
            style={styles.patientCard} 
            activeOpacity={0.7}
            onPress={() => router.push({
              pathname: '/Hosobenhan/Khambenhdieutri',
              params: { 
                id: bn.id,
                hoTen: bn.hoTen,
                ngaySinh: bn.ngaySinh,
                gioiTinh: bn.gioiTinh,
                dienThoai: bn.dienThoai,
                soCCCD: bn.soCCCD,
                diaChi: bn.diaChi,
                ngayKham: bn.ngayKham
              }
            })}
          >
            {/* Header Row */}
            <View style={styles.cardHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {bn.hoTen.split(' ').slice(-1)[0][0]}
                </Text>
              </View>
              
              <View style={styles.mainInfo}>
                <Text style={styles.patientName} numberOfLines={1}>{bn.hoTen}</Text>
                <View style={styles.metaRow}>
                  <View style={[styles.genderBadge, { 
                    backgroundColor: bn.gioiTinh === 'Nam' ? '#DBEAFE' : '#FCE7F3' 
                  }]}>
                    <Ionicons 
                      name={bn.gioiTinh === 'Nam' ? 'male' : 'female'} 
                      size={10} 
                      color={bn.gioiTinh === 'Nam' ? '#1E40AF' : '#BE185D'} 
                    />
                    <Text style={[styles.genderText, { 
                      color: bn.gioiTinh === 'Nam' ? '#1E40AF' : '#BE185D' 
                    }]}>
                      {bn.gioiTinh}
                    </Text>
                  </View>
                  <Text style={styles.birthText}>
                    <Ionicons name="calendar-outline" size={11} color={B.textSub} /> {formatDateDisplay(bn.ngaySinh)}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push('/Hosobenhan/Benhnhan');
                  }}
                  activeOpacity={0.6}
                >
                  <Ionicons name="create-outline" size={16} color={B.primaryLight} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={(e) => {
                    e.stopPropagation();
                    xoaBenhNhan(bn.id);
                  }}
                  activeOpacity={0.6}
                >
                  <Ionicons name="trash-outline" size={16} color={B.danger} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Info Grid - 2 columns */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="call" size={14} color={B.textSub} />
                <Text style={styles.infoText} numberOfLines={1}>{bn.dienThoai}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="card" size={14} color={B.textSub} />
                <Text style={styles.infoText} numberOfLines={1}>{bn.soCCCD}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="location" size={14} color={B.textSub} />
                <Text style={styles.infoText} numberOfLines={1}>{bn.diaChi}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={14} color={B.textSub} />
                <Text style={styles.infoText} numberOfLines={1}>{formatDateDisplay(bn.ngayKham)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL QUÉT QR CODE */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <SafeAreaView style={styles.scannerSafeArea}>
            {/* Header Scanner */}
            <View style={styles.scannerHeader}>
              <TouchableOpacity 
                onPress={() => setShowScanner(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.scannerTitle}>Quét mã QR trên CCCD</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Camera View */}
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr', 'pdf417'],
                }}
              >
                {/* Khung quét */}
                <View style={styles.scannerOverlay}>
                  <View style={styles.scannerBox}>
                    <View style={[styles.corner, styles.cornerTopLeft]} />
                    <View style={[styles.corner, styles.cornerTopRight]} />
                    <View style={[styles.corner, styles.cornerBottomLeft]} />
                    <View style={[styles.corner, styles.cornerBottomRight]} />
                  </View>
                </View>

                {/* Hướng dẫn */}
                <View style={styles.instructionContainer}>
                  <Text style={styles.instructionText}>
                    Đặt mã QR trên CCCD vào trong khung
                  </Text>
                </View>
              </CameraView>
            </View>

            {/* Footer */}
            <View style={styles.scannerFooter}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setShowScanner(false)}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
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
    backgroundColor: B.white,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: B.textTitle },
  iconBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 12 },
  btnAdd: { backgroundColor: B.primary, width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  
  filterCard: { marginTop: 8, gap: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: B.textTitle },
  btnScan: { padding: 4 },
  
  dateRow: { flexDirection: 'row', gap: 10 },
  dateInputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
  },
  dateInput: { flex: 1, marginLeft: 6, fontSize: 13, color: B.textTitle },

  scrollContent: { padding: 16, paddingBottom: 100 },
  listCount: { fontSize: 13, color: B.textSub, marginBottom: 10, fontWeight: '600' },
  
  patientCard: {
    backgroundColor: B.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: B.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: B.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  
  mainInfo: {
    flex: 1,
  },
  patientName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: B.textTitle,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  genderBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4,
    gap: 3,
  },
  genderText: { 
    fontSize: 10, 
    fontWeight: '600',
  },
  birthText: {
    fontSize: 11,
    color: B.textSub,
    fontWeight: '500',
  },
  
  cardActions: { 
    flexDirection: 'row', 
    gap: 4,
  },
  actionBtn: { 
    width: 32, 
    height: 32, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: B.border,
  },
  
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
    flex: 0,
    minWidth: '48%',
    maxWidth: '48%',
  },
  infoText: {
    fontSize: 12,
    color: B.textTitle,
    fontWeight: '500',
    flex: 1,
  },

  // Scanner styles
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerSafeArea: {
    flex: 1,
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerBox: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scannerFooter: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  cancelBtn: {
    backgroundColor: B.danger,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Danhsachbenhnhan;