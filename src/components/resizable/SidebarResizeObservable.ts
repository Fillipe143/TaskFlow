
import { Observable } from '../observer';

export class SidebarResizeObservable extends Observable<DOMRectReadOnly> {
    private resizeObserver: ResizeObserver;

    constructor(sidebarElement: HTMLElement) {
        super();

        if (!sidebarElement) {
            throw new Error("Elemento da sidebar não encontrado.");
        }

        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                this.notify(entry.contentRect); 
            }
        });

        this.resizeObserver.observe(sidebarElement);
    }

    disconnect(): void {
        this.resizeObserver.disconnect();
    }
}

export{};