import {
  ArrowDown,
  Boxes,
} from 'lucide-react';

import {
  LAYERS,
  getStackById,
} from '../data/stacks';

import type {
  Infrastructure,
} from '../types/infrastructure';

interface ArchitectureDiagramProps {
  infrastructure: Infrastructure;
}

export default function ArchitectureDiagram({
  infrastructure,
}: ArchitectureDiagramProps) {
  const populatedLayers =
    LAYERS.filter(
      (layer) =>
        infrastructure.nodes.some(
          (node) =>
            node.layer === layer.id
        )
    );

  return (
    <section className="architecture-panel">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">
            VISUALIZAÇÃO
          </span>
          <h2>
            Arquitetura do ambiente
          </h2>
          <p>
            Veja como as camadas configuradas
            ficam organizadas.
          </p>
        </div>

        <Boxes
          size={22}
          strokeWidth={1.8}
        />
      </div>

      {populatedLayers.length === 0 ? (
        <div className="architecture-empty">
          <Boxes size={24} />
          <strong>
            Sua arquitetura aparecerá aqui.
          </strong>
          <span>
            Adicione pelo menos um node para
            visualizar o fluxo.
          </span>
        </div>
      ) : (
        <div className="architecture-flow">
          {populatedLayers.map(
            (layer, index) => {
              const nodes =
                infrastructure.nodes.filter(
                  (node) =>
                    node.layer ===
                    layer.id
                );

              return (
                <div
                  key={layer.id}
                  className="architecture-step"
                >
                  <div className="architecture-layer">
                    <div className="architecture-layer-number">
                      {String(
                        LAYERS.indexOf(
                          layer
                        ) + 1
                      ).padStart(2, '0')}
                    </div>

                    <div className="architecture-layer-content">
                      <strong>
                        {layer.name}
                      </strong>

                      <span>
                        {nodes.length}{' '}
                        {nodes.length === 1
                          ? 'node'
                          : 'nodes'}
                      </span>
                    </div>
                  </div>

                  <div className="architecture-nodes">
                    {nodes.map(
                      (node) => {
                        const stack =
                          getStackById(
                            node.stackId
                          );

                        return (
                          <div
                            key={
                              node.id
                            }
                            className="architecture-node"
                          >
                            <span>
                              {stack?.name ??
                                node.stackId}
                            </span>
                            <small>
                              {node.name}
                            </small>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {index <
                    populatedLayers.length -
                      1 && (
                    <div className="architecture-arrow">
                      <ArrowDown
                        size={16}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}
