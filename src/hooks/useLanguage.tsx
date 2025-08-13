import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'app.title': 'Meta BrainX',
    'app.subtitle': '3- IN- 1 Ultimate Brain making money easier',
    'portfolio.total': 'Total Portfolio',
    'portfolio.change': '24h Change',
    'portfolio.trades': 'Active Trades',
    'market.overview': 'Market Overview',
    'ai.advisors': 'KING OF THE BRAIN',
    'actions.title': 'Quick Actions',
    'actions.execute': 'Execute Trade',
    'actions.analysis': 'Portfolio Analysis',
    'actions.risk': 'Risk Assessment',
    'actions.alerts': 'Market Alerts',
    'status.live': 'Live Market Data',
    'advisor.confidence': 'confident',
    'advisor.recommendation': 'Recommendation',
    'advisor.analysis': 'AI Analysis',
    'advisor.detailed': 'Get Detailed Analysis',
    'advisor.featured': '⭐ Featured'
  },
  zh: {
    'app.title': 'Meta BrainX',
    'app.subtitle': '3合1终极大脑让赚钱更简单',
    'portfolio.total': '总投资组合',
    'portfolio.change': '24小时变化',
    'portfolio.trades': '活跃交易',
    'market.overview': '市场概览',
    'ai.advisors': 'KING OF THE BRAIN',
    'actions.title': '快速操作',
    'actions.execute': '执行交易',
    'actions.analysis': '投资组合分析',
    'actions.risk': '风险评估',
    'actions.alerts': '市场提醒',
    'status.live': '实时市场数据',
    'advisor.confidence': '置信度',
    'advisor.recommendation': '推荐',
    'advisor.analysis': 'AI分析',
    'advisor.detailed': '获取详细分析',
    'advisor.featured': '⭐ 精选'
  },
  es: {
    'app.title': 'Meta BrainX',
    'app.subtitle': '3 EN 1 Cerebro Ultimate que hace ganar dinero más fácil',
    'portfolio.total': 'Portafolio Total',
    'portfolio.change': 'Cambio 24h',
    'portfolio.trades': 'Operaciones Activas',
    'market.overview': 'Resumen del Mercado',
    'ai.advisors': 'KING OF THE BRAIN',
    'actions.title': 'Acciones Rápidas',
    'actions.execute': 'Ejecutar Operación',
    'actions.analysis': 'Análisis de Portafolio',
    'actions.risk': 'Evaluación de Riesgo',
    'actions.alerts': 'Alertas de Mercado',
    'status.live': 'Datos de Mercado en Vivo',
    'advisor.confidence': 'confianza',
    'advisor.recommendation': 'Recomendación',
    'advisor.analysis': 'Análisis AI',
    'advisor.detailed': 'Obtener Análisis Detallado',
    'advisor.featured': '⭐ Destacado'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};