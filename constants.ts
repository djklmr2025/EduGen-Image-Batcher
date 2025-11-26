import { CategoryConfig } from './types';

// Total Target: 260 images
// Template 1: 130 images
// Template 2: 130 images

export const TEMPLATES: Record<string, CategoryConfig> = {
  TEMPLATE_1: {
    name: "Template 1 - Environmental Pollution",
    subcategories: [
      {
        name: "Soil Pollution",
        count: 26,
        keywords: [
          "plastic waste in soil", "oil spill on ground", "industrial chemical leak", "battery acid leaching", "landfill cross section",
          "pesticide sprayer bottles", "heavy metal contamination", "electronic waste dump", "discarded tires decomposing", "microplastics in dirt",
          "illegal dumping site", "contaminated agricultural land", "rusty barrels leaking", "sewage sludge on land", "construction debris",
          "medical waste on ground", "radioactive warning sign on soil", "barren toxic earth", "garbage patch in field", "polluted playground",
          "mining waste tailings", "acid rain damaged soil", "polystyrene foam in mud", "broken glass in earth", "paint spill on grass", "trash buried underground"
        ]
      },
      {
        name: "Water Pollution",
        count: 26,
        keywords: [
          "plastic bottles floating in river", "oil slick on ocean surface", "industrial pipe discharging sewage", "algal bloom green water", "trash on beach",
          "microplastics in water sample", "dead fish due to toxicity", "foamy chemical runoff", "turbid dirty water", "garbage patch in ocean",
          "entangled sea life (simulation)", "soapy water discharge", "textile dye in river", "medical waste floating", "discarded fishing nets",
          "rusty cans in stream", "heavy metal water discoloration", "contaminated well water", "sewage overflow", "plastic bag jellyfish lookalike",
          "muddy polluted creek", "stagnant polluted pond", "trash accumulation in mangroves", "chemical barrel in lake", "oil covered bird (simulation)", "polluted drinking water glass"
        ]
      },
      {
        name: "Air Pollution",
        count: 26,
        keywords: [
          "factory smoke stacks", "heavy city smog", "vehicle exhaust fumes", "burning trash pile smoke", "coal power plant emissions",
          "dust storm in city", "hazy skyline", "industrial chimney smoke", "traffic jam pollution", "wildfire smoke",
          "brick kiln smoke", "diesel truck black smoke", "indoor stove smoke", "aerosol spray dispersion", "construction dust",
          "polluted sunset haze", "ship exhaust plumes", "airplane contrails spreading", "smog over park", "person wearing pollution mask",
          "monitoring station smog", "acid rain clouds", "burning agricultural waste", "refinery flares", "chimney soot", "particulate matter closeup concept"
        ]
      },
      {
        name: "Deforestation",
        count: 26,
        keywords: [
          "clear cut forest", "tree stumps landscape", "logging truck with timber", "chainsaw on stump", "burning amazon forest",
          "illegal logging site", "soil erosion after logging", "barren hillside", "palm oil plantation replacing forest", "lone tree in clear cut",
          "bulldozer pushing trees", "dried up river bed deforestation", "habitat loss concept", "wood pile logged", "forest fire remnants",
          "road cutting through jungle", "sawmill aerial view", "degraded forest land", "loss of biodiversity concept", "agricultural expansion into forest",
          "charcoal burning mound", "tree rings showing age cut", "wildlife fleeing deforestation (simulation)", "cracked earth deforestation", "satellite view deforestation map", "slash and burn agriculture"
        ]
      },
      {
        name: "Desertification",
        count: 26,
        keywords: [
          "cracked dry earth", "encroaching sand dunes", "dead tree in desert", "dried up lake bed", "dust bowl landscape",
          "abandoned farm house in sand", "goats overgrazing", "dry river channel", "sparse vegetation dry", "wind erosion soil",
          "salinization of soil white crust", "famine concept dry land", "migrating sand dune", "withered crops", "parched ground close up",
          "heat wave distortion desert", "climate change arid land", "loss of topsoil", "rocky barren terrain", "sandstorm approaching",
          "skeleton of animal (simulation)", "empty water well", "dried mud texture", "cactus in degraded land", "desertified agricultural field", "nomad moving due to drought"
        ]
      }
    ]
  },
  TEMPLATE_2: {
    name: "Template 2 - Hygiene Types",
    subcategories: [
      {
        name: "Personal Hygiene",
        count: 33,
        keywords: [
          "washing hands with soap", "brushing teeth", "taking a shower", "trimming fingernails", "combing hair",
          "washing face", "using deodorant", "wearing clean clothes", "covering mouth when sneezing", "using hand sanitizer",
          "cleaning ears gently", "washing feet", "shampooing hair", "flossing teeth", "cleaning glasses",
          "cutting toenails", "applying moisturizer", "shaving beard", "washing hands 20 seconds", "drying hands with towel",
          "using tissue for nose", "putting on clean socks", "laundry basket clean clothes", "bar of soap", "toothbrush and paste",
          "hairbrush", "nail clippers", "bath towel", "cotton swabs", "shampoo bottle",
          "handkerchief", "sanitizer bottle", "clean underwear folded"
        ]
      },
      {
        name: "Home Hygiene",
        count: 33,
        keywords: [
          "sweeping floor", "mopping floor", "dusting furniture", "vacuuming carpet", "cleaning windows",
          "taking out trash", "cleaning toilet", "scrubbing bathtub", "washing dishes", "making the bed",
          "organizing clutter", "disinfecting doorknobs", "changing bed sheets", "cleaning refrigerator", "wiping kitchen counter",
          "cleaning stove top", "washing curtains", "cleaning ceiling fan", "recycling bin sorting", "trash bin with lid",
          "cleaning supplies bucket", "sponge and soap", "broom and dustpan", "mop bucket", "vacuum cleaner",
          "spray bottle cleaner", "rubber gloves for cleaning", "clean living room", "tidy bedroom", "sparkling clean bathroom",
          "air purifier home", "mat at doorstep", "shoe rack organized"
        ]
      },
      {
        name: "Food Hygiene",
        count: 32,
        keywords: [
          "washing vegetables", "washing fruits", "covering food", "refrigerating leftovers", "checking expiration date",
          "cooking meat thoroughly", "using clean cutting board", "separating raw and cooked food", "washing hands before cooking", "wearing apron",
          "hairnet in kitchen", "clean kitchen utensils", "storing food in airtight containers", "boiling water", "pasteurized milk",
          "cleaning kitchen sink", "knife safety", "using food thermometer", "pest control in kitchen", "clean dish cloth",
          "serving food with spoon", "covering water jug", "fly screen on food", "washing canned food lids", "sanitizing kitchen table",
          "freezer storage", "dry food storage", "washing poultry caution", "clean dining area", "buffet hygiene guard",
          "food handler gloves", "discarding moldy food"
        ]
      },
      {
        name: "Community Hygiene",
        count: 32,
        keywords: [
          "using public trash cans", "cleaning park", "street sweeper machine", "garbage truck collecting", "public toilet cleaning",
          "no littering sign", "cleaning drainage", "vector control spraying", "community cleanup drive", "segregating waste public",
          "covering water tanks", "anti-spitting sign", "clean bus stop", "maintained public garden", "clean river bank",
          "sanitizing public railing", "dog poop scoop", "recycling station community", "clean market place", "municipal waste management",
          "clean hospital corridor", "school hygiene sanitation", "clean public bench", "proper sewage disposal", "clean walking path",
          "no open defecation sign", "cleaning graffiti", "pressure washing sidewalk", "public handwashing station", "well maintained fountain",
          "composting community waste", "biohazard waste disposal"
        ]
      }
    ]
  }
};
