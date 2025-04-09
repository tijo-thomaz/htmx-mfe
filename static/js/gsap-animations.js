document.addEventListener("DOMContentLoaded", () => {
  // Check if GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded");
    return;
  }

  // Register ScrollTrigger plugin if available
  if (gsap.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero section animations
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    gsap.from(heroContent, {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power3.out",
    });
  }

  // Animate the avatar with a subtle rotation
  const avatarContainer = document.querySelector(".avatar-container");
  if (avatarContainer) {
    gsap.to(avatarContainer, {
      rotation: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  // Comic Timeline panels reveal animation
  if (gsap.ScrollTrigger) {
    gsap.utils.toArray(".timeline-panel").forEach((panel, i) => {
      // Random rotation between -3 and 3 degrees for comic effect
      const randomRotation = Math.random() * 6 - 3;

      // Create the animation
      gsap.fromTo(
        panel,
        {
          opacity: 0,
          y: 100,
          rotation: randomRotation - 5,
        },
        {
          opacity: 1,
          y: 0,
          rotation: randomRotation,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none none",
            // markers: true, // Uncomment for debugging
          },
          delay: i * 0.1,
        }
      );

      // Animate the speech bubble separately
      const speechBubble = panel.querySelector(".speech-bubble");
      if (speechBubble) {
        gsap.fromTo(
          speechBubble,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 0.3 + i * 0.1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: panel,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
  }

  // Project cards animation
  if (gsap.ScrollTrigger) {
    gsap.from(".project-card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".comic-vault",
        start: "top 70%",
      },
    });
  }

  // Tech stack pills animation
  const techStack = document.querySelector(".tech-stack");
  if (techStack) {
    gsap.from(techStack.children, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.8,
    });
  }

  // Animate the terminal cursor blink
  const terminalCursor = document.querySelector(".blink");
  if (terminalCursor) {
    gsap.to(terminalCursor, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
    });
  }

  // Handle HTMX loaded content animations
  document.body.addEventListener("htmx:afterSwap", function (event) {
    // Animate newly added project cards
    const newCards = event.detail.elt.querySelectorAll(".project-card");
    if (newCards.length) {
      gsap.from(newCards, {
        scale: 0.8,
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)",
        clearProps: "all",
      });
    }
  });
});
