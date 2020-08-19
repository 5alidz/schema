export declare type ModelPropStringType = {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    optional?: boolean;
};
export declare type ModelPropNumberType = {
    type: 'number';
    max?: number;
    min?: number;
    optional?: boolean;
};
export declare type ModelPropBooleanType = {
    type: 'boolean';
    optional?: boolean;
};
export declare type ModelPropObjectType = {
    type: 'object';
    shape: {
        [key: string]: ModelValidator;
    };
    optional?: boolean;
};
export declare type ModelPropArrayType = {
    type: 'array';
    of: ModelValidator;
    optional?: boolean;
};
export declare type ModelValidator = ModelPropStringType | ModelPropNumberType | ModelPropBooleanType | ModelPropArrayType | ModelPropObjectType;
export interface Model {
    [key: string]: ModelValidator;
}
export interface EmptyObject {
    [key: string]: unknown;
}
export interface ValidationPropError {
    key: string;
    message: string;
}
