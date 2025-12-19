/**
 * Données mock pour Infrastructure Monitoring
 * Hearst Qatar - 100MW Bitcoin Mining Facility
 * EXTENDED VERSION - Complete temporal data
 */

import { PowerSystem, CoolingSystem, Alert, NetworkStatus, SecurityStatus } from '../types/infrastructure';

// Helper function
const generateVariation = (base: number, variance: number) => {
  return base + (Math.random() * variance * 2 - variance);
};

export const mockPowerSystems: PowerSystem[] = [
  {
    id: 'pb-1',
    name: 'Power Block 1',
    status: 'optimal',
    currentLoad: 24.2,
    maxCapacity: 25,
    efficiency: 96.8,
    temperature: 42,
    lastMaintenance: '2024-11-15',
  },
  {
    id: 'pb-2',
    name: 'Power Block 2',
    status: 'optimal',
    currentLoad: 24.8,
    maxCapacity: 25,
    efficiency: 97.2,
    temperature: 44,
    lastMaintenance: '2024-11-20',
  },
  {
    id: 'pb-3',
    name: 'Power Block 3',
    status: 'warning',
    currentLoad: 23.1,
    maxCapacity: 25,
    efficiency: 95.2,
    temperature: 48,
    lastMaintenance: '2024-11-10',
  },
  {
    id: 'pb-4',
    name: 'Power Block 4',
    status: 'optimal',
    currentLoad: 24.5,
    maxCapacity: 25,
    efficiency: 98.0,
    temperature: 41,
    lastMaintenance: '2024-11-25',
  },
];

export const mockCoolingSystems: CoolingSystem[] = [
  {
    id: 'cool-1',
    name: 'Cooling System North',
    status: 'optimal',
    flowRate: 1200,
    temperature: { input: 35, output: 28 },
    efficiency: 94.5,
  },
  {
    id: 'cool-2',
    name: 'Cooling System South',
    status: 'optimal',
    flowRate: 1180,
    temperature: { input: 36, output: 29 },
    efficiency: 93.8,
  },
  {
    id: 'cool-3',
    name: 'Cooling System East',
    status: 'warning',
    flowRate: 1050,
    temperature: { input: 38, output: 31 },
    efficiency: 89.2,
  },
  {
    id: 'cool-4',
    name: 'Cooling System West',
    status: 'optimal',
    flowRate: 1220,
    temperature: { input: 34, output: 27 },
    efficiency: 95.1,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    message: 'Network latency increased to 45ms. Investigating potential cause.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    system: 'network',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'warning',
    message: 'Temperature above normal threshold (48°C). Cooling system efficiency reduced.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    system: 'pb-3',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    type: 'warning',
    message: 'Flow rate below optimal level (1050 L/min vs 1200 L/min target)',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    system: 'cool-3',
    acknowledged: false,
  },
  {
    id: 'alert-4',
    type: 'info',
    message: 'Container HD5-12 scheduled for routine maintenance tomorrow at 10:00 AM',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    system: 'maintenance',
    acknowledged: true,
  },
  {
    id: 'alert-5',
    type: 'info',
    message: 'Efficiency reached 98.0% - highest this month',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    system: 'pb-4',
    acknowledged: true,
  },
];

export const mockNetworkStatus: NetworkStatus = {
  uptime: 99.8,
  latency: 12,
  bandwidth: {
    upload: 500,
    download: 1000,
  },
  status: 'online',
};

export const mockSecurityStatus: SecurityStatus = {
  firewall: 'active',
  intrusions: 0,
  lastScan: '2024-12-14',
  vulnerabilities: 0,
  status: 'secure',
};

// ============================================================================
// HISTORICAL DATA - EXTENDED
// ============================================================================

