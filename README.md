# MyCalculator-Pro

Aplikasi kalkulator dengan fitur chat tersembunyi (stealth chat) berbasis React Native + Firebase.

## Stack

- React Native 0.73 + Expo SDK 50
- React Native Firebase (native SDK)
- Firestore (realtime chat)
- Firebase Auth (anonymous login via stealth code)
- React Navigation (native stack)
- EAS Build (untuk generate APK/AAB)

## Struktur Proyek

```
MyCalculator/
├── index.js                 Entry point (registerRootComponent)
├── App.js                   Root: AuthProvider + NavigationContainer
├── app.json                 Konfigurasi Expo + EAS
├── eas.json                 Profil EAS Build
├── babel.config.js          Konfigurasi Babel
├── google-services.json     Kunci Firebase Android
├── firestore.rules          Aturan keamanan Firestore
└── src/
    ├── config/firebase.js   Inisialisasi native Firebase
    ├── navigation/          AppNavigator (kondisional stealth)
    ├── contexts/            AuthContext (state login + alias)
    ├── hooks/               useCalculator, useFirestore
    ├── utils/               mathEvaluator, timeFormatter
    ├── components/
    │   ├── calculator/      Display, Keypad
    │   ├── chat/            ChatBubble, ChatInput, TopBar
    │   └── common/          Avatar
    └── screens/             CalculatorScreen, ChatRoomScreen
```

## Kode Stealth (Rahasia)

| Kode | Alias |
|------|-------|
| `28+=` | SanQua |
| `48+=` | Hass |
| `15+=` | Vit |
| `55+=` | Cleo |
| `88+=` | LeMinerale |

## Cara Build APK

### Prasyarat
- Node.js >= 18
- EAS CLI: `npm install -g eas-cli`
- Akun Expo (expo.dev)

### Langkah

```bash
# 1. Clone dan install dependencies
git clone https://github.com/dalangatoq-go/MyCalculator
cd MyCalculator
npm install

# 2. Login ke Expo
eas login

# 3. Inisialisasi project (isi projectId di app.json otomatis)
eas init

# 4. Build APK (internal testing)
eas build --platform android --profile preview

# 5. Build AAB (Google Play Store)
eas build --platform android --profile production
```

## Firebase Setup

Pastikan di Firebase Console:
1. **Authentication** → aktifkan metode **Anonymous**
2. **Firestore** → deploy `firestore.rules` dari file di repo ini
3. `google-services.json` sudah sesuai dengan package `com.stealth.mycalculatorpro`
