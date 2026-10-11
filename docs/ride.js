// Cycling demo: static content, optional device-local photos, no remote service.
const rideStops = [
  { name: '七股遊客中心', short: '出發', type: '出發準備', title: '先補給，\n再騎進漁村。', photo: 'ride-start.jpg', caption: '七股遊客中心｜參考照片' },
  { name: '龍山漁港', short: '漁港', type: '主要活動 01', title: '停下來，\n讀懂漁港日常。', photo: 'ride-port.jpg', caption: '龍山漁港｜參考照片' },
  { name: '龍山社區', short: '社區', type: '主要活動 02', title: '串起蚵殼，\n帶走漁村記憶。', photo: 'ride-community.jpg', caption: '龍山蚵殼體驗｜活動參考照片' },
  { name: '魚塭道路', short: '魚塭', type: '選配延伸・途經點', title: '水車轉動的，\n一分鐘故事。' },
  { name: '六孔遊客中心', short: '六孔', type: '選配延伸・終點', title: '收好這段發現，\n接上下一段旅程。', photo: 'start.jpg', caption: '六孔碼頭｜參考照片' }
];
const rideExamples = {
  'ride-start': { src: 'assets/ride-start.jpg', label: '七股遊客中心參考照' },
  'ride-port': { src: 'assets/ride-port.jpg', label: '龍山漁港參考照' },
  'ride-shell': { src: 'assets/ride-shell-example.svg', label: '迷你蚵殼作品示意圖' },
  'ride-end': { src: 'assets/start.jpg', label: '六孔碼頭參考照' }
};
const rideStories = {
  port: {
    title: '從一口水堀，到漁村港口',
    paragraphs: [
      '龍山漁港的原址，是龍山宮前的一處水堀。這裡曾被規劃作為儲存飲用水的地方，後來才疏濬、闢建為漁港。',
      '今天停下單車，從開放的位置看看船隻、碼頭和繫纜設施。船怎麼停穩？人從哪裡上下船？一個小線索，就能開始理解漁港的日常。',
      '觀察不需要靠近作業區。看不清楚也可以留下紀錄，把空間留給正在工作的居民。'
    ],
    source: 'https://www.tjnp.gov.tw/ch/sglarticle/longshan-village', sourceLabel: '台江國家公園・龍山社區'
  },
  shell: {
    title: '一片蚵殼，也是新生命的起點',
    paragraphs: [
      '龍山社區的養蚵生活，讓蚵殼不只是吃完後留下的殼。整理過的蚵殼，可以成為蚵苗附著的基礎。',
      '把幾片殼串起來，先認識蚵串的樣子，再想想：蚵苗需要一個能依附的地方，而蚵殼正是這個起點。',
      '這次做的是紀念作品。它不是可直接投入養殖的設備，也不需要放回魚塭或水域。'
    ],
    source: 'https://www.tjnp.gov.tw/ch/titlelist/feature-stories/2311', sourceLabel: '台江國家公園・漁村故事'
  },
  pond: {
    title: '魚塭水車，為什麼一直轉？',
    paragraphs: [
      '魚塭裡轉動的水車，在忙什麼？先把單車停在安全、不擋路的位置，再看看它推動水面的樣子。',
      '水中的魚蝦也需要氧氣。水車打水，是增加水中溶氧的方法之一；照顧水質，也是養殖的重要工作。',
      '隔著堤岸，不一定看得出這一池養什麼。看看水面、聽聽水聲，就能留下自己的發現。',
      '讀完或聽完，直接繼續。這裡不設集章任務，也不進入私人魚塭。'
    ],
    source: 'https://www.tfrin.gov.tw/theme_data.php?id=945&sub_theme=special_message&theme=book_data', sourceLabel: '水產試驗所・養殖魚塭溶氧與氣候變動'
  }
};
const shellSteps = [
  { title: '穿過第一片殼', text: '使用已清洗、消毒、鑽孔的蚵殼。戴上手套，將棉繩穿過第一片殼的孔洞。', icon: 'thread' },
  { title: '加上一個間隔', text: '依材料包說明放入間隔材料，讓相鄰蚵殼保留一點距離。', icon: 'spacer' },
  { title: '重複串起 3–5 片', text: '依序穿殼、加入間隔。慢慢串好一小串，留意殼緣，避免用力拉扯。', icon: 'repeat' },
  { title: '打結，收好作品', text: '依材料包說明固定繩端。作品帶回家作紀念；社區共創展示方式仍待確認。', icon: 'finish' }
];
let shellStepIndex = 0;
let rideNarration = null;

