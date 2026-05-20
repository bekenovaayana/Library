export const borrowKeys = {
  all: ["borrow"] as const,
  my: () => [...borrowKeys.all, "my"] as const,
};
