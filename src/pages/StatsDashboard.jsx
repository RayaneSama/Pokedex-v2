/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatsDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=100"
        );
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );

        const typeStats = {};
        pokemonDetails.forEach((pokemon) => {
          pokemon.types.forEach(({ type }) => {
            const typeName = type.name;

            if (!typeStats[typeName]) {
              typeStats[typeName] = {
                totalBaseExperience: 0,
                totalPokemon: 0,
                uniqueAbilities: new Set(),
              };
            }

            typeStats[typeName].totalBaseExperience += pokemon.base_experience;
            typeStats[typeName].totalPokemon += 1;
            pokemon.abilities.forEach(({ ability }) =>
              typeStats[typeName].uniqueAbilities.add(ability.name)
            );
          });
        });

        const processedStats = Object.entries(typeStats).map(
          ([typeName, stats]) => ({
            type: typeName,
            avgBaseExperience: stats.totalBaseExperience / stats.totalPokemon,
            totalUniqueAbilities: stats.uniqueAbilities.size,
          })
        );

        setStats(processedStats);

        setChartData({
          labels: processedStats.map((stat) => stat.type),
          datasets: [
            {
              label: "Average Base Experience",
              data: processedStats.map((stat) => stat.avgBaseExperience),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Total Unique Abilities",
              data: processedStats.map((stat) => stat.totalUniqueAbilities),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        setError("Error fetching Pokémon data.");
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemonData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center w-full px-4">
        <h1 className="text-2xl font-bold">Pokémon Stats Dashboard</h1>
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <AiOutlineHome className="mr-2" size={20} />
          Home
        </Link>
      </div>

      <div style={{ width: "80%", margin: "20px auto" }}>
        {chartData && <Bar data={chartData} />}
      </div>
      <table style={{ margin: "20px auto", border: "1px solid black" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Average Base Experience</th>
            <th>Total Unique Abilities</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.type}>
              <td>{stat.type}</td>
              <td>{stat.avgBaseExperience.toFixed(2)}</td>
              <td>{stat.totalUniqueAbilities}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsDashboard;
