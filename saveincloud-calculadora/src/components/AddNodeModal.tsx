import {
  useState,
} from 'react';

import {
  STACKS,
  type LayerType,
} from '../data/stacks';

interface AddNodeModalProps {
  layer: LayerType;
  onClose: () => void;
  onConfirm: (
    stackId: string
  ) => void;
}

interface StackColor {
  background: string;
  selected: string;
  border: string;
  text: string;
}

const STACK_COLORS: Record<
  string,
  StackColor
> = {
  // Balanceadores
  nginx: {
    background: '#eef9f1',
    selected: '#c8e8d0',
    border: '#63b77a',
    text: '#23753a',
  },

  haproxy: {
    background: '#eef4ff',
    selected: '#cbdcff',
    border: '#5b8def',
    text: '#2859a8',
  },

  'apache-balancer': {
    background: '#fff1ed',
    selected: '#ffd2c7',
    border: '#e36b4f',
    text: '#a33d27',
  },

  varnish: {
    background: '#fff6e8',
    selected: '#ffe0ad',
    border: '#e59a2f',
    text: '#9a5c00',
  },

  // Aplicação
  apache: {
    background: '#fff1ed',
    selected: '#ffd2c7',
    border: '#e36b4f',
    text: '#a33d27',
  },

  'apache-python-ruby': {
    background: '#fff1ed',
    selected: '#ffd2c7',
    border: '#e36b4f',
    text: '#a33d27',
  },

  'nginx-ruby': {
    background: '#eef9f1',
    selected: '#c8e8d0',
    border: '#63b77a',
    text: '#23753a',
  },

  nodejs: {
    background: '#f3f8e9',
    selected: '#d9e9b8',
    border: '#83a93d',
    text: '#55751d',
  },

  'python-engine': {
    background: '#fff8df',
    selected: '#f4e4a8',
    border: '#d9bd4b',
    text: '#806b16',
  },

  'dotnet-core': {
    background: '#f1edff',
    selected: '#d8ceff',
    border: '#8066d8',
    text: '#55409d',
  },

  golang: {
    background: '#eafaff',
    selected: '#c5eaf5',
    border: '#55b7d1',
    text: '#277c98',
  },

  'java-engine': {
    background: '#fff1e8',
    selected: '#ffd6bd',
    border: '#d97a3d',
    text: '#98501f',
  },

  jetty: {
    background: '#f1f5f8',
    selected: '#d5e0e8',
    border: '#7893a5',
    text: '#455c6b',
  },

  tomcat: {
    background: '#fff4e8',
    selected: '#ffd9ad',
    border: '#d9872c',
    text: '#945311',
  },

  tomee: {
    background: '#fff4e8',
    selected: '#ffd9ad',
    border: '#d9872c',
    text: '#945311',
  },

  glassfish: {
    background: '#eef7ff',
    selected: '#cfe5f7',
    border: '#5996c5',
    text: '#346685',
  },

  payara: {
    background: '#eef9f7',
    selected: '#c8e9e3',
    border: '#52a99b',
    text: '#31756b',
  },

  wildfly: {
    background: '#fff3e8',
    selected: '#ffd9bd',
    border: '#d97836',
    text: '#91491e',
  },

  'spring-boot': {
    background: '#f1f8e8',
    selected: '#d7e9bd',
    border: '#76a84b',
    text: '#4e762c',
  },

  maven: {
    background: '#fff0ed',
    selected: '#ffd0c8',
    border: '#d85f4c',
    text: '#953c2d',
  },

  jenkins: {
    background: '#fff3e8',
    selected: '#ffd9bd',
    border: '#d98745',
    text: '#935321',
  },

  'docker-engine-ce': {
    background: '#eaf6ff',
    selected: '#c5e2f7',
    border: '#4d9bd1',
    text: '#28658e',
  },

  'docker-image': {
    background: '#eaf6ff',
    selected: '#c5e2f7',
    border: '#4d9bd1',
    text: '#28658e',
  },

  lemp: {
    background: '#eef9f1',
    selected: '#c8e8d0',
    border: '#63b77a',
    text: '#23753a',
  },

  llsmp: {
    background: '#eef9f1',
    selected: '#c8e8d0',
    border: '#63b77a',
    text: '#23753a',
  },

  'litespeed-web-server': {
    background: '#f1edff',
    selected: '#d8ceff',
    border: '#8066d8',
    text: '#55409d',
  },

  'litespeed-adc': {
    background: '#f1edff',
    selected: '#d8ceff',
    border: '#8066d8',
    text: '#55409d',
  },

  logstash: {
    background: '#eef9f8',
    selected: '#c9e8e5',
    border: '#55a7a0',
    text: '#34756f',
  },

  'opensearch-dashboards': {
    background: '#fff5e8',
    selected: '#ffe0b7',
    border: '#d99b42',
    text: '#916322',
  },

  // SQL
  mariadb: {
    background: '#edf6ff',
    selected: '#c8e0f5',
    border: '#5594c7',
    text: '#2d628b',
  },

  'mysql-ce': {
    background: '#edf6ff',
    selected: '#c8e0f5',
    border: '#5594c7',
    text: '#2d628b',
  },

  postgresql: {
    background: '#eef4ff',
    selected: '#cbdcff',
    border: '#5d83c5',
    text: '#365b94',
  },

  percona: {
    background: '#eef6ff',
    selected: '#c8ddf4',
    border: '#5791c3',
    text: '#315f88',
  },

  'pgpool-ii': {
    background: '#eef4ff',
    selected: '#cbdcff',
    border: '#5d83c5',
    text: '#365b94',
  },

  proxysql: {
    background: '#eef9f8',
    selected: '#c9e8e5',
    border: '#55a7a0',
    text: '#34756f',
  },

  // NoSQL
  'mongodb-ce': {
    background: '#edf9ef',
    selected: '#c8e8ce',
    border: '#55a866',
    text: '#337340',
  },

  'couchbase-ce': {
    background: '#eef9f4',
    selected: '#c8e9db',
    border: '#55aa87',
    text: '#32755c',
  },

  opensearch: {
    background: '#fff5e8',
    selected: '#ffe0b7',
    border: '#d99b42',
    text: '#916322',
  },

  // Cache
  redis: {
    background: '#fff0f0',
    selected: '#ffd0d0',
    border: '#d65b5b',
    text: '#9a3434',
  },

  memcached: {
    background: '#f1f3f7',
    selected: '#d8dde7',
    border: '#7e899d',
    text: '#4e596b',
  },

  // Storage
  'storage-standard': {
    background: '#f2f4f8',
    selected: '#d9dee8',
    border: '#8290a6',
    text: '#505d70',
  },

  'storage-high-performance': {
    background: '#eef4ff',
    selected: '#ccdafa',
    border: '#6384c5',
    text: '#3c5f99',
  },

  'minio-standard': {
    background: '#fff2e9',
    selected: '#ffd7c0',
    border: '#d97c43',
    text: '#965020',
  },

  'minio-high-performance': {
    background: '#fff2e9',
    selected: '#ffd7c0',
    border: '#d97c43',
    text: '#965020',
  },

  // VPS / Sistemas operacionais
  almalinux: {
    background: '#fff0f0',
    selected: '#ffd0d0',
    border: '#c95b5b',
    text: '#913535',
  },

  ubuntu: {
    background: '#fff2e8',
    selected: '#ffd4bd',
    border: '#dc7440',
    text: '#984b20',
  },

  debian: {
    background: '#fff0f3',
    selected: '#ffd0dc',
    border: '#c65b79',
    text: '#8d3650',
  },

  centos: {
    background: '#eef5ff',
    selected: '#ceddf5',
    border: '#6387bd',
    text: '#405f8d',
  },

  'windows-2016': {
    background: '#edf7ff',
    selected: '#c9e4f7',
    border: '#55a4d3',
    text: '#327397',
  },

  'windows-2019': {
    background: '#edf7ff',
    selected: '#c9e4f7',
    border: '#55a4d3',
    text: '#327397',
  },

  'windows-2022': {
    background: '#edf7ff',
    selected: '#c9e4f7',
    border: '#55a4d3',
    text: '#327397',
  },
};

