import { useState } from "react";
import useQuery from "./useQuery.jsx";

function Home() {
  const URL = "https://pokeapi.co/api/v2/pokemon/ditto";
  const { data, fetcher, error, loading } = useQuery(URL);
  const [pokemonName, setPokemonName] = useState("");

  function fetchPokemon() {
    fetcher(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    setPokemonName("");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Pokémon App</h1>
      <input
        type="text"
        placeholder="Enter Pokémon name"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
        className="p-2 border border-gray-300 rounded-md mb-4 w-64 text-center"
      />
      <button
        onClick={fetchPokemon}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Loading..." : "Search Pokémon!"}
      </button>

      {loading && <p className="text-blue-500 mt-4">Fetching data...</p>}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {data && !loading && (
        <div className="mt-4 text-center">
          <p className="text-xl">
            <span className="font-bold">Name:</span> {data.name}
          </p>
          <p className="text-xl">
            <span className="font-bold">Height:</span> {data.height}
          </p>
          <p className="text-xl">
            <span className="font-bold">Weight:</span> {data.weight}
          </p>
          {data.sprites && (
            <img
              src={data.sprites.front_default}
              alt={data.name}
              className="w-32 h-32 mx-auto my-4"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
