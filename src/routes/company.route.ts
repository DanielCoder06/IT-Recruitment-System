import { Router } from "express";
import { CompanyController } from "../controllers/company.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../generated/prisma/enums";
import { compare } from "bcryptjs";

const router = Router();

router.use(requireAuth);
router.use(requireRole(UserRole.COMPANY));

router.get("/dashboard", CompanyController.getDashboard);
router.get("/jobs", CompanyController.getJobs);
router.get("/jobs/create", CompanyController.getCreateJobPage);
router.post("/jobs/create", CompanyController.postCreateJob);
router.get("/jobs/:id", CompanyController.getJobDetail);
router.get("/jobs/:id/edit", CompanyController.getEditJobPage);
router.post("/jobs/:id/edit", CompanyController.postUpdateJob);
router.post("/jobs/:id/delete", CompanyController.postDeleteJob);
router.get("/applications", CompanyController.getApplications);
router.get("/jobs/:id/applicants", CompanyController.getJobApplicants);

export default router;
