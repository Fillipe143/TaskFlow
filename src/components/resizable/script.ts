{
    const containers = document.getElementsByClassName("resizable-container");

    const defaultMinSize = 0.2; // 20%
    let isResizing = false;

    for (const container of containers) {
        const childs = container.querySelectorAll(":scope > .resize-child") as NodeListOf<HTMLElement>;
        const handlers = container.querySelectorAll(":scope > .resize-handle") as NodeListOf<HTMLElement>;

        for (let i = 0; i < handlers.length; i++) {
            resize(container as HTMLElement, handlers[i], childs[i], childs[i + 1], childs.length);
        }
    }

    function resize(container: HTMLElement, handler: HTMLElement, firstChild: HTMLElement, secondChild: HTMLElement, childrensCount: number) {
        handler.addEventListener("mousedown", e => {
            e.preventDefault();
            isResizing = true;

            const isVertical = container.classList.contains("vertical");
            const firstMinSize = (isVertical ? container.offsetHeight : container.offsetWidth) *  Number(firstChild.getAttribute("data-min") || defaultMinSize);
            const secondMinSize = (isVertical ? container.offsetHeight : container.offsetWidth) * Number(secondChild.getAttribute("data-min") || defaultMinSize);

            const startPosition = isVertical ? e.clientY : e.clientX;
            const firstChildStartSize = isVertical ? firstChild.offsetHeight : firstChild.offsetWidth;
            const secondChildStartSize = isVertical ? secondChild.offsetHeight : secondChild.offsetWidth;

            const mousemoveEvent = (e: MouseEvent) => {
                if (!isResizing) return;

                const dp = startPosition - (isVertical ? e.clientY : e.clientX);
                let firstChildSize = firstChildStartSize - dp;
                let secondChildSize = secondChildStartSize + dp;

                if (firstChildSize < firstMinSize) {
                    secondChildSize -= firstMinSize - firstChildSize;
                    firstChildSize = firstMinSize;
                }
                if (secondChildSize < secondMinSize) {
                    firstChildSize -= secondMinSize - secondChildSize;
                    secondChildSize = secondMinSize;
                }

                firstChildSize -= 1;
                secondChildSize -= 1;

                firstChild.style.flex = "none";
                secondChild.style.flex = "none";

                if (isVertical) {
                    firstChild.style.height = `${firstChildSize}px`;
                    secondChild.style.height = `${secondChildSize}px`;
                } else {
                    firstChild.style.width = `${firstChildSize}px`;
                    secondChild.style.width = `${secondChildSize}px`;
                }
            };

            const mouseupEvent = () => {
                isResizing = false;
                document.removeEventListener("mousemove", mousemoveEvent);
                document.removeEventListener("mouseup", mouseupEvent);
            };

            document.addEventListener("mousemove", mousemoveEvent);
            document.addEventListener("mouseup", mouseupEvent);
        });
    }
}