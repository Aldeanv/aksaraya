import { useEffect, useState } from "react";
import { fetchCatalogs } from "../../services/catalogService";

interface Catalog {
  id: number;
  coverUrl: string;
  title: string;
  author: string;
  genre: string;
  year: number;  
  synopsis: string;
  publisher: string;
  type: string;
}

function Home() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const data = await fetchCatalogs();
        setCatalogs(data);
      } catch (err) {
        console.error("Failed to fetch catalogs", err);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading catalogs...</p>;

  return (
    <>
      <h1 className="font-extrabold text-4xl">catalog buku aksaraya</h1>

      {catalogs.length === 0 ? (
        <p className="text-center">No catalogs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {catalogs.map((catalog) => (
            <div key={catalog.id} className="border p-4 rounded shadow">
              <img
                src={catalog.coverUrl}
                alt={catalog.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="text-xl font-semibold">{catalog.title}</h2>
              <p>Author: {catalog.author}</p>
              <p>Genre: {catalog.genre}</p>
              <p>Year: {catalog.year}</p>
              <p>Type: {catalog.type}</p>
              <p>Sinopsis: {catalog.synopsis}</p>
              <p>Publisher: {catalog.publisher}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
