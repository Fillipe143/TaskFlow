export class Resizable {
    public readonly container: HTMLElement;
    public readonly childs: NodeListOf<HTMLElement>;
    public readonly handlers: NodeListOf<HTMLElement>;
    private resizeListeners: Array<() => void> = [];

    private isResizing: boolean = false;
    private readonly defaultMinSize: number = 0.2;

    constructor(container: HTMLElement, childs: NodeListOf<HTMLElement>, handlers: NodeListOf<HTMLElement>) {
        this.container = container;
        this.childs = childs;
        this.handlers = handlers;
        this.setup();
    }

    private setup() {
        for (let i = 0; i < this.handlers.length; i++) {
            this.resize(this.handlers[0], this.childs[i], this.childs[i + 1]);
        }
    }

    public static FromId(id: string): Resizable {
        const container = document.querySelector(`#${id}.resizable-container`);
        if (!container) throw `Nenhim resizable com o id ${id} foi encontrado!`;

        const childs = container.querySelectorAll(":scope > .resize-child") as NodeListOf<HTMLElement>;
        const handlers = container.querySelectorAll(":scope > .resize-handle") as NodeListOf<HTMLElement>;
        return new Resizable(container as HTMLElement, childs, handlers);
    }

    public addResizeListener(listener: () => void) {
        this.resizeListeners.push(listener);
        listener();
    }

    private notify() {
        this.resizeListeners.forEach(listener => listener());
    }

    private resize(handler: HTMLElement, firstChild: HTMLElement, secondChild: HTMLElement) {
        handler.addEventListener("mousedown", e => {
            e.preventDefault();
            this.isResizing = true;

            const isVertical = this.container.classList.contains("vertical");
            const firstMinSize = (isVertical ? this.container.offsetHeight : this.container.offsetWidth) * (Number(firstChild.getAttribute("data-min") || this.defaultMinSize));
            const secondMinSize = (isVertical ? this.container.offsetHeight : this.container.offsetWidth) * (Number(secondChild.getAttribute("data-min") || this.defaultMinSize));

            const startPosition = isVertical ? e.clientY : e.clientX;
            const firstChildStartSize = isVertical ? firstChild.offsetHeight : firstChild.offsetWidth;
            const secondChildStartSize = isVertical ? secondChild.offsetHeight : secondChild.offsetWidth;

            const startPercentageFirstChild = (firstChildStartSize / (isVertical ? this.container.offsetHeight : this.container.offsetWidth)) * 100;
            const startPercentageSecondChild = (secondChildStartSize / (isVertical ? this.container.offsetHeight : this.container.offsetWidth)) * 100;

            const mousemoveEvent = (e: MouseEvent) => {
                if (!this.isResizing) return;

                const dp = startPosition - (isVertical ? e.clientY : e.clientX);
                const containerSize = isVertical ? this.container.offsetHeight : this.container.offsetWidth;

                let firstChildSize = startPercentageFirstChild - ((dp / containerSize) * 100);
                let secondChildSize = startPercentageSecondChild + ((dp / containerSize) * 100);

                if (firstChildSize < (firstMinSize / containerSize) * 100) {
                    secondChildSize -= (firstMinSize / containerSize) * 100 - firstChildSize;
                    firstChildSize = (firstMinSize / containerSize) * 100;
                }
                if (secondChildSize < (secondMinSize / containerSize) * 100) {
                    firstChildSize -= (secondMinSize / containerSize) * 100 - secondChildSize;
                    secondChildSize = (secondMinSize / containerSize) * 100;
                }

                firstChildSize -= 1;
                secondChildSize -= 1;

                firstChild.style.flex = "none";
                secondChild.style.flex = "none";

                if (isVertical) {
                    firstChild.style.height = `${firstChildSize}%`;
                    secondChild.style.height = `${secondChildSize}%`;
                } else {
                    firstChild.style.width = `${firstChildSize}%`;
                    secondChild.style.width = `${secondChildSize}%`;
                }

                this.notify();
            };

            const mouseupEvent = () => {
                this.isResizing = false;
                document.removeEventListener("mousemove", mousemoveEvent);
                document.removeEventListener("mouseup", mouseupEvent);
            };

            document.addEventListener("mousemove", mousemoveEvent);
            document.addEventListener("mouseup", mouseupEvent);
        });
    }
}