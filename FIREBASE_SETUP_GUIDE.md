# คู่มือการติดตั้ง Firebase Realtime Database และการ Deploy ระบบประเมินผลการอบรม

คู่มือนี้จะอธิบายขั้นตอนการตั้งค่า **Firebase Realtime Database (Free Spark Plan ฟรีตลอดชีพ)** และวิธีนำไฟล์ `survey.html` (หน้าตอบ) กับ `dashboard.html` (หน้าจอแสดงผล) ไปใช้งานจริง

---

## 📌 สรุปโครงสร้างระบบ
- **`survey.html`**: หน้าแบบประเมินสำหรับผู้เข้าอบรม (Mobile-first, ปุ่มใหญ่ สเกล 1-5, ไม่ต้องล็อกอิน, ป้องกันการส่งซ้ำ)
- **`dashboard.html`**: หน้าแสดงผลแบบ Real-time บนจอโปรเจกเตอร์ (กราฟแท่ง, คะแนนเฉลี่ย 5 ระดับ, ข้อเสนอแนะสด, QR Code, ดาวน์โหลด CSV)
- **Firebase Realtime Database**: ฐานข้อมูลคลาวด์ฟรีของ Google ทำหน้าที่ซิงค์ข้อมูลระหว่างผู้ตอบกับจอโปรเจกเตอร์ทันทีในเสี้ยววินาที

---

## 🚀 ขั้นตอนที่ 1: สร้าง Firebase Project (ฟรี 100%)

1. ไปที่เว็บไซต์ **[Firebase Console](https://console.firebase.google.com/)** แล้วเข้าสู่ระบบด้วยบัญชี Google
2. คลิกปุ่ม **"Create a project"** (หรือ "Add project")
3. ตั้งชื่อโปรเจกต์ เช่น `training-survey-2025` แล้วกด **Continue**
4. หน้า Google Analytics จะเปิดหรือไม่เปิดก็ได้ (แนะนำให้ปิดเพื่อความสะดวกรวดเร็ว) แล้วกด **Create Project**
5. รอระบบสร้างโปรเจกต์ประมาณ 15 วินาที แล้วคลิก **Continue** เพื่อเข้าสู่ Dashboard

---

## 🗄️ ขั้นตอนที่ 2: เปิดใช้งาน Realtime Database & ตั้งค่า Security Rules

1. ที่เมนูด้านซ้าย เลือก **Build** > **Realtime Database**
2. คลิกปุ่ม **"Create Database"**
3. เลือกตำแหน่งเซิร์ฟเวอร์ (Realtime Database Location):
   - แนะนำเลือก **Singapore (`asia-southeast1`)** หรือใกล้เคียง เพื่อความเร็วสูงสุดในไทย
4. ในส่วน Security Rules ให้เลือก **"Start in test mode"** แล้วกด **Enable**
5. ไปที่แท็บ **"Rules"** ด้านบน แล้วแก้ไขกฎความปลอดภัยให้อ่านและเขียนได้โดยไม่ต้องล็อกอิน (Public Survey):

```json
{
  "rules": {
    "surveys": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp"]
    }
  }
}
```

6. คลิกปุ่ม **"Publish"** เพื่อบันทึกกฎ

---

## 🔑 ขั้นตอนที่ 3: คัดลอก Firebase Config มาใส่ในโค้ด

1. ที่เมนูด้านซ้าย คลิกไอคอน **ฟันเฟือง ⚙️ (Project settings)**
2. เลื่อนลงมาที่หัวข้อ **"Your apps"** แล้วคลิกไอคอนเว็บ **`</>` (Web)**
3. ตั้งชื่อ App เช่น `training-web` แล้วกด **Register app** (ไม่ต้องติ๊ก Firebase Hosting ตอนนี้)
4. คุณจะเห็นบล็อกโค้ด `firebaseConfig` ให้คัดลอกข้อมูลเฉพาะส่วนที่เป็น Object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "training-survey-xxxx.firebaseapp.com",
  databaseURL: "https://training-survey-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "training-survey-xxxx",
  storageBucket: "training-survey-xxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxxxxxxxxx"
};
```

5. เปิดไฟล์ **`public/survey.html`** และ **`public/dashboard.html`**
6. นำค่า Config ของคุณไปวางแทนที่บล็อก `const firebaseConfig = { ... }` ภายในแท็ก `<script>` ของทั้งสองไฟล์ แล้วบันทึกไฟล์

---

## 🌐 ขั้นตอนที่ 4: การนำขึ้นเว็บ (Deploy) ฟรี 100%

มีให้เลือก 3 ช่องทางที่ง่ายและฟรีทั้งหมด:

### ทางเลือก A: Deploy ด้วย GitHub Pages (ง่ายที่สุด ไม่ต้องลงโปรแกรม)
1. สร้าง New Repository บน **[GitHub](https://github.com/)** (เช่น `training-survey`)
2. อัปโหลดไฟล์ `survey.html` และ `dashboard.html` ขึ้นไป
3. ไปที่แท็บ **Settings** > **Pages**
4. ในช่อง Branch เลือก `main` และโฟลเดอร์ `/ (root)` แล้วกด **Save**
5. รอ 1 นาที จะได้ลิงก์ เช่น:
   - หน้าตอบ: `https://your-username.github.io/training-survey/survey.html`
   - หน้าจอ: `https://your-username.github.io/training-survey/dashboard.html`

