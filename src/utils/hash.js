import argon2 from "argon2";

export const hashPassword = async (password) => {
  return await argon2.hash(password);
};

export const verifyPassword = async (passwordDb, passwordInput) => {
  return await argon2.verify(passwordDb, passwordInput);
};
