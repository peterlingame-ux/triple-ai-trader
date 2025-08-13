import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from "./hooks/useLanguage";
import { WalletProvider } from "./hooks/useWalletData";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <WalletProvider>
      <App />
    </WalletProvider>
  </LanguageProvider>
);
