import type {
  PriceRange,
} from '../types/infrastructure';

interface PriceSummaryProps {
  minimum: PriceRange;
  maximum: PriceRange;
  nodeCount: number;
}

function formatCurrency(
  value: number
) {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
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
        <section className="price-scenario minimum">
          <div className="scenario-heading">
            <div className="scenario-badge">
              DE
            </div>

            <div>
              <strong>
                Consumo mínimo
              </strong>

              <span>
                Recursos com cobrança
                mínima
              </span>
            </div>
          </div>

          <div className="scenario-card">
            <span className="scenario-label">
              MÍNIMO
            </span>

            <p className="scenario-description">
              Cenário com recursos
              reservados
            </p>

            <div className="main-price">
              <span>
                R$
              </span>

              <strong>
                {formatCurrency(
                  minimum.hourly
                ).replace(
                  'R$',
                  ''
                )}
              </strong>

              <small>
                / hora
              </small>
            </div>

            <div className="scenario-periods">
              <div>
                <span>
                  Por dia
                </span>

                <strong>
                  {formatCurrency(
                    minimum.daily
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Por mês
                </span>

                <strong>
                  {formatCurrency(
                    minimum.monthly
                  )}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <div className="price-divider">
          <span>
            PARA
          </span>
        </div>

        <section className="price-scenario maximum">
          <div className="scenario-heading">
            <div className="scenario-badge">
              PARA
            </div>

            <div>
              <strong>
                Uso máximo configurado
              </strong>

              <span>
                Recursos utilizados no
                limite
              </span>
            </div>
          </div>

          <div className="scenario-card">
            <span className="scenario-label">
              MÁXIMO
            </span>

            <p className="scenario-description">
              Cenário de utilização
              máxima
            </p>

            <div className="main-price">
              <span>
                R$
              </span>

              <strong>
                {formatCurrency(
                  maximum.hourly
                ).replace(
                  'R$',
                  ''
                )}
              </strong>

              <small>
                / hora
              </small>
            </div>

            <div className="scenario-periods">
              <div>
                <span>
                  Por dia
                </span>

                <strong>
                  {formatCurrency(
                    maximum.daily
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Por mês
                </span>

                <strong>
                  {formatCurrency(
                    maximum.monthly
                  )}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <div className="summary-meta">
          <div>
            <strong>
              {nodeCount}
            </strong>

            <span>
              {nodeCount === 1
                ? 'node configurado'
                : 'nodes configurados'}
            </span>
          </div>

          <div>
            <strong>
              730
            </strong>

            <span>
              horas consideradas
            </span>
          </div>
        </div>

        <section className="how-it-works">
          <h3>
            Como funciona?
          </h3>

          <p>
            O valor <strong>DE</strong>{' '}
            considera os recursos com
            cobrança mínima, como
            cloudlets reservados e IPs
            públicos.
          </p>

          <p>
            O valor <strong>PARA</strong>{' '}
            representa o cenário em
            que os cloudlets dinâmicos
            e o storage configurados
            sejam utilizados no limite
            durante todo o período.
          </p>

          <p>
            A cobrança real é feita por
            hora conforme o consumo
            efetivo dos recursos.
          </p>
        </section>
      </div>
    </aside>
  );
}