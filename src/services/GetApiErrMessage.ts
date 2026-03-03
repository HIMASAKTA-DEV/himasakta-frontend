interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

interface ApiError {
  message?: string;
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
}

function isApiError(err: unknown): err is ApiError {
  return typeof err === "object" && err !== null && "response" in err;
}

export function getApiErrorMessage(err: unknown): string {
  if (isApiError(err)) {
    const data = err.response?.data;

    if (data?.message && data?.error) {
      return `${data.message}: ${data.error}`;
    }

    return data?.message || data?.error || "Terjadi kesalahan";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Terjadi kesalahan";
}
