import { afterNextRender, Component, signal } from '@angular/core';

interface Project {
  title: string;
  summary: string;
  impact: string;
  stack: string[];
  highlights: string[];
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

  // Fill these with your EmailJS dashboard values.
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

  readonly project: Project = {
    title: 'Property Automation System',
    summary: 'A web application designed to help manage property-related operations with clearer screens, records, and workflows.',
    impact: 'This project reflects the kind of software I enjoy building: useful, reliable, and easy to use.',
    stack: ['Angular', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server'],
    highlights: [
      'Designed for practical property management tasks',
      'Focused on a clean admin-style interface',
      'Built with responsive full-stack patterns',
    ],
  };

  readonly storyPoints = [
    'Software engineering student with a design mindset',
    'Real experience from Africom Technologies',
    'Photoshop and Illustrator for visual work',
  ];

  readonly techs = ['Angular', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server', 'Photoshop', 'Illustrator'];

  constructor() {
    afterNextRender(() => {
      window.addEventListener(
        'scroll',
        () => {
          const y = window.scrollY;
          this.scrolled.set(y > 40);

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
        },
        { passive: true },
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );

      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
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
}
