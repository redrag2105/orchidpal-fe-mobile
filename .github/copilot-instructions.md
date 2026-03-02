# OrchidPal Mobile – AI Coding Guide

## 1. Project Overview

### Domain & Philosophy

OrchidPal is an **Agritech Expert System** for scientific plant care, combining IoT sensors, AI analysis, and human expert consultations.

**Philosophy**: "Calm Agritech" — Clean, data-driven interfaces emphasizing clarity (Happy/Critical status) over visual clutter.

**Triết lý**: Hỗ trợ người dùng chăm sóc cây khoa học thông qua dữ liệu cảm biến chính xác và kiến thức từ chuyên gia.

### System Actors

| Actor               | Role                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **Guest**           | Browse store products, purchase IoT kits                                                      |
| **User**            | Manage gardens, view sensor data, use Expert Templates or manual rules                        |
| **Premium User**    | AI Prediction, Seasonal Mode, Expert Booking, AI Vision (future)                              |
| **Expert**          | Maintain Knowledge Base (plant species, disease signs, care templates), consult Premium Users |
| **Manager/Admin**   | Manage device inventory, orders, users                                                        |
| **System (IoT/AI)** | Collect data, execute commands, generate AI suggestions                                       |

---

## 2. Tech Stack

### Mobile (This Repo)

| Category               | Technology                                                |
| ---------------------- | --------------------------------------------------------- |
| **Framework**          | Expo SDK 54, Expo Router 6 (file-based routing)           |
| **Language**           | TypeScript 5.9, React 19                                  |
| **UI Library**         | Gluestack UI 3 + NativeWind 4 (Tailwind-like styling)     |
| **3D Graphics**        | React Three Fiber (R3F) + Drei + Three.js + Expo GL       |
| **State Management**   | Zustand 5 (global state), TanStack Query 5 (server state) |
| **Forms & Validation** | React Hook Form 7 + Zod 4                                 |
| **Networking**         | Axios 1.x                                                 |
| **Animations**         | React Native Reanimated 4, Legend Motion                  |
| **Icons**              | Lucide React Native                                       |
| **Bottom Sheet**       | @gorhom/bottom-sheet                                      |

### Backend (orchid-pal-be)

- **Framework**: NestJS Microservices
- **Communication**: RabbitMQ (inter-service), MQTT (IoT devices)
- **Database**: PostgreSQL + Prisma ORM
- **Caching**: Redis
- **API**: REST via API Gateway (`EXPO_PUBLIC_API_URL`)

---

## 3. Architecture & Navigation

### Project Structure

```
plantpal-mobile/
├─ app/                      # 🌍 ROUTING LAYER (Expo Router)
│  ├─ (auth)/                # 🔐 Public auth (Login, Register) - no tabs
│  │  ├─ _layout.tsx
│  │  └─ login.tsx
│  ├─ (dashboard)/           # 🛡️ Protected area with Bottom Tabs
│  │  ├─ _layout.tsx         # TabBar + AuthGuard
│  │  ├─ index.tsx           # Main Dashboard
│  │  ├─ garden/             # Garden management
│  │  ├─ expert/             # Expert Hub
│  │  └─ store/              # In-app store
│  ├─ (modals)/              # 📱 Full-screen modal flows
│  │  ├─ _layout.tsx
│  │  └─ device-setup.tsx    # IoT Provisioning flow
│  ├─ _layout.tsx            # Root: Providers, Fonts, Gesture Handler
│  └─ index.tsx              # Entry redirect
│
├─ components/
│  ├─ ui/                    # Gluestack primitives (Button, Card, Input...)
│  ├─ dashboard/             # Dashboard widgets (EnvironmentCard, etc.)
│  ├─ 3d/                    # R3F/Three.js components
│  └─ iot/                   # IoT-specific components
│
├─ core/
│  └─ api/                   # Axios client with auth interceptors
│
├─ services/                 # API service functions (queries)
├─ store/                    # Zustand stores (auth, device state)
├─ types/                    # TypeScript interfaces & DTOs
├─ constants/                # Static config, theme colors
└─ assets/                   # Fonts, icons, images, 3D models
```

### Navigation Rules

- **Entry Point**: `app/_layout.tsx` — wraps providers (`GluestackUIProvider`, `GestureHandlerRootView`, `QueryClientProvider`)
- **Path Aliases**: Use `@/` for imports (e.g., `import { apiClient } from "@/core/api/axios"`)
- **Navigation**: Use `router.push()` / `router.replace()` from `expo-router`. Avoid React Navigation prop drilling.

```typescript
// ✅ Do this
import { router } from 'expo-router'
router.push('/(dashboard)/garden')

// ❌ Don't do this
navigation.navigate('Garden')
```

---

## 4. IoT Provisioning Flow (Critical Feature)

### Overview

