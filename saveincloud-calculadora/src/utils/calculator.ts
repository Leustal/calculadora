import {
  PRICING,
  HOURS_PER_DAY,
  HOURS_PER_MONTH,
} from '../data/pricing';

import type {
  Infrastructure,
  PriceResult,
} from '../types/infrastructure';

function getTierPrice(
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

  const tier =
    tiers.find(
      (item) =>
        quantity >= item.min &&
        quantity <= item.max
    );

  return (
    tier?.price ??
    tiers[
      tiers.length - 1
    ].price
  );
}

function getStoragePrice(
  storageGB: number
) {
  return (
    storageGB *
    PRICING.storage.hourly
  );
}

export function calculatePrice(
  infrastructure: Infrastructure
): PriceResult {
  const nodes =
    infrastructure.nodes;

  const reservedCloudlets =
    nodes.reduce(
      (
        total,
        node
      ) =>
        total +
        node.reservedCloudlets,
      0
    );

  const dynamicMaximum =
    nodes.reduce(
      (
        total,
        node
      ) =>
        total +
        node.dynamicCloudlets,
      0
    );

  const storageMaximum =
    nodes.reduce(
      (
        total,
        node
      ) =>
        total +
        node.storageGB,
      0
    );

  const ipv4 =
    nodes.filter(
      (node) =>
        node.ipv4
    ).length;

  const ipv6 =
    nodes.filter(
      (node) =>
        node.ipv6
    ).length;

  const reservedUnitPrice =
    getTierPrice(
      reservedCloudlets,
      PRICING.reservedCloudlets
    );

  const dynamicUnitPrice =
    getTierPrice(
      dynamicMaximum,
      PRICING.dynamicCloudlets
    );

  const reservedHourly =
    reservedCloudlets *
    reservedUnitPrice;

  const dynamicMinimumHourly =
    0;

  const dynamicMaximumHourly =
    dynamicMaximum *
    dynamicUnitPrice;

  const storageHourly =
    getStoragePrice(
      storageMaximum
    );

  const ipv4Hourly =
    ipv4 *
    PRICING.ipv4.hourly;

  const ipv6Hourly =
    ipv6 *
    PRICING.ipv6.hourly;

  const minimumHourly =
    reservedHourly +
    dynamicMinimumHourly +
    ipv4Hourly +
    ipv6Hourly;

  const maximumHourly =
    reservedHourly +
    dynamicMaximumHourly +
    storageHourly +
    ipv4Hourly +
    ipv6Hourly;

  return {
    minimum: {
      hourly:
        minimumHourly,
      daily:
        minimumHourly *
        HOURS_PER_DAY,
      monthly:
        minimumHourly *
        HOURS_PER_MONTH,
    },

    maximum: {
      hourly:
        maximumHourly,
      daily:
        maximumHourly *
        HOURS_PER_DAY,
      monthly:
        maximumHourly *
        HOURS_PER_MONTH,
    },

    reservedUnitPrice,

    dynamicUnitPrice,

    breakdown: {
      minimum: {
        reserved:
          reservedHourly,
        dynamic:
          dynamicMinimumHourly,
        storage: 0,
        ipv4:
          ipv4Hourly,
        ipv6:
          ipv6Hourly,
      },

      maximum: {
        reserved:
          reservedHourly,
        dynamic:
          dynamicMaximumHourly,
        storage:
          storageHourly,
        ipv4:
          ipv4Hourly,
        ipv6:
          ipv6Hourly,
      },
    },

    quantities: {
      reserved:
        reservedCloudlets,
      dynamicMaximum,
      storageMaximum,
      ipv4,
      ipv6,
    },
  };
}