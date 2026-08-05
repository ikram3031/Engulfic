import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'ENGULFIC | Avant-Garde Luxury & Fashion Store',
  description: 'Shop Engulfic modern fashion e-commerce store featuring Japanese selvedge denim, Italian merino trench coats, and sculptural footwear.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-400 selection:text-zinc-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
