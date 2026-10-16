import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Download,
  Link,
  RotateCcw,
} from 'lucide-react';

import LayerSection from './components/LayerSection';
import PriceSummary from './components/PriceSummary';
import AddNodeModal from './components/AddNodeModal';
import TemplateSelector from './components/TemplateSelector';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CostBreakdown from './components/CostBreakdown';
import Recommendations from './components/Recommendations';
import ScenarioComparison from './components/ScenarioComparison';
import PrintableQuote from './components/PrintableQuote';

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

import type {
  SavedScenario,
} from './types/scenario';

import {
  createShareUrl,
  getSharedInfrastructure,
} from './utils/sharing';

import './index.css';

const STORAGE_KEY =
  'saveincloud-calculator-scenarios';

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

function createEmptyInfrastructure(): Infrastructure {
  return {
    nodes: [],
  };
}

function readSavedScenarios(): SavedScenario[] {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    if (
      !Array.isArray(
        parsed
      )
    ) {
      return [];
    }

    return parsed as SavedScenario[];
  } catch {
    return [];
  }
}

function App() {
  const sharedInfrastructure =
    useMemo(
      () =>
        getSharedInfrastructure(),
      []
    );

  const [
    infrastructure,
    setInfrastructure,
  ] = useState<Infrastructure>(
    sharedInfrastructure ??
      createEmptyInfrastructure()
  );

  const [
    modalLayer,
    setModalLayer,
  ] = useState<LayerType | null>(
    null
  );

  const [
    scenarios,
    setScenarios,
  ] = useState<
    SavedScenario[]
  >(() =>
    readSavedScenarios()
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

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        scenarios
      )
    );
  }, [scenarios]);

  useEffect(() => {
    if (!sharedInfrastructure) {
      return;
    }

    window.history.replaceState(
      {},
      '',
      window.location.pathname
    );
  }, [
    sharedInfrastructure,
  ]);

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
          current.nodes.length >=
          48
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
          layerNodes.length >=
          16
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

  const loadTemplate = (
    templateInfrastructure: Infrastructure
  ) => {
    setInfrastructure(
      JSON.parse(
        JSON.stringify(
          templateInfrastructure
        )
      ) as Infrastructure
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const resetInfrastructure = () => {
    const confirmed =
      window.confirm(
        'Deseja limpar toda a infraestrutura atual?'
      );

    if (!confirmed) {
      return;
    }

    setInfrastructure(
      createEmptyInfrastructure()
    );
  };

  const saveScenario = () => {
    if (scenarios.length >= 4) {
      alert(
        'Você pode salvar até 4 cenários. Exclua um cenário antigo para salvar outro.'
      );
      return;
    }

    const now = Date.now();
    const scenario: SavedScenario = {
      id: `${now}-${Math.random()
        .toString(36)
        .slice(2)}`,
      name: `Cenário ${scenarios.length + 1}`,
      infrastructure: JSON.parse(
        JSON.stringify(infrastructure)
      ) as Infrastructure,
      price: JSON.parse(
        JSON.stringify(price)
      ) as typeof price,
      createdAt: now,
    };

    setScenarios((current) => {
      if (current.length >= 4) {
        return current;
      }

      const updated = [...current, scenario];

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error(
          'Não foi possível salvar o cenário no armazenamento local.',
          error
        );
      }

      return updated;
    });
  };

  const removeScenario = (
    id: string
  ) => {
    setScenarios(
      (current) =>
        current.filter(
          (scenario) =>
            scenario.id !== id
        )
    );
  };

  const loadScenario = (
    scenario: SavedScenario
  ) => {
    setInfrastructure(
      JSON.parse(
        JSON.stringify(
          scenario.infrastructure
        )
      ) as Infrastructure
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const shareConfiguration =
    async () => {
      const url =
        createShareUrl(
          infrastructure
        );

      try {
        await navigator.clipboard.writeText(
          url
        );

        alert(
          'Link da configuração copiado para a área de transferência.'
        );
      } catch {
        window.prompt(
          'Copie o link da configuração:',
          url
        );
      }
    };

  const printQuote = () => {
    window.print();
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

        <div className="header-actions">
          <button
            type="button"
            className="header-button secondary"
            onClick={
              resetInfrastructure
            }
          >
            <RotateCcw
              size={15}
            />
            Novo
          </button>

          <button
            type="button"
            className="header-button"
            onClick={
              shareConfiguration
            }
          >
            <Link
              size={15}
            />
            Compartilhar
          </button>

          <button
            type="button"
            className="header-button primary"
            onClick={
              printQuote
            }
          >
            <Download
              size={15}
            />
            Orçamento
          </button>
        </div>
      </header>

      <main className="container">
        <div className="page-title">
          <div>
            <span className="eyebrow">
              SIMULADOR
            </span>

            <h1>
              Monte sua infraestrutura
            </h1>

            <p>
              Escolha as stacks que você
              precisa, configure os recursos
              de cada node e estime o custo
              do ambiente.
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

        <TemplateSelector
          onSelect={(
            template
          ) =>
            loadTemplate(
              template.infrastructure
            )
          }
        />

        <div className="content">
          <div className="topology-area">
            <div className="infrastructure-intro">
              <div>
                <span className="eyebrow">
                  INFRAESTRUTURA
                </span>

                <h2>
                  Escolha as camadas do
                  seu ambiente
                </h2>

                <p>
                  Adicione somente os serviços
                  que realmente precisa para
                  sua infraestrutura.
                </p>
              </div>

              {infrastructure.nodes.length >
                0 && (
                <span className="node-counter">
                  {infrastructure.nodes.length}
                  /48 nodes
                </span>
              )}
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
                  Escolha um template acima
                  ou adicione uma stack em
                  qualquer camada para começar.
                </p>
              </div>
            )}

            <ArchitectureDiagram
              infrastructure={
                infrastructure
              }
            />

            <CostBreakdown
              price={price}
            />

            <Recommendations
              infrastructure={
                infrastructure
              }
            />

            <ScenarioComparison
              scenarios={
                scenarios
              }
              onSave={
                saveScenario
              }
              onRemove={
                removeScenario
              }
              onLoad={
                loadScenario
              }
            />
          </div>

          <div className="summary-area">
            <PriceSummary
              minimum={
                price.minimum
              }

              maximum={
                price.maximum
              }

              minimumSavings={
                price.minimumSavings
              }

              maximumSavings={
                price.maximumSavings
              }

              minimumPayable={
                price.minimumPayable
              }

              maximumPayable={
                price.maximumPayable
              }

              nodeCount={
                infrastructure.nodes
                  .length
              }
            />

            <div className="summary-actions">
              <button
                type="button"
                className="summary-action"
                onClick={
                  shareConfiguration
                }
              >
                <Link
                  size={15}
                />
                Compartilhar configuração
              </button>

              <button
                type="button"
                className="summary-action"
                onClick={
                  printQuote
                }
              >
                <Download
                  size={15}
                />
                Imprimir / salvar orçamento
              </button>
            </div>
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

      <PrintableQuote
        infrastructure={
          infrastructure
        }
        price={
          price
        }
      />
    </div>
  );
}

export default App;
