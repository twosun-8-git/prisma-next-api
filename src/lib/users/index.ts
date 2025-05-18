import prisma from "../prismaClient";

export const getUsers = async () => {
  const result = await prisma.user.findMany().withAccelerateInfo();
  return result;
};
