def validate_campaign_economics(
    advertiser_payout,
    user_reward,
    reserve
):
    if advertiser_payout <= 0:
        raise ValueError("Invalid advertiser payout")

    if user_reward < 0:
        raise ValueError("Invalid user reward")

    if reserve < 0:
        raise ValueError("Invalid reserve")

    platform_fee = (
        advertiser_payout
        - user_reward
        - reserve
    )

    if platform_fee < 0:
        raise ValueError(
            "Campaign reward exceeds funding"
        )

    return platform_fee
