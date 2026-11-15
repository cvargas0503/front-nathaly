const { test } = require('node:test');
const assert = require('node:assert/strict');

test('a lost response can be retried with the same invoice identity', async () => {
  const { createInvoiceSubmission } = await import('../src/lib/invoiceSubmission.js');
  let generated = 0;
  const submission = createInvoiceSubmission(() => `key-${++generated}`);
  const invoice = { idCliente: 1, detalles: [{ idProducto: 3, cantidad: 2 }] };
  const originalKey = submission.keyFor(invoice);
  assert.equal(submission.keyFor(JSON.parse(JSON.stringify(invoice))), originalKey);
  assert.equal(generated, 1);
});

test('an edited invoice gets a new identity and a completed invoice is cleared', async () => {
  const { createInvoiceSubmission } = await import('../src/lib/invoiceSubmission.js');
  let generated = 0;
  const submission = createInvoiceSubmission(() => `key-${++generated}`);
  const invoice = { idCliente: 1, detalles: [{ idProducto: 3, cantidad: 2 }] };
  assert.equal(submission.keyFor(invoice), 'key-1');
  const edited = { ...invoice, idCliente: 2 };
  assert.equal(submission.keyFor(edited), 'key-2');
  assert.equal(submission.keyFor(edited), 'key-2');
  submission.clear();
  assert.equal(submission.keyFor(edited), 'key-3');
});
