import { SetMetadata, Type } from '@nestjs/common';
import { Ownable } from 'src/interfaces/Ownable';

export const CHECK_OWNERSHIP_KEY = 'checkOwnership';

export const CheckOwnership = (service: Type<Ownable>, ownerField: string) =>
  SetMetadata(CHECK_OWNERSHIP_KEY, { service, ownerField });
