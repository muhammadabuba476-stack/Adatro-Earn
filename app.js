const tg = window.Telegram?.WebApp;

/* =========================
   TELEGRAM INITIALIZATION
========================= */

if (tg) {
  tg.ready();
  tg.expand();

  // Tell Telegram that our app supports
  // its current theme.
  tg.enableClosingConfirmation?.();
}


/* =========================
   TEST USER DATA
========================= */

let userBalance = 0.00;
let totalEarned = 0.00;

let balanceVisible = true;


/* =========================
   DOM ELEMENTS
========================= */

const userName =
  document.getElementById("userName");

const greeting =
  document.getElementById("greeting");

const balance =
  document.getElementById("balance");

const totalEarnedElement =
  document.getElementById("totalEarned");

const toggleBalance =
  document.getElementById("toggleBalance");

const earnButton =
  document.getElementById("earnButton");

const notificationBtn =
  document.getElementById(
    "notificationBtn"
  );

const seeAll =
  document.getElementById("seeAll");

const navItems =
  document.querySelectorAll(".nav-item");

const taskCards =
  document.querySelectorAll(".task-card");


/* =========================
   USER NAME
========================= */

function loadTelegramUser() {

  if (
    tg &&
    tg.initDataUnsafe &&
    tg.initDataUnsafe.user
  ) {

    const user =
      tg.initDataUnsafe.user;

    const firstName =
      user.first_name || "there";

    userName.textContent =
      `Earn more today, ${firstName}.`;

  } else {

    userName.textContent =
      "Earn more today.";

  }
}

loadTelegramUser();


/* =========================
   GREETING
========================= */

function updateGreeting() {

  const hour =
    new Date().getHours();

  if (hour < 12) {
    greeting.textContent =
      "Good morning ☀️";
  }

  else if (hour < 18) {
    greeting.textContent =
      "Good afternoon 👋";
  }

  else {
    greeting.textContent =
      "Good evening 🌙";
  }
}

updateGreeting();


/* =========================
   FORMAT MONEY
========================= */

function formatUSD(amount) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }
  ).format(amount);

}


/* =========================
   UPDATE BALANCE
========================= */

function updateBalance() {

  if (balanceVisible) {

    balance.textContent =
      formatUSD(userBalance);

    totalEarnedElement.textContent =
      formatUSD(totalEarned);

    toggleBalance.textContent =
      "👁";

  } else {

    balance.textContent =
      "••••";

    totalEarnedElement.textContent =
      "••••";

    toggleBalance.textContent =
      "◉";
  }
}

updateBalance();


/* =========================
   HIDE / SHOW BALANCE
========================= */

toggleBalance.addEventListener(
  "click",
  () => {

    balanceVisible =
      !balanceVisible;

    updateBalance();

  }
);


/* =========================
   START EARNING
========================= */

earnButton.addEventListener(
  "click",
  () => {

    scrollToOpportunities();

  }
);


function scrollToOpportunities() {

  const section =
    document.querySelector(
      ".opportunities"
    );

  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

}


/* =========================
   TASK CLICK
========================= */

taskCards.forEach(
  (card, index) => {

    card.addEventListener(
      "click",
      () => {

        const tasks = [
          "Watch & Complete",
          "Discover a Brand",
          "Join & Discover",
        ];

        const taskName =
          tasks[index] || "Task";

        showMessage(
          `${taskName} will open here.`
        );

      }
    );

  }
);


/* =========================
   SEE ALL
========================= */

seeAll.addEventListener(
  "click",
  () => {

    showMessage(
      "More opportunities are coming soon."
    );

  }
);


/* =========================
   NOTIFICATIONS
========================= */

notificationBtn.addEventListener(
  "click",
  () => {

    showMessage(
      "You're all caught up."
    );

  }
);


/* =========================
   BOTTOM NAVIGATION
========================= */

navItems.forEach(
  (item) => {

    item.addEventListener(
      "click",
      () => {

        navItems.forEach(
          (nav) => {
            nav.classList.remove(
              "active"
            );
          }
        );

        item.classList.add(
          "active"
        );

        const page =
          item.dataset.page;

        handleNavigation(page);

      }
    );

  }
);


function handleNavigation(page) {

  switch (page) {

    case "home":

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      break;


    case "earn":

      scrollToOpportunities();

      break;


    case "friends":

      showMessage(
        "Your referral center will appear here."
      );

      break;


    case "profile":

      showMessage(
        "Your profile will appear here."
      );

      break;

  }

}


/* =========================
   TELEGRAM POPUP
========================= */

function showMessage(message) {

  if (
    tg &&
    tg.showPopup
  ) {

    tg.showPopup({
      title: "ADATRO EARN",
      message: message,
      buttons: [
        {
          id: "ok",
          type: "default",
          text: "OK",
        },
      ],
    });

  } else {

    alert(message);

  }

}


/* =========================
   PREVENT DOUBLE TAP ZOOM
========================= */

let lastTouchEnd = 0;

document.addEventListener(
  "touchend",
  (event) => {

    const now =
      Date.now();

    if (
      now - lastTouchEnd <= 300
    ) {

      event.preventDefault();

    }

    lastTouchEnd = now;

  },
  false
);


/* =========================
   DEV MODE
========================= */

console.log(
  "ADATRO EARN Mini App loaded."
);
