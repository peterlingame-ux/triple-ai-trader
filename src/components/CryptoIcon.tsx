import React, { useState, useCallback, useEffect } from 'react';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

// 完整的93个货币图标映射 - 使用多个可靠源
const CRYPTO_ICONS: Record<string, string[]> = {
  // Top 10 主流币种
  BTC: [
    'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
  ],
  ETH: [
    'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
  ],
  USDT: [
    'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    'https://cryptologos.cc/logos/tether-usdt-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png'
  ],
  BNB: [
    'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
  ],
  XRP: [
    'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png'
  ],
  USDC: [
    'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png'
  ],
  STETH: [
    'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png',
    'https://cryptologos.cc/logos/staked-ether-steth-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/8085.png'
  ],
  ADA: [
    'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    'https://cryptologos.cc/logos/cardano-ada-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png'
  ],
  SOL: [
    'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    'https://cryptologos.cc/logos/solana-sol-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'
  ],
  DOGE: [
    'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png'
  ],

  // Top 11-30
  TRX: [
    'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
    'https://cryptologos.cc/logos/tron-trx-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png'
  ],
  TON: [
    'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png',
    'https://cryptologos.cc/logos/toncoin-ton-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png'
  ],
  AVAX: [
    'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png'
  ],
  DOT: [
    'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png'
  ],
  MATIC: [
    'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
  ],
  SHIB: [
    'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
    'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png'
  ],
  LTC: [
    'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
    'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png'
  ],
  BCH: [
    'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png',
    'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png'
  ],
  LINK: [
    'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    'https://cryptologos.cc/logos/chainlink-link-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png'
  ],
  XLM: [
    'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
    'https://cryptologos.cc/logos/stellar-xlm-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/512.png'
  ],
  
  // 继续添加更多币种...
  HBAR: [
    'https://assets.coingecko.com/coins/images/3441/large/Hedera_Hashgraph_Logo.png',
    'https://cryptologos.cc/logos/hedera-hbar-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png'
  ],
  FIL: [
    'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
    'https://cryptologos.cc/logos/filecoin-fil-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png'
  ],
  ICP: [
    'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png',
    'https://cryptologos.cc/logos/internet-computer-icp-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/8916.png'
  ],
  CRO: [
    'https://assets.coingecko.com/coins/images/7310/large/cro_token_logo.png',
    'https://cryptologos.cc/logos/cronos-cro-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3635.png'
  ],
  APT: [
    'https://assets.coingecko.com/coins/images/26455/large/aptos_round.png',
    'https://cryptologos.cc/logos/aptos-apt-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png'
  ],
  NEAR: [
    'https://assets.coingecko.com/coins/images/10365/large/near.jpg',
    'https://cryptologos.cc/logos/near-protocol-near-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png'
  ],
  VET: [
    'https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-Icon.png',
    'https://cryptologos.cc/logos/vechain-vet-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3077.png'
  ],
  GRT: [
    'https://assets.coingecko.com/coins/images/13397/large/Graph_Token.png',
    'https://cryptologos.cc/logos/the-graph-grt-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png'
  ],
  ALGO: [
    'https://assets.coingecko.com/coins/images/4380/large/download.png',
    'https://cryptologos.cc/logos/algorand-algo-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png'
  ],
  QNT: [
    'https://assets.coingecko.com/coins/images/3370/large/5ZOu7brX_400x400.jpg',
    'https://cryptologos.cc/logos/quant-qnt-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3155.png'
  ],
  MANA: [
    'https://assets.coingecko.com/coins/images/878/large/decentraland-mana.png',
    'https://cryptologos.cc/logos/decentraland-mana-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1966.png'
  ],
  SAND: [
    'https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.jpg',
    'https://cryptologos.cc/logos/the-sandbox-sand-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/6210.png'
  ],
  AAVE: [
    'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
    'https://cryptologos.cc/logos/aave-aave-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png'
  ],
  MKR: [
    'https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png',
    'https://cryptologos.cc/logos/maker-mkr-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png'
  ],
  LRC: [
    'https://assets.coingecko.com/coins/images/913/large/LRC.png',
    'https://cryptologos.cc/logos/loopring-lrc-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1934.png'
  ],
  ENJ: [
    'https://assets.coingecko.com/coins/images/1102/large/enjin-coin-logo.png',
    'https://cryptologos.cc/logos/enjin-coin-enj-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2130.png'
  ],
  BAT: [
    'https://assets.coingecko.com/coins/images/677/large/basic-attention-token.png',
    'https://cryptologos.cc/logos/basic-attention-token-bat-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1697.png'
  ],
  ZEC: [
    'https://assets.coingecko.com/coins/images/486/large/circle-zcash-color.png',
    'https://cryptologos.cc/logos/zcash-zec-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1437.png'
  ],
  COMP: [
    'https://assets.coingecko.com/coins/images/10775/large/COMP.png',
    'https://cryptologos.cc/logos/compound-comp-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png'
  ],
  YFI: [
    'https://assets.coingecko.com/coins/images/11849/large/yfi-192x192.png',
    'https://cryptologos.cc/logos/yearn-finance-yfi-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png'
  ],
  SNX: [
    'https://assets.coingecko.com/coins/images/3406/large/SNX.png',
    'https://cryptologos.cc/logos/synthetix-snx-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png'
  ],
  '1INCH': [
    'https://assets.coingecko.com/coins/images/13469/large/1inch-token.png',
    'https://cryptologos.cc/logos/1inch-1inch-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/8104.png'
  ],
  REN: [
    'https://assets.coingecko.com/coins/images/3139/large/REN.png',
    'https://cryptologos.cc/logos/ren-ren-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2539.png'
  ],
  KNC: [
    'https://assets.coingecko.com/coins/images/14899/large/RwdVsGcw_400x400.jpg',
    'https://cryptologos.cc/logos/kyber-network-crystal-knc-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/9444.png'
  ],
  CRV: [
    'https://assets.coingecko.com/coins/images/12124/large/Curve.png',
    'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png'
  ],
  UMA: [
    'https://assets.coingecko.com/coins/images/10951/large/UMA.png',
    'https://cryptologos.cc/logos/uma-uma-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5617.png'
  ],
  BAL: [
    'https://assets.coingecko.com/coins/images/11683/large/Balancer.png',
    'https://cryptologos.cc/logos/balancer-bal-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png'
  ],
  SUSHI: [
    'https://assets.coingecko.com/coins/images/12271/large/512x512_Logo_no_chop.png',
    'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/6758.png'
  ],
  FTM: [
    'https://assets.coingecko.com/coins/images/4001/large/Fantom_round.png',
    'https://cryptologos.cc/logos/fantom-ftm-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png'
  ],
  FLOW: [
    'https://assets.coingecko.com/coins/images/13446/large/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png',
    'https://cryptologos.cc/logos/flow-flow-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4558.png'
  ],
  EGLD: [
    'https://assets.coingecko.com/coins/images/12335/large/EGLD_symbol.png',
    'https://cryptologos.cc/logos/multiversx-egld-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/6892.png'
  ],
  ONE: [
    'https://assets.coingecko.com/coins/images/4344/large/Y88JAze.png',
    'https://cryptologos.cc/logos/harmony-one-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3945.png'
  ],
  HIVE: [
    'https://assets.coingecko.com/coins/images/10840/large/hive_logo.png',
    'https://cryptologos.cc/logos/hive-hive-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5370.png'
  ],
  THETA: [
    'https://assets.coingecko.com/coins/images/2538/large/theta-token-logo.png',
    'https://cryptologos.cc/logos/theta-token-theta-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2416.png'
  ],
  TFUEL: [
    'https://assets.coingecko.com/coins/images/8029/large/1_0YusgngOrriVg4ZYx4wOFw.png',
    'https://cryptologos.cc/logos/theta-fuel-tfuel-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3822.png'
  ],
  KAVA: [
    'https://assets.coingecko.com/coins/images/9761/large/kava.png',
    'https://cryptologos.cc/logos/kava-kava-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4846.png'
  ],
  BAND: [
    'https://assets.coingecko.com/coins/images/9545/large/Band_token_blue_violet_token.png',
    'https://cryptologos.cc/logos/band-protocol-band-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4679.png'
  ],
  RVN: [
    'https://assets.coingecko.com/coins/images/3412/large/ravencoin.png',
    'https://cryptologos.cc/logos/ravencoin-rvn-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2577.png'
  ],
  ZIL: [
    'https://assets.coingecko.com/coins/images/2687/large/Zilliqa-logo.png',
    'https://cryptologos.cc/logos/zilliqa-zil-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2687.png'
  ],
  ICX: [
    'https://assets.coingecko.com/coins/images/1060/large/icon-icx-logo.png',
    'https://cryptologos.cc/logos/icon-icx-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2099.png'
  ],
  ONT: [
    'https://assets.coingecko.com/coins/images/3447/large/ONT.png',
    'https://cryptologos.cc/logos/ontology-ont-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2566.png'
  ],
  QTUM: [
    'https://assets.coingecko.com/coins/images/684/large/Qtum_Logo_blue_CG.png',
    'https://cryptologos.cc/logos/qtum-qtum-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1684.png'
  ],
  WAVES: [
    'https://assets.coingecko.com/coins/images/425/large/waves.png',
    'https://cryptologos.cc/logos/waves-waves-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1274.png'
  ],
  SC: [
    'https://assets.coingecko.com/coins/images/289/large/siacoin.png',
    'https://cryptologos.cc/logos/siacoin-sc-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1042.png'
  ],
  DGB: [
    'https://assets.coingecko.com/coins/images/63/large/digibyte.png',
    'https://cryptologos.cc/logos/digibyte-dgb-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/109.png'
  ],
  LSK: [
    'https://assets.coingecko.com/coins/images/385/large/Lisk_Symbol_-_Blue.png',
    'https://cryptologos.cc/logos/lisk-lsk-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1214.png'
  ],
  ARK: [
    'https://assets.coingecko.com/coins/images/484/large/ark.png',
    'https://cryptologos.cc/logos/ark-ark-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1586.png'
  ],
  NANO: [
    'https://assets.coingecko.com/coins/images/756/large/nano-logo.png',
    'https://cryptologos.cc/logos/nano-nano-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1567.png'
  ],
  IOST: [
    'https://assets.coingecko.com/coins/images/2948/large/IOST.png',
    'https://cryptologos.cc/logos/iost-iost-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2405.png'
  ],
  ZEN: [
    'https://assets.coingecko.com/coins/images/691/large/horizen.png',
    'https://cryptologos.cc/logos/horizen-zen-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1698.png'
  ],
  MAID: [
    'https://assets.coingecko.com/coins/images/588/large/maidsafecoin.png',
    'https://cryptologos.cc/logos/maidsafecoin-maid-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/291.png'
  ],
  REP: [
    'https://assets.coingecko.com/coins/images/309/large/REP.png',
    'https://cryptologos.cc/logos/augur-rep-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1104.png'
  ],
  KMD: [
    'https://assets.coingecko.com/coins/images/440/large/komodo.png',
    'https://cryptologos.cc/logos/komodo-kmd-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1521.png'
  ],
  DCR: [
    'https://assets.coingecko.com/coins/images/329/large/decred.png',
    'https://cryptologos.cc/logos/decred-dcr-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1168.png'
  ],
  STRAT: [
    'https://assets.coingecko.com/coins/images/415/large/stratis.png',
    'https://cryptologos.cc/logos/stratis-strax-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1343.png'
  ],
  NXT: [
    'https://assets.coingecko.com/coins/images/313/large/nxt.png',
    'https://cryptologos.cc/logos/nxt-nxt-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/66.png'
  ],
  SYS: [
    'https://assets.coingecko.com/coins/images/384/large/syscoin.png',
    'https://cryptologos.cc/logos/syscoin-sys-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/541.png'
  ],
  
  // 其他Meme coins
  BABYDOGE: [
    'https://assets.coingecko.com/coins/images/16125/large/baby-doge-coin.jpg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/10186.png'
  ],
  SAFE: [
    'https://assets.coingecko.com/coins/images/14362/large/safemoon.jpg',
    'https://cryptologos.cc/logos/safemoon-safemoon-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/8757.png'
  ],
  MEME: [
    'https://assets.coingecko.com/coins/images/32750/large/memecoin.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/28301.png'
  ],
  WOJAK: [
    'https://assets.coingecko.com/coins/images/30323/large/wojak-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/24641.png'
  ],
  TURBO: [
    'https://assets.coingecko.com/coins/images/30045/large/turbo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/24580.png'
  ],
  LADYS: [
    'https://assets.coingecko.com/coins/images/30462/large/milady.jpg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/26611.png'
  ],
  TRUMP: [
    'https://assets.coingecko.com/coins/images/33335/large/trump-avatar.jpg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/29462.png'
  ],
  UNI: [
    'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
    'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png'
  ],
  ATOM: [
    'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
    'https://cryptologos.cc/logos/cosmos-atom-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png'
  ],
  ETC: [
    'https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png',
    'https://cryptologos.cc/logos/ethereum-classic-etc-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png'
  ],
  
  // Meme coins
  PEPE: [
    'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png'
  ],
  BONK: [
    'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png'
  ],
  WIF: [
    'https://assets.coingecko.com/coins/images/33767/large/dogwifhat.jpg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png'
  ],
  FLOKI: [
    'https://assets.coingecko.com/coins/images/16746/large/PNG_image.png',
    'https://cryptologos.cc/logos/floki-inu-floki-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/10804.png'
  ],
  
  // 新增币种
  OKB: [
    'https://assets.coingecko.com/coins/images/4463/large/WeChat_Image_20220118181706.png',
    'https://cryptologos.cc/logos/okb-okb-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3897.png'
  ],
  PENGU: [
    'https://assets.coingecko.com/coins/images/34238/large/PENGU-200x200.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/31274.png'
  ]
};

