export class StorageVar<T = string> {
  constructor(private key: string, private storage: Storage) {}

  get(defaultValue: T): T;
  get(): T | null;
  get(defaultValue: T | null = null): T | object | null {
    const item = this.storage.getItem(this.key);
    if (item !== null) {
      try {
        return JSON.parse(item) as T;
      } catch (e) {
        console.warn('Storagevar is not json, returning string');
        return item as T;
      }
    }
    return defaultValue;
  }

  set(value: T) {
    this.storage.setItem(this.key, JSON.stringify(value));
  }

  delete() {
    this.storage.removeItem(this.key);
  }
}
