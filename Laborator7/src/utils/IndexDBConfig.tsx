export const IndexDBConfig = {
  name: "KeysDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "accounts",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "publicKey", keypath: "publicKey", options: { unique: true } },
        { name: "encryptedPrivateKey", keypath: "encryptedPrivateKey", options: { unique: false } },
        { name: "encryptedPassword", keypath: "encryptedPassword", options: { unique: false } },
        { name: "salt", keypath: "salt", options: { unique: false } },
        { name: "iv", keypath: "iv", options: { unique: false } },
      ],
    },
  ],
};