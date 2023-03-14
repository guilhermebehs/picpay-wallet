import { ApiProperty } from '@nestjs/swagger';

export class ClientErrorDto {
  @ApiProperty({
    description: 'status code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'error message',
  })
  message: string;

  @ApiProperty({
    description: 'status code description',
  })
  error: string;
}
