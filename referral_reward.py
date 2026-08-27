async def create_referral_reward(
    referral_id: str
):

    async with db.transaction():

        referral = await db.fetch_one(
            """
            SELECT *
            FROM referrals
            WHERE id = $1
            FOR UPDATE
            """,
            referral_id,
        )

        if not referral:
            raise ValueError("Referral not found")

        if not referral["is_eligible"]:
            raise ValueError("Referral not eligible")

        existing = await db.fetch_one(
            """
            SELECT id
            FROM reward_transactions
            WHERE user_id = $1
              AND type = 'referral'
              AND idempotency_key = $2
            """,
            referral["referrer_id"],
            f"referral:{referral_id}",
        )

        if existing:
            return existing["id"]

        reward = await db.fetch_one(
            """
            INSERT INTO reward_transactions (
                user_id,
                type,
                amount_cents,
                status,
                idempotency_key
            )
            VALUES (
                $1,
                'referral',
                $2,
                'pending',
                $3
            )
            RETURNING id
            """,
            referral["referrer_id"],
            REFERRAL_REWARD_CENTS,
            f"referral:{referral_id}",
        )

        return reward["id"]
