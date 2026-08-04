<div align="center">

<img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/Three.js-0.185-black?style=for-the-badge&logo=threedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Chart.js-4.x-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white"/>

<br/><br/>

```
██████╗  ██████╗ ██████╗  ██████╗      █████╗ ██████╗ ███╗   ███╗
██╔══██╗██╔═══██╗██╔══██╗██╔═══██╗    ██╔══██╗██╔══██╗████╗ ████║
██████╔╝██║   ██║██████╔╝██║   ██║    ███████║██████╔╝██╔████╔██║
██╔══██╗██║   ██║██╔══██╗██║   ██║    ██╔══██║██╔══██╗██║╚██╔╝██║
██║  ██║╚██████╔╝██████╔╝╚██████╔╝    ██║  ██║██║  ██║██║ ╚═╝ ██║
╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
```

### 🤖 Endüstriyel Robot Kolu Kontrol Paneli
**Robot UR-10e #003 · v4.2.1 · Real-Time Dashboard**

</div>

---

## 🇹🇷 Türkçe

### 📌 Proje Hakkında

**RoboArm**, endüstriyel robot kollarını gerçek zamanlı olarak izlemek ve kontrol etmek için geliştirilmiş modern bir web panelidir. **Vue 3** ve **Three.js** tabanlı bu uygulama; 3D robot modeli görüntüleme, eksen kontrolü, hız/tork grafikleri ve alarm yönetimi gibi kritik özellikleri tek bir arayüzde sunar.

> **Robot Modeli:** Universal Robots UR-10e #003

---

### ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 🧊 **3D Robot Görüntüleyici** | Three.js ile GLTF formatında gerçek zamanlı 3D robot modeli |
| 🎛️ **Eksen Kontrol Kartları** | Her eksen için açı, hız ve tork izleme |
| 📈 **Hız Grafiği** | Chart.js ile canlı hız verisi gösterimi |
| 📉 **Tork Grafiği** | Gerçek zamanlı tork analizi |
| 📷 **Kamera Kartı** | Robot kamerası görüntü paneli |
| 🚨 **Alarm Logu** | Sistem alarm ve uyarı geçmişi |
| ⏱️ **Canlı Saat** | Gerçek sistem saati (tr-TR formatı) |
| 🟢 **Online Durum Göstergesi** | Animasyonlu bağlantı durumu |

---

### 🗂️ Proje Yapısı

```
RoboArm/
├── 📁 robot-dashboard/          # Ana kontrol paneli uygulaması
│   ├── public/
│   │   ├── scene.gltf           # 3D robot modeli
│   │   ├── scene.bin            # Model verileri
│   │   └── textures/            # Model doku dosyaları
│   └── src/
│       ├── components/
│       │   ├── LeftPanel.vue    # Sol panel (Eksen kartları)
│       │   ├── CenterPanel.vue  # Orta panel (3D Viewer)
│       │   ├── RightPanel.vue   # Sağ panel (Grafikler)
│       │   ├── AxisCard.vue     # Eksen kontrol kartı
│       │   ├── RobotViewer.vue  # Three.js 3D görüntüleyici
│       │   ├── SpeedChart.vue   # Hız grafiği
│       │   ├── TorqueChart.vue  # Tork grafiği
│       │   ├── CameraCard.vue   # Kamera görüntü kartı
│       │   ├── AlarmLog.vue     # Alarm kayıt paneli
│       │   └── ControlPanel.vue # Kontrol butonları
│       ├── composables/
│       │   └── useRobot.js      # Robot durum yönetimi
│       ├── App.vue              # Ana uygulama
│       └── style.css            # Global stiller
│
└── 📁 robot-vue/                # Temel Vue iskelet projesi
```

---

### 🚀 Kurulum & Çalıştırma

#### Gereksinimler
- Node.js `>=18.x`
- npm `>=9.x`

#### Ana Dashboard
```bash
# Repoyu klonla
git clone https://github.com/MehmetDr/RoboArm.git
cd RoboArm/robot-dashboard

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

#### Derleme (Production)
```bash
npm run build
npm run preview
```

Uygulama varsayılan olarak **`http://localhost:5173`** adresinde çalışır.

---

### 🛠️ Kullanılan Teknolojiler

| Teknoloji | Sürüm | Kullanım Amacı |
|---|---|---|
| **Vue 3** | `^3.5.39` | Reaktif UI framework |
| **Vite** | `^8.1.1` | Geliştirme sunucusu & bundler |
| **Three.js** | `^0.185.1` | 3D robot modeli render |
| **Chart.js** | `^4.5.1` | Hız ve tork grafikleri |
| **vue-chartjs** | `^5.3.4` | Chart.js Vue entegrasyonu |
| **Tailwind CSS** | `^4.3.3` | Yardımcı CSS sınıfları |

---

### 🎨 Arayüz Mimarisi

