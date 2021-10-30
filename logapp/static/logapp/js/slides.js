var slideIndex = 0;
showSlides(slideIndex);

// Next/previous controls
function moveSlide(n) {
    showSlides(slideIndex += n);
}

function showSlides(idx) {
    console.log(idx, slideIndex);
    var slides = document.getElementsByClassName("slide-item");
    if (idx >= slides.length) {
        slideIndex = 0;
    }
    if (idx < 0) {
        slideIndex = slides.length - 1;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
    console.log(idx, slideIndex);
}