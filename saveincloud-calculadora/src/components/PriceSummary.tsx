import type {
  PriceRange,
} from '../types/infrastructure';

interface PriceSummaryProps {
  minimum: PriceRange;
  maximum: PriceRange;

  minimumSavings?: PriceRange;
  maximumSavings?: PriceRange;

  minimumPayable?: PriceRange;
  maximumPayable?: PriceRange;

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

function formatValue(
  value: number
) {
  return formatCurrency(value)
    .replace('R$', '')
    .trim();
}

interface ScenarioProps {
  type: 'minimum' | 'maximum';
  price: PriceRange;
  savings: PriceRange;
  payable: PriceRange;
}

function Scenario({
  type,
  price,
  savings,
  payable,
}: ScenarioProps) {
  const isMaximum =
    type === 'maximum';

  return (
    <section
      className={`price-scenario ${
        isMaximum
          ? 'maximum'
          : 'minimum'
      }`}
    >
      <div className="scenario-heading">
        <div className="scenario-badge">
          {isMaximum
            ? 'PARA'
            : 'DE'}
        </div>

        <div>
          <strong>
            {isMaximum
              ? 'Uso máximo configurado'
              : 'Recursos reservados'}
          </strong>

          <span>
            {isMaximum
              ? 'Recursos utilizados no limite'
              : 'Cenário com recursos reservados'}
          </span>
        </div>
      </div>

      <div className="scenario-card">
        <span className="scenario-label">
          {isMaximum
            ? 'MÁXIMO'
            : 'MÍNIMO'}
        </span>

        <p className="scenario-description">
          {isMaximum
            ? 'Cenário de utilização máxima'
            : 'Cenário com recursos reservados'}
        </p>

        <div className="main-price">
          <span>
            R$
          </span>

          <strong>
            {formatValue(
              payable.hourly
            )}
          </strong>

          <small>
            / hora
          </small>
        </div>

        <div className="scenario-price-table">
          <div className="price-table-header">
            <span></span>

            <span>
              Hora
            </span>

            <span>
              Dia
            </span>

            <span>
              Mês
            </span>
          </div>

          <div className="price-table-row total">
            <span>
              Total
            </span>

            <strong>
              R$ {formatValue(
                price.hourly
              )}
            </strong>

            <strong>
              R$ {formatValue(
                price.daily
              )}
            </strong>

            <strong>
              R$ {formatValue(
                price.monthly
              )}
            </strong>
          </div>

          <div className="price-table-row discount">
            <span>
              Desconto
            </span>

            <strong>
              -R$ {formatValue(
                savings.hourly
              )}
            </strong>

            <strong>
              -R$ {formatValue(
                savings.daily
              )}
            </strong>

            <strong>
              -R$ {formatValue(
                savings.monthly
              )}
            </strong>
          </div>

          <div className="price-table-divider" />

          <div className="price-table-row payable">
            <span>
              Total a pagar
            </span>

            <strong>
              R$ {formatValue(
                payable.hourly
              )}
            </strong>

            <strong>
              R$ {formatValue(
                payable.daily
              )}
            </strong>

            <strong>
              R$ {formatValue(
                payable.monthly
              )}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PriceSummary({
  minimum,
  maximum,
  minimumSavings,
  maximumSavings,
  minimumPayable,
  maximumPayable,
  nodeCount,
}: PriceSummaryProps) {
  const zeroRange: PriceRange = {
    hourly: 0,
    daily: 0,
    monthly: 0,
  };

  const resolvedMinimumSavings =
    minimumSavings ??
    zeroRange;

  const resolvedMaximumSavings =
    maximumSavings ??
    zeroRange;

  const resolvedMinimumPayable =
    minimumPayable ??
    minimum;

  const resolvedMaximumPayable =
    maximumPayable ??
    maximum;

  return (
    <aside className="price-summary">
      <header className="price-summary-header">
        <h2>
          Estimativa
        </h2>

        <p>
          Valores calculados conforme
          os recursos configurados.
        </p>
      </header>

      <div className="price-summary-body">
        <Scenario
          type="minimum"
          price={minimum}
          savings={
            resolvedMinimumSavings
          }
          payable={
            resolvedMinimumPayable
          }
        />

        <div className="price-divider">
          <span>
            PARA
          </span>
        </div>

        <Scenario
          type="maximum"
          price={maximum}
          savings={
            resolvedMaximumSavings
          }
          payable={
            resolvedMaximumPayable
          }
        />

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
      </div>
    </aside>
  );
}