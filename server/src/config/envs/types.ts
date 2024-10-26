import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}
export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  // DATABASE ENV VARIABLES
  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  @IsOptional()
  DATABASE_PORT?: number = 3306;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_DB_NAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNC?: boolean = false;

  @IsString()
  ACCESS_JWT_TOKEN_SECRET: string;

  @IsString()
  REFRESH_JWT_TOKEN_SECRET: string;

  @IsNumber()
  @IsOptional()
  ACCESS_JWT_TOKEN_EXPIRY?: number;

  @IsNumber()
  @IsOptional()
  REFRESH_JWT_TOKEN_EXPIRY?: number;

  @IsString()
  RAZORPAY_KEY_ID: string;

  @IsString()
  RAZORPAY_KEY_SECRET: string;

  @IsString()
  RAZORPAY_WEBHOOK_SECRET: string;

  @IsString()
  AWS_SES_HOST: string;

  @IsString()
  AWS_SES_PORT: string;

  @IsString()
  AWS_SES_ACCESS_KEY: string;

  @IsString()
  AWS_SES_SECRET_KEY: string;

  @IsString()
  AWS_SES_REGION: string;

  @IsString()
  FROM_EMAIL: string;
}
