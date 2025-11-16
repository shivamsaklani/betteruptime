import express, { type Request, type Response, type NextFunction } from "express";
import { PrismaClient, Prisma } from "../../generated/prisma";
import { z } from "zod";
const prisma = new PrismaClient();
const router = express.Router();

/* ==============================================================
   1. Extract Model Names & Delegates Safely
   ============================================================== */
type ModelName = keyof typeof prisma; // e.g. "user" | "post" | ...

type ModelDelegate<M extends ModelName> = (typeof prisma)[M] & {
  findMany: (args?: any) => Promise<any>;
  findUnique: (args?: any) => Promise<any>;
  create: (args?: any) => Promise<any>;
  update: (args?: any) => Promise<any>;
  delete: (args?: any) => Promise<any>;
};

/* ==============================================================
   2. Type-Safe Delegate Getter
   ============================================================== */
function getDelegate<M extends ModelName>(model: M): ModelDelegate<M> {
  const delegate = prisma[model];
  if (!delegate || typeof delegate !== "object") {
    throw new Error(`Model not found. Did you run 'prisma generate'?`);
  }
  return delegate as ModelDelegate<M>;
}

/* ==============================================================
   3. Generic CRUD Payload Types (Prisma-aware)
   ============================================================== */
type FindManyArgs<M extends ModelName> = Parameters<ModelDelegate<M>["findMany"]>[0];
type FindUniqueArgs<M extends ModelName> = Parameters<ModelDelegate<M>["findUnique"]>[0];
type CreateArgs<M extends ModelName> = Parameters<ModelDelegate<M>["create"]>[0];
type UpdateArgs<M extends ModelName> = Parameters<ModelDelegate<M>["update"]>[0];
type DeleteArgs<M extends ModelName> = Parameters<ModelDelegate<M>["delete"]>[0];

/* ==============================================================
   4. Safe JSON Parser with Type
   ============================================================== */
function parseJSON<T>(input: unknown, field: string): T | undefined {
  if (input === undefined) return undefined;
  try {
    return JSON.parse(input as string) as T;
  } catch {
    throw new Error(`Invalid JSON in query param: ${field}`);
  }
}

/* ==============================================================
   5. Validation Schemas
   ============================================================== */
const IdSchema = z.coerce.string();

const PaginationSchema = z.object({
  skip: z.coerce.number().int().min(0).optional().default(0),
  take: z.coerce.number().int().min(1).max(100).optional().default(20),
});

/* ==============================================================
   6. GET /:table → findMany
   ============================================================== */
router.get("/:table", async (req: Request, res: Response, next: NextFunction) => {
  const table = req.params.table as ModelName;
  const delegate = getDelegate(table);

  try {
    const query = req.query;

    const pagination = PaginationSchema.parse({
      skip: query.skip,
      take: query.take,
    });

    const args: FindManyArgs<typeof table> = {
      ...pagination,
      where: parseJSON(query.where, "where"),
      select: parseJSON(query.select, "select"),
      include: parseJSON(query.include, "include"),
      orderBy: parseJSON(query.orderBy, "orderBy"),
    };

    // Remove undefined fields
    const cleanArgs = Object.fromEntries(
      Object.entries(args).filter(([_, v]) => v !== undefined)
    ) as FindManyArgs<typeof table>;

    const result = await delegate.findMany(cleanArgs);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================================
   7. GET /:table/:id → findUnique
   ============================================================== */
router.get("/:table/:id", async (req: Request, res: Response, next: NextFunction) => {
  const table = req.params.table as ModelName;
  const delegate = getDelegate(table);

  try {
    const id = IdSchema.parse(req.params.id);
    const query = req.query;

    const args: FindUniqueArgs<typeof table> = {
      where: { id },
      select: parseJSON(query.select, "select"),
      include: parseJSON(query.include, "include"),
    };

    const cleanArgs = Object.fromEntries(
      Object.entries(args).filter(([_, v]) => v !== undefined)
    ) as FindUniqueArgs<typeof table>;

    const result = await delegate.findUnique(cleanArgs);
    if (!result) return res.status(404).json({ error: "Not found" });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================================
   8. POST /:table → create
   ============================================================== */
router.post("/:table", async (req: Request, res: Response, next: NextFunction) => {
  const table = req.params.table as ModelName;
  const delegate = getDelegate(table);
  console.log(table);
  try {
    const query = req.query;
    console.log(req.body);
    const args: CreateArgs<typeof table> = {
      data: req.body,
      select: parseJSON(query.select, "select"),
      include: parseJSON(query.include, "include"),
    };

    const cleanArgs = Object.fromEntries(
      Object.entries(args).filter(([_, v]) => v !== undefined)
    ) as CreateArgs<typeof table>;

    const result = await delegate.create(cleanArgs);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

/* ==============================================================
   9. PUT /:table/:id → update
   ============================================================== */
router.put("/:table/:id", async (req: Request, res: Response, next: NextFunction) => {
  const table = req.params.table as ModelName;
  const delegate = getDelegate(table);

  try {
    const id = IdSchema.parse(req.params.id);
    const query = req.query;

    const args: UpdateArgs<typeof table> = {
      where: { id },
      data: req.body,
      select: parseJSON(query.select, "select"),
      include: parseJSON(query.include, "include"),
    };

    const cleanArgs = Object.fromEntries(
      Object.entries(args).filter(([_, v]) => v !== undefined)
    ) as UpdateArgs<typeof table>;

    const result = await delegate.update(cleanArgs);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================================
   10. DELETE /:table/:id → delete
   ============================================================== */
router.delete("/:table/:id", async (req: Request, res: Response, next: NextFunction) => {
  const table = req.params.table as ModelName;
  const delegate = getDelegate(table);
  try {
    const id = IdSchema.parse(req.params.id);
    console.log(id);
    const args: DeleteArgs<typeof table> = { where: { id } };

    const result = await delegate.delete(args);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================================
   11. Error Handler
   ============================================================== */
router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: "Validation failed", issues: err.issues });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({ error: err.message, code: err.code });
  }

  console.error("Unexpected error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default router;