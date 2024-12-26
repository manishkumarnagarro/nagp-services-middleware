export enum ExchangeTypes {
  TOPIC = 'topic',
  FANOUT = 'fanout',
}

export enum RabbitMQEventTypes {
  ACCOUNTS = 'event_accounts',
  DOCUMENTS = 'event_documents',
  GENERATE_DOCUMENT = 'event_generate_document',
}

export enum RabbitMQEvents {
  ACCOUNT_CREATED = 'event_account_created',
  GENERATE_STATEMENT = 'event_generate_account_statement',
  STATEMENT_GENERATED = 'event_documents_statement_generated',
}

export enum RabbitMQExchangeKeys {
  RABBITMQ_ACCOUNTS_EXCHANGE = 'RABBITMQ_ACCOUNTS_EXCHANGE',
  RABBITMQ_DOCUMENTS_EXCHANGE = 'RABBITMQ_DOCUMENTS_EXCHANGE',
  RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE = 'RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE',
}
