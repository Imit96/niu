// Minimal mock for next/cache used in Vitest
export const revalidatePath = () => {};
export const revalidateTag = () => {};
export const unstable_cache = (fn: (...args: unknown[]) => unknown) => fn;
