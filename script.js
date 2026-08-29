"use strict";

/*
============================================================
ADATRO EARN
Telegram Mini App
Vanilla JavaScript

IMPORTANT:
- Frontend is NEVER the final authority for rewards.
- No reward is credited from button clicks.
- Backend must verify all earning events.
============================================================
*/


/* =========================================================
   TELEGRAM
========================================================= */

const tg = window.Telegram?.WebApp || null;

if (tg) {
    tg.ready();
    tg.expand();

    try {
        tg.setHeaderColor("#07100d");
        tg.setBackgroundColor("#050907");
    } catch (error) {
        console.warn("Telegram theme API unavailable:", error);
    }
}


/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {

    /*
    Replace with your real backend URL when backend is ready.
    Example:
    API_BASE_URL: "https://api.adatroearn.com"
    */

    API_BASE_URL: "",

    /*
    Your Telegram bot username.

    Example:
    BOT_USERNAME: "AdatroEarnBot"
    */

    BOT_USERNAME: "AdatroEarnBot",

    /*
    Demo mode is ONLY for UI testing.

    It does NOT automatically generate earnings.

    Set false when your real backend is connected.
    */

    DEMO_MODE: true,

    /*
    Coin conversion displayed by the UI.

    IMPORTANT:
    The backend should provide the authoritative USD value
    when the real wallet system is connected.
    */

    COINS_PER_USD: 10000,

    DAILY_TARGET: 5000
};


/* =========================================================
   APPLICATION STATE
========================================================= */

const state = {

    telegramUser: null,

    wallet: {
        coins: 12850,
        usd: 1.28
    },

    daily: {
        earned: 2450,
        target: CONFIG.DAILY_TARGET
    },

    referral: {
        count: 12,
        coins: 4850
    },

    dailyReward: {
        day: 4,
        claimedToday: false
    },

    tasks: [],

    transactions: [],

    currentPage: "homePage"
};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   TELEGRAM USER
========================================================= */

function getTelegramUser() {

    if (!tg?.initDataUnsafe?.user) {
        return null;
    }

    return tg.initDataUnsafe.user;
}


/*
IMPORTANT SECURITY NOTE:

initDataUnsafe.user is useful for displaying the user.

Do NOT use it as trusted authentication data on your backend.

Your backend must validate tg.initData server-side.
*/


function initializeTelegramUser() {

    const user = getTelegramUser();

    if (user) {
        state.telegramUser = {
            id: user.id,
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            username: user.username || "",
            photo_url: user.photo_url || ""
        };
    } else {

        state.telegramUser = {
            id: null,
            first_name: "Demo",
            last_name: "User",
            username: "demo_user",
            photo_url: ""
        };
    }

    renderUser();
}


/* =========================================================
   USER PROFILE UI
========================================================= */

function renderUser() {

    const user = state.telegramUser;

    if (!user) return;

    const fullName =
        `${user.first_name || ""} ${user.last_name || ""}`.trim()
        || "User";

    const username = user.username
        ? `@${user.username}`
        : "Telegram User";

    $("#userName").textContent = fullName;
    $("#userUsername").textContent = username;

    const initial =
        (user.first_name || "U").charAt(0).toUpperCase();

    $("#avatarFallback").textContent = initial;
    $("#profileInitial").textContent = initial;

    if (user.photo_url) {

        $("#userAvatar").src = user.photo_url;
        $("#userAvatar").style.display = "block";

        $("#avatarFallback").style.display = "none";

        $("#profilePhoto").src = user.photo_url;
        $("#profilePhoto").style.display = "block";

        $("#profileInitial").style.display = "none";
    }
}


/* =========================================================
   API HELPER
========================================================= */

