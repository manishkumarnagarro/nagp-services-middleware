import {
  AccountStatement,
  RabbitMQEvents,
  RabbitMQEventTypes,
  RabbitMQExchangeKeys,
  TransactionType,
} from '@app/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpcProxy } from '@nestjs/microservices';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { join } from 'path';
import { width } from 'pdfkit/js/page';

@Injectable()
export class DocumentsService {
  constructor(
    private configService: ConfigService,
    private amqpConnection: AmqpConnection,
    @Inject(process.env.ACCOUNTS_SERVICE_GRPC)
    private accounts: ClientGrpcProxy,
  ) {}

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_DOCUMENTS_EXCHANGE,
    queue: process.env.RABBITMQ_GENERATE_STATEMENT_QUEUE,
    routingKey: 'documents.event.create.*',
  })
  generateDocument(data: any): void {
    console.info(
      'PDF Service: Generate statement document event received',
      data.accountNumber,
    );
    try {
      this.fetchStatement(data.accountNumber);
    } catch (e) {
      console.log('Error fetching account statement');
    }
  }

  async fetchStatement(accountNumber: string): Promise<void> {
    const data: AccountStatement = await this.accounts
      .getService<any>(this.configService.getOrThrow('ACCOUNTS_SERVICE_GRPC'))
      .getAccountStatement({ accountNumber })
      .toPromise();
    this.generateAccountStatement(data);
    console.info('PDF Service: Received account statement from gRPC');
  }

  generateAccountStatement(data: AccountStatement): void {
    // Create a document here
    this.generateStatementPdfFile(data);
    this.amqpConnection.publish(
      this.configService.getOrThrow(
        RabbitMQExchangeKeys.RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE,
      ),
      'documents.statement_generated',
      {
        type: RabbitMQEventTypes.DOCUMENTS,
        name: RabbitMQEvents.STATEMENT_GENERATED,
        accountNumber: data.accountNumber,
        fileType: data.fileType || 'pdf',
        created_at: new Date(),
        // POC assignement purpose only otherwise this will go to some storage and a secure link generated
        uri: `http://localhost:500/statement/${data.accountNumber}`,
      },
    );
  }

  generateStatementPdfFile(data: AccountStatement): void {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 30 });
      fs.existsSync(join(__dirname, `${data.accountNumber}.pdf`)) &&
        fs.unlinkSync(join(__dirname, `${data.accountNumber}.pdf`));
      const stream = fs.createWriteStream(
        join(__dirname, `${data.accountNumber}.pdf`),
      );

      doc.pipe(stream);
      doc.fontSize(16).text('Your Account Statement').moveDown(1);

      doc.image(join(__dirname, './assets/images/logo.jpg'), 450, 20, {
        width: 100,
      });

      doc
        .fontSize(12)
        .text(data.name)
        .text('Account number: ' + data.accountNumber)
        .moveDown(2);

      // Add table headers
      doc.rect(doc.x, doc.y - 5, doc.page.width - 60, 20).fill('#edcbf7');

      doc.fillColor('black').fontSize(11).text('Account Activity');
      doc.underline(doc.x, doc.y + 5, doc.page.width - 60, 0).moveDown(1);
      doc.rect(doc.x, doc.y - 10, doc.page.width - 60, 24).fill('#edcbf7');

      doc.fillColor('black').fontSize(11);
      doc.text('Date', doc.x, doc.y, { width: 120 }).moveUp(1);
      doc
        .text('Payment Mode', 120, doc.y, {
          width: 80,
        })
        .moveUp(1);
      doc.text('Beneficiary', 200, doc.y, { width: 120 }).moveUp(1);
      doc.text('Debit', 320).moveUp(1);
      doc.text('Credit', 400).moveUp(1);
      doc.text('Balance', 480);
      doc.moveDown(1);
      doc.fontSize(10);

      // Add table row
      data.transactions?.forEach((transaction) => {
        {
          doc
            .text(new Date(transaction.date).toDateString(), 30, doc.y, {
              width: 120,
            })
            .moveUp(1);

          doc
            .text(transaction.mode, 120, doc.y, {
              width: 80,
            })
            .moveUp(1);

          doc
            .text(`TO:${transaction.toAccount}`, 200, doc.y, {
              width: 120,
              ellipsis: true,
            })
            .moveUp(1);

          transaction.type === TransactionType.WITHDRAWAL
            ? doc.text(transaction.amount.toString(), 320, doc.y).moveUp(1)
            : doc.text('-', 320, doc.y).moveUp(1);

          transaction.type === TransactionType.DEPOSIT
            ? doc.text(transaction.amount.toString(), 400, doc.y).moveUp(1)
            : doc.text('-', 400, doc.y).moveUp(1);

          doc.text(transaction.balance.toString(), 480);
          doc.moveDown(1);
        }
      });
      doc.moveDown(1);

      const debitTotal = data.transactions
        ?.filter((t) => t.type === TransactionType.WITHDRAWAL)
        .reduce((acc, curr) => {
          acc += curr.amount;
          return acc;
        }, 0);

      const creditTotal = data.transactions
        ?.filter((t) => t.type === TransactionType.DEPOSIT)
        .reduce((acc, curr) => {
          acc += curr.amount;
          return acc;
        }, 0);

      doc.text('Total', 30, doc.y).moveUp(1);
      doc.text(debitTotal.toFixed(2), 320, doc.y).moveUp(1);
      doc.text(creditTotal.toFixed(2), 400, doc.y);

      doc.end();
    } catch (e) {
      console.log('Error generating PDF', e);
    }
    console.log('PDF generated');
  }
}
