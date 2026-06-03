import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider as CustomAuthProvider } from '@/context/AuthContext';
import { AuthProvider as NextAuthProvider } from '@/components/providers/AuthProvider';

export const metadata = {
  title: 'TripWell – Wisata Inklusif Bandung Barat',
  description: 'Eksplorasi alam tanpa hambatan. Wisata inklusif untuk semua kalangan di Bandung Barat.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <NextAuthProvider>
          <ThemeProvider>
            <CustomAuthProvider>
              {children}
            </CustomAuthProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
