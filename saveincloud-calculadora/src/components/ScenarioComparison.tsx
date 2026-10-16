import {
  GitCompare,
  Trash2,
} from 'lucide-react';

import type {
  SavedScenario,
} from '../types/scenario';

interface ScenarioComparisonProps {
  scenarios: SavedScenario[];
  onSave: () => void;
  onRemove: (
    id: string
  ) => void;
  onLoad: (
    scenario: SavedScenario
  ) => void;
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

export default function ScenarioComparison({
  scenarios,
  onSave,
  onRemove,
  onLoad,
}: ScenarioComparisonProps) {
  return (
    <section className="scenario-comparison-panel">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">
            DECISÃO
          </span>
          <h2>
            Comparar cenários
          </h2>
          <p>
            Salve diferentes arquiteturas
            para comparar custo e quantidade
            de nodes.
          </p>
        </div>

        <GitCompare
          size={22}
          strokeWidth={1.8}
        />
      </div>

      <div className="scenario-toolbar">
        <button
          type="button"
          className="primary-action"
          onClick={onSave}
        >
          + Salvar cenário atual
        </button>

        <span>
          {scenarios.length}/4 cenários salvos
          {scenarios.length < 4 && (
            <> · será salvo como Cenário {scenarios.length + 1}</>
          )}
        </span>
      </div>

      {scenarios.length === 0 ? (
        <div className="comparison-empty">
          <strong>
            Nenhum cenário salvo.
          </strong>
          <span>
            Salve a configuração atual para
            comparar alternativas como Básico,
            HA e Escalável.
          </span>
        </div>
      ) : (
        <div className="scenario-grid">
          {scenarios.map(
            (scenario) => (
              <article
                key={scenario.id}
                className="saved-scenario-card"
              >
                <div className="saved-scenario-header">
                  <div>
                    <strong>
                      {scenario.name}
                    </strong>
                    <span>
                      {scenario.infrastructure.nodes.length}{' '}
                      {scenario.infrastructure.nodes.length === 1
                        ? 'node'
                        : 'nodes'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="icon-button"
                    title="Excluir cenário"
                    onClick={() =>
                      onRemove(
                        scenario.id
                      )
                    }
                  >
                    <Trash2
                      size={15}
                    />
                  </button>
                </div>

                <div className="saved-scenario-price">
                  <span>
                    PARA
                  </span>
                  <strong>
                    {formatBRL(
                      scenario.price
                        .maximumPayable
                        .monthly
                    )}
                    <small>
                      / mês
                    </small>
                  </strong>
                </div>

                <div className="saved-scenario-meta">
                  <span>
                    DE{' '}
                    {formatBRL(
                      scenario.price
                        .minimumPayable
                        .monthly
                    )}
                    / mês
                  </span>

                  <span>
                    Máx.{' '}
                    {scenario.price
                      .quantities
                      .dynamicMaximum}{' '}
                    cloudlets
                  </span>
                </div>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() =>
                    onLoad(
                      scenario
                    )
                  }
                >
                  Carregar cenário
                </button>
              </article>
            )
          )}
        </div>
      )}

      {scenarios.length >= 2 && (
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>
                  Cenário
                </th>
                {scenarios.map(
                  (scenario) => (
                    <th
                      key={
                        scenario.id
                      }
                    >
                      {scenario.name}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  Nodes
                </td>
                {scenarios.map(
                  (scenario) => (
                    <td
                      key={
                        scenario.id
                      }
                    >
                      {
                        scenario
                          .infrastructure
                          .nodes
                          .length
                      }
                    </td>
                  )
                )}
              </tr>

              <tr>
                <td>
                  DE / mês
                </td>
                {scenarios.map(
                  (scenario) => (
                    <td
                      key={
                        scenario.id
                      }
                    >
                      {formatBRL(
                        scenario
                          .price
                          .minimumPayable
                          .monthly
                      )}
                    </td>
                  )
                )}
              </tr>

              <tr>
                <td>
                  PARA / mês
                </td>
                {scenarios.map(
                  (scenario) => (
                    <td
                      key={
                        scenario.id
                      }
                    >
                      {formatBRL(
                        scenario
                          .price
                          .maximumPayable
                          .monthly
                      )}
                    </td>
                  )
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
