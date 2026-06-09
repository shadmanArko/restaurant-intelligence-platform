import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ZodError } from 'zod';

import { RegisterUserUseCase } from '@modules/identity/application/use-cases/register-user.use-case.js';
import {
  RegisterUserRequest,
  registerUserRequestSchema,
} from './register-user.request.js';

@Controller('identity/users')
export class IdentityController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: unknown): Promise<{ userId: string }> {
    const request: RegisterUserRequest = this.parseRequest(body);
    return this.registerUser.execute(request);
  }

  private parseRequest(body: unknown): RegisterUserRequest {
    try {
      return registerUserRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.issues);
      }

      throw error;
    }
  }
}
