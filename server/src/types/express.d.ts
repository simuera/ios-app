declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: { sub: string; email?: string; role?: string } | null;
    }
  }
}
export {};
