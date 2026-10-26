import {
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

import type {
  PriceResult,
} from '../types/infrastructure';

interface CostBreakdownProps {
  price: PriceResult;
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

interface CostItem {
  label: string;
  minimum: number;
  maximum: number;
}

export default function CostBreakdown({
  price,
}: CostBreakdownProps) {
  const items: CostItem[] = [
    {
      label: 'Cloudlets reservados',
      minimum: price.breakdown.minimum.reserved,
      maximum: price.breakdown.maximum.reserved,
    },
    {
      label: 'Cloudlets adicionais',
      minimum: price.breakdown.minimum.dynamic,
      maximum: price.breakdown.maximum.dynamic,
    },
    {
      label: 'Storage',
      minimum: price.breakdown.minimum.storage,
      maximum: price.breakdown.maximum.storage,
    },
    {
      label: 'IPv4 público',
      minimum: price.breakdown.minimum.ipv4,
      maximum: price.breakdown.maximum.ipv4,
    },
    {
      label: 'IPv6 público',
      minimum: price.breakdown.minimum.ipv6,
      maximum: price.breakdown.maximum.ipv6,
    },
  ];

  const maximumBar = Math.max(
    ...items.map((item) => item.maximum),
    0.000001
  );

  const minimumComposition = items.reduce(
    (total, item) => total + item.minimum,
    0
  );

  const maximumComposition = items.reduce(
    (total, item) => total + item.maximum,
    0
  );

  return (
    <section className="cost-breakdown-panel">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">COMPOSIÇÃO</span>
          <h2>Detalhamento do preço</h2>
          <p>
            Veja exatamente como os recursos configurados formam o valor a pagar.
          </p>
        </div>

        <BarChart3 size={22} strokeWidth={1.8} />
      </div>

      <div className="cost-breakdown-explanation">
        <CheckCircle2 size={15} />
        <span>
          A composição abaixo representa o custo <strong>após os descontos</strong> dos cloudlets. O valor bruto e o desconto aparecem separados logo abaixo.
        </span>
      </div>

      <div className="cost-breakdown-table-wrap">
        <table className="cost-breakdown-table">
          <thead>
            <tr>
              <th>Recurso</th>
              <th>DE / hora</th>
              <th>PARA / hora</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label}>
                <td>{item.label}</td>
                <td>{formatBRL(item.minimum)}</td>
                <td>{formatBRL(item.maximum)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Composição a pagar</th>
              <th>{formatBRL(minimumComposition)}</th>
              <th>{formatBRL(maximumComposition)}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="cost-chart">
        {items.map((item) => {
          const width = `${Math.max(
            item.maximum > 0 ? 3 : 0,
            (item.maximum / maximumBar) * 100
          )}%`;

          return (
            <div key={item.label} className="cost-chart-row">
              <div className="cost-chart-label">
                <strong>{item.label}</strong>
                <span>{formatBRL(item.maximum)} / h</span>
              </div>

              <div className="cost-chart-track">
                <div
                  className="cost-chart-bar"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="cost-breakdown-footer">
        <div>
          <span>DE bruto</span>
          <strong>{formatBRL(price.minimum.hourly)} / h</strong>
        </div>

        <div>
          <span>Desconto DE</span>
          <strong>-{formatBRL(price.minimumSavings.hourly)} / h</strong>
        </div>

        <div className="highlight">
          <span>DE a pagar</span>
          <strong>{formatBRL(price.minimumPayable.hourly)} / h</strong>
        </div>

        <div>
          <span>PARA bruto</span>
          <strong>{formatBRL(price.maximum.hourly)} / h</strong>
        </div>

        <div>
          <span>Desconto PARA</span>
          <strong>-{formatBRL(price.maximumSavings.hourly)} / h</strong>
        </div>

        <div className="highlight">
          <span>PARA a pagar</span>
          <strong>{formatBRL(price.maximumPayable.hourly)} / h</strong>
        </div>
      </div>
    </section>
  );
}
