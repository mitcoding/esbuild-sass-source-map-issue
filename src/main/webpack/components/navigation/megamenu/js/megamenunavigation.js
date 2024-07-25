const handleNavbarToggle = (event) => {
  const toggle = event.target.closest(".navbar-toggler");

  if (toggle) {
    document.body.classList.toggle("mobile-menu--opened");
    document.documentElement.classList.toggle("mobile-menu--opened");
  }
};

const handleNavItemToggle = (event) => {
  const toggle = event.target.closest(".nav-item .cmp-link");
	
  if (toggle) {
		const activeToggle = toggle.parentElement.parentElement.querySelector(".cmp-link--active");

		if (activeToggle && activeToggle != toggle) { 
			activeToggle.classList.toggle("cmp-link--active");
		} 

    toggle.classList.toggle("cmp-link--active");
  }
  else {
    const activeToggles = document.body.querySelectorAll(".nav-item .cmp-link--active");

    activeToggles.forEach((toggle) => {
      toggle.classList.remove("cmp-link--active");
    });
  }
};

document.addEventListener("click", handleNavbarToggle);
document.addEventListener("touchstart", handleNavbarToggle);
document.addEventListener("click", handleNavItemToggle);
document.addEventListener("touchstart", handleNavItemToggle);
document.addEventListener("touchEnd", e => e.preventDefault() );

function initializeMegaMenuNav() {}

export default initializeMegaMenuNav;