async function apiRequest(endpoint, options = {}) {

    if (!CONFIG.API_BASE_URL) {
        throw new Error("Backend API is not configured.");
    }

    const url =
        `${CONFIG.API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    /*
    Telegram initData is the value that the backend should
    validate using Telegram's official validation procedure.
    */

    if (tg?.initData) {
        headers["X-Telegram-Init-Data"] = tg.initData;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {

        let message = "Request failed.";

        try {
            const data = await response.json();
            message = data.message || message;
        } catch (_) {
            // Ignore invalid JSON response.
        }

        throw new Error(message);
    }

    return response.json();
}


/* =========================================================
   BACKEND-READY FUNCTIONS
========================================================= */


/*
GET USER PROFILE
*/

async function getUserProfile() {

    if (!CONFIG.API_BASE_URL) {
        return state.telegramUser;
    }

    return apiRequest("/api/user/profile");
}


/*
GET WALLET BALANCE
*/

async function getWalletBalance() {

    if (!CONFIG.API_BASE_URL) {
        return state.wallet;
    }

    return apiRequest("/api/wallet");
}


/*
GET TASKS
*/

async function getTasks() {

    if (!CONFIG.API_BASE_URL) {

        /*
        Demo task data is only task metadata.

        It does NOT mean these tasks were completed.
        */

        return [
            {
                id: "watch-demo",
                title: "Watch & Earn",
                description: "Watch verified sponsored content.",
                reward: 250,
                type: "video",
                status: "Available",
                verification_status: "Not Started",
                completion_status: "Not Completed"
            },
            {
                id: "task-demo",
                title: "Complete a Task",
                description: "Complete an eligible sponsored activity.",
                reward: 500,
                type: "task",
                status: "Available",
                verification_status: "Not Started",
                completion_status: "Not Completed"
            }
        ];
    }

    return apiRequest("/api/tasks");
}


/*
START TASK

Starting a task DOES NOT grant reward.
*/

async function startTask(taskId) {

    if (!CONFIG.API_BASE_URL) {

        return {
            success: true,
            taskId,
            status: "In Progress"
        };
    }

    return apiRequest(`/api/tasks/${encodeURIComponent(taskId)}/start`, {
        method: "POST"
    });
}


/*
VERIFY TASK

The backend must independently verify the activity.

The frontend must NEVER send:
reward = 500
completed = true

and expect the server to trust it.
*/

async function verifyTask(taskId) {

    if (!CONFIG.API_BASE_URL) {

        return {
            success: false,
            verified: false,
            message:
                "Task verification requires the real backend."
        };
    }

    return apiRequest(
        `/api/tasks/${encodeURIComponent(taskId)}/verify`,
        {
            method: "POST"
        }
    );
}


/*
CLAIM DAILY REWARD

Backend should enforce:
- user authentication
- eligibility
- once-per-day rule
- idempotency
- transaction locking
- reward amount
*/

async function claimDailyReward() {

    if (!CONFIG.API_BASE_URL) {

        return {
            success: false,
            claimed: false,
            message:
                "Daily reward claiming requires the real backend."
        };
    }

    return apiRequest("/api/rewards/daily/claim", {
        method: "POST"
    });
}


/*
GET REFERRAL STATS
*/

async function getReferralStats() {

    if (!CONFIG.API_BASE_URL) {
        return state.referral;
    }

    return apiRequest("/api/referrals/stats");
}


/*
GET RECENT EARNINGS
*/

async function getRecentEarnings() {

    if (!CONFIG.API_BASE_URL) {

        /*
        Demo history is explicitly marked as demo.

        It should be replaced by real backend records
        before production.
        */

        return [
            {
                id: "demo-1",
                amount: 500,
                title: "Daily Bonus",
                status: "Demo"
            },
            {
                id: "demo-2",
                amount: 250,
                title: "Watch & Earn",
                status: "Demo"
            },
            {
                id: "demo-3",
                amount: 1000,
                title: "Referral Reward",
                status: "Demo"
            }
        ];
    }

    return apiRequest("/api/earnings/recent");
}


/*
REQUEST WITHDRAWAL

Backend must verify:
- authenticated Telegram user
- available balance
- minimum withdrawal
- payout account
- transaction status
- duplicate request protection
*/

async function requestWithdrawal(amount) {

    if (!CONFIG.API_BASE_URL) {
        throw new Error(
            "Withdrawal is unavailable because the payout backend is not configured."
        );
    }

    return apiRequest("/api/withdrawals", {
        method: "POST",
        body: JSON.stringify({
            amount
        })
    });
}


/* =========================================================
   COIN / USD
========================================================= */

function formatNumber(number) {

    return Number(number || 0).toLocaleString("en-US");
}


function calculateUsd(coins) {

    return coins / CONFIG.COINS_PER_USD;
}


function formatUsd(value) {

    return Number(value || 0).toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


/* =========================================================
   RENDER WALLET
========================================================= */

function renderWallet() {

    const coins = Number(state.wallet.coins || 0);

    const usd =
        state.wallet.usd != null
            ? Number(state.wallet.usd)
            : calculateUsd(coins);

    $("#coinBalance").textContent =
        formatNumber(coins);

    $("#usdBalance").textContent =
        `+${formatUsd(usd)}`;

    $("#walletCoinBalance").textContent =
        formatNumber(coins);

    $("#walletUsdBalance").textContent =
        formatUsd(usd);
}


/* =========================================================
   DAILY GOAL
========================================================= */

function renderDailyGoal() {

    const earned =
        Number(state.daily.earned || 0);

    const target =
        Number(state.daily.target || CONFIG.DAILY_TARGET);

    const percent =
        target > 0
            ? Math.min(
                100,
                Math.round((earned / target) * 100)
            )
            : 0;

    const left =
        Math.max(0, target - earned);

    $("#dailyCurrent").textContent =
        formatNumber(earned);

    $("#dailyTarget").textContent =
        formatNumber(target);

    $("#goalPercent").textContent =
        `${percent}%`;

    $("#goalProgress").style.width =
        `${percent}%`;

    $("#coinsLeft").textContent =
        formatNumber(left);

    $("#todayCoins").textContent =
        `+${formatNumber(earned)} coins`;
}


/* =========================================================
   REFERRALS
========================================================= */

function renderReferrals() {

    $("#referralCount").textContent =
        formatNumber(state.referral.count);

    $("#referralCoins").textContent =
        `+${formatNumber(state.referral.coins)}`;

    $("#largeReferralCount").textContent =
        formatNumber(state.referral.count);

    $("#largeReferralCoins").textContent =
        `+${formatNumber(state.referral.coins)}`;
}


/* =========================================================
   TRANSACTIONS
========================================================= */

function renderTransactions(
    container,
    transactions
) {

    if (!container) return;

    container.innerHTML = "";

    if (!transactions || transactions.length === 0) {

        container.innerHTML = `
            <div class="transaction">
                <div class="transaction-icon">📭</div>

                <div class="transaction-info">
                    <strong>No earning records yet</strong>
                    <span>Verified activities will appear here.</span>
                </div>
            </div>
        `;

        return;
    }

    transactions.forEach((transaction) => {

        const row =
            document.createElement("div");

        row.className = "transaction";

        const isDemo =
            transaction.status === "Demo";

        row.innerHTML = `
            <div class="transaction-icon">
                ${getTransactionIcon(transaction.title)}
            </div>

            <div class="transaction-info">
                <strong>
                    +${formatNumber(transaction.amount)}
                    Coins — ${escapeHtml(transaction.title)}
                </strong>

                <span>
                    ${isDemo ? "UI demo record" : "Verified earning record"}
                </span>
            </div>

            <div class="transaction-amount">
                +${formatNumber(transaction.amount)}
            </div>
        `;

        container.appendChild(row);
    });
}


function getTransactionIcon(title = "") {

    const value = title.toLowerCase();

    if (value.includes("daily")) return "🎁";
    if (value.includes("watch")) return "🎬";
    if (value.includes("referral")) return "👥";
    if (value.includes("task")) return "🎯";

    return "💰";
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   TASKS
========================================================= */

function renderTasks() {

    const container = $("#allTasks");

    if (!container) return;

    container.innerHTML = "";

    if (!state.tasks.length) {

        container.innerHTML = `
            <div class="transaction">
                <div class="transaction-icon">📭</div>

                <div class="transaction-info">
                    <strong>No available tasks</strong>
                    <span>Check again later.</span>
                </div>
            </div>
        `;

        return;
    }

    state.tasks.forEach((task) => {

        const article =
            document.createElement("article");

        article.className = "task-card";

        article.innerHTML = `
            <div class="task-icon">
                ${getTaskIcon(task.type)}
            </div>

            <div class="task-content">
                <h3>${escapeHtml(task.title)}</h3>

                <p>
                    ${escapeHtml(task.description)}
                </p>

                <div class="task-meta">
                    <strong>
                        +${formatNumber(task.reward)} Coins
                    </strong>

                    <span>
                        ${escapeHtml(task.status)}
                    </span>
                </div>
            </div>

            <button
                class="task-action"
                type="button"
                data-task-id="${escapeHtml(task.id)}"
            >
                ${getTaskButton(task.status)}
            </button>
        `;

        const button =
            article.querySelector(".task-action");

        button.addEventListener(
            "click",
            () => handleTask(task)
        );

        container.appendChild(article);
    });
}


function getTaskIcon(type) {

    switch (type) {
        case "video":
            return "🎬";

        case "referral":
            return "👥";

        case "daily":
            return "🎁";

        default:
            return "🎯";
    }
}


function getTaskButton(status) {

    switch (status) {

        case "In Progress":
            return "CONTINUE";

        case "Pending Verification":
            return "VERIFY";

        case "Completed":
        case "Verified":
            return "COMPLETED";

        default:
            return "START";
    }
}


/* =========================================================
   TASK HANDLER
========================================================= */

async function handleTask(task) {

    if (
        task.status === "Completed" ||
        task.status === "Verified"
    ) {

        showToast(
            "This task is already completed.",
            "✓"
        );

        return;
    }

    openModal(
        getTaskIcon(task.type),
        task.title,
        task.description,
        `
            <div class="security-note">
                <span>✓</span>
                Reward is credited only after verification.
            </div>
        `,
        "START TASK",
        async () => {

            try {

                setModalLoading(true);

                await startTask(task.id);

                closeModal();

                /*
                IMPORTANT:
                No balance is increased here.
                */

                showToast(
                    "Task started. Complete the required activity.",
                    "✓"
                );

                haptic("light");

            } catch (error) {

                showToast(
                    error.message ||
                    "Unable to start task.",
                    "!"
                );

            } finally {

                setModalLoading(false);
            }
        }
    );
}


/* =========================================================
   WATCH FLOW
========================================================= */

async function openWatchFlow() {

    openModal(
        "🎬",
        "Watch & Earn",
        "Complete the sponsored-content activity. Clicking the button alone does not generate a reward.",
        `
            <div class="security-note">
                <span>✓</span>
                Verification is required before reward credit.
            </div>
        `,
        "OPEN ACTIVITY",
        async () => {

            try {

                setModalLoading(true);

                /*
                In production, this should request a task/session
                from your backend.

                Example:
                POST /api/tasks/watch/start

                Backend returns a verified content/session URL.
                */

                const result =
                    await startTask("watch-demo");

                if (CONFIG.API_BASE_URL) {

                    if (result.url) {

                        openExternalUrl(result.url);

                    } else {

                        showToast(
                            "Sponsored activity is not available.",
                            "!"
                        );
          
