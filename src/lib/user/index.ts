import prisma from "../prismaClient";

export const getUser = async ({
  email,
  scores = false,
}: {
  email: string;
  scores?: boolean;
}) => {
  const result = await prisma.user.findMany({
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
  });
  return result;
};
