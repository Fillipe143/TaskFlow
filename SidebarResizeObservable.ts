// src/components/SidebarResizeObservable.ts
import { Observable } from './observer';

export class SidebarResizeObservable extends Observable<DOMRectReadOnly> {
    private resizeObserver: ResizeObserver;

    constructor(sidebarElement: HTMLElement) {
        super();

        // Verifica se o elemento existe
        if (!sidebarElement) {
            throw new Error("Elemento da sidebar não encontrado.");
        }

        // Instancia o ResizeObserver
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                this.notify(entry.contentRect); // Notifica os observadores com as dimensões da sidebar
            }
        });

        // Começa a observar o elemento
        this.resizeObserver.observe(sidebarElement);
    }

    // Método para parar de observar
    disconnect(): void {
        this.resizeObserver.disconnect();
    }
}
