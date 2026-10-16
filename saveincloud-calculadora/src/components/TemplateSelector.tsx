import {
  Copy,
  LayoutTemplate,
} from 'lucide-react';

import {
  TEMPLATES,
  type InfrastructureTemplate,
} from '../data/templates';

interface TemplateSelectorProps {
  onSelect: (
    template: InfrastructureTemplate
  ) => void;
}

export default function TemplateSelector({
  onSelect,
}: TemplateSelectorProps) {
  return (
    <section className="template-panel">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">
            COMEÇAR MAIS RÁPIDO
          </span>
          <h2>
            Templates de infraestrutura
          </h2>
          <p>
            Comece com uma arquitetura pronta
            e personalize os nodes depois.
          </p>
        </div>
        <LayoutTemplate
          size={22}
          strokeWidth={1.8}
        />
      </div>

      <div className="template-grid">
        <button
          type="button"
          className="template-card template-card-empty"
          onClick={() =>
            onSelect({
              id: 'empty',
              name: 'Do zero',
              description:
                'Monte somente os serviços que você precisa.',
              infrastructure: {
                nodes: [],
              },
            })
          }
        >
          <span className="template-card-icon">
            +
          </span>
          <strong>
            Do zero
          </strong>
          <small>
            Comece uma infraestrutura vazia.
          </small>
        </button>

        {TEMPLATES.map(
          (template) => (
            <button
              key={template.id}
              type="button"
              className="template-card"
              onClick={() =>
                onSelect(
                  template
                )
              }
            >
              <span className="template-card-icon">
                <Copy
                  size={16}
                />
              </span>

              <strong>
                {template.name}
              </strong>

              <small>
                {template.description}
              </small>

              <span className="template-card-nodes">
                {template.infrastructure.nodes.length}{' '}
                {template.infrastructure.nodes.length === 1
                  ? 'node'
                  : 'nodes'}
              </span>
            </button>
          )
        )}
      </div>
    </section>
  );
}
