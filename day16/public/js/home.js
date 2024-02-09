const canvas = new fabric.Canvas("canvas");
canvas.setWidth(800);
canvas.setHeight(600);

const tabButtons = document.querySelectorAll("aside  button");
const tabContents = document.querySelectorAll(".tab-content");
const paletteButtons = document.querySelectorAll("button[data-color]");
const downloadButton = document.getElementById("download");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    tabButtons.forEach((b) => b.classList.remove("open"));
    tabContents.forEach((t) => t.classList.remove("open"));

    btn.classList.add("open");
    document.getElementById(btn.dataset.tabTarget).classList.add("open");
  });
});

paletteButtons.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    canvas.backgroundColor = btn.dataset.color;
    canvas.renderAll();
  })
);

function downloadCanvas() {
  var dataURL = canvas.toDataURL({
    format: "png",
    quality: 1,
  });

  // Create a temporary link element
  var link = document.createElement("a");
  link.download = "canvas_image.png";
  link.href = dataURL;

  // Trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
}

downloadButton.addEventListener("click", downloadCanvas);
