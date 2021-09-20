const express = require("express");

const PORT = 4000;

// Importing all the pokemon for our data file
const allPokemon = require("./data");

const app = express();
// Config express to understand json
app.use(express.json());

// route that serves an array of objects containing data about all the Pokemons
app.get("/pokemon", (req, res) => {
  return res.json(allPokemon);
});

// route that serves an object of a specific Pokemon (provided id)
app.get("/pokemon/:pokemonId", (req, res) => {
  const foundPokemon = allPokemon.find((currentPoke) => {
    return currentPoke.id === Number(req.params.pokemonId);
  });
  if (foundPokemon) {
    return res.status(200).json(foundPokemon);
  }
  return res.status(404).json({ msg: "Pokemon not found" });
});

// route, where the user can search Pokemons by name or type (when searching by type, should return all the pokemon found with that type)
app.get("/search", (req, res) => {
  // checking if there is a search for the 'type'
  if (req.query.type) {
    const searchResult = allPokemon.filter((currentPoke) => {
      return currentPoke.types.includes(req.query.type.toLowerCase());
    });
    if (searchResult) {
      return res.status(200).json(searchResult);
    } else {
      return res
        .status(404)
        .json({ msg: `No pokemon found with the type ${req.query.type}.` });
    }

    // checking if there is a search for the 'name'
  } else if (req.query.name) {
    const searchResult = allPokemon.filter((currentPoke) => {
      return currentPoke.name.includes(req.query.name.toLowerCase());
    });
    if (searchResult) {
      return res.status(200).json(searchResult);
    } else {
      return res
        .status(404)
        .json({ msg: `No pokemon found with the name ${req.query.name}.` });
    }
  }
  // if there is no search
  return res.status(404).json({ msg: "No search provided." });
});

// POST route, that inserts the new Pokemon into the existing list of all Pokemons (not persisting the data to the disk)
app.post("/pokemon", (req, res) => {
  const newPokemon = { id: allPokemon.length + 1, ...req.body };
  allPokemon.push(newPokemon);
  res.status(201).json(newPokemon);
});

// PUT route, that updates an existing Pokemon with the provided data
app.put("/pokemon/:pokemonId", (req, res) => {
  const foundPokemonIndex = allPokemon.findIndex((currentPoke) => {
    return currentPoke.id === Number(req.params.pokemonId);
  });
  if (foundPokemonIndex > -1) {
    const updatedPokemon = { ...req.body };
    allPokemon[foundPokemonIndex] = updatedPokemon;
    return res.status(200).json(updatedPokemon);
  }
  return res.status(404).json({ msg: "Pokemon not found" });
});

// DELETE route, that deletes an existing Pokemon and returns a success message
app.delete("/pokemon/:pokemonId", (req, res) => {
  const foundPokemonIndex = allPokemon.findIndex((currentPoke) => {
    return currentPoke.id === Number(req.params.pokemonId);
  });
  if (foundPokemonIndex > -1) {
    allPokemon.splice(foundPokemonIndex, 1);
    return res.status(200).json({
      msg: `Pokemon with id#:${req.params.pokemonId} sucessfully deleted`,
    });
  }
  return res.status(404).json({ msg: "Pokemon not found" });
});

// SUPERBONUS: patch (only updates the body entries, keeping the previous unrequested records)
app.patch("/pokemon/:pokemonId", (req, res) => {
  const foundPokemonIndex = allPokemon.findIndex((currentPoke) => {
    return currentPoke.id === Number(req.params.pokemonId);
  });
  if (foundPokemonIndex > -1) {
    const updatedPokemon = {
      ...allPokemon[foundPokemonIndex],
      ...req.body,
    };
    allPokemon[foundPokemonIndex] = updatedPokemon;
    return res.status(200).json(updatedPokemon);
  }
  return res.status(404).json({ msg: "Pokemon not found" });
});

app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`));