### ทางเลือก B: ลากวางบน Netlify หรือ Vercel (เสร็จใน 10 วินาที)
1. ไปที่ **[Netlify Drop](https://app.netlify.com/drop)**
2. ลากโฟลเดอร์ที่มีไฟล์ `survey.html` และ `dashboard.html` ไปวางในหน้าเว็บ
3. จะได้ URL ใช้งานจริงทันที

### ทางเลือก C: ใช้ Firebase Hosting
1. เปิด Terminal ในโฟลเดอร์โปรเจกต์
2. รันคำสั่ง:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

---

## 📊 เกณฑ์การแปลผลคะแนนเฉลี่ย 5 ระดับ (Likert Scale)
ระบบคำนวณและแปลผลอัตโนมัติตามเกณฑ์ทางสถิติมาตรฐาน:

| ช่วงคะแนนเฉลี่ย | ระดับความพึงพอใจ | การแปลความหมาย | สีแสดงผล |
| :--- | :--- | :--- | :--- |
| **4.51 - 5.00** | **มากที่สุด** | ดีเยี่ยม เป็นแบบอย่างได้ | เขียวมรกต (Emerald) |
| **3.51 - 4.50** | **มาก** | ดี บรรลุเป้าหมาย | ฟ้าคราม (Sky) |
| **2.51 - 3.50** | **ปานกลาง** | พอใช้ ควรพัฒนาเพิ่มเติม | ส้มเหลือง (Amber) |
| **1.51 - 2.50** | **น้อย** | ต่ำกว่าเกณฑ์ ต้องปรับปรุง | ส้ม (Orange) |
| **1.00 - 1.50** | **น้อยที่สุด** | เร่งด่วน ต้องแก้ไขทันที | แดง (Rose) |

---

## 💡 ทริคสำหรับการจัดงานจริง
1. **การฉายจอโปรเจกเตอร์**: เปิด `dashboard.html` บนแล็ปท็อปที่ต่อจอโปรเจกเตอร์ แล้วกดปุ่ม **"⛶ เต็มจอ"**
2. **ก่อนเริ่มงาน**: คลิกปุ่ม **"ล้างข้อมูล"** เพื่อรีเซ็ตผลการประเมินให้เป็น 0
3. **เมื่อถึงช่วงประเมิน**: กดปุ่ม **"📲 สแกนตอบ (QR Code)"** เพื่อฉาย QR Code ขนาดใหญ่ให้ผู้เข้าอบรมสแกน
4. **หลังเสร็จงาน**: กดปุ่ม **"📥 ดาวน์โหลด CSV"** เพื่อนำผลคะแนนและข้อเสนอแนะไปเปิดใน Excel หรือทำรายงานสรุปต่อได้ทันที
