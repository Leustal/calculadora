import type {
  PriceRange,
} from '../types/infrastructure';

interface PriceSummaryProps {
  minimum: PriceRange;
  maximum: PriceRange;
  nodeCount: number;
}

function formatPrice(
  value: number
): string {
  return value.toLocaleString(
    'pt-BR',
    {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }
  );
}

export default function PriceSummary({
  minimum,
  maximum,
  nodeCount,
}: PriceSummaryProps) {
  return (
    <aside className="price-summary">
      <div className="price-summary-header">
        <span className="eyebrow">
          ESTIMATIVA
        </span>

        <h2>
          Custo do ambiente
        </h2>

        <p>
          Estimativa baseada nos
          recursos configurados.
        </p>
      </div>

      <div className="price-summary-body">

        {/* DE */}
        <section className="price-scenario minimum">
          <div className="price-scenario-header">
            <div>
              <span className="price-scenario-label">
                DE
              </span>

              <span className="price-scenario-description">
                Consumo mínimo
              </span>
            </div>

            <span className="price-scenario-badge">
              MÍNIMO
            </span>
          </div>

          <div className="price-main">
            <span className="price-currency">
              R$
            </span>

            <strong>
              {formatPrice(
                minimum.hourly
              )}
            </strong>

            <span className="price-unit">
              / hora
            </span>
          </div>

          <div className="price-periods">
            <div className="price-period">
              <span>
                Por dia
              </span>

              <strong>
                R${' '}
                {formatPrice(
                  minimum.daily
                )}
              </strong>
            </div>

            <div className="price-period">
              <span>
                Por mês
              </span>

              <strong>
                R${' '}
                {formatPrice(
                  minimum.monthly
                )}
              </strong>
            </div>
          </div>
        </section>

        {/* SETA */}
        <div className="price-transition">
          <span className="price-transition-line" />
          <span className="price-transition-arrow">
            ↓
          </span>
          <span className="price-transition-line" />
        </div>

        {/* PARA */}
        <section className="price-scenario maximum">
          <div className="price-scenario-header">
            <div>
              <span className="price-scenario-label">
                PARA
              </span>

              <span className="price-scenario-description">
                Uso máximo configurado
              </span>
            </div>

            <span className="price-scenario-badge">
              MÁXIMO
            </span>
          </div>

          <div className="price-main">
            <span className="price-currency">
              R$
            </span>

            <strong>
              {formatPrice(
                maximum.hourly
              )}
            </strong>

            <span className="price-unit">
              / hora
            </span>
          </div>

          <div className="price-periods">
            <div className="price-period">
              <span>
                Por dia
              </span>

              <strong>
                R${' '}
                {formatPrice(
                  maximum.daily
                )}
              </strong>
            </div>

            <div className="price-period">
              <span>
                Por mês
              </span>

              <strong>
                R${' '}
                {formatPrice(
                  maximum.monthly
                )}
              </strong>
            </div>
          </div>
        </section>

        {/* RESUMO */}
        <div className="price-summary-stats">
          <div className="price-stat">
            <strong>
              {nodeCount}
            </strong>

            <span>
              {nodeCount === 1
                ? 'node configurado'
                : 'nodes configurados'}
            </span>
          </div>

          <div className="price-stat">
            <strong>
              730
            </strong>

            <span>
              horas consideradas
            </span>
          </div>
        </div>

        {/* EXPLICAÇÃO */}
        <div className="price-explanation">
          <div className="price-explanation-title">
            <span className="price-info-icon">
              i
            </span>

            Como funciona?
          </div>

          <p>
            O valor{' '}
            <strong>
              De
            </strong>{' '}
            considera os recursos
            com cobrança mínima,
            como cloudlets
            reservados e IPs
            públicos.
          </p>

          <p>
            O valor{' '}
            <strong>
              Para
            </strong>{' '}
            representa o cenário
            em que os cloudlets
            dinâmicos e o storage
            configurados sejam
            utilizados no limite
            durante todo o período.
          </p>

          <p>
            A cobrança real é
            feita por hora,
            conforme o consumo
            efetivo dos recursos.
          </p>
        </div>
      </div>
    </aside>
  );
}