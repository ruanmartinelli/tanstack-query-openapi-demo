import "./api/client";
import { useGetQuery } from "./api/client";

function App() {
  const gists = useGetQuery("/gists", { params: { query: { per_page: 5 } } });

  return (
    <>
      <h1> Gists</h1>
      <p>TanStack Query 🤝 OpenAPI</p>
      <ul>
        {gists.data?.map((gist) => (
          <li key={gist.id}>
            <strong>{gist.description || "Untitled"}</strong> <small>{gist.created_at}</small>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
