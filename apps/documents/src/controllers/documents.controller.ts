import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller('')
export class DocumentsController {
  @Get('statement/:accNum')
  downloadStatement(@Param('accNum') accountNumber: string, @Res() res: Response) {
    try {
      const filePath = join(__dirname, `${accountNumber}.pdf`);
      const file = readFileSync(filePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(file);
    } catch (error) {
      res.status(404).json({ message: 'Statement not found' });
    }
  }
}
