export interface IPhoneModel {
  name: string;
  baseStorage: number;
  storageOptions: number[];
  costPrice: number;
  screenDamageDiscount: number;
  faceIdDiscount: number;
}

export const iphoneModels: IPhoneModel[] = [
  { name: "iPhone 11", baseStorage: 64, storageOptions: [64, 128, 256], costPrice: 175, screenDamageDiscount: 35, faceIdDiscount: 40 },
  { name: "iPhone 11 Pro", baseStorage: 64, storageOptions: [64, 256, 512], costPrice: 195, screenDamageDiscount: 35, faceIdDiscount: 45 },
  { name: "iPhone 11 Pro Max", baseStorage: 64, storageOptions: [64, 256, 512], costPrice: 235, screenDamageDiscount: 35, faceIdDiscount: 50 },
  { name: "iPhone 12", baseStorage: 64, storageOptions: [64, 128, 256], costPrice: 195, screenDamageDiscount: 50, faceIdDiscount: 40 },
  { name: "iPhone 12 mini", baseStorage: 64, storageOptions: [64, 128, 256], costPrice: 200, screenDamageDiscount: 50, faceIdDiscount: 40 },
  { name: "iPhone 12 Pro", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 255, screenDamageDiscount: 50, faceIdDiscount: 50 },
  { name: "iPhone 12 Pro Max", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 275, screenDamageDiscount: 50, faceIdDiscount: 55 },
  { name: "iPhone 13", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 275, screenDamageDiscount: 65, faceIdDiscount: 50 },
  { name: "iPhone 13 mini", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 220, screenDamageDiscount: 65, faceIdDiscount: 45 },
  { name: "iPhone 13 Pro", baseStorage: 128, storageOptions: [128, 256, 512, 1024], costPrice: 370, screenDamageDiscount: 65, faceIdDiscount: 65 },
  { name: "iPhone 13 Pro Max", baseStorage: 128, storageOptions: [128, 256, 512, 1024], costPrice: 405, screenDamageDiscount: 65, faceIdDiscount: 70 },
  { name: "iPhone 14", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 310, screenDamageDiscount: 70, faceIdDiscount: 55 },
  { name: "iPhone 14 Plus", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 330, screenDamageDiscount: 70, faceIdDiscount: 60 },
  { name: "iPhone 14 Pro", baseStorage: 128, storageOptions: [128, 256, 512, 1024], costPrice: 410, screenDamageDiscount: 120, faceIdDiscount: 75 },
  { name: "iPhone 14 Pro Max", baseStorage: 128, storageOptions: [128, 256, 512, 1024], costPrice: 480, screenDamageDiscount: 120, faceIdDiscount: 85 },
  { name: "iPhone 15", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 420, screenDamageDiscount: 90, faceIdDiscount: 75 },
  { name: "iPhone 15 Plus", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 440, screenDamageDiscount: 90, faceIdDiscount: 80 },
  { name: "iPhone 15 Pro", baseStorage: 128, storageOptions: [128, 256, 512, 1024], costPrice: 510, screenDamageDiscount: 150, faceIdDiscount: 95 },
  { name: "iPhone 15 Pro Max", baseStorage: 256, storageOptions: [256, 512, 1024], costPrice: 625, screenDamageDiscount: 170, faceIdDiscount: 110 },
  { name: "iPhone 16e", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 500, screenDamageDiscount: 190, faceIdDiscount: 90 },
  { name: "iPhone 16", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 565, screenDamageDiscount: 190, faceIdDiscount: 100 },
  { name: "iPhone 16 Plus", baseStorage: 128, storageOptions: [128, 256, 512], costPrice: 585, screenDamageDiscount: 190, faceIdDiscount: 105 },
  { name: "iPhone 16 Pro", baseStorage: 128, storageOptions: [128, 256, 512, 1024], costPrice: 700, screenDamageDiscount: 320, faceIdDiscount: 130 },
  { name: "iPhone 16 Pro Max", baseStorage: 256, storageOptions: [256, 512, 1024], costPrice: 850, screenDamageDiscount: 360, faceIdDiscount: 150 },
];

export interface DamageOption {
  id: string;
  label: string;
  discount: number;
  /** If true, discount varies by model (uses screenDamageDiscount) */
  isScreenDamage?: boolean;
  /** If true, discount varies by model (uses faceIdDiscount) */
  isFaceIdDamage?: boolean;
}

export const damageOptions: DamageOption[] = [
  { id: "screen", label: "Pantalla rota", discount: 0, isScreenDamage: true },
  { id: "back", label: "Tapa trasera dañada / rayada", discount: 50 },
  { id: "camera", label: "Cámara dañada", discount: 70 },
  { id: "faceid", label: "Face ID no funciona", discount: 0, isFaceIdDamage: true },
  { id: "proximity", label: "Sensor proximidad / parlante auricular", discount: 35 },
  { id: "charging", label: "Pin de carga", discount: 35 },
  { id: "vibration", label: "No vibra", discount: 15 },
  { id: "speaker", label: "Problemas altavoz/parlante", discount: 25 },
  { id: "buttons", label: "Botones no funcionan", discount: 30 },
  { id: "selfie", label: "Cámara selfie dañada", discount: 40 },
  { id: "lens", label: "Lente de cámara rayado", discount: 25 },
  { id: "unknown", label: "Pieza desconocida", discount: 50 },
];

export const interestedModels = [
  "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
  "iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
  "iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
  "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
  "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
  "iPhone 16e", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
  "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max",
];

export type BatteryHealth = "90-100" | "80-89" | "70-79";

const COMMISSION = 50;
const STORAGE_TIER_BONUS = 20;
const batteryDiscounts: Record<BatteryHealth, number> = {
  "90-100": 0,
  "80-89": 10,
  "70-79": 20,
};

export function formatStorageLabel(gb: number): string {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}

export function calculateTradeInPrice(
  model: IPhoneModel,
  selectedStorage: number,
  batteryHealth: BatteryHealth,
  selectedDamages: string[]
): number {
  // Base: cost price minus commission
  let price = model.costPrice - COMMISSION;

  // Storage bonus: +$20 per tier above base
  const storageIndex = model.storageOptions.indexOf(selectedStorage);
  const baseIndex = model.storageOptions.indexOf(model.baseStorage);
  const tiersAboveBase = storageIndex - baseIndex;
  price += tiersAboveBase * STORAGE_TIER_BONUS;

  // Battery discount
  price -= batteryDiscounts[batteryHealth];

  // Damage discounts
  for (const damageId of selectedDamages) {
    const damage = damageOptions.find((d) => d.id === damageId);
    if (!damage) continue;
    if (damage.isScreenDamage) {
      price -= model.screenDamageDiscount;
    } else if (damage.isFaceIdDamage) {
      price -= model.faceIdDiscount;
    } else {
      price -= damage.discount;
    }
  }

  return Math.max(0, price);
}

export function buildWhatsAppMessage(
  name: string,
  interestedModel: string,
  tradeModel: string,
  storage: string,
  price: number
): string {
  return `Hola, ¿cómo estás? Soy ${name}. Estaba interesado en el ${interestedModel}, quería consultar si hay stock. Quiero entregar mi ${tradeModel} de ${storage} cotizado a USD ${price}.`;
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/3757541930?text=${encodeURIComponent(message)}`;
}
