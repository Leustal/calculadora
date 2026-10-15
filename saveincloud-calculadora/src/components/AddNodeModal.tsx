import {
  useState,
} from 'react';

import {
  STACKS,
  getStackTheme,
  type LayerType,
} from '../data/stacks';

interface AddNodeModalProps {
  layer: LayerType;
  onClose: () => void;
  onConfirm: (
    stackId: string
  ) => void;
}

const LAYER_NAMES: Record<
  LayerType,
  string
> = {
  'load-balancer':
    'Balanceador de carga',
  application:
    'Servidor de aplicação',
  sql:
    'Banco SQL',
  nosql:
    'Banco NoSQL',
  cache:
    'Cache',
  storage:
    'Storage',
  vps:
    'VPS',
};

export default function AddNodeModal({
  layer,
  onClose,
  onConfirm,
}: AddNodeModalProps) {
  const availableStacks =
    STACKS.filter(
      (stack) =>
        stack.layer ===
        layer
    );

  const [
    selectedStack,
    setSelectedStack,
  ] = useState<string>(
    availableStacks[0]?.id ??
      ''
  );

  const handleConfirm = () => {
    if (!selectedStack) {
      return;
    }

    onConfirm(
      selectedStack
    );
  };

  return (
    <div
      className="modal-overlay"
      onClick={
        onClose
      }
    >
      <div
        className="add-node-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <header className="modal-header">
          <div>
            <span className="eyebrow">
              ADICIONAR NODE
            </span>

            <h2>
              {LAYER_NAMES[
                layer
              ]}
            </h2>

            <p>
              Escolha a stack que
              deseja utilizar neste
              node.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={
              onClose
            }
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="stack-selection">
          {availableStacks.map(
            (stack) => {
              const theme =
                getStackTheme(
                  stack.id
                );

              const selected =
                selectedStack ===
                stack.id;

              return (
                <button
                  key={
                    stack.id
                  }
                  type="button"
                  className={
                    selected
                      ? 'stack-option selected'
                      : 'stack-option'
                  }
                  style={
                    {
                      '--stack-color':
                        theme.color,
                      '--stack-background':
                        theme.background,
                      '--stack-border':
                        theme.border,
                      '--stack-selected':
                        theme.darkBackground,
                    } as React.CSSProperties
                  }
                  onClick={() =>
                    setSelectedStack(
                      stack.id
                    )
                  }
                >
                  <span className="stack-option-name">
                    {
                      stack.name
                    }
                  </span>

                  <span className="stack-option-price">
                    Grátis
                  </span>

                  {selected && (
                    <span className="stack-option-check">
                      ✓
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>

        {availableStacks.length ===
          0 && (
          <div className="modal-empty">
            <strong>
              Nenhuma stack disponível
            </strong>

            <span>
              Não existem stacks
              cadastradas para esta
              camada.
            </span>
          </div>
        )}

        <footer className="modal-footer">
          <button
            type="button"
            className="modal-cancel"
            onClick={
              onClose
            }
          >
            Cancelar
          </button>

          <button
            type="button"
            className="modal-confirm"
            disabled={
              !selectedStack
            }
            onClick={
              handleConfirm
            }
          >
            Adicionar node
          </button>
        </footer>
      </div>
    </div>
  );
}