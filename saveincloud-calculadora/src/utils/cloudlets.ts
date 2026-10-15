const RAM_PER_CLOUDLET_MIB = 128;
const CPU_PER_CLOUDLET_MHZ = 400;

export function calculateCloudletRAM(
  cloudlets: number
) {
  return (
    cloudlets *
    RAM_PER_CLOUDLET_MIB
  );
}

export function calculateCloudletCPU(
  cloudlets: number
) {
  return (
    cloudlets *
    CPU_PER_CLOUDLET_MHZ
  );
}

export function formatRAM(
  cloudlets: number
) {
  const ramMiB =
    calculateCloudletRAM(
      cloudlets
    );

  if (ramMiB >= 1024) {
    const ramGiB =
      ramMiB / 1024;

    return `${formatNumber(
      ramGiB
    )} GiB`;
  }

  return `${formatNumber(
    ramMiB
  )} MiB`;
}

export function formatCPU(
  cloudlets: number
) {
  const cpuMHz =
    calculateCloudletCPU(
      cloudlets
    );

  if (cpuMHz >= 1000) {
    const cpuGHz =
      cpuMHz / 1000;

    return `${formatNumber(
      cpuGHz
    )} GHz`;
  }

  return `${formatNumber(
    cpuMHz
  )} MHz`;
}

function formatNumber(
  value: number
) {
  return value.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2,
    }
  );
}