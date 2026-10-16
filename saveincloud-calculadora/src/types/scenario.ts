import type {
  Infrastructure,
  PriceResult,
} from './infrastructure';

export interface SavedScenario {
  id: string;
  name: string;
  infrastructure: Infrastructure;
  price: PriceResult;
  createdAt: number;
}
