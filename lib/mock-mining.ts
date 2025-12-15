/**
 * Données mock pour le Mining Dashboard
 * Hearst Qatar - 100MW Bitcoin Mining Facility
 * EXTENDED VERSION - 90 days historical data
 */

import { BitcoinKPIs, StrategicReserve, HardwareStatus } from '../types/mining';

export const mockBitcoinKPIs: BitcoinKPIs = {
  totalHashrate: 1020, // PH/s (1.02 EH/s)
  dailyProduction: 2.45, // BTC/day
  efficiency: 23.5, // J/TH (très efficace)
  uptime: 99.2, // %
  networkDifficulty: 72000000000000,
  btcPrice: 100000,
};

export const mockStrategicReserve: StrategicReserve = {
  totalBTC: 220.5, // BTC accumulés (3 mois)
  currentValue: 22050000, // $22.05M USD (à ~$100k/BTC)
  monthlyAccumulation: 73.5, // BTC/month (2.45 * 30)
  projectedYearEnd: 894.75, // BTC (73.5 * 12)
  reserveGrowth: 12.5, // % croissance mensuelle
};

export const mockHardwareStatus: HardwareStatus = {
  totalMiners: 5760, // 180 miners par container * 32 containers
  activeMiners: 5712, // 99.17% actifs
  maintenanceMiners: 32, // 0.56% en maintenance
  offlineMiners: 16, // 0.28% offline
  containers: {
    total: 48, // 48 containers HD5 (12 par power block)
    active: 47, // 97.92% actifs
    maintenance: 1, // 2.08% en maintenance
  },
};

// ============================================================================
// HISTORICAL DATA - 90 DAYS
// ============================================================================

// Helper function to generate realistic variations
const generateVariation = (base: number, variance: number, trend: number = 0) => {
  return base + (Math.random() * variance * 2 - variance) + trend;
};

// Hashrate History - 90 days with realistic patterns
export const mockHashrateHistory = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // Simulate gradual improvement over time
  const trend = i * 0.2; // +0.2 PH/s per day improvement
  
  // Simulate weekly maintenance (every 7 days, slight dip)
  const maintenanceDip = i % 7 === 0 ? -15 : 0;
  
  return {
    date: date.toISOString().split('T')[0],
    hashrate: generateVariation(1000 + trend, 25, 0) + maintenanceDip,
    pb1: generateVariation(250, 10, 0),
    pb2: generateVariation(255, 10, 0),
    pb3: generateVariation(245, 12, 0),
    pb4: generateVariation(250, 10, 0),
  };
});

// Production History - 90 days
export const mockProductionHistory = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // BTC production correlates with hashrate
  const trend = i * 0.002;
  const maintenanceDip = i % 7 === 0 ? -0.2 : 0;
  
  return {
    date: date.toISOString().split('T')[0],
    btc: generateVariation(2.3 + trend, 0.15, 0) + maintenanceDip,
    usd: generateVariation(230000 + trend * 100000, 15000, 0),
  };
});

// Revenue History - Last 12 months
export const mockRevenueHistory = Array.from({ length: 12 }, (_, i) => {
  const monthsAgo = 11 - i;
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  
  // Gradual revenue increase over time
  const baseRevenue = 6500000;
  const trend = i * 100000;
  
  return {
    month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    revenue: generateVariation(baseRevenue + trend, 500000, 0),
    costs: generateVariation(3500000, 200000, 0),
    profit: 0, // Will be calculated
  };
}).map(entry => ({
  ...entry,
  profit: entry.revenue - entry.costs,
}));

// Efficiency History - 90 days
export const mockEfficiencyHistory = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // Efficiency improves slightly over time
  const trend = -i * 0.002; // Negative because lower J/TH is better
  
  return {
    date: date.toISOString().split('T')[0],
    efficiency: generateVariation(23.8 + trend, 0.3, 0),
    target: 23.5,
    industryAvg: 27.5,
  };
});

// Uptime History - 90 days
export const mockUptimeHistory = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // Occasional dips for maintenance
  const maintenanceDip = i % 7 === 0 ? -2 : 0;
  
  return {
    date: date.toISOString().split('T')[0],
    uptime: Math.min(100, generateVariation(99.5, 0.5, 0) + maintenanceDip),
  };
});

