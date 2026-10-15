import { useMemo, useState } from 'react';

import Topology from './components/Topology';
import PriceSummary from './components/PriceSummary';
import ConsumptionEstimate from './components/ConsumptionEstimate';

import { calculatePrice } from './utils/calculator';

import type {
  ConsumptionEstimate as ConsumptionEstimateType,
  NodeConfig,
  Topology as TopologyType,
} from './types/topology';

import './index.css';

function createNode(
  type: NodeConfig['type'],
  number: number
): NodeConfig {
  const dynamicCloudlets =
    type === 'nginx'
      ? 2
      : 4;

  const storageGB =
    type === 'nginx'
      ? 10
      : type === 'apache'
      ? 50
      : 100;

  return {
    id: `${type}-${Date.now()}-${number}`,

    type,

    name:
      type === 'nginx'
        ? `nginx-${number}`
        : type === 'apache'
        ? `apache-${number}`
        : `mariadb-${number}`,

    reservedCloudlets:
      type === 'nginx'
        ? 2
        : 4,

    dynamicCloudlets,

    storageGB,

    ipv4: true,

    ipv6: false,
  };
}

function App() {
  const [topology, setTopology] =
    useState<TopologyType>({
      nginx: [
        createNode(
          'nginx',
          1
        ),
      ],

      apache: [
        createNode(
          'apache',
          1
        ),
      ],

      mariadb: [
        createNode(
          'mariadb',
          1
        ),
      ],
    });

  const [consumption, setConsumption] =
    useState<ConsumptionEstimateType>({
      dynamicCloudletsUsed: 0,
      storageGBUsed: 0,
    });

  const price = useMemo(
    () =>
      calculatePrice(
        topology,
        consumption
      ),
    [
      topology,
      consumption,
    ]
  );

  const updateNode = (
    updatedNode: NodeConfig
  ) => {
    setTopology(
      (current) => {
        const type =
          updatedNode.type;

        return {
          ...current,

          [type]:
            current[type].map(
              (node) =>
                node.id ===
                updatedNode.id
                  ? updatedNode
                  : node
            ),
        };
      }
    );
  };

  const addNode = (
    type:
      | 'apache'
      | 'mariadb'
  ) => {
    setTopology(
      (current) => {
        const totalNodes =
          current.nginx.length +
          current.apache.length +
          current.mariadb.length;

        if (
          totalNodes >= 48
        ) {
          alert(
            'O ambiente atingiu o limite máximo de 48 nodes.'
          );

          return current;
        }

        if (
          current[type]
            .length >= 16
        ) {
          alert(
            'Esta camada atingiu o limite máximo de 16 nodes.'
          );

          return current;
        }

        const number =
          current[type]
            .length + 1;

        return {
          ...current,

          [type]: [
            ...current[type],

            createNode(
              type,
              number
            ),
          ],
        };
      }
    );
  };

  const removeNode = (
    type: keyof TopologyType,
    id: string
  ) => {
    setTopology(
      (current) => ({
        ...current,

        [type]:
          current[type].filter(
            (node) =>
              node.id !== id
          ),
      })
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
              Configure os recursos do
              seu ambiente e estime o
              consumo para projetar o
              custo por hora.
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
            <Topology
              topology={
                topology
              }

              reservedCloudletPrice={
                price.reservedUnitPrice
              }

              onUpdateNode={
                updateNode
              }

              onRemoveNode={
                removeNode
              }

              onAddNode={
                addNode
              }
            />

            <ConsumptionEstimate
              topology={
                topology
              }

              consumption={
                consumption
              }

              dynamicCloudletPrice={
                price.dynamicUnitPrice
              }

              onChange={
                setConsumption
              }
            />
          </div>

          <div className="summary-area">
            <PriceSummary
              hourly={
                price.hourly
              }

              daily={
                price.daily
              }

              monthly={
                price.monthly
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;