// 币种品牌颜色
const CRYPTO_COLORS: Record<string, string> = {
  BTC: '#F7931A', ETH: '#627EEA', USDT: '#26A17B', USDC: '#2775CA', BNB: '#F3BA2F',
  XRP: '#23292F', STETH: '#00D4FF', ADA: '#0033AD', SOL: '#9945FF', DOGE: '#C2A633',
  TRX: '#FF061E', TON: '#0088CC', AVAX: '#E84142', DOT: '#E6007A', MATIC: '#8247E5',
  SHIB: '#FFA409', LTC: '#BFBBBB', BCH: '#8DC351', LINK: '#375BD2', XLM: '#7D00FF',
  UNI: '#FF007A', ATOM: '#2E3148', ETC: '#328332', HBAR: '#000000', FIL: '#0090FF',
  ICP: '#29ABE2', CRO: '#002D74', APT: '#000000', NEAR: '#00C08B', VET: '#15BDFF',
  GRT: '#6F4CFF', ALGO: '#000000', QNT: '#FA6D01', MANA: '#FF2D55', SAND: '#00ADEF',
  AAVE: '#B6509E', MKR: '#1AAB9B', LRC: '#1C60FF', ENJ: '#624DBF', BAT: '#FF5000',
  ZEC: '#F4B728', COMP: '#00D395', YFI: '#006AE3', SNX: '#00D4FF', '1INCH': '#1B1E29',
  REN: '#080817', KNC: '#31CB9E', CRV: '#40649F', UMA: '#FF6B6B', BAL: '#1E1E1E',
  SUSHI: '#FA52A0', FTM: '#13B5EC', FLOW: '#00EF8B', EGLD: '#1B46C2', ONE: '#00AEE9',
  HIVE: '#E31337', THETA: '#2AB8E6', TFUEL: '#2AB8E6', KAVA: '#FF564F', BAND: '#516AFF',
  RVN: '#384182', ZIL: '#49C1BF', ICX: '#1FC5C9', ONT: '#32A4BE', QTUM: '#2E9AD0',
  WAVES: '#0155FF', SC: '#00CBA0', DGB: '#006BA6', LSK: '#0D98BA', ARK: '#CC3E3E',
  NANO: '#4A90E2', IOST: '#1C1C1C', ZEN: '#00586E', MAID: '#5492D6', REP: '#602C50',
  KMD: '#326464', DCR: '#2ED6A1', STRAT: '#1382C6', NXT: '#008FBB', SYS: '#0082C6',
  PEPE: '#40B68A', BONK: '#FFB900', WIF: '#FF6B35', FLOKI: '#F15A24', BABYDOGE: '#FFA500',
  SAFE: '#42C55C', MEME: '#FF4081', WOJAK: '#4CAF50', TURBO: '#FF9800', LADYS: '#E91E63',
  TRUMP: '#FF0000', OKB: '#3075EE', PENGU: '#7B68EE'
};

