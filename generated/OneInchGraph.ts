import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export namespace OneInchGraph {
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};


export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  tradingPair?: Maybe<TradingPair>;
  tradingPairs: Array<TradingPair>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  user?: Maybe<User>;
  users: Array<User>;
  referralFee?: Maybe<ReferralFee>;
  referralFees: Array<ReferralFee>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerySwapArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QuerySwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Swap_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryTradingPairArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTradingPairsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TradingPair_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TradingPair_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryUsersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<User_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryReferralFeeArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryReferralFeesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ReferralFee_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ReferralFee_Filter>;
  block?: Maybe<Block_Height>;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type ReferralFee = {
  __typename?: 'ReferralFee';
  id: Scalars['ID'];
  receiver: Scalars['Bytes'];
  amount: Scalars['BigInt'];
  token: Token;
  contract?: Maybe<Scalars['Bytes']>;
  timestamp: Scalars['BigInt'];
};

export type ReferralFee_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  receiver?: Maybe<Scalars['Bytes']>;
  receiver_not?: Maybe<Scalars['Bytes']>;
  receiver_in?: Maybe<Array<Scalars['Bytes']>>;
  receiver_not_in?: Maybe<Array<Scalars['Bytes']>>;
  receiver_contains?: Maybe<Scalars['Bytes']>;
  receiver_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  contract?: Maybe<Scalars['Bytes']>;
  contract_not?: Maybe<Scalars['Bytes']>;
  contract_in?: Maybe<Array<Scalars['Bytes']>>;
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>;
  contract_contains?: Maybe<Scalars['Bytes']>;
  contract_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum ReferralFee_OrderBy {
  Id = 'id',
  Receiver = 'receiver',
  Amount = 'amount',
  Token = 'token',
  Contract = 'contract',
  Timestamp = 'timestamp'
}

