/**
 * Types pour le système de mining
 */

export interface BitcoinKPIs {
  totalHashrate: number;
  dailyProduction: number;
  efficiency: number;
  uptime: number;
  networkDifficulty: number;
  btcPrice: number;
}

export interface StrategicReserve {
  totalBTC: number;
  currentValue: number;
  monthlyAccumulation: number;
  projectedYearEnd: number;
  reserveGrowth: number;
}

export interface HardwareStatus {
  totalMiners: number;
  activeMiners: number;
  maintenanceMiners: number;
  offlineMiners: number;
  containers: {
    total: number;
    active: number;
    maintenance: number;
  };
}

export interface HashrateHistory {
  date: string;
  hashrate: number;
}

export interface ProductionHistory {
  date: string;
  btc: number;
}

export interface ReserveHistory {
  date: string;
  btc: number;
}

export interface ContainerPerformance {
  id: string;
  performance: number;
  status: 'optimal' | 'warning' | 'critical' | 'offline' | 'maintenance';
  temperature: number;
  hashrate: number;
}

export interface HashrateComparison {
  name: string;
  hashrate: number;
}

