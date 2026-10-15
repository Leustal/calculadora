import type {
  CSSProperties,
} from 'react';

import type {
  NodeConfig,
} from '../types/infrastructure';

import {
  getStackById,
  getStackTheme,
} from '../data/stacks';

import {
  formatCPU,
  formatRAM,
} from '../utils/cloudlets';

interface NodeCardProps {
  node: NodeConfig;
  reservedCloudletPrice: number;
  dynamicCloudletPrice: number;
  onUpdate: (
    node: NodeConfig
  ) => void;
  onRemove: (
    id: string
  ) => void;
}

export default function NodeCard({
  node,
  reservedCloudletPrice,
  dynamicCloudletPrice,
  onUpdate,
  onRemove,
}: NodeCardProps) {
  const stack = getStackById(
    node.stackId
  );

  const theme = getStackTheme(
    node.stackId
  );

  const stackStyle = {
    '--stack-color':
      theme.color,
    '--stack-background':
      theme.background,
    '--stack-border':
      theme.border,
    '--stack-dark-background':
      theme.darkBackground,
  } as CSSProperties;

  const reservedRAM =
    formatRAM(
      node.reservedCloudlets
    );

  const reservedCPU =
    formatCPU(
      node.reservedCloudlets
    );

  const dynamicRAM =
    formatRAM(
      node.dynamicCloudlets
    );

  const dynamicCPU =
    formatCPU(
      node.dynamicCloudlets
    );

  const dynamicPrice =
    dynamicCloudletPrice *
    node.dynamicCloudlets;

  const handleReservedChange = (
    value: number
  ) => {
    if (!Number.isFinite(value)) {
      return;
    }

    const safeValue =
      Math.max(
        1,
        Math.min(
          256,
          value
        )
      );

    onUpdate({
      ...node,
      reservedCloudlets:
        safeValue,
    });
  };

  const handleDynamicChange = (
    value: number
  ) => {
    if (!Number.isFinite(value)) {
      return;
    }

    const safeValue =
      Math.max(
        0,
        Math.min(
          256,
          value
        )
      );

    onUpdate({
      ...node,
      dynamicCloudlets:
        safeValue,
    });
  };

  const handleStorageChange = (
    value: number
  ) => {
    if (!Number.isFinite(value)) {
      return;
    }

    const safeValue =
      Math.max(
        0,
        Math.min(
          100,
          value
        )
      );

    onUpdate({
      ...node,
      storageGB: safeValue,
    });
  };

  return (
    <article
      className="node-card"
      style={stackStyle}
    >

      <div className="node-card-header">

        <div className="node-card-identity">

          <div className="node-stack-icon">
            {stack?.name
              ?.charAt(0)
              .toUpperCase() ??
              'N'}
          </div>

          <div className="node-card-title">

            <span className="node-card-stack">
              {stack?.name ??
                node.stackId}
            </span>

            <h3>
              {node.name}
            </h3>

          </div>

        </div>

        <button
          type="button"
          className="node-card-remove"
          onClick={() =>
            onRemove(node.id)
          }
          aria-label="Remover node"
          title="Remover node"
        >
          ×
        </button>

      </div>

      <div className="node-resources">

        <div className="node-resource">

          <span className="node-resource-label">
            Reservados
          </span>

          <strong>
            {node.reservedCloudlets}
            {' '}
            <small>
              cloudlets
            </small>
          </strong>

          <span className="node-resource-capacity">
            {reservedRAM}
            {' RAM · '}
            {reservedCPU}
            {' CPU'}
          </span>

        </div>

        <div className="node-resource">

          <span className="node-resource-label">
            Dinâmicos
          </span>

          <strong>
            {node.dynamicCloudlets}
            {' '}
            <small>
              cloudlets
            </small>
          </strong>

          <span className="node-resource-capacity">
            até {dynamicRAM}
            {' · '}
            {dynamicCPU}
          </span>

        </div>

      </div>

      <div className="node-card-section">

        <div className="node-card-section-title">
          Recursos
        </div>

        <div className="node-config-row">

          <div className="node-config-info">

            <label
              htmlFor={`${node.id}-reserved`}
            >
              Cloudlets reservados
            </label>

            <span>
              Recursos garantidos para
              este node.
            </span>

          </div>

          <div className="node-input-with-unit">

            <input
              id={`${node.id}-reserved`}
              type="number"
              min={1}
              max={256}
              value={
                node.reservedCloudlets
              }
              onChange={(event) =>
                handleReservedChange(
                  Number(
                    event.target.value
                  )
                )
              }
            />

            <span>
              cloudlets
            </span>

          </div>

        </div>

        <div className="node-capacity">

          <div>
            <span>
              RAM
            </span>

            <strong>
              {reservedRAM}
            </strong>
          </div>

          <div>
            <span>
              CPU
            </span>

            <strong>
              {reservedCPU}
            </strong>
          </div>

          <div className="node-price">

            <span>
              Reservado
            </span>

            <strong>
              R${' '}
              {reservedCloudletPrice.toFixed(
                3
              )}
              /h
            </strong>

          </div>

        </div>

        <div className="node-config-row">

          <div className="node-config-info">

            <label
              htmlFor={`${node.id}-dynamic`}
            >
              Limite de escala
            </label>

            <span>
              Máximo de cloudlets
              dinâmicos que este node
              poderá utilizar.
            </span>

          </div>

          <div className="node-input-with-unit">

            <input
              id={`${node.id}-dynamic`}
              type="number"
              min={0}
              max={256}
              value={
                node.dynamicCloudlets
              }
              onChange={(event) =>
                handleDynamicChange(
                  Number(
                    event.target.value
                  )
                )
              }
            />

            <span>
              cloudlets
            </span>

          </div>

        </div>

        <div className="node-capacity">

          <div>
            <span>
              RAM máxima
            </span>

            <strong>
              {dynamicRAM}
            </strong>
          </div>

          <div>
            <span>
              CPU máxima
            </span>

            <strong>
              {dynamicCPU}
            </strong>
          </div>

          <div className="node-price">

            <span>
              Uso máximo
            </span>

            <strong>
              R${' '}
              {dynamicPrice.toFixed(
                3
              )}
              /h
            </strong>

          </div>

        </div>

        <div className="node-config-row">

          <div className="node-config-info">

            <label
              htmlFor={`${node.id}-storage`}
            >
              Limite de disco
            </label>

            <span>
              Capacidade máxima de
              armazenamento deste node.
            </span>

          </div>

          <div className="node-input-with-unit">

            <input
              id={`${node.id}-storage`}
              type="number"
              min={0}
              max={100}
              value={
                node.storageGB
              }
              onChange={(event) =>
                handleStorageChange(
                  Number(
                    event.target.value
                  )
                )
              }
            />

            <span>
              GB
            </span>

          </div>

        </div>

        <div className="node-storage-info">

          <div>
            <span>
              Storage
            </span>

            <strong>
              R$ 0,001/GB/h
            </strong>
          </div>

          <span>
            Cobrança pelo armazenamento
            efetivamente utilizado.
          </span>

        </div>

      </div>

      <div className="node-card-section">

        <div className="node-card-section-title">
          Rede pública
        </div>

        <div className="node-options">

          <label
            className={
              node.ipv4
                ? 'node-toggle active'
                : 'node-toggle'
            }
          >

            <input
              type="checkbox"
              checked={node.ipv4}
              onChange={(event) =>
                onUpdate({
                  ...node,
                  ipv4:
                    event.target
                      .checked,
                })
              }
            />

            <span className="node-toggle-check">
              {node.ipv4
                ? '✓'
                : ''}
            </span>

            <span>
              IPv4 público
            </span>

          </label>

          <label
            className={
              node.ipv6
                ? 'node-toggle active'
                : 'node-toggle'
            }
          >

            <input
              type="checkbox"
              checked={node.ipv6}
              onChange={(event) =>
                onUpdate({
                  ...node,
                  ipv6:
                    event.target
                      .checked,
                })
              }
            />

            <span className="node-toggle-check">
              {node.ipv6
                ? '✓'
                : ''}
            </span>

            <span>
              IPv6 público
            </span>

          </label>

        </div>

      </div>

    </article>
  );
}