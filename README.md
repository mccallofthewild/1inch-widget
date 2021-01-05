<p align="center"><a href="https://brucecrypto.vercel.app/" target="_blank" rel="noopener noreferrer"><img width="300" src="public/images/bruce.svg" alt="Bruce Logo"></a></p>
<p align="center">
The DEX Swap Widget that <br/> Packs a Punch 👊
</p>
<p align="center">
  https://brucecrypto.vercel.app/
</p>
<p align="center"><img width="300" src="https://media.giphy.com/media/l41m1H2BYnLRV26QM/giphy.gif"/></p>



# 🥋 Inspiration
[1inch.exchange](1inch.exchange) was born from the philosophy of Bruce Lee’s world renowned one inch punch, a Martial Arts pinnacle of speed, vigor and efficiency. The [Bruce](https://brucecrypto.vercel.app/) swap widget aims to embody this same idea: a simple interface with powerful results. Shapeshift attempted this years ago, but was ultimately strangled by the bureaucracy that centralized systems invariably beckon. 1inch poises an opportunity to decentralize and simplify any-to-any token transactions. The purpose of this project is to capture that opportunity in a simple interface that anyone can share on their website.


# 🏊‍♀️  Product Deepdive 
## Demo
<img src="./public/images/demo.gif" width="400"/>

## Features:
  * Over 2300 Tokens
  * Automatic fiat conversions via stablecoin quotes
  * Static Output Token
    * Allows Token organizations to designate a single token for the widget to output
  * Trade pair inversion (ETH-DAI to DAI-ETH in one click)
  * Auto-generated token logos for non-standard tokens 
### ⏰ Upcoming:
  * CHI gas token support

## Tech
### 🦺 Type Safe API's 
  * 1inch Swagger V2: 
    * Typescript libraries generated via OpenAPI Tools
  * 1inch Subgraph GraphQL: 
    * Typescript interfaces generated via GraphQL Codegen
  * Contracts: OneSplit & ERC20:
    * Typescript interfaces generated from ABI's using TypeChain
### 🥞 Stack
  * Typescript
  * React
  * Next.js - Static generated with tokens & leading token logos pre-loaded for instant embedded rendering 
  * Web3React - Enabling wallet interconnectivity
  * Ethers - Ethereum network interaction 

# 🚀 Usage & Deployment

### Requirements 
* Metamask (or other web3-compatible browser extension)
* Node.js >=v10.1.0
* NPM or Yarn 
* Git

### ⬇️ Clone the repository
```bash
git clone https://github.com/mccallofthewild/1inch-widget.git
```
### ⬇️ Install the `node_modules`
```
yarn
```
or 
```
npm i
```
### 💰 Start Server
```
yarn dev
```

### 🏨 Host
Deploy to Vercel, or your static host of choice.

