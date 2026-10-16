import {
  PRICING,
  HOURS_PER_DAY,
  HOURS_PER_MONTH,
} from '../data/pricing';

import type {
  Infrastructure,
  PriceRange,
  PriceResult,
} from '../types/infrastructure';

interface CloudletTier {
  min: number;
  max: number;
  price: number;
  discount: number;
}

function getTier(
  quantity: number,
  tiers: readonly CloudletTier[]
): CloudletTier {
  if (quantity <= 0) {
    return {
      min: 0,
      max: 0,
      price: 0,
      discount: 0,
    };
  }

  const tier = tiers.find(
    (item) =>
      quantity >= item.min &&
      quantity <= item.max
  );

  return (
    tier ?? tiers[tiers.length - 1]
  );
}

function getTierPrice(
  quantity: number,
  tiers: readonly CloudletTier[]
): number {
  return getTier(
    quantity,
    tiers
  ).price;
}

function getStoragePrice(
  storageGB: number
): number {
  return (
    storageGB *
    PRICING.storage.hourly
  );
}

function createPriceRange(
  hourly: number
): PriceRange {
  return {
    hourly,
    daily:
      hourly *
      HOURS_PER_DAY,
    monthly:
      hourly *
      HOURS_PER_MONTH,
  };
}

function subtractPriceRanges(
  total: PriceRange,
  savings: PriceRange
): PriceRange {
  return {
    hourly: Math.max(
      0,
      total.hourly -
        savings.hourly
    ),

    daily: Math.max(
      0,
      total.daily -
        savings.daily
    ),

    monthly: Math.max(
      0,
      total.monthly -
        savings.monthly
    ),
  };
}

/**
 * Preço-base utilizado para calcular os descontos.
 *
 * Conforme a tabela da plataforma:
 *
 * 1 - 20 cloudlets dinâmicos
 * = R$ 0,0326 por hora.
 */
function getBaseCloudletPrice(): number {
  return (
    PRICING.dynamicCloudlets[0]?.price ??
    0
  );
}

/**
 * Calcula o desconto dos cloudlets reservados.
 *
 * O desconto é a diferença entre:
 *
 * preço-base dinâmico
 * -
 * preço do cloudlet reservado
 *
 * Exemplo para 1-5 cloudlets:
 *
 * R$ 0,0326
 * -
 * R$ 0,0230
 * =
 * R$ 0,0096 por cloudlet/hora.
 */
function calculateReservedDiscountHourly(
  reservedCloudlets: number
): number {
  if (reservedCloudlets <= 0) {
    return 0;
  }

  const basePrice =
    getBaseCloudletPrice();

  const reservedPrice =
    getTierPrice(
      reservedCloudlets,
      PRICING.reservedCloudlets
    );

  const discountPerCloudlet =
    Math.max(
      0,
      basePrice -
        reservedPrice
    );

  return (
    reservedCloudlets *
    discountPerCloudlet
  );
}

/**
 * Calcula o desconto dos cloudlets dinâmicos.
 *
 * O preço dinâmico é comparado ao preço-base
 * de R$ 0,0326/h.
 *
 * Exemplos:
 *
 * 1-20:
 * R$ 0,0326 - R$ 0,0326 = R$ 0,0000
 *
 * 21-40:
 * R$ 0,0326 - R$ 0,0236 = R$ 0,0090
 *
 * 41-130:
 * R$ 0,0326 - R$ 0,0214 = R$ 0,0112
 *
 * 131+:
 * R$ 0,0326 - R$ 0,0197 = R$ 0,0129
 */
function calculateDynamicDiscountHourly(
  dynamicCloudlets: number
): number {
  if (dynamicCloudlets <= 0) {
    return 0;
  }

  const basePrice =
    getBaseCloudletPrice();

  const dynamicPrice =
    getTierPrice(
      dynamicCloudlets,
      PRICING.dynamicCloudlets
    );

  const discountPerCloudlet =
    Math.max(
      0,
      basePrice -
        dynamicPrice
    );

  return (
    dynamicCloudlets *
    discountPerCloudlet
  );
}

