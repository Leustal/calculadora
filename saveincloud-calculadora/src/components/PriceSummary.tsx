interface PriceSummaryProps {
  hourly: number;
  daily: number;
  monthly: number;
}

function formatBRL(
  value: number
) {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    }
  );
}

export default function PriceSummary({
  hourly,
  daily,
  monthly,
}: PriceSummaryProps) {
  return (
    <aside className="price-summary">
      <div className="summary-label">
        ESTIMATIVA
      </div>

      <h2>
        Seu ambiente
      </h2>

      <div className="price-main">
        {formatBRL(
          monthly
        )}

        <span>
          / projeção mensal
        </span>
      </div>

      <div className="price-row">
        <span>
          Por hora
        </span>

        <strong>
          {formatBRL(
            hourly
          )}
        </strong>
      </div>

      <div className="price-row">
        <span>
          Por dia
        </span>

        <strong>
          {formatBRL(
            daily
          )}
        </strong>
      </div>

      <div className="price-row">
        <span>
          Projeção por mês
        </span>

        <strong>
          {formatBRL(
            monthly
          )}
        </strong>
      </div>

      <div className="summary-note">
        A cobrança da SaveInCloud é
        realizada por hora conforme o
        consumo efetivo dos recursos.

        <br />
        <br />

        A projeção mensal considera
        730 horas e o consumo estimado
        informado na calculadora.
      </div>
    </aside>
  );
}