The device setup flow in `(modals)/device-setup.tsx` connects a new ESP32 IoT kit to the user's account and home WiFi.

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        IoT PROVISIONING FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌────────────┐  │
│  │  STEP 1  │───▶│    STEP 2    │───▶│   STEP 3    │───▶│   STEP 4   │  │
│  │ QR Scan  │    │   Activate   │    │  WiFi Setup │    │   Assign   │  │
│  └──────────┘    └──────────────┘    └─────────────┘    └────────────┘  │
│                                                                          │
│  User scans     Backend links       ESP broadcasts     User assigns     │
│  QR code to     device to user      SoftAP, user       device to a      │
│  get serial +   account via API     sends home WiFi    planting zone    │
│  secret_key                         credentials                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Implementation

#### Step 1: QR Code Scanning

```typescript
// User scans QR code printed on the IoT kit box
// QR contains JSON: { "serial_number": "ESP-xxx", "secret_key": "abc123" }

interface QRPayload {
  serial_number: string
  secret_key: string
}
```

#### Step 2: Device Activation (Backend Call)

```typescript
// POST /devices/activate
// Headers: Authorization: Bearer <access_token>

const activateDevice = async (payload: QRPayload) => {
  const response = await apiClient.post('/devices/activate', {
    serial_number: payload.serial_number,
    secret_key: payload.secret_key
  })
  // Backend links device.owner_id to current user
  // Device status changes to 'OFFLINE'
  return response.data.device
}
```

**Backend Logic** (device-registry-service):

- Validates `serial_number` exists in database
- Verifies `secret_key` matches
- Checks device has no existing owner (`owner_id` is null)
- Sets `owner_id = user_id`, `status = 'OFFLINE'`

#### Step 3: WiFi Configuration via SoftAP

```typescript
// After activation, instruct user to:
// 1. Power on the ESP device
// 2. ESP creates WiFi hotspot: "OrchidPal-{serial_number}"
// 3. User connects phone to ESP's WiFi (manually via Settings or programmatically)
// 4. Phone sends home WiFi credentials to ESP

interface WifiCredentials {
  ssid: string
  password: string
}

// ESP typically exposes HTTP endpoint at http://192.168.4.1/config
const configureDeviceWifi = async (credentials: WifiCredentials) => {
  // This call goes directly to ESP, not through backend
  const response = await fetch('http://192.168.4.1/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  return response.ok
}
```

**ESP Behavior**:

- ESP receives credentials → connects to home WiFi
- ESP publishes to MQTT topic: `device/{serial_number}/status`
- Backend receives MQTT message → updates `status = 'ONLINE'`

#### Step 4: Zone Assignment

```typescript
// POST /devices/{serial_number}/assign-zone
// User selects which planting zone to assign the device

const assignDeviceToZone = async (serialNumber: string, zoneId: string) => {
  const response = await apiClient.post(`/devices/${serialNumber}/assign-zone`, {
    zone_id: zoneId
  })
  return response.data
}
```

### UI Flow States

```typescript
type ProvisioningStep =
  | 'SCAN_QR' // Camera active, waiting for QR
  | 'ACTIVATING' // Calling /devices/activate
  | 'CONNECT_TO_ESP' // Instruct user to connect to ESP WiFi
  | 'SENDING_WIFI' // Sending home WiFi credentials
  | 'WAITING_ONLINE' // Polling device status until ONLINE
  | 'SELECT_ZONE' // User picks planting zone
  | 'COMPLETE' // Success screen
```

### API Endpoints (Device Registry)

| Method | Endpoint                              | Description                    |
| ------ | ------------------------------------- | ------------------------------ |
| POST   | `/devices/activate`                   | Link device to user account    |
| GET    | `/devices/:serial_number/status`      | Check device online status     |
| POST   | `/devices/:serial_number/assign-zone` | Assign device to planting zone |

---

## 5. Core Features

### Module A: Sales & Device Lifecycle

- **Store**: Browse/purchase IoT kits (`(dashboard)/store/`)
- **Provisioning**: QR scan → Activate → WiFi setup → Zone assignment
- **OTA Updates**: Admin pushes firmware updates (backend-managed)

### Module B: Garden & Automation

- **Plant Profile**: Species, planting date, location
- **Care Modes**:
  - **Expert Templates**: Pre-built rules by experts (e.g., "Phalaenopsis Spring Mode")
  - **Manual Rules**: User-defined IF-THEN rules (e.g., "If temp > 35°C → Pump ON 20s")
- **Dashboard**: Real-time charts (temp, humidity, light), irrigation history, alerts
- **Manual Control**: Toggle relay (pump/mist/light) instantly

### Module C: AI Intelligence (Premium)

- **Seasonal Mode**: AI analyzes 3-7 days of sensor data, suggests schedule adjustments
- **Suggestion Flow**: Compare current vs proposed → Ignore/Edit/Apply
- **Smart Alerts**:
  - Level 1 (Minor): Push notification for user action
  - Level 2 (Critical): Auto-activate emergency irrigation + report

### Module D: Diagnosis & Expert Support

- **Knowledge Base**: Expert-defined disease patterns linked to sensor thresholds
- **Expert Booking** (Premium): Chat with experts, share photos + sensor logs
- **AI Vision** (Future): Photo-based disease detection

