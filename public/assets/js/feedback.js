/*==========================================
        LOAD TESTIMONIALS
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadTestimonials();

});

async function loadTestimonials() {

    try {

        const response = await fetch("/testimonials");

        const testimonials = await response.json();

        const container = document.getElementById("testimonialContainer");

        container.innerHTML = "";

        testimonials.forEach(item => {

            let stars = "";

            // Default 5 stars (or use item.rating later)
            for (let i = 1; i <= 5; i++) {

                stars += `<i class="bi bi-star-fill"></i>`;

            }

            container.innerHTML += `

                <div class="swiper-slide">

                    <div class="gf-testimonial-card">

                        <i class="bi bi-quote gf-quote"></i>

                        <div class="gf-profile">

                            <img src="/uploads/${item.profile}"

                                alt="${item.name}">

                            <div>

                                <h5>${item.name}</h5>

                                <span>${item.designation}</span>

                            </div>

                        </div>

                        <p class="gf-feedback">

                            ${item.comment}

                        </p>

                        <div class="gf-stars">

                            ${stars}

                        </div>

                    </div>

                </div>

            `;

        });

        initSwiper();

    }

    catch (error) {

        console.error("Error Loading Testimonials :", error);

    }

}

/*==========================================
        SWIPER
==========================================*/

function initSwiper() {

    new Swiper(".testimonialSwiper", {

        loop: true,

        speed: 800,

        spaceBetween: 30,

        autoplay: {

            delay: 3500,

            disableOnInteraction: false,

        },

        pagination: {

            el: ".swiper-pagination",

            clickable: true,

        },

        breakpoints: {

            0: {

                slidesPerView: 1

            },

            768: {

                slidesPerView: 2

            },

            1200: {

                slidesPerView: 2

            }

        }

    });

}