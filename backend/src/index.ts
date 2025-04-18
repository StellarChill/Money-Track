import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes';  // นำเข้า routes สำหรับ transactions

const app = express();

// ใช้ CORS เพื่ออนุญาตให้มีการเข้าถึงจากที่อื่น
app.use(cors());

// ใช้ express.json() เพื่อให้รองรับการส่งข้อมูลแบบ JSON
app.use(express.json());

// เส้นทางสำหรับธุรกรรมทั้งหมด (เพิ่ม ลบ แสดงยอด)
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;  // ใช้พอร์ตที่กำหนดใน environment หรือ 3000 ถ้าไม่มีการกำหนด
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // เริ่มเซิร์ฟเวอร์
