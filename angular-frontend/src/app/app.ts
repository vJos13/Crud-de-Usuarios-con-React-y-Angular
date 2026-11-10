import { Component, DestroyRef, inject } from '@angular/core';
import { UserComponent } from './user/user';

// Componente raíz. Además gestiona el "modo incrustado":
// cuando la app se abre dentro del panel de React (?embed=1)
// recibe el tema por postMessage y le informa su altura.
@Component({
  selector: 'app-root',
  imports: [UserComponent],
  template: '<app-user />',
})
export class App {
  constructor() {
    const params = new URLSearchParams(window.location.search);
    const embedded = params.get('embed') === '1' && window.parent !== window;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.applyTheme(params.get('theme') ?? (prefersDark ? 'dark' : 'light'));

    if (!embedded) return;
    document.body.classList.add('embed');

    // Tema enviado desde el panel (solo se aceptan orígenes localhost)
    const onMessage = (e: MessageEvent) => {
      if (!/^http:\/\/localhost(:\d+)?$/.test(e.origin)) return;
      if (e.data?.type === 'theme') this.applyTheme(e.data.theme);
    };
    window.addEventListener('message', onMessage);

    // Avisar la altura del contenido para ajustar el iframe
    const observer = new ResizeObserver(() => {
      window.parent.postMessage({ type: 'crud-height', height: document.body.scrollHeight }, '*');
    });
    observer.observe(document.body);

    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('message', onMessage);
      observer.disconnect();
    });
  }

  private applyTheme(theme: string): void {
    document.documentElement.dataset['theme'] = theme === 'dark' ? 'dark' : 'light';
  }
}