export const CryptoIcon: React.FC<CryptoIconProps> = ({
  symbol,
  size = 32,
  className = ""
}) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const iconUrls = CRYPTO_ICONS[symbol.toUpperCase()] || [
    `https://assets.coingecko.com/coins/images/1/large/${symbol.toLowerCase()}.png`,
    `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`
  ];
  
  const cryptoColor = CRYPTO_COLORS[symbol.toUpperCase()] || '#6B7280';

  // 重置状态当symbol改变时
  useEffect(() => {
    setCurrentUrlIndex(0);
    setHasError(false);
    setIsLoading(true);
  }, [symbol]);

  const handleImageError = useCallback(() => {
    if (currentUrlIndex < iconUrls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [currentUrlIndex, iconUrls.length]);

  const handleImageLoad = useCallback(() => {
    setHasError(false);
    setIsLoading(false);
  }, []);

  // 显示默认图标
  if (hasError || iconUrls.length === 0) {
    return (
      <div 
        className={`relative rounded-full overflow-hidden flex items-center justify-center font-bold text-white shadow-lg ${className}`}
        style={{ 
          width: size, 
          height: size,
          background: `linear-gradient(135deg, ${cryptoColor}, ${cryptoColor}aa)`
        }}
      >
        <span style={{ fontSize: size * 0.4 }}>
          {symbol.charAt(0)}
        </span>
        <div className="absolute inset-0 rounded-full ring-1 ring-white/30"></div>
      </div>
    );
  }

  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div 
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${cryptoColor}33, ${cryptoColor}11)` }}
        >
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={iconUrls[currentUrlIndex]}
        alt={`${symbol} logo`}
        className="w-full h-full object-cover rounded-full"
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      <div className="absolute inset-0 rounded-full ring-1 ring-black/10 group-hover:ring-2 group-hover:ring-primary/40 transition-all duration-300"></div>
    </div>
  );
};

export default CryptoIcon;