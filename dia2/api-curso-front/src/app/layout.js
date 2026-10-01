import { Atkinson_Hyperlegible, Caveat } from 'next/font/google';
import './globals.css';

// Letra de mão: só nos títulos
const caveat = Caveat({
  variable: '--font-hand',
  subsets: ['latin'],
  weight: ['600', '700'],
});

// Texto corrido: fonte pensada para leitura fácil
const atkinson = Atkinson_Hyperlegible({
  variable: '--font-text',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata = {
  title: 'Minhas tarefas',
  description: 'Lista de tarefas do curso de API, banco de dados e deploy na AWS.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${caveat.variable} ${atkinson.variable}`}>
      <body>{children}</body>
    </html>
  );
}