function rideProgress() {
  return [1, 2].filter(index => journey.ride.includes(index)).length;
}

function ridePrepare(view, label) {
  rememberDraft();
  stopRideNarration();
  revokeUnder(c);
  currentView = view;
  headerView(label);
  document.querySelector('.app').classList.add('ride-mode');
}

function rideRail(active = -1) {
  return `<nav class="ride-rail" aria-label="騎乘五站">${rideStops.map((stop, index) => `
    <button class="ride-stop ${active === index ? 'is-current' : ''} ${journey.ride.includes(index) ? 'is-done' : ''} ${index > 2 ? 'is-extension' : ''}"
      onclick="rideStation(${index})" ${active === index ? 'aria-current="step"' : ''}>
      <span class="ride-stop-number">${journey.ride.includes(index) ? '✓' : String(index + 1).padStart(2, '0')}</span>
      <span class="ride-stop-name">${stop.name.replace('遊客中心','<br>遊客<br>中心').replace('龍山','龍山<br>').replace('魚塭','魚塭<br>')}</span>
    </button>`).join('')}</nav>`;
}

function rideMap() {
  return `<div class="ride-map" role="img" aria-label="路線示意：七股遊客中心到龍山漁港、龍山社區為基本線，再經魚塭道路延伸到六孔遊客中心。非導航地圖。">
    <svg viewBox="0 0 360 210" aria-hidden="true">
      <defs><pattern id="pond-grid" width="42" height="32" patternUnits="userSpaceOnUse"><rect x="4" y="4" width="34" height="24" fill="none" stroke="#a7bcaa" stroke-opacity=".15"/></pattern></defs>
      <rect width="360" height="210" fill="url(#pond-grid)"/>
      <path d="M0 165 Q55 130 30 90 T70 0" fill="none" stroke="#769f97" stroke-opacity=".2" stroke-width="45"/>
      <path d="M106 37 L224 80 L245 127" fill="none" stroke="#c9ff3d" stroke-width="3"/>
      <path d="M245 127 L162 165 L62 160" fill="none" stroke="#94a77e" stroke-width="3" stroke-dasharray="6 6"/>
      ${[[106,37],[224,80],[245,127],[162,165],[62,160]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="11" fill="${i<3?'#c9ff3d':'#273023'}" stroke="#c9ff3d"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="${i<3?'#101312':'#c9ff3d'}" font-size="11" font-weight="800">${i+1}</text>`).join('')}
      <g fill="#f2efe5" font-size="11" font-family="sans-serif"><text x="121" y="34">七股遊客中心</text><text x="237" y="70">龍山漁港</text><text x="256" y="133">龍山社區</text><text x="150" y="191">魚塭道路</text><text x="16" y="188">六孔遊客中心</text></g>
      <text x="17" y="22" fill="#a9b59e" font-size="9" letter-spacing="2">QIGU / ROUTE SKETCH</text>
    </svg><div class="map-legend"><span>━ 龍山基本線</span><span>┄ 六孔延伸線</span></div>
    <p class="small">站點關係示意，非導航地圖；道路與停留位置待場勘。</p></div>`;
}

function rideOverview() {
  ridePrepare('ride-overview', '騎乘總覽');
  c.innerHTML = `<section class="ride-page">
    <p class="eyebrow">02 / RIDE INTO THE VILLAGE</p>
    <h1>騎進漁村，<br><span class="ride-accent">把故事帶走。</span></h1>
    <p class="sub">從漁港日常到一串蚵殼。照自己的節奏，選擇今天想走多遠。</p>
    ${rideRail()}${rideMap()}
    <div class="ride-route-options">
      <div class="ride-route-option"><span class="ride-tag">基本線</span><h2>到龍山，完成兩個活動</h2><p>七股遊客中心 → 龍山漁港 → 龍山社區</p><small>漁港觀察＋蚵殼手作，即可收集漁村章。</small></div>
      <div class="ride-route-option extension"><span class="ride-tag muted">選配延伸</span><h2>有餘裕，再騎到六孔</h2><p>龍山社區 → 魚塭道路 → 六孔遊客中心</p><small>魚塭故事自由閱讀；延伸不影響基本線集章。</small></div>
    </div>
    <div class="ride-progress"><span>主要活動</span><strong>${rideProgress()}<small> / 2</small></strong><span>${hasStamp('ride') ? '✓ 漁村章已收集' : '依自己的節奏完成'}</span></div>
    <button class="primary" onclick="rideStation(0)">從七股遊客中心出發 ↗</button>
    <details class="ride-directory"><summary>直接探索五個站點</summary>${rideStops.map((stop,index)=>`<button onclick="rideStation(${index})"><span>0${index+1}</span><b>${stop.name}</b><small>${index>2?'選配延伸':'基本線'}</small><span>↗</span></button>`).join('')}</details>
    <button class="ride-text-button" onclick="rideReturnInfo()">查看回程與接駁規劃 →</button>
    <p class="note">自助探索提案。材料包、租還車及接駁合作待確認；騎乘時收妥手機，停妥後再操作。</p>
    <button class="secondary" onclick="home()">回到走・騎・划</button>
  </section>`;
  window.scrollTo(0, 0);
}

function rideHero(index) {
  const stop = rideStops[index];
  if (!stop.photo) return `<div class="pond-scene" role="img" aria-label="魚塭水車插畫示意"><svg viewBox="0 0 360 165" aria-hidden="true"><path d="M0 40 L360 25 M0 100 L360 85 M0 158 L360 143 M70 0 L92 165 M250 0 L272 165" stroke="#8da899" stroke-opacity=".25" stroke-width="3"/><g fill="none" stroke="#c9ff3d" stroke-width="2"><circle cx="195" cy="87" r="36"/><circle cx="195" cy="87" r="6"/>${Array.from({length:8},(_,n)=>`<path d="M195 81 L195 43 L211 43" transform="rotate(${n*45} 195 87)"/>`).join('')}<path d="M110 137 Q123 126 135 137 T160 137 M229 132 Q242 121 254 132 T279 132"/></g></svg><span>魚塭水車｜地景示意</span></div>`;
  return `<figure class="ride-hero"><img src="assets/${stop.photo}" alt="${stop.caption}" ${index>0?'loading="lazy"':''}><figcaption>${stop.caption}</figcaption></figure>`;
}

function rideStation(index) {
  if (!Number.isInteger(index) || index < 0 || index >= rideStops.length) return;
  ridePrepare('ride', '騎乘旅程');
  landIndex = index;
  const stop = rideStops[index];
  c.innerHTML = `<section class="ride-page">
    <div class="ride-page-top"><button class="ride-text-button" onclick="rideOverview()">← 路線總覽</button><span class="ride-tag ${index>2?'muted':''}">${stop.type}</span></div>
    ${rideRail(index)}
    <div class="ride-station-heading"><span>0${index+1}</span><h2>${stop.name}</h2></div>
    <h1>${stop.title.replace('\n','<br>')}</h1>${rideHero(index)}
    ${[rideStartContent,ridePortContent,rideShellContent,ridePondContent,rideEndContent][index]()}
    <footer class="ride-page-footer"><button class="ride-text-button" onclick="rideOverview()">五站總覽</button>${index<4?`<button class="ride-text-button" onclick="rideStation(${index+1})">${index===2?'探索選配延伸':'下一站'} →</button>`:''}</footer>
    <p class="note">騎乘時收妥手機，安全停車後再閱讀。路線與合作服務仍待確認。</p>
  </section>`;
  window.scrollTo(0, 0);
  if (index !== 3) renderPhotos(land.ride[index][4]);
}

function rideStartContent() {
  const checks = ['已檢查車況與安全帽', '已補水、如廁，了解回程方式'];
  return `<div class="card ride-card"><p class="ride-kicker">BEFORE YOU RIDE</p><h2>花一分鐘，準備好出發</h2><p class="sub">先補給，再確認今天的基本線或延伸線。</p>${checks.map((label,index)=>`<label class="check"><input type="checkbox" ${journey.notes['check'+index]?'checked':''} onchange="rideSetCheck(${index},this.checked)">${label}</label>`).join('')}<button class="primary" id="ride-start-button" ${journey.notes.check0&&journey.notes.check1?'':'disabled'} onclick="rideCompleteStation(0)">${journey.ride.includes(0)?'準備已完成・前往漁港':'準備好了・前往漁港'}</button></div>
    <details class="ride-details"><summary>租還車與回程資訊</summary><p>租車據點、還車位置與可借車型仍待確認。基本線可在龍山結束，回程與車輛回收需事前安排。</p><button class="ride-text-button" onclick="rideReturnInfo()">查看回程規劃 →</button></details>
    ${ridePhotos(0)}`;
}

function rideSetCheck(index, checked) {
  journey.notes['check'+index] = checked;
  saveJourney();
  document.getElementById('ride-start-button').disabled = !(journey.notes.check0 && journey.notes.check1);
}

function rideScanButton(index) {
  return `<button class="ride-scan-button" onclick="rideScan(${index})">⌗ ${journey.notes[land.ride[index][4]+'-scan']?'再看本站 QR 示範':'模擬掃碼・開啟本站'} <span>↗</span></button>`;
}

function ridePortContent() {
  const choices = ['停泊船隻', '繫纜設施', '碼頭通道', '看不清楚'];
  return `${rideScanButton(1)}${rideStoryCard('port')}
    <div class="card ride-card"><p class="ride-kicker">LOOK / NOTICE / REMEMBER</p><h2>選一個，讓你停下來的線索</h2><p class="sub">${journey.mode==='solo'?'你注意到':'和夥伴看看'}船怎麼停穩、居民從哪裡上下船？從開放區域觀察就好。</p><div class="ride-choices">${choices.map(choice=>`<button class="${journey.notes['ride-port-choice']===choice?'selected':''}" aria-pressed="${journey.notes['ride-port-choice']===choice}" onclick="rideChoosePort('${choice}')">${choice}</button>`).join('')}</div>${rideNote('ride-port','想記住的漁港發現（選填）')}
    <button class="primary" onclick="rideCompleteStation(1)">${journey.ride.includes(1)?'✓ 漁港觀察已完成':'完成漁港觀察'}</button><p class="small">請先選一項線索。照片與掃碼示範皆為選用，不會辨識照片。</p></div>${ridePhotos(1)}`;
}

function rideChoosePort(choice) {
  journey.notes['ride-port-choice'] = choice;
  saveJourney();
  document.querySelectorAll('.ride-choices button').forEach(button => {
    const selected = button.textContent === choice;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function rideNote(id, label) {
  return `<label class="ride-note-label" for="ride-note-${id}">${label}</label><textarea id="ride-note-${id}" oninput="journey.notes['${id}']=this.value;saveJourney()" placeholder="留下一句今天的發現……">${escapeText(journey.notes[id]||'')}</textarea>`;
}

function shellDiagram(step) {
  const count = step < 2 ? 1 : 4;
  return `<svg class="shell-diagram" viewBox="0 0 300 125" role="img" aria-label="${shellSteps[step].title}圖解示意"><path d="M30 60 H270" stroke="#89936f" stroke-width="3"/>${Array.from({length:count},(_,index)=>{const x=count===1?150:60+index*60;return `<g transform="translate(${x} 62)"><path d="M-22-12 Q-15-35 9-28 Q28-12 22 14 Q13 31-11 23 Q-29 11-22-12Z" fill="#f2efe5" stroke="#415b46" stroke-width="2"/><path d="M-15-7 Q-8-24 8-19 M-16 3 Q-3-16 14-9 M-9 15 Q2-2 15 3" fill="none" stroke="#a4b098"/><circle cy="-7" r="3" fill="#101312"/>${step>0?'<rect x="28" y="-9" width="10" height="14" fill="#c9ff3d" stroke="#415b46"/>':''}</g>`}).join('')}${step===3?'<path d="M268 53 l10 14 m-10 0 l10-14" stroke="#415b46" stroke-width="3"/>':''}</svg>`;
}

function rideShellContent() {
  return `${rideScanButton(2)}
    <details class="ride-details material-details"><summary><span>自助材料包</span><small>規劃中・合作待確認</small></summary><p>預處理蚵殼 3–5 片、棉繩、間隔材料與手套。領取據點、供應時段及補充方式尚未洽定，請以後續公告為準。</p><p>不自行撿拾未處理蚵殼，也不在現場鑽孔。</p></details>
    <div class="card ride-card"><p class="ride-kicker">MAKE A LITTLE MEMORY</p><h2>跟著四步，串起一片蚵田</h2><div id="shell-step">${rideShellStep()}</div><div class="shell-step-controls"><button class="secondary" id="shell-prev" onclick="rideMoveShellStep(-1)" ${shellStepIndex===0?'disabled':''}>← 上一步</button><button class="primary" id="shell-next" onclick="rideMoveShellStep(1)" ${shellStepIndex===3?'disabled':''}>下一步 →</button></div><p class="small">圖解為體驗示意，實作依確認後的材料包說明。</p></div>
    ${rideStoryCard('shell')}${ridePhotos(2)}
    <div class="card ride-card"><h2>把這串作品，收進旅程</h2>${rideNote('ride-shell','作品的小故事（選填）')}<button class="primary" onclick="rideCompleteStation(2)">${journey.ride.includes(2)?'✓ 手作已完成・查看漁村卡':'完成手作・收集漁村章'}</button><p class="small">完成紀錄由你自行確認；不強制拍照，不驗證實際活動。</p></div>
    <div class="ride-next-choice"><p class="ride-kicker">YOUR NEXT CHAPTER</p><h2>在龍山休息，再選下一段</h2><button class="primary" onclick="rideStation(3)">繼續探索魚塭與六孔 →</button><button class="secondary" onclick="rideReturnInfo()">在龍山結束・查看回程</button></div>`;
}

function rideShellStep() {
  const step = shellSteps[shellStepIndex];
  return `<div class="shell-step-label"><span>STEP 0${shellStepIndex+1}</span><small>${shellStepIndex+1} / 4</small></div>${shellDiagram(shellStepIndex)}<h3>${step.title}</h3><p class="sub">${step.text}</p><div class="shell-step-dots" aria-label="手作步驟">${shellSteps.map((s,index)=>`<button class="${index===shellStepIndex?'active':''}" onclick="rideSetShellStep(${index})" aria-label="第 ${index+1} 步：${s.title}" ${index===shellStepIndex?'aria-current="step"':''}>${index+1}</button>`).join('')}</div>`;
}

function rideMoveShellStep(delta) { rideSetShellStep(shellStepIndex + delta); }
function rideSetShellStep(index) {
  shellStepIndex = Math.max(0, Math.min(3, index));
  document.getElementById('shell-step').innerHTML = rideShellStep();
  document.getElementById('shell-prev').disabled = shellStepIndex === 0;
  document.getElementById('shell-next').disabled = shellStepIndex === 3;
}

function rideStoryCard(type) {
  const story = rideStories[type];
  return `<article class="card ride-card ride-story"><p class="ride-kicker">${type==='pond'?'ONE MINUTE / 魚塭故事':'LOCAL STORY / 地方故事'}</p><h2>${story.title}</h2>${story.paragraphs.map(paragraph=>`<p>${paragraph}</p>`).join('')}<button class="secondary" id="ride-listen-${type}" onclick="rideListen('${type}')" aria-pressed="false">▶ 聽故事・裝置朗讀</button><p class="small" id="ride-audio-status" aria-live="polite">可直接閱讀；朗讀聲音與速度依裝置而異。</p><a class="ride-source" href="${story.source}" target="_blank" rel="noopener noreferrer">內容參考：${story.sourceLabel} ↗</a></article>`;
}

function ridePondContent() {
  return `<div class="ride-passing"><span>途經點</span><p>停妥後再閱讀，聽完就能繼續。<br>不用掃碼、答題或拍照。</p></div>${rideStoryCard('pond')}<button class="primary" onclick="rideStation(4)">繼續前往六孔 →</button>`;
}

function rideEndContent() {
  return `<div class="card ride-card"><p class="ride-kicker">THE OPTIONAL FINISH</p><h2>延伸到六孔，也留下紀錄</h2><p class="sub">抵達後依確認的停車與集合安排收好單車。完成延伸不影響龍山基本線的漁村章。</p>${rideNote('ride-end','這段騎乘，最想記住什麼？（選填）')}<button class="primary" onclick="rideCompleteStation(4)">${journey.ride.includes(4)?'✓ 延伸完成・回到總覽':'完成延伸・儲存紀錄'}</button><button class="secondary" onclick="rideReturnInfo()">查看回程與車輛回收規劃</button></div>${ridePhotos(4)}
    <div class="ride-next-choice"><p class="ride-kicker">03 / PADDLE INTO THE LAGOON</p><h2>下一段，划進潟湖</h2><p>已有安排的旅客，可接上划行報到。水域場地、專業團隊與時段仍待確認，不能直接到場下水。</p><button class="primary" onclick="enterJourney('paddle')">預覽划行體驗 →</button></div>`;
}

function ridePhotos(index) {
  const id = land.ride[index][4];
  const example = rideExamples[id];
  return `<div class="card ride-card ride-photo-card"><p class="ride-kicker">A MEMORY TO KEEP / 選用</p><h2>${index===2?'作品範例與你的照片':'參考畫面與你的照片'}</h2><figure class="ride-example"><img src="${example.src}" alt="${example.label}" loading="lazy"><figcaption>${example.label}・非旅客實際紀錄</figcaption></figure><button class="secondary" onclick="rideUseExample(${index})" id="ride-example-${index}">${journey.notes[id+'-sample']?'✓ 範例已加入紀錄':'使用範例圖片展示'}</button><div class="photo-controls"><label class="capture-button">＋ 拍照<input type="file" accept="image/*" capture="environment" onchange="capturePhoto(this,'${id}')"></label><label class="capture-button outline">選照片<input type="file" accept="image/*" onchange="capturePhoto(this,'${id}')"></label></div><div id="photos-${id}" class="photo-strip" aria-live="polite"></div><p class="small">照片選填，只保存在此瀏覽器；不會上傳。選照片不會取代範例。</p></div>`;
}

function rideUseExample(index) {
  const id = land.ride[index][4];
  journey.notes[id+'-sample'] = true;
  saveJourney();
  document.getElementById('ride-example-'+index).textContent = '✓ 範例已加入紀錄';
  toast('範例圖片已加入，仍可自行選照片');
}

function rideScan(index) {
  open(`<p class="eyebrow">QR / STATION PREVIEW</p><h2>${rideStops[index].name}</h2><div class="scanbox">⌗</div><p>到站掃碼入口示範。實際旅程可由現場 QR Code 開啟本站內容。</p><p class="small">此處不啟動相機、不驗證位置，也不影響完成紀錄。</p><button class="primary" onclick="rideMarkScanned(${index})">模擬掃描・回到本站</button><button class="secondary" onclick="closeModal()">返回</button>`);
}

function rideMarkScanned(index) {
  journey.notes[land.ride[index][4]+'-scan'] = true;
  saveJourney();
  closeModal();
  const button = document.querySelector('.ride-scan-button');
  if (button) button.innerHTML = '⌗ 再看本站 QR 示範 <span>↗</span>';
}

function rideCompleteStation(index) {
  if (index === 3) { rideStation(4); return; }
  if (index === 0 && !(journey.notes.check0 && journey.notes.check1)) { toast('先確認車況、補水與回程方式'); return; }
  if (index === 1 && !journey.notes['ride-port-choice']) { toast('選一個漁港線索，看不清楚也可以'); return; }
  if (!journey.ride.includes(index)) journey.ride.push(index);
  journey.ride.sort((a,b)=>a-b);
  if (index === 4) journey.extension = true;
  saveJourney();
  if (index === 0) { rideStation(1); return; }
  if (index === 1 || index === 2) { rideStation(index); rideMemoryCard(); return; }
  rideOverview();
  toast('六孔延伸紀錄已保存');
}

async function rideMemoryCard() {
  const earned = hasStamp('ride');
  const id = 'ride-shell';
  open(`<p class="eyebrow">VILLAGE / YOUR MEMORY CARD</p><h2>${earned?'漁村章，收進旅程。':'已完成 '+rideProgress()+' / 2 個主要活動'}</h2><div class="ride-memory-card"><div class="ride-memory-head"><span>七三二十一 / RIDE</span><b>${earned?'✓ 漁村章':'探索中'}</b></div><img id="ride-memory-photo" src="${rideExamples[id].src}" alt="迷你蚵殼作品示意圖"><p id="ride-memory-caption">範例作品示意・非實際活動紀錄</p><h3>${escapeText(journey.name||'七股探索者')}</h3><p>${escapeText(journey.notes[id]||'從漁港日常，到一串想帶走的蚵殼。')}</p><small>原型探索卡｜由旅客自行確認完成</small></div><p>${earned?'龍山基本線已完成；可以休息回程，或自由預覽六孔延伸。':'完成龍山漁港觀察與龍山社區手作，即可收集漁村章。'}</p><button class="primary" onclick="closeModal();${earned?'rideOverview()':journey.ride.includes(1)?'rideStation(2)':'rideStation(1)'}">${earned?'回到騎乘總覽':'前往另一個主要活動'}</button><button class="secondary" onclick="closeModal()">回到本站</button>`);
  const image = document.getElementById('ride-memory-photo');
  try {
    const photos = (await allPhotos()).filter(photo => photo.station === id);
    if (image.isConnected && photos.length) {
      const photo = photos[photos.length-1];
      image.src = URL.createObjectURL(photo.blob);
      image.dataset.localPhoto = photo.id;
      image.alt = '你的蚵殼作品照片';
      document.getElementById('ride-memory-caption').textContent = '你的照片・僅保存在此瀏覽器';
    }
  } catch(e) { /* The built-in example works without photo storage. */ }
}

function rideReturnInfo() {
  open(`<p class="eyebrow">RETURN / PLAN BEFORE DEPARTURE</p><h2>選好路線，也安排好回程。</h2><div class="card"><h2>龍山基本線</h2><p>可在龍山社區休息、結束騎乘。返回出發點及車輛回收方式，需在出發前確認。</p></div><div class="card"><h2>六孔延伸線</h2><p>延伸到六孔前，先確認體力、天候，以及六孔的停車、接駁與車輛回收安排。</p></div><p class="small">合作業者、服務時段、費用與聯絡方式仍待確認。此 demo 不提供接駁預約或付款，也不依賴六孔 YouBike 還車。</p><button class="primary" onclick="closeModal()">我了解・回到旅程</button>`);
}

function stopRideNarration() {
  if (rideNarration && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  rideNarration = null;
}

function rideListen(type) {
  const button = document.getElementById('ride-listen-'+type);
  const status = document.getElementById('ride-audio-status');
  if (rideNarration) {
    stopRideNarration();
    button.textContent = '▶ 聽故事・裝置朗讀';
    button.setAttribute('aria-pressed','false');
    status.textContent = '朗讀已停止，可繼續閱讀。';
    return;
  }
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    status.textContent = '此裝置不支援朗讀，請直接閱讀故事。';
    return;
  }
  const utterance = new SpeechSynthesisUtterance(rideStories[type].paragraphs.join(' '));
  utterance.lang = 'zh-TW';
  utterance.rate = 0.95;
  utterance.onend = () => {
    if (rideNarration !== utterance) return;
    rideNarration = null;
    if (button.isConnected) {
      button.textContent = '▶ 再聽一次・裝置朗讀';
      button.setAttribute('aria-pressed','false');
      status.textContent = '故事已朗讀完畢。';
    }
  };
  utterance.onerror = () => {
    if (rideNarration !== utterance) return;
    rideNarration = null;
    if (button.isConnected) {
      button.textContent = '▶ 聽故事・裝置朗讀';
      button.setAttribute('aria-pressed','false');
      status.textContent = '朗讀目前無法使用，故事仍可直接閱讀。';
    }
  };
  rideNarration = utterance;
  button.textContent = '■ 停止朗讀';
  button.setAttribute('aria-pressed','true');
  status.textContent = '正在朗讀，請停妥單車後收聽。';
  window.speechSynthesis.speak(utterance);
}

function rideRecordExample(id) {
  if (!journey.notes[id+'-sample'] || !rideExamples[id]) return '';
  return `<figure class="ride-record-example"><img src="${rideExamples[id].src}" alt="${rideExamples[id].label}"><figcaption>範例示意・非實際紀錄</figcaption></figure>`;
}
