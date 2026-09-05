(() => {
  'use strict';

  const RAW_BASE = 'https://raw.githubusercontent.com/tomcorke/random-force/refs/heads/main/src/data/raw/';
  const RAW_IMAGES = 'https://raw.githubusercontent.com/tomcorke/random-force/refs/heads/main/src/data/raw/images/';

  const SOURCES = {
    operators: RAW_BASE + 'operators.json',
    maps: RAW_BASE + 'maps.json',
    weapons: RAW_BASE + 'weapons.json',
    helmets: RAW_BASE + 'helmets.json',
    vests: RAW_BASE + 'vests.json',
    rigs: RAW_BASE + 'rigs.json',
    backpacks: RAW_BASE + 'backpacks.json',
  };

  // ---- EDIT HERE FOR FUTURE CONTENT ----------------------------------------
  // These are the additions requested for this custom build.
  const CUSTOM_ITEMS = {
    operators: [
      { name: '蝶', isNew: true },
      { name: '液氮', isNew: true },
      { name: '回响', isNew: true },
    ],
    weapons: [
      { name: 'MCX', type: 'rifle', isNew: true },
      { name: 'RM277', type: 'rifle', isNew: true },
      { name: 'AR57', type: 'rifle', isNew: true },
      { name: 'SVCH', type: 'mp', isNew: true },
      { name: '刀', type: 'special', isNew: true },
    ],
    ammo: [
      { name: 'Level 4', tier: 4, type: 'ammo', isNew: true },
      { name: 'Level 5', tier: 5, type: 'ammo', isNew: true },
    ],
  };
  // -------------------------------------------------------------------------

  // ---- EXTRA RANDOMIZER DATABASE ------------------------------------------
  // 随机事件数据库。'无事件' 的总抽取概率由 RANDOM_EVENT_NONE_CHANCE 固定控制，
  // 所以不要靠重复填写“无事件”来调概率；其他具体事件会平均分配剩余概率。
  const EXTRA_RANDOMIZER_DATA = {
    randomEvents: [
      '嘉豪来了 - 所有道具cd转好直接使用，且本局不可静步',
      '回归基本功 - 全局不可使用大招',
      '异食癖 - 容器中看到及搜索到的所有物资都必须捡起来并且不可扔下',
      '少爷跑刀 - 只吃金色及以上物资（此限制包含枪械零件弹药装备等所有）',
      '上帝视角 - 你可以指定自己和队友玩什么角色和枪械',
      '放生一些金蛋 - 所有ai必须用枪打死',
      'gti生化超人 - 开局吞食所有8款针剂',
      '我是老板 - 本局获得所有容器物资优先搜索分配权',
      '鞭尸 - 击杀后必须原地对着尸体清空弹匣',
      '嘲讽拉满 - 每次击杀后必须对着尸体做一个表情动作',
      '身残志坚 - 本局不可携带任何药品，只能在局内搜索',
      '兼职的一天 - 根据本剧地图，只能携带该地图小兵装备进入',
      '升职加薪 - 和本局遇到的第一个特殊兵种互换装备',
      '跑刀仔 - 无视所有抽选，本局卡战备进入（不可超出战备要求5000以上）不可捡枪',
      '终极挑战 - 每摸到一个金色及以上品质物资，必须开枪暴露位置',
      '我好害怕 - 本局只能蹲着或者趴着走，遇到人后解除限制',
      '捡垃圾 - 本局只能携带蓝色及以下物资撤离',
      '良子特种兵 - 本局禁止跳跃翻越（关闭自动攀爬，解绑跳跃键）',
      '谁偷了我的裤裆?! - 本局禁用安全箱',
      '疯狂星期四v我50 - 本局身上所有位置塞满可乐',
      '上帝视角2 - 无视抽选自己决定自己本局所有装备',
      '堵桥的来 - 本局全队无视抽选和事件，统一堵桥（坝顶狙）',
      'cos挂哥 - 本局强制使用ak腰射改满，带上75自闭头',
      '化身太阳 - 枪械所有可装备战术道具的槽位全部安装爆闪手电',
      '玻璃大炮 - 允许自选武器与弹药，但只可装备1级防具',
      '教官的特训 - 30格背包塞满蛋白粉负重进图',
      '望远镜 - 枪械必须使用可装备的最高倍镜',
      '房卡大师 - 必须跑满全图把能开的房卡都开了',
      '破产了 - 卡战备进图，下家队友携带自己装备进图，上家队友携带自己枪械弹药进图',
      '天选牛马 - 完成本局所有局内任务',
      '工地搬砖 - 本局收集全部工具材料物资（重复可不捡）',
      '电脑高手 - 本局收集全部电子产品物资（重复可不捡）',
      '救护车 - 本局收集全部医疗用品物资（重复可不捡）',
      '宅男 - 本局收集全部家居物品物资（重复可不捡）',
      '守财奴 - 本局收集全部工艺收藏物资（重复可不捡）',
      'gti间谍 - 本局收集全部资料请报物资（重复可不捡）',
      '手搓核弹 - 本局收集全部能源燃料物资（重复可不捡）',
      '无事件',
    ],
  };
  const RANDOM_EVENT_NONE_CHANCE = 0.65; // 65% 无事件 / 35% 具体事件
  // -------------------------------------------------------------------------

  const FALLBACKS = {
    operators: [
      'Vyron','Hackclaw','Stinger','Luna','Shepherd','D-wolf','Uluru','Toxik','Nox','Tempest','Sineva','Raptor','Gizmo'
    ].map(name => ({ name })),
    maps: ['Zero Dam','Space City','Layali Grove','Brakkesh','Tide Prison'].map(name => ({ name })),
    weapons: [
      'M4A1 Assault Rifle','AKM Assault Rifle','QBZ95-1 Assault Rifle','AKS-74 Assault Rifle','ASh-12 Assault Rifle',
      'K416 Assault Rifle','M16A4 Assault Rifle','AUG Assault Rifle','M7 Battle Rifle','SG552 Assault Rifle',
      'AK-12 Assault Rifle','SCAR-H Battle Rifle','G3 Battle Rifle','PTR-32 Assault Rifle','CAR-15 Assault Rifle',
      'AS Val Assault Rifle','CI-19 Assault Rifle','K437 Assault Rifle','KC17 Assault Rifle','MP5 Submachine Gun',
      'P90 Submachine Gun','Vector Submachine Gun','UZI Submachine Gun','Bizon Submachine Gun','SMG-45 Submachine Gun',
      'SR-3M Compact Assault Rifle','Vityaz Submachine Gun','MP7','QCQ171 Submachine Gun','M1014 Shotgun',
      'S12K Shotgun','M870 Shotgun','725 Double-Barrel Shotgun','PKM General Machine Gun','M249 Light Machine Gun',
      'M250 General Machine Gun','QJB201 Light Machine Gun','Mini-14 Marksman Rifle','VSS Marksman Rifle','SVD Sniper Rifle',
      'M14 Marksman Rifle','SKS Marksman Rifle','SR-25 Marksman Rifle','PSG-1 Marksman Rifle','SR9 Marksman Rifle',
      'SV-98 Sniper Rifle','R93 Sniper Rifle','M700 Sniper Rifle','AWM Sniper Rifle','QSZ-92G','.357 Revolver',
      'Desert Eagle','G18','93R','G17','M1911','Compound Bow','MK47 Assault Rifle','Marlin Lever-action Rifle','MK4 Submachine Gun'
    ].map(name => ({ name })),
    helmets: [
      {name:'H70 Elite Helmet',tier:6},{name:'Mask-1 Iron Helmet',tier:5},{name:'D6 Tactical Helmet',tier:4},
      {name:'Anti-Riot Helmet',tier:3},{name:'H01 Tactical Helmet',tier:2},{name:'Steel Helmet',tier:1}
    ],
    vests: [
      {name:'Adamantine Vest',tier:6},{name:'Elite Vest',tier:5},{name:'Warrior Vest',tier:4},
      {name:'Standard Issue Vest',tier:3},{name:'Basic Stab Vest',tier:2},{name:'Security Vest',tier:1}
    ],
    rigs: [
      {name:'Hurricane Tactical Chest Rig',tier:5},{name:'DAR Assault Chest Rig',tier:5},{name:'Assault Tactical Vest',tier:4},
      {name:'D01 Lightweight Chest Rig',tier:3},{name:'Lightweight Tactical Chest Rig',tier:2}
    ],
    backpacks: [
      {name:'GT5 Field Backpack',tier:6},{name:'D3 Tactical Backpack',tier:5},{name:'MAP Assault Backpack',tier:4},
      {name:'Medium Camping Backpack',tier:3},{name:'Small Sling Bag',tier:2}
    ]
  };

  const CATEGORY_CONFIG = [
    { key: 'operators', label: '干员', color: '#f3a33c' },
    { key: 'maps', label: '地图', color: '#9e72ee' },
    { key: 'weapons', label: '武器', color: '#48a7ff' },
    { key: 'helmets', label: '头盔', color: '#5ccf85' },
    { key: 'vests', label: '护甲', color: '#5f95ff' },
    { key: 'rigs', label: '胸挂', color: '#e4bc48' },
    { key: 'backpacks', label: '背包', color: '#b070e3' },
    { key: 'ammo', label: '弹药等级', color: '#c985ff', customBadge: '新增' },
  ];

  const tierColors = {
    1: '#a9afb3',
    2: '#65bc7b',
    3: '#54a7ff',
    4: '#b268e8',
    5: '#e7a948',
    6: '#f36a4c',
  };

  const state = {
    pools: {},
    basePools: {},
    slots: new Map(),
    selectedGearTiers: new Set([2, 3, 4, 5]),
    remoteLoaded: 0,
    remoteFailed: 0,
    extraRandomizers: new Map(),
  };

  const GEAR_KEYS = new Set(['helmets', 'vests', 'rigs', 'backpacks']);

  function normalizeImage(src) {
    if (!src) return '';
    if (src.startsWith('./images/')) return RAW_IMAGES + src.replace('./images/', '');
    return src;
  }

  function normalizeItem(raw) {
    const item = { ...raw };
    item.name = String(raw.name || 'Unknown');
    item.src = normalizeImage(raw.src || raw.image || '');
    return item;
  }

  function uniqueByName(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = item.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Custom pool rules for this build:
  // 1) maps: Zero Dam + Space City only, 2) no pistols, 3) no Tier 1 items,
  // 4) no Tier 6 gear, 5) no Tier 5 chest rigs.
  function applyPoolRules(items, key) {
    return items.filter(item => {
      if (key === 'maps' && !['zero dam', 'space city'].includes(String(item.name || '').trim().toLowerCase())) return false;
      if (key === 'weapons' && String(item.type || '').toLowerCase() === 'pistol') return false;
      if (Number(item.tier) === 1) return false;
      if (Number(item.tier) === 6) return false;
      if (key === 'rigs' && Number(item.tier) === 5) return false;
      return true;
    });
  }

  async function fetchPool(key) {
    if (key === 'ammo') return CUSTOM_ITEMS.ammo.map(normalizeItem);
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 2500);
      let response;
      try {
        response = await fetch(SOURCES[key], { cache: 'no-store', signal: controller.signal });
      } finally {
        window.clearTimeout(timeout);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (!Array.isArray(json) || !json.length) throw new Error('Unexpected data');
      state.remoteLoaded++;
      const extras = CUSTOM_ITEMS[key] || [];
      return applyPoolRules(uniqueByName([...json.map(normalizeItem), ...extras.map(normalizeItem)]), key);
    } catch (err) {
      console.warn(`Could not load ${key} from upstream. Using local fallback.`, err);
      state.remoteFailed++;
      const extras = CUSTOM_ITEMS[key] || [];
      return applyPoolRules(uniqueByName([...(FALLBACKS[key] || []).map(normalizeItem), ...extras.map(normalizeItem)]), key);
    }
  }

  function randomIndex(length, previous = -1) {
    if (length <= 1) return 0;
    let next = Math.floor(Math.random() * length);
    if (next === previous) next = (next + 1 + Math.floor(Math.random() * (length - 1))) % length;
    return next;
  }

  // Tier draw probabilities for gear.
  // When Tier 2/3/4/5 are all enabled, the tier itself is drawn first at:
  // T2 15% / T3 15% / T4 40% / T5 30%.
  // If only some tiers are enabled (or a category has no items in a selected tier),
  // the remaining tier weights are automatically normalized.
  const GEAR_TIER_WEIGHTS = { 2: 15, 3: 15, 4: 40, 5: 30 };

  function gearTierRandomIndex(pool, previous = -1) {
    if (!pool.length) return 0;
    if (pool.length === 1) return 0;

    const tierToIndices = new Map();
    pool.forEach((item, index) => {
      const tier = Number(item.tier);
      if (!GEAR_TIER_WEIGHTS[tier]) return;
      if (!tierToIndices.has(tier)) tierToIndices.set(tier, []);
      tierToIndices.get(tier).push(index);
    });

    const availableTiers = [...tierToIndices.keys()];
    if (!availableTiers.length) return randomIndex(pool.length, previous);

    const totalTierWeight = availableTiers.reduce(
      (sum, tier) => sum + GEAR_TIER_WEIGHTS[tier],
      0
    );

    let roll = Math.random() * totalTierWeight;
    let chosenTier = availableTiers[availableTiers.length - 1];
    for (const tier of availableTiers) {
      roll -= GEAR_TIER_WEIGHTS[tier];
      if (roll < 0) {
        chosenTier = tier;
        break;
      }
    }

    const candidates = tierToIndices.get(chosenTier) || [];
    if (!candidates.length) return randomIndex(pool.length, previous);
    if (candidates.length === 1) return candidates[0];

    // After the tier is chosen, every item inside that tier has equal odds.
    // Avoid immediately repeating the exact same item when that tier has alternatives.
    const eligible = candidates.filter(index => index !== previous);
    const choices = eligible.length ? eligible : candidates;
    return choices[Math.floor(Math.random() * choices.length)];
  }

  // Non-gear weighted draws. Maps remain Zero Dam 75% / Space City 25%.
  function weightedRandomIndex(pool, previous = -1) {
    if (!pool.length) return 0;
    if (pool.length === 1) return 0;

    const weights = pool.map(item =>
      String(item.name || '').trim().toLowerCase() === 'zero dam' ? 3 : 1
    );

    // Avoid an immediate repeat only for pools with 3+ choices.
    // Two-choice pools (including maps) must allow repeats so weighting stays meaningful.
    if (weights.length > 2 && previous >= 0 && previous < weights.length) weights[previous] = 0;

    const total = weights.reduce((sum, weight) => sum + weight, 0);
    if (total <= 0) return randomIndex(pool.length, previous);

    let roll = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      roll -= weights[i];
      if (roll < 0) return i;
    }
    return pool.length - 1;
  }

  function randomIndexForCategory(key, pool, previous = -1) {
    if (GEAR_KEYS.has(key)) return gearTierRandomIndex(pool, previous);
    return weightedRandomIndex(pool, previous);
  }

  function shortName(name) {
    return name
      .replace(/Assault Rifle|Battle Rifle|Submachine Gun|Marksman Rifle|Sniper Rifle|Light Machine Gun|General Machine Gun|Shotgun/gi, '')
      .trim()
      .slice(0, 12) || name.slice(0, 12);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function itemMeta(item, key) {
    if (key === 'ammo') return item.tier ? `${item.tier}级弹药` : '弹药';
    if (item.role) {
      const roles = { assault:'突击', scout:'侦察', support:'支援', project:'工程' };
      return roles[item.role] || String(item.role);
    }
    if (item.type) {
      const map = { rifle:'步枪', smg:'冲锋枪', shotgun:'霰弹枪', lmg:'机枪', mp:'精确射手步枪', sniper:'狙击枪', pistol:'手枪', special:'特殊武器' };
      return map[item.type] || String(item.type).toUpperCase();
    }
    if (item.tier) return `${item.tier}级`;
    return item.isNew ? '新增' : '';
  }

  function visualColor(slot, item) {
    if (slot.key === 'ammo' && item.tier) return tierColors[item.tier] || slot.baseColor;
    if (item.tier) return tierColors[item.tier] || slot.baseColor;
    return slot.baseColor;
  }

  function filteredPoolFor(key) {
    const base = state.basePools[key] || [];
    if (!GEAR_KEYS.has(key)) return base.slice();
    return base.filter(item => state.selectedGearTiers.has(Number(item.tier)));
  }

  function updateTierFilterButtons() {
    const allSelected = state.selectedGearTiers.size === 4;
    document.querySelectorAll('.tier-filter-btn').forEach(btn => {
      const value = btn.dataset.tier;
      const active = value === 'all'
        ? allSelected
        : state.selectedGearTiers.has(Number(value));
      btn.classList.toggle('active', active);
      if (value !== 'all') btn.setAttribute('aria-pressed', String(active));
    });
  }

  function applyTierFilter(tier) {
    if (tier === 'all') {
      state.selectedGearTiers = new Set([2, 3, 4, 5]);
    } else {
      const value = Number(tier);
      if (state.selectedGearTiers.has(value)) {
        // Keep at least one tier selected so the gear pool can never be completely disabled.
        if (state.selectedGearTiers.size === 1) return;
        state.selectedGearTiers.delete(value);
      } else {
        state.selectedGearTiers.add(value);
      }
    }

    updateTierFilterButtons();

    for (const key of GEAR_KEYS) {
      const slot = state.slots.get(key);
      if (!slot) continue;
      if (slot.spinning) stopSlot(slot, false);
      slot.pool = filteredPoolFor(key);
      slot.index = slot.pool.length ? randomIndexForCategory(slot.key, slot.pool) : 0;
      renderSlot(slot);
    }
    updateLoadout();
  }

  function createSlot(config, pool) {
    const root = document.createElement('article');
    root.className = 'slot';
    root.dataset.key = config.key;
    root.style.setProperty('--slot-color', config.color);

    root.innerHTML = `
      <div class="slot-head">
        <span class="slot-title">${escapeHtml(config.label)}</span>
        <span class="slot-badge">${escapeHtml(config.customBadge || String(pool.length))}</span>
      </div>
      <div class="slot-machine">
        <div class="spin-indicator">随机中…</div>
        <div class="reel"></div>
      </div>
      <div class="slot-controls">
        <button class="nudge nudge-up" title="上一个">▲</button>
        <button class="slot-action">开始</button>
        <button class="nudge nudge-down" title="下一个">▼</button>
      </div>
      <div class="hold-row"><button class="hold-btn">锁定</button></div>
    `;

    const slot = {
      key: config.key,
      label: config.label,
      baseColor: config.color,
      pool,
      index: randomIndexForCategory(config.key, pool),
      spinning: false,
      held: false,
      timer: null,
      root,
      reel: root.querySelector('.reel'),
      action: root.querySelector('.slot-action'),
      holdBtn: root.querySelector('.hold-btn'),
    };

    root.querySelector('.nudge-up').addEventListener('click', () => nudge(slot, -1));
    root.querySelector('.nudge-down').addEventListener('click', () => nudge(slot, 1));
    slot.action.addEventListener('click', () => slot.spinning ? stopSlot(slot, true) : spinSlot(slot));
    slot.holdBtn.addEventListener('click', () => toggleHold(slot));

    renderSlot(slot);
    return slot;
  }

  function getCircularItem(slot, delta) {
    const len = slot.pool.length;
    if (!len) return null;
    const idx = (slot.index + delta + len) % len;
    return slot.pool[idx];
  }

  function renderRow(slot, item, isCurrent) {
    if (!item) {
      return `<div class="reel-row${isCurrent ? ' current' : ''} empty-row">
        <div class="fallback-art">无</div>
        <div class="item-name">当前筛选无可用物品</div>
        <div class="item-meta">请调整等级筛选</div>
      </div>`;
    }
    const meta = itemMeta(item, slot.key);
    const imageMarkup = item.src
      ? `<img src="${escapeHtml(item.src)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=&quot;fallback-art&quot;>${escapeHtml(shortName(item.name))}</div>'">`
      : `<div class="fallback-art">${escapeHtml(shortName(item.name))}</div>`;

    return `<div class="reel-row${isCurrent ? ' current' : ''}">
      ${imageMarkup}
      <div class="item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
      ${meta ? `<div class="item-meta">${escapeHtml(meta)}${item.isNew ? ' • 新增' : ''}</div>` : ''}
    </div>`;
  }

  function renderSlot(slot) {
    const current = getCircularItem(slot, 0);
    slot.reel.innerHTML = renderRow(slot, current, true);
    const color = current ? visualColor(slot, current) : slot.baseColor;
    slot.root.style.setProperty('--slot-color', color);
    slot.root.querySelector('.slot-badge').textContent = slot.key === 'ammo' ? '4–5级' : String(slot.pool.length);

    const unavailable = slot.pool.length === 0;
    slot.root.classList.toggle('unavailable', unavailable);
    slot.action.disabled = unavailable;
    slot.holdBtn.disabled = unavailable;
    slot.root.querySelectorAll('.nudge').forEach(btn => btn.disabled = unavailable);
    if (unavailable) slot.action.textContent = '无可用';
    else if (!slot.spinning) slot.action.textContent = '开始';

    updateLoadout();
  }

  function nudge(slot, delta) {
    if (!slot.pool.length || slot.spinning || slot.held) return;
    slot.index = (slot.index + delta + slot.pool.length) % slot.pool.length;
    renderSlot(slot);
  }

  function toggleHold(slot) {
    if (!slot.pool.length) return;
    slot.held = !slot.held;
    slot.root.classList.toggle('held', slot.held);
    slot.holdBtn.classList.toggle('active', slot.held);
    slot.holdBtn.textContent = slot.held ? '已锁定' : '锁定';
    if (slot.held && slot.spinning) stopSlot(slot, false);
  }

  function spinSlot(slot) {
    if (!slot.pool.length || slot.held || slot.spinning) return;
    slot.spinning = true;
    slot.action.textContent = '停止';
    slot.action.classList.add('stop');
    slot.reel.classList.add('spinning');
    slot.root.classList.add('spinning');

    const started = performance.now();
    const autoStopAfter = 1150 + Math.random() * 1350;
    let cadence = 95;

    const tick = () => {
      if (!slot.spinning) return;
      const elapsed = performance.now() - started;
      slot.index = (slot.index + 1 + (Math.random() < .12 ? 1 : 0)) % slot.pool.length;
      renderSlot(slot);

      if (elapsed >= autoStopAfter) {
        stopSlot(slot, true);
        return;
      }
      if (elapsed > autoStopAfter * .72) cadence = 145;
      else if (elapsed > autoStopAfter * .48) cadence = 115;
      slot.timer = window.setTimeout(tick, cadence);
    };
    tick();
  }

  function stopSlot(slot, chooseFresh) {
    if (!slot.spinning) return;
    slot.spinning = false;
    if (slot.timer) clearTimeout(slot.timer);
    slot.timer = null;
    if (chooseFresh) slot.index = randomIndexForCategory(slot.key, slot.pool, slot.index);
    slot.action.textContent = '开始';
    slot.action.classList.remove('stop');
    slot.reel.classList.remove('spinning');
    slot.root.classList.remove('spinning');
    renderSlot(slot);
  }

  function spinAll() {
    let delay = 0;
    for (const slot of state.slots.values()) {
      if (slot.held) continue;
      window.setTimeout(() => spinSlot(slot), delay);
      delay += 45;
    }
    rerollGunModder();
    rerollBudget();
    for (const roulette of state.extraRandomizers.values()) rerollExtraInstant(roulette);
  }

  function stopAll() {
    for (const slot of state.slots.values()) stopSlot(slot, true);
    // 随机事件为单击立即出结果，不需要停止。
  }

  function renderExtraValue(roulette) {
    const item = roulette.pool[roulette.index];
    roulette.valueEl.textContent = item || '待添加数据';
  }

  function randomExtraIndex(roulette, previous = -1) {
    if (!roulette || !roulette.pool.length) return 0;

    // 随机事件任务使用固定概率：无事件 65%，所有具体事件共同占 35%。
    // 即使数据库里误写了多个“无事件”，总概率也仍然只会是 65%。
    if (roulette.key === 'randomEvents') {
      const noneIndices = [];
      const eventIndices = [];

      roulette.pool.forEach((item, index) => {
        if (String(item).trim() === '无事件') noneIndices.push(index);
        else eventIndices.push(index);
      });

      if (noneIndices.length && eventIndices.length) {
        const candidates = Math.random() < RANDOM_EVENT_NONE_CHANCE ? noneIndices : eventIndices;
        return candidates[Math.floor(Math.random() * candidates.length)];
      }

      const candidates = noneIndices.length ? noneIndices : eventIndices;
      if (candidates.length) return candidates[Math.floor(Math.random() * candidates.length)];
    }

    return randomIndex(roulette.pool.length, previous);
  }

  function createExtraRoulette(key, label, pool, valueId, buttonId) {
    const valueEl = document.getElementById(valueId);
    const buttonEl = document.getElementById(buttonId);
    const roulette = {
      key,
      label,
      pool: Array.isArray(pool) ? pool.filter(Boolean).map(String) : [],
      valueEl,
      buttonEl,
      index: 0,
    };

    if (!roulette.pool.length) {
      valueEl.textContent = '待添加数据';
      buttonEl.disabled = true;
      buttonEl.textContent = '抽取';
    } else {
      roulette.index = randomExtraIndex(roulette);
      renderExtraValue(roulette);
      buttonEl.disabled = false;
      buttonEl.textContent = '抽取';
      buttonEl.addEventListener('click', () => rerollExtraInstant(roulette));
    }

    state.extraRandomizers.set(key, roulette);
    return roulette;
  }

  // 随机事件：单击后立即生成最终结果，不经过“开始/停止”或滚动动画。
  function rerollExtraInstant(roulette) {
    if (!roulette || !roulette.pool.length) return;
    roulette.index = randomExtraIndex(roulette, roulette.index);
    renderExtraValue(roulette);
    updateLoadout();
  }

  const gunModders = ['自己','上家','下家'];
  const budgets = ['0','100K','200K','300K','400K','500K','600K','无限'];

  function rerollGunModder() {
    const el = document.getElementById('gunModderValue');
    el.textContent = gunModders[Math.floor(Math.random() * gunModders.length)];
  }
  function rerollBudget() {
    const el = document.getElementById('budgetValue');
    el.textContent = budgets[Math.floor(Math.random() * budgets.length)];
  }

  function updateLoadout() {
    // 配置汇总/复制区块已移除；保留空函数以兼容现有随机逻辑。
  }

  async function init() {
    const grid = document.getElementById('slotGrid');
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');

    const entries = await Promise.all(CATEGORY_CONFIG.map(async config => [config, await fetchPool(config.key)]));
    for (const [config, pool] of entries) {
      state.basePools[config.key] = pool;
      state.pools[config.key] = pool;
      const slot = createSlot(config, filteredPoolFor(config.key));
      state.slots.set(config.key, slot);
      grid.appendChild(slot.root);
    }
    updateLoadout();

    statusBar.classList.add(state.remoteFailed ? 'warn' : 'ready');
    statusText.textContent = state.remoteFailed
      ? `已就绪 • ${state.remoteLoaded} 个在线数据池加载成功，${state.remoteFailed} 个使用本地备用数据 • 自定义筛选已启用`
      : `已就绪 • Random Force 在线数据已加载 • 已移除手枪、全部1级物品、全部6级装备和5级胸挂`;

    createExtraRoulette('randomEvents', '随机事件任务', EXTRA_RANDOMIZER_DATA.randomEvents, 'randomEventValue', 'randomEventBtn');
    updateLoadout();

    document.querySelectorAll('.tier-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => applyTierFilter(btn.dataset.tier));
    });

    document.getElementById('spinAllBtn').addEventListener('click', spinAll);
    document.getElementById('stopAllBtn').addEventListener('click', stopAll);
    document.getElementById('gunModderBtn').addEventListener('click', rerollGunModder);
    document.getElementById('gunModderValue').addEventListener('click', rerollGunModder);
    document.getElementById('budgetBtn').addEventListener('click', rerollBudget);
    document.getElementById('budgetValue').addEventListener('click', rerollBudget);
  }

  init();
})();
