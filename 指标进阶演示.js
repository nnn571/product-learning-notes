/* Snapshot-driven teaching view. No network or business operations. */
(() => {
  const lesson = JSON.parse(document.querySelector('#lesson-data').textContent);
  const lab = lesson.metric_lab;
  if (!lab?.modes?.length) return;
  const host = document.createElement('section');
  host.id = 'metrics-lab'; host.className = 'metrics-lab box';
  document.querySelector('#dynamic-stage').before(host);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const count = lab.modes.reduce((n,m) => n + m.steps.length, 0);
  host.innerHTML = `<p class="eyebrow">COURSE LAB / 从动作看到产物变化</p><h2>${escape(lab.title)}</h2>
  <p>先选一个问题，再逐步查看对象、产物与状态怎样变化。每步保留判断依据和容易犯的错。</p>
  <p class="caption">${lab.modes.length} 个情境 · ${count} 个步骤 · 全部数字为固定教学示例，点击不运行真实业务。</p>
  <label for="metrics-mode">这次想弄懂什么？</label><select id="metrics-mode">${lab.modes.map((m,i)=>`<option value="${i}">${i+1}. ${escape(m.label)}</option>`).join('')}</select>
  <div class="controls"><button id="metrics-prev">← 上一步</button><button id="metrics-next">开始演示 →</button><button id="metrics-reset">重置图与数据</button><span id="metrics-count"></span></div>
  <div class="progress"><i id="metrics-progress"></i></div>
  <div id="metrics-state" aria-live="polite" aria-atomic="true"><h3 id="metrics-title"></h3><p id="metrics-explain"></p><div id="metrics-graph" class="metrics-graph"></div><div id="metrics-formula" class="metrics-formula"></div><p id="metrics-bad" class="bad"></p></div>
  <details><summary>老师口头补充与来源边界</summary><p id="metrics-source"></p><p>演示由整理者按来源设计；任务编号、分组和金额用于理解方法，不能当作老师原话或项目成绩。录音依据机器转写，未逐句回听。</p>${lesson.source.map(p=>`<a class="metrics-source-link" href="${escape(p)}">${escape(p.split('/').pop().replace(/\.md$/,''))} ↗</a>`).join('')}</details>
  <p class="caption">下方保留本主题原有演示。当前实验可返回、可重置；方向键在本区域只控制本实验。</p>`;
  let mode = 0, index = -1;
  const el = name => host.querySelector('#metrics-' + name);
  function render() {
    const m = lab.modes[mode], s = m.steps[index];
    el('title').textContent = s ? `${index+1}. ${s.title}` : m.label;
    el('explain').textContent = s ? s.explain : '点击“开始演示”，查看从输入到交付的过程。每步会改变对象、更新产物和数据；返回会恢复当时快照。';
    el('graph').innerHTML = s ? s.groups.map((g,i)=>`<article class="metrics-group ${escape(g.tone)}"><div class="metrics-group-heading"><span>${String(i+1).padStart(2,'0')}</span><h4>${escape(g.label)}</h4></div><div class="metrics-chips">${g.items.map(item=>`<span class="metrics-chip">${escape(item)}</span>`).join('')}</div></article>`).join('') : '<div class="metrics-empty">输入对象 → 本步动作 → 产物与结果 → 判断边界<br>等待开始，尚未执行</div>';
    el('formula').textContent = s ? s.formula : '尚无执行结果';
    el('bad').textContent = s ? s.bad : '先看目标、依据与验收，再判断是否完成。';
    el('source').textContent = m.source;
    el('count').textContent = `${index+1} / ${m.steps.length}`;
    el('progress').style.width = `${(index+1)/m.steps.length*100}%`;
    el('prev').disabled = index < 0;
    el('next').disabled = index >= m.steps.length-1;
    el('next').textContent = index < 0 ? '开始演示 →' : index === m.steps.length-1 ? '已到最后一步' : '下一步 →';
  }
  el('prev').onclick = () => {index=Math.max(-1,index-1);render();};
  el('next').onclick = () => {index=Math.min(lab.modes[mode].steps.length-1,index+1);render();};
  el('reset').onclick = () => {index=-1;render();};
  el('mode').onchange = event => {mode=Number(event.target.value);index=-1;render();};
  host.addEventListener('keydown',event=>{
    if (event.target.tagName==='SELECT' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key==='ArrowRight' || event.key==='ArrowLeft') {
      event.preventDefault();event.stopPropagation();el(event.key==='ArrowRight'?'next':'prev').click();
    }
  });
  render();
})();
