import XLSX from 'xlsx';
import fs from 'fs-extra';
import path from 'path';

const xlsxPath = path.resolve('static/pokemons.xlsx');
const jsonPath = path.resolve('static/pokemons.json');

const ALL_TYPES = ['Fire','Water','Grass','Electric','Poison','Flying','Bug','Normal','Ground','Rock','Psychic','Fighting','Ghost','Ice','Dragon'];
const ALL_COLORS = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Brown', 'Purple', 'Gray', 'White', 'Pink'];

async function generateJson() {
  const workbook = XLSX.readFile(xlsxPath);

  const pokemonSheet = workbook.Sheets['Pokemons'];
  const questionSheet = workbook.Sheets['Questions'];

  const pokemonsRaw: any[] = XLSX.utils.sheet_to_json(pokemonSheet);
  const questionsRaw: any[] = XLSX.utils.sheet_to_json(questionSheet);

  const pokemons = pokemonsRaw.map(row => {
    const traits: Record<string, boolean> = {};

    // Génère un trait pour chaque type
    ALL_TYPES.forEach(type => {
      traits[`is${type}`] = row['Type 1'] === type || row['Type 2'] === type;
    });

    ALL_COLORS.forEach(color => {
      traits[`is${color}`] = row['Color'] === color;
    });

    // Traits supplémentaires
    traits['isEvolution'] = row['IsEvolution'] === true || row['IsEvolution'] === 'TRUE';
    traits['canEvolve'] = row['CanEvolve'] === true || row['CanEvolve'] === 'TRUE';
    traits['IsStarter'] = row['IsStarter'] === true || row['IsStarter'] === 'TRUE';
    traits['IsLegendary'] = row['IsLegendary'] === true || row['IsLegendary'] === 'TRUE';

    return {
      name: row['Name'],
      traits,
      sprite: row['Sprite'],
      color: row['Color']
    };
  });

  const questions = questionsRaw.map(row => ({
    key: row['key'],
    label: row['label']
  }));

  await fs.writeJson(jsonPath, { pokemons, questions }, { spaces: 2 });
  console.log(`JSON généré avec succès : ${jsonPath}`);
}

generateJson().catch(console.error);
