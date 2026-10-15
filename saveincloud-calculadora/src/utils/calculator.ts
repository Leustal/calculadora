import type {
  ConsumptionEstimate,
  NodeConfig,
  Topology,
} from '../types/topology';

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

function getAllNodes(
  topology: Topology
): NodeConfig[] {
  return [
    ...topology.nginx,
    ...topology.apache,
    ...topology.mariadb,
  ];
}

function calculateReservedCloudlets(
  topology: Topology
) {
  const totalCloudlets =
    getAllNodes(topology).reduce(
      (total, node) =>
        total +
        node.reservedCloudlets,
      0
    );

  const pricePerCloudlet =
    getTierPrice(
      totalCloudlets,
      PRICING.reservedCloudlets
    );

  return {
    quantity: totalCloudlets,
    pricePerCloudlet,
    total:
      totalCloudlets *
      pricePerCloudlet,
  };
}

function calculateDynamicCloudlets(
  consumption: ConsumptionEstimate
) {
  const totalUsedCloudlets =
    consumption.dynamicCloudletsUsed;

  const pricePerCloudlet =
    getTierPrice(
      totalUsedCloudlets,
      PRICING.dynamicCloudlets
    );

  return {
    quantity:
      totalUsedCloudlets,

    pricePerCloudlet,

    total:
      totalUsedCloudlets *
      pricePerCloudlet,
  };
}

function calculateStorage(
  consumption: ConsumptionEstimate
) {
  const totalUsedStorage =
    consumption.storageGBUsed;

  return {
    quantity:
      totalUsedStorage,

    pricePerGB:
      PRICING.storage.hourly,

    total:
      totalUsedStorage *
      PRICING.storage.hourly,
  };
}

function calculateIPv4(
  topology: Topology
) {
  const totalIPv4 =
    getAllNodes(topology).filter(
      (node) =>
        node.ipv4
    ).length;

  return (
    totalIPv4 *
    PRICING.ipv4.hourly
  );
}

function calculateIPv6(
  topology: Topology
) {
  const totalIPv6 =
    getAllNodes(topology).filter(
      (node) =>
        node.ipv6
    ).length;

  return (
    totalIPv6 *
    PRICING.ipv6.hourly
  );
}

export function calculatePrice(
  topology: Topology,
  consumption: ConsumptionEstimate
) {
  const reserved =
    calculateReservedCloudlets(
      topology
    );

  const dynamic =
    calculateDynamicCloudlets(
      consumption
    );

  const storage =
    calculateStorage(
      consumption
    );

  const ipv4 =
    calculateIPv4(
      topology
    );

  const ipv6 =
    calculateIPv6(
      topology
    );

  const hourly =
    reserved.total +
    dynamic.total +
    storage.total +
    ipv4 +
    ipv6;

  return {
    hourly,

    daily:
      hourly *
      HOURS_PER_DAY,

    monthly:
      hourly *
      HOURS_PER_MONTH,

    reservedUnitPrice:
      reserved.pricePerCloudlet,

    dynamicUnitPrice:
      dynamic.pricePerCloudlet,

    breakdown: {
      reserved:
        reserved.total,

      dynamic:
        dynamic.total,

      storage:
        storage.total,

      ipv4,

      ipv6,
    },

    quantities: {
      reserved:
        reserved.quantity,

      dynamic:
        dynamic.quantity,

      storage:
        storage.quantity,
    },
  };
}