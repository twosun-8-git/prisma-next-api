import prisma from "../prismaClient";

type GetUsersParams = {
  scores?: boolean;
};

export const getUsers = async ({ scores = false }: GetUsersParams) => {
  const result = await prisma.user
    .findMany({
      include: scores ? { scores: true } : undefined,
    })
    .withAccelerateInfo();
  return result;
};
