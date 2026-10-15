import type { NodeConfig } from '../types/topology';

import {
  formatRAM,
  formatCPU,
} from '../utils/cloudlets';

interface NodeCardProps {
  node: NodeConfig;
  canRemove: boolean;
  reservedCloudletPrice: number;
  onUpdate: (node: NodeConfig) => void;
  onRemove: (id: string) => void;
}

function formatBRL(
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

function CloudletCapacity({
  cloudlets,
}: {
  cloudlets: number;
}) {
  if (cloudlets <= 0) {
    return null;
  }

  return (
    <div className="cloudlet-capacity">
      <div className="cloudlet-capacity-title">
        Capacidade correspondente
      </div>

      <div className="cloudlet-capacity-values">
        <span>
          <strong>
            {formatRAM(
              cloudlets
            )}
          </strong>

          <small>
            RAM
          </small>
        </span>

        <span>
          <strong>
            {formatCPU(
              cloudlets
            )}
          </strong>

          <small>
            CPU
          </small>
        </span>
      </div>
    </div>
  );
}

export default function NodeCard({
  node,
  canRemove,
  reservedCloudletPrice,
  onUpdate,
  onRemove,
}: NodeCardProps) {
  const update = (
    changes: Partial<NodeConfig>
  ) => {
    onUpdate({
      ...node,
      ...changes,
    });
  };

  const reservedTotal =
    node.reservedCloudlets *
    reservedCloudletPrice;

  return (
    <div className="node-card">
      <div className="node-header">
        <div>
          <h3>
            {node.name}
          </h3>

          <span className="node-type">
            {node.type === 'nginx'
              ? 'NGINX'
              : node.type === 'apache'
              ? 'Apache + PHP'
              : 'MariaDB'}
          </span>
        </div>

        {canRemove && (
          <button
            className="remove-button"
            onClick={() =>
              onRemove(
                node.id
              )
            }
          >
            Remover
          </button>
        )}
      </div>

      {/* CLOUDLETS RESERVADOS */}

      <div className="field">
        <label>
          Cloudlets reservados
        </label>

        <input
          type="number"
          min="0"
          max="256"
          value={
            node.reservedCloudlets
          }
          onChange={(e) =>
            update({
              reservedCloudlets:
                Math.max(
                  0,
                  Math.min(
                    256,
                    Number(
                      e.target.value
                    )
                  )
                ),
            })
          }
        />

        <small>
          1 Cloudlet = 128 MiB RAM +
          400 MHz CPU
        </small>
      </div>

      {node.reservedCloudlets >
        0 && (
        <>
          <CloudletCapacity
            cloudlets={
              node.reservedCloudlets
            }
          />

          <div className="resource-price">
            <span>
              Valor por cloudlet
            </span>

            <strong>
              {formatBRL(
                reservedCloudletPrice
              )}{' '}
              / hora
            </strong>
          </div>

          <div className="resource-price">
            <span>
              Total reservado
            </span>

            <strong>
              {formatBRL(
                reservedTotal
              )}{' '}
              / hora
            </strong>
          </div>
        </>
      )}

      {/* LIMITE DE ESCALA */}

      <div className="field">
        <label>
          Limite de escala
        </label>

        <input
          type="number"
          min="0"
          max="256"
          value={
            node.dynamicCloudlets
          }
          onChange={(e) =>
            update({
              dynamicCloudlets:
                Math.max(
                  0,
                  Math.min(
                    256,
                    Number(
                      e.target.value
                    )
                  )
                ),
            })
          }
        />

        <small>
          Limite máximo de
          cloudlets dinâmicos que
          este node poderá utilizar.
        </small>
      </div>

      {node.dynamicCloudlets >
        0 && (
        <CloudletCapacity
          cloudlets={
            node.dynamicCloudlets
          }
        />
      )}

      {/* LIMITE DE DISCO */}

      <div className="field">
        <label>
          Limite de disco
        </label>

        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={
            node.storageGB
          }
          onChange={(e) =>
            update({
              storageGB:
                Math.max(
                  0,
                  Math.min(
                    100,
                    Number(
                      e.target.value
                    )
                  )
                ),
            })
          }
        />

        <small>
          Capacidade máxima de
          armazenamento disponível
          para este node.
        </small>
      </div>

      {/* IPs PÚBLICOS */}

      <div className="checkbox-field">
        <label>
          <input
            type="checkbox"
            checked={
              node.ipv4
            }
            onChange={(e) =>
              update({
                ipv4:
                  e.target.checked,
              })
            }
          />

          IPv4 público
        </label>
      </div>

      <div className="checkbox-field">
        <label>
          <input
            type="checkbox"
            checked={
              node.ipv6
            }
            onChange={(e) =>
              update({
                ipv6:
                  e.target.checked,
              })
            }
          />

          IPv6 público
        </label>
      </div>
    </div>
  );
}