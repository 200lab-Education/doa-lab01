declare namespace grpc {
  interface AuthService {
    introspectToken(request: { token: string }, callback: (error: any, response: any) => void): void
    // Add other methods as needed
  }
}
