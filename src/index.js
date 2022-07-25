const defaultValues = {
  "url": "http://example.com/"
}

window.addEventListener("load", (e) => {
  Array.from(document.getElementsByClassName("savecontrol")).forEach((e) => {   
    e.value = localStorage.getItem(e.id) ? localStorage.getItem(e.id) : (defaultValues[e.id] !== undefined ? defaultValues[e.id] : "");
    e.addEventListener("change", (e) => {
      localStorage.setItem(e.target.id, e.target.value);
    });
  });
});

document.getElementById("base").addEventListener("dragover", (e) => {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}, false);

document.getElementById("base").addEventListener("drop", (e) => {
  e.stopPropagation();
  e.preventDefault();

  let file = e.dataTransfer.files[0];
  document.getElementById("img").src = URL.createObjectURL(file);
});

document.getElementById("url").addEventListener("change", (e) => {
  refresh();
});

document.getElementById("update").addEventListener("click", (e) => {
  refresh();
});

document.getElementById("save").addEventListener("click", async (e) => {
  refresh();
  const dl = document.createElement("a");
  const b = document.getElementById("base");
  dl.href = await domtoimage.toPng(b, {
    width: b.clientWidth,
    height: b.clientHeight
  });
  dl.download="qrimage.png";
  dl.click();
});

function refresh() {
  const url = document.getElementById("url").value;
  const qr = document.getElementById("qr");
  qr.innerHTML = "";
  new QRCode(qr, {
    text: url,
    width: document.getElementById("base").clientHeight / 5,
    height: document.getElementById("base").clientHeight / 5
  });
}