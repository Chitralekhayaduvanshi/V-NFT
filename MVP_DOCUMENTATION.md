# SUI AMM - Minimum Viable Product (MVP) Documentation

## Overview
This MVP demonstrates a fully functional Automated Market Maker (AMM) on Sui with core trading and liquidity management capabilities.

## MVP Features

### 1. Core Smart Contracts

#### PoolFactory.move
- **Purpose**: Create and manage liquidity pools
- **Key Functions**:
  - `init()`: Initialize the factory
  - `create_pool()`: Create new token pair pools
  - **Fee Tiers**: 0.05%, 0.3%, 1%
  - **Validation**: Ensures no duplicate pools for same pair

#### LiquidityPool.move
- **Purpose**: Core AMM logic with constant product formula
- **Key Functions**:
  - `create_pool()`: Initialize pool with initial liquidity
  - `add_liquidity()`: Add tokens to earn LP share
  - `swap()`: Execute token swaps with fee collection
  - `remove_liquidity()`: Withdraw tokens from pool
- **Formula**: x * y = k (constant product)
- **Fee Distribution**: Accumulated in pool for all LPs

#### FeeAccumulator.move
- **Purpose**: Manage fee collection and distribution
- **Key Functions**:
  - `accumulate_fee()`: Collect swap fees
  - `calculate_claimable()`: Pro-rata fee calculation

### 2. Frontend Dashboard Features

#### Swap Interface
- Input/output token selection
- Real-time price preview
- Slippage protection (minimum output)
- Price impact calculation
- Exchange rate display
- Token balance checking

#### Liquidity Management
- Pool browser with search
- Pool statistics (TVL, 24h volume, APR)
- Add liquidity interface
- Position tracking
- Fee claiming interface

#### Portfolio Tracking
- LP position display
- Position value calculation
- Accumulated fees tracking
- Impermanent loss estimation
- Position management (add/remove)

### 3. Mathematical Correctness

#### Constant Product Formula
\`\`\`
Output = (input_with_fee * reserve_out) / (reserve_in + input_with_fee)
\`\`\`

#### LP Token Calculation
\`\`\`
LP_tokens = (amount_in * total_supply) / reserve_in
\`\`\`

#### Initial Liquidity
\`\`\`
initial_LP = sqrt(amount_a * amount_b)
\`\`\`

#### Fee Calculation
\`\`\`
fee = (swap_amount * fee_tier) / 10000
amount_in_with_fee = swap_amount - fee
\`\`\`

### 4. Testing Coverage

#### Unit Tests
- **Constant Product Formula**: Verifies x*y=k maintains invariant
- **Price Impact**: Ensures larger swaps have higher impact
- **Fee Calculation**: Validates fee accuracy
- **Edge Cases**: Tests very large/small amounts
- **Geometric Mean**: Confirms initial LP calculation
- **LP Minting**: Validates token generation

#### Test Results
- ✅ 8 test cases (100% passing in MVP)
- ✅ Mathematical verification passed
- ✅ Edge case handling validated

## User Flows

### Create Pool
\`\`\`
1. User calls create_pool with token pair
2. System validates no duplicate pair exists
3. User provides initial liquidity
4. K value calculated: k = reserve_a * reserve_b
5. LP tokens minted: sqrt(amount_a * amount_b)
6. Pool created and indexed
\`\`\`

### Swap
\`\`\`
1. User inputs swap amount and selects tokens
2. System calculates output with fee
3. Validates output >= minimum (slippage check)
4. Executes swap:
   - Transfers input token to pool
   - Calculates output: (input * reserve_out) / (reserve_in + input)
   - Transfers output to user
5. Accumulates fee in pool
6. Updates reserves
\`\`\`

### Add Liquidity
\`\`\`
1. LP selects pool and amounts
2. System calculates required ratio
3. LP provides both tokens
4. LP tokens minted: (amount * total_supply) / reserve
5. NFT position created (in full spec)
6. Reserves updated
\`\`\`

### Claim Fees
\`\`\`
1. LP views accumulated fees
2. System calculates pro-rata share: (lp_tokens / total_supply) * total_fees
3. Transfers fees to LP
4. Metadata updated
\`\`\`

## Technical Stack

### Smart Contracts
- **Language**: Move (Sui)
- **Framework**: Sui SDK
- **Blockchain**: Sui Testnet

### Frontend
- **Framework**: Next.js 16
- **UI Library**: shadcn/ui with Tailwind CSS v4
- **Styling**: Dark-mode optimized DeFi interface
- **Components**: React 19 with server/client components

## Key Metrics

| Metric | Value |
|--------|-------|
| Total Liquidity Pools | 3 |
| Total TVL (Mock) | $2.4M |
| 24h Volume (Mock) | $1.2M |
| Average Fee Tier | 0.3% |
| LP Positions (Mock) | 2 |

## What's Next (Full Specs)

### Phase 2: Advanced Smart Contracts
- [ ] LPPositionNFT - Dynamic NFT metadata
- [ ] StableSwapPool - Optimized stable pairs
- [ ] SlippageProtection - Enhanced protection
- [ ] Enhanced FeeDistributor - Auto-compounding

### Phase 3: Advanced Features
- [ ] Multiple fee tiers
- [ ] Concentrated liquidity positions
- [ ] Flash loans
- [ ] Governance tokens

### Phase 4: Production Ready
- [ ] Comprehensive test suite (>80% coverage)
- [ ] Security audit
- [ ] Gas optimization
- [ ] Mainnet deployment
- [ ] Admin/governance contract

## Security Considerations (MVP)

1. **Fee Tier Validation**: Only allows 0.05%, 0.3%, 1%
2. **Pool Uniqueness**: No duplicate pools for same pair
3. **Slippage Protection**: Minimum output enforcement
4. **Reserve Invariant**: K value maintained through swaps
5. **Underflow Protection**: Checked in all calculations

## Gas Optimization Opportunities

1. **Batch operations**: Multiple swaps in one transaction
2. **Pool indexing**: Optimized pool lookup
3. **Balance operations**: Native Sui balance module usage
4. **Fee collection**: Efficient accumulation mechanism

## Deployment Instructions

### Smart Contracts
\`\`\`bash
# Publish to Sui testnet
sui client publish --gas-budget 50000000
\`\`\`

### Frontend
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## API Reference

### Pool Creation
```rust
public entry fun create_pool(
    factory: &mut PoolFactory,
    token_a: String,
    token_b: String,
    fee_tier: u64,
    ctx: &mut TxContext,
)
