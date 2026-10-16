import {
  BarChart3,
} from 'lucide-react';

import type {
  PriceResult,
} from '../types/infrastructure';

interface CostBreakdownProps {
  price: PriceResult;
}

function formatBRL(
  value: number
): string {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

interface CostItem {
  label: string;
  hourly: number;
}

export default function CostBreakdown({
  price,
}: CostBreakdownProps) {
  const items: CostItem[] = [
    {
      label: 'Cloudlets',
      hourly:
        price.breakdown.maximum.reserved +
        price.breakdown.maximum.dynamic,
    },
    {
      label: 'Storage',
      hourly:
        price.breakdown.maximum.storage,
    },
    {
      label: 'IPv4',
      hourly:
        price.breakdown.maximum.ipv4,
    },
    {
      label: 'IPv6',
      hourly:
        price.breakdown.maximum.ipv6,
    },
  ];

  const maximum =
    Math.max(
      ...items.map(
        (item) =>
          item.hourly
      ),
      0.000001
    );

  return (
    <section className="cost-breakdown-panel">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">
            COMPOSIÇÃO
          </span>
          <h2>
            Breakdown de custos
          </h2>
          <p>
            Como o custo horário do cenário PARA
            é distribuído entre os recursos.
          </p>
        </div>

        <BarChart3
          size={22}
          strokeWidth={1.8}
        />
      </div>

      <div className="cost-chart">
        {items.map(
          (item) => {
            const width =
              `${Math.max(
                3,
                (item.hourly /
                  maximum) *
                  100
              )}%`;

            return (
              <div
                key={
                  item.label
                }
                className="cost-chart-row"
              >
                <div className="cost-chart-label">
                  <strong>
                    {item.label}
                  </strong>
                  <span>
                    {formatBRL(
                      item.hourly
                    )}{' '}
                    / h
                  </span>
                </div>

                <div className="cost-chart-track">
                  <div
                    className="cost-chart-bar"
                    style={{
                      width,
                    }}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="cost-breakdown-footer">
        <div>
          <span>
            PARA bruto
          </span>
          <strong>
            {formatBRL(
              price.maximum.hourly
            )}{' '}
            / h
          </strong>
        </div>

        <div>
          <span>
            Desconto
          </span>
          <strong>
            -{formatBRL(
              price.maximumSavings.hourly
            )}{' '}
            / h
          </strong>
        </div>

        <div className="highlight">
          <span>
            Total a pagar
          </span>
          <strong>
            {formatBRL(
              price.maximumPayable.hourly
            )}{' '}
            / h
          </strong>
        </div>
      </div>
    </section>
  );
}
