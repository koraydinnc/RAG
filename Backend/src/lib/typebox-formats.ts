import { FormatRegistry } from "@sinclair/typebox";

/**
 * TypeBox, ajv'den farklı olarak hiçbir `format` doğrulayıcısını hazır getirmez.
 * Kayıtlı olmayan bir format, Value.Check içinde her zaman false döner.
 * Bu modül uygulama açılışında bir kez import edilmeli (app.ts / worker.ts).
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const DATE_TIME = /^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(\.\d+)?([Zz]|[+-]\d{2}:\d{2})$/

FormatRegistry.Set('uuid', (value) => UUID.test(value))

FormatRegistry.Set('date-time', (value) =>
    DATE_TIME.test(value) && !Number.isNaN(Date.parse(value))
)
