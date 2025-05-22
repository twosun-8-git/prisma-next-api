import prisma from "../prismaClient";

type GetUsersParams = {
  admin?: boolean;
  scores?: boolean;
};

export const getUsers = async ({ admin, scores }: GetUsersParams) => {
  const wheres = {
    ...(admin !== undefined && { isAdmin: admin }),
  };

  const includes = {
    ...(scores !== undefined && { scores: scores }),
  };

  const result = await prisma.user
    .findMany({
      where: wheres,
      include: includes,
    })
    .then(async (users) => {
      const count = users.length;
      return { count, users };
    });
  return result;
};
