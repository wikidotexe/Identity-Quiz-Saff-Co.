const skuRolling = {
  "ANNABEL LEE": 100,
  "REMEDIA AMORIS": 100,
  "SONNET 116": 100,
  TRAUMEREI: 100,
  "AM KAMIN": 100,

  "KIE RAHA": 40,
  LOUI: 40,
  SOTB: 40,
  MALEALI: 40,
  MORFOSIA: 40,

  "RAE NIRA": 30,
  "LAS POZAS": 30,
  SOFR: 30,
  COCO: 30,
  OSTARA: 30,

  OMNIA: 20,
  "IRAI LEIMA": 20,
  MINOUET: 20,
  SAFF: 20,
  KIRITHRA: 20,

  CHNO: 10,
  ILIAD: 10,
  XOCOLATL: 10,
  SOLARIS: 10,
  TROUPE: 10,
};

function calculateResult() {
  const categories = { A: 0, B: 0, C: 0, D: 0, E: 0 };

  const q1 = document.querySelector("input[name='q1']:checked")?.value;
  const q3 = document.querySelector("input[name='q3']:checked")?.value;
  const q4 = document.querySelector("input[name='q4']:checked")?.value;
  const q5 = document.querySelector("input[name='q5']:checked")?.value;
  const q6 = document.querySelector("input[name='q6']:checked")?.value;
  const q2 = document.getElementById("q2").value;

  if (!q1 || !q3 || !q4 || !q5 || !q6) {
    Swal.fire({
      icon: "warning",
      title: "Ups!",
      text: "Please answer all required questions (Q1, Q3 – Q6).",
    });
    return;
  }

  // scoring
  categories[q1] += 1;
  categories[q3] += 1;
  categories[q4] += 2;
  categories[q5] += 2;
  categories[q6] += 2;

  // pick winner
  let winner = Object.keys(categories).reduce((a, b) => (categories[a] > categories[b] ? a : b));

  const resultData = {
    A: {
      title: "COZY & HOME",
      desc: "The feeling of coming home, wherever you are.",
      full: ["KIE RAHA", "RAE NIRA", "OMNIA", "CHNO"],
      mist: ["Remedia Amoris"],
    },
    B: {
      title: "MINIMALIST & CLEAN",
      desc: "Clear space, clear mind.",
      full: ["LOUI", "LAS POZAS", "IRAI LEIMA", "ILIAD"],
      mist: ["Sonnet 116"],
    },
    C: {
      title: "CHEERFUL & SWEET",
      desc: "Light energy, easy comfort.",
      full: ["SOTB", "SOFR", "MINOUET", "XOCOLATL"],
      mist: ["Annabel Lee"],
    },
    D: {
      title: "BOLD & DEEP",
      desc: "Quiet confidence with a lasting impression.",
      full: ["MALEALI", "COCO", "SAFF", "SOLARIS"],
      mist: ["Träumerei", "Am Kamin"],
    },
    E: {
      title: "WANDER & ARTISTIC",
      desc: "Thoughtful, reflective, and quietly creative.",
      full: ["MORFOSIA", "OSTARA", "KIRITHRA", "TROUPE"],
      mist: ["Sonnet 116"],
    },
  };

  const winnerData = resultData[winner];

  // Calculate rolling %
  const rollingList = [...winnerData.full, ...winnerData.mist].map((sku) => `${sku} (${skuRolling[sku]}%)`);

  // Display result
  document.getElementById("resultTitle").innerText = winnerData.title;
  document.getElementById("resultDesc").innerText = winnerData.desc;
  document.getElementById("fullSize").innerHTML = `<b>Full Size:</b> ${winnerData.full.join(", ")}`;
  document.getElementById("cloudMist").innerHTML = `<b>Cloud Mist:</b> ${winnerData.mist.join(", ")}`;

  // Build rolling table
  let tableHTML = `<table class="rolling-table">
    <tr>
        <th>SKU</th>
        <th>Rolling %</th>
        <th>Type</th>
    </tr>
  `;

  winnerData.full.forEach((sku) => {
    tableHTML += `
      <tr>
        <td>${sku}</td>
        <td>${skuRolling[sku]}%</td>
        <td>Full Size</td>
      </tr>
    `;
  });

  winnerData.mist.forEach((sku) => {
    tableHTML += `
      <tr>
        <td>${sku}</td>
        <td>${skuRolling[sku]}%</td>
        <td>Cloud Mist</td>
      </tr>
    `;
  });

  tableHTML += `</table>`;

  document.getElementById("rollingTable").innerHTML = tableHTML;

  document.getElementById("resultBox").style.display = "block";

  // SAVE EXPORT DATA
  window.quizExportData = {
    Q1: q1,
    Q2: q2,
    Q3: q3,
    Q4: q4,
    Q5: q5,
    Q6: q6,
    ScoreA: categories["A"],
    ScoreB: categories["B"],
    ScoreC: categories["C"],
    ScoreD: categories["D"],
    ScoreE: categories["E"],
    FinalCategory: winner,
    FinalCategoryName: winnerData.title,
    RollingList: rollingList.join(" | "),
  };

  document.getElementById("exportBtn").style.display = "block";
  document.getElementById("googleSheetsBtn").style.display = "block";

  Swal.fire({
    icon: "success",
    title: "Your Identity Category",
    html: `
      <h2>${winnerData.title}</h2>
      <p>${winnerData.desc}</p>
      <br>
      <b>Recommended SKU:</b><br>
      ${winnerData.full.join(", ")}<br>
      <i>${winnerData.mist.join(", ")}</i>
    `,
    confirmButtonText: "View Details",
  });
}

function exportCSV() {
  const data = window.quizExportData;

  if (!data) {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Finish the quiz first!",
    });
    return;
  }

  Swal.fire({
    icon: "info",
    title: "Download CSV?",
    text: "Your quiz result will be downloaded.",
    showCancelButton: true,
    confirmButtonText: "Yes, download",
  }).then((res) => {
    if (!res.isConfirmed) return;

    const headers = Object.keys(data).join(",");
    const values = Object.values(data).join(",");

    const csv = headers + "\n" + values;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz_result.csv";
    a.click();

    URL.revokeObjectURL(url);
  });
}

async function sendToGoogleSheets() {
  const data = window.quizExportData;

  if (!data) {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Finish the quiz first!",
    });
    return;
  }

  // Add timestamp
  const timestamp = new Date().toLocaleString();

  const payloadData = {
    ...data,
    Timestamp: timestamp,
  };

  try {
    // Replace with your actual Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxmZcHytVA3jZHFxd_z3smotv9n2BYFXnvdjnUdRuYHt17h4xbLrppitdt7zyrNRUTFlA/exec";

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payloadData),
    });

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Your result has been sent to Google Sheets.",
      timer: 2000,
    });
  } catch (error) {
    console.error("Error sending to Google Sheets:", error);
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Failed to send data. Please try again.",
    });
  }
}
