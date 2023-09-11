import bcrypt from "bcryptjs";

// ==========================
// BCRYPT HELPER
// ==========================


// Hash the given plain text and return the hashed value
async function hash(plainText: string): Promise<string | null> {
  if (!plainText) return null;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainText, salt);
  return hashedPassword;
}

// Compare a password with its hashed version and return if they match
async function compare(password: string, hash: string): Promise<boolean> {
  const comparedPassword = await bcrypt.compare(password, hash);
  return comparedPassword;
}

export default {
  hash,
  compare,
};