export type Subscription = {
  __typename?: 'Subscription';
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  tradingPair?: Maybe<TradingPair>;
  tradingPairs: Array<TradingPair>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  user?: Maybe<User>;
  users: Array<User>;
  referralFee?: Maybe<ReferralFee>;
  referralFees: Array<ReferralFee>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionSwapArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Swap_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionTradingPairArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTradingPairsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TradingPair_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TradingPair_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionUserArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionUsersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<User_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionReferralFeeArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionReferralFeesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ReferralFee_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ReferralFee_Filter>;
  block?: Maybe<Block_Height>;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Swap = {
  __typename?: 'Swap';
  id: Scalars['ID'];
  contract: Scalars['Bytes'];
  pair: TradingPair;
  referrer: Scalars['Bytes'];
  referrerFee: Scalars['BigInt'];
  fromAmount: Scalars['BigInt'];
  toAmount: Scalars['BigInt'];
  sender: User;
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  gasUsed: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
};

export type Swap_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  contract?: Maybe<Scalars['Bytes']>;
  contract_not?: Maybe<Scalars['Bytes']>;
  contract_in?: Maybe<Array<Scalars['Bytes']>>;
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>;
  contract_contains?: Maybe<Scalars['Bytes']>;
  contract_not_contains?: Maybe<Scalars['Bytes']>;
  pair?: Maybe<Scalars['String']>;
  pair_not?: Maybe<Scalars['String']>;
  pair_gt?: Maybe<Scalars['String']>;
  pair_lt?: Maybe<Scalars['String']>;
  pair_gte?: Maybe<Scalars['String']>;
  pair_lte?: Maybe<Scalars['String']>;
  pair_in?: Maybe<Array<Scalars['String']>>;
  pair_not_in?: Maybe<Array<Scalars['String']>>;
  pair_contains?: Maybe<Scalars['String']>;
  pair_not_contains?: Maybe<Scalars['String']>;
  pair_starts_with?: Maybe<Scalars['String']>;
  pair_not_starts_with?: Maybe<Scalars['String']>;
  pair_ends_with?: Maybe<Scalars['String']>;
  pair_not_ends_with?: Maybe<Scalars['String']>;
  referrer?: Maybe<Scalars['Bytes']>;
  referrer_not?: Maybe<Scalars['Bytes']>;
  referrer_in?: Maybe<Array<Scalars['Bytes']>>;
  referrer_not_in?: Maybe<Array<Scalars['Bytes']>>;
  referrer_contains?: Maybe<Scalars['Bytes']>;
  referrer_not_contains?: Maybe<Scalars['Bytes']>;
  referrerFee?: Maybe<Scalars['BigInt']>;
  referrerFee_not?: Maybe<Scalars['BigInt']>;
  referrerFee_gt?: Maybe<Scalars['BigInt']>;
  referrerFee_lt?: Maybe<Scalars['BigInt']>;
  referrerFee_gte?: Maybe<Scalars['BigInt']>;
  referrerFee_lte?: Maybe<Scalars['BigInt']>;
  referrerFee_in?: Maybe<Array<Scalars['BigInt']>>;
  referrerFee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  fromAmount?: Maybe<Scalars['BigInt']>;
  fromAmount_not?: Maybe<Scalars['BigInt']>;
  fromAmount_gt?: Maybe<Scalars['BigInt']>;
  fromAmount_lt?: Maybe<Scalars['BigInt']>;
  fromAmount_gte?: Maybe<Scalars['BigInt']>;
  fromAmount_lte?: Maybe<Scalars['BigInt']>;
  fromAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  fromAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  toAmount?: Maybe<Scalars['BigInt']>;
  toAmount_not?: Maybe<Scalars['BigInt']>;
  toAmount_gt?: Maybe<Scalars['BigInt']>;
  toAmount_lt?: Maybe<Scalars['BigInt']>;
  toAmount_gte?: Maybe<Scalars['BigInt']>;
  toAmount_lte?: Maybe<Scalars['BigInt']>;
  toAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  toAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  sender?: Maybe<Scalars['String']>;
  sender_not?: Maybe<Scalars['String']>;
  sender_gt?: Maybe<Scalars['String']>;
  sender_lt?: Maybe<Scalars['String']>;
  sender_gte?: Maybe<Scalars['String']>;
  sender_lte?: Maybe<Scalars['String']>;
  sender_in?: Maybe<Array<Scalars['String']>>;
  sender_not_in?: Maybe<Array<Scalars['String']>>;
  sender_contains?: Maybe<Scalars['String']>;
  sender_not_contains?: Maybe<Scalars['String']>;
  sender_starts_with?: Maybe<Scalars['String']>;
  sender_not_starts_with?: Maybe<Scalars['String']>;
  sender_ends_with?: Maybe<Scalars['String']>;
  sender_not_ends_with?: Maybe<Scalars['String']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed?: Maybe<Scalars['BigInt']>;
  gasUsed_not?: Maybe<Scalars['BigInt']>;
  gasUsed_gt?: Maybe<Scalars['BigInt']>;
  gasUsed_lt?: Maybe<Scalars['BigInt']>;
  gasUsed_gte?: Maybe<Scalars['BigInt']>;
  gasUsed_lte?: Maybe<Scalars['BigInt']>;
  gasUsed_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasPrice_not?: Maybe<Scalars['BigInt']>;
  gasPrice_gt?: Maybe<Scalars['BigInt']>;
  gasPrice_lt?: Maybe<Scalars['BigInt']>;
  gasPrice_gte?: Maybe<Scalars['BigInt']>;
  gasPrice_lte?: Maybe<Scalars['BigInt']>;
  gasPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Swap_OrderBy {
  Id = 'id',
  Contract = 'contract',
  Pair = 'pair',
  Referrer = 'referrer',
  ReferrerFee = 'referrerFee',
  FromAmount = 'fromAmount',
  ToAmount = 'toAmount',
  Sender = 'sender',
  BlockNumber = 'blockNumber',
  Timestamp = 'timestamp',
  GasUsed = 'gasUsed',
  GasPrice = 'gasPrice'
}

export type Token = {
  __typename?: 'Token';
  id: Scalars['ID'];
  symbol: Scalars['String'];
  name: Scalars['String'];
  decimals: Scalars['Int'];
  tradeVolume: Scalars['BigDecimal'];
  tradeCount: Scalars['BigInt'];
};

export type Token_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  symbol?: Maybe<Scalars['String']>;
  symbol_not?: Maybe<Scalars['String']>;
  symbol_gt?: Maybe<Scalars['String']>;
  symbol_lt?: Maybe<Scalars['String']>;
  symbol_gte?: Maybe<Scalars['String']>;
  symbol_lte?: Maybe<Scalars['String']>;
  symbol_in?: Maybe<Array<Scalars['String']>>;
  symbol_not_in?: Maybe<Array<Scalars['String']>>;
  symbol_contains?: Maybe<Scalars['String']>;
  symbol_not_contains?: Maybe<Scalars['String']>;
  symbol_starts_with?: Maybe<Scalars['String']>;
  symbol_not_starts_with?: Maybe<Scalars['String']>;
  symbol_ends_with?: Maybe<Scalars['String']>;
  symbol_not_ends_with?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
  tradeVolume?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_not?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_gt?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_lt?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_gte?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_lte?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tradeVolume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tradeCount?: Maybe<Scalars['BigInt']>;
  tradeCount_not?: Maybe<Scalars['BigInt']>;
  tradeCount_gt?: Maybe<Scalars['BigInt']>;
  tradeCount_lt?: Maybe<Scalars['BigInt']>;
  tradeCount_gte?: Maybe<Scalars['BigInt']>;
  tradeCount_lte?: Maybe<Scalars['BigInt']>;
  tradeCount_in?: Maybe<Array<Scalars['BigInt']>>;
  tradeCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Token_OrderBy {
  Id = 'id',
  Symbol = 'symbol',
  Name = 'name',
  Decimals = 'decimals',
  TradeVolume = 'tradeVolume',
  TradeCount = 'tradeCount'
}

export type TradingPair = {
  __typename?: 'TradingPair';
  id: Scalars['ID'];
  fromToken: Token;
  toToken: Token;
  tradeVolume: Scalars['BigDecimal'];
  tradeCount: Scalars['BigInt'];
};

export type TradingPair_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  fromToken?: Maybe<Scalars['String']>;
  fromToken_not?: Maybe<Scalars['String']>;
  fromToken_gt?: Maybe<Scalars['String']>;
  fromToken_lt?: Maybe<Scalars['String']>;
  fromToken_gte?: Maybe<Scalars['String']>;
  fromToken_lte?: Maybe<Scalars['String']>;
  fromToken_in?: Maybe<Array<Scalars['String']>>;
  fromToken_not_in?: Maybe<Array<Scalars['String']>>;
  fromToken_contains?: Maybe<Scalars['String']>;
  fromToken_not_contains?: Maybe<Scalars['String']>;
  fromToken_starts_with?: Maybe<Scalars['String']>;
  fromToken_not_starts_with?: Maybe<Scalars['String']>;
  fromToken_ends_with?: Maybe<Scalars['String']>;
  fromToken_not_ends_with?: Maybe<Scalars['String']>;
  toToken?: Maybe<Scalars['String']>;
  toToken_not?: Maybe<Scalars['String']>;
  toToken_gt?: Maybe<Scalars['String']>;
  toToken_lt?: Maybe<Scalars['String']>;
  toToken_gte?: Maybe<Scalars['String']>;
  toToken_lte?: Maybe<Scalars['String']>;
  toToken_in?: Maybe<Array<Scalars['String']>>;
  toToken_not_in?: Maybe<Array<Scalars['String']>>;
  toToken_contains?: Maybe<Scalars['String']>;
  toToken_not_contains?: Maybe<Scalars['String']>;
  toToken_starts_with?: Maybe<Scalars['String']>;
  toToken_not_starts_with?: Maybe<Scalars['String']>;
  toToken_ends_with?: Maybe<Scalars['String']>;
  toToken_not_ends_with?: Maybe<Scalars['String']>;
  tradeVolume?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_not?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_gt?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_lt?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_gte?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_lte?: Maybe<Scalars['BigDecimal']>;
  tradeVolume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tradeVolume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tradeCount?: Maybe<Scalars['BigInt']>;
  tradeCount_not?: Maybe<Scalars['BigInt']>;
  tradeCount_gt?: Maybe<Scalars['BigInt']>;
  tradeCount_lt?: Maybe<Scalars['BigInt']>;
  tradeCount_gte?: Maybe<Scalars['BigInt']>;
  tradeCount_lte?: Maybe<Scalars['BigInt']>;
  tradeCount_in?: Maybe<Array<Scalars['BigInt']>>;
  tradeCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum TradingPair_OrderBy {
  Id = 'id',
  FromToken = 'fromToken',
  ToToken = 'toToken',
  TradeVolume = 'tradeVolume',
  TradeCount = 'tradeCount'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  trades?: Maybe<Array<Swap>>;
  tradeCount: Scalars['BigInt'];
};


export type UserTradesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Swap_Filter>;
};

