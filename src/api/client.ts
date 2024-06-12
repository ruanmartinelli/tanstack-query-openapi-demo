import {
  UseMutationOptions as RQUseMutationOptions,
  UseQueryOptions as RQUseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import createClient, { FetchOptions, Middleware } from "openapi-fetch";
import type { HttpMethod, PathsWithMethod } from "openapi-typescript-helpers";
import type { paths } from "./github";

const baseUrl = "https://api.github.com";

// ⚠️ I'm using the GitHub token directly in the client for demo purposes ONLY.
// If I published this app, the token would be exposed in the client bundle. DO NOT DO THIS.
// Instead, you should use a server to make requests to the GitHub API and store the token securely.
const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

const client = createClient<paths>({ baseUrl });

const authMiddleware: Middleware = {
  async onRequest(req, _options) {
    req.headers.set("Authorization", `Bearer ${githubToken}`);
    return req;
  },
};

client.use(authMiddleware);

type UseQueryOptions = Pick<RQUseQueryOptions, "enabled">;
type UseMutationOptions = Pick<RQUseMutationOptions, "retry">;

type Paths<M extends HttpMethod> = PathsWithMethod<paths, M>;
type Params<M extends HttpMethod, P extends Paths<M>> = M extends keyof paths[P]
  ? FetchOptions<paths[P][M]>
  : never;

export function usePostMutation<P extends Paths<"post">>(path: P, opts?: UseMutationOptions) {
  return useMutation({
    mutationFn: (params: Params<"post", P>) => client.POST(path, params).then(({ data }) => data),
    ...opts,
  });
}

export function useGetQuery<P extends Paths<"get">>(
  path: P,
  params: Params<"get", P> & { rq?: UseQueryOptions }
) {
  return useQuery({
    queryKey: [path, params],
    queryFn: async () => client.GET(path, params).then(({ data }) => data),
    ...params?.rq,
  });
}

export function usePutMutation<P extends Paths<"put">>(path: P, opts?: UseMutationOptions) {
  return useMutation({
    mutationFn: (params: Params<"put", P>) => client.PUT(path, params).then(({ data }) => data),
    ...opts,
  });
}

export function useDeleteMutation<P extends Paths<"delete">>(path: P, opts?: UseMutationOptions) {
  return useMutation({
    mutationFn: (params: Params<"delete", P>) => client.DELETE(path, params).then(({ data }) => data),
    ...opts,
  });
}
