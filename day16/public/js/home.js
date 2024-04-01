const canvas = new fabric.Canvas("canvas");
canvas.setWidth(800);
canvas.setHeight(600);
canvas.backgroundColor = "coral";

const tabButtons = document.querySelectorAll("aside  button");
const tabContents = document.querySelectorAll(".tab-content");
const paletteButtons = document.querySelectorAll("button[data-color]");
const downloadButton = document.getElementById("download");
const addTextButtons = document.querySelectorAll(".add-text-button");
const deleteSelectedButtons = document.querySelectorAll(".delete-selected");
const textFontSizeSelect = document.getElementById("text-font-size");

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
addTextButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const fontSize = btn.dataset.fontSize;
    const text = new fabric.IText("Default text", {
      fontSize,
      fontWeight: "bold",
      textAlign: "left",
      top: 250,
      left: 350,
      padding: 10,
    });
    canvas.add(text);
  });
});

deleteSelectedButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  });
});

textFontSizeSelect.addEventListener("change", (e) => {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set({ fontSize: e.target.value });
    canvas.renderAll();
  }
});

function handleObjectSelection(e) {
  document.querySelector(".text-controls").classList.add("open");
}

function handleSelectionClear(e) {
  document.querySelector(".text-controls").classList.remove("open");
}

canvas.on({
  "selection:created": handleObjectSelection,
  "selection:cleared": handleSelectionClear,
});
