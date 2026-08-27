/*==========================================
        COUNTER ANIMATION
==========================================*/

const gfCounterSection = document.querySelector(".gf-counter");

const gfCounters = document.querySelectorAll(".gf-counter-number");

let gfCounterStarted = false;

const gfCounterObserver = new IntersectionObserver((entries)=>{

    if(entries[0].isIntersecting && !gfCounterStarted){

        gfCounterStarted = true;

        gfCounters.forEach((counter)=>{

            const target = +counter.dataset.target;

            let count = 0;

            const increment = target / 150;

            const updateCounter = ()=>{

                count += increment;

                if(count < target){

                    counter.innerText = Math.ceil(count);

                    requestAnimationFrame(updateCounter);

                }

                else{

                    counter.innerText = target.toLocaleString();

                }

            };

            updateCounter();

        });

    }

},{threshold:0.4});

gfCounterObserver.observe(gfCounterSection);