export type User_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tradeCount?: Maybe<Scalars['BigInt']>;
  tradeCount_not?: Maybe<Scalars['BigInt']>;
  tradeCount_gt?: Maybe<Scalars['BigInt']>;
  tradeCount_lt?: Maybe<Scalars['BigInt']>;
  tradeCount_gte?: Maybe<Scalars['BigInt']>;
  tradeCount_lte?: Maybe<Scalars['BigInt']>;
  tradeCount_in?: Maybe<Array<Scalars['BigInt']>>;
  tradeCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum User_OrderBy {
  Id = 'id',
  Trades = 'trades',
  TradeCount = 'tradeCount'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Block_height: Block_Height;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  ReferralFee: ResolverTypeWrapper<ReferralFee>;
  ReferralFee_filter: ReferralFee_Filter;
  String: ResolverTypeWrapper<Scalars['String']>;
  ReferralFee_orderBy: ReferralFee_OrderBy;
  Subscription: ResolverTypeWrapper<{}>;
  Swap: ResolverTypeWrapper<Swap>;
  Swap_filter: Swap_Filter;
  Swap_orderBy: Swap_OrderBy;
  Token: ResolverTypeWrapper<Token>;
  Token_filter: Token_Filter;
  Token_orderBy: Token_OrderBy;
  TradingPair: ResolverTypeWrapper<TradingPair>;
  TradingPair_filter: TradingPair_Filter;
  TradingPair_orderBy: TradingPair_OrderBy;
  User: ResolverTypeWrapper<User>;
  User_filter: User_Filter;
  User_orderBy: User_OrderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  Block_height: Block_Height;
  Int: Scalars['Int'];
  Bytes: Scalars['Bytes'];
  Query: {};
  ID: Scalars['ID'];
  ReferralFee: ReferralFee;
  ReferralFee_filter: ReferralFee_Filter;
  String: Scalars['String'];
  Subscription: {};
  Swap: Swap;
  Swap_filter: Swap_Filter;
  Token: Token;
  Token_filter: Token_Filter;
  TradingPair: TradingPair;
  TradingPair_filter: TradingPair_Filter;
  User: User;
  User_filter: User_Filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
  Boolean: Scalars['Boolean'];
};

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  swap?: Resolver<Maybe<ResolversTypes['Swap']>, ParentType, ContextType, RequireFields<QuerySwapArgs, 'id'>>;
  swaps?: Resolver<Array<ResolversTypes['Swap']>, ParentType, ContextType, RequireFields<QuerySwapsArgs, 'skip' | 'first'>>;
  tradingPair?: Resolver<Maybe<ResolversTypes['TradingPair']>, ParentType, ContextType, RequireFields<QueryTradingPairArgs, 'id'>>;
  tradingPairs?: Resolver<Array<ResolversTypes['TradingPair']>, ParentType, ContextType, RequireFields<QueryTradingPairsArgs, 'skip' | 'first'>>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QueryTokenArgs, 'id'>>;
  tokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QueryTokensArgs, 'skip' | 'first'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'skip' | 'first'>>;
  referralFee?: Resolver<Maybe<ResolversTypes['ReferralFee']>, ParentType, ContextType, RequireFields<QueryReferralFeeArgs, 'id'>>;
  referralFees?: Resolver<Array<ResolversTypes['ReferralFee']>, ParentType, ContextType, RequireFields<QueryReferralFeesArgs, 'skip' | 'first'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, RequireFields<Query_MetaArgs, never>>;
};