// Power History - Last 24 hours (hourly)
export const mockPowerHistory = Array.from({ length: 24 }, (_, i) => {
  const hour = 23 - i;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
    pb1: generateVariation(24.2, 0.8),
    pb2: generateVariation(24.8, 0.8),
    pb3: generateVariation(23.1, 1.2),
    pb4: generateVariation(24.5, 0.8),
    total: 0, // Will be calculated
  };
}).reverse().map(entry => ({
  ...entry,
  total: entry.pb1 + entry.pb2 + entry.pb3 + entry.pb4,
}));

// Power History - Last 7 days (daily averages)
export const mockPowerHistory7Days = Array.from({ length: 7 }, (_, i) => {
  const daysAgo = 6 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  return {
    date: date.toISOString().split('T')[0],
    pb1: generateVariation(24.2, 1),
    pb2: generateVariation(24.8, 1),
    pb3: generateVariation(23.1, 1.5),
    pb4: generateVariation(24.5, 1),
    total: 0,
  };
}).map(entry => ({
  ...entry,
  total: entry.pb1 + entry.pb2 + entry.pb3 + entry.pb4,
}));

// Power History - Last 30 days
export const mockPowerHistory30Days = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  return {
    date: date.toISOString().split('T')[0],
    pb1: generateVariation(24.2, 1.2),
    pb2: generateVariation(24.8, 1.2),
    pb3: generateVariation(23.1, 1.8),
    pb4: generateVariation(24.5, 1.2),
    total: 0,
  };
}).map(entry => ({
  ...entry,
  total: entry.pb1 + entry.pb2 + entry.pb3 + entry.pb4,
}));

// Temperature History - Last 24 hours
export const mockTemperatureHistory = Array.from({ length: 24 }, (_, i) => {
  const hour = 23 - i;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
    pb1: generateVariation(42, 3),
    pb2: generateVariation(44, 3),
    pb3: generateVariation(48, 4),
    pb4: generateVariation(41, 3),
  };
}).reverse();

// Temperature History - Last 7 days
export const mockTemperatureHistory7Days = Array.from({ length: 7 }, (_, i) => {
  const daysAgo = 6 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  return {
    date: date.toISOString().split('T')[0],
    pb1: generateVariation(42, 4),
    pb2: generateVariation(44, 4),
    pb3: generateVariation(48, 5),
    pb4: generateVariation(41, 4),
  };
});

// Cooling Performance - Last 24 hours
export const mockCoolingHistory = Array.from({ length: 24 }, (_, i) => {
  const hour = 23 - i;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
    north: {
      flowRate: generateVariation(1200, 50),
      tempIn: generateVariation(35, 2),
      tempOut: generateVariation(28, 2),
      efficiency: generateVariation(94.5, 2),
    },
    south: {
      flowRate: generateVariation(1180, 50),
      tempIn: generateVariation(36, 2),
      tempOut: generateVariation(29, 2),
      efficiency: generateVariation(93.8, 2),
    },
    east: {
      flowRate: generateVariation(1050, 60),
      tempIn: generateVariation(38, 3),
      tempOut: generateVariation(31, 2),
      efficiency: generateVariation(89.2, 3),
    },
    west: {
      flowRate: generateVariation(1220, 50),
      tempIn: generateVariation(34, 2),
      tempOut: generateVariation(27, 2),
      efficiency: generateVariation(95.1, 2),
    },
  };
}).reverse();

// Efficiency History - Last 30 days
export const mockEfficiencyHistory = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  return {
    date: date.toISOString().split('T')[0],
    pb1: generateVariation(96.8, 1.5),
    pb2: generateVariation(97.2, 1.5),
    pb3: generateVariation(95.2, 2),
    pb4: generateVariation(98.0, 1.2),
    cooling: generateVariation(93.2, 2),
  };
});

// Alert Timeline - Last 7 days
export const mockAlertTimeline = Array.from({ length: 7 }, (_, i) => {
  const daysAgo = 6 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  return {
    date: date.toISOString().split('T')[0],
    critical: Math.floor(Math.random() * 2),
    warning: Math.floor(Math.random() * 4) + 1,
    info: Math.floor(Math.random() * 6) + 2,
  };
});

