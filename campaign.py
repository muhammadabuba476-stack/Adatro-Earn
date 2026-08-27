async def complete_campaign(
    campaign_id,
    user_id,
    idempotency_key,
    provider_click_id
):

    async with db.transaction():

        campaign = await db.fetch_one(
            """
            SELECT *
            FROM campaigns
            WHERE id = $1
            FOR UPDATE
            """,
            campaign_id
        )

        if not campaign:
            raise ValueError("Campaign not found")

        if campaign["status"] != "active":
            raise ValueError(
                "Campaign unavailable"
            )

        required_funding = (
            campaign["user_reward_cents"]
            + campaign["platform_fee_cents"]
            + campaign["reversal_reserve_cents"]
        )

        if (
            campaign["remaining_budget_cents"]
            < required_funding
        ):
            raise ValueError(
                "Campaign has insufficient funding"
            )

        if (
            campaign["max_completions"]
            is not None
            and campaign["completions_count"]
            >= campaign["max_completions"]
        ):
            raise ValueError(
                "Campaign completed"
            )

        existing = await db.fetch_one(
            """
            SELECT id
            FROM reward_transactions
            WHERE idempotency_key = $1
            """,
            idempotency_key
        )

        if existing:
            return existing["id"]

        new_remaining = (
            campaign["remaining_budget_cents"]
            - required_funding
        )

        new_status = (
            "completed"
            if new_remaining < required_funding
            else "active"
        )

        await db.execute(
            """
            UPDATE campaigns
            SET
              remaining_budget_cents = $1,
              completions_count =
                completions_count + 1,
              status = $2
            WHERE id = $3
            """,
            new_remaining,
            new_status,
            campaign_id
        )

        reward = await db.fetch_one(
            """
            INSERT INTO reward_transactions (
              user_id,
              campaign_id,
              type,
              amount_cents,
              status,
              provider_click_id,
              idempotency_key
            )
            VALUES (
              $1,
              $2,
              'campaign',
              $3,
              'pending',
              $4,
              $5
            )
            RETURNING id
            """,
            user_id,
            campaign_id,
            campaign["user_reward_cents"],
            provider_click_id,
            idempotency_key
        )

        return reward["id"]
