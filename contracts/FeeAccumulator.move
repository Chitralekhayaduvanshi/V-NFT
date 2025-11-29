module amm::fee_accumulator {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::balance::{Self, Balance};
    use sui::coin::Coin;

    /// Fee accumulation and distribution
    public struct FeeAccumulator<phantom Token> has key {
        id: UID,
        accumulated_fees: Balance<Token>,
        total_lp_share: u128,
    }

    /// Create new fee accumulator
    public fun new<Token>(ctx: &mut TxContext): FeeAccumulator<Token> {
        FeeAccumulator {
            id: object::new(ctx),
            accumulated_fees: balance::zero(),
            total_lp_share: 0,
        }
    }

    /// Accumulate fees from swaps
    public fun accumulate_fee<Token>(
        accumulator: &mut FeeAccumulator<Token>,
        fee_coin: Coin<Token>,
    ) {
        balance::join(&mut accumulator.accumulated_fees, coin::into_balance(fee_coin));
    }

    /// Calculate claimable fees for an LP
    public fun calculate_claimable(
        accumulator: &FeeAccumulator<Token>,
        lp_share: u128,
    ): u128 {
        let total_fees = (balance::value(&accumulator.accumulated_fees) as u128);
        (lp_share * total_fees) / accumulator.total_lp_share
    }

    /// Get accumulated fees
    public fun get_accumulated_fees<Token>(
        accumulator: &FeeAccumulator<Token>,
    ): u64 {
        balance::value(&accumulator.accumulated_fees)
    }
}
