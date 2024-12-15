import { useState } from "react";
import useQuery from "./useQuery.jsx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";

function Home() {
  const URL = "https://pokeapi.co/api/v2/pokemon/ditto";
  const { data, fetcher, error, loading } = useQuery(URL);
  const [pokemonName, setPokemonName] = useState("");
  const [value, setValue] = useState(0);
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [relatedPokemon, setRelatedPokemon] = useState({
    types: [],
    abilities: [],
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function fetchPokemon() {
    fetcher(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  }

  async function showDetails() {
    if (!pokemonName) {
      console.error("Pokemon name is empty.");
      return;
    }

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Pokémon details.");
      }

      const pokemonData = await response.json();
      setDetailedInfo(pokemonData);

      const typePromises = pokemonData.types.map(({ type }) =>
        fetch(type.url).then((res) => (res.ok ? res.json() : null))
      );

      const abilityPromises = pokemonData.abilities.map(({ ability }) =>
        fetch(ability.url).then((res) => (res.ok ? res.json() : null))
      );

      const [types, abilities] = await Promise.all([
        Promise.all(typePromises),
        Promise.all(abilityPromises),
      ]);

      const relatedTypes = types
        .filter(Boolean)
        .flatMap((typeData) =>
          typeData.pokemon.map((p) => p.pokemon.name).slice(0, 10)
        );

      const relatedAbilities = abilities
        .filter(Boolean)
        .flatMap((abilityData) =>
          abilityData.pokemon.map((p) => p.pokemon.name).slice(0, 10)
        );

      setRelatedPokemon({
        types: relatedTypes,
        abilities: relatedAbilities,
      });
    } catch (err) {
      console.error("Error fetching Pokémon details:", err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Pokedex</h1>
      <Tabs onChange={handleChange} value={value} className="mb-4">
        <Tab label="Search by ID" />
        <Tab label="Search by Name" />
      </Tabs>

      {value === 0 && (
        <input
          type="text"
          placeholder="Enter Pokémon ID"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-4 w-64 text-center"
        />
      )}
      {value === 1 && (
        <input
          type="text"
          placeholder="Enter Pokémon name"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-4 w-64 text-center"
        />
      )}
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
            <span className="font-bold">Type:</span> {data.types[0].type.name}
          </p>
          <p className="text-xl">
            <span className="font-bold">Abilities:</span>{" "}
            {data.abilities[0].ability.name}
          </p>
          <p className="text-xl">
            <span className="font-bold">Base exp:</span> {data.base_experience}
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

      <Button
        onClick={showDetails}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition mt-4"
        disabled={loading}
      >
        {loading ? "Loading..." : "Show Details"}
      </Button>

      {detailedInfo && (
        <div className="mt-6 w-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Detailed Information</h2>
          <p>
            <strong>Name:</strong> {detailedInfo.name}
          </p>
          <p>
            <strong>Type(s):</strong>{" "}
            {detailedInfo.types?.map((t) => t.type.name).join(", ")}
          </p>
          <p>
            <strong>Abilities:</strong>{" "}
            {detailedInfo.abilities?.map((a) => a.ability.name).join(", ")}
          </p>
          <p>
            <strong>Base Experience:</strong> {detailedInfo.base_experience}
          </p>
          <p>
            <strong>Height:</strong> {detailedInfo.height}
          </p>
          <p>
            <strong>Weight:</strong> {detailedInfo.weight}
          </p>
          {detailedInfo.sprites && (
            <div className="flex gap-4 mt-4">
              <img
                src={detailedInfo.sprites.front_default}
                alt="Front Sprite"
                className="w-32 h-32"
              />
              <img
                src={detailedInfo.sprites.back_default}
                alt="Back Sprite"
                className="w-32 h-32"
              />
            </div>
          )}

          <h3 className="text-xl font-bold mt-4">Other Pokémon</h3>
          <p>
            <strong>Same Type:</strong> {relatedPokemon.types.join(", ")}
          </p>
          <p>
            <strong>Same Abilities:</strong>{" "}
            {relatedPokemon.abilities.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
