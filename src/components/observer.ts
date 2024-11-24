
export class Observable<T> {
    private observers: Array<(data: T) => void> = [];

    addObserver(observer: (data: T) => void): void {
        this.observers.push(observer);
    }

    removeObserver(observer: (data: T) => void): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data: T): void {
        this.observers.forEach(observer => observer(data));
    }
}

export{};