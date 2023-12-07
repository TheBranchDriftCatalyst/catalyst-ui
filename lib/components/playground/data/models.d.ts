export declare const types: readonly ["GPT-3", "Codex"];
export type ModelType = (typeof types)[number];
export interface Model<Type = string> {
    id: string;
    name: string;
    description: string;
    strengths?: string;
    type: Type;
}
export declare const models: Model<ModelType>[];
