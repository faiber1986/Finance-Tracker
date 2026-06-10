export async function apiFetchBrowser<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new Error("Network error: could not reach the server. Check your connection.");
  }

  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = "/login";
      throw new Error("UNAUTHORIZED");
    }
    const error = await res.text();
    throw new Error(error || `API error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
