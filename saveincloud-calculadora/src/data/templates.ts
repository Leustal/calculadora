import type {
  Infrastructure,
} from '../types/infrastructure';

export interface InfrastructureTemplate {
  id: string;
  name: string;
  description: string;
  infrastructure: Infrastructure;
}

function node(
  id: string,
  layer: Infrastructure['nodes'][number]['layer'],
  stackId: string,
  name: string,
  reservedCloudlets = 1,
  dynamicCloudlets = 4,
  storageGB = 10,
  ipv4 = false,
  ipv6 = false
) {
  return {
    id,
    layer,
    stackId,
    name,
    reservedCloudlets,
    dynamicCloudlets,
    storageGB,
    ipv4,
    ipv6,
  };
}

export const TEMPLATES: InfrastructureTemplate[] = [
  {
    id: 'php-site',
    name: 'Site PHP',
    description:
      'NGINX na entrada, Apache para a aplicação e MariaDB.',
    infrastructure: {
      nodes: [
        node(
          'template-php-nginx-1',
          'load-balancer',
          'nginx',
          'nginx-1',
          1,
          4,
          10,
          true
        ),
        node(
          'template-php-apache-1',
          'application',
          'apache',
          'apache-1',
          1,
          4,
          10
        ),
        node(
          'template-php-mariadb-1',
          'sql',
          'mariadb',
          'mariadb-1',
          1,
          4,
          20
        ),
      ],
    },
  },
  {
    id: 'node-postgresql',
    name: 'Node.js + PostgreSQL',
    description:
      'API Node.js com PostgreSQL e Redis para cache.',
    infrastructure: {
      nodes: [
        node(
          'template-node-nginx-1',
          'load-balancer',
          'nginx',
          'nginx-1',
          1,
          4,
          10,
          true
        ),
        node(
          'template-node-app-1',
          'application',
          'nodejs',
          'nodejs-1',
          1,
          8,
          10
        ),
        node(
          'template-node-postgres-1',
          'sql',
          'postgresql',
          'postgresql-1',
          1,
          4,
          30
        ),
        node(
          'template-node-redis-1',
          'cache',
          'redis',
          'redis-1',
          1,
          4,
          10
        ),
      ],
    },
  },
  {
    id: 'dotnet-postgresql',
    name: '.NET + PostgreSQL',
    description:
      'Aplicação .NET Core com PostgreSQL e Redis.',
    infrastructure: {
      nodes: [
        node(
          'template-dotnet-nginx-1',
          'load-balancer',
          'nginx',
          'nginx-1',
          1,
          4,
          10,
          true
        ),
        node(
          'template-dotnet-app-1',
          'application',
          'dotnet-core',
          'dotnet-core-1',
          1,
          8,
          10
        ),
        node(
          'template-dotnet-postgres-1',
          'sql',
          'postgresql',
          'postgresql-1',
          1,
          4,
          30
        ),
        node(
          'template-dotnet-redis-1',
          'cache',
          'redis',
          'redis-1',
          1,
          4,
          10
        ),
      ],
    },
  },
  {
    id: 'docker-postgresql',
    name: 'Docker + PostgreSQL',
    description:
      'Docker Engine CE para workloads com PostgreSQL.',
    infrastructure: {
      nodes: [
        node(
          'template-docker-app-1',
          'application',
          'docker-engine-ce',
          'docker-engine-ce-1',
          1,
          8,
          20,
          true
        ),
        node(
          'template-docker-postgres-1',
          'sql',
          'postgresql',
          'postgresql-1',
          1,
          4,
          30
        ),
      ],
    },
  },
  {
    id: 'high-availability',
    name: 'Alta disponibilidade',
    description:
      'Balanceador, duas aplicações e banco em dois nodes.',
    infrastructure: {
      nodes: [
        node(
          'template-ha-lb-1',
          'load-balancer',
          'haproxy',
          'haproxy-1',
          1,
          4,
          10,
          true
        ),
        node(
          'template-ha-app-1',
          'application',
          'nodejs',
          'nodejs-1',
          1,
          8,
          10
        ),
        node(
          'template-ha-app-2',
          'application',
          'nodejs',
          'nodejs-2',
          1,
          8,
          10
        ),
        node(
          'template-ha-db-1',
          'sql',
          'postgresql',
          'postgresql-1',
          1,
          8,
          50
        ),
        node(
          'template-ha-db-2',
          'sql',
          'postgresql',
          'postgresql-2',
          1,
          8,
          50
        ),
      ],
    },
  },
];
