document.addEventListener("DOMContentLoaded", () => {
    let saved = [
        {
            id: 1,
            name: "Emerald Heights Lodge",
            location: "Port Harcourt",
            price: 28000,
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
            reason: "Good for weekend escape",
        },
        {
            id: 2,
            name: "Skyline Apartment",
            location: "Lagos",
            price: 45000,
            rating: 4.8,
            image:
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            reason: "Luxury experience",
        },
        {
            id: 3,
            name: "Palm Court Suite",
            location: "Abuja",
            price: 18000,
            rating: 4.3,
            image:
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
            reason: "Budget friendly stay",
        },
    ];

    const list = document.getElementById("saved-list");
    const empty = document.getElementById("empty-state");
    const count = document.getElementById("count");
    const cheap = document.getElementById("cheap");
    const premium = document.getElementById("premium");

    const format = (n) => "₦" + Number(n).toLocaleString();

    function updateStats() {
        count.textContent = saved.length;
        cheap.textContent = saved.filter((l) => l.price <= 30000).length;
        premium.textContent = saved.filter((l) => l.price > 30000).length;
    }

    function getTag(price) {
        if (price <= 25000) return "bg-green-100 text-green-700";
        if (price <= 40000) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    }

    function render() {
        updateStats();

        if (!saved.length) {
            list.innerHTML = "";
            empty.classList.remove("hidden");
            return;
        }

        empty.classList.add("hidden");

        list.innerHTML = saved
            .map(
                (l) => `
      <div class="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

        <!-- IMAGE -->
        <div class="relative h-44 overflow-hidden">
          <img src="${l.image}"
            class="w-full h-full object-cover transition duration-500 group-hover:scale-110"/>

          <button class="remove absolute top-3 right-3 bg-white/90 p-2 rounded-full text-sm shadow">
            ❤️
          </button>

          <span class="absolute bottom-3 left-3 text-xs px-2 py-1 rounded-full ${getTag(l.price)}">
            ${l.price <= 25000 ? "Budget" : l.price <= 40000 ? "Mid-range" : "Premium"}
          </span>
        </div>

        <!-- CONTENT -->
        <div class="p-4 flex flex-col gap-3">

          <div>
            <h3 class="font-semibold text-gray-900">${l.name}</h3>
            <p class="text-sm text-gray-500">${l.location}</p>
          </div>

          <!-- TAGS -->
          <div class="flex gap-2 flex-wrap text-xs text-gray-500">
            <span class="bg-gray-100 px-2 py-1 rounded-lg">⭐ ${l.rating}</span>
            <span class="bg-gray-100 px-2 py-1 rounded-lg">${l.reason}</span>
          </div>

          <!-- PRICE -->
          <div class="flex items-center justify-between">
            <p class="font-medium text-gray-900">${format(l.price)}</p>

            <button class="view text-sm px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">
              View
            </button>
          </div>

        </div>
      </div>
    `,
            )
            .join("");

        attach();
    }

    function attach() {
        document.querySelectorAll(".remove").forEach((btn) => {
            btn.onclick = () => {
                const card = btn.closest("div");
                card.classList.add("opacity-0", "scale-95");

                setTimeout(() => {
                    saved = saved.filter((l) => l.id != btn.dataset.id);
                    render();
                }, 200);
            };
        });

        document.querySelectorAll(".view").forEach((btn, i) => {
            btn.onclick = () => {
                alert("Viewing lodge details...");
            };
        });
    }

    render();
});
