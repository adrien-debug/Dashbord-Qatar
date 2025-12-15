/**
 * Types pour le système d'infrastructure
 */

export interface PowerSystem {
  id: string;
  name: string;
  currentLoad: number;
  maxCapacity: number;
  efficiency: number;
  temperature: number;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
  lastMaintenance: string;
}

export interface CoolingSystem {
  id: string;
  name: string;
  flowRate: number;
  temperature: {
    input: number;
    output: number;
  };
  efficiency: number;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  system: string;
  acknowledged: boolean;
}

export interface NetworkStatus {
  uptime: number;
  latency: number;
  bandwidth: {
    upload: number;
    download: number;
  };
  status: 'online' | 'degraded' | 'offline';
}

export interface SecurityStatus {
  firewall: 'active' | 'inactive';
  intrusions: number;
  lastScan: string;
  vulnerabilities: number;
  status: 'secure' | 'warning' | 'critical';
}

