import {
  Boxes,
  Database,
  HardDrive,
  Globe,
  Layers3,
  Server,
} from 'lucide-react';

import {
  LAYERS,
  getStackById,
} from '../data/stacks';

import type {
  Infrastructure,
} from '../types/infrastructure';

interface InfrastructureSummaryProps {
  infrastructure: Infrastructure;
}

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

export default function InfrastructureSummary({
  infrastructure,
}: InfrastructureSummaryProps) {
  const nodes = infrastructure.nodes;

  const layerCount = new Set(
    nodes.map((node) => node.layer)
  ).size;

  const stackCounts = new Map<string, number>();

  nodes.forEach((node) => {
    stackCounts.set(
      node.stackId,
      (stackCounts.get(node.stackId) ?? 0) + 1
    );
  });

  const stacks = Array.from(stackCounts.entries())
    .map(([stackId, count]) => ({
      stack: getStackById(stackId),
      stackId,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const reservedCloudlets = nodes.reduce(
    (total, node) =>
      total + Math.max(1, node.reservedCloudlets),
    0
  );

  const dynamicMaximum = nodes.reduce(
    (total, node) =>
      total +
      Math.max(
        Math.max(1, node.reservedCloudlets),
        node.dynamicCloudlets
      ),
    0
  );

  const storageMaximum = nodes.reduce(
    (total, node) =>
      total + Math.max(1, node.storageGB),
    0
  );

  const ipv4 = nodes.filter((node) => node.ipv4).length;
  const ipv6 = nodes.filter((node) => node.ipv6).length;

  const getLayerName = (layerId: string) =>
    LAYERS.find((layer) => layer.id === layerId)?.name ?? layerId;

  return (
    <section className="infrastructure-summary-panel">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">RESUMO</span>
          <h2>Resumo da infraestrutura</h2>
          <p>
            Visão rápida do ambiente configurado antes de analisar o orçamento.
          </p>
        </div>

        <Boxes size={22} strokeWidth={1.8} />
      </div>

      <div className="infrastructure-summary-stats">
        <div className="infrastructure-summary-stat">
          <Server size={16} />
          <strong>{formatNumber(nodes.length)}</strong>
          <span>{nodes.length === 1 ? 'node' : 'nodes'}</span>
        </div>

        <div className="infrastructure-summary-stat">
          <Layers3 size={16} />
          <strong>{formatNumber(layerCount)}</strong>
          <span>{layerCount === 1 ? 'camada' : 'camadas'}</span>
        </div>

        <div className="infrastructure-summary-stat">
          <Database size={16} />
          <strong>{formatNumber(stacks.length)}</strong>
          <span>{stacks.length === 1 ? 'stack' : 'stacks'}</span>
        </div>

        <div className="infrastructure-summary-stat">
          <HardDrive size={16} />
          <strong>{formatNumber(storageMaximum)} GB</strong>
          <span>storage máximo</span>
        </div>
      </div>

      {nodes.length > 0 ? (
        <>
          <div className="infrastructure-summary-columns">
            <div className="infrastructure-summary-block">
              <div className="infrastructure-summary-block-title">
                <strong>Stacks configuradas</strong>
                <span>{stacks.length}</span>
              </div>

              <div className="infrastructure-summary-stack-list">
                {stacks.map(({ stack, stackId, count }) => (
                  <div key={stackId} className="infrastructure-summary-stack">
                    <div>
                      <strong>{stack?.name ?? stackId}</strong>
                      <span>{getLayerName(stack?.layer ?? '')}</span>
                    </div>
                    <b>{count}x</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="infrastructure-summary-block">
              <div className="infrastructure-summary-block-title">
                <strong>Recursos</strong>
                <span>configurados</span>
              </div>

              <div className="infrastructure-summary-resource-list">
                <div>
                  <span>Cloudlets reservados</span>
                  <strong>{reservedCloudlets}</strong>
                </div>

                <div>
                  <span>Escala máxima</span>
                  <strong>{dynamicMaximum}</strong>
                </div>

                <div>
                  <span>Storage máximo</span>
                  <strong>{storageMaximum} GB</strong>
                </div>

                <div>
                  <span>IPv4 público</span>
                  <strong>{ipv4}</strong>
                </div>

                <div>
                  <span>IPv6 público</span>
                  <strong>{ipv6}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="infrastructure-summary-note">
            <Globe size={15} />
            <span>
              Os softwares das stacks não adicionam custo ao cálculo. O orçamento considera os recursos configurados e o modelo de cobrança da calculadora.
            </span>
          </div>
        </>
      ) : (
        <div className="infrastructure-summary-empty">
          Adicione um node para visualizar o resumo da infraestrutura.
        </div>
      )}
    </section>
  );
}
