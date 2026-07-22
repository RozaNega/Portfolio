import { afterNextRender, Component, signal } from '@angular/core';

interface Project {
  title: string;
  summary: string;
  impact: string;
  stack: string[];
  highlights: string[];
  link?: string;
}

interface ExperienceItem {
  period: string;
  title: string;
  organization: string;
  summary: string;
  highlights: string[];
}

interface SkillGroup {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly activeSection = signal('hero');
  readonly formState = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  readonly scrollProgress = signal(0);

  readonly emailJsServiceId = 'YOUR_SERVICE_ID';
  readonly emailJsTemplateId = 'YOUR_TEMPLATE_ID';
  readonly emailJsPublicKey = 'YOUR_PUBLIC_KEY';
  readonly emailJsEndpoint = 'https://api.emailjs.com/api/v1.0/email/send-form';

  readonly heroTags = ['Software Engineering Student', 'Graphics Design', 'Africom Technologies'];

  readonly metrics = [
    { value: '4 months', label: 'Internship experience' },
    { value: '1 project', label: 'Property automation system' },
    { value: 'Full stack', label: 'Angular, C#, APIs, SQL' },
    { value: 'Creative', label: 'UI and graphics design' },
  ];

  readonly skills: SkillGroup[] = [
    {
      title: 'Frontend',
      items: ['Angular', 'TypeScript', 'HTML5', 'Modern CSS', 'Responsive UI', 'Component design'],
    },
    {
      title: 'Backend',
      items: ['ASP.NET Core', 'C#', 'REST APIs', 'Entity Framework', 'SQL Server'],
    },
    {
      title: 'Product Thinking',
      items: ['Workflow design', 'Admin dashboards', 'Usability', 'Clean architecture', 'Problem solving'],
    },
    {
      title: 'Design Tools',
      items: ['Photoshop', 'Illustrator', 'Figma', 'Git & GitHub', 'Postman'],
    },
  ];

  readonly experience: ExperienceItem[] = [
    {
      period: '4 months',
      title: 'Internship Program',
      organization: 'Africom Technologies',
      summary: 'Worked on a property automation system and learned how a real team turns ideas into usable software.',
      highlights: [
        'Built frontend screens with Angular',
        'Worked with ASP.NET backend services and SQL',
        'Kept the interface simple, responsive, and practical',
      ],
    },
  ];

  readonly projects: Project[] = [
    {
      title: 'Property Automation System',
      summary: 'A web application designed to help manage property-related operations with clearer screens, records, and workflows.',
      impact: 'This project reflects the kind of software I enjoy building: useful, reliable, and easy to use.',
      stack: ['Angular', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server'],
      highlights: [
        'Designed for practical property management tasks',
        'Focused on a clean admin-style interface',
        'Built with responsive full-stack patterns',
      ],
    },
    {
      title: 'EduTrack',
      summary: 'A student task and learning management system designed to help manage assignments, track progress, and stay organized.',
      impact: 'EduTrack makes student life simpler by bringing tasks, schedules, and learning resources into one clean dashboard.',
      stack: ['Angular', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      highlights: [
        'Task and assignment management with deadline tracking',
        'Clean dashboard for progress monitoring',
        'Responsive design for desktop and mobile',
      ],
      link: 'https://edu-track-ecru.vercel.app',
    },
  ];

  readonly storyPoints = [
    'Software engineering student with a design mindset',
    'Real experience from Africom Technologies',
    'Photoshop and Illustrator for visual work',
  ];

  readonly techs = ['Angular', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server', 'Photoshop', 'Illustrator'];

  private mouseGlow!: HTMLElement;
  private particles!: HTMLElement;
  private rafId = 0;
  private mouseX = 0;
  private mouseY = 0;

  constructor() {
    afterNextRender(() => {
      this.mouseGlow = document.getElementById('cursor-glow')!;
      this.particles = document.getElementById('hero-particles')!;
      this.initScrollProgress();
      this.initRevealObserver();
      this.initParallax();
      this.init3DTilt();
      this.initMagneticButtons();
      this.initCursorGlow();
      this.initParticles();
      this.initCardGlow();
      this.initCounterObserver();
      this.initSectionProgress();
    });
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.menuOpen.set(false);
  }

  async sendEmail(event: Event) {
    event.preventDefault();

    if (
      this.emailJsServiceId.startsWith('YOUR_') ||
      this.emailJsTemplateId.startsWith('YOUR_') ||
      this.emailJsPublicKey.startsWith('YOUR_')
    ) {
      this.formState.set('error');
      return;
    }

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('service_id', this.emailJsServiceId);
    formData.append('template_id', this.emailJsTemplateId);
    formData.append('user_id', this.emailJsPublicKey);

    this.formState.set('sending');

    try {
      const response = await fetch(this.emailJsEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`EmailJS request failed with status ${response.status}`);
      }

      form.reset();
      this.formState.set('success');
    } catch {
      this.formState.set('error');
    }
  }

  private initScrollProgress() {
    const bar = document.getElementById('scroll-progress')!;
    const thumb = document.getElementById('scroll-thumb')!;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      thumb.style.width = pct + '%';
      this.scrollProgress.set(Math.round(pct));
    }, { passive: true });
  }

