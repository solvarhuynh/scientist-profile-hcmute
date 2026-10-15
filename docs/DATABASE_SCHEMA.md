# CẤU TRÚC CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)
## Cổng Thông tin Lý lịch Khoa học HCMUTE

Hệ thống hiện tại sử dụng **Google Sheets** làm cơ sở dữ liệu quan hệ mô phỏng (Relational Spreadsheet Database), được chuẩn hóa thành **8 bảng (sheets)**. Khóa chính định danh tài khoản xuyên suốt là trường `Email` (viết thường, loại bỏ khoảng trắng).

---

## 1. Danh sách các Bảng & Định nghĩa Cột

### 1.1 Sheet `ThongTinCoBan` (Bảng Thông tin cá nhân & Liên hệ)
- **Khóa chính:** `Email` (Một email chỉ có tối đa 1 dòng duy nhất, ghi đè khi cập nhật).
- **Cấu trúc cột (16 cột - A đến P):**
  | Cột | Tên trường | Kiểu dữ liệu | Mô tả |
  |---|---|---|---|
  | A | Email | Text (Unique) | Email tài khoản định danh |
  | B | HoTen | Text | Họ và tên đầy đủ |
  | C | GioiTinh | Text | Nam / Nữ |
  | D | NgaySinh | Date (YYYY-MM-DD) | Ngày tháng năm sinh |
  | E | NoiSinh | Text | Nơi sinh (Tỉnh/Thành phố) |
  | F | QueQuan | Text | Quê quán |
  | G | DanToc | Text | Dân tộc (VD: Kinh) |
  | H | ChucVu | Text | Chức vụ hiện tại |
  | I | DonVi | Text | Đơn vị công tác |
  | J | DiaChi | Text | Chỗ ở riêng / Địa chỉ liên lạc |
  | K | DienThoaiCQ | Text | Điện thoại cơ quan |
  | L | DienThoaiNR | Text | Điện thoại nhà riêng |
  | M | DiDong | Text (10 số) | Điện thoại di động (bắt đầu bằng 0) |
  | N | SoCCCD | Text (12 số) | Số thẻ Căn cước công dân |
  | O | NgayCapCCCD | Date (YYYY-MM-DD) | Ngày cấp CCCD |
  | P | NoiCapCCCD | Text | Cơ quan cấp CCCD |

---

### 1.2 Sheet `ThongTinBoSung` (Bảng Nguyện vọng, Môn giảng dạy & Hướng NC)
- **Khóa tổng hợp (Composite Key):** `Email` + `PhanLoai`.
- **Cấu trúc cột (6 cột - A đến F):**
  | Cột | Tên trường | Kiểu dữ liệu | Mô tả |
  |---|---|---|---|
  | A | Email | Text | Email tài khoản |
  | B | PhanLoai | Text | `NV_ThinhGiang`, `NV_NghienCuu`, `NV_HoiDong`, `NV_HuongDan`, `NV_DoanhNghiep`, `MonHoc`, `HuongNC` |
  | C | GiaTri_Nganh | Text | Trạng thái (Có/Không) hoặc Tên Ngành/Chuyên ngành |
  | D | TenMon_TenHuong | Text | Tên môn học hoặc Tên hướng nghiên cứu |
  | E | MoTaChiTiet | Text | Mô tả đề cương môn học / Hướng chuyên sâu |
  | F | GhiChu | Text | Ghi chú bổ sung |

---

### 1.3 Sheet `QuaTrinhDaoTao` (Bảng Học vị, Bậc học, Ngoại ngữ)
- **Khóa tổng hợp:** `Email` + `PhanLoai`.
- **Cấu trúc cột (10 cột - A đến J):**
  | Cột | Tên trường | Kiểu dữ liệu | Mô tả |
  |---|---|---|---|
  | A | Email | Text | Email tài khoản |
  | B | PhanLoai | Text | `HocVi`, `NgoaiNgu`, `ChungChi` |
  | C | BacHoc_NgoaiNgu | Text | Cử nhân / Kỹ sư / Thạc sĩ / Tiến sĩ hoặc Tên ngoại ngữ |
  | D | TenChucDanh | Text | Bậc học vị chi tiết |
  | E | Nganh_ChuyenNganh | Text | Ngành hoặc Chuyên ngành đào tạo |
  | F | NoiDaoTao_MucDo | Text | Tên trường/viện đào tạo hoặc Mức độ ngoại ngữ |
  | G | NuocDaoTao | Text | Nước nhận bằng (Việt Nam, Nhật, Mỹ...) |
  | H | Nam | Number (YYYY) | Năm tốt nghiệp / cấp bằng |
  | I | ChiTiet_ChungChi | Text | Tên đồ án tốt nghiệp / Luận văn ThS / Luận án TS |
  | J | HeDaoTao | Text | Hệ đào tạo: Chính quy, Từ xa, Vừa làm vừa học, Văn bằng 2... |

---

### 1.4 Sheet `QuaTrinhCongTac` (Bảng Lịch sử công tác)
- **Cấu trúc cột (7 cột - A đến G):**
  | Cột | Tên trường | Kiểu dữ liệu | Mô tả |
  |---|---|---|---|
  | A | Email | Text | Email tài khoản |
  | B | TuNam | Number/Text | Năm bắt đầu (VD: 2002) |
  | C | DenNam | Number/Text | Năm kết thúc hoặc 'Hiện tại' |
  | D | DonViCongTac | Text | Tên đơn vị / Trường / Viện |
  | E | ChucVu | Text | Chức vụ đảm nhiệm |
  | F | MoTaCongViec | Text | Nội dung công việc chính |
  | G | GhiChu | Text | Ghi chú |

