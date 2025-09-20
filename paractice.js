const countries = {
  pk: "Pakistan",
  us: "United States",
  in: "India",
  gb: "Great Britain",
  ussr: "Union of Soviet Socialist Republics",
  swl: "Swaziland (now Eswatini)",
  sr: "Suriname",
  uk: "United Kingdom"
};


// const {pk, us, ind, gb, ussr, swl, sr, uk} = countries


const {ussr} = countries.some(ans => ans === "Union of Soviet Socialist Republics")

console.log("USSR : ", ussr);



