import {
  useMemo,
  useState,
} from 'react';

import LayerSection from './components/LayerSection';
import PriceSummary from './components/PriceSummary';
import AddNodeModal from './components/AddNodeModal';

import {
  LAYERS,
  type LayerType,
} from './data/stacks';

import {
  calculatePrice,
} from './utils/calculator';

import type {
  Infrastructure,
  NodeConfig,
} from './types/infrastructure';

import './index.css';

function createNode(
  layer: LayerType,
  stackId: string,
  number: number
): NodeConfig {
  return {
    id: `${layer}-${stackId}-${Date.now()}-${number}`,

    layer,

    stackId,

    name: `${stackId}-${number}`,

    reservedCloudlets: 1,

    dynamicCloudlets: 4,

    storageGB: 10,

    ipv4: false,

    ipv6: false,
  };
}

function App() {
  const [
    infrastructure,
    setInfrastructure,
  ] = useState<Infrastructure>({
    nodes: [],
  });

  const [
    modalLayer,
    setModalLayer,
  ] = useState<LayerType | null>(
    null
  );

  const price = useMemo(
    () =>
      calculatePrice(
        infrastructure
      ),
    [
      infrastructure,
    ]
  );

  const addNode = (
    layer: LayerType
  ) => {
    setModalLayer(layer);
  };

  const closeModal = () => {
    setModalLayer(null);
  };

  const confirmAddNode = (
    stackId: string
  ) => {
    if (!modalLayer) {
      return;
    }

    setInfrastructure(
      (current) => {
        if (
          current.nodes.length >= 48
        ) {
          alert(
            'O ambiente atingiu o limite máximo de 48 nodes.'
          );

          return current;
        }

        const layerNodes =
          current.nodes.filter(
            (node) =>
              node.layer ===
              modalLayer
          );

        if (
          layerNodes.length >= 16
        ) {
          alert(
            'Esta camada atingiu o limite máximo de 16 nodes.'
          );

          return current;
        }

        const number =
          layerNodes.length + 1;

        const newNode =
          createNode(
            modalLayer,
            stackId,
            number
          );

        return {
          ...current,

          nodes: [
            ...current.nodes,
            newNode,
          ],
        };
      }
    );

    setModalLayer(null);
  };

  const updateNode = (
    updatedNode: NodeConfig
  ) => {
    setInfrastructure(
      (current) => ({
        ...current,

        nodes:
          current.nodes.map(
            (node) =>
              node.id ===
              updatedNode.id
                ? updatedNode
                : node
          ),
      })
    );
  };

  const removeNode = (
    id: string
  ) => {
    setInfrastructure(
      (current) => ({
        ...current,

        nodes:
          current.nodes.filter(
            (node) =>
              node.id !== id
          ),
      })
    );
  };

  const nodesByLayer = (
    layer: LayerType
  ) => {
    return infrastructure.nodes.filter(
      (node) =>
        node.layer === layer
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo-area">
          <div className="logo-mark">
            S
          </div>

          <div>
            <h1>
              SaveInCloud
            </h1>

            <span>
              Calculadora de
              infraestrutura
            </span>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="page-title">
          <div>
            <span className="eyebrow">
              SIMULADOR
            </span>

            <h1>
              Monte sua
              infraestrutura
            </h1>

            <p>
              Escolha as stacks que
              você precisa, configure
              os recursos de cada node
              e estime o custo do
              ambiente.
            </p>

            <div className="cloudlet-reference">
              <strong>
                Referência:
              </strong>{' '}
              1 Cloudlet = 128 MiB RAM
              + 400 MHz CPU
            </div>
          </div>
        </div>

        <div className="content">
          <div className="topology-area">
            <div className="infrastructure-intro">
              <span className="eyebrow">
                INFRAESTRUTURA
              </span>

              <h2>
                Escolha as camadas do
                seu ambiente
              </h2>

              <p>
                Adicione somente os
                serviços que realmente
                precisa para sua
                infraestrutura.
              </p>
            </div>

            {LAYERS.map(
              (layer) => (
                <LayerSection
                  key={
                    layer.id
                  }
                  layer={
                    layer
                  }
                  nodes={
                    nodesByLayer(
                      layer.id
                    )
                  }
                  reservedCloudletPrice={
                    price.reservedUnitPrice
                  }
                  dynamicCloudletPrice={
                    price.dynamicUnitPrice
                  }
                  onAdd={
                    addNode
                  }
                  onUpdate={
                    updateNode
                  }
                  onRemove={
                    removeNode
                  }
                />
              )
            )}

            {infrastructure.nodes
              .length === 0 && (
              <div className="empty-infrastructure">
                <div className="empty-infrastructure-icon">
                  +
                </div>

                <h3>
                  Seu ambiente ainda
                  está vazio
                </h3>

                <p>
                  Adicione uma stack em
                  qualquer camada para
                  começar a montar sua
                  infraestrutura.
                </p>
              </div>
            )}
          </div>

          <div className="summary-area">
            <PriceSummary
              minimum={
                price.minimum
              }
              maximum={
                price.maximum
              }
              nodeCount={
                infrastructure.nodes
                  .length
              }
            />
          </div>
        </div>
      </main>

      {modalLayer && (
        <AddNodeModal
          layer={
            modalLayer
          }
          onClose={
            closeModal
          }
          onConfirm={
            confirmAddNode
          }
        />
      )}
    </div>
  );
}

export default App;