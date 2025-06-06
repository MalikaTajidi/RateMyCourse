import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() { }

  /**
   * مراقبة العناصر وإضافة فئات الرسوم المتحركة عند ظهورها
   */
  observeElements(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const animationType = element.dataset['animation'] || 'fade-in-up';
          element.classList.add(`animate-${animationType}`);

          // إضافة تأخير للعناصر المتعددة
          const delay = element.dataset['delay'];
          if (delay) {
            element.style.animationDelay = delay + 'ms';
          }

          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    // مراقبة جميع العناصر التي تحتوي على خاصية data-animation
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Add smooth scroll behavior to anchor links
   */
  initSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href')!);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Add parallax effect to hero section
   */
  initParallax(): void {
    const hero = document.querySelector('.hero') as HTMLElement;
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  /**
   * Add typing animation effect
   */
  typeWriter(element: HTMLElement, text: string, speed: number = 100): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      element.innerHTML = '';
      
      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      
      type();
    });
  }

  /**
   * Add counter animation for statistics
   */
  animateCounter(element: HTMLElement, target: number, duration: number = 2000): void {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  /**
   * Add stagger animation to a list of elements
   */
  staggerAnimation(elements: NodeListOf<Element>, delay: number = 100): void {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-fade-in-up');
      }, index * delay);
    });
  }
}
