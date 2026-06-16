import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World!this is the first refreshing writing code since 5 month ago or maybe 4 years let's say
  `;
  }
}
