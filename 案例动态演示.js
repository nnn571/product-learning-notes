window.mountCaseDemo=(host,data)=>{
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const topic=data.slug.slice(0,2);let n=-1,mode='normal';
const names={'01':'需求：一句“帮我挪个按钮”，怎样变成一张需求卡？','02':'指标：同一批人怎样形成漏斗？','03':'提示词：规则怎样改变分类结果？','04':'工作流：一个字段怎样影响回复？','06':'评测：一条失败怎样定位并修复？'};
const modes={'01':[['normal','能看到他实际怎么操作'],['missing','只有一句原话，还没看到实际操作']],'02':[['normal','同口径人数'],['mixed','混用次数、订单与人数']],'03':[['normal','补齐规则与输出'],['conflict','追加规则产生冲突']],'04':[['normal','激活字段丢失 → 修复'],['unknown','查询状态未知'],['timeout','工具超时']],'06':[['normal','产品错误 → 修复回归'],['grader','评分标准占位 → 修复裁判']]};
host.innerHTML=`<div class="top"><div><p class="eyebrow">LIVE CASE / 看数据如何变化</p><h2>${names[topic]}</h2></div><span class="badge">虚构案例 · 预设结果</span></div><label>切换情境 <select id="case-mode">${modes[topic].map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></label><p class="caption">每次点击推进一次状态变化。这里的记录和回答均为教学构造，没有调用真实模型、查询业务或提交操作。</p><div class="demo-grid"><div id="case-picture" class="case-picture"></div><div class="state-panel"><h3 id="case-title"></h3><p id="case-explain"></p><div id="case-data"></div></div></div><div id="case-change" class="context-strip" role="status" aria-live="polite"></div><div class="controls demo-controls"><button id="case-prev">← 回看一步</button><button id="case-next">开始演示 →</button><button id="case-reset">重置图与数据</button><span id="case-count"></span></div>`;
const $=id=>host.querySelector('#'+id),card=(title,body,cls='')=>`<div class="paper ${cls}"><b>${E(title)}</b><div>${body}</div></div>`,tag=(t,c='')=>`<span class="fact ${c}">${E(t)}</span>`,arrow='<div class="transfer-arrow">↓</div>';
function set(title,explain,picture,payload,change){$('case-title').textContent=title;$('case-explain').textContent=explain;$('case-picture').innerHTML=picture;$('case-data').innerHTML=payload;$('case-change').innerHTML='<b>这一步改变了什么</b><span class="fact">'+E(change)+'</span>';}
function need(){const missing=mode==='missing',titles=['先听原话','还原完整过程','把信息分成三类','比较几种方案','写成需求卡','找人试用一次'];
let pic=card('同事的原话','“把导出按钮挪到首页吧。”');
if(n>=1)pic+=arrow+'<div class="task-chain">'+['导出表格','打开邮箱','上传附件','发给主管'].map((x,i)=>`<div class="task-token ${i===2?'task-blocked':''}">${x}${i===2?'<small>最费事的是这里？</small>':''}</div>`).join('<span>→</span>')+'</div>';
if(n>=2)pic+=arrow+card('三类信息',tag('事实：他提出要挪按钮')+tag(missing?'还不知道：他实际怎么操作':'亲眼看到：导出后还要另外上传')+tag('猜测：转交文件比找按钮更费时间','uncertain'));
if(n>=3)pic+=arrow+card('方案比较',`<div class="solution ${n>=4&&!missing?'dim':''}">A 挪按钮 · 省掉找按钮的时间</div><div class="solution ${n>=4&&!missing?'chosen':''}">B 共享链接 · 可能省掉“导出再上传”</div><div class="solution">C 维持现状 · 不花开发成本</div>`);
let payload=card('还没开始了解','目前只有他说的一句话。'),explain='用户说出口的“解决办法”，不一定就是他真正的需求。',change='只记下了原话，还没选方案。';
if(n===0){explain='先把“他说了什么”记下来，但别急着把它当成需求。';payload=card('原始记录','谁：每周交周报的同事<br>他说：把导出按钮挪到首页<br>多久一次、花多久、为什么：还不知道');change='原话记下了，原因还空着。';}
if(n===1){explain=missing?'还没看到他实际怎么操作，左边的流程只是你的推测。':'你请他当面交了一次周报：导出后，他还要切到邮箱、上传文件、再发出去。';payload=card('观察记录',missing?'没看到实际操作，所以不能填具体用时。':'这一次：找按钮用了 20 秒，导出加上传用了 80 秒。<br>只看了一个人一次，不能代表所有人。');change=missing?'流程还只是推测。':'发现按钮之外，还有一道“转交文件”的手续。';}
if(n===2){explain='把事实、猜测、还不知道的分开放，免得把猜的当成结论。';payload=card('下一步要查',missing?'请他带你走一遍上次交周报的过程。':'再多看几位同事，确认“转交文件”是不是每次都很麻烦。');change='清楚了还缺哪些证据。';}
if(n===3){explain='每个方案解决的是不同环节。选共享链接的话，还要确认主管有没有权限打开。';payload=card('比较','A 挪按钮：省掉找按钮的时间<br>B 共享链接：可能省掉转交文件，但要处理查看权限<br>C 维持现状：不花开发成本，但麻烦还在');change='一个“挪按钮”的请求，变成了三个可以比较的选项。';}
if(n>=4){explain=missing?'证据还不够，先写一份“验证计划”，不要宣布需求成立。':'把选中的方案写成需求卡，再找人小范围试用。';payload=card(missing?'验证计划':'需求卡',missing?'目标：弄清他到底卡在哪<br>下一步：看他完整交一次周报<br>暂时定不了：选哪个方案、能省多少时间':'用户：每周交周报的同事<br>目标：少一道“导出再上传”的手续<br>方案：共享链接<br>边界：不替他自动发送；先确认主管能打开<br>怎样算做成：主管能看到正确的周报，并记录用时');change=missing?'下一步是补证据，而不是直接开发。':'方案带上了边界和验收标准。';}
if(n===5&&missing){explain='证据还不够，现在没有新方案可以试；先按验证计划，去看他实际交一次周报。';change='试用要等弄清卡点之后再做。';}
if(n===5&&!missing){explain='请同事用共享链接实际交一次周报，你在旁边记录结果。';pic+=arrow+card('试用结果','同一位同事用共享链接交了一次：从 100 秒降到 45 秒。');payload+=card('能得出的结论','共享链接方案值得继续试。但只试了一个人一次，不能说“每个人都能省 55 秒”，更不能说已经带来了业务收益。');change='多了一次试用证据，结论只说到证据能支持的程度。';}
set(n<0?'先听用户怎么说':titles[n],explain,pic,payload,change);}
function metric(){const mixed=mode==='mixed',labels=['访问','点击','下单','支付'],values=[1000,300,60,57],titles=['看到原始记录','统一窗口和单位','按人去重','逐层算转化','核算交易额','观察护栏与结论'];let pic='<div class="funnel">';
for(let i=0;i<4;i++){const visible=n>=2||n>=0&&mixed;pic+=`<div class="funnel-row"><span>${labels[i]}</span><div class="funnel-track"><i style="width:${visible?values[i]/10:0}%"></i></div><b>${visible?values[i]:'—'}${mixed?['次','次','单','人'][i]:'人'}</b></div>`;}pic+='</div>';
let explain='先读数据来源，不能只看数字大小。',payload=card('等待数据','同一批访客的演算示例。'),change='尚未计算。';
if(n===0){payload=card('原始记录',mixed?'1,000次访问 / 300次点击 / 60单 / 57位付款人':'表中包含用户ID、事件、时间与订单号。');change='记录进入分析台。';}
if(n===1){payload=card('口径卡',mixed?'单位冲突：次数、订单数、人数不可直接串成用户漏斗。':'同一统计窗口；从1,000位访客出发；各层按用户去重并满足前层路径。');explain='先定窗口、去重和路径约束，再画逐层包含的漏斗。';change=mixed?'检测到单位冲突，停止算转化。':'统一按人统计。';}
if(n>=2){payload=card(mixed?'阻断计算':'去重后的人群',mixed?'缺少用户级关联记录，无法从这些汇总数恢复人数漏斗。需要补同口径数据。':'1,000人访问 → 300人点击 → 60人下单 → 57人支付。');change=mixed?'保持未知，不强行除出百分比。':'四层人数进入漏斗。';}
if(n>=3&&!mixed){pic+=card('相邻与整体转化',tag('点击 30%')+tag('下单 20%')+tag('支付 95%')+tag('整体 5.7%'));payload=card('计算过程','300÷1000=30%<br>60÷300=20%<br>57÷60=95%<br>57÷1000=5.7%');change='分母随所问环节变化。';}
if(n>=4&&!mixed){pic+=arrow+card('支付交易额','57 单 × 200 元/单 = <strong>11,400 元</strong>');payload=card('本例补充条件','假设57位付款人各支付1单，平均每单支付200元。若一人多单，要另取订单数。全部订单已含复购，不再额外相乘。');change='人数不直接当订单数，先补条件。';}
if(n===5){explain='漏斗不能单独解释因果，交易额也不是利润。';payload+=card('护栏',mixed?'先修口径，再分析问题。':'本例退款、投诉、成本尚未提供。不能只因首层流失最多就决定优先改它。');change='补上无法下结论的范围。';}
set(n<0?'数据尚未入场':titles[n],explain,pic,payload,change);}
function prompt(){const conflict=mode==='conflict',titles=['放入用户句子','用粗糙规则分类','补购买状态与诉求','约定输出结构','用新句测试','对照规则与回归'];const q='还没买，想问激活以后能退吗？';let pic=card('输入',E(q));
if(n>=1)pic+=arrow+card('规则 v0','出现“退” → 售后','warning')+arrow+card('预设错误输出','{"intent":"售后"}','warning');
if(n>=2)pic+=arrow+card(conflict?'规则 v1：存在冲突':'规则 v1：有优先级',conflict?'旧：出现“退”→售后<br>新：未购问政策→售前<br><b>未声明谁优先</b>':'明确未购买 + 咨询政策 → 售前选购<br>已购 + 明确退换 → 售后<br>信息不足 → 待澄清',conflict?'warning':'');
if(n>=3)pic+=arrow+card('结构检查',tag('intent：固定枚举')+tag('reason：字符串')+tag('不带额外文字'));
let payload=card('未运行','等待输入。'),change='还没有分类结果。';
if(n===0){payload=card('可见线索',tag('未购买')+tag('政策咨询'));change='输入拆成可用条件。';}
if(n===1){payload=card('对照预期','预期售前，预设输出售后：错误在只看“退”字。');change='暴露关键词规则的边界错误。';}
if(n===2){payload=card('规则比较',conflict?'同一句同时命中两条矛盾规则。暂停自动判定，明确优先级后再测试。':'不是删除“售后”，而是补充购买状态与诉求条件。');change=conflict?'发现规则冲突。':'让类别边界可执行。';}
if(n>=3){payload=card('预设合规输出',conflict?'暂不输出业务标签：规则设计仍未确定。':'<pre>{"intent":"售前选购",\n "reason":"明确未购，咨询退货政策"}</pre>');change='格式合规与业务正确分别检查。';}
if(n>=4){pic+=card('开发验证题进入测试',tag('下单前想确认退换条件')+tag('昨天到货坏了，给我换新'));payload+=card('预期与模拟结果',conflict?'第一题可能冲突，规则未验收。不要把随机对一次当解决。':'前者：售前选购；后者：售后。这里只展示人工预设结果，实际模型仍须运行。');change='新表达用于开发验证；看过结果并调优后，不再作最终独立验收。';}
if(n===5)payload+=card('回归清单','开发期测原失败、相近边界和正常题；定版后另用未参与选方案的最终测试，记录版本。');set(n<0?'分类前，先看任务':titles[n],conflict?'本情境演示追加规则却没解决冲突的后果。':'本演示用固定规则与预设结果说明判断依据，不代表模型真实推理。',pic,payload,change);}
function workflow(){const unknown=mode==='unknown',timeout=mode==='timeout',titles=['进入业务输入','工具返回数据','中间节点整理','回复读取字段','修复映射与未知处理','重跑三类输入'];const raw=timeout?'TIMEOUT':unknown?'activated: null':'activated: true';const mid=n>=4?raw:timeout?'error: TIMEOUT':'activated: 缺失';
let pic=card('用户输入','订单D101是否符合未激活退货条件？');if(n>=1)pic+=arrow+card('订单工具返回',raw,timeout?'warning':'');if(n>=2)pic+=arrow+card('整理节点',mid,n<4&&!timeout?'warning':'');if(n>=3)pic+=arrow+card('回复节点',timeout?'查询失败，无法确认条件':n<4?'错误：将缺失当false → 误用未激活规则':unknown?'激活状态未知 → 补查或澄清':'已激活 → 不能套未激活条件',n<4&&!timeout?'warning':'');
let payload=card('接口约定','true：已激活；false：明确未激活；null：未知。真实接口需核实际约定。'),change='尚未查询。';
if(n===0)change='输入携带订单标识，等待查询。';
if(n===1){payload=card('本次返回',timeout?'接口超时，不等于订单不存在。':unknown?'返回null，不表示未激活。':'真实字段在本例工具返回中存在。');change='拿到返回，记录其准确含义。';}
if(n===2){payload=card('字段对比',timeout?'错误信息走异常出口，不生成订单事实。':`<pre>工具：${raw}\n整理：activated 缺失</pre>`);change=timeout?'错误沿异常分支传递。':'字段在中间节点消失。';}
if(n===3){payload=card('问题定位',timeout?'按失败处理，不猜状态。':'首次偏差在整理节点；回复又把未知当否定。两个问题要分别核查。');change=timeout?'没有合法订单状态供判断。':'丢字段影响了最终业务判断。';}
if(n>=4){payload=card('修复后的契约','保留activated字段；null/缺失走未知出口；TIMEOUT走失败出口。实际退货还需核其他政策条件。');change='补传递，同时分开未知、否定与失败。';}
if(n===5){pic+=card('三类回归',tag('true → 已激活')+tag('false → 未激活')+tag('null → 未知'));payload+=card('验收边界','这三行是规则预期；页面没有执行退款，也不证明完整售后政策已验证。');change='检查修复是否覆盖正常与边界。';}
set(n<0?'看一条字段的旅程':titles[n],'字段不是装饰。上游查到的信息，必须正确传到做业务判断的位置。',pic,payload,change);}
function evaluation(){const grader=mode==='grader',titles=['准备标准答案','取得模拟输出','裁判评分','对照证据归因','只改对应问题','重评与回归'];const ids=['A','B','C','D'],expected=['售前','售后','待澄清','故障'],before=['售后','售后','待澄清','故障'];const out=n>=4&&!grader?expected:before;const grades=n>=2?out.map((x,i)=>grader&&n<4?false:x===expected[i]):null;
let pic='<div class="case-table"><table><thead><tr><th>题</th><th>预期</th><th>模拟输出</th><th>评分</th></tr></thead><tbody>'+ids.map((id,i)=>`<tr class="${grades&&!grades[i]?'row-error':''}"><td>${id}</td><td>${n>=0?expected[i]:'—'}</td><td>${n>=1?out[i]:'—'}</td><td>${grades?(grades[i]?'✓':'×'):'—'}</td></tr>`).join('')+'</tbody></table></div>';
if(n>=2)pic+=card('本次模拟通过数',`<strong class="big-number">${grades.filter(Boolean).length} / 4</strong><p>${grader&&n<4?'评分规范是占位文本；分数无效。':'仅表示这4条构造样本，不代表线上准确率。'}</p>`);
let payload=card('测试集','A：未购问退货政策<br>B：已购要求换货<br>C：只说“换一台”<br>D：机器异常，只问排查');let change='尚未取得输出。';
if(n===0)change='先写预期，避免看到结果后改答案。';
if(n===1){payload+=card('模拟结果已保存','A被判为售后，其余三条与预期一致。');change='输入与原始输出一一对应。';}
if(n===2){payload=card('裁判配置',grader?'规范：“请按[待填写规则]评分” → 四条都失败。':'固定类别比对 → A失败，B/C/D通过。');change=grader?'裁判无效，不能据0分归咎产品。':'一条可定位的失败进入清单。';}
if(n===3){payload=card('证据链',grader?'B/C/D输出与标准一致却被判错 → 检查到评分标准占位。A仍是实际分类问题。':'A含“还没买”与“退货”；粗规则只看退货关键词。原因是假设，需结合实际配置核实。');change=grader?'分开裁判错误与产品错误。':'失败事实与原因假设分开。';}
if(n>=4){payload=card('本轮修改',grader?'只补评分标准；原始模拟输出不变。重评后3/4，A仍待修。':'只补分类边界；模拟重跑A修正为售前，其余保持。');change=grader?'0/4变3/4来自重评，不是产品变强。':'4/4是模拟回归结果，不是实测承诺。';}
if(n===5){pic+=card('下一轮',tag(grader?'A仍待修复':'保留独立测试待运行')+tag('高风险边界继续覆盖'));payload+=card('报告应写','区分标准版本、产品版本、重评与重跑；小样本全过不保证上线无错。');change='保留未解决项，不用好看分数代替结论。';}
set(n<0?'先准备一套可判分的题':titles[n],grader?'演示“评分器坏了”与“产品真的错了”同时存在的情境。':'通过一张变化的结果表，追踪原始错误、修复和回归。',pic,payload,change);}
const paint=()=>{({'01':need,'02':metric,'03':prompt,'04':workflow,'06':evaluation}[topic])();$('case-prev').disabled=n<0;$('case-next').disabled=n===5;$('case-next').textContent=n<0?'开始演示 →':n===5?'演示结束':'推进一步 →';$('case-count').textContent=(n+1)+' / 6';};
$('case-next').onclick=()=>{n=Math.min(n+1,5);paint();};$('case-prev').onclick=()=>{n=Math.max(n-1,-1);paint();};$('case-reset').onclick=()=>{n=-1;paint();};$('case-mode').onchange=e=>{mode=e.target.value;n=-1;paint();};paint();showTab(1);
};
