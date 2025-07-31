const express = require("express"); //freamwork giúp tạo server
const fs = require("fs"); // fs = file system đọc và ghi dữ liệu
const path = require("path"); //

const app = express();
const PORT = 3000; //khởi tạo cổng (đang chạy tại localhost: 3000)

// Middleware để xử lý JSON và form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh (HTML, CSS, ảnh...)
app.use(express.static("html"));
app.use("/css", express.static("css"));
app.use("/anh", express.static("anh"));

// API để nhận dữ liệu từ form và ghi vào data.json
app.post("/save", (req, res) => {
  const newData = req.body;

  const dataPath = path.join(__dirname, "data.json");

  // Đọc dữ liệu cũ
  fs.readFile(dataPath, "utf8", (err, data) => {
    let dataArray = [];

    if (!err && data) {
      try {
        dataArray = JSON.parse(data);
      } catch (e) {
        return res.status(500).json({ message: "Lỗi định dạng JSON." });
      }
    }

    // Thêm dữ liệu mới
    dataArray.push(newData);

    // Ghi lại
    fs.writeFile(dataPath, JSON.stringify(dataArray, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Không thể ghi dữ liệu." });
      }
      res.json({ message: "Dữ liệu đã được lưu!" });
    });
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
