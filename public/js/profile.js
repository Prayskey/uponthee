const editBtn = document.getElementById("editBtn");
      const inputs = document.querySelectorAll(".input");
      const saveContainer = document.getElementById("saveContainer");
      const securitySection = document.getElementById("securitySection");

      let isEditing = false;

      editBtn.addEventListener("click", () => {
        isEditing = !isEditing;

        inputs.forEach((el) => {
          if (el.tagName === "INPUT") {
            el.toggleAttribute("readonly");
          } else {
            el.toggleAttribute("disabled");
          }

          // visual feedback
          el.classList.toggle("bg-white");
          el.classList.toggle("focus:ring-2");
          el.classList.toggle("focus:ring-green-500");
        });

        // toggle save button
        saveContainer.classList.toggle("hidden");

        // toggle password section
        securitySection.classList.toggle("hidden");

        // toggle button text
        editBtn.textContent = isEditing ? "Cancel" : "Edit Profile";
      });