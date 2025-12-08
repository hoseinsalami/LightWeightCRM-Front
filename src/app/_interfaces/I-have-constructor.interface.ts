export interface IHaveConstructorInterface<T>{
    new(input: Partial<T>): T
}
