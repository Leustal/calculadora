import {
  CheckCircle2,
  GitCompare,
  Trash2,
} from 'lucide-react';

import type {
  SavedScenario,
} from '../types/scenario';

interface ScenarioComparisonProps {
  scenarios: SavedScenario[];
  onSave: () => void;
  onRemove: (id: string) => void;
  onLoad: (scenario: SavedScenario) => void;
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function ScenarioComparison({
  scenarios,
  onSave,
  onRemove,
  onLoad,
}: ScenarioComparisonProps) {
  const cheapest = scenarios.reduce<SavedScenario | null>(
    (best, scenario) => {
      if (!best) return scenario;

      return scenario.price.maximumPayable.monthly <
        best.price.maximumPayable.monthly
        ? scenario
        : best;
    },
    null
  );

  const highestCapacity = scenarios.reduce<SavedScenario | null>(
    (best, scenario) => {
      if (!best) return scenario;

      return scenario.price.quantities.dynamicMaximum >
        best.price.quantities.dynamicMaximum
        ? scenario
        : best;
    },
    null
  );

  return (
    <section className="scenario-comparison-panel">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">DECISÃO</span>
          <h2>Comparar cenários</h2>
          <p>
            Salve diferentes arquiteturas para comparar custo, capacidade e quantidade de nodes.
          </p>
        </div>

        <GitCompare size={22} strokeWidth={1.8} />
      </div>

      <div className="scenario-toolbar">
        <button
          type="button"
          className="primary-action"
          onClick={onSave}
          disabled={scenarios.length >= 4}
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
          <strong>Nenhum cenário salvo.</strong>
          <span>
            Salve a configuração atual para comparar alternativas como Básico, HA e Escalável.
          </span>
        </div>
      ) : (
        <>
          <div className="scenario-highlights">
            {cheapest && (
              <div className="scenario-highlight-card">
                <CheckCircle2 size={17} />
                <div>
                  <span>Menor custo máximo</span>
                  <strong>{cheapest.name}</strong>
                  <small>
                    {formatBRL(cheapest.price.maximumPayable.monthly)} / mês
                  </small>
                </div>
              </div>
            )}

            {highestCapacity && (
              <div className="scenario-highlight-card">
                <CheckCircle2 size={17} />
                <div>
                  <span>Maior capacidade</span>
                  <strong>{highestCapacity.name}</strong>
                  <small>
                    {highestCapacity.price.quantities.dynamicMaximum} cloudlets máximos
                  </small>
                </div>
              </div>
            )}
          </div>

          <div className="scenario-grid">
            {scenarios.map((scenario) => (
              <article
                key={scenario.id}
                className={`saved-scenario-card ${
                  cheapest?.id === scenario.id
                    ? 'recommended'
                    : ''
                }`}
              >
                <div className="saved-scenario-header">
                  <div>
                    <strong>{scenario.name}</strong>
                    <span>
                      {scenario.infrastructure.nodes.length}{' '}
                      {scenario.infrastructure.nodes.length === 1
                        ? 'node'
                        : 'nodes'}{' '}
                      · {formatDate(scenario.createdAt)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="icon-button"
                    title="Excluir cenário"
                    onClick={() => onRemove(scenario.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="saved-scenario-price">
                  <span>PARA</span>
                  <strong>
                    {formatBRL(scenario.price.maximumPayable.monthly)}
                    <small>/ mês</small>
                  </strong>
                </div>

                <div className="saved-scenario-meta">
                  <span>
                    DE {formatBRL(scenario.price.minimumPayable.monthly)} / mês
                  </span>
                  <span>
                    {scenario.price.quantities.reserved} cloudlets reservados
                  </span>
                  <span>
                    {scenario.price.quantities.dynamicMaximum} cloudlets máximos
                  </span>
                </div>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => onLoad(scenario)}
                >
                  Carregar cenário
                </button>
              </article>
            ))}
          </div>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Indicador</th>
                  {scenarios.map((scenario) => (
                    <th key={scenario.id}>{scenario.name}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Nodes</td>
                  {scenarios.map((scenario) => (
                    <td key={scenario.id}>
                      {scenario.infrastructure.nodes.length}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Cloudlets reservados</td>
                  {scenarios.map((scenario) => (
                    <td key={scenario.id}>
                      {scenario.price.quantities.reserved}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Escala máxima</td>
                  {scenarios.map((scenario) => (
                    <td key={scenario.id}>
                      {scenario.price.quantities.dynamicMaximum}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Storage máximo</td>
                  {scenarios.map((scenario) => (
                    <td key={scenario.id}>
                      {scenario.price.quantities.storageMaximum} GB
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>DE / mês</td>
                  {scenarios.map((scenario) => (
                    <td key={scenario.id}>
                      {formatBRL(scenario.price.minimumPayable.monthly)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>PARA / mês</td>
                  {scenarios.map((scenario) => (
                    <td
                      key={scenario.id}
                      className={
                        cheapest?.id === scenario.id
                          ? 'comparison-best'
                          : ''
                      }
                    >
                      {formatBRL(scenario.price.maximumPayable.monthly)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