export function calculatePrice(
  infrastructure: Infrastructure
): PriceResult {
  const nodes =
    infrastructure.nodes;

  /*
   * ==========================================
   * QUANTIDADES
   * ==========================================
   */

  /**
   * Quantidade total de cloudlets reservados.
   *
   * Cada node possui no mínimo 1 cloudlet reservado.
   */
  const reservedCloudlets =
    nodes.reduce(
      (total, node) =>
        total +
        Math.max(
          1,
          node.reservedCloudlets
        ),
      0
    );

  /**
   * Limite máximo TOTAL de cloudlets.
   *
   * Exemplo:
   *
   * reservado = 1
   * limite = 8
   *
   * PARA = 8
   *
   * Não é 1 + 8 = 9.
   */
  const dynamicMaximum =
    nodes.reduce(
      (total, node) =>
        total +
        Math.max(
          Math.max(
            1,
            node.reservedCloudlets
          ),
          node.dynamicCloudlets
        ),
      0
    );

  /**
   * Quantidade efetivamente dinâmica.
   *
   * Exemplo:
   *
   * reservado = 1
   * máximo = 8
   *
   * dinâmicos = 7.
   */
  const dynamicCloudlets =
    Math.max(
      0,
      dynamicMaximum -
        reservedCloudlets
    );

  /**
   * Armazenamento mínimo.
   *
   * A plataforma considera pelo menos
   * 1 GB por node.
   */
  const storageMinimum =
    nodes.length;

  /**
   * Armazenamento máximo.
   */
  const storageMaximum =
    nodes.reduce(
      (total, node) =>
        total +
        Math.max(
          1,
          node.storageGB
        ),
      0
    );

  /**
   * Quantidade de IPv4 públicos.
   */
  const ipv4 =
    nodes.filter(
      (node) => node.ipv4
    ).length;

  /**
   * Quantidade de IPv6 públicos.
   */
  const ipv6 =
    nodes.filter(
      (node) => node.ipv6
    ).length;

  /*
   * ==========================================
   * PREÇOS UNITÁRIOS
   * ==========================================
   */

  const reservedUnitPrice =
    getTierPrice(
      reservedCloudlets,
      PRICING.reservedCloudlets
    );

  const dynamicUnitPrice =
    getTierPrice(
      dynamicCloudlets,
      PRICING.dynamicCloudlets
    );

  const baseCloudletPrice =
    getBaseCloudletPrice();

  /*
   * ==========================================
   * STORAGE
   * ==========================================
   */

  const minimumStorageHourly =
    getStoragePrice(
      storageMinimum
    );

  const maximumStorageHourly =
    getStoragePrice(
      storageMaximum
    );

  /*
   * ==========================================
   * IP
   * ==========================================
   */

  const ipv4Hourly =
    ipv4 *
    PRICING.ipv4.hourly;

  const ipv6Hourly =
    ipv6 *
    PRICING.ipv6.hourly;

  /*
   * ==========================================
   * TOTAL DE
   * ==========================================
   *
   * O TOTAL representa o preço antes dos
   * descontos.
   *
   * Os cloudlets são calculados pelo preço-base
   * de R$ 0,0326/h.
   */

  const minimumCloudletGrossHourly =
    reservedCloudlets *
    baseCloudletPrice;

  const minimumHourly =
    minimumCloudletGrossHourly +
    minimumStorageHourly +
    ipv4Hourly +
    ipv6Hourly;

  const minimum =
    createPriceRange(
      minimumHourly
    );

  /*
   * ==========================================
   * TOTAL PARA
   * ==========================================
   *
   * O PARA utiliza o limite máximo total
   * de cloudlets.
   *
   * O preço bruto também utiliza o preço-base
   * antes dos descontos.
   */

  const maximumCloudletGrossHourly =
    dynamicMaximum *
    baseCloudletPrice;

  const maximumHourly =
    maximumCloudletGrossHourly +
    maximumStorageHourly +
    ipv4Hourly +
    ipv6Hourly;

  const maximum =
    createPriceRange(
      maximumHourly
    );

  /*
   * ==========================================
   * DESCONTO DE
   * ==========================================
   *
   * Apenas os cloudlets reservados recebem
   * desconto nesse cenário.
   */

  const minimumReservedDiscountHourly =
    calculateReservedDiscountHourly(
      reservedCloudlets
    );

  const minimumSavings =
    createPriceRange(
      minimumReservedDiscountHourly
    );

  /*
   * ==========================================
   * DESCONTO PARA
   * ==========================================
   *
   * Os cloudlets reservados recebem o desconto
   * da tabela de reservados.
   *
   * Os cloudlets adicionais recebem o desconto
   * correspondente ao tier de cloudlets dinâmicos.
   */

  const maximumReservedDiscountHourly =
    calculateReservedDiscountHourly(
      reservedCloudlets
    );

  const maximumDynamicDiscountHourly =
    calculateDynamicDiscountHourly(
      dynamicCloudlets
    );

  const maximumSavings =
    createPriceRange(
      maximumReservedDiscountHourly +
      maximumDynamicDiscountHourly
    );

  /*
   * ==========================================
   * TOTAL A PAGAR
   * ==========================================
   */

  const minimumPayable =
    subtractPriceRanges(
      minimum,
      minimumSavings
    );

  const maximumPayable =
    subtractPriceRanges(
      maximum,
      maximumSavings
    );

  /*
   * ==========================================
   * BREAKDOWN
   * ==========================================
   */

  const minimumReservedHourly =
    reservedCloudlets *
    reservedUnitPrice;

  const maximumReservedHourly =
    reservedCloudlets *
    reservedUnitPrice;

  const maximumDynamicHourly =
    dynamicCloudlets *
    dynamicUnitPrice;

  return {
    minimum,
    maximum,

    minimumSavings,
    maximumSavings,

    minimumPayable,
    maximumPayable,

    reservedUnitPrice,
    dynamicUnitPrice,

    breakdown: {
      minimum: {
        reserved:
          minimumReservedHourly,

        dynamic:
          0,

        storage:
          minimumStorageHourly,

        ipv4:
          ipv4Hourly,

        ipv6:
          ipv6Hourly,
      },

      maximum: {
        reserved:
          maximumReservedHourly,

        dynamic:
          maximumDynamicHourly,

        storage:
          maximumStorageHourly,

        ipv4:
          ipv4Hourly,

        ipv6:
          ipv6Hourly,
      },
    },

    quantities: {
      reserved:
        reservedCloudlets,

      dynamicMaximum:
        dynamicMaximum,

      storageMinimum:
        storageMinimum,

      storageMaximum:
        storageMaximum,

      ipv4,

      ipv6,
    },
  };
}