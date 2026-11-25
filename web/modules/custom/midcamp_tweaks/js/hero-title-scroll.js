/**
 * @file
 * Scroll-linked fill effect for the homepage hero title.
 *
 * Event Horizon drives this effect with a CSS scroll-driven animation
 * (animation-timeline: view()), which only some browsers support. This
 * script drives the same custom properties from the scroll position so the
 * effect behaves the same in every browser.
 */

((Drupal, once) => {
  // Mirrors the theme's animation-range: "exit -30%" to "exit 50%".
  const RANGE_START = 0.3;
  const RANGE_END = -0.5;

  // Mirrors the theme's hero-heading-fill keyframes.
  const COVER_FROM = 66;
  const COVER_TO = 0;
  const OPACITY_FROM = 1;
  const OPACITY_TO = 0.5;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /**
   * Initializes the scroll-linked fill for one hero title.
   *
   * @param {HTMLElement} title
   *   The hero title element.
   */
  function init(title) {
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        title.style.removeProperty('--hero-cover-percent');
        title.style.removeProperty('--hero-color-opacity');
        return;
      }
      const { top, height } = title.getBoundingClientRect();
      const start = RANGE_START * height;
      const end = RANGE_END * height;
      const progress = Math.min(Math.max((start - top) / (start - end), 0), 1);
      const cover = COVER_FROM + (COVER_TO - COVER_FROM) * progress;
      const opacity = OPACITY_FROM + (OPACITY_TO - OPACITY_FROM) * progress;
      title.style.setProperty('--hero-cover-percent', `${cover}%`);
      title.style.setProperty('--hero-color-opacity', `${opacity}`);
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    reducedMotion.addEventListener('change', requestUpdate);
    update();
  }

  Drupal.behaviors.midcampHeroTitleScroll = {
    attach(context) {
      once('midcamp-hero-title-scroll', '.site-hero__title', context).forEach(
        init,
      );
    },
  };
})(Drupal, once);
