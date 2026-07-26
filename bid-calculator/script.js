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

const summaryEl = document.querySelector(".summary");
// Returns a list of all elements matching that CSS selector
const loadRows = document.querySelectorAll(".load");

// RATES
const DUMP_RATE = 48.5; // $ per ton of heavy debris. Twin Falls Transfer Station
const LABOR_RATE = 40; // $ per worker per hour
const FREE_MILES = 20; // free travel radius
const PER_MILE = 0.8; // $ per mile beyond the free radius
const MIN_CHARGE = 80; // minimum bid

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
  const subtotal = basePrice + dumpFee + laborCost + travelCost;
  console.log(`Subtotal: $${subtotal}`);

  // Check to make sure minimum charge is selected if subtotal is lower than MIN_CHARGE, then store in total
  const total = Math.max(subtotal, MIN_CHARGE);

  // Reveals the Pricing Summary after the calculate bid button is clicked
  summaryEl.classList.remove("hidden");

  summaryEl.scrollIntoView({ behavior: "smooth", block: "start" });

  // Displays the pricing breakdown section
  baseAmountEl.textContent = `$${basePrice.toFixed(2)}`;
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
