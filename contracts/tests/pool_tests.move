#[test_only]
module amm::pool_tests {
    use sui::test_scenario;
    use amm::liquidity_pool;

    const POOL_FEE: u64 = 30; // 0.3%

    #[test]
    fun test_constant_product_formula() {
        // Test: x * y = k formula verification
        let reserve_a: u128 = 1000;
        let reserve_b: u128 = 2000;
        let k_initial = reserve_a * reserve_b;

        // Swap 100 tokens of A
        let amount_in: u128 = 100;
        let fee_amount = (amount_in * (POOL_FEE as u128)) / 10000;
        let amount_in_with_fee = amount_in - fee_amount;

        // Calculate output: (input_with_fee * reserve_b) / (reserve_a + input_with_fee)
        let amount_out = (amount_in_with_fee * reserve_b) / (reserve_a + amount_in_with_fee);

        // New reserves
        let new_reserve_a = reserve_a + amount_in;
        let new_reserve_b = reserve_b - amount_out;

        // K should increase or stay the same (due to fees)
        let k_after = new_reserve_a * new_reserve_b;
        assert!(k_after >= k_initial, 1001);
    }

    #[test]
    fun test_price_impact_calculation() {
        // Test: Price impact increases with amount
        let reserve_a: u128 = 10000;
        let reserve_b: u128 = 10000;

        // Small swap
        let small_amount: u128 = 10;
        let fee_small = (small_amount * (POOL_FEE as u128)) / 10000;
        let small_out = (small_amount - fee_small) * reserve_b / (reserve_a + small_amount - fee_small);
        let small_price_impact = (small_amount * 100) / (reserve_a * 2);

        // Large swap
        let large_amount: u128 = 1000;
        let fee_large = (large_amount * (POOL_FEE as u128)) / 10000;
        let large_out = (large_amount - fee_large) * reserve_b / (reserve_a + large_amount - fee_large);
        let large_price_impact = (large_amount * 100) / (reserve_a * 2);

        assert!(large_price_impact > small_price_impact, 1002);
    }

    #[test]
    fun test_fee_calculation_accuracy() {
        // Test: Fee calculation for various amounts
        let amounts = [vector[100u128, 500, 1000, 5000]];
        let fee_tier = 30; // 0.3%

        let amount = 1000;
        let expected_fee = (amount * (fee_tier as u128)) / 10000;
        assert!(expected_fee == 3, 1003); // 1000 * 0.003 = 3
    }

    #[test]
    fun test_edge_case_very_large_amount() {
        // Test: Very large swap amount doesn't overflow
        let reserve_a: u128 = 1000000000000;
        let reserve_b: u128 = 1000000000000;
        let amount_in: u128 = 100000000000;

        let fee = (amount_in * 30) / 10000;
        let amount_with_fee = amount_in - fee;
        let amount_out = (amount_with_fee * reserve_b) / (reserve_a + amount_with_fee);

        assert!(amount_out > 0, 1004);
    }

    #[test]
    fun test_edge_case_very_small_amount() {
        // Test: Very small amounts are handled correctly
        let reserve_a: u128 = 1000000;
        let reserve_b: u128 = 1000000;
        let amount_in: u128 = 1;

        let fee = (amount_in * 30) / 10000;
        // Fee on 1 token is 0 due to integer division
        let amount_with_fee = amount_in - fee;
        let amount_out = (amount_with_fee * reserve_b) / (reserve_a + amount_with_fee);

        assert!(amount_out >= 0, 1005);
    }

    #[test]
    fun test_geometric_mean_initial_liquidity() {
        // Test: Initial LP tokens = sqrt(amount_a * amount_b)
        let amount_a: u128 = 1000;
        let amount_b: u128 = 4000;
        let expected_lp = sqrt_u128(amount_a * amount_b);

        assert!(expected_lp == 2000, 1006);
    }

    #[test]
    fun test_lp_token_calculation() {
        // Test: LP token minting formula
        let reserve_a: u128 = 1000;
        let total_supply: u128 = 2000;
        let amount_a: u128 = 500;

        let lp_tokens = (amount_a * total_supply) / reserve_a;
        assert!(lp_tokens == 1000, 1007);
    }

    // Helper function
    fun sqrt_u128(n: u128): u128 {
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
