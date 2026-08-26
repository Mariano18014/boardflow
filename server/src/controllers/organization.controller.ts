import type { NextFunction, Request, Response } from "express";
import type { Organization } from "@prisma/client";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from "@shared/schemas/organization.schema";
import { ValidationError } from "../lib/errors";
import { createOrganization, getOrganizationsForUser } from "../services/organization.service";

export async function createOrganizationController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseCreateOrganizationRequestBody(req.body);
    const organization = await createOrganization(input, req.userId!);
    res.status(201).json({ organization: formatOrganizationForResponse(organization) });
  } catch (error) {
    next(error);
  }
}

export async function listOrganizationsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizations = await getOrganizationsForUser(req.userId!);
    res.status(200).json({ organizations: organizations.map(formatOrganizationForResponse) });
  } catch (error) {
    next(error);
  }
}

function parseCreateOrganizationRequestBody(body: unknown): CreateOrganizationInput {
  const result = createOrganizationSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatOrganizationForResponse(organization: Organization) {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
  };
}
