/**
 * Wrapper around fetch that implements retries and exponential backoff.
 * Enables easy unit testing with a simple mock.
 * @param input fetch's inputs
 * @param init fetch's inits
 * @returns the resulting JSON from the response
 */
export async function fetcher(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<any> {
  // TODO: implement retries and exponential backoff
  const response = await fetch(input, init);
  return await response.json();
}
