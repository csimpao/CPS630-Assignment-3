/**
 * Wrapper around fetch that enables retries and exponential backoff.
 * Not in scope of the current implementation.
 * Enables easy unit testing with a simple mock.
 * @param input fetch's inputs
 * @param init fetch's inits
 * @returns the resulting JSON from the response
 */
export async function fetcher(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<any> {
  const response = await fetch(input, init);
  return await response.json();
}
