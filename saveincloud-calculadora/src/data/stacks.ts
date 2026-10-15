import type {
  LayerType,
} from '../types/infrastructure';

export type {
  LayerType,
} from '../types/infrastructure';

export interface StackDefinition {
  id: string;
  name: string;
  layer: LayerType;
}

export interface LayerDefinition {
  id: LayerType;
  name: string;
  description: string;
}

export const LAYERS: LayerDefinition[] = [
  {
    id: 'load-balancer',
    name: 'Balanceador de carga',
    description:
      'Distribua o tráfego entre seus servidores.',
  },

  {
    id: 'application',
    name: 'Servidor de aplicação',
    description:
      'Execute suas aplicações e serviços.',
  },

  {
    id: 'sql',
    name: 'Banco SQL',
    description:
      'Bancos de dados relacionais.',
  },

  {
    id: 'nosql',
    name: 'Banco NoSQL',
    description:
      'Bancos de dados não relacionais.',
  },

  {
    id: 'cache',
    name: 'Cache',
    description:
      'Armazenamento de dados em memória.',
  },

  {
    id: 'storage',
    name: 'Storage',
    description:
      'Armazenamento de arquivos e objetos.',
  },

  {
    id: 'vps',
    name: 'VPS',
    description:
      'Servidores virtuais para uso geral.',
  },
];

