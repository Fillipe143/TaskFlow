export class Dialog {
    private readonly container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.setup();
    }

    private setup() {
        if(this.container.classList.contains("closable")) {
            this.container.addEventListener("click", _ => this.dismiss());
        }

        const opacity = this.container.getAttribute("data-opacity");
        if (opacity !== null) this.container.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    }

    public static FromId(id: string): Dialog {
        const container = document.querySelector(`#${id}.dialog-container`);
        if (!container) throw `Nenhum dialog com o id ${id} foi encontrado!`;
        return new Dialog(container as HTMLElement);
    }

    public show() {
        this.container.classList.add("show");
    }

    public dismiss() {
        this.container.classList.remove("show");
    }
}