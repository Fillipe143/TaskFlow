export class Observable {
    observers = [];
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notify(data) {
        this.observers.forEach(observer => observer(data));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".resize-child.sidebar");
    const resizeHandle = document.querySelector(".resize-handle");

    let isResizing = false;

    resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => {
            isResizing = false;
            document.removeEventListener("mousemove", handleMouseMove);
        });
    });

    function handleMouseMove(e) {
        if (!isResizing) return;
        
        const newWidth = e.clientX / window.innerWidth;
        sidebar.style.width = `${Math.max(newWidth * 100, 20)}%`;
    }
});


export{};