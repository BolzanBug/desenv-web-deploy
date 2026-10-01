/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Gera .next/standalone com um server.js mínimo (usado no Dockerfile)
  output: 'standalone',
  // Em produção o Nginx manda /api/* para a API. Em desenvolvimento (npm run dev)
  // não tem Nginx, então o próprio Next faz esse papel.
  async rewrites() {
    if (process.env.NODE_ENV === 'production') return [];
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    return [{ source: '/api/:path*', destination: `${apiUrl}/:path*` }];
  },
};

export default nextConfig;
