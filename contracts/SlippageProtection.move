module amm::slippage_protection {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    /// Slippage configuration and validation
    public struct SlippageProtection has key {
        id: UID,
        default_slippage: u64, // in basis points (0.01%)
        max_allowed_slippage: u64,
        min_slippage: u64,
    }

    /// Initialize slippage protection module
    public fun init_slippage(ctx: &mut TxContext): SlippageProtection {
        SlippageProtection {
            id: object::new(ctx),
            default_slippage: 50, // 0.5%
            max_allowed_slippage: 500, // 5%
            min_slippage: 1, // 0.01%
        }
    }

    /// Validate slippage tolerance
    public fun validate_slippage(
        protection: &SlippageProtection,
        slippage: u64,
    ) {
        assert!(slippage >= protection.min_slippage, 1001);
        assert!(slippage <= protection.max_allowed_slippage, 1002);
    }

    /// Calculate minimum output with slippage
    public fun calculate_minimum_output(
        expected_output: u128,
        slippage_bps: u64, // basis points
    ): u128 {
        let slippage_amount = (expected_output * (slippage_bps as u128)) / 10000;
        expected_output - slippage_amount
    }

    /// Validate price limit order
    public fun validate_price_limit(
        current_price: u128,
        limit_price: u128,
        is_sell: bool,
    ) {
        if (is_sell) {
            // For sell, limit should be <= current price
            assert!(limit_price <= current_price, 1003);
        } else {
            // For buy, limit should be >= current price
            assert!(limit_price >= current_price, 1004);
        }
    }

    /// Check deadline
    public fun validate_deadline(
        timestamp: u64,
        deadline: u64,
    ) {
        assert!(timestamp <= deadline, 1005);
    }
}
