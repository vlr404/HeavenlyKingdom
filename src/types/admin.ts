import type { Holiday } from './holiday';
import type { Product } from './index';

export type AdminSectionId = 'stats' | 'holidays' | 'donations' | 'store';

export interface AdminSection {
  id: AdminSectionId;
  label: string;
  icon: string;
}

export interface HolidayManagerProps {
  holidays: Holiday[];
  onAdd: (name: string, date: Date) => void;
  onRemove: (id: number) => void;
}

export interface HolidayFormValues {
  name: string;
  date: string;
}

export interface DonationGoal {
  id: number;
  title: string;
  target: number;
  current: number;
}

export interface DonationWidgetProps {
  goal: DonationGoal;
  onUpdateGoal: (patch: Partial<Omit<DonationGoal, 'id'>>) => void;
  onAddProgress: (amount: number) => void;
  onReset: () => void;
}

export interface AdminProduct extends Product {
  onSale: boolean;
  salePrice?: number;
}

export interface StoreManagerProps {
  products: AdminProduct[];
  categories: string[];
  onToggleSale: (id: number, onSale: boolean) => void;
  onUpdateSalePrice: (id: number, salePrice: number) => void;
  onAddCategory: (name: string) => void;
  onRemoveCategory: (name: string) => void;
}

export interface AdminStats {
  totalProducts: number;
  saleProducts: number;
  futureHolidays: number;
  donationProgress: number;
}
