import { log,join, BufReader, parse, pick } from "../deps.ts";



type Plant =  Record<string,string>
let planets: Array<Plant>

export function filterHabitablePlanets(planets: Array<Plant>) {
  return planets.filter((plant) => {
    const plantRadius = Number(plant["koi_prad"]);
    const stellarMass = Number(plant["koi_smass"]);
    const stellarRadius = Number(plant["koi_srad"]);

    return plant["koi_disposition"] === "CONFIRMED" && plantRadius > 0.5 &&
      plantRadius < 1.5 && stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  })
}

async function loadPlanetsData() {
  const path = join("data", "kepler_exoplanets_nasa.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    skipFirstRow: true,
    comment: "#",
  });
  Deno.close(file.rid);

  const plants = filterHabitablePlanets(result as Array<Plant>);

  return plants.map((plant) => {
    return pick(plant, [
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
    ]);
  });
}

planets = await loadPlanetsData();
log.info(`It has ${planets.length} plant we can live in!`);

export function getAllPlanets(){
  return planets
}
