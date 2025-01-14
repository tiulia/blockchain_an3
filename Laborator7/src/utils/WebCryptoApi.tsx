export async function encryptPrivateKey(privateKey, password) {
  // Convert the private key to a buffer
  const privateKeyBuffer = new TextEncoder().encode(privateKey);

  // Derive a key from the password
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const csalt = crypto.getRandomValues(new Uint8Array(16));
  const civ = crypto.getRandomValues(new Uint8Array(12));

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: csalt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Encrypt the private key
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: civ, // Initialization vector
    },
    derivedKey,
    privateKeyBuffer
  );

  return {
    encryptedKey: encrypted,
    iv: civ, // Save the IV to decrypt later
    salt: csalt, // Save the salt for key derivation later
  };
}


export async function decryptPrivateKey(encryptedData, password, iv, salt) {
  // Derive the key again using the same password and salt
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // Decrypt the private key
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    derivedKey,
    encryptedData
  );

  return new TextDecoder().decode(decrypted);
}


