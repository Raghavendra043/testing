import { Injectable } from '@angular/core';
import {
  Acknowledgement,
  AcknowledgementsResult,
  ApiAcknowledgement,
} from 'src/app/types/acknowledgements.type';
import { User } from 'src/app/types/user.type';
import { HttpClient } from '@angular/common/http';
import { Utils } from 'src/app/services/util-services/util.service';
import { lastValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AcknowledgementsService {
  constructor(private http: HttpClient) {}

  async list(user: User): Promise<Acknowledgement[]> {
    if (user?.links?.acknowledgements === undefined) {
      throw new TypeError(
        'User object does not contain a link relation to acknowledgements'
      );
    } else {
      const acknowledgements = user.links.acknowledgements;

      const results = await lastValueFrom(
        this.http.get<AcknowledgementsResult>(acknowledgements)
      );

      return results.acknowledgements.map(this.toAcknowledgement);
    }
  }

  private toAcknowledgement(
    acknowledgement: ApiAcknowledgement
  ): Acknowledgement {
    return {
      ...acknowledgement,
      uploadTimestamp: new Date(acknowledgement.uploadTimestamp),
      acknowledgementTimestamp: new Date(
        acknowledgement.acknowledgementTimestamp
      ),
    };
  }
}