// Reserve Accumulation - 90 days
export const mockReserveHistory = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // Cumulative BTC accumulation
  const dailyProduction = 2.45;
  const cumulativeBTC = dailyProduction * (i + 1);
  
  return {
    date: date.toISOString().split('T')[0],
    btc: cumulativeBTC,
    usd: cumulativeBTC * 100000, // $100k per BTC
  };
});

// Power Consumption - 24 hours (hourly)
export const mockPowerConsumptionHourly = Array.from({ length: 24 }, (_, i) => {
  return {
    hour: `${i.toString().padStart(2, '0')}:00`,
    consumption: generateVariation(96.5, 2, 0),
    cost: generateVariation(4825, 100, 0), // $0.05 per kWh
  };
});

// Container Performance - All 48 containers
export const mockContainerPerformance = Array.from({ length: 48 }, (_, i) => {
  const powerBlock = Math.floor(i / 12) + 1;
  const containerNum = (i % 12) + 1;
  
  // Power Block 3 has slightly lower performance
  const performanceBase = powerBlock === 3 ? 95 : 98;
  
  // Container 23 is in maintenance
  const status = i === 22 ? 'maintenance' : 
                 i === 15 ? 'warning' :
                 i === 8 ? 'offline' : 'optimal';
  
  const performance = status === 'offline' ? 0 :
                     status === 'maintenance' ? 0 :
                     status === 'warning' ? generateVariation(85, 5, 0) :
                     generateVariation(performanceBase, 3, 0);
  
  return {
    id: `HD5-${(i + 1).toString().padStart(2, '0')}`,
    powerBlock: `PB${powerBlock}`,
    hashrate: (performance / 100) * 21.25, // PH/s per container
    miners: 120,
    activeMiners: status === 'offline' ? 0 :
                  status === 'maintenance' ? 0 :
                  status === 'warning' ? 108 : 120,
    temperature: generateVariation(42, 5, 0),
    performance: performance,
    status: status,
  };
});

// Miner Distribution by Status
export const mockMinerDistribution = [
  { name: 'Active', value: 5712, color: '#8AFD81' }, // Vert Hearst
  { name: 'Maintenance', value: 32, color: '#f59e0b' }, // Amber
  { name: 'Offline', value: 16, color: '#94a3b8' }, // Gray - jamais de rouge
];

// Cost Breakdown - Variations de Vert Hearst
export const mockCostBreakdown = [
  { name: 'Electricity', value: 3500000, color: '#8AFD81' }, // Vert Hearst principal
  { name: 'Cooling', value: 450000, color: '#6ee066' }, // Vert foncé
  { name: 'Maintenance', value: 280000, color: '#a0ffa0' }, // Vert clair
  { name: 'Staff', value: 320000, color: '#5cd654' }, // Vert moyen
  { name: 'Other', value: 150000, color: '#4bc943' }, // Vert profond
];

// Hashrate Comparison - Qatar vs Others
export const mockHashrateComparison = [
  { name: 'Qatar (Hearst)', hashrate: 1020, efficiency: 23.5, color: '#3b82f6' }, // Blue - Primary
  { name: 'Industry Average', hashrate: 850, efficiency: 27.5, color: '#94a3b8' }, // Slate
  { name: 'Top Performer', hashrate: 1150, efficiency: 22.8, color: '#10b981' }, // Emerald
];

// BTC Reserve Comparison - Strategic Reserves
export const mockReserveComparison = [
  { name: 'Qatar (Hearst)', btc: 220.5, rank: 1 },
  { name: 'El Salvador', btc: 5800, rank: 2 },
  { name: 'Bhutan', btc: 12000, rank: 3 },
  { name: 'Private Avg', btc: 150, rank: 4 },
];

// Predictive Analytics - Next 30 days
export const mockPredictiveProduction = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
  
  // Projected production with confidence bands
  const baseProduction = 2.45;
  const trend = i * 0.005; // Slight improvement
  
  return {
    date: date.toISOString().split('T')[0],
    predicted: baseProduction + trend,
    upperBound: baseProduction + trend + 0.2,
    lowerBound: baseProduction + trend - 0.2,
  };
});

// Last 7 days for sparklines
export const mockLast7DaysHashrate = mockHashrateHistory.slice(-7).map(d => d.hashrate);
export const mockLast7DaysProduction = mockProductionHistory.slice(-7).map(d => d.btc);
export const mockLast7DaysRevenue = mockProductionHistory.slice(-7).map(d => d.usd);
export const mockLast7DaysUptime = mockUptimeHistory.slice(-7).map(d => d.uptime);
