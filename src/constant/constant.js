const ROLE_SYSTEM = {
    ADMIN: "admin",
    TEACHER: "teacher",
    USER: "user",
};
const WRONG_PASSWORD = {
    success: false,
    message: "Tên đăng nhập hoặc mật khẩu không chính xác",
};
const URL_BASE = {
    DIRECTORY_IMAGE: "uploads/",
};
const recordNewUpdate = { new: true }; // Trả về tài liệu mới sau khi cập nhật

const sort_time = { createdAt: -1 };
const STATUS_TD = {
    reject: "reject",
    accepted: "accepted",
    pending: "pending",
    sending: "sending",
};
const CHUA_DU_THONG_TIN = {
    success: false,
    message: "Chưa nhập đủ thông tin"
}

module.exports = {
    ROLE_SYSTEM,
    WRONG_PASSWORD,
    URL_BASE,
    recordNewUpdate,
    sort_time,
    STATUS_TD,
    CHUA_DU_THONG_TIN

};