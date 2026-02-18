export interface IHaveConstructorInterface<T>{
    new(input: Partial<T>): T
}

export interface CreateResult<T> {
  raw: any;     // خروجی کامل وب‌سرویس
  model: T;     // مدل ساخته شده از کلاس
}
