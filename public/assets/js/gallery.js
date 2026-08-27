/*==========================================
        GALLERY FILTER
==========================================*/

// Get all filter buttons
const filterButtons = document.querySelectorAll(".gf-gallery-btn");

// Get all gallery items
const galleryItems = document.querySelectorAll(".gf-gallery-item");

// Loop through buttons
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Add active class
        button.classList.add("active");

        // Selected category
        const filterValue = button.getAttribute("data-filter");

        // Loop through images
        galleryItems.forEach(item => {

            if (
                filterValue === "all" ||
                item.classList.contains(filterValue)
            ) {

                item.style.display = "block";

                // Small animation
                setTimeout(() => {

                    item.style.opacity = "1";
                    item.style.transform = "scale(1)";

                }, 100);

            } else {

                item.style.opacity = "0";
                item.style.transform = "scale(.8)";

                setTimeout(() => {

                    item.style.display = "none";

                }, 300);

            }

        });

    });

});