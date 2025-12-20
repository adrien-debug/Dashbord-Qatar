import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { Layout } from '../components/layout';

// Pages sans sidebar (expérience immersive)
const fullscreenPages = ['/unreal-viewer', '/project'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isFullscreen = fullscreenPages.includes(router.pathname);

  // Page 3D viewer = pas de sidebar, expérience plein écran
  if (isFullscreen) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

