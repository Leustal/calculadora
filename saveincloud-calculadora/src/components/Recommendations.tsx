import {
  Lightbulb,
  ShieldCheck,
  Network,
  HardDrive,
  Database,
  Gauge,
} from 'lucide-react';

import type {
  Infrastructure,
} from '../types/infrastructure';

interface RecommendationsProps {
  infrastructure: Infrastructure;
}

interface Recommendation {
  title: string;
  text: string;
  icon: 'ha' | 'network' | 'storage' | 'database' | 'scale';
}

export default function Recommendations({
  infrastructure,
}: RecommendationsProps) {
  const nodes =
    infrastructure.nodes;

  const applicationNodes =
    nodes.filter(
      (node) =>
        node.layer ===
        'application'
    );

  const loadBalancers =
    nodes.filter(
      (node) =>
        node.layer ===
        'load-balancer'
    );

  const sqlNodes =
    nodes.filter(
      (node) =>
        node.layer ===
        'sql'
    );

  const storageMaximum =
    nodes.reduce(
      (total, node) =>
        total +
        node.storageGB,
      0
    );

  const publicIpv4 =
    nodes.filter(
      (node) =>
        node.ipv4
    ).length;

  const recommendations: Recommendation[] =
    [];

  if (
    applicationNodes.length >= 2 &&
    loadBalancers.length === 0
  ) {
    recommendations.push({
      title:
        'Considere um balanceador',
      text:
        'Você possui múltiplos nodes de aplicação sem uma camada de balanceamento. Um Load Balancer pode distribuir o tráfego entre eles.',
      icon: 'network',
    });
  }

  if (
    applicationNodes.length === 1
  ) {
    recommendations.push({
      title:
        'Avalie alta disponibilidade',
      text:
        'A aplicação possui apenas um node. Para reduzir o risco de indisponibilidade, considere dois ou mais nodes.',
      icon: 'ha',
    });
  }

  if (
    sqlNodes.length === 1 &&
    applicationNodes.length >= 2
  ) {
    recommendations.push({
      title:
        'Banco pode ser o ponto único',
      text:
        'A aplicação possui múltiplos nodes, mas o SQL está em um único node. Avalie a estratégia de alta disponibilidade do banco.',
      icon: 'database',
    });
  }

  if (
    publicIpv4 > 1
  ) {
    recommendations.push({
      title:
        'Revise os IPv4 públicos',
      text:
        `${publicIpv4} nodes possuem IPv4 público. Verifique se todos precisam de exposição direta à internet.`,
      icon: 'network',
    });
  }

  if (
    storageMaximum >= 50
  ) {
    recommendations.push({
      title:
        'Storage representa uma parcela relevante',
      text:
        `Você configurou ${storageMaximum} GB de capacidade. Confirme se essa capacidade está alinhada ao crescimento esperado.`,
      icon: 'storage',
    });
  }

  const hasCache =
    nodes.some(
      (node) =>
        node.layer ===
        'cache'
    );

  if (
    applicationNodes.length >= 2 &&
    !hasCache
  ) {
    recommendations.push({
      title:
        'Considere uma camada de cache',
      text:
        'Para aplicações com múltiplos nodes, um cache compartilhado pode ajudar a reduzir consultas repetitivas e carga da aplicação.',
      icon: 'scale',
    });
  }

  if (
    recommendations.length === 0
  ) {
    recommendations.push({
      title:
        'Configuração consistente',
      text:
        'Não encontramos alertas básicos nesta configuração. Continue validando capacidade, disponibilidade e necessidade de cada recurso.',
      icon: 'ha',
    });
  }

  return (
    <section className="recommendations-panel">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">
            ASSISTENTE
          </span>
          <h2>
            Recomendações
          </h2>
          <p>
            Alguns pontos que vale revisar
            antes de fechar o dimensionamento.
          </p>
        </div>

        <Lightbulb
          size={22}
          strokeWidth={1.8}
        />
      </div>

      <div className="recommendation-list">
        {recommendations.map(
          (recommendation, index) => (
            <article
              key={`${recommendation.title}-${index}`}
              className="recommendation-card"
            >
              <div className="recommendation-icon">
                {recommendation.icon ===
                  'ha' && (
                  <ShieldCheck
                    size={18}
                  />
                )}

                {recommendation.icon ===
                  'network' && (
                  <Network
                    size={18}
                  />
                )}

                {recommendation.icon ===
                  'storage' && (
                  <HardDrive
                    size={18}
                  />
                )}

                {recommendation.icon ===
                  'database' && (
                  <Database
                    size={18}
                  />
                )}

                {recommendation.icon ===
                  'scale' && (
                  <Gauge
                    size={18}
                  />
                )}
              </div>

              <div>
                <strong>
                  {recommendation.title}
                </strong>
                <p>
                  {recommendation.text}
                </p>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}
