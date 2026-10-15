import type {
  Infrastructure,
  PriceResult,
} from '../types/infrastructure';

import {
  HOURS_PER_DAY,
  HOURS_PER_MONTH,
  PRICING,
} from '../data/pricing';

export function getTierPrice(
  quantity: number,
  tiers: {
    min: number;
    max: number;
    price: number;
  }[]
) {
  if (quantity <= 0) {
    return 0;
  }

  const tier = tiers.find(
    (item) =>
      quantity >= item.min &&
      quantity <= item.max
  );

  return tier
    ? tier.price
    : 0;
}

function calculateReserved(
  infrastructure: Infrastructure
) {
  const quantity =
    infrastructure.nodes.reduce(
      (total, node) =>
        total +
        node.reservedCloudlets,
      0
    );

  const pricePerCloudlet =
    getTierPrice(
      quantity,
      PRICING.reservedCloudlets
    );

  return {
    quantity,

    pricePerCloudlet,

    total:
      quantity *
      pricePerCloudlet,
  };
}

function calculateDynamicMaximum(
  infrastructure: Infrastructure
) {
  const quantity =
    infrastructure.nodes.reduce(
      (total, node) =>
        total +
        node.dynamicCloudlets,
      0
    );

  const pricePerCloudlet =
    getTierPrice(
      quantity,
      PRICING.dynamicCloudlets
    );

  return {
    quantity,

    pricePerCloudlet,

    total:
      quantity *
      pricePerCloudlet,
  };
}

function calculateStorageMaximum(
  infrastructure: Infrastructure
) {
  const quantity =
    infrastructure.nodes.reduce(
      (total, node) =>
        total +
        node.storageGB,
      0
    );

  return {
    quantity,

    pricePerGB:
      PRICING.storage.hourly,

    total:
      quantity *
      PRICING.storage.hourly,
  };
}

function calculateIPv4(
  infrastructure: Infrastructure
) {
  const quantity =
    infrastructure.nodes.filter(
      (node) =>
        node.ipv4
    ).length;

  return {
    quantity,

    total:
      quantity *
      PRICING.ipv4.hourly,
  };
}

function calculateIPv6(
  infrastructure: Infrastructure
) {
  const quantity =
    infrastructure.nodes.filter(
      (node) =>
        node.ipv6
    ).length;

  return {
    quantity,

    total:
      quantity *
      PRICING.ipv6.hourly,
  };
}

function convertHourly(
  hourly: number
) {
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

export function calculatePrice(
  infrastructure: Infrastructure
): PriceResult {
  const reserved =
    calculateReserved(
      infrastructure
    );

  const dynamic =
    calculateDynamicMaximum(
      infrastructure
    );

  const storage =
    calculateStorageMaximum(
      infrastructure
    );

  const ipv4 =
    calculateIPv4(
      infrastructure
    );

  const ipv6 =
    calculateIPv6(
      infrastructure
    );

  /*
   * DE:
   *
   * Cloudlets reservados
   * +
   * IPv4
   * +
   * IPv6
   *
   * Recursos dinâmicos e storage
   * podem ter consumo zero.
   */

  const minimumHourly =
    reserved.total +
    ipv4.total +
    ipv6.total;

  /*
   * PARA:
   *
   * Cloudlets reservados
   * +
   * todos os cloudlets dinâmicos
   * configurados
   * +
   * todo o storage configurado
   * +
   * IPv4
   * +
   * IPv6
   */

  const maximumHourly =
    reserved.total +
    dynamic.total +
    storage.total +
    ipv4.total +
    ipv6.total;

  return {
    minimum:
      convertHourly(
        minimumHourly
      ),

    maximum:
      convertHourly(
        maximumHourly
      ),

    reservedUnitPrice:
      reserved.pricePerCloudlet,

    dynamicUnitPrice:
      dynamic.pricePerCloudlet,

    breakdown: {
      minimum: {
        reserved:
          reserved.total,

        dynamic: 0,

        storage: 0,

        ipv4:
          ipv4.total,

        ipv6:
          ipv6.total,
      },

      maximum: {
        reserved:
          reserved.total,

        dynamic:
          dynamic.total,

        storage:
          storage.total,

        ipv4:
          ipv4.total,

        ipv6:
          ipv6.total,
      },
    },

    quantities: {
      reserved:
        reserved.quantity,

      dynamicMaximum:
        dynamic.quantity,

      storageMaximum:
        storage.quantity,

      ipv4:
        ipv4.quantity,

      ipv6:
        ipv6.quantity,
    },
  };
}