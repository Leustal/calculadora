export type NodeType =
  | 'nginx'
  | 'apache'
  | 'mariadb';

export interface NodeConfig {
  id: string;
  type: NodeType;
  name: string;

  // Cloudlets reservados.
  reservedCloudlets: number;

  // Limite máximo de cloudlets dinâmicos.
  dynamicCloudlets: number;

  // Limite máximo de storage.
  storageGB: number;

  // Recursos públicos.
  ipv4: boolean;
  ipv6: boolean;
}

export interface Topology {
  nginx: NodeConfig[];
  apache: NodeConfig[];
  mariadb: NodeConfig[];
}

export interface ConsumptionEstimate {
  // Cloudlets dinâmicos efetivamente
  // utilizados na estimativa por hora.
  dynamicCloudletsUsed: number;

  // Storage efetivamente utilizado
  // na estimativa por hora.
  storageGBUsed: number;
}