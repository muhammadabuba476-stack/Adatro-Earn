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
/* =========================
   EARN PAGE
========================= */

const homeContent =
  document.querySelector(
    ".welcome"
  );

const balanceCard =
  document.querySelector(
    ".balance-card"
  );

const mainEarnButton =
  document.querySelector(
    ".earn-button"
  );

const homeSection =
  document.querySelector(
    ".opportunities"
  );

const trustCard =
  document.querySelector(
    ".trust-card"
  );

const earnPage =
  document.getElementById(
    "earnPage"
  );

const backHome =
  document.getElementById(
    "backHome"
  );

const startTaskButtons =
  document.querySelectorAll(
    ".start-task"
  );

const taskModal =
  document.getElementById(
    "taskModal"
  );

const closeModal =
  document.getElementById(
    "closeModal"
  );

const modalOverlay =
  document.getElementById(
    "modalOverlay"
  );

const modalTitle =
  document.getElementById(
    "modalTitle"
  );

const modalDescription =
  document.getElementById(
    "modalDescription"
  );

const confirmTask =
  document.getElementById(
    "confirmTask"
  );


function showEarnPage() {

  document.querySelector(
    ".topbar"
  ).classList.add("hidden");

  homeContent?.classList.add("hidden");

  balanceCard?.classList.add("hidden");

  mainEarnButton?.classList.add("hidden");

  document.querySelector(
    ".section-header"
  )?.classList.add("hidden");

  homeSection?.classList.add("hidden");

  trustCard?.classList.add("hidden");

  earnPage.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


function showHomePage() {

  document.querySelector(
    ".topbar"
  ).classList.remove("hidden");

  homeContent?.classList.remove("hidden");

  balanceCard?.classList.remove("hidden");

  mainEarnButton?.classList.remove("hidden");

  document.querySelector(
    ".section-header"
  )?.classList.remove("hidden");

  homeSection?.classList.remove("hidden");

  trustCard?.classList.remove("hidden");

  earnPage.classList.add("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


mainEarnButton?.addEventListener(
  "click",
  showEarnPage
);


backHome?.addEventListener(
  "click",
  showHomePage
);


/* =========================
   TASK MODAL
========================= */

let selectedTask = null;


const taskDetails = {

  watch: {
    title: "Watch & Complete",

    description:
      "Watch the sponsored content until the required completion point."
  },

  brand: {
    title: "Discover a Brand",

    description:
      "Visit the sponsored website and complete the required interaction."
  },

  telegram: {
    title: "Join & Discover",

    description:
      "Discover the sponsored Telegram community and complete the required action."
  }

};


startTaskButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        selectedTask =
          button.dataset.task;

        const task =
          taskDetails[selectedTask];

        if (!task) return;

        modalTitle.textContent =
          task.title;

        modalDescription.textContent =
          task.description;

        taskModal.classList.remove(
          "hidden"
        );

      }
    );

  }
);


function hideTaskModal() {

  taskModal.classList.add(
    "hidden"
  );

  selectedTask = null;
}


closeModal.addEventListener(
  "click",
  hideTaskModal
);


modalOverlay.addEventListener(
  "click",
  hideTaskModal
);


/* =========================
   CONTINUE TASK
========================= */

confirmTask.addEventListener(
  "click",
  () => {

    if (!selectedTask) return;

    hideTaskModal();

    showMessage(
      "Task verification will be connected to the ADATRO EARN backend."
    );

  }
);
