import type {
  ConsumptionEstimate,
  Topology,
} from '../types/topology';

import {
  formatRAM,
  formatCPU,
} from '../utils/cloudlets';

interface ConsumptionEstimateProps {
  topology: Topology;

  consumption: ConsumptionEstimate;

  dynamicCloudletPrice: number;

  onChange: (
    consumption: ConsumptionEstimate
  ) => void;
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

export default function ConsumptionEstimate({
  topology,
  consumption,
  dynamicCloudletPrice,
  onChange,
}: ConsumptionEstimateProps) {
  const allNodes = [
    ...topology.nginx,
    ...topology.apache,
    ...topology.mariadb,
  ];

  const maxDynamicCloudlets =
    allNodes.reduce(
      (total, node) =>
        total +
        node.dynamicCloudlets,
      0
    );

  const maxStorageGB =
    allNodes.reduce(
      (total, node) =>
        total +
        node.storageGB,
      0
    );

  const dynamicTotal =
    consumption.dynamicCloudletsUsed *
    dynamicCloudletPrice;

  const storageTotal =
    consumption.storageGBUsed *
    0.001;

  const updateDynamic =
    (value: number) => {
      onChange({
        ...consumption,

        dynamicCloudletsUsed:
          Math.max(
            0,
            Math.min(
              maxDynamicCloudlets,
              value
            )
          ),
      });
    };

  const updateStorage =
    (value: number) => {
      onChange({
        ...consumption,

        storageGBUsed:
          Math.max(
            0,
            Math.min(
              maxStorageGB,
              value
            )
          ),
      });
    };

  return (
    <section className="consumption-estimate">
      <div className="consumption-header">
        <div>
          <span className="eyebrow">
            SIMULAÇÃO DE CONSUMO
          </span>

          <h2>
            Estime o uso do ambiente
          </h2>

          <p>
            Informe uma média de consumo
            para projetar quanto o ambiente
            poderá custar por hora.
          </p>
        </div>
      </div>

      <div className="consumption-grid">
        <div className="consumption-card">
          <div className="consumption-card-header">
            <div>
              <h3>
                Cloudlets dinâmicos
              </h3>

              <p>
                Uso estimado por hora
              </p>
            </div>
          </div>

          <div className="field">
            <label>
              Cloudlets utilizados
            </label>

            <input
              type="number"
              min="0"
              max={
                maxDynamicCloudlets
              }
              value={
                consumption.dynamicCloudletsUsed
              }
              onChange={(e) =>
                updateDynamic(
                  Number(
                    e.target.value
                  )
                )
              }
            />

            <small>
              Máximo disponível na
              configuração atual:{' '}
              <strong>
                {maxDynamicCloudlets}
              </strong>{' '}
              cloudlets.
            </small>
          </div>

          {consumption.dynamicCloudletsUsed >
            0 && (
            <div className="consumption-capacity">
              <div>
                <strong>
                  {formatRAM(
                    consumption.dynamicCloudletsUsed
                  )}
                </strong>

                <span>
                  RAM
                </span>
              </div>

              <div>
                <strong>
                  {formatCPU(
                    consumption.dynamicCloudletsUsed
                  )}
                </strong>

                <span>
                  CPU
                </span>
              </div>
            </div>
          )}

          <div className="resource-price">
            <span>
              Valor por cloudlet
            </span>

            <strong>
              {formatBRL(
                dynamicCloudletPrice
              )}{' '}
              / hora
            </strong>
          </div>

          <div className="resource-price">
            <span>
              Consumo estimado
            </span>

            <strong>
              {formatBRL(
                dynamicTotal
              )}{' '}
              / hora
            </strong>
          </div>
        </div>

        <div className="consumption-card">
          <div className="consumption-card-header">
            <div>
              <h3>
                Storage
              </h3>

              <p>
                Espaço efetivamente utilizado
              </p>
            </div>
          </div>

          <div className="field">
            <label>
              Uso estimado
            </label>

            <div className="input-with-unit">
              <input
                type="number"
                min="0"
                max={
                  maxStorageGB
                }
                step="0.1"
                value={
                  consumption.storageGBUsed
                }
                onChange={(e) =>
                  updateStorage(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <span>
                GB
              </span>
            </div>

            <small>
              Capacidade configurada
              disponível:{' '}
              <strong>
                {maxStorageGB}
              </strong>{' '}
              GB.
            </small>
          </div>

          <div className="resource-price">
            <span>
              Valor por GB
            </span>

            <strong>
              R$ 0,001 / hora
            </strong>
          </div>

          <div className="resource-price">
            <span>
              Consumo estimado
            </span>

            <strong>
              {formatBRL(
                storageTotal
              )}{' '}
              / hora
            </strong>
          </div>
        </div>
      </div>

      <div className="consumption-note">
        <strong>
          Importante:
        </strong>{' '}
        a capacidade configurada no
        ambiente representa o limite
        disponível. A cobrança considera
        somente os recursos efetivamente
        utilizados em cada hora.
      </div>
    </section>
  );
}