export type ReferralFeeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReferralFee'] = ResolversParentTypes['ReferralFee']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  receiver?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  contract?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  swap?: SubscriptionResolver<Maybe<ResolversTypes['Swap']>, "swap", ParentType, ContextType, RequireFields<SubscriptionSwapArgs, 'id'>>;
  swaps?: SubscriptionResolver<Array<ResolversTypes['Swap']>, "swaps", ParentType, ContextType, RequireFields<SubscriptionSwapsArgs, 'skip' | 'first'>>;
  tradingPair?: SubscriptionResolver<Maybe<ResolversTypes['TradingPair']>, "tradingPair", ParentType, ContextType, RequireFields<SubscriptionTradingPairArgs, 'id'>>;
  tradingPairs?: SubscriptionResolver<Array<ResolversTypes['TradingPair']>, "tradingPairs", ParentType, ContextType, RequireFields<SubscriptionTradingPairsArgs, 'skip' | 'first'>>;
  token?: SubscriptionResolver<Maybe<ResolversTypes['Token']>, "token", ParentType, ContextType, RequireFields<SubscriptionTokenArgs, 'id'>>;
  tokens?: SubscriptionResolver<Array<ResolversTypes['Token']>, "tokens", ParentType, ContextType, RequireFields<SubscriptionTokensArgs, 'skip' | 'first'>>;
  user?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "user", ParentType, ContextType, RequireFields<SubscriptionUserArgs, 'id'>>;
  users?: SubscriptionResolver<Array<ResolversTypes['User']>, "users", ParentType, ContextType, RequireFields<SubscriptionUsersArgs, 'skip' | 'first'>>;
  referralFee?: SubscriptionResolver<Maybe<ResolversTypes['ReferralFee']>, "referralFee", ParentType, ContextType, RequireFields<SubscriptionReferralFeeArgs, 'id'>>;
  referralFees?: SubscriptionResolver<Array<ResolversTypes['ReferralFee']>, "referralFees", ParentType, ContextType, RequireFields<SubscriptionReferralFeesArgs, 'skip' | 'first'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, RequireFields<Subscription_MetaArgs, never>>;
};

export type SwapResolvers<ContextType = any, ParentType extends ResolversParentTypes['Swap'] = ResolversParentTypes['Swap']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  contract?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['TradingPair'], ParentType, ContextType>;
  referrer?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  referrerFee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  fromAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  toAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  gasUsed?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  gasPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tradeVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  tradeCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TradingPairResolvers<ContextType = any, ParentType extends ResolversParentTypes['TradingPair'] = ResolversParentTypes['TradingPair']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fromToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  toToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  tradeVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  tradeCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  trades?: Resolver<Maybe<Array<ResolversTypes['Swap']>>, ParentType, ContextType, RequireFields<UserTradesArgs, 'skip' | 'first'>>;
  tradeCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _Block_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = {
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _Meta_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = {
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  ReferralFee?: ReferralFeeResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Swap?: SwapResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  TradingPair?: TradingPairResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

}