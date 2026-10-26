import {
  forwardRef,
} from 'react';

import {
  getStackById,
  LAYERS,
} from '../data/stacks';

import type {
  Infrastructure,
  PriceResult,
} from '../types/infrastructure';

interface PrintableQuoteProps {
  infrastructure: Infrastructure;
  price: PriceResult;
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatBRLPrecise(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

function layerName(layerId: string): string {
  return (
    LAYERS.find((layer) => layer.id === layerId)?.name ?? layerId
  );
}

function createQuoteId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll('-', '');
  const time = now
    .toTimeString()
    .slice(0, 8)
    .replaceAll(':', '');

  return `SIC-${date}-${time}`;
}

const PrintableQuote = forwardRef<
  HTMLDivElement,
  PrintableQuoteProps
>(function PrintableQuote(
  { infrastructure, price },
  ref
) {
  const nodes = infrastructure.nodes;
  const quoteId = createQuoteId();

  return (
    <div ref={ref} className="printable-quote">
      <header className="printable-quote-header">
        <div>
          <strong>SaveInCloud</strong>
          <span>Calculadora de infraestrutura</span>
        </div>

        <div className="printable-quote-header-meta">
          <strong>ESTIMATIVA DE INFRAESTRUTURA</strong>
          <span>{quoteId}</span>
          <span>{new Date().toLocaleString('pt-BR')}</span>
        </div>
      </header>

      <section className="printable-quote-intro">
        <div>
          <span>CONFIGURAÇÃO</span>
          <strong>
            {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'} configurados
          </strong>
        </div>
        <div>
          <span>ESCALA MÁXIMA</span>
          <strong>{price.quantities.dynamicMaximum} cloudlets</strong>
        </div>
        <div>
          <span>STORAGE MÁXIMO</span>
          <strong>{price.quantities.storageMaximum} GB</strong>
        </div>
      </section>

      <section className="printable-quote-summary">
        <div className="printable-quote-summary-card">
          <span>DE · MÍNIMO</span>
          <strong>
            {formatBRL(price.minimumPayable.monthly)}
            <small>/ mês</small>
          </strong>
          <p>
            {formatBRLPrecise(price.minimumPayable.hourly)} / hora
          </p>
        </div>

        <div className="printable-quote-summary-card highlight">
          <span>PARA · MÁXIMO</span>
          <strong>
            {formatBRL(price.maximumPayable.monthly)}
            <small>/ mês</small>
          </strong>
          <p>
            {formatBRLPrecise(price.maximumPayable.hourly)} / hora
          </p>
        </div>
      </section>

      <h2>Arquitetura configurada</h2>

      <table>
        <thead>
          <tr>
            <th>Camada</th>
            <th>Stack</th>
            <th>Node</th>
            <th>Cloudlets</th>
            <th>Storage</th>
            <th>Rede</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            const stack = getStackById(node.stackId);
            const network = [
              node.ipv4 ? 'IPv4' : '',
              node.ipv6 ? 'IPv6' : '',
            ]
              .filter(Boolean)
              .join(' + ') || 'Privada';

            return (
              <tr key={node.id}>
                <td>{layerName(node.layer)}</td>
                <td>{stack?.name ?? node.stackId}</td>
                <td>{node.name}</td>
                <td>
                  {node.reservedCloudlets} → {node.dynamicCloudlets}
                </td>
                <td>{Math.max(1, node.storageGB)} GB</td>
                <td>{network}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Resumo financeiro</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Hora</th>
            <th>Dia</th>
            <th>Mês</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total bruto DE</td>
            <td>{formatBRL(price.minimum.hourly)}</td>
            <td>{formatBRL(price.minimum.daily)}</td>
            <td>{formatBRL(price.minimum.monthly)}</td>
          </tr>
          <tr>
            <td>Desconto DE</td>
            <td>-{formatBRL(price.minimumSavings.hourly)}</td>
            <td>-{formatBRL(price.minimumSavings.daily)}</td>
            <td>-{formatBRL(price.minimumSavings.monthly)}</td>
          </tr>
          <tr className="printable-total-row">
            <td>Total a pagar DE</td>
            <td>{formatBRL(price.minimumPayable.hourly)}</td>
            <td>{formatBRL(price.minimumPayable.daily)}</td>
            <td>{formatBRL(price.minimumPayable.monthly)}</td>
          </tr>
          <tr>
            <td>Total bruto PARA</td>
            <td>{formatBRL(price.maximum.hourly)}</td>
            <td>{formatBRL(price.maximum.daily)}</td>
            <td>{formatBRL(price.maximum.monthly)}</td>
          </tr>
          <tr>
            <td>Desconto PARA</td>
            <td>-{formatBRL(price.maximumSavings.hourly)}</td>
            <td>-{formatBRL(price.maximumSavings.daily)}</td>
            <td>-{formatBRL(price.maximumSavings.monthly)}</td>
          </tr>
          <tr className="printable-total-row highlight-row">
            <td>Total a pagar PARA</td>
            <td>{formatBRL(price.maximumPayable.hourly)}</td>
            <td>{formatBRL(price.maximumPayable.daily)}</td>
            <td>{formatBRL(price.maximumPayable.monthly)}</td>
          </tr>
        </tbody>
      </table>

      <h2>Observações</h2>
      <ul className="printable-quote-notes">
        <li>Valores estimados conforme os recursos configurados.</li>
        <li>Os softwares das stacks não adicionam custo ao cálculo.</li>
        <li>DE representa os recursos reservados; PARA representa o limite máximo configurado.</li>
        <li>O cálculo mensal considera 730 horas.</li>
      </ul>

      <footer>
        Este documento é uma estimativa gerada pela Calculadora SaveInCloud e não substitui uma proposta comercial formal.
      </footer>
    </div>
  );
});

export default PrintableQuote;
