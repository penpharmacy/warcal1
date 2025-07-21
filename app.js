
document.getElementById("dose-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inr = parseFloat(document.getElementById("inr").value);
  const bleeding = document.getElementById("bleeding").value;
  const currentDose = parseFloat(document.getElementById("current-dose").value);
  const resultDiv = document.getElementById("result");

  let advice = "";
  let doseFactor = 1;

  if (bleeding === "yes") {
    advice = "หยุดยา Warfarin และให้ Vitamin K";
    doseFactor = 0;
  } else if (inr < 1.5) {
    advice = "เพิ่มขนาดยา 10–20%";
    doseFactor = 1.15;
  } else if (inr >= 1.5 && inr < 2) {
    advice = "เพิ่มขนาดยาเล็กน้อย 5–10%";
    doseFactor = 1.075;
  } else if (inr >= 2 && inr <= 3) {
    advice = "ให้ขนาดยาเดิม";
    doseFactor = 1;
  } else if (inr > 3 && inr <= 3.9) {
    advice = "ลดขนาดยา 5–10%";
    doseFactor = 0.925;
  } else if (inr >= 4 && inr <= 4.9) {
    advice = "พิจารณาหยุดยา 1 วันและลดขนาดยา";
    doseFactor = 0.8;
  } else if (inr >= 5 && inr <= 9) {
    advice = "หยุดยา 1–2 วัน และลดขนาดยา";
    doseFactor = 0.7;
  } else if (inr > 9) {
    advice = "หยุดยาและให้ Vitamin K";
    doseFactor = 0;
  }

  const newWeeklyDose = Math.round(currentDose * doseFactor);
  const dailyPlan = calculateDailyDose(newWeeklyDose);
  const percentChange = Math.round(((newWeeklyDose - currentDose) / currentDose) * 100);

  resultDiv.innerHTML = `
    <h3>คำแนะนำ: ${advice}</h3>
    <p>ขนาดยาใหม่: ${newWeeklyDose} mg/สัปดาห์ (${percentChange >= 0 ? "+" : ""}${percentChange}%)</p>
    <h4>แผนการให้ยา:</h4>
    <ul>
      ${dailyPlan.map((d, i) => `<li>วัน${["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"][i]}: ${d}</li>`).join("")}
    </ul>
  `;
});

function calculateDailyDose(totalDose) {
  const days = 7;
  const tablets = [3, 2]; // mg per tablet
  const combos = [];

  function getCombo(dose) {
    let result = [];
    let remaining = dose;
    for (let t of tablets) {
      let count = Math.floor(remaining / t);
      remaining = Math.round((remaining - count * t) * 10) / 10;
      for (let i = 0; i < count; i++) result.push(t);
    }
    if (remaining >= 1) result.push(remaining);
    return result.length ? result.join(" + ") + " mg" : "งด";
  }

  const avg = totalDose / days;
  const doses = new Array(days).fill(avg);
  const rounded = doses.map(d => Math.round(d * 2) / 2);

  return rounded.map(getCombo);
}