function getStackColor(
  stackId: string
): StackColor {
  return (
    STACK_COLORS[stackId] ?? {
      background: '#f5f6f8',
      selected: '#dfe2e7',
      border: '#9aa1ad',
      text: '#4d5562',
    }
  );
}

export default function AddNodeModal({
  layer,
  onClose,
  onConfirm,
}: AddNodeModalProps) {
  const availableStacks =
    STACKS.filter(
      (stack) =>
        stack.layer === layer
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

  const layerNames: Record<
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
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              ADICIONAR NODE
            </span>

            <h2>
              {layerNames[
                layer
              ]}
            </h2>

            <p>
              Escolha a stack que deseja
              utilizar neste node.
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
        </div>

        <div className="stack-selection">
          {availableStacks.map(
            (stack) => {
              const isSelected =
                selectedStack ===
                stack.id;

              const colors =
                getStackColor(
                  stack.id
                );

              return (
                <button
                  key={
                    stack.id
                  }
                  type="button"
                  className={
                    isSelected
                      ? 'stack-option selected'
                      : 'stack-option'
                  }
                  style={{
                    backgroundColor:
                      isSelected
                        ? colors.selected
                        : colors.background,
                    borderColor:
                      isSelected
                        ? colors.border
                        : 'transparent',
                    color:
                      colors.text,
                  }}
                  onClick={() =>
                    setSelectedStack(
                      stack.id
                    )
                  }
                >
                  <div className="stack-option-name">
                    {
                      stack.name
                    }
                  </div>

                  <div
                    className="stack-option-price"
                    style={{
                      color:
                        colors.text,
                    }}
                  >
                    Grátis
                  </div>

                  {isSelected && (
                    <span className="stack-selected-check">
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

        <div className="modal-footer">
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
        </div>
      </div>
    </div>
  );
}