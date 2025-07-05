import { Global, Module } from '@nestjs/common';
import { MessagingProvider } from '@core/common/domain/messaging-provider';
import { name } from '../../../package.json';

import { Kafka, Producer, KafkaConfig, ProducerConfig, ConsumerConfig } from 'kafkajs';

import { KafkaMessagingProvider } from '@core/common/infra/kafka-messaging.provider';

interface KafkaOptions {
  client: KafkaConfig;
  producer: ProducerConfig;
  consumer: ConsumerConfig;
}
export const kafkaOptions: KafkaOptions = {
  client: {
    clientId: name,
    brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || '').split(','),
    sasl:
      process.env.KAFKA_PROTOCOL === 'SASL_SSL'
        ? {
            mechanism: 'plain',
            username: process.env.KAFKA_USERNAME || '',
            password: process.env.KAFKA_PASSWORD || '',
          }
        : undefined,
    ssl: process.env.KAFKA_PROTOCOL === 'SASL_SSL',
    authenticationTimeout: 10000,
    connectionTimeout: 10000,
  },
  consumer: {
    groupId: name,
  },
  producer: {
    //
  },
};

@Global()
@Module({
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory() {
        const { client, producer } = kafkaOptions;
        const kafka = new Kafka(client);
        const kafkaProducer = kafka.producer(producer);
        kafkaProducer.connect();
        // const kafkaConsumer = kafka.consumer(consumer);
        // kafkaConsumer.connect();
        return kafkaProducer;
      },
    },
    {
      provide: MessagingProvider,
      useFactory(producer: Producer) {
        return new KafkaMessagingProvider(producer);
      },
      inject: ['KAFKA_PRODUCER'],
    },
  ],
  exports: [MessagingProvider],
})
export class MessagingModule {}
