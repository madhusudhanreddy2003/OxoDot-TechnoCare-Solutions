// MOBILE MENU

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".mobile-overlay");
const closeBtn = document.querySelector(".mobile-close");

hamburger.onclick = () => {
mobileMenu.classList.add("active");
overlay.classList.add("active");
};

closeBtn.onclick = () => {
mobileMenu.classList.remove("active");
overlay.classList.remove("active");
};

overlay.onclick = () => {
mobileMenu.classList.remove("active");
overlay.classList.remove("active");
};


// ACCORDION

document.querySelectorAll(".mobile-accordion-btn").forEach(btn=>{
btn.onclick=()=>{
btn.parentElement.classList.toggle("open");
};
});


// SCROLL ANIMATIONS

const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("animate");
}else{
entry.target.classList.remove("animate");
}
});
},{threshold:.2});

document.querySelectorAll("[data-animate]").forEach(el=>{
observer.observe(el);
});