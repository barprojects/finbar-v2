export interface Portfolio {
  id: string;
  name: string;
  accountNumber?: string;
  buyFee: number;
  sellFee: number;
}

export interface PortfolioFormData {
  name: string;
  accountNumber: string;
  buyFee: number;
  sellFee: number;
}

export const DEFAULT_PORTFOLIO_VALUES: PortfolioFormData = {
  name: "",
  accountNumber: "",
  buyFee: 2.5,
  sellFee: 2.5,
};
