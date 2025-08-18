import React, { useState, useCallback, useEffect } from 'react';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

// 完整的加密货币图标映射 - 使用币安生态和多个可靠源
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
  AVAX: [
    'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png'
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
  NEAR: [
    'https://assets.coingecko.com/coins/images/10365/large/near.jpg',
    'https://cryptologos.cc/logos/near-protocol-near-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png'
  ],
  XLM: [
    'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
    'https://cryptologos.cc/logos/stellar-xlm-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/512.png'
  ],

  // DeFi 和 Layer2
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
  VET: [
    'https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-Icon.png',
    'https://cryptologos.cc/logos/vechain-vet-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3077.png'
  ],
  STX: [
    'https://assets.coingecko.com/coins/images/2069/large/Stacks_logo_full.png',
    'https://cryptologos.cc/logos/stacks-stx-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4847.png'
  ],

  // Layer2 和新兴项目
  ARB: [
    'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
    'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png'
  ],
  OP: [
    'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png'
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
  COMP: [
    'https://assets.coingecko.com/coins/images/10775/large/COMP.png',
    'https://cryptologos.cc/logos/compound-comp-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png'
  ],

  // 新兴热门项目
  JASMY: [
    'https://assets.coingecko.com/coins/images/13876/large/JASMY200x200.jpg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/8425.png'
  ],
  IMX: [
    'https://assets.coingecko.com/coins/images/17233/large/immutableX-symbol-BLK-RGB.png',
    'https://cryptologos.cc/logos/immutable-x-imx-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/10603.png'
  ],
  INJ: [
    'https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png',
    'https://cryptologos.cc/logos/injective-inj-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/7226.png'
  ],
  SEI: [
    'https://assets.coingecko.com/coins/images/28205/large/sei.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/23149.png'
  ],
  SUI: [
    'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg',
    'https://cryptologos.cc/logos/sui-sui-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png'
  ],
  JUP: [
    'https://assets.coingecko.com/coins/images/34188/large/jup.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/29210.png'
  ],
  WLD: [
    'https://assets.coingecko.com/coins/images/31069/large/worldcoin.jpeg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/13502.png'
  ],
  FET: [
    'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg',
    'https://cryptologos.cc/logos/fetch-ai-fet-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png'
  ],
  RNDR: [
    'https://assets.coingecko.com/coins/images/11636/large/rndr.png',
    'https://cryptologos.cc/logos/render-token-rndr-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/5690.png'
  ],
  RUNE: [
    'https://assets.coingecko.com/coins/images/6595/large/RUNE.png',
    'https://cryptologos.cc/logos/thorchain-rune-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4157.png'
  ],

  // Meme币
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
    'https://cryptologos.cc/logos/floki-floki-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/10804.png'
  ],
  BABYDOGE: [
    'https://assets.coingecko.com/coins/images/16125/large/baby-doge-coin.jpg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/10186.png'
  ],
  PENGU: [
    'https://assets.coingecko.com/coins/images/34236/large/pengu.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/33138.png'
  ],
  TURBO: [
    'https://assets.coingecko.com/coins/images/30045/large/turbo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/24580.png'
  ],
  BRETT: [
    'https://assets.coingecko.com/coins/images/30641/large/brett.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/29743.png'
  ],

  // 稳定币
  FDUSD: [
    'https://assets.coingecko.com/coins/images/31079/large/firstdigitalusd.jpeg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/26081.png'
  ],
  TUSD: [
    'https://assets.coingecko.com/coins/images/3449/large/tusd.png',
    'https://cryptologos.cc/logos/trueusd-tusd-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2563.png'
  ],
  DAI: [
    'https://assets.coingecko.com/coins/images/9956/large/4943.png',
    'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png'
  ],
  BUSD: [
    'https://assets.coingecko.com/coins/images/9576/large/BUSD.png',
    'https://cryptologos.cc/logos/binance-usd-busd-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png'
  ],
  STETH: [
    'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png',
    'https://cryptologos.cc/logos/staked-ether-steth-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/8085.png'
  ],
  RETH: [
    'https://assets.coingecko.com/coins/images/20764/large/reth.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/15060.png'
  ],
  WETH: [
    'https://assets.coingecko.com/coins/images/2518/large/weth.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png'
  ],
  WBTC: [
    'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
    'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png'
  ],

  // 交易所币
  OKB: [
    'https://assets.coingecko.com/coins/images/4463/large/WeChat_Image_20220118095654.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3897.png'
  ],
  KCS: [
    'https://assets.coingecko.com/coins/images/1047/large/sa9z79.png',
    'https://cryptologos.cc/logos/kucoin-shares-kcs-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2087.png'
  ],
  HT: [
    'https://assets.coingecko.com/coins/images/2822/large/huobi-token-logo.png',
    'https://cryptologos.cc/logos/huobi-token-ht-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2502.png'
  ],
  LEO: [
    'https://assets.coingecko.com/coins/images/8418/large/leo-token.png',
    'https://cryptologos.cc/logos/unus-sed-leo-leo-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/3957.png'
  ],
  MCO: [
    'https://assets.coingecko.com/coins/images/599/large/monaco.png',
    'https://cryptologos.cc/logos/monaco-mco-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1776.png'
  ],
  BGB: [
    'https://assets.coingecko.com/coins/images/11610/large/bitget.jpg',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/11092.png'
  ],
  GT: [
    'https://assets.coingecko.com/coins/images/8183/large/gt.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/4026.png'
  ],

  // 其他重要DeFi代币
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
  THETA: [
    'https://assets.coingecko.com/coins/images/2538/large/theta-token-logo.png',
    'https://cryptologos.cc/logos/theta-token-theta-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/2416.png'
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
  CRV: '#40649F', UMA: '#FF6B6B', BAL: '#1E1E1E', SUSHI: '#FA52A0', FTM: '#13B5EC',
  FLOW: '#00EF8B', EGLD: '#1B46C2', ONE: '#00AEE9', THETA: '#2AB8E6', KAVA: '#FF564F',
  BAND: '#516AFF', RVN: '#384182', ZIL: '#49C1BF', PEPE: '#40B68A', BONK: '#FFB900',
  WIF: '#FF6B35', FLOKI: '#F15A24', BABYDOGE: '#FFA500', PENGU: '#7B68EE',
  TURBO: '#FF9800', BRETT: '#4CAF50', OKB: '#3075EE', FDUSD: '#26A17B',
  TUSD: '#002868', DAI: '#F4B731', BUSD: '#F0B90B', WETH: '#627EEA', WBTC: '#F7931A'
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
    `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`,
    `https://s2.coinmarketcap.com/static/img/coins/64x64/1.png`
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