import { name, version } from 'package.json';

import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { KafkaJsInstrumentation } from '@opentelemetry/instrumentation-kafkajs';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const serviceName = name;
const serviceVersion = version;
const serviceEnv = process.env.NODE_ENV;
const otlpBaseUrl = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

if (!serviceEnv) {
  console.error("Missing env 'NODE_ENV' to initialize telemetry service");
  process.exit(1);
}

if (!otlpBaseUrl) {
  console.error("Missing env 'OTEL_EXPORTER_OTLP_ENDPOINT' to initialize telemetry service");
  process.exit(1);
}

const hasBarSuffix = otlpBaseUrl?.endsWith('/');

const traceExporter = new OTLPTraceExporter({
  url: `${otlpBaseUrl}${hasBarSuffix ? '' : '/'}v1/traces`,
});

const logsExporter = new OTLPLogExporter({
  url: `${otlpBaseUrl}${hasBarSuffix ? '' : '/'}v1/logs`,
  keepAlive: true,
});

const metricsExporter = new OTLPMetricExporter({
  url: `${otlpBaseUrl}${hasBarSuffix ? '' : '/'}v1/metrics`,
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
    ['deployment.environment']: serviceEnv,
  }),

  spanProcessors: [new BatchSpanProcessor(traceExporter)],
  logRecordProcessors: [new BatchLogRecordProcessor(logsExporter)],

  instrumentations: [
    new DnsInstrumentation(),
    new ExpressInstrumentation(),
    new HttpInstrumentation(),
    new KafkaJsInstrumentation(),
    new PinoInstrumentation(),
    new NestInstrumentation(),
    new PrismaInstrumentation({}),
  ],
});

process.on('SIGTERM', async () => {
  console.error('Telemetry Received SIGTERM, shutting down module...');
  await sdk.shutdown();
});

const reader = new PeriodicExportingMetricReader({
  exporter: metricsExporter,
  exportIntervalMillis: 1000,
});

const meterProvider = new MeterProvider({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
    ['deployment.environment']: serviceEnv,
  }),
  readers: [reader],
});

sdk.start();

meterProvider.getMeter('default').createCounter('started').add(1, { name, version });

export { meterProvider };
