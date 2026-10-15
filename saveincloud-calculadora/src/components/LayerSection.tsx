import type {
  LayerDefinition,
  LayerType,
} from '../data/stacks';

import type {
  NodeConfig,
} from '../types/infrastructure';

import NodeCard from './NodeCard';

interface LayerSectionProps {
  layer: LayerDefinition;
  nodes: NodeConfig[];
  reservedCloudletPrice: number;
  dynamicCloudletPrice: number;
  onAdd: (
    layer: LayerType
  ) => void;
  onUpdate: (
    node: NodeConfig
  ) => void;
  onRemove: (
    id: string
  ) => void;
}

const LAYER_NUMBERS: Record<
  LayerType,
  string
> = {
  'load-balancer':
    '01',
  application:
    '02',
  sql:
    '03',
  nosql:
    '04',
  cache:
    '05',
  storage:
    '06',
  vps:
    '07',
};

export default function LayerSection({
  layer,
  nodes,
  reservedCloudletPrice,
  dynamicCloudletPrice,
  onAdd,
  onUpdate,
  onRemove,
}: LayerSectionProps) {
  return (
    <section className="layer-section">
      <header className="layer-section-header">
        <div className="layer-title-area">
          <div className="layer-number">
            {
              LAYER_NUMBERS[
                layer.id
              ]
            }
          </div>

          <div>
            <h2>
              {layer.name}
            </h2>

            <p>
              {layer.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="add-node-button"
          onClick={() =>
            onAdd(
              layer.id
            )
          }
        >
          <span>
            +
          </span>

          Adicionar
        </button>
      </header>

      {nodes.length === 0 ? (
        <div className="empty-layer">
          <div className="empty-icon">
            +
          </div>

          <strong>
            Nenhum node configurado
          </strong>

          <span>
            Adicione uma stack para
            começar esta camada.
          </span>

          <button
            type="button"
            onClick={() =>
              onAdd(
                layer.id
              )
            }
          >
            Adicionar stack
          </button>
        </div>
      ) : (
        <div className="nodes-grid">
          {nodes.map(
            (node) => (
              <NodeCard
                key={
                  node.id
                }
                node={
                  node
                }
                reservedCloudletPrice={
                  reservedCloudletPrice
                }
                dynamicCloudletPrice={
                  dynamicCloudletPrice
                }
                onUpdate={
                  onUpdate
                }
                onRemove={
                  onRemove
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}