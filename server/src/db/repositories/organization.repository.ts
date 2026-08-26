import { prisma } from "../client";

type CreateOrganizationData = {
  name: string;
  slug: string;
  ownerId: string;
};

export async function createOrganization(data: CreateOrganizationData) {
  return prisma.organization.create({ data });
}

export async function findOrganizationBySlug(slug: string) {
  return prisma.organization.findUnique({ where: { slug } });
}
