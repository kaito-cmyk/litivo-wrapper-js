import dotenv from 'dotenv';
dotenv.config();

console.log('litivoEmail:', process.env.litivoEmail);

const wrapper: string = 'litivo';

/** TODO: Find a safer way to store and access these credentials. */
export class UserCredentials {
  public static get email(): string {
    const email = process.env[`${wrapper}Email`];
    if (!email) throw new Error(`Variable ${wrapper}Email no encontrada en .env`);
    return email;
  }

  public static get password(): string {
    const password = process.env[`${wrapper}Password`];
    if (!password) throw new Error(`Variable ${wrapper}Password no encontrada en .env`);
    return password;
  }

  private constructor() {}
}
