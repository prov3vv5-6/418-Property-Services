const calcBtn = document.getElementById("calcBtn");
const equipmentEl = document.getElementById("equipment");
const fullnessEl = document.getElementById("fullness");
const dumpWeightEl = document.getElementById("dumpWeight");
const laborWorkersEl = document.getElementById("laborWorkers");
const laborHoursEl = document.getElementById("laborHours");
const travelMilesEl = document.getElementById("travelMiles");
const resultEl = document.getElementById("result");
const workersInputErrorMsgEl = document.getElementById("workersInputErrorMsg");

// RATES
const PRICE_PER_YARD = 30; // $ per cubic yard
const DUMP_RATE = 48.5; // $ per ton of heavy debris. Twin Falls Transfer Station
const LABOR_RATE = 35; // $ per worker per hour
const FREE_MILES = 20; // free travel radius
const PER_MILE = 1.5; // $ per mile beyond the free radius
const MIN_CHARGE = 80; // minimum bid

calcBtn.addEventListener("click", calculateBid);

// Calculate Bid Function
function calculateBid() {
  workersInputErrorMsgEl.textContent = "";
  // Convert from string to decimal
  const capacity = parseFloat(equipmentEl.value);
  const fullness = parseFloat(fullnessEl.value);
  // || 0 reads as: "use the parsed number, but if that failed, fall back to 0."
  const dumpWeight = parseFloat(dumpWeightEl.value) || 0;
  const laborWorkers = parseFloat(laborWorkersEl.value) || 0;
  const laborHours = parseFloat(laborHoursEl.value) || 0;
  const travelMiles = parseFloat(travelMilesEl.value) || 0;

  // Input Validation
  if (!Number.isInteger(laborWorkers)) {
    workersInputErrorMsgEl.textContent =
      "Please enter a whole number of workers";
    return;
  }

  // Calculate base price
  const volume = capacity * fullness;
  const basePrice = volume * PRICE_PER_YARD;

  console.log(`Volume: ${volume} BasePrice: $${basePrice}`);

  // Calculate dump fee
  const dumpFee = dumpWeight * DUMP_RATE;

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

  // Display the total
  console.log(`Suggested Bid: $${total.toFixed(2)}`);
  resultEl.textContent = `$${total.toFixed(2)}`;
}
