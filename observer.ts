
export class Observable<T> {
    private observers: Array<(data: T) => void> = [];

    // Register an observer
    addObserver(observer: (data: T) => void): void {
        this.observers.push(observer);
    }

    // Remove an observer
    removeObserver(observer: (data: T) => void): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // Notify all observers of a change
    notify(data: T): void {
        this.observers.forEach(observer => observer(data));
    }
}
