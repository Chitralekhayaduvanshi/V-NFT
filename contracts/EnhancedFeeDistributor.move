module amm::enhanced_fee_distributor {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::balance::{Self, Balance};
    use sui::coin::Coin;
    use sui::table::Table;

    /// Enhanced fee distributor with auto-compounding
    public struct EnhancedFeeDistributor<phantom Token> has key {
        id: UID,
        accumulated_fees: Balance<Token>,
        total_lp_share: u128,
        protocol_fee_percentage: u64,
        auto_compound_enabled: bool,
        lp_fee_claims: Table<address, u128>,
    }

    /// Initialize distributor
    public fun init_distributor<Token>(
        protocol_fee_pct: u64,
        ctx: &mut TxContext,
    ): EnhancedFeeDistributor<Token> {
        assert!(protocol_fee_pct <= 5000, 1001); // Max 50% protocol fee

        EnhancedFeeDistributor {
            id: object::new(ctx),
            accumulated_fees: balance::zero(),
            total_lp_share: 0,
            protocol_fee_percentage: protocol_fee_pct,
            auto_compound_enabled: false,
            lp_fee_claims: sui::table::new(ctx),
        }
    }

    /// Add fees to distributor
    public fun add_fees<Token>(
        distributor: &mut EnhancedFeeDistributor<Token>,
        fee_coin: Coin<Token>,
    ) {
        balance::join(&mut distributor.accumulated_fees, coin::into_balance(fee_coin));
    }

    /// Calculate protocol and LP fees
    public fun calculate_fees(
        distributor: &EnhancedFeeDistributor<Token>,
        total_fees: u128,
    ): (u128, u128) {
        let protocol_fees = (total_fees * (distributor.protocol_fee_percentage as u128)) / 10000;
        let lp_fees = total_fees - protocol_fees;
        (protocol_fees, lp_fees)
    }

    /// Calculate pro-rata claimable fees
    public fun calculate_claimable(
        distributor: &EnhancedFeeDistributor<Token>,
        lp_share: u128,
    ): u128 {
        let total_fees = (balance::value(&distributor.accumulated_fees) as u128);
        let (_, lp_fees) = calculate_fees(distributor, total_fees);
        (lp_share * lp_fees) / distributor.total_lp_share
    }

    /// Claim fees
    public fun claim_fees<Token>(
        distributor: &mut EnhancedFeeDistributor<Token>,
        lp_share: u128,
        claimer: address,
    ): Coin<Token> {
        let claimable = calculate_claimable(distributor, lp_share);
        assert!(claimable > 0, 1002);

        let claimed_coin = coin::take(&mut distributor.accumulated_fees, (claimable as u64), ctx);
        
        if (sui::table::contains(&distributor.lp_fee_claims, claimer)) {
            let prev_claim = sui::table::borrow_mut(&mut distributor.lp_fee_claims, claimer);
            *prev_claim = *prev_claim + claimable;
        } else {
            sui::table::add(&mut distributor.lp_fee_claims, claimer, claimable);
        };

        claimed_coin
    }

    /// Enable auto-compounding
    public fun enable_auto_compound<Token>(
        distributor: &mut EnhancedFeeDistributor<Token>,
    ) {
        distributor.auto_compound_enabled = true;
    }

    /// Auto-compound fees into position
    public fun auto_compound<Token>(
        distributor: &mut EnhancedFeeDistributor<Token>,
        lp_share: u128,
    ): u128 {
        assert!(distributor.auto_compound_enabled, 1003);
        
        let compounded_amount = calculate_claimable(distributor, lp_share);
        // In production, would reinvest this into LP position
        compounded_amount
    }
}
