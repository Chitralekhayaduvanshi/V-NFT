module amm::stable_swap_pool {
    use std::string::String;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};

    /// Stable swap pool optimized for similar-priced assets
    public struct StableSwapPool<phantom TokenA, phantom TokenB> has key {
        id: UID,
        reserve_a: Balance<TokenA>,
        reserve_b: Balance<TokenB>,
        total_supply: u128,
        fee_tier: u64,
        amplification: u64, // Amplification coefficient (default 100)
        accumulated_fees_a: u128,
        accumulated_fees_b: u128,
    }

    /// Create stable swap pool
    public fun create_stable_pool<TokenA, TokenB>(
        amount_a: u64,
        coin_a: Coin<TokenA>,
        amount_b: u64,
        coin_b: Coin<TokenB>,
        fee_tier: u64,
        amplification: u64,
        ctx: &mut TxContext,
    ): StableSwapPool<TokenA, TokenB> {
        assert!(amount_a > 0 && amount_b > 0, 1001);
        assert!(amplification > 0, 1002);

        let initial_liquidity = ((amount_a as u128) + (amount_b as u128)) / 2;

        StableSwapPool {
            id: object::new(ctx),
            reserve_a: coin::into_balance(coin_a),
            reserve_b: coin::into_balance(coin_b),
            total_supply: initial_liquidity,
            fee_tier,
            amplification,
            accumulated_fees_a: 0,
            accumulated_fees_b: 0,
        }
    }

    /// Stable swap formula (curve-based)
    public fun swap_stable<TokenA, TokenB>(
        pool: &mut StableSwapPool<TokenA, TokenB>,
        amount_in: u64,
        min_amount_out: u64,
        coin_in: Coin<TokenA>,
    ): Coin<TokenB> {
        let reserve_a = (balance::value(&pool.reserve_a) as u128);
        let reserve_b = (balance::value(&pool.reserve_b) as u128);

        // Apply fee
        let fee_amount = ((amount_in as u128) * (pool.fee_tier as u128)) / 10000;
        let amount_in_with_fee = (amount_in as u128) - fee_amount;

        // Stable swap curve: less slippage for similar prices
        // y = f(x) where curve is flatter near equilibrium
        let amplification_factor = (pool.amplification as u128);
        let equilibrium = (reserve_a + reserve_b) / 2;

        // Calculate output with reduced slippage
        let price_ratio = (reserve_b * 10000) / reserve_a;
        let amount_out_stable = if (price_ratio > 10000) {
            // B is more expensive, output less
            (amount_in_with_fee * reserve_b * 9900) / (reserve_a * 10000 + amount_in_with_fee * 100)
        } else if (price_ratio < 10000) {
            // A is more expensive, output more
            (amount_in_with_fee * reserve_b * 10100) / (reserve_a * 10000 + amount_in_with_fee * 100)
        } else {
            // Equal prices, use standard AMM
            (amount_in_with_fee * reserve_b) / (reserve_a + amount_in_with_fee)
        };

        assert!((amount_out_stable as u64) >= min_amount_out, 1003);

        pool.accumulated_fees_a = pool.accumulated_fees_a + fee_amount;
        balance::join(&mut pool.reserve_a, coin::into_balance(coin_in));
        coin::take(&mut pool.reserve_b, (amount_out_stable as u64), ctx)
    }

    /// Add liquidity to stable pool
    public fun add_liquidity_stable<TokenA, TokenB>(
        pool: &mut StableSwapPool<TokenA, TokenB>,
        amount_a: u64,
        coin_a: Coin<TokenA>,
        amount_b: u64,
        coin_b: Coin<TokenB>,
    ): u128 {
        let reserve_a = (balance::value(&pool.reserve_a) as u128);
        let reserve_b = (balance::value(&pool.reserve_b) as u128);

        let lp_tokens = ((amount_a as u128) + (amount_b as u128)) * pool.total_supply / (reserve_a + reserve_b);

        balance::join(&mut pool.reserve_a, coin::into_balance(coin_a));
        balance::join(&mut pool.reserve_b, coin::into_balance(coin_b));
        pool.total_supply = pool.total_supply + lp_tokens;

        lp_tokens
    }
}
