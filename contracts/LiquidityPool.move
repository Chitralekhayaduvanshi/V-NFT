module amm::liquidity_pool {
    use std::string::String;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};

    /// Core AMM pool struct
    public struct LiquidityPool<phantom TokenA, phantom TokenB> has key {
        id: UID,
        reserve_a: Balance<TokenA>,
        reserve_b: Balance<TokenB>,
        total_supply: u128,
        fee_tier: u64,
        accumulated_fees_a: u128,
        accumulated_fees_b: u128,
    }

    /// LP token (simplified - would be NFT in full spec)
    public struct LPToken has drop {}

    /// Create a new pool with initial liquidity
    public fun create_pool<TokenA, TokenB>(
        amount_a: u64,
        coin_a: Coin<TokenA>,
        amount_b: u64,
        coin_b: Coin<TokenB>,
        fee_tier: u64,
        ctx: &mut TxContext,
    ): LiquidityPool<TokenA, TokenB> {
        assert!(amount_a > 0 && amount_b > 0, 1001);
        
        // Calculate initial LP tokens using geometric mean: sqrt(a * b)
        let initial_liquidity = sqrt((amount_a as u128) * (amount_b as u128));

        LiquidityPool {
            id: object::new(ctx),
            reserve_a: coin::into_balance(coin_a),
            reserve_b: coin::into_balance(coin_b),
            total_supply: initial_liquidity,
            fee_tier,
            accumulated_fees_a: 0,
            accumulated_fees_b: 0,
        }
    }

    /// Add liquidity to the pool
    public fun add_liquidity<TokenA, TokenB>(
        pool: &mut LiquidityPool<TokenA, TokenB>,
        amount_a: u64,
        coin_a: Coin<TokenA>,
        amount_b: u64,
        coin_b: Coin<TokenB>,
    ): u128 {
        let reserve_a = balance::value(&pool.reserve_a);
        let reserve_b = balance::value(&pool.reserve_b);

        // Calculate required ratio
        let required_b = ((amount_a as u128) * (reserve_b as u128)) / (reserve_a as u128);
        assert!((required_b as u64) <= amount_b, 1002);

        // Calculate LP tokens to mint
        let lp_tokens = ((amount_a as u128) * pool.total_supply) / (reserve_a as u128);

        // Update reserves
        balance::join(&mut pool.reserve_a, coin::into_balance(coin_a));
        balance::join(&mut pool.reserve_b, coin::into_balance(coin_b));
        pool.total_supply = pool.total_supply + lp_tokens;

        lp_tokens
    }

    /// Execute a swap
    public fun swap<TokenA, TokenB>(
        pool: &mut LiquidityPool<TokenA, TokenB>,
        amount_in: u64,
        min_amount_out: u64,
        coin_in: Coin<TokenA>,
    ): Coin<TokenB> {
        let reserve_a = (balance::value(&pool.reserve_a) as u128);
        let reserve_b = (balance::value(&pool.reserve_b) as u128);

        // Apply fee
        let fee_amount = ((amount_in as u128) * (pool.fee_tier as u128)) / 10000;
        let amount_in_with_fee = (amount_in as u128) - fee_amount;

        // Calculate output using x*y=k formula
        // output = (input_with_fee * reserve_out) / (reserve_in + input_with_fee)
        let amount_out = (amount_in_with_fee * reserve_b) / (reserve_a + amount_in_with_fee);

        assert!((amount_out as u64) >= min_amount_out, 1003);

        // Accumulate fees
        pool.accumulated_fees_a = pool.accumulated_fees_a + fee_amount;

        // Update reserves
        balance::join(&mut pool.reserve_a, coin::into_balance(coin_in));
        coin::take(&mut pool.reserve_b, (amount_out as u64), ctx)
    }

    /// Remove liquidity
    public fun remove_liquidity<TokenA, TokenB>(
        pool: &mut LiquidityPool<TokenA, TokenB>,
        lp_tokens: u128,
    ): (u64, u64) {
        let reserve_a = (balance::value(&pool.reserve_a) as u128);
        let reserve_b = (balance::value(&pool.reserve_b) as u128);

        // Calculate token amounts
        let amount_a = (lp_tokens * reserve_a) / pool.total_supply;
        let amount_b = (lp_tokens * reserve_b) / pool.total_supply;

        pool.total_supply = pool.total_supply - lp_tokens;

        ((amount_a as u64), (amount_b as u64))
    }

    /// Get reserves
    public fun get_reserves<TokenA, TokenB>(
        pool: &LiquidityPool<TokenA, TokenB>,
    ): (u64, u64) {
        (
            balance::value(&pool.reserve_a),
            balance::value(&pool.reserve_b),
        )
    }

    /// Simple sqrt implementation
    fun sqrt(n: u128): u128 {
        if (n == 0) return 0;
        let mut x = n;
        let mut y = (x + 1) / 2;
        while (y < x) {
            x = y;
            y = (x + n / x) / 2;
        };
        x
    }
}