export const STACKS: StackDefinition[] = [
  /*
   * BALANCEADORES
   */

  {
    id: 'nginx',
    name: 'NGINX',
    layer: 'load-balancer',
  },

  {
    id: 'haproxy',
    name: 'HAProxy',
    layer: 'load-balancer',
  },

  {
    id: 'apache-balancer',
    name: 'Apache Balancer',
    layer: 'load-balancer',
  },

  {
    id: 'varnish',
    name: 'Varnish',
    layer: 'load-balancer',
  },

  /*
   * SERVIDORES DE APLICAÇÃO
   */

  {
    id: 'apache',
    name: 'Apache',
    layer: 'application',
  },

  {
    id: 'apache-python-ruby',
    name: 'Apache Python/Ruby',
    layer: 'application',
  },

  {
    id: 'nginx-ruby',
    name: 'NGINX Ruby',
    layer: 'application',
  },

  {
    id: 'nodejs',
    name: 'Node.js',
    layer: 'application',
  },

  {
    id: 'python-engine',
    name: 'Python Engine',
    layer: 'application',
  },

  {
    id: 'dotnet-core',
    name: '.NET Core',
    layer: 'application',
  },

  {
    id: 'golang',
    name: 'Golang',
    layer: 'application',
  },

  {
    id: 'java-engine',
    name: 'Java Engine',
    layer: 'application',
  },

  {
    id: 'jetty',
    name: 'Jetty',
    layer: 'application',
  },

  {
    id: 'tomcat',
    name: 'Tomcat',
    layer: 'application',
  },

  {
    id: 'tomee',
    name: 'TomEE+',
    layer: 'application',
  },

  {
    id: 'glassfish',
    name: 'GlassFish',
    layer: 'application',
  },

  {
    id: 'payara',
    name: 'Payara',
    layer: 'application',
  },

  {
    id: 'wildfly',
    name: 'WildFly',
    layer: 'application',
  },

  {
    id: 'spring-boot',
    name: 'Spring Boot',
    layer: 'application',
  },

  {
    id: 'maven',
    name: 'Maven',
    layer: 'application',
  },

  {
    id: 'jenkins',
    name: 'Jenkins',
    layer: 'application',
  },

  {
    id: 'docker-engine-ce',
    name: 'Docker Engine CE',
    layer: 'application',
  },

  {
    id: 'docker-image',
    name: 'Docker Image',
    layer: 'application',
  },

  {
    id: 'lemp',
    name: 'LEMP',
    layer: 'application',
  },

  {
    id: 'llsmp',
    name: 'LLSMP',
    layer: 'application',
  },

  {
    id: 'litespeed-web-server',
    name: 'LiteSpeed Web Server',
    layer: 'application',
  },

  {
    id: 'litespeed-adc',
    name: 'LiteSpeed ADC',
    layer: 'application',
  },

  {
    id: 'logstash',
    name: 'Logstash',
    layer: 'application',
  },

  {
    id: 'opensearch-dashboards',
    name: 'OpenSearch Dashboards',
    layer: 'application',
  },

  /*
   * BANCOS SQL
   */

  {
    id: 'mariadb',
    name: 'MariaDB',
    layer: 'sql',
  },

  {
    id: 'mysql-ce',
    name: 'MySQL CE',
    layer: 'sql',
  },

  {
    id: 'postgresql',
    name: 'PostgreSQL',
    layer: 'sql',
  },

  {
    id: 'percona',
    name: 'Percona',
    layer: 'sql',
  },

  {
    id: 'pgpool-ii',
    name: 'Pgpool-II',
    layer: 'sql',
  },

  {
    id: 'proxysql',
    name: 'ProxySQL',
    layer: 'sql',
  },

  /*
   * BANCOS NOSQL
   */

  {
    id: 'mongodb-ce',
    name: 'MongoDB CE',
    layer: 'nosql',
  },

  {
    id: 'couchbase-ce',
    name: 'Couchbase CE',
    layer: 'nosql',
  },

  {
    id: 'opensearch',
    name: 'OpenSearch',
    layer: 'nosql',
  },

  /*
   * CACHE
   */

  {
    id: 'redis',
    name: 'Redis',
    layer: 'cache',
  },

  {
    id: 'memcached',
    name: 'Memcached',
    layer: 'cache',
  },

  /*
   * STORAGE
   */

  {
    id: 'storage-standard',
    name: 'Storage Standard Performance',
    layer: 'storage',
  },

  {
    id: 'storage-high-performance',
    name: 'Storage High Performance',
    layer: 'storage',
  },

  {
    id: 'minio-standard',
    name: 'MinIO Standard',
    layer: 'storage',
  },

  {
    id: 'minio-high-performance',
    name: 'MinIO High Performance',
    layer: 'storage',
  },

  /*
   * VPS / SISTEMAS OPERACIONAIS
   */

  {
    id: 'almalinux',
    name: 'AlmaLinux',
    layer: 'vps',
  },

  {
    id: 'ubuntu',
    name: 'Ubuntu',
    layer: 'vps',
  },

  {
    id: 'debian',
    name: 'Debian',
    layer: 'vps',
  },

  {
    id: 'centos',
    name: 'CentOS',
    layer: 'vps',
  },

  {
    id: 'windows-2016',
    name: 'Windows Server 2016',
    layer: 'vps',
  },

  {
    id: 'windows-2019',
    name: 'Windows Server 2019',
    layer: 'vps',
  },

  {
    id: 'windows-2022',
    name: 'Windows Server 2022',
    layer: 'vps',
  },
];
export function getStackById(
  id: string
): StackDefinition | undefined {
  return STACKS.find(
    (stack) =>
      stack.id === id
  );

}
export interface StackTheme {
  color: string;
  background: string;
  border: string;
  darkBackground: string;
}

