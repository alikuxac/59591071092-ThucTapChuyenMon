# THỰC TẬP CHUYÊN MÔN NĂM HỌC 2020-2021
Họ và tên: Lê Trần Xuân Sơn
     
* Lớp: Công nghệ thông tin-K59

## Đề tài: Xây dựng bot cho máy chủ Discord và Dashboard
Giảng viên: Thầy Nguyễn Lê Minh. 

## Phần 1: Công nghệ sử dụng:
- Nodejs
- MongoDB
- ExpressJS + Ejs
- HTML + Javascript + CSS

## Phần 2: Các chức năng đã hoàn thành:
1. User
- Quản lý các cài đặt tại máy chủ
	+ Thêm/Xóa/Sửa các cài đặt
	+ Xem lại các cài đặt của bot tại máy chủ
- Quản lý trình phát nhạc
	+ Tạo/Xóa/Sửa trình phát nhạc
	+ Xem các cài đặt của trình phát nhạc
- Quản lý hệ thống cấp bậc (leveling system)
	+ Làm mới cấp bậc
	+ Thêm/Xoá/Sửa/Xem cấp thưởng
	+ Thêm/Trừ điểm tích luỹ 
- Quản lý danh sách từ ngữ không phù hợp (anti badword)
	+ Thêm/Xóa/Sửa từ ngữ không phù hợp trong danh sách
	+ Xem lại danh sách từ ngữ không phù hợp
- Quản lý kênh đàm thoại tuỳ chỉnh
	+ Tạo/Xóa/Cập nhật kênh đàm thoại
	+ Xem các thông tin của kênh đàm thoại
- Liên hệ: tại máy chủ hỗ trợ
- Thực thi các lệnh bot có nếu đủ quyền thực thi
- Đăng nhâp: Người dùng muốn vảo hệ thống phải tiến hành đăng nhâp, nếu không có tài khoản thì tiến hành đăng kí tài khoản discord
2. Chủ sở hữu con bot
- Quản lý các cài đặt của user và tất cả máy chủ 
- Quản lý thông tin user 
3. Bot
- Chống user nhắn tin những từ ngữ không phù hợp
- Phát nhạc từ Youtube, SoundCloud, … (thông qua thư viện)
- Bảo mật, kiểm tra token/login

## Phần 3: Các chức năng chưa hoàn thành:
1. User
- Quản lý chống spam tin nhắn (anti spam)
2. Chủ sở hữu con bot
- Quản lý log
3. Bot
- Lưu từng tin nhắn vào cơ sở dữ liệu PostgreSQL (hoặc MySQL)
- Chống spam

## Hướng dẫn sử dụng:
1.	Đối với Bot: 
	1.	Tạo tài khoản Discord và máy chủ nếu chưa có
	2.	Tạo bot: làm theo hướng dẫn https://discordjs.guide/preparations/setting-up-a-bot-application.html
	3.	Sau khi tạo thành công, ấn vào tab Bot, bật PRESENCE INTENT và SERVER MEMBERS INTENT
	4.	Thêm bot vào máy chủ: làm theo hướng dẫn https://discordjs.guide/preparations/adding-your-bot-to-servers.html
2.	Đối với mã nguồn
	1.	Copy và đổi tên file .env.example thành .env và làm theo hướng dẫn
	2.	Mở Command Prompt hoặc terminal trong thư mục đó và nhập lệnh: node .


Xin cám ơn!