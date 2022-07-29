const defaultValues = {
  "instagram_url": "http://example.com/",
  "instagram_zoom": 1.0,
  "instagram_xadjust": 50,
  "instagram_yadjust": 50,
  "youtube_number": 0,
  "youtube_group_name": "",
  "youtube_guest_name": "",
  "youtube_direction": "left",
  "youtube_effect": "fade",
  "youtube_zoom": 1.0,
  "youtube_xadjust": 50,
  "youtube_yadjust": 50
}


window.addEventListener("load", (e) => {
  Array.from(document.getElementsByClassName("savecontrol")).forEach((e) => {   
    e.value = localStorage.getItem(e.id) ? localStorage.getItem(e.id) : (defaultValues[e.id] !== undefined ? defaultValues[e.id] : "");
    e.addEventListener("change", (e) => {
      localStorage.setItem(e.target.id, e.target.value);
    });
  });
  refresh();
});

Array.from(document.getElementsByClassName("base")).forEach((base) => {
  base.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, false);
  base.addEventListener("drop", (e) => {
    e.stopPropagation();
    e.preventDefault();

    let file = e.dataTransfer.files[0];
    base.querySelector("img[data-role='image']").src = URL.createObjectURL(file);
  });
});

Array.from(document.getElementsByClassName("displayvalues")).forEach(v => v.addEventListener("change", refresh));

Array.from(document.querySelectorAll("#SBCast_instagram_content input[type=range]")).forEach(e => e.addEventListener("input", refreshzoom));

document.getElementById("instagram_resetpos").addEventListener("click", (e) => {
  Array.from(document.querySelectorAll("#SBCast_instagram_content input[type=range]")).forEach((e) => {
    e.value = defaultValues[e.id];
    localStorage.setItem(e.id, e.value);
  });
  refreshzoom();
});

document.querySelectorAll("button[data-role='update']").forEach(v => v.addEventListener("click", refresh));

document.getElementById("instagram_save").addEventListener("click", async (e) => {
  refresh();
  const dl = document.createElement("a");
  const b = document.getElementById("instagram_base");
  dl.href = await domtoimage.toPng(b, {
    width: b.clientWidth,
    height: b.clientHeight
  });
  dl.download="qrimage.png";
  dl.click();
});

function refreshzoom() {
  const param = {};
  ["zoom", "xadjust", "yadjust"].forEach(v => param[v] = document.getElementById(`instagram_${v}`).value);
  console.log(`translate(${param['xadjust'] * -1}%, ${param['yadjust'] * -1}%) scale(${param['zoom']})`);
  document.getElementById("instagram_img").style.transform = `translate(${param['xadjust'] * -1}%, ${param['yadjust'] * -1}%) scale(${param['zoom']})`;
}

function refresh() {
  const url = document.getElementById("instagram_url").value;
  const qr = document.getElementById("instagram_qr");
  qr.innerHTML = "";
  new QRCode(qr, {
    text: url,
    width: document.getElementById("instagram_base").clientHeight / 5,
    height: document.getElementById("instagram_base").clientHeight / 5
  });

  const no = document.getElementById("youtube_number").value;
  const group = document.getElementById("youtube_group_name").value;
  const guest = document.getElementById("youtube_guest_name").value;
  document.getElementById("youtube_d_no").textContent = `SBCast. #${('00'+no).slice(-2)}`;
  document.getElementById("youtube_d_group_name").textContent = group;
  document.getElementById("youtube_d_guest_name").textContent = guest;
}