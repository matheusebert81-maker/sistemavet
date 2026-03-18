export const base44 = {
  entities: new Proxy({}, {
    get: (target, prop) => ({
      list: async () => [],
      create: async (data) => ({ id: Math.random().toString(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ id }),
      filter: async () => []
    })
  }),
  integrations: {
    Core: {
      SendEmail: async () => console.log('Email sent mock')
    }
  }
};