export namespace OneInchSwagger { /* tslint:disable */
/* eslint-disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * Approve CallData response
 */
export interface ApproveCallData {
  /** Address of the token to approve */
  to: string;

  /** ETH value in wei (for approve is 0) */
  value: string;

  /** Network fast gas price */
  gasPrice: string;

  /** CallData to sign */
  data: string;
}

/**
 * Spender address
 */
export interface SpenderAddress {
  /** We need to approve your token to this address */
  address: string;
}

/**
 * Supported Protocols
 */
export interface Protocols {
  /** Supported protocols to pass to protocols */
  protocols: string[];
}

/**
 * Supported tokens (you can also use not supported)
 */
export interface Tokens {
  /** Supported tokens */
  tokens: Token;
}

/**
 * Token
 */
export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}

/**
 * Quote Response
 */
export interface Quote {
  /** From token info */
  fromToken: Token;

  /** To token info */
  toToken: Token;

  /** To token amount */
  toTokenAmount: string;

  /** From token amount */
  fromTokenAmount: string;

  /** From token amount */
  protocols: SelectedProtocol[];

  /** Estimated Gas */
  estimatedGas: number;
}

/**
 * Swap Response
 */
export interface Swap {
  /** From token info */
  fromToken: Token;

  /** To token info */
  toToken: Token;

  /** To token amount */
  toTokenAmount: string;

  /** From token amount */
  fromTokenAmount: string;

  /** From token amount */
  protocols: SelectedProtocol[];

  /** Ethereum transaction */
  tx: Tx;
}

/**
 * Ethereum transaction
 */
export interface Tx {
  from: string;
  to: string;
  data: string;
  value: string;
  gasPrice: string;
  gas: number;
}

/**
 * Selected Protocol Info
 */
export interface SelectedProtocol {
  name: string;
  part: number;
  fromTokenAddress: string;
  toTokenAddress: string;
}

export namespace v20 {
  /**
   * @tags Approve
   * @name getCallData
   * @request GET:/v2.0/approve/calldata
   * @description Generated approve calldata
   */
  export namespace GetCallData {
    export type RequestQuery = { amount?: number; infinity?: boolean; tokenAddress: string };
    export type RequestBody = never;
    export type ResponseBody = ApproveCallData;
  }

  /**
   * @tags Approve
   * @name getSpenderAddress
   * @request GET:/v2.0/approve/spender
   * @description Address of spender
   */
  export namespace GetSpenderAddress {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = SpenderAddress;
  }

  /**
   * @tags Healthcheck
   * @name isLife
   * @request GET:/v2.0/healthcheck
   */
  export namespace IsLife {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = any;
  }

  /**
   * @tags Quote/Swap
   * @name getQuote
   * @request GET:/v2.0/quote
   * @description Quote
   */
  export namespace GetQuote {
    export type RequestQuery = {
      fromTokenAddress: string;
      toTokenAddress: string;
      amount: number;
      fee?: number;
      protocols?: string;
      gasPrice?: string;
      complexityLevel?: string;
      connectorTokens?: string;
      gasLimit?: number;
      parts?: number;
      virtualParts?: number;
      mainRouteParts?: number;
    };
    export type RequestBody = never;
    export type ResponseBody = Quote;
  }

  /**
   * @tags Quote/Swap
   * @name swap
   * @request GET:/v2.0/swap
   * @description Swap
   */
  export namespace Swap {
    export type RequestQuery = {
      fromTokenAddress: string;
      toTokenAddress: string;
      amount: number;
      fromAddress: string;
      slippage: number;
      protocols?: string;
      destReceiver?: string;
      referrerAddress?: string;
      fee?: number;
      gasPrice?: string;
      burnChi?: boolean;
      complexityLevel?: string;
      connectorTokens?: string;
      allowPartialFill?: boolean;
      disableEstimate?: boolean;
      gasLimit?: number;
      parts?: number;
      virtualParts?: number;
      mainRouteParts?: number;
    };
    export type RequestBody = never;
    export type ResponseBody = Swap;
  }

  /**
   * @tags Protocols
   * @name getProtocols
   * @request GET:/v2.0/protocols
   * @description All supported protocols
   */
  export namespace GetProtocols {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = Protocols;
  }

  /**
   * @tags Tokens
   * @name getTokens
   * @request GET:/v2.0/tokens
   * @description All supported tokens (can also use your own)
   */
  export namespace GetTokens {
    export type RequestQuery = {};
    export type RequestBody = never;
    export type ResponseBody = Tokens;
  }
}
}