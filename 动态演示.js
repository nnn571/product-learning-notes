(() => {
const host=document.getElementById('dynamic-stage'); if(!host)return;
const agent=data.slug.startsWith('07'),rag=data.slug.startsWith('05');
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let at=-1,mode='normal';
const ring=(active,round,exit)=>`<svg class="cycle" viewBox="0 0 500 350" role="img" aria-label="想、做、看循环；当前${active||'待开始'}"><defs><marker id="tip" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#55dbc2"/></marker></defs>${[['想','做','M290 65 Q440 90 395 235'],['做','看','M350 285 Q250 350 150 285'],['看','想','M105 235 Q60 90 210 65']].map(([a,b,d])=>`<path class="flow-edge ${active===b?'flowing':''}" d="${d}" marker-end="url(#tip)"/>`).join('')}${[['想',250,65,'选择下一步'],['做',390,270,'程序执行'],['看',110,270,'读取真实返回']].map(([n,x,y,sub])=>`<g class="cycle-node ${active===n?'lit':''}" transform="translate(${x},${y})"><circle r="48"/><text text-anchor="middle" y="2">${n}</text><text class="svg-small" text-anchor="middle" y="24">${sub}</text></g>`).join('')}<text class="cycle-center" x="250" y="175" text-anchor="middle">${exit?'停止 / '+exit:'第 '+round+' 轮'}</text><text class="svg-small" x="250" y="200" text-anchor="middle">${exit?'保留已知结果与缺口':'观察回填，下一轮用新证据'}</text></svg>`;
if(!agent&&!rag){window.mountCaseDemo(host,data);return;}
host.innerHTML=`<div class="top"><div><p class="eyebrow">LIVE DIAGRAM / 每次点击，只推进一小步</p><h2>${agent?'Agent：一圈里到底发生了什么？':'RAG：一条规则怎样变成有依据的回答？'}</h2></div><span class="badge">全部为教学模拟</span></div><label>演示情境 <select id="demo-mode">${agent?'<option value="normal">正常查证 → 有依据地结束</option><option value="failure">工具失败 → 到上限停止</option><option value="approval">退款诉求 → 等待人工决定</option>':'<option value="normal">完整条款 → 有依据回答</option><option value="broken">切掉例外 → 暴露错误风险</option><option value="empty">无可用资料 → 不编答案</option>'}</select></label>${rag?'<div class="rag-settings"><label>Top K <input id="demo-k" type="range" min="1" max="3" value="2"><output id="k-label">2</output></label><label>分数门槛 <input id="demo-threshold" type="range" min="0" max="1" step="0.05" value="0.6"><output id="threshold-label">0.60</output></label></div>':''}<p class="caption">${agent?'用户已授权查询本人订单；所有决策说明是教学摘要，不是模型内部思考。重试上限为本例设定，不是推荐值。':'虚构店铺政策与固定分数，只演示资料流向；分数不是正确概率。此例采用向量检索，RAG不限定这一种实现。'}</p><div class="demo-grid"><div id="diagram"></div><div class="state-panel"><h3 id="demo-title">准备开始</h3><p id="demo-explain"></p><div id="demo-payload"></div></div></div><div id="demo-context" class="context-strip" aria-label="当前可用信息"></div><div class="controls demo-controls"><button id="demo-prev">← 回看一步</button><button id="demo-next">开始演示 →</button><button id="demo-reset">重置图与数据</button><span id="demo-counter" class="muted"></span></div><p class="caption" id="demo-status" role="status" aria-live="polite"></p><details><summary>展开累计模拟日志</summary><ol id="demo-log"></ol></details>`;
const $d=id=>host.querySelector('#'+id);
const initial=()=> mode==='approval'?'用户：“请帮我退订单D101。”；身份已核实并授权查询本人订单；已有退款诉求，本例商家规则仍要求人工核准执行。':'用户：“我的扫地机怎么还没到？”；已授权查询本人订单。';
function agentStates(){if(mode==='failure')return[
 ['想','1','先查订单','需要真实订单标识，选择按已授权身份查询。','计划调用 query_orders(user_id=U001)',null],
 ['做','1','程序发送查询','请求已经发出，但没有拿到结果。','query_orders(user_id=U001) → 等待返回',null],
 ['看','1','工具返回超时','没有取得订单列表。超时不能解释为“没有订单”。','错误：TIMEOUT','查询超时；订单状态未知'],
 ['想','2','决定有限重试','本例是只读查询，允许再试一次；不是重复猜订单号。','计划重试同一授权查询',null],
 ['做','2','执行第二次查询','第二次请求仍在等待；还不能声称查询完成。','query_orders(user_id=U001) → 等待返回',null],
 ['看','2','仍然超时','新观察依然是失败，没有获得订单事实。','错误：TIMEOUT','第二次查询仍超时'],
 ['','2','达到演示重试上限','停止自动查询，保留未知状态，提供稍后重试或人工查询入口。','结果：未查明物流；没有执行退款。',null,'失败停止']];
if(mode==='approval')return[
 ['想','1','先核订单条件','退款诉求已明确，订单号来自用户；先核订单条件。本例商家要求人工核准，其他系统按实际授权与政策执行。','计划查询已授权订单条件',null],
 ['做','1','查询订单','程序校验查询权限后发起请求。','query_order(order_id=D101) → 等待返回',null],
 ['看','1','取得订单资料','只证明已拿到订单信息，不证明满足退款条件或退款已经执行。','返回：D101，已支付，退款条件仍需业务核定','订单D101已支付；未执行退款'],
 ['想','2','检查执行权限','本例退款需要人工核准。整理已知事实和未核条件。','生成处理建议；不调用 refund()',null],
 ['','2','等待人工决定','显示待审批，不伪称“已退款”或“已转人工”。如接入人工系统，还需核交接结果。','状态：待人工处理；此演示未发送工单。',null,'人工决定']];
return[
 ['想','1','缺订单标识，先选工具','模型选择按用户查订单列表；这里只用已经授权的身份。','计划：query_orders(user_id=U001)',null],
 ['做','1','程序校验并执行','工具请求不是工具结果。此刻只有发出的调用。','query_orders(user_id=U001) → 等待返回',null],
 ['看','1','拿到候选订单','模拟返回唯一匹配的扫地机订单；多个匹配时应进一步确认。','返回：D101 / 扫地机 / 配送中','订单D101，配送中'],
 ['想','2','根据新事实选下一步','订单已找到，现在缺的是物流异常原因。','计划：query_shipping(order_id=D101)',null],
 ['做','2','查询物流','把上一轮获得的真实标识传给物流工具，不编造参数。','query_shipping(order_id=D101) → 等待返回',null],
 ['看','2','读取物流记录','物流返回成为新证据；此时才知道延迟原因。','返回：11月12日，暴雨造成延误；未提供预计送达时间','物流记录：暴雨延误；预计送达未知'],
 ['想','3','判断证据是否够用','可以回答延误原因；没有依据就不承诺送达时间。','准备带依据的答复；无需追加调用',null],
 ['','3','有依据地结束','向用户说明已核实原因与未知项。完成的是查询解释，不是催单或退款。','答复：物流记录显示暴雨延误，预计送达时间尚未提供。',null,'任务完成']];}
function agentPaint(){const rows=agentStates(),s=rows[at],facts=[initial(),...rows.slice(0,at+1).filter(x=>x[5]).map(x=>x[5])];$d('diagram').innerHTML=ring(s?.[0],s?.[1]||0,s?.[6]);$d('demo-title').textContent=s?s[2]:'任务进入前，先看清权限';$d('demo-explain').textContent=s?s[3]:'每点一次，图只走到“想、做、看”中的一个位置；到“看”时返回才进入可用信息。';$d('demo-payload').innerHTML='<pre>'+E(s?s[4]:initial())+'</pre>';$d('demo-context').innerHTML='<b>当前可用信息（观察后才增加）</b>'+facts.map(f=>'<span class="fact">'+E(f)+'</span>').join('');$d('demo-log').innerHTML=rows.slice(0,at+1).map(x=>'<li><b>'+E(x[2])+'</b> · '+E(x[4])+'</li>').join('');controls(rows.length,s?.[6]?'演示停在“'+s[6]+'”；没有执行真实业务操作。':'高亮位置表示当前阶段；箭头表示本次流向。');}
const titles=['采集资料','切分与保留条件','编码与入库','检索与筛选','组装上下文','生成并核验'];
function docs(){return[{id:'A',title:'日常价保政策',score:.94,text:'商品支付后7天内可申请价保；活动订单除外，按活动条款。'}, {id:'B',title:'活动条款 v2',score:.86,text:'11月1日至11月7日支付的活动订单，支付后15天内可申请价保；须核实差价及其他条件。'}, {id:'C',title:'清洁保养说明',score:.32,text:'滤网拆下清理后需充分晾干。'}];}
function ragPaint(){const k=+$d('demo-k').value,t=+$d('demo-threshold').value,all=docs().map(d=>mode==='broken'&&at>=1&&d.id==='A'?{...d,text:'商品支付后7天内可申请价保。'}:d);const hits=mode==='empty'?[]:all.filter(d=>d.score>=t).slice(0,k);$d('k-label').textContent=k;$d('threshold-label').textContent=t.toFixed(2);
$d('diagram').innerHTML='<div class="rag-path">'+titles.map((s,i)=>`<div class="rag-node ${i===at?'current':i<at?'past':''}"><span>${i<at?'✓':i+1}</span><b>${s}</b><small>${i<3?'离线准备':'在线问答'}</small></div>`).join('<div class="down-arrow">↓</div>')+'</div>';
let content='',explain='';const query='用户：11月3日买的活动订单，11月12日还能申请价保吗？';
if(at<0){content='<div class="paper">'+query+'</div>';explain='先准备知识，再回答问题。数字和政策均为虚构；下一步会显示原始资料。';}
if(at===0){content=all.map(d=>`<div class="paper"><b>${d.id} · ${d.title}</b><p>${E(d.text)}</p></div>`).join('');explain='采集可用来源，保留版本与适用日期。活动条件不能只留一句期限。';}
if(at===1){content=all.map(d=>`<div class="paper ${mode==='broken'&&d.id==='A'?'warning':''}"><span>切片 ${d.id}</span><p>${E(d.text)}</p></div>`).join('');explain=mode==='broken'?'错误演示：A片段丢掉“活动订单除外”，普通政策看起来像无条件适用。':'每张片段卡保留必要条件；按句号切完不代表语义完整。';}
if(at===2){content=all.map((d,i)=>`<div class="vector-row"><b>${d.id}</b><span class="vector">${[12+i*14,34+i*8,65-i*8,24+i*10,48].map(v=>'<i style="height:'+v+'%"></i>').join('')}</span><span>向量 + 原文 + 来源</span></div>`).join('');explain='示意条形不是实际向量值。此例为片段编码并建索引；查询也要使用兼容编码。入库成功还要验证可检索。';}
if(at===3){content='<div class="paper">'+query+'<br>查询编码 → 候选检索</div>'+all.map(d=>`<div class="candidate ${hits.includes(d)?'selected':'excluded'}"><b>${d.id} · ${d.title}</b><span>${d.score.toFixed(2)} · ${hits.includes(d)?'保留':'未选'}</span><i style="width:${d.score*100}%"></i></div>`).join('');explain=mode==='empty'?'此情境没有可访问候选。下方分数仅展示其他情境的固定示例，不代表本次召回。':'此模拟先按门槛过滤，再取分数最高的K条。调整滑块会立即改变保留集合；实现顺序依实际系统。';}
if(at===4){content='<div class="prompt-box"><b>最终输入</b><p>任务：依据资料回答；不足说明缺口。</p><p>'+query+'</p>'+hits.map(d=>'<div class="paper">['+d.id+'] '+E(d.text)+'</div>').join('')+(!hits.length?'<p class="warning">无可用片段：不能从空上下文编规则。</p>':'')+'</div>';explain='真正进入上下文的只有已选片段。资料里夹带的指令不能改变用户授权或任务规则。';}
if(at===5){let msg;if(!hits.length)msg='资料不足：本次没有可用依据，暂不能判断；需要查到适用活动政策。';else if(!hits.some(d=>d.id==='B'))msg=mode==='broken'?'错误风险：A丢失例外，可能误答“超过7天不能申请”。这是错误示范；应补全规则、找活动条款再核。':'活动订单不适用普通7天规则 [A]，但活动条款未进入上下文；需补检索，不能猜。';else if(mode==='broken'&&hits.some(d=>d.id==='A'))msg='条款出现冲突：A缺例外、B给活动范围。先回源修复缺失条件，不能随意选期限。';else msg='按活动条款 [B]，11月3日符合活动日期，至11月12日为9天，仍在示例15天申请窗口内；差价及其他条件还需核实，不等于已批准赔付。';content='<div class="answer-card">'+E(msg)+'</div>';explain='看答案是否使用适用条款、带出处且保留条件。相似分数高、检索命中、最终回答正确，是不同检查。';}
$d('demo-title').textContent=at<0?'准备开始':titles[at];$d('demo-explain').textContent=explain;$d('demo-payload').innerHTML=content;$d('demo-context').innerHTML='<b>流动的数据</b><span class="fact">'+(at<1?'原始资料':at<3?'片段A / B / C + 来源':at<5?'本次保留：'+(hits.map(d=>d.id).join('、')||'0条'):'答案 + 出处 + 未核条件')+'</span>';$d('demo-log').innerHTML=titles.slice(0,at+1).map(x=>'<li>'+x+'</li>').join('');controls(6,'当前保留 '+hits.length+' 条。滑块是教学参数，不是通用推荐配置。');}
function controls(total,status){$d('demo-prev').disabled=at<0;$d('demo-next').disabled=at>=total-1;$d('demo-next').textContent=at<0?'开始演示 →':at===total-1?'本轮演示结束':'推进一步 →';$d('demo-counter').textContent=(at+1)+' / '+total;$d('demo-status').textContent=status;}
function paint(){if(agent)agentPaint();else ragPaint();}
$d('demo-next').onclick=()=>{at=Math.min((agent?agentStates().length:6)-1,at+1);paint();};$d('demo-prev').onclick=()=>{at=Math.max(-1,at-1);paint();};$d('demo-reset').onclick=()=>{at=-1;if(rag){$d('demo-k').value=2;$d('demo-threshold').value=.6;}paint();};$d('demo-mode').onchange=e=>{mode=e.target.value;at=-1;paint();};if(rag){$d('demo-k').oninput=paint;$d('demo-threshold').oninput=paint;}
paint();showTab(1);
})();
