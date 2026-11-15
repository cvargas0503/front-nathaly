/** Keep one request identity until the payload changes or its submission completes. */
export function createInvoiceSubmission(makeKey = () => globalThis.crypto.randomUUID()) {
  let previousPayload;
  let key;

  return {
    keyFor(payload) {
      const serialized = JSON.stringify(payload);
      if (serialized !== previousPayload || !key) {
        previousPayload = serialized;
        key = makeKey();
      }
      return key;
    },
    clear() {
      previousPayload = undefined;
      key = undefined;
    },
  };
}
