import { ModelPropStringType, ModelPropArrayType, ModelPropObjectType, ModelPropBooleanType, ModelPropNumberType, ValidationPropError, ModelValidator } from './types';
export declare function reducer(key: string, validator: ModelValidator, value: unknown): ValidationPropError | null;
export declare function validateString(validationKey: string, validation: ModelPropStringType, dataValue: unknown): ValidationPropError | null;
export declare function validateNumber(validationKey: string, validation: ModelPropNumberType, dataValue: unknown): ValidationPropError | null;
export declare function validateBoolean(validationKey: string, validation: ModelPropBooleanType, dataValue: unknown): ValidationPropError | null;
export declare function validateObject(validationKey: string, validation: ModelPropObjectType, dataValue: unknown): ValidationPropError | null;
export declare function validateArray(validationKey: string, validation: ModelPropArrayType, dataValue: unknown): ValidationPropError | null;
