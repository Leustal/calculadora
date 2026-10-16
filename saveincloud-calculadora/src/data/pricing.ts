export const PRICING = {
  ipv4: {
    hourly: 0.028,
    monthly: 20.44,
  },

  ipv6: {
    hourly: 0.00411,
    monthly: 3.0,
  },

  storage: {
    hourly: 0.001,
    monthly: 0.73,
  },

  /**
   * Cloudlets reservados.
   *
   * O preço informado aqui é o preço efetivamente pago
   * por cloudlet reservado.
   *
   * O percentual de desconto é calculado em relação
   * ao preço-base do cloudlet dinâmico (R$ 0,0326/h).
   */
  reservedCloudlets: [
    {
      min: 1,
      max: 5,
      price: 0.023,
      discount: 29,
    },
    {
      min: 6,
      max: 20,
      price: 0.019,
      discount: 42,
    },
    {
      min: 21,
      max: 40,
      price: 0.015,
      discount: 54,
    },
    {
      min: 41,
      max: 130,
      price: 0.0137,
      discount: 58,
    },
    {
      min: 131,
      max: Infinity,
      price: 0.0126,
      discount: 61,
    },
  ],

  /**
   * Cloudlets dinâmicos.
   *
   * O primeiro tier representa o preço-base:
   *
   * 1 - 20 = R$ 0,0326/h
   *
   * Os demais tiers possuem desconto sobre esse
   * preço-base.
   */
  dynamicCloudlets: [
    {
      min: 1,
      max: 20,
      price: 0.0326,
      discount: 0,
    },
    {
      min: 21,
      max: 40,
      price: 0.0236,
      discount: 28,
    },
    {
      min: 41,
      max: 130,
      price: 0.0214,
      discount: 34,
    },
    {
      min: 131,
      max: Infinity,
      price: 0.0197,
      discount: 40,
    },
  ],

  /**
   * Tráfego externo.
   *
   * O tráfego interno entre nodes do ambiente é gratuito.
   */
  traffic: [
    {
      minGB: 0,
      maxGB: 1000,
      price: 0.24,
    },
    {
      minGB: 1000,
      maxGB: 5000,
      price: 0.153,
    },
    {
      minGB: 5000,
      maxGB: Infinity,
      price: 0.105,
    },
  ],

  /**
   * Recursos gratuitos.
   */
  ssl: 0,
  softwareStack: 0,
} as const;

export const HOURS_PER_DAY = 24;

export const HOURS_PER_MONTH = 730;