import { z } from "zod";
export declare const taskSchema: any;
export type Task = z.infer<typeof taskSchema>;
