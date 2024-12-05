class Slider {
  constructor(container, isDots = false, isNumber = false) {
    this.container = container;
    this.slider = container.querySelector(".slider__wrapper");
    this.slides = container.querySelectorAll(".slider__item");
    this.currentIndex = 0;
    this.isDots = isDots;
    this.isNumber = isNumber;
    this.slidesPerView = 1;

    this.autoScrollInterval = 1500;
    this.autoScrollTimer = null;

    this.initSlidesPerView();
    this.updateButtons();
    this.initEventListeners();
    if (isNumber) {
      this.startAutoScroll();
      this.isForward = true;
    }

    window.addEventListener("resize", () => this.initSlidesPerView());
  }

  initSlidesPerView() {
    if (document.documentElement.clientWidth < 481) {
      this.slidesPerView = 1;
    } else if (document.documentElement.clientWidth < 768) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 3;
    }
    this.currentIndex = Math.min(
      this.currentIndex,
      this.slides.length - this.slidesPerView
    );
    this.scrollToCurrentSlide();
    this.updateButtons();
    this.updateStatus();
  }

  initEventListeners() {
    this.container
      .querySelector(".slider__button--next")
      .addEventListener("click", () => this.nextSlide());
    this.container
      .querySelector(".slider__button--back")
      .addEventListener("click", () => this.prevSlide());
  }

  startAutoScroll() {
    this.autoScrollTimer = setInterval(() => {
      if (this.currentIndex + this.slidesPerView === this.slides.length) {
        this.isForward = false;
      }
      if (this.currentIndex === 0) {
        this.isForward = true;
      }
      this.isForward ? this.nextSlide() : this.prevSlide();
    }, this.autoScrollInterval);
  }

  stopAutoScroll() {
    clearInterval(this.autoScrollTimer);
  }

  nextSlide() {
    if (
      this.currentIndex < this.slides.length - 1 &&
      this.isScrolling != true
    ) {
      this.isScrolling = true;
      this.container.querySelector(".slider__button--next").disabled = true;

      this.removeActiveClass();

      this.currentIndex++;
      this.scrollForward();
      this.updateStatus();

      setTimeout(() => {
        this.container.querySelector(".slider__button--next").disabled = false;
        this.isScrolling = false;
        this.updateButtons();
      }, 200);
    }
  }

  prevSlide() {
    if (this.currentIndex > 0 && this.isScrolling != true) {
      this.isScrolling = true;
      this.container.querySelector(".slider__button--back").disabled = true;

      this.removeActiveClass();

      this.currentIndex--;
      this.scrollBack();
      this.updateStatus();

      setTimeout(() => {
        this.container.querySelector(".slider__button--back").disabled = false;
        this.isScrolling = false;
        this.updateButtons();
      }, 300);
    }
  }

  scrollBack() {
    const slideWidth = this.slides[this.currentIndex].clientWidth + 20;
    this.slider.scrollBy({
      left: -slideWidth,
      behavior: "smooth",
    });
  }

  scrollForward() {
    const slideWidth = this.slides[this.currentIndex].clientWidth + 20;
    this.slider.scrollBy({
      left: slideWidth,
      behavior: "smooth",
    });
  }

  scrollToCurrentSlide() {
    const slideWidth = this.slides[0].clientWidth;
    this.container.scrollTo({
      left: slideWidth * this.currentIndex,
      behavior: "smooth",
    });
  }

  removeActiveClass() {
    if (this.isDots) {
      this.container
        .querySelectorAll(".slider__dots-item")
        [this.currentIndex].classList.remove("active");
    }
  }
  updateStatus() {
    const statusText = `${this.currentIndex + this.slidesPerView} / ${
      this.slides.length
    }`;
    document.querySelector(".slider__total").textContent = statusText;
  }

  updateButtons() {
    if (this.isDots) {
      this.container
        .querySelectorAll(".slider__dots-item")
        [this.currentIndex].classList.add("active");
    }

    this.container.querySelector(".slider__button--back").disabled =
      this.currentIndex === 0;

    if (this.isNumber) {
      this.container.querySelector(".slider__button--next").disabled =
        this.currentIndex + this.slidesPerView === this.slides.length;
    } else {
      this.container.querySelector(".slider__button--next").disabled =
        this.currentIndex === this.slides.length - 1;
    }
  }
}

const sliderContainer = document.querySelector(".stages__body");
const slider = new Slider(sliderContainer, true);

const sliderContainerSecond = document.querySelector(".participants__wrapper");
const sliderSecond = new Slider(sliderContainerSecond, false, true);
