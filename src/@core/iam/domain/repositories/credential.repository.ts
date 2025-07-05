import { Repository } from '@core/common/domain/repository';
import { Credential, CredentialId } from '@core/iam/domain/entities/credential.entity';

export abstract class CredentialRepository extends Repository<Credential> {
  abstract findById(id: CredentialId): Promise<Credential | undefined>;
  //
}
