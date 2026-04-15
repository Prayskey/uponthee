document.addEventListener("DOMContentLoaded", () => {

    let transactions = [
        {
            id: "TXN-1001",
            title: "Emerald Heights Lodge",
            type: "booking",
            amount: 112000,
            status: "success",
            date: "2026-04-10"
        },
        {
            id: "TXN-1002",
            title: "Riverside Guest House",
            type: "booking",
            amount: 55500,
            status: "pending",
            date: "2026-03-12"
        },
        {
            id: "TXN-1003",
            title: "Refund - Skyline Apartment",
            type: "refund",
            amount: 45000,
            status: "success",
            date: "2026-02-20"
        }
    ];

    const list = document.getElementById("history-list");
    const empty = document.getElementById("empty-state");

    const spentEl = document.getElementById("spent");
    const successEl = document.getElementById("success");
    const pendingEl = document.getElementById("pending");

    const format = (n) => "₦" + Number(n).toLocaleString();

    function getStatusStyle(status) {
        if (status === "success") return "text-green-600 bg-green-50";
        if (status === "pending") return "text-yellow-600 bg-yellow-50";
        return "text-red-600 bg-red-50";
    }

    function updateStats() {
        const spent = transactions
            .filter(t => t.status === "success" && t.type === "booking")
            .reduce((sum, t) => sum + t.amount, 0);

        spentEl.textContent = format(spent);
        successEl.textContent = transactions.filter(t => t.status === "success").length;
        pendingEl.textContent = transactions.filter(t => t.status === "pending").length;
    }

    function render() {
        updateStats();

        if (!transactions.length) {
            list.innerHTML = "";
            empty.classList.remove("hidden");
            return;
        }

        empty.classList.add("hidden");

        list.innerHTML = transactions.map(t => `
      <div class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md transition">

        <!-- LEFT -->
        <div>
          <h3 class="font-semibold text-gray-900">
            ${t.title}
          </h3>

          <p class="text-sm text-gray-500">
            ${t.id} • ${t.date}
          </p>
        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-4 sm:gap-6">

          <div class="text-right">
            <p class="font-medium text-gray-900">
              ${format(t.amount)}
            </p>

            <span class="text-xs px-2 py-1 rounded-lg ${getStatusStyle(t.status)}">
              ${t.status}
            </span>
          </div>

        </div>

      </div>
    `).join("");
    }

    render();
});