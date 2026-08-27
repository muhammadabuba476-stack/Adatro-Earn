async def register_referral(
    referred_user_id: str,
    referral_code: str
):
    async with db.transaction():

        referrer = await db.fetch_one(
            """
            SELECT id
            FROM users
            WHERE referral_code = $1
            """,
            referral_code,
        )

        if not referrer:
            return None

        if str(referrer["id"]) == str(referred_user_id):
            return None

        existing = await db.fetch_one(
            """
            SELECT id
            FROM referrals
            WHERE referred_id = $1
            """,
            referred_user_id,
        )

        if existing:
            return existing["id"]

        referral = await db.fetch_one(
            """
            INSERT INTO referrals (
                referrer_id,
                referred_id,
                is_eligible
            )
            VALUES ($1, $2, false)
            RETURNING id
            """,
            referrer["id"],
            referred_user_id,
        )

        return referral["id"]
