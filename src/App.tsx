import { FormEvent } from "react";
import "./api/client";
import { useDeleteMutation, useGetQuery, usePostMutation } from "./api/client";

function App() {
  const gists = useGetQuery("/gists", { params: { query: { per_page: 5 } } });

  const createGist = usePostMutation("/gists");
  const removeGist = useDeleteMutation("/gists/{gist_id}");

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();

    createGist.mutate(
      {
        body: {
          description: `my-random-gist-${Math.random().toString(36).substring(7)}`,
          files: { "random.txt": { content: Math.random().toString(36).substring(7) } },
        },
      },
      {
        onSuccess: () => {
          gists.refetch();
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure?")) return;
    
    removeGist.mutate(
      { params: { path: { gist_id: id } } },
      {
        onSuccess: () => {
          gists.refetch();
        },
      }
    );
  };

  return (
    <>
      <h1> Gists</h1>
      <p>TanStack Query 🤝 OpenAPI</p>
      <ul style={{ opacity: gists.isFetching ? 0.4 : 1 }}>
        {gists.data?.map((gist) => (
          <li key={gist.id}>
            <strong>{gist.description || "Untitled"}</strong>{" "}
            <small>{new Date(gist.created_at).toLocaleTimeString()}</small>
            <button onClick={() => handleDelete(gist.id)} style={{ background: "transparent" }}>
              ❌
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreate}>
        <button type="submit">Create random Gist</button>
      </form>
    </>
  );
}

export default App;
