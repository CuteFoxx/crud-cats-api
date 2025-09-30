import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ModuleRef } from '@nestjs/core';
import { CHECK_OWNERSHIP_KEY } from '../decorators/ownership';
import { Role } from '../enums/Role';
import { JwtPayload } from '../auth.service';
import { Ownable } from 'src/interfaces/Ownable';

interface OwnershipMetadata {
  service: Type<Ownable>;
  ownerField: string;
}

interface PayloadRequest extends Request {
  params: { id: string };
  user: JwtPayload;
}

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { service, ownerField } =
      this.reflector.get<OwnershipMetadata>(
        CHECK_OWNERSHIP_KEY,
        context.getHandler(),
      ) || {};

    if (!service || !ownerField) {
      throw new ForbiddenException('Ownership metadata missing');
    }

    const request = context.switchToHttp().getRequest<PayloadRequest>();
    const userId = request.user.sub;
    const entityId = request.params.id;

    if (request.user.role == Role.Admin) {
      return true;
    }

    const entityService: Ownable = this.moduleRef.get(service, {
      strict: false,
    });

    const ownerId = await entityService.getOwnerId(entityId);
    if (!ownerId) {
      throw new ForbiddenException('OwnerId not found');
    }

    if (ownerId !== userId) {
      throw new ForbiddenException('You are not the owner');
    }

    return true;
  }
}