---

## 6. Data Flow & State Management

### Reading Data (Queries)

```
URL → Screen (Server Component) → services/*.ts → core/api/axios.ts → Backend
```

Use **TanStack Query** for caching & background refetching:

```typescript
// services/garden.service.ts
export const useGardens = () => {
  return useQuery({
    queryKey: ['gardens'],
    queryFn: () => apiClient.get('/gardens').then((res) => res.data)
  })
}
```

### Writing Data (Mutations)

```typescript
// Optimistic update pattern
const togglePump = useMutation({
  mutationFn: (deviceId: string) => apiClient.post(`/control/${deviceId}/pump`),
  onMutate: async (deviceId) => {
    // Optimistic update
    queryClient.setQueryData(['device', deviceId], (old) => ({
      ...old,
      pumpStatus: !old.pumpStatus
    }))
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['device'] })
  }
})
```

### Global State (Zustand)

```typescript
// store/auth.store.ts
interface AuthStore {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

// store/device.store.ts
interface DeviceStore {
  onlineDevices: string[] // serial numbers
  setOnline: (serial: string) => void
  setOffline: (serial: string) => void
}
```

### API Client Configuration

```typescript
// core/api/axios.ts
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL
})

// Auto-inject Bearer token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global 401 handling
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      router.replace('/(auth)/login')
    }
    return Promise.reject(error)
  }
)
```

---

## 7. UI System & Styling

### Design System

Use **Gluestack UI** primitives from `components/ui/`:

```tsx
// ✅ Correct usage
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, InputField } from '@/components/ui/input';

<Button action="primary" size="lg">
  <ButtonText>Save Changes</ButtonText>
</Button>

// ❌ Avoid raw primitives
<TouchableOpacity style={styles.btn}>...</TouchableOpacity>
```

### Styling with NativeWind

```tsx
// Use className for layout & styling
;<View className='bg-background-0 flex-1 p-4'>
  <Text className='text-typography-900 text-xl font-semibold'>Garden Status</Text>
</View>

// Use Tailwind Variants (tva) for component variants
import { tva } from '@gluestack-ui/nativewind-utils/tva'

const cardStyle = tva({
  base: 'rounded-xl p-4 shadow-sm',
  variants: {
    status: {
      healthy: 'bg-success-100 border-success-500',
      warning: 'bg-warning-100 border-warning-500',
      critical: 'bg-error-100 border-error-500'
    }
  }
})
```

### Theme Configuration

- Colors & tokens defined in `tailwind.config.js` → mapped to `global.css` variables
- Semantic colors: `primary`, `secondary`, `success`, `warning`, `error`, `background`, `typography`

### Component Guidelines

- **Presentational components** receive props, no data fetching:

```tsx
// components/dashboard/EnvironmentCard.tsx
interface EnvironmentCardProps {
  temperature: number
  humidity: number
  status: 'healthy' | 'warning' | 'critical'
}

export const EnvironmentCard = ({ temperature, humidity, status }: EnvironmentCardProps) => {
  // Pure UI, no useQuery/useMutation here
}
```

---

## 8. 3D Graphics (R3F + Drei)

### Setup

3D models stored in `assets/3d/` or `public/models/` (GLB/GLTF format).

```tsx
// components/3d/scene-wrapper.tsx
import { Canvas } from '@react-three/fiber/native'
import { OrbitControls, useGLTF } from '@react-three/drei/native'

export const SceneWrapper = ({ children }) => (
  <Canvas>
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 5]} />
    {children}
    <OrbitControls />
  </Canvas>
)

// components/3d/iot-kit.tsx
export const IoTKitModel = () => {
  const { scene } = useGLTF(require('@/assets/3d/orchid-kit.glb'))
  return <primitive object={scene} scale={0.5} />
}
```

---

## 9. Developer Workflow

### Scripts

```bash
npm start          # Start Metro bundler
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator
npm run web        # Run web version
npm test           # Run Jest tests
```

### Testing

- Framework: Jest + jest-expo
- Co-locate tests: `components/MyComponent.test.tsx`

### Code Quality

- Prettier with Tailwind plugin for class sorting
- TypeScript strict mode

### Environment Variables

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 10. Quick Reference: Adding Features

### New Screen

1. Create types in `types/feature.ts`
2. Create service in `services/feature.service.ts`
3. Create screen in `app/(group)/feature/page.tsx`

### New 3D Asset

1. Place `.glb` file in `assets/3d/`
2. Create component in `components/3d/`
3. Load with `useGLTF(require('@/assets/3d/model.glb'))`

### New API Endpoint Integration

1. Define types in `types/`
2. Create service function with TanStack Query
3. Use in component with `useQuery` or `useMutation`

### State Management Decision Tree

```
Is it server data? → TanStack Query
Is it global app state (auth, settings)? → Zustand
Is it local component state? → useState/useReducer
Is it URL-shareable state? → Consider URL params (for web)
```