  private initRevealObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('visible', entry.isIntersecting);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  private initParallax() {
    const orbs = document.querySelectorAll<HTMLElement>('.hero-orb');
    const heroContent = document.querySelector<HTMLElement>('.hero-content');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      this.scrolled.set(y > 40);

      orbs.forEach((orb, i) => {
        const speed = i === 0 ? 0.3 : 0.18;
        orb.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });

      if (heroContent && y < window.innerHeight) {
        heroContent.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
        heroContent.style.opacity = `${1 - y / (window.innerHeight * 0.85)}`;
      }

      const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 220 && rect.bottom >= 220) {
          this.activeSection.set(id);
          break;
        }
      }
    }, { passive: true });
  }

  private init3DTilt() {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      });
    });
  }

  private initMagneticButtons() {
    document.querySelectorAll<HTMLElement>('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  private initCursorGlow() {
    if (!this.mouseGlow) return;
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          this.mouseGlow.style.left = this.mouseX + 'px';
          this.mouseGlow.style.top = this.mouseY + 'px';
          ticking = false;
        });
      }
    });

    window.addEventListener('mouseenter', () => {
      this.mouseGlow.style.opacity = '1';
    });

    window.addEventListener('mouseleave', () => {
      this.mouseGlow.style.opacity = '0';
    });
  }

  private initParticles() {
    if (!this.particles) return;
    const count = window.innerWidth < 760 ? 20 : 40;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
      particle.style.animationDelay = (Math.random() * 6) + 's';
      particle.style.opacity = String(Math.random() * 0.5 + 0.1);
      this.particles.appendChild(particle);
    }
  }

  private initCardGlow() {
    document.querySelectorAll<HTMLElement>('[data-glow]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--glow-x', x + 'px');
        card.style.setProperty('--glow-y', y + 'px');
      });
    });
  }

  private initCounterObserver() {
    document.querySelectorAll<HTMLElement>('.counter').forEach((el) => {
      const target = parseInt(el.dataset['target'] || '0', 10);
      const suffix = el.dataset['suffix'] || '';
      let done = false;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !done) {
              done = true;
              obs.disconnect();
              let current = 0;
              const step = Math.max(1, Math.floor(target / 40));
              const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                el.textContent = current + suffix;
              }, 30);
            }
          });
        },
        { threshold: 0.5 },
      );
      obs.observe(el);
    });
  }

  private initSectionProgress() {
    const markers = document.querySelectorAll<HTMLElement>('.section-progress-line');
    window.addEventListener('scroll', () => {
      markers.forEach((line) => {
        const section = line.closest('.section') as HTMLElement;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
        line.style.transform = `scaleY(${progress})`;
      });
    }, { passive: true });
  }
}