export function getStackTheme(
  stackId: string
): StackTheme {
  const themes: Record<
    string,
    StackTheme
  > = {
    // =====================================================
    // LOAD BALANCERS
    // =====================================================

    nginx: {
      color: '#16834b',
      background: '#eaf8f0',
      border: '#b9e5cb',
      darkBackground: '#cdeedb',
    },

    haproxy: {
      color: '#c0392b',
      background: '#fff0ee',
      border: '#f0c2bc',
      darkBackground: '#f7d8d3',
    },

    'apache-balancer': {
      color: '#c62828',
      background: '#fff0f0',
      border: '#efc2c2',
      darkBackground: '#f7d8d8',
    },

    varnish: {
      color: '#8e44ad',
      background: '#f7effa',
      border: '#dfc4e8',
      darkBackground: '#ead9f0',
    },

    // =====================================================
    // APPLICATION
    // =====================================================

    apache: {
      color: '#c62828',
      background: '#fff0f0',
      border: '#efc2c2',
      darkBackground: '#f7d8d8',
    },

    'apache-python-ruby': {
      color: '#c62828',
      background: '#fff0f0',
      border: '#efc2c2',
      darkBackground: '#f7d8d8',
    },

    'nginx-ruby': {
      color: '#16834b',
      background: '#eaf8f0',
      border: '#b9e5cb',
      darkBackground: '#cdeedb',
    },

    nodejs: {
      color: '#2e7d32',
      background: '#edf8ee',
      border: '#c5e5c7',
      darkBackground: '#d8efd9',
    },

    'python-engine': {
      color: '#3776ab',
      background: '#edf5fc',
      border: '#c5dcee',
      darkBackground: '#d9eafa',
    },

    'dotnet-core': {
      color: '#6c3fc5',
      background: '#f3edff',
      border: '#d7c7f2',
      darkBackground: '#e5d9fa',
    },

    golang: {
      color: '#007d9c',
      background: '#eaf8fb',
      border: '#b9e2ea',
      darkBackground: '#d5f0f5',
    },

    'java-engine': {
      color: '#d35400',
      background: '#fff3e9',
      border: '#f0cfb5',
      darkBackground: '#f8dfcc',
    },

    jetty: {
      color: '#d35400',
      background: '#fff3e9',
      border: '#f0cfb5',
      darkBackground: '#f8dfcc',
    },

    tomcat: {
      color: '#d35400',
      background: '#fff3e9',
      border: '#f0cfb5',
      darkBackground: '#f8dfcc',
    },

    tomee: {
      color: '#d35400',
      background: '#fff3e9',
      border: '#f0cfb5',
      darkBackground: '#f8dfcc',
    },

    glassfish: {
      color: '#2676a8',
      background: '#edf6fb',
      border: '#c4dce9',
      darkBackground: '#d8ecf5',
    },

    payara: {
      color: '#168f8a',
      background: '#eaf8f7',
      border: '#bce2df',
      darkBackground: '#d5efed',
    },

    wildfly: {
      color: '#e65c00',
      background: '#fff3e9',
      border: '#f0ceb5',
      darkBackground: '#f8dfcc',
    },

    'spring-boot': {
      color: '#5b8c1f',
      background: '#f1f8e9',
      border: '#d0e3b8',
      darkBackground: '#e2f0d2',
    },

    maven: {
      color: '#c62828',
      background: '#fff0f0',
      border: '#efc2c2',
      darkBackground: '#f7d8d8',
    },

    jenkins: {
      color: '#d24939',
      background: '#fff1ee',
      border: '#efc6c0',
      darkBackground: '#f8ddd9',
    },

    'docker-engine-ce': {
      color: '#2496ed',
      background: '#edf7ff',
      border: '#bfdef5',
      darkBackground: '#d8edfc',
    },

    'docker-image': {
      color: '#2496ed',
      background: '#edf7ff',
      border: '#bfdef5',
      darkBackground: '#d8edfc',
    },

    lemp: {
      color: '#16834b',
      background: '#eaf8f0',
      border: '#b9e5cb',
      darkBackground: '#cdeedb',
    },

    llsmp: {
      color: '#16834b',
      background: '#eaf8f0',
      border: '#b9e5cb',
      darkBackground: '#cdeedb',
    },

    'litespeed-web-server': {
      color: '#f28c28',
      background: '#fff5e9',
      border: '#f0d3b1',
      darkBackground: '#fae3c9',
    },

    'litespeed-adc': {
      color: '#f28c28',
      background: '#fff5e9',
      border: '#f0d3b1',
      darkBackground: '#fae3c9',
    },

    logstash: {
      color: '#005571',
      background: '#edf7fa',
      border: '#bfdde5',
      darkBackground: '#d8edf2',
    },

    'opensearch-dashboards': {
      color: '#005571',
      background: '#edf7fa',
      border: '#bfdde5',
      darkBackground: '#d8edf2',
    },

    // =====================================================
    // SQL
    // =====================================================

    mariadb: {
      color: '#00678c',
      background: '#edf7fb',
      border: '#bddde9',
      darkBackground: '#d8edf4',
    },

    'mysql-ce': {
      color: '#00758f',
      background: '#edf8fb',
      border: '#bddfe7',
      darkBackground: '#d7eef3',
    },

    postgresql: {
      color: '#336791',
      background: '#edf4fa',
      border: '#c4d7e8',
      darkBackground: '#d9e8f5',
    },

    percona: {
      color: '#e86b2a',
      background: '#fff3eb',
      border: '#f0ceb9',
      darkBackground: '#f8dfd0',
    },

    'pgpool-ii': {
      color: '#336791',
      background: '#edf4fa',
      border: '#c4d7e8',
      darkBackground: '#d9e8f5',
    },

    proxysql: {
      color: '#e67e22',
      background: '#fff5ea',
      border: '#efd3b3',
      darkBackground: '#fae4cf',
    },

    // =====================================================
    // NOSQL
    // =====================================================

    'mongodb-ce': {
      color: '#168a45',
      background: '#eaf8ef',
      border: '#bce3ca',
      darkBackground: '#d5efdf',
    },

    'couchbase-ce': {
      color: '#ea4c3c',
      background: '#fff1ef',
      border: '#f0c8c3',
      darkBackground: '#f8dedb',
    },

    opensearch: {
      color: '#005571',
      background: '#edf7fa',
      border: '#bfdde5',
      darkBackground: '#d8edf2',
    },

    // =====================================================
    // CACHE
    // =====================================================

    redis: {
      color: '#d82c20',
      background: '#fff0ef',
      border: '#efc5c2',
      darkBackground: '#f8dad7',
    },

    memcached: {
      color: '#3d7ea6',
      background: '#edf6fb',
      border: '#c4dce9',
      darkBackground: '#d8ecf5',
    },

    // =====================================================
    // STORAGE
    // =====================================================

    'storage-standard': {
      color: '#596b7f',
      background: '#f0f3f6',
      border: '#d2dbe4',
      darkBackground: '#e0e6ec',
    },

    'storage-high-performance': {
      color: '#6c3fc5',
      background: '#f3edff',
      border: '#d7c7f2',
      darkBackground: '#e5d9fa',
    },

    'minio-standard': {
      color: '#c62828',
      background: '#fff0f0',
      border: '#efc2c2',
      darkBackground: '#f7d8d8',
    },

    'minio-high-performance': {
      color: '#c62828',
      background: '#fff0f0',
      border: '#efc2c2',
      darkBackground: '#f7d8d8',
    },

    // =====================================================
    // VPS
    // =====================================================

    almalinux: {
      color: '#0b6e99',
      background: '#edf7fb',
      border: '#bfdae7',
      darkBackground: '#d8ebf3',
    },

    ubuntu: {
      color: '#e95420',
      background: '#fff1eb',
      border: '#f0cbbb',
      darkBackground: '#f8ddd0',
    },

    debian: {
      color: '#a81d33',
      background: '#fff0f3',
      border: '#e6c2ca',
      darkBackground: '#f4d9de',
    },

    centos: {
      color: '#932279',
      background: '#f9edf7',
      border: '#e4c7dd',
      darkBackground: '#efdce9',
    },

    'windows-2016': {
      color: '#0078d4',
      background: '#edf6ff',
      border: '#bddcf5',
      darkBackground: '#d7ebfb',
    },

    'windows-2019': {
      color: '#0078d4',
      background: '#edf6ff',
      border: '#bddcf5',
      darkBackground: '#d7ebfb',
    },

    'windows-2022': {
      color: '#0078d4',
      background: '#edf6ff',
      border: '#bddcf5',
      darkBackground: '#d7ebfb',
    },
  };

  return (
    themes[stackId] ?? {
      color: '#3471dc',
      background: '#edf3ff',
      border: '#c9daf6',
      darkBackground: '#dce9ff',
    }
  );
}