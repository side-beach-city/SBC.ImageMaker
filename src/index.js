const defaultValues = {
  "instagram_url": "http://example.com/",
  "instagram_zoom": 1.0,
  "instagram_xadjust": 50,
  "instagram_yadjust": 50,
  "youtube_number": 0,
  "youtube_group_name": "",
  "youtube_guest_name": "",
  "youtube_direction": "left",
  "youtube_background": "none",
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

    const url= URL.createObjectURL(e.dataTransfer.files[0]);
    if(base.querySelector("div[data-role='background']")){
      base.querySelector("div[data-role='background']").style.backgroundImage = `url(${url})`;
    }
    base.querySelector("img[data-role='image']").src = url
  });
});

Array.from(document.getElementsByClassName("displayvalues")).forEach(v => v.addEventListener("change", refresh));

Array.from(document.querySelectorAll("input[type=range]")).forEach(e => e.addEventListener("input", refreshzoom));

document.querySelectorAll("button[data-role='resetpos']").forEach(v => v.addEventListener("click", async (e) => {
  const base = getBaseNode(e.target);
  Array.from(base.querySelectorAll("input[type=range]")).forEach((e) => {
    e.value = defaultValues[e.id];
    localStorage.setItem(e.id, e.value);
  });
  refreshzoom(e);
}));

document.querySelectorAll("button[data-role='update']").forEach(v => v.addEventListener("click", refresh));

document.querySelectorAll("button[data-role='saveimage']").forEach(v => v.addEventListener("click", async (e) => {
  refresh();
  const base = getBaseNode(e.target);
  const imgbase = base.querySelector(".base");
  const dl = document.createElement("a");
  dl.href = await domtoimage.toPng(imgbase, {
    width: imgbase.clientWidth,
    height: imgbase.clientHeight
  });
  dl.download=base.dataset.savename;
  dl.click();
}));

function refreshzoom(e) {
  const base = getBaseNode(e.target);
  const param = {};
  ["zoom", "xadjust", "yadjust"].forEach(v => param[v] = base.querySelector(`input[id$=${v}`).value);
  base.querySelector("img[data-role='image']").style.transform = `translate(${param['xadjust'] * -1}%, ${param['yadjust'] * -1}%) scale(${param['zoom']})`;
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
  const direction = document.getElementById("youtube_direction").value == 'left';
  let shadow = "";
  let backop = "";
  switch (document.getElementById("youtube_effect").value) {
    case "fade":
      shadow = `${124 * (direction ? 1 : -1)}px 0px 53px white`;
      break;
    default:
      break;
  }
  switch (document.getElementById("youtube_background").value) {
    case "thin":
      backop = "0.8";
      break;
    case "strong":
      backop = "0.4";
      break;
    default:
      break;
  }
  document.getElementById("youtube_episodenames").style.boxShadow = shadow;
  document.getElementById("youtube_base").style.flexDirection = direction ? "row" : "row-reverse";
  document.getElementById("youtube_img_filter").style.opacity = backop;
  document.getElementById("youtube_d_no").textContent = `SBCast. #${('00'+no).slice(-2)}`;
  document.getElementById("youtube_d_group_name").textContent = group;
  document.getElementById("youtube_d_guest_name").textContent = guest;
}

function getBaseNode(node) {
  let base = node;
  while(base.className != "tab_content") base = base.parentNode;
  return base;
}