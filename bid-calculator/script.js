const calcBtn = document.getElementById("calcBtn");
const dumpWeightEl = document.getElementById("dumpWeight");
const laborWorkersEl = document.getElementById("laborWorkers");
const laborHoursEl = document.getElementById("laborHours");
const travelMilesEl = document.getElementById("travelMiles");
const resultEl = document.getElementById("result");
const workersInputErrorMsgEl = document.getElementById("workersInputErrorMsg");
const baseAmountEl = document.getElementById("baseAmount");
const dumpAmountEl = document.getElementById("dumpAmount");
const laborAmountEl = document.getElementById("laborAmount");
const travelAmountEl = document.getElementById("travelAmount");
const minChargeAppliedEl = document.getElementById("minChargeApplied");
const flatFeeCardEl = document.getElementById("flatFeeCard");
const flatFeeToggleEl = document.getElementById("flatFeeToggle");
const flatFeeAmountEl = document.getElementById("flatFeeAmount");
const summaryEl = document.querySelector(".summary");
// Returns a list of all elements matching that CSS selector
const loadRows = document.querySelectorAll(".load");

// RATES
const DUMP_RATE = 48.5; // $ per ton of heavy debris. Twin Falls Transfer Station
const LABOR_RATE = 40; // $ per worker per hour
const FREE_MILES = 20; // free travel radius
const PER_MILE = 0.8; // $ per mile beyond the free radius
const MIN_CHARGE = 80; // minimum bid

// Flat-Fee Items Object
const FLATFEEITEMS = {
  fridge: { flatFeePrice: 25, flatFeeWeight: 0.125, label: "Fridge" },
  chestFreezer: {
    flatFeePrice: 25,
    flatFeeWeight: 0.05,
    label: "Chest Freezer",
  },
  washerOrDryer: {
    flatFeePrice: 20,
    flatFeeWeight: 0.1,
    label: "Washer / Dryer",
  },
  dishwasher: { flatFeePrice: 10, flatFeeWeight: 0.035, label: "Dish Washer" },
  windowACUnit: {
    flatFeePrice: 10,
    flatFeeWeight: 0.03,
    label: "Window AC Unit",
  },
  waterHeater: {
    flatFeePrice: 20,
    flatFeeWeight: 0.075,
    label: "Water Heater",
  },
  mattress: {
    flatFeePrice: 17,
    flatFeeWeight: 0.06,
    label: "Mattress / Box Spring",
  },
  tire: { flatFeePrice: 10, flatFeeWeight: 0.01, label: "Tire" },
  eWaste: { flatFeePrice: 5, flatFeeWeight: 0.01, label: "E-Waste" },
  hotTub: { flatFeePrice: 200, flatFeeWeight: 0.25, label: "Hot Tub" },
  hazmat: { flatFeePrice: 40, flatFeeWeight: 0.025, label: "Hazmat" },
};
// Materials Object
const MATERIALS = {
  yardDebris: { price: 10, density: 0.0315 },
  householdJunk: { price: 15, density: 0.04 },
  furniture: { price: 17.5, density: 0.075 },
  constructionDebris: { price: 25, density: 0.125 },
  heavyDebris: { price: 40, density: 0.2 },
};

// Array of objects (use to save locally)
const persistFields = [
  { el: dumpWeightEl, key: "dumpWeight" },
  { el: laborWorkersEl, key: "laborWorkers" },
  { el: laborHoursEl, key: "laborHours" },
  { el: travelMilesEl, key: "travelMiles" },
];

// loops through each load row and adds each field object to the persistFields Array
loadRows.forEach((row, index) => {
  const equipmentEl = row.querySelector(".loadEquipment");
  const fullnessEl = row.querySelector(".loadFullness");
  const loadCountEl = row.querySelector(".loadCount");
  const materialTypeEl = row.querySelector(".materialType");

  persistFields.push({ el: equipmentEl, key: `load${index}-equipment` });
  persistFields.push({ el: fullnessEl, key: `load${index}-fullness` });
  persistFields.push({ el: loadCountEl, key: `load${index}-loadCount` });
  persistFields.push({ el: materialTypeEl, key: `load${index}-materialType` });
});

// FLAT-FEE ITEMS: a labeled quantity input for each item
// Object.keys(FLATFEEITEMS) turns the object into an array of its key strings - ["Fridge", "chestFreezer"]
// .forEach loops them, key being each item name
Object.keys(FLATFEEITEMS).forEach((key) => {
  // builds a brand-new element in memory
  const label = document.createElement("label");
  label.textContent = FLATFEEITEMS[key].label;

  // builds a brand-new element in memory
  const input = document.createElement("input");
  // Next lines set properties on the input-type, min, value, etc
  input.type = "number";
  input.min = "0";
  input.value = "0";
  // querySelectorAll(".flatFeeQty") will be used to grab all the values above
  input.className = "flatFeeQty";
  // dataset.key = key writes a data-key = "Fridge" attribute, which is how the math step will know which item each input belongs to
  input.dataset.key = key;

  // appendChild is what actually puts elements into the page. First nest the input inside the label
  label.appendChild(input);
  // then drop the label into the flatFeeCardEl. after this the row is live in the DOM(document object model)
  flatFeeCardEl.appendChild(label);

  // reuses the persistance system and reads flat-fridge and are the unique storage keys
  persistFields.push({ el: input, key: `flat-${key}` });
});

