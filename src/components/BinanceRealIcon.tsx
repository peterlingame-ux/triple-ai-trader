import React from 'react';

interface BinanceRealIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

// 币安真实图标映射 - 使用币安官方图标URL
const BINANCE_ICON_URLS = {
  // 主流币种
  BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
  STETH: 'https://cryptologos.cc/logos/steth-steth-logo.png',
  ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
  SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  DOGE: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
  
  // Top 11-30
  TRX: 'https://cryptologos.cc/logos/tron-trx-logo.png',
  TON: 'https://cryptologos.cc/logos/toncoin-ton-logo.png',
  AVAX: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  DOT: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
  MATIC: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  SHIB: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
  LTC: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
  BCH: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png',
  LINK: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
  XLM: 'https://cryptologos.cc/logos/stellar-xlm-logo.png',
  UNI: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
  ATOM: 'https://cryptologos.cc/logos/cosmos-atom-logo.png',
  ETC: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.png',
  HBAR: 'https://cryptologos.cc/logos/hedera-hbar-logo.png',
  FIL: 'https://cryptologos.cc/logos/filecoin-fil-logo.png',
  ICP: 'https://cryptologos.cc/logos/internet-computer-icp-logo.png',
  CRO: 'https://cryptologos.cc/logos/cronos-cro-logo.png',
  APT: 'https://cryptologos.cc/logos/aptos-apt-logo.png',
  NEAR: 'https://cryptologos.cc/logos/near-protocol-near-logo.png',
  VET: 'https://cryptologos.cc/logos/vechain-vet-logo.png',
  
  // Top 31-60
  GRT: 'https://cryptologos.cc/logos/the-graph-grt-logo.png',
  ALGO: 'https://cryptologos.cc/logos/algorand-algo-logo.png',
  QNT: 'https://cryptologos.cc/logos/quant-qnt-logo.png',
  MANA: 'https://cryptologos.cc/logos/decentraland-mana-logo.png',
  SAND: 'https://cryptologos.cc/logos/the-sandbox-sand-logo.png',
  AAVE: 'https://cryptologos.cc/logos/aave-aave-logo.png',
  MKR: 'https://cryptologos.cc/logos/maker-mkr-logo.png',
  LRC: 'https://cryptologos.cc/logos/loopring-lrc-logo.png',
  ENJ: 'https://cryptologos.cc/logos/enjin-coin-enj-logo.png',
  BAT: 'https://cryptologos.cc/logos/basic-attention-token-bat-logo.png',
  ZEC: 'https://cryptologos.cc/logos/zcash-zec-logo.png',
  COMP: 'https://cryptologos.cc/logos/compound-comp-logo.png',
  YFI: 'https://cryptologos.cc/logos/yearn-finance-yfi-logo.png',
  SNX: 'https://cryptologos.cc/logos/synthetix-snx-logo.png',
  '1INCH': 'https://cryptologos.cc/logos/1inch-1inch-logo.png',
  REN: 'https://cryptologos.cc/logos/ren-ren-logo.png',
  KNC: 'https://cryptologos.cc/logos/kyber-network-crystal-knc-logo.png',
  CRV: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
  UMA: 'https://cryptologos.cc/logos/uma-uma-logo.png',
  BAL: 'https://cryptologos.cc/logos/balancer-bal-logo.png',
  
  // Top 61-100
  SUSHI: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
  FTM: 'https://cryptologos.cc/logos/fantom-ftm-logo.png',
  FLOW: 'https://cryptologos.cc/logos/flow-flow-logo.png',
  EGLD: 'https://cryptologos.cc/logos/multiversx-egld-logo.png',
  ONE: 'https://cryptologos.cc/logos/harmony-one-logo.png',
  HIVE: 'https://cryptologos.cc/logos/hive-hive-logo.png',
  THETA: 'https://cryptologos.cc/logos/theta-token-theta-logo.png',
  TFUEL: 'https://cryptologos.cc/logos/theta-fuel-tfuel-logo.png',
  KAVA: 'https://cryptologos.cc/logos/kava-kava-logo.png',
  BAND: 'https://cryptologos.cc/logos/band-protocol-band-logo.png',
  RVN: 'https://cryptologos.cc/logos/ravencoin-rvn-logo.png',
  ZIL: 'https://cryptologos.cc/logos/zilliqa-zil-logo.png',
  ICX: 'https://cryptologos.cc/logos/icon-icx-logo.png',
  ONT: 'https://cryptologos.cc/logos/ontology-ont-logo.png',
  QTUM: 'https://cryptologos.cc/logos/qtum-qtum-logo.png',
  WAVES: 'https://cryptologos.cc/logos/waves-waves-logo.png',
  SC: 'https://cryptologos.cc/logos/siacoin-sc-logo.png',
  DGB: 'https://cryptologos.cc/logos/digibyte-dgb-logo.png',
  LSK: 'https://cryptologos.cc/logos/lisk-lsk-logo.png',
  ARK: 'https://cryptologos.cc/logos/ark-ark-logo.png',
  NANO: 'https://cryptologos.cc/logos/nano-nano-logo.png',
  IOST: 'https://cryptologos.cc/logos/iost-iost-logo.png',
  ZEN: 'https://cryptologos.cc/logos/horizen-zen-logo.png',
  MAID: 'https://cryptologos.cc/logos/maidsafecoin-maid-logo.png',
  REP: 'https://cryptologos.cc/logos/augur-rep-logo.png',
  KMD: 'https://cryptologos.cc/logos/komodo-kmd-logo.png',
  DCR: 'https://cryptologos.cc/logos/decred-dcr-logo.png',
  STRAT: 'https://cryptologos.cc/logos/stratis-strax-logo.png',
  NXT: 'https://cryptologos.cc/logos/nxt-nxt-logo.png',
  SYS: 'https://cryptologos.cc/logos/syscoin-sys-logo.png',
  
  // Meme coins
  PEPE: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
  BONK: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg',
  WIF: 'https://assets.coingecko.com/coins/images/33767/large/dogwifhat.jpg',
  FLOKI: 'https://cryptologos.cc/logos/floki-inu-floki-logo.png',
  BABYDOGE: 'https://assets.coingecko.com/coins/images/16125/large/baby-doge-coin.jpg',
  SAFE: 'https://cryptologos.cc/logos/safemoon-safemoon-logo.png',
  MEME: 'https://assets.coingecko.com/coins/images/32750/large/memecoin.png',
  WOJAK: 'https://assets.coingecko.com/coins/images/30323/large/wojak-logo.png',
  TURBO: 'https://assets.coingecko.com/coins/images/30045/large/turbo.png',
  LADYS: 'https://assets.coingecko.com/coins/images/30462/large/milady.jpg',
  TRUMP: 'https://assets.coingecko.com/coins/images/33335/large/trump-avatar.jpg',
  
  // 新增币种
  OKB: 'https://cryptologos.cc/logos/okb-okb-logo.png',
  PENGU: 'https://assets.coingecko.com/coins/images/34238/large/PENGU-200x200.png'
};

// 备用图标URL（如果主图标加载失败）
const getFallbackIconUrl = (symbol: string) => {
  return `https://assets.coingecko.com/coins/images/1/large/${symbol.toLowerCase()}.png`;
};

export const BinanceRealIcon: React.FC<BinanceRealIconProps> = ({
  symbol,
  size = 32,
  className = ""
}) => {
  const iconUrl = BINANCE_ICON_URLS[symbol as keyof typeof BINANCE_ICON_URLS] || 
    getFallbackIconUrl(symbol);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // 尝试备用URL
    if (!target.src.includes('coingecko.com')) {
      target.src = getFallbackIconUrl(symbol);
    } else {
      // 如果备用URL也失败，显示默认图标
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        parent.innerHTML = `
          <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
            ${symbol.charAt(0)}
          </div>
        `;
      }
    }
  };

  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-white/10 backdrop-blur-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={iconUrl}
        alt={`${symbol} logo`}
        className="w-full h-full object-cover rounded-full"
        onError={handleImageError}
        loading="lazy"
      />
      {/* 光环效果 */}
      <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-2 group-hover:ring-primary/40 transition-all duration-300"></div>
    </div>
  );
};

export default BinanceRealIcon;