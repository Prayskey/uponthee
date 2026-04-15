document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".setting-card");

  cards.forEach(card => {
    const btn = card.querySelector(".setting-toggle");

    btn.addEventListener("click", () => {

      const isOpen = card.classList.contains("open");

      // close all first (premium SaaS behavior)
      cards.forEach(c => c.classList.remove("open"));

      // open selected
      if (!isOpen) {
        card.classList.add("open");
      }

    });
  });

});