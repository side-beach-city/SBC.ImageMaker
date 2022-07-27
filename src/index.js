const defaultValues = {
  "url": "http://example.com/",
  "zoom": 1.0,
  "xadjust": 50,
  "yadjust": 50
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

Array.from(document.querySelectorAll("input[type=range]")).forEach(e => e.addEventListener("input", refreshzoom));

document.getElementById("resetpos").addEventListener("click", (e) => {
  Array.from(document.querySelectorAll("input[type=range]")).forEach((e) => {
    e.value = defaultValues[e.id];
    localStorage.setItem(e.id, e.value);
  });
  refreshzoom();
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

function refreshzoom() {
  const param = {};
  ["zoom", "xadjust", "yadjust"].forEach(v => param[v] = document.getElementById(v).value);
  console.log(`translate(${param['xadjust'] * -1}%, ${param['yadjust'] * -1}%) scale(${param['zoom']})`);
  document.getElementById("img").style.transform = `translate(${param['xadjust'] * -1}%, ${param['yadjust'] * -1}%) scale(${param['zoom']})`;
}

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