// Alert Distribution by Type
export const mockAlertDistribution = [
  { name: 'Critical', value: 1, color: '#64748b' }, // Gray - jamais de rouge
  { name: 'Warning', value: 2, color: '#f59e0b' }, // Amber
  { name: 'Info', value: 2, color: '#10B981' }, // Vert Hearst
];

// Alert Distribution by System
export const mockAlertBySystem = [
  { name: 'Power', value: 2, color: '#3b82f6' }, // Blue
  { name: 'Cooling', value: 1, color: '#10b981' }, // Emerald
  { name: 'Network', value: 1, color: '#d97706' }, // Amber
  { name: 'Security', value: 0, color: '#059669' }, // Green
  { name: 'Other', value: 1, color: '#64748b' }, // Slate
];

// MTTR (Mean Time To Repair) - Last 30 days
export const mockMTTRHistory = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // Gradual improvement in MTTR
  const trend = -i * 0.5; // Decreasing MTTR is good
  
  return {
    date: date.toISOString().split('T')[0],
    mttr: Math.max(20, generateVariation(50 + trend, 10)),
    target: 45,
  };
});

// System Uptime - Last 30 days
export const mockSystemUptime = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  return {
    date: date.toISOString().split('T')[0],
    power: Math.min(100, generateVariation(99.5, 0.5)),
    cooling: Math.min(100, generateVariation(99.2, 0.8)),
    network: Math.min(100, generateVariation(99.8, 0.3)),
    overall: 0, // Will be calculated
  };
}).map(entry => ({
  ...entry,
  overall: (entry.power + entry.cooling + entry.network) / 3,
}));

// Load Distribution - Current
export const mockLoadDistribution = [
  { name: 'Power Block 1', load: 24.2, capacity: 25, percentage: 96.8 },
  { name: 'Power Block 2', load: 24.8, capacity: 25, percentage: 99.2 },
  { name: 'Power Block 3', load: 23.1, capacity: 25, percentage: 92.4 },
  { name: 'Power Block 4', load: 24.5, capacity: 25, percentage: 98.0 },
];

// Voltage Stability - Last 24 hours
export const mockVoltageHistory = Array.from({ length: 24 }, (_, i) => {
  const hour = 23 - i;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    pb1: generateVariation(11, 0.2),
    pb2: generateVariation(11, 0.2),
    pb3: generateVariation(10.8, 0.3),
    pb4: generateVariation(11.2, 0.2),
    target: 11,
  };
}).reverse();

// Cooling Delta T (Temperature Difference) - Last 24 hours
export const mockCoolingDeltaT = Array.from({ length: 24 }, (_, i) => {
  const hour = 23 - i;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    north: generateVariation(7, 1),
    south: generateVariation(7, 1),
    east: generateVariation(7, 1.5),
    west: generateVariation(7, 1),
    optimal: 7,
  };
}).reverse();

// Network Performance - Last 24 hours
export const mockNetworkHistory = Array.from({ length: 24 }, (_, i) => {
  const hour = 23 - i;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    latency: generateVariation(12, 3),
    bandwidth: generateVariation(950, 50),
    packetLoss: generateVariation(0.05, 0.03),
  };
}).reverse();

// Sparklines data (last 7 values for mini charts)
export const mockPowerSparkline = mockPowerHistory7Days.map(d => d.total);
export const mockTempSparkline = mockTemperatureHistory7Days.map(d => (d.pb1 + d.pb2 + d.pb3 + d.pb4) / 4);
export const mockEfficiencySparkline = mockEfficiencyHistory.slice(-7).map(d => (d.pb1 + d.pb2 + d.pb3 + d.pb4) / 4);
export const mockUptimeSparkline = mockSystemUptime.slice(-7).map(d => d.overall);
