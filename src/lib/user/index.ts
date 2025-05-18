import prisma from "../prismaClient";

type GetUserParams = {
  email: string;
  scores?: boolean;
};

export const getUser = async ({ email, scores = false }: GetUserParams) => {
  const result = await prisma.user
    .findMany({
      where: {
        email: {
          equals: email,
        },
      },
      include: scores
        ? {
            scores: true,
          }
        : undefined,
    })
    .withAccelerateInfo();
  return result;
};
