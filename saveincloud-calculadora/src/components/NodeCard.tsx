import {
  useMemo,
} from 'react';

import {
  getStackById,
  getStackTheme,
} from '../data/stacks';

import type {
  NodeConfig,
} from '../types/infrastructure';

import {
  formatCPU,
  formatRAM,
} from '../utils/cloudlets';

import {
  LIMITS,
} from '../data/limits';

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

function formatCurrency(
  value: number
) {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }
  );
}

export default function NodeCard({
  node,
  reservedCloudletPrice,
  dynamicCloudletPrice,
  onUpdate,
  onRemove,
}: NodeCardProps) {
  const stack = useMemo(
    () =>
      getStackById(
        node.stackId
      ),
    [
      node.stackId,
    ]
  );

  const theme = useMemo(
    () =>
      getStackTheme(
        node.stackId
      ),
    [
      node.stackId,
    ]
  );

  const reservedCost =
    node.reservedCloudlets *
    reservedCloudletPrice;

  const dynamicCost =
    node.dynamicCloudlets *
    dynamicCloudletPrice;

  const updateNumber = (
    field:
      | 'reservedCloudlets'
      | 'dynamicCloudlets'
      | 'storageGB',
    value: string
  ) => {
    const numericValue =
      Number(value);

    if (
      !Number.isFinite(
        numericValue
      )
    ) {
      return;
    }

    let finalValue =
      Math.floor(
        numericValue
      );

    if (
      field ===
      'reservedCloudlets'
    ) {
      finalValue =
        Math.max(
          1,
          Math.min(
            LIMITS.maxCloudletsPerNode,
            finalValue
          )
        );
    }

    if (
      field ===
      'dynamicCloudlets'
    ) {
      finalValue =
        Math.max(
          0,
          Math.min(
            LIMITS.maxCloudletsPerNode,
            finalValue
          )
        );
    }

    if (
      field ===
      'storageGB'
    ) {
      finalValue =
        Math.max(
          0,
          Math.min(
            LIMITS.maxStoragePerNodeGB,
            finalValue
          )
        );
    }

    onUpdate({
      ...node,
      [field]:
        finalValue,
    });
  };

  const updateBoolean = (
    field:
      | 'ipv4'
      | 'ipv6'
  ) => {
    onUpdate({
      ...node,
      [field]:
        !node[field],
    });
  };

  return (
    <article
      className="node-card"
      style={
        {
          '--stack-color':
            theme.color,
          '--stack-background':
            theme.background,
          '--stack-border':
            theme.border,
          '--stack-dark-background':
            theme.darkBackground,
        } as React.CSSProperties
      }
    >
      <div
        className="node-card-header"
      >
        <div className="node-identity">
          <div
            className="node-stack-icon"
          >
            {stack?.name
              ?.charAt(0)
              .toUpperCase() ??
              '?'}
          </div>

          <div>
            <span className="node-stack-name">
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
          className="remove-node-button"
          onClick={() =>
            onRemove(
              node.id
            )
          }
        >
          Remover
        </button>
      </div>

      <div className="node-summary">
        <div className="summary-resource reserved">
          <span className="summary-label">
            Reservados
          </span>

          <strong>
            {node.reservedCloudlets}
          </strong>

          <span>
            cloudlets
          </span>

          <small>
            {formatRAM(
              node.reservedCloudlets
            )}{' '}
            RAM ·{' '}
            {formatCPU(
              node.reservedCloudlets
            )}{' '}
            CPU
          </small>
        </div>

        <div className="summary-resource dynamic">
          <span className="summary-label">
            Dinâmicos
          </span>

          <strong>
            {node.dynamicCloudlets}
          </strong>

          <span>
            cloudlets
          </span>

          <small>
            até{' '}
            {formatRAM(
              node.dynamicCloudlets
            )}{' '}
            ·{' '}
            {formatCPU(
              node.dynamicCloudlets
            )}
          </small>
        </div>
      </div>

      <div className="node-section">
        <div className="node-section-heading">
          <span>
            RECURSOS
          </span>
        </div>

        <div className="resource-grid">
          <div className="resource-field">
            <div className="field-heading">
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

            <div className="number-control">
              <input
                id={`${node.id}-reserved`}
                type="number"
                min={1}
                max={
                  LIMITS.maxCloudletsPerNode
                }
                value={
                  node.reservedCloudlets
                }
                onChange={(event) =>
                  updateNumber(
                    'reservedCloudlets',
                    event.target.value
                  )
                }
              />

              <span>
                cloudlets
              </span>
            </div>

            <div className="capacity-row">
              <div>
                <span>
                  RAM
                </span>

                <strong>
                  {formatRAM(
                    node.reservedCloudlets
                  )}
                </strong>
              </div>

              <div>
                <span>
                  CPU
                </span>

                <strong>
                  {formatCPU(
                    node.reservedCloudlets
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Custo reservado
                </span>

                <strong>
                  {formatCurrency(
                    reservedCost
                  )}
                  /h
                </strong>
              </div>
            </div>
          </div>

          <div className="resource-field">
            <div className="field-heading">
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

            <div className="number-control">
              <input
                id={`${node.id}-dynamic`}
                type="number"
                min={0}
                max={
                  LIMITS.maxCloudletsPerNode
                }
                value={
                  node.dynamicCloudlets
                }
                onChange={(event) =>
                  updateNumber(
                    'dynamicCloudlets',
                    event.target.value
                  )
                }
              />

              <span>
                cloudlets
              </span>
            </div>

            <div className="capacity-row">
              <div>
                <span>
                  RAM máxima
                </span>

                <strong>
                  {formatRAM(
                    node.dynamicCloudlets
                  )}
                </strong>
              </div>

              <div>
                <span>
                  CPU máxima
                </span>

                <strong>
                  {formatCPU(
                    node.dynamicCloudlets
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Uso máximo
                </span>

                <strong>
                  {formatCurrency(
                    dynamicCost
                  )}
                  /h
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="node-section">
        <div className="node-section-heading">
          <span>
            ARMAZENAMENTO
          </span>
        </div>

        <div className="storage-field">
          <div className="field-heading">
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

          <div className="storage-control">
            <input
              id={`${node.id}-storage`}
              type="number"
              min={0}
              max={
                LIMITS.maxStoragePerNodeGB
              }
              value={
                node.storageGB
              }
              onChange={(event) =>
                updateNumber(
                  'storageGB',
                  event.target.value
                )
              }
            />

            <span>
              GB
            </span>
          </div>

          <div className="storage-info">
            <span>
              Cobrança pelo armazenamento
              efetivamente utilizado.
            </span>
          </div>
        </div>
      </div>

      <div className="node-section network-section">
        <div className="node-section-heading">
          <span>
            REDE PÚBLICA
          </span>
        </div>

        <div className="network-options">
          <label
            className={
              node.ipv4
                ? 'network-option active'
                : 'network-option'
            }
          >
            <input
              type="checkbox"
              checked={
                node.ipv4
              }
              onChange={() =>
                updateBoolean(
                  'ipv4'
                )
              }
            />

            <span className="custom-checkbox">
              {node.ipv4
                ? '✓'
                : ''}
            </span>

            <span>
              <strong>
                IPv4 público
              </strong>

              <small>
                Endereço IPv4 público
              </small>
            </span>
          </label>

          <label
            className={
              node.ipv6
                ? 'network-option active'
                : 'network-option'
            }
          >
            <input
              type="checkbox"
              checked={
                node.ipv6
              }
              onChange={() =>
                updateBoolean(
                  'ipv6'
                )
              }
            />

            <span className="custom-checkbox">
              {node.ipv6
                ? '✓'
                : ''}
            </span>

            <span>
              <strong>
                IPv6 público
              </strong>

              <small>
                Endereço IPv6 público
              </small>
            </span>
          </label>
        </div>
      </div>
    </article>
  );
}