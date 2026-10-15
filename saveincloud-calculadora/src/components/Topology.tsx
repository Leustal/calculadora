import type {
  Topology as TopologyType,
  NodeConfig,
} from '../types/topology';

import NodeCard from './NodeCard';

interface TopologyProps {
  topology: TopologyType;

  reservedCloudletPrice: number;

  onUpdateNode: (
    node: NodeConfig
  ) => void;

  onRemoveNode: (
    type: keyof TopologyType,
    id: string
  ) => void;

  onAddNode: (
    type:
      | 'apache'
      | 'mariadb'
  ) => void;
}

export default function Topology({
  topology,
  reservedCloudletPrice,
  onUpdateNode,
  onRemoveNode,
  onAddNode,
}: TopologyProps) {
  return (
    <div className="topology">
      <section className="layer">
        <div className="layer-header">
          <div>
            <span className="layer-number">
              01
            </span>

            <div>
              <h2>
                NGINX
              </h2>

              <p>
                Load Balancer
              </p>
            </div>
          </div>
        </div>

        <div className="nodes">
          {topology.nginx.map(
            (node) => (
              <NodeCard
                key={node.id}
                node={node}
                canRemove={false}
                reservedCloudletPrice={
                  reservedCloudletPrice
                }
                onUpdate={
                  onUpdateNode
                }
                onRemove={(
                  id
                ) =>
                  onRemoveNode(
                    'nginx',
                    id
                  )
                }
              />
            )
          )}
        </div>
      </section>

      <div className="connection">
        ↓
      </div>

      <section className="layer">
        <div className="layer-header">
          <div>
            <span className="layer-number">
              02
            </span>

            <div>
              <h2>
                APACHE + PHP
              </h2>

              <p>
                Application Servers
              </p>
            </div>
          </div>

          <button
            className="add-button"
            onClick={() =>
              onAddNode(
                'apache'
              )
            }
          >
            + Adicionar node
          </button>
        </div>

        <div className="nodes">
          {topology.apache.map(
            (node) => (
              <NodeCard
                key={node.id}
                node={node}
                canRemove={
                  topology.apache
                    .length > 1
                }
                reservedCloudletPrice={
                  reservedCloudletPrice
                }
                onUpdate={
                  onUpdateNode
                }
                onRemove={(
                  id
                ) =>
                  onRemoveNode(
                    'apache',
                    id
                  )
                }
              />
            )
          )}
        </div>
      </section>

      <div className="connection">
        ↓
      </div>

      <section className="layer">
        <div className="layer-header">
          <div>
            <span className="layer-number">
              03
            </span>

            <div>
              <h2>
                MARIADB
              </h2>

              <p>
                Database Server
              </p>
            </div>
          </div>

          <button
            className="add-button"
            onClick={() =>
              onAddNode(
                'mariadb'
              )
            }
          >
            + Adicionar node
          </button>
        </div>

        <div className="nodes">
          {topology.mariadb.map(
            (node) => (
              <NodeCard
                key={node.id}
                node={node}
                canRemove={
                  topology.mariadb
                    .length > 1
                }
                reservedCloudletPrice={
                  reservedCloudletPrice
                }
                onUpdate={
                  onUpdateNode
                }
                onRemove={(
                  id
                ) =>
                  onRemoveNode(
                    'mariadb',
                    id
                  )
                }
              />
            )
          )}
        </div>
      </section>
    </div>
  );
}