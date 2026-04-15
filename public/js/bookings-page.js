document.addEventListener("DOMContentLoaded", () => {
  let bookings = [...BOOKINGS_DATA];
  let filter = "all";
  let targetId = null;

  const list = document.getElementById("bookings-list");
  const empty = document.getElementById("empty-state");
  const filters = document.querySelectorAll(".filter");

  const modal = document.getElementById("modal");
  const confirmBtn = document.getElementById("confirmCancel");
  const closeBtn = document.getElementById("closeModal");

  // Format
  const format = (n) => "₦" + Number(n).toLocaleString();

  // Stats
  function updateStats() {
    document.getElementById("stat-total").textContent = bookings.length;
    document.getElementById("stat-upcoming").textContent =
      bookings.filter(b => b.status !== "completed").length;
    document.getElementById("stat-completed").textContent =
      bookings.filter(b => b.status === "completed").length;
    document.getElementById("stat-spent").textContent =
      format(bookings.reduce((sum, b) => sum + b.price, 0));
  }

  // Render
  function render() {
    let data = filter === "all"
      ? bookings
      : bookings.filter(b => b.status === filter);

    updateStats();

    if (!data.length) {
      list.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }

    empty.classList.add("hidden");

    list.innerHTML = data.map(b => `
      <div 
        class="group bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-[2px] active:scale-[0.98]"
        data-id="${b.id}"
      >

        <!-- IMAGE -->
        <div class="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img 
            src="${b.image || '/images/lodge-placeholder.jpg'}" 
            class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <!-- CONTENT -->
        <div class="flex flex-1 items-center justify-between gap-4">

          <!-- LEFT -->
          <div>
            <h3 class="font-semibold text-gray-900 text-base">
              ${b.name}
            </h3>

            <p class="text-sm text-gray-500">
              ${b.location}
            </p>

            <p class="text-xs text-gray-400 mt-1">
              ${b.date}
            </p>

            <span class="inline-block mt-2 text-xs px-2.5 py-1 rounded-full
              ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}
              ${b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${b.status === 'completed' ? 'bg-gray-200 text-gray-700' : ''}
            ">
              ${b.status}
            </span>
          </div>

          <!-- RIGHT -->
          <div class="text-right flex flex-col items-end gap-2">

            <p class="font-medium text-gray-900">
              ${format(b.price)}
            </p>

            <div class="flex gap-2">

              <!-- VIEW -->
              <button 
                class="view text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                data-id="${b.id}"
              >
                View
              </button>

              <!-- CANCEL -->
              <button 
                class="cancel text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                data-id="${b.id}"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      </div>
    `).join("");

    attachEvents();
  }

  // Attach Events
  function attachEvents() {
    // Cancel
    document.querySelectorAll(".cancel").forEach(btn => {
      btn.onclick = () => {
        targetId = Number(btn.dataset.id);
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      };
    });

    // View
    document.querySelectorAll(".view").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        window.location.href = `/lodges/${id}`;
      };
    });
  }

  // Confirm Cancel
  confirmBtn.onclick = () => {
    bookings = bookings.filter(b => b.id !== targetId);
    modal.classList.add("hidden");
    render();
  };

  // Close Modal
  closeBtn.onclick = () => modal.classList.add("hidden");

  // Filters
  filters.forEach(btn => {
    btn.onclick = () => {
      filters.forEach(b => b.classList.remove("bg-gray-900", "text-white"));
      btn.classList.add("bg-gray-900", "text-white");

      filter = btn.dataset.filter;
      render();
    };
  });

  // Init
  render();
});