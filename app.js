let report = {};

function calculateTax() {
  const name = document.getElementById("name").value.trim();
  const ms = parseFloat(document.getElementById("salary").value);
  const jm = parseInt(document.getElementById("joining").value);
  if (!name || isNaN(ms) || ms <= 0) return alert("Enter valid inputs");

  const months = 7 - jm + (jm <= 6 ? 0 : 12);
  const annual = ms * months;

  let tax = 0;
  if (annual <= 600000) tax = 0;
  else if (annual <= 1200000) tax = (annual - 600000) * 0.01;
  else if (annual <= 2200000) tax = 6000 + (annual - 1200000) * 0.11;
  else if (annual <= 3200000) tax = 116000 + (annual - 2200000) * 0.23;
  else if (annual <= 4100000) tax = 346000 + (annual - 3200000) * 0.3;
  else tax = 616000 + (annual - 4100000) * 0.35;

  const monthlyTax = tax / months;
  const monthlySalaryAfterTax = ms - monthlyTax;

  report = {
    name,
    ms,
    jm,
    months,
    annual,
    tax,
    monthlyTax,
    monthlySalaryAfterTax,
  };

  document.getElementById("resultArea").innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Monthly Salary:</strong> Rs. ${ms.toLocaleString()}</p>
    <p><strong>Joining Month:</strong> ${getMonth(jm)}</p>
    <p><strong>Months Worked:</strong> ${months}</p>
    <p><strong>Annual Salary:</strong> Rs. ${annual.toLocaleString()}</p>
    <p><strong>Total Tax:</strong> Rs. ${tax.toFixed(2).toLocaleString()}</p>
    <p><strong>Monthly Tax Deduction:</strong> Rs. ${monthlyTax
      .toFixed(2)
      .toLocaleString()}</p>
    <p><strong>Monthly Salary After Tax:</strong> Rs. ${monthlySalaryAfterTax
      .toFixed(2)
      .toLocaleString()}</p>
  `;
  document.getElementById("output").style.display = "block";
  document.getElementById("msg").innerText = "";
}

function getMonth(m) {
  return [
    "",
    "January 2026",
    "February 2026",
    "March 2026",
    "April 2026",
    "May 2026",
    "June 2026",
    "July 2025",
    "August 2025",
    "September 2025",
    "October 2025",
    "November 2025",
    "December 2025",
  ][m];
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  try {
    const r = report;
    doc.setFontSize(16);
    doc.text(`Tax Report – ${r.name}`, 20, 20);
    let y = 40;
    doc.setFontSize(12);
    doc.text(`Name: ${r.name}`, 20, y);
    y += 10;
    doc.text(`Monthly Salary: Rs. ${r.ms.toLocaleString()}`, 20, y);
    y += 10;
    doc.text(`Joining Month: ${getMonth(r.jm)}`, 20, y);
    y += 10;
    doc.text(`Months Worked: ${r.months}`, 20, y);
    y += 10;
    doc.text(`Annual Salary: Rs. ${r.annual.toLocaleString()}`, 20, y);
    y += 10;
    doc.text(`Total Tax: Rs. ${r.tax.toFixed(2).toLocaleString()}`, 20, y);
    y += 10;
    doc.text(
      `Monthly Tax Deduction: Rs. ${r.monthlyTax.toFixed(2).toLocaleString()}`,
      20,
      y
    );
    y += 10;
    doc.text(
      `Monthly Salary After Tax: Rs. ${r.monthlySalaryAfterTax
        .toFixed(2)
        .toLocaleString()}`,
      20,
      y
    );
    y += 20;

    doc.setTextColor("#0077b5");
    doc.textWithLink("Made by Okasha Ahmed ", 17, y, {
      url: "https://www.linkedin.com/in/okasha-ahmed-066380366/",
    });

    const fileName = `Tax_Report_${r.name.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
    document.getElementById("msg").innerText = "✅ PDF downloaded";
  } catch (e) {
    alert("❌ Error generating PDF.");
    console.error(e);
  }
}

function exportExcel() {
  const r = report;
  const wb = XLSX.utils.book_new();
  const data = [
    ["Field", "Value", "Formula"],
    ["Name", r.name, ""],
    ["Monthly Salary", r.ms, ""],
    ["Joining Month", getMonth(r.jm), ""],
    ["Months Worked", r.months, ""],
    ["Annual Salary", r.annual, `=B2*B4`],
    ["Total Tax", r.tax, ""],
    ["Monthly Tax Deduction", r.monthlyTax, `=B6/B4`],
    ["Monthly Salary After Tax", r.monthlySalaryAfterTax, `=B2-B7`],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "TaxReport");
  XLSX.writeFile(wb, "Tax_Report.xlsx");
  document.getElementById("msg").innerText = "✅ Excel downloaded";
}

function sendByEmail() {
  const r = report;
  const body = `
Name: ${r.name}
Monthly Salary: Rs. ${r.ms.toLocaleString()}
Joining Month: ${getMonth(r.jm)}
Months Worked: ${r.months}
Annual Salary: Rs. ${r.annual.toLocaleString()}
Total Tax: Rs. ${r.tax.toFixed(2).toLocaleString()}
Monthly Tax Deduction: Rs. ${r.monthlyTax.toFixed(2).toLocaleString()}
Monthly Salary After Tax: Rs. ${r.monthlySalaryAfterTax
    .toFixed(2)
    .toLocaleString()}

Made by Okasha Ahmed –https://www.linkedin.com/in/okasha-ahmed-066380366/
  `;
  window.location.href = `mailto:?subject=Tax Report for ${
    r.name
  }&body=${encodeURIComponent(body)}`;
}