async def create_withdrawal(
    user_id,
    amount_cents,
    payment_profile_id,
):
    async with db.transaction():

        wallet = await db.fetch_one(
            """
            SELECT available_cents
            FROM wallets
            WHERE user_id = $1
            FOR UPDATE
            """,
            user_id,
        )

        if not wallet:
            raise ValueError("Wallet not found")

        if amount_cents <= 0:
            raise ValueError("Invalid amount")

        if amount_cents < MIN_WITHDRAWAL_CENTS:
            raise ValueError("Below minimum withdrawal")

        if wallet["available_cents"] < amount_cents:
            raise ValueError("Insufficient available balance")

        await db.execute(
            """
            UPDATE wallets
            SET available_cents =
                available_cents - $1,
                updated_at = now()
            WHERE user_id = $2
            """,
            amount_cents,
            user_id,
        )

        withdrawal = await db.fetch_one(
            """
            INSERT INTO withdrawals (
                user_id,
                amount_cents,
                payout_provider,
                payment_profile_id,
                status
            )
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING id
            """,
            user_id,
            amount_cents,
            PAYOUT_PROVIDER,
            payment_profile_id,
        )

        await db.execute(
            """
            INSERT INTO ledger_entries (
                entry_type,
                amount_cents,
                reference_type,
                reference_id
            )
            VALUES (
                'withdrawal',
                $1,
                'withdrawal',
                $2
            )
            """,
            -amount_cents,
            withdrawal["id"],
        )

        return withdrawal
