const body = document.body;
const cards = document.querySelectorAll(".project-card");
const transitionCard = document.getElementById("transitionCard");
const portfolioSection = document.getElementById("portfolio");
const introSection = document.getElementById("intro");
const selectedCategory = document.getElementById("selectedCategory");
const backBtn = document.getElementById("backBtn");

const categoryNames = {
  all: "All Works",
  poster: "Poster Works",
  uxui: "UX/UI Works",
  web: "Web Projects",
  graphic: "Graphic Design"
};

// 명함이 떨어진 뒤 카드 펼침
window.addEventListener("load", () => {
  setTimeout(() => {
    body.classList.add("spread");
  }, 1500);
});

// 카드 클릭 시 화면 전체로 확장 후 포트폴리오 페이지 전환
cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!body.classList.contains("spread")) return;

    const rect = card.getBoundingClientRect();
    const category = card.dataset.category;

    selectedCategory.textContent = categoryNames[category];

    transitionCard.style.left = `${rect.left}px`;
    transitionCard.style.top = `${rect.top}px`;
    transitionCard.style.width = `${rect.width}px`;
    transitionCard.style.height = `${rect.height}px`;
    transitionCard.style.background = getComputedStyle(card).background;
    transitionCard.style.boxShadow = getComputedStyle(card).boxShadow;

    transitionCard.classList.add("active");

    setTimeout(() => {
      introSection.style.display = "none";
      portfolioSection.classList.add("active");

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });

      setTimeout(() => {
        portfolioSection.classList.add("show");
        transitionCard.classList.remove("active");
        transitionCard.style.opacity = "0";
      }, 80);
    }, 850);
  });
});

// 뒤로가기
backBtn.addEventListener("click", () => {
  portfolioSection.classList.remove("show");

  setTimeout(() => {
    portfolioSection.classList.remove("active");
    introSection.style.display = "flex";

    transitionCard.classList.remove("active");
    transitionCard.style.opacity = "0";

    body.classList.remove("spread");

    setTimeout(() => {
      body.classList.add("spread");
    }, 300);
  }, 500);
});