---

### 1.5 Sheet `DeTaiThamGia` (Bảng Đề tài nghiên cứu khoa học các cấp)
- **Cấu trúc cột (10 cột - A đến J):**
  | Cột | Tên trường | Kiểu dữ liệu | Mô tả |
  |---|---|---|---|
  | A | Email | Text | Email tài khoản |
  | B | TenDeTai | Text | Tên đề tài NCKH |
  | C | CapDeTai | Text | Cấp Nhà nước, Cấp Bộ, Cấp Tỉnh/TP, Cấp Cơ sở |
  | D | ThoiGianBatDau | Date/Text | Tháng/Năm bắt đầu (MM/YYYY) |
  | E | ThoiGianHoanTat | Date/Text | Tháng/Năm hoàn thành (để trống nếu Không đạt) |
  | F | ChucVu | Text | Chủ nhiệm, Thư ký, Thành viên chính |
  | G | XepHang | Text | Xuất sắc, Tốt, Đạt, Không đạt |
  | H | KinhPhi | Number | Kinh phí đề tài |
  | I | DonViTienTe | Text | triệu VNĐ / USD |
  | J | GhiChu | Text | Ghi chú |

---

### 1.6 Sheet `CongBoKhoaHoc` (Bảng Bài báo khoa học & Sách giáo trình)
- **Cấu trúc cột (10 cột - A đến J):**
  | Cột | Tên trường | Kiểu dữ liệu | Mô tả |
  |---|---|---|---|
  | A | Email | Text | Email tài khoản |
  | B | PhanLoai | Text | `BaiBao` hoặc `Sach` |
  | C | TenCongTrinh | Text | Tên bài báo hoặc Tên sách giáo trình |
  | D | TacGia_VaiTro | Text | Danh sách tác giả hoặc Vai trò (Chủ biên/Tham gia) |
  | E | TenTapChi_NXB | Text | Tên tạp chí khoa học hoặc Nhà xuất bản |
  | F | NamCongBo | Number (YYYY) | Năm xuất bản |
  | G | ChiSo_Diem | Text | Chỉ số ISI/Scopus (Q1, IF), Điểm HĐGSNN |
  | H | URL | Text | Liên kết bài viết (DOI / Link truy cập) |
  | I | FilePDF_Id | Text | ID file minh chứng trên Google Drive (tối đa 20MB) |
  | J | GhiChu | Text | Ghi chú |

---

### 1.7 Sheet `GiaiThuong` (Bảng Giải thưởng, Bằng sáng chế, Khen thưởng)
- **Cấu trúc cột (6 cột - A đến F):**
  | Cột | Tên trường | Kiểu dữ liệu | Mô tả |
  |---|---|---|---|
  | A | Email | Text | Email tài khoản |
  | B | TenGiaiThuong | Text | Tên giải thưởng hoặc Bằng độc quyền sáng chế |
  | C | Nam | Number (YYYY) | Năm trao tặng |
  | D | CoQuanTrao | Text | Cơ quan cấp / Cơ quan tiếp nhận chuyển giao |
  | E | HinhThuc | Text | Giải Nhất, Nhì, Ba, Bằng khen, Bằng sáng chế |
  | F | GhiChu | Text | Ghi chú |

---

### 1.8 Sheet `Admins` (Danh bạ phân quyền Quản trị viên)
- **Cấu trúc cột (3 cột - A đến C):**
  | Cột | Tên trường | Kiểu dữ liệu | Mô tả |
  |---|---|---|---|
  | A | Email | Text (Unique) | Email quản trị viên được cấp quyền |
  | B | Ten | Text | Tên cán bộ quản trị |
  | C | NgayCap | Date | Ngày phân quyền |

---

## 2. Quy tắc Nghiệp vụ Dữ liệu (Integrity & Upsert Rules)

1. **Nguyên tắc Ghi đè (Upsert Rule):**
   - Đối với sheet **KHÔNG có cột Phân loại** (`ThongTinCoBan`): Kiểm tra theo `Email`. Nếu đã có dòng chứa Email này, ghi đè toàn bộ dữ liệu lên dòng đó. Chỉ thêm dòng mới khi Email chưa từng tồn tại.
   - Đối với sheet **CÓ cột Phân loại** (`ThongTinBoSung`, `QuaTrinhDaoTao`, `CongBoKhoaHoc`): Kiểm tra cặp `Email` + `PhanLoai`. Nếu trùng cả Email lẫn Phân loại thì xóa/ghi đè dòng tương ứng; cho phép cùng 1 email xuất hiện nhiều lần nếu khác Phân loại.
2. **Nguyên tắc Chuẩn hóa Dữ liệu (Data Sanitization):**
   - Email luôn được chuyển thành chữ thường (`toLowerCase().trim()`).
   - Số điện thoại luôn có 10 chữ số và bắt đầu bằng số 0 (`enforcePhone10Digits`).
   - Số CCCD luôn có đúng 12 chữ số (`enforceCccd12Digits`).
   - Năm cấp bằng luôn lưu ở cột H (`Nam`) có định dạng 4 chữ số (YYYY).
   - Hệ đào tạo (`HeDaoTao`) lưu riêng biệt ở cột J trên sheet `QuaTrinhDaoTao`, không gộp chung với tên đồ án tốt nghiệp (`ChiTiet_ChungChi`).
