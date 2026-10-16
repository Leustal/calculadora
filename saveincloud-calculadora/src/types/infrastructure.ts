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

  /**
   * Recursos mínimos/garantidos do node.
   */
  reservedCloudlets: number;

  /**
   * Limite total de cloudlets que o node poderá atingir.
   *
   * Exemplo:
   * reservado = 1
   * limite = 8
   *
   * DE  = 1 cloudlet
   * PARA = 8 cloudlets
   *
   * O limite NÃO é somado aos reservados.
   */
  dynamicCloudlets: number;

  /**
   * Capacidade máxima de armazenamento configurada
   * para o node.
   */
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

export interface PriceBreakdown {
  reserved: number;
  dynamic: number;
  storage: number;
  ipv4: number;
  ipv6: number;
}

export interface PriceResult {
  /**
   * Valor bruto do cenário mínimo.
   */
  minimum: PriceRange;

  /**
   * Valor bruto do cenário máximo.
   */
  maximum: PriceRange;

  /**
   * Desconto aplicado ao cenário mínimo.
   *
   * Atualmente permanece zerado porque a fórmula
   * geral do "Salvar" ainda não foi determinada.
   */
  minimumSavings: PriceRange;

  /**
   * Desconto aplicado ao cenário máximo.
   */
  maximumSavings: PriceRange;

  /**
   * Valor efetivamente pago no cenário mínimo.
   *
   * Atualmente é igual ao total enquanto a fórmula
   * do desconto não estiver definida.
   */
  minimumPayable: PriceRange;

  /**
   * Valor efetivamente pago no cenário máximo.
   *
   * Atualmente é igual ao total enquanto a fórmula
   * do desconto não estiver definida.
   */
  maximumPayable: PriceRange;

  reservedUnitPrice: number;

  dynamicUnitPrice: number;

  breakdown: {
    minimum: PriceBreakdown;
    maximum: PriceBreakdown;
  };

  quantities: {
    reserved: number;

    /**
     * Limite total máximo de cloudlets.
     */
    dynamicMaximum: number;

    /**
     * Quantidade mínima de storage.
     * Cada node possui no mínimo 1 GB.
     */
    storageMinimum: number;

    /**
     * Capacidade máxima de storage configurada.
     */
    storageMaximum: number;

    ipv4: number;
    ipv6: number;
  };
}