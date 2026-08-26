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

export async function findOrganizationById(id: string) {
  return prisma.organization.findUnique({ where: { id } });
}

type UpdateOrganizationData = {
  name?: string;
  logoUrl?: string;
};

export async function updateOrganization(id: string, data: UpdateOrganizationData) {
  return prisma.organization.update({ where: { id }, data });
}
