module amm::pool_factory {
    use std::string::String;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::dynamic_field;
    use sui::table::Table;

    /// Pool information stored in factory
    public struct PoolInfo has store {
        token_a: String,
        token_b: String,
        fee_tier: u64,
        pool_id: ID,
        tvl: u128,
        volume_24h: u128,
        created_at: u64,
    }

    /// Main factory object
    public struct PoolFactory has key {
        id: UID,
        pools: Table<String, PoolInfo>,
        protocol_fee: u64,
        pool_count: u64,
    }

    /// Initialize the factory
    public fun init(ctx: &mut TxContext) {
        let factory = PoolFactory {
            id: object::new(ctx),
            pools: sui::table::new(ctx),
            protocol_fee: 50, // 0.05%
            pool_count: 0,
        };
        sui::transfer::share_object(factory);
    }

    /// Create a new liquidity pool
    public entry fun create_pool(
        factory: &mut PoolFactory,
        token_a: String,
        token_b: String,
        fee_tier: u64,
        ctx: &mut TxContext,
    ) {
        // Validate fee tier (0.05%, 0.3%, 1%)
        assert!(fee_tier == 5 || fee_tier == 30 || fee_tier == 100, 1001);

        let pool_key = create_pool_key(&token_a, &token_b, fee_tier);
        assert!(!sui::table::contains(&factory.pools, pool_key), 1002);

        let pool_info = PoolInfo {
            token_a,
            token_b,
            fee_tier,
            pool_id: object::id_from_address(@0x0),
            tvl: 0,
            volume_24h: 0,
            created_at: sui::clock::timestamp_ms(&sui::clock::create(ctx)),
        };

        sui::table::add(&mut factory.pools, pool_key, pool_info);
        factory.pool_count = factory.pool_count + 1;
    }

    /// Helper: create unique pool key
    fun create_pool_key(token_a: &String, token_b: &String, fee_tier: u64): String {
        // Simple key concatenation (in production, would use better hashing)
        let mut key = *token_a;
        key = key.append_utf8(b"-");
        key = key.append_utf8(fee_tier.to_string().as_bytes());
        key = key.append_utf8(b"-");
        key = key.append_utf8(token_b);
        key
    }
}