```
┌────────────────────────────────────────────────────────────┐
│                    HEADER BAR (52px)                        │
│  [Logo] ROBOARM Control System v4.2.1  [●ONLINE] [Saat]   │
├──────────────┬─────────────────────┬───────────────────────┤
│  SOL PANEL   │    ORTA PANEL       │    SAĞ PANEL          │
│  (290px)     │    (flex: 1)        │    (330px)            │
│              │                     │                        │
│  AxisCard J1 │   RobotViewer       │   SpeedChart          │
│  AxisCard J2 │   (3D GLTF)         │   TorqueChart         │
│  AxisCard J3 │                     │   CameraCard          │
│  AxisCard J4 │   ControlPanel      │   AlarmLog            │
│  AxisCard J5 │                     │                        │
│  AxisCard J6 │                     │                        │
└──────────────┴─────────────────────┴───────────────────────┘
```

---

### 📄 Lisans

Bu proje **MIT Lisansı** kapsamında lisanslanmıştır.

---
---

## 🇬🇧 English

### 📌 About The Project

**RoboArm** is a modern web dashboard built for real-time monitoring and control of industrial robotic arms. Powered by **Vue 3** and **Three.js**, the application provides critical features including a live 3D robot model viewer, joint control, speed/torque charts, and alarm management — all in a single unified interface.

> **Robot Model:** Universal Robots UR-10e #003

---

### ✨ Features

| Feature | Description |
|---|---|
| 🧊 **3D Robot Viewer** | Real-time GLTF 3D robot model rendered via Three.js |
| 🎛️ **Axis Control Cards** | Per-joint angle, speed, and torque monitoring |
| 📈 **Speed Chart** | Live speed data visualization with Chart.js |
| 📉 **Torque Chart** | Real-time torque analysis |
| 📷 **Camera Card** | Robot camera feed panel |
| 🚨 **Alarm Log** | System alarm and warning history |
| ⏱️ **Live Clock** | Real system time display (tr-TR locale) |
| 🟢 **Online Status Indicator** | Animated connection status |

---

### 🗂️ Project Structure

```
RoboArm/
├── 📁 robot-dashboard/          # Main control panel application
│   ├── public/
│   │   ├── scene.gltf           # 3D robot model
│   │   ├── scene.bin            # Binary model data
│   │   └── textures/            # Model texture files
│   └── src/
│       ├── components/
│       │   ├── LeftPanel.vue    # Left panel (Axis cards)
│       │   ├── CenterPanel.vue  # Center panel (3D Viewer)
│       │   ├── RightPanel.vue   # Right panel (Charts)
│       │   ├── AxisCard.vue     # Joint control card
│       │   ├── RobotViewer.vue  # Three.js 3D viewer
│       │   ├── SpeedChart.vue   # Speed chart
│       │   ├── TorqueChart.vue  # Torque chart
│       │   ├── CameraCard.vue   # Camera feed card
│       │   ├── AlarmLog.vue     # Alarm log panel
│       │   └── ControlPanel.vue # Control buttons
│       ├── composables/
│       │   └── useRobot.js      # Robot state management
│       ├── App.vue              # Root application
│       └── style.css            # Global styles
│
└── 📁 robot-vue/                # Base Vue skeleton project
```

---

### 🚀 Installation & Running

#### Prerequisites
- Node.js `>=18.x`
- npm `>=9.x`

#### Main Dashboard
```bash
# Clone the repository
git clone https://github.com/MehmetDr/RoboArm.git
cd RoboArm/robot-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Build (Production)
```bash
npm run build
npm run preview
```

The application runs at **`http://localhost:5173`** by default.

---

### 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Vue 3** | `^3.5.39` | Reactive UI framework |
| **Vite** | `^8.1.1` | Dev server & bundler |
| **Three.js** | `^0.185.1` | 3D robot model rendering |
| **Chart.js** | `^4.5.1` | Speed and torque charts |
| **vue-chartjs** | `^5.3.4` | Vue wrapper for Chart.js |
| **Tailwind CSS** | `^4.3.3` | Utility CSS classes |

---

### 🎨 UI Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    HEADER BAR (52px)                        │
│  [Logo] ROBOARM Control System v4.2.1  [●ONLINE] [Clock]  │
├──────────────┬─────────────────────┬───────────────────────┤
│  LEFT PANEL  │    CENTER PANEL     │    RIGHT PANEL        │
│  (290px)     │    (flex: 1)        │    (330px)            │
│              │                     │                        │
│  AxisCard J1 │   RobotViewer       │   SpeedChart          │
│  AxisCard J2 │   (3D GLTF)         │   TorqueChart         │
│  AxisCard J3 │                     │   CameraCard          │
│  AxisCard J4 │   ControlPanel      │   AlarmLog            │
│  AxisCard J5 │                     │                        │
│  AxisCard J6 │                     │                        │
└──────────────┴─────────────────────┴───────────────────────┘
```

---

### 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ by <a href="https://github.com/MehmetDr">MehmetDr</a>

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! / If you like this project, don't forget to star it!

</div>
