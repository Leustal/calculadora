export type LayerType =
  | 'load-balancer'
  | 'application'
  | 'sql'
  | 'nosql'
  | 'cache'
  | 'storage'
  | 'vps';

export interface SoftwareStack {
  id: string;
  name: string;
  layer: LayerType;
}

export interface NodeConfig {
  id: string;
  layer: LayerType;
  stackId: string;
  name: string;

  reservedCloudlets: number;

  dynamicCloudlets: number;

  storageGB: number;

  ipv4: boolean;

  ipv6: boolean;
}

export interface Infrastructure {
  nodes: NodeConfig[];
}

export interface PriceRange {
  hourly: number;
  daily: number;
  monthly: number;
}

export interface PriceResult {
  minimum: PriceRange;

  maximum: PriceRange;

  reservedUnitPrice: number;

  dynamicUnitPrice: number;

  breakdown: {
    minimum: {
      reserved: number;
      dynamic: number;
      storage: number;
      ipv4: number;
      ipv6: number;
    };

    maximum: {
      reserved: number;
      dynamic: number;
      storage: number;
      ipv4: number;
      ipv6: number;
    };
  };

  quantities: {
    reserved: number;
    dynamicMaximum: number;
    storageMaximum: number;
    ipv4: number;
    ipv6: number;
  };
}