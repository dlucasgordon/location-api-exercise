// The k-d-tree module lacks TypeScript type declarations, so we added our own minimal set of declarations.

declare module 'k-d-tree' {
  class KDTree<T extends {coordinates: [number, number]}> {
    constructor(points: Array<T>, metric: (p1: T, p2: T) => number)
    nearest(point: T, maxNodes: number, maxDistance?: number): Array<[T, number]>
  }
  export = KDTree
}
