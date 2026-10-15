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

  reservedCloudlets: [
    {
      min: 1,
      max: 5,
      price: 0.023,
    },
    {
      min: 6,
      max: 20,
      price: 0.019,
    },
    {
      min: 21,
      max: 40,
      price: 0.015,
    },
    {
      min: 41,
      max: 130,
      price: 0.013,
    },
    {
      min: 131,
      max: Infinity,
      price: 0.012,
    },
  ],

  dynamicCloudlets: [
    {
      min: 1,
      max: 20,
      price: 0.032,
    },
    {
      min: 21,
      max: 40,
      price: 0.023,
    },
    {
      min: 41,
      max: 130,
      price: 0.021,
    },
    {
      min: 131,
      max: Infinity,
      price: 0.019,
    },
  ],

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

  ssl: 0,

  softwareStack: 0,
};

export const HOURS_PER_DAY = 24;

export const HOURS_PER_MONTH = 730;