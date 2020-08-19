export type ModelPropStringType = {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  optional?: boolean;
};

export type ModelPropNumberType = {
  type: 'number';
  max?: number;
  min?: number;
  optional?: boolean;
};

export type ModelPropBooleanType = {
  type: 'boolean';
  optional?: boolean;
};

export type ModelPropObjectType = {
  type: 'object';
  shape: {
    [key: string]: ModelValidator;
  };
  optional?: boolean;
};

export type ModelPropArrayType = {
  type: 'array';
  of: ModelValidator;
  optional?: boolean;
};

export type ModelValidator =
  | ModelPropStringType
  | ModelPropNumberType
  | ModelPropBooleanType
  | ModelPropArrayType
  | ModelPropObjectType;

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
