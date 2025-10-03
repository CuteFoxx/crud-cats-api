import { UseInterceptors } from '@nestjs/common';
import {
  SerializeClassConstructor,
  SerializeInterceptor,
} from 'src/interceptors/serialize.interceptor';

export function Serialize(dto: SerializeClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
