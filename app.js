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

  /* =========================
   PROFILE PAGE
========================= */

const profilePage =
  document.getElementById(
    "profilePage"
  );

const profileBack =
  document.getElementById(
    "profileBack"
  );

const profileAvatar =
  document.getElementById(
    "profileAvatar"
  );

const profileName =
  document.getElementById(
    "profileName"
  );

const profileUsername =
  document.getElementById(
    "profileUsername"
  );

const accountId =
  document.getElementById(
    "accountId"
  );


function showProfilePage() {

  document.querySelector(
    ".topbar"
  )?.classList.add("hidden");

  homeContent?.classList.add("hidden");
  balanceCard?.classList.add("hidden");
  mainEarnButton?.classList.add("hidden");

  document.querySelector(
    ".section-header"
  )?.classList.add("hidden");

  homeSection?.classList.add("hidden");
  trustCard?.classList.add("hidden");

  earnPage?.classList.add("hidden");
  friendsPage?.classList.add("hidden");

  profilePage?.classList.remove(
    "hidden"
  );

  loadProfile();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


profileBack?.addEventListener(
  "click",
  () => {

    profilePage?.classList.add(
      "hidden"
    );

    showHomePage();

  }
);


/* =========================
   LOAD TELEGRAM PROFILE
========================= */

function loadProfile() {

  const user =
    tg?.initDataUnsafe?.user;

  if (!user) {

    profileAvatar.textContent =
      "A";

    profileName.textContent =
      "ADATRO EARN User";

    profileUsername.textContent =
      "@user";

    accountId.textContent =
      "TEST";

    return;
  }


  const firstName =
    user.first_name || "User";

  const lastName =
    user.last_name || "";

  const fullName =
    `${firstName} ${lastName}`.trim();


  profileName.textContent =
    fullName;


  profileAvatar.textContent =
    firstName
      .charAt(0)
      .toUpperCase();


  if (user.username) {

    profileUsername.textContent =
      `@${user.username}`;

  } else {

    profileUsername.textContent =
      "Telegram user";

  }


  /*
    NOTE:
    Telegram ID is displayed only as a
    temporary development value.

    In production we should NOT expose
    sensitive internal identifiers.
  */

  accountId.textContent =
    String(user.id);
}


/* =========================
   UPDATE NAVIGATION
========================= */

function hideAllPages() {

  earnPage?.classList.add(
    "hidden"
  );

  friendsPage?.classList.add(
    "hidden"
  );

  profilePage?.classList.add(
    "hidden"
  );

}


/* Replace your existing
   handleNavigation() with this version.
*/

function handleNavigation(page) {

  if (page === "home") {

    hideAllPages();
    showHomePage();

    return;
  }


  if (page === "earn") {

    hideAllPages();
    showEarnPage();

    return;
  }


  if (page === "friends") {

    hideAllPages();
    showFriendsPage();

    return;
  }


  if (page === "profile") {

    hideAllPages();
    showProfilePage();

    return;
  }
/* =========================
   TASK EXECUTION
========================= */

const taskExecutionPage =
  document.getElementById(
    "taskExecutionPage"
  );

const taskBack =
  document.getElementById(
    "taskBack"
  );

const executionTitle =
  document.getElementById(
    "executionTitle"
  );

const executionDescription =
  document.getElementById(
    "executionDescription"
  );

const executionIcon =
  document.getElementById(
    "executionIcon"
  );

const executionRequirement =
  document.getElementById(
    "executionRequirement"
  );

const taskTimer =
  document.getElementById(
    "taskTimer"
  );

const progressBar =
  document.getElementById(
    "progressBar"
  );

const progressPercent =
  document.getElementById(
    "progressPercent"
  );

const executionButton =
  document.getElementById(
    "executionButton"
  );

const verificationCard =
  document.getElementById(
    "verificationCard"
  );


let executionInterval = null;
let executionSeconds = 0;
let executionDuration = 30;
let currentExecutionTask = null;


/* =========================
   TASK CONFIG
========================= */

const executionTasks = {

  watch: {
    title: "Watch & Complete",
    icon: "▶",
    duration: 30,

    description:
      "Watch the sponsored content until the required completion point.",

    requirement:
      "Stay on the opportunity until the required completion point."
  },


  brand: {
    title: "Discover a Brand",
    icon: "◉",
    duration: 20,

    description:
      "Visit the sponsored website and complete the required interaction.",

    requirement:
      "Keep the sponsored page open and complete the required action."
  },


  telegram: {
    title: "Join & Discover",
    icon: "✈",
    duration: 15,

    description:
      "Discover the sponsored Telegram community.",

    requirement:
      "Complete the required community action."
  }

};


/* =========================
   OPEN EXECUTION
========================= */

function openTaskExecution(taskKey) {

  const task =
    executionTasks[taskKey];

  if (!task) return;

  currentExecutionTask =
    taskKey;

  executionDuration =
    task.duration;

  executionSeconds = 0;

  executionTitle.textContent =
    task.title;

  executionIcon.textContent =
    task.icon;

  executionDescription.textContent =
    task.description;

  executionRequirement.textContent =
    task.requirement;

  taskTimer.textContent =
    executionDuration;

  progressBar.style.width =
    "0%";

  progressPercent.textContent =
    "0%";

  executionButton.textContent =
    "Start Opportunity";

  executionButton.disabled =
    false;

  verificationCard.classList.add(
    "hidden"
  );

  taskExecutionPage.classList.remove(
    "hidden"
  );

  document.querySelector(
    ".topbar"
  )?.classList.add("hidden");

  homeContent?.classList.add("hidden");
  balanceCard?.classList.add("hidden");
  mainEarnButton?.classList.add("hidden");

  document.querySelector(
    ".section-header"
  )?.classList.add("hidden");

  homeSection?.classList.add("hidden");
  trustCard?.classList.add("hidden");

  earnPage?.classList.add("hidden");
  friendsPage?.classList.add("hidden");
  profilePage?.classList.add("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


/* =========================
   START EXECUTION
========================= */

executionButton.addEventListener(
  "click",
  () => {

    if (!currentExecutionTask) {
      return;
    }

    if (
      executionSeconds >=
      executionDuration
    ) {
      return;
    }

    executionButton.disabled =
      true;

    executionButton.textContent =
      "Task in progress...";

    executionInterval =
      setInterval(
        updateTaskProgress,
        1000
      );

  }
);


/* =========================
   PROGRESS
========================= */

function updateTaskProgress() {

  executionSeconds++;

  const remaining =
    executionDuration -
    executionSeconds;

  const percentage =
    Math.min(
      Math.round(
        (executionSeconds /
          executionDuration) *
          100
      ),
      100
    );

  taskTimer.textContent =
    Math.max(
      remaining,
      0
    );

  progressBar.style.width =
    `${percentage}%`;

  progressPercent.textContent =
    `${percentage}%`;


  if (
    executionSeconds >=
    executionDuration
  ) {

    clearInterval(
      executionInterval
    );

    completeTaskExecution();

  }

}


/* =========================
   COMPLETE
========================= */

function completeTaskExecution() {

  executionButton.disabled =
    true;

  executionButton.textContent =
    "Submitted for verification";

  verificationCard.classList.remove(
    "hidden"
  );

  /*
    IMPORTANT:
    We DO NOT credit the wallet here.

    Production flow:

    Task completion
         ↓
    Backend verification
         ↓
    Provider confirmation
         ↓
    Reward transaction
         ↓
    pending
         ↓
    available

    Only the server can change
    the user's real balance.
  */

}


/* =========================
   BACK
========================= */

taskBack.addEventListener(
  "click",
  () => {

    if (executionInterval) {

      clearInterval(
        executionInterval
      );

      executionInterval = null;

    }

    taskExecutionPage.classList.add(
      "hidden"
    );

    showEarnPage();

  }
);


/* =========================
   CONNECT EARN TASK BUTTONS
========================= */

startTaskButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const task =
          button.dataset.task;

        openTaskExecution(task);

      }
    );

  /* =========================================
   ADATRO EARN
   SINGLE PAGE NAVIGATION
========================================= */

const pages = {
  home: document.getElementById("homePage"),
  earn: document.getElementById("earnPage"),
  friends: document.getElementById("friendsPage"),
  profile: document.getElementById("profilePage"),
  execution: document.getElementById("taskExecutionPage")
};


/* -----------------------------------------
   HIDE EVERYTHING
----------------------------------------- */

function hideAllPages() {

  Object.values(pages).forEach((page) => {

    if (page) {
      page.classList.add("hidden");
    }

  });

}


/* -----------------------------------------
   HOME
----------------------------------------- */

function showHomePage() {

  hideAllPages();

  document.querySelector(".topbar")
    ?.classList.remove("hidden");

  homeContent?.classList.remove("hidden");
  balanceCard?.classList.remove("hidden");
  mainEarnButton?.classList.remove("hidden");

  document.querySelector(".section-header")
    ?.classList.remove("hidden");

  homeSection?.classList.remove("hidden");
  trustCard?.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* -----------------------------------------
   EARN
----------------------------------------- */

function showEarnPage() {

  hideAllPages();

  document.querySelector(".topbar")
    ?.classList.add("hidden");

  pages.earn?.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* -----------------------------------------
   FRIENDS
----------------------------------------- */

function showFriendsPage() {

  hideAllPages();

  document.querySelector(".topbar")
    ?.classList.add("hidden");

  pages.friends?.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* -----------------------------------------
   PROFILE
----------------------------------------- */

function showProfilePage() {

  hideAllPages();

  document.querySelector(".topbar")
    ?.classList.add("hidden");

  pages.profile?.classList.remove("hidden");

  loadProfile();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* -----------------------------------------
   TASK EXECUTION
----------------------------------------- */

function showExecutionPage(taskKey) {

  hideAllPages();

  document.querySelector(".topbar")
    ?.classList.add("hidden");

  pages.execution?.classList.remove("hidden");

  openTaskExecution(taskKey);

}


/* -----------------------------------------
   MAIN NAVIGATION
----------------------------------------- */

function handleNavigation(page) {

  switch (page) {

    case "home":
      showHomePage();
      break;

    case "earn":
      showEarnPage();
      break;

    case "friends":
      showFriendsPage();
      break;

    case "profile":
      showProfilePage();
      break;

    default:
      showHomePage();

  }

}
   
