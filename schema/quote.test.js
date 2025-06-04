const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert');

const models = [
  'QuoteModel',
  'OhlcSeries',
  'NewsArticle',
  'FxRate',
  'PortfolioHolding',
  'CountrySetting',
  'ApiQuotaLedger',
  'UserCredential'
];

function validate(schema, obj) {
  if (schema.type === 'object') {
    if (schema.required) {
      for (const prop of schema.required) {
        if (!(prop in obj)) return false;
      }
    }
    for (const [key, propSchema] of Object.entries(schema.properties || {})) {
      if (obj[key] === undefined) continue;
      if (propSchema.type === 'object') {
        if (typeof obj[key] !== 'object') return false;
      } else if (propSchema.type === 'array') {
        if (!Array.isArray(obj[key])) return false;
      } else if (typeof obj[key] !== (propSchema.type === 'integer' ? 'number' : propSchema.type)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

for (const model of models) {
  test(`${model} example is valid`, () => {
    const schema = JSON.parse(fs.readFileSync(path.join(__dirname, `${model}.schema.json`), 'utf-8'));
    const example = JSON.parse(fs.readFileSync(path.join(__dirname, `${model}.example.json`), 'utf-8'));
    assert.strictEqual(validate(schema, example), true);
  });
}