// SAVE TO LOCAL STORAGE LOGIC
// loop through each field save it and load it
persistFields.forEach((field) => {
  //LOAD: restore saved value on startup
  const saved = localStorage.getItem(field.key);
  if (saved !== null) {
    field.el.value = saved;
  }

  // SAVE: on every change, write current value
  field.el.addEventListener("input", () => {
    localStorage.setItem(field.key, field.el.value);
  });
});

calcBtn.addEventListener("click", calculateBid);

// flatFeeCardEl.classList.toggle("hidden") key line to either toggle between showing the card or hiding the card when the button is pressed.
flatFeeToggleEl.addEventListener("click", () => {
  flatFeeCardEl.classList.toggle("hidden");
});

// Calculate Bid Function
function calculateBid() {
  workersInputErrorMsgEl.textContent = "";
  // Convert from string to decimal
  // || 0 reads as: "use the parsed number, but if that failed, fall back to 0."
  const dumpWeight = parseFloat(dumpWeightEl.value) || 0;
  const laborWorkers = parseFloat(laborWorkersEl.value) || 0;
  const laborHours = parseFloat(laborHoursEl.value) || 0;
  const travelMiles = parseFloat(travelMilesEl.value) || 0;

  let basePrice = 0;
  let totalWeight = 0;
  let flatFeeTotal = 0;

  // loop throught the two Equipment rows
  loadRows.forEach((row) => {
    const capacity = parseFloat(row.querySelector(".loadEquipment").value);
    const fullness = parseFloat(row.querySelector(".loadFullness").value);
    const count = parseFloat(row.querySelector(".loadCount").value) || 0;
    const materialKey = row.querySelector(".materialType").value;
    const material = MATERIALS[materialKey];

    const rowVolume = capacity * fullness * count;
    basePrice += rowVolume * material.price;
    totalWeight += rowVolume * material.density;
  });
  // Loop through the flat flee items
  document.querySelectorAll(".flatFeeQty").forEach((input) => {
    const qty = parseFloat(input.value) || 0;
    const key = input.dataset.key;
    const item = FLATFEEITEMS[key];

    flatFeeTotal += qty * item.flatFeePrice;
    totalWeight += qty * item.flatFeeWeight;
  });

  // Input Validation
  if (!Number.isInteger(laborWorkers)) {
    workersInputErrorMsgEl.textContent =
      "Please enter a whole number of workers";
    return;
  }

  // Calculate dump fee
  const weight = dumpWeight > 0 ? dumpWeight : totalWeight;
  const dumpFee = weight * DUMP_RATE;

  // Calculate labor cost
  const laborCost = laborWorkers * laborHours * LABOR_RATE;

  // Calculate Travel
  const billableMiles = Math.max(0, travelMiles - FREE_MILES);
  const travelCost = billableMiles * PER_MILE;

  // Subtotal
  const subtotal = basePrice + dumpFee + laborCost + travelCost + flatFeeTotal;
  console.log(`Subtotal: $${subtotal}`);

  // Check to make sure minimum charge is selected if subtotal is lower than MIN_CHARGE, then store in total
  const total = Math.max(subtotal, MIN_CHARGE);

  // Reveals the Pricing Summary after the calculate bid button is clicked
  summaryEl.classList.remove("hidden");

  summaryEl.scrollIntoView({ behavior: "smooth", block: "start" });

  // Displays the pricing breakdown section
  baseAmountEl.textContent = `$${basePrice.toFixed(2)}`;
  flatFeeAmountEl.textContent = `$${flatFeeTotal.toFixed(2)}`;
  dumpAmountEl.textContent = `$${dumpFee.toFixed(2)}`;
  laborAmountEl.textContent = `$${laborCost.toFixed(2)}`;
  travelAmountEl.textContent = `$${travelCost.toFixed(2)}`;

  // Display a minimum charge applied message if the total is greater than the subtotal. Reset and hide message when subtotal is greater than total
  if (total > subtotal) {
    minChargeAppliedEl.textContent = `Minimum charge applied`;
  } else {
    minChargeAppliedEl.textContent = "";
  }

  // Displays the suggested bid
  console.log(`Suggested Bid: $${total.toFixed(2)}`);
  resultEl.textContent = `$${total.toFixed(2)}`;
}
