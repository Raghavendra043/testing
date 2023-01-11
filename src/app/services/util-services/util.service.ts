import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Utils {
  exists<T>(obj: T | undefined | null): obj is T {
    return typeof obj !== 'undefined' && obj !== null;
  }

  /**
   * @deprecated Use {@link exists} with optional chaining instead
   * @example
   * exists(obj?.prop1?.prop2)
   */
  hasNestedProperty(obj: object, propertyPath: string): boolean {
    const reducer = (acc: unknown, part: string) => {
      if (acc instanceof Object && part in acc) {
        return acc[part];
      } else {
        return undefined;
      }
    };

    const result = propertyPath.split('.').reduce(reducer, obj);
    return this.exists(result);
  }

  groupBy<T, U>(arr: T[], discriminator: (_: T) => U): Map<U, T[]> {
    return arr.reduce((map: Map<U, T[]>, t: T) => {
      const key = discriminator(t);
      const group = map.get(key) ?? [];
      group.push(t);
      return map.set(key, group);
    }, new Map());
  }

  compareBy<T, U>(getter: (_: T) => U): (t1: T, t2: T) => number {
    return (t1, t2) => {
      const a = getter(t1);
      const b = getter(t2);
      return a < b ? -1 : b < a ? 1 : 0;
    };
  }

  sortBy<T, U>(arr: T[], getter: (_: T) => U): T[] {
    return arr.sort(this.compareBy(getter));
  }

  urlToId = (url: any) => Number(url.match(/\d+$/g)[0]);
}
