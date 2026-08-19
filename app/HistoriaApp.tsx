"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Stage = "checking" | "gate" | "welcome" | "preference" | "quiz" | "result" | "history";
type Preference = "female" | "male" | "all";
type Question = {
  id:number;
  figure:string;
  era:string;
  scene:string;
  situation:string;
  power:string;
  cost:string;
  prompt:string;
  options:{ label:string; text:string }[];
};
type Result = {
  name:string; era:string; role:string; tags:string[]; quote:string; values:number[]; dimensions:string[];
  core:string[]; strengths:string[]; cost:string; boundary:string; advice:string; index:number; total:number;
};
type HistoryEntry = { savedAt:string; result:Result };

const DEVICE_KEY = "historia_device_id";
const HISTORY_KEY = "historia_result_history";

function getDeviceId() {
  let value = localStorage.getItem(DEVICE_KEY);
  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, value);
  }
  return value;
}

function loadHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as HistoryEntry[]; }
  catch { return []; }
}

export function HistoriaApp() {
  const [stage, setStage] = useState<Stage>("checking");
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [preference, setPreference] = useState<Preference>("all");
  const [retakeMode, setRetakeMode] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [shareNote, setShareNote] = useState("");

  useEffect(() => {
    setHistory(loadHistory());
    fetch("/api/access/status")
      .then((response) => response.json())
      .then((data: { authorized?: boolean }) => setStage(data.authorized ? "welcome" : "gate"))
      .catch(() => setStage("gate"));
  }, []);

  async function verifyOrder() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/access/verify", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ orderNumber, deviceId:getDeviceId() }),
      });
      const data = await response.json() as { error?:string };
      if (!response.ok) throw new Error(data.error || "验证失败，请稍后重试");
      setStage("welcome");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "验证失败，请稍后重试");
    } finally { setBusy(false); }
  }

  async function choosePreference(choice: Preference) {
    setBusy(true); setError(""); setPreference(choice);
    try {
      const params = new URLSearchParams({ preference:choice, retake:retakeMode ? "1" : "0" });
      const response = await fetch(`/api/test/questions?${params.toString()}`);
      const data = await response.json() as { questions?:Question[]; error?:string };
      if (!response.ok || !data.questions) throw new Error(data.error || "题卷读取失败");
      setQuestions(data.questions); setAnswers([]); setQuestionIndex(0); setSelected(null); setStage("quiz");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "题卷读取失败");
    } finally { setBusy(false); }
  }

  async function answerQuestion(optionIndex: number) {
    if (selected !== null || busy) return;
    setSelected(optionIndex);
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = optionIndex;
    setAnswers(nextAnswers);
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((value) => value + 1); setSelected(null); window.scrollTo({ top:0, behavior:"smooth" });
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/test/result", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ questionIds:questions.map(({ id }) => id), answers:nextAnswers, preference }),
      });
      const data = await response.json() as { result?:Result; error?:string };
      if (!response.ok || !data.result) throw new Error(data.error || "档案生成失败");
      setResult(data.result);
      const nextHistory = [{ savedAt:new Date().toISOString(), result:data.result }, ...loadHistory()].slice(0, 6);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory)); setHistory(nextHistory); setStage("result");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "档案生成失败");
    } finally { setBusy(false); setSelected(null); }
  }

  function goPrevious() {
    if (questionIndex === 0) return;
    const previous = questionIndex - 1;
    setQuestionIndex(previous); setSelected(answers[previous] ?? null);
    setTimeout(() => setSelected(null), 80);
  }

  function startRetake() {
    setRetakeMode(true);
    setQuestions([]);
    setAnswers([]);
    setQuestionIndex(0);
    setSelected(null);
    setResult(null);
    setStage("preference");
  }

  async function shareResult() {
    if (!result) return;
    const text = `我的历史人物原型是${result.name}｜${result.tags.join(" · ")}。你最像谁？`;
    try {
      const canShare = typeof navigator.share === "function";
      if (canShare) await navigator.share({ title:"我的历史人物原型", text });
      else await navigator.clipboard.writeText(text);
      setShareNote(canShare ? "已调起分享" : "结果文案已复制");
    } catch { setShareNote("可以直接截图保存这份档案"); }
  }

  if (stage === "checking") return <main className="site-shell gate-shell"><div className="loading-mark">H</div><p className="loading-copy">正在核验访问档案…</p></main>;

  if (stage === "gate") return (
    <main className="site-shell gate-shell">
      <section className="paper-card gate-card">
        <div className="archive-kicker">HISTORIA · ACCESS ARCHIVE</div>
        <span className="seal" aria-hidden="true">鉴</span>
        <p className="gate-eyebrow">历史人物原型测试</p>
        <h1 className="gate-title">开启你的<br />历史人物档案</h1>
        <p className="gate-copy">购买用户可使用小红书订单号进入；受邀体验用户可输入朋友体验码。首次验证后都会绑定当前设备。</p>
        <label className="order-label" htmlFor="order-number">小红书订单号 / 朋友体验码</label>
        <input id="order-number" className="order-input" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value.replace(/\s/g,""))} placeholder="请输入完整订单号或体验码" autoCapitalize="characters" autoComplete="off" />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button" type="button" disabled={orderNumber.length < 8 || busy} onClick={verifyOrder}>{busy ? "正在核验…" : "验证并开启档案"}</button>
        <div className="gate-help"><span>一号一设备</span><i /><span>体验限时限次</span><i /><span>请勿转发</span></div>
        <p className="order-guide">正式订单可在“小红书 → 我 → 订单 → 订单详情”中查看；体验码有效期24小时，最多完成3次。</p>
      </section>
    </main>
  );

  if (stage === "welcome") return (
    <main className="site-shell">
      <section className="paper-card welcome-card">
        <div className="archive-kicker">HISTORIA · ARCHIVE NO. 01</div>
        <div className="latin-subtitle">A HISTORICAL PERSONALITY PROTOTYPE</div>
        <h1 className="display-title">HISTORIA</h1>
        <p className="cn-title">历史人物原型</p>
        <div className="welcome-copy"><p>20 位历史人物，20 个真实抉择</p><p>看清他们面对的局、动用的力量与付出的代价</p><p>循着每一次取舍，照见与你相近的历史原型</p></div>
        <div className="ornament">·　·　·</div>
        <button className="primary-button" type="button" onClick={() => { setRetakeMode(false); setStage("preference"); }}>开始探索</button>
        <button className="secondary-button" type="button" onClick={() => setStage("history")}>↶　查看历史记录</button>
        <div className="intro-note"><span>HISTORIA · IMMERSION NOTE</span><h2>以身入境，照见选择的来处</h2><p>历史现场是入口，真正被凝视的始终是你。这里没有知识题，也没有标准答案。</p></div>
      </section>
    </main>
  );

  if (stage === "preference") return (
    <main className="site-shell gate-shell">
      <section className="paper-card preference-card">
        <header className="section-header"><span>ARCHIVE GATE</span><span>人物卷宗</span></header>
        <p className="section-eyebrow">{retakeMode ? "再次入卷" : "入卷之前"}</p><h1>{retakeMode ? "选择重测人物卷" : "选择这次更有代入感的人物卷"}</h1><p className="section-copy">{retakeMode ? "这次题卷已重新编排，会混入此前未出现的历史抉择。" : "三个卷会进入不同的历史现场；人物范围只影响样本，不会替你决定答案。"}</p>
        <div className="preference-list">
          <button type="button" onClick={() => choosePreference("female")} disabled={busy}><b>女</b><span><strong>女性人物卷</strong><small>女帝、才女、女将与改革者</small></span></button>
          <button type="button" onClick={() => choosePreference("male")} disabled={busy}><b>男</b><span><strong>男性人物卷</strong><small>帝王、谋臣、诗人与行动者</small></span></button>
          <button type="button" onClick={() => choosePreference("all")} disabled={busy}><b>合</b><span><strong>合卷匹配</strong><small>不限定人物方向，在全卷中择近者</small></span></button>
        </div>
        {busy && <p className="center-note">正在展开人物卷宗…</p>}{error && <p className="form-error">{error}</p>}
      </section>
    </main>
  );

  if (stage === "quiz" && questions[questionIndex]) {
    const question = questions[questionIndex];
    return (
      <main className="site-shell quiz-shell">
        <section className="paper-card quiz-card">
          <header className="section-header"><span>SCENE JUDGEMENT</span><span>{String(questionIndex + 1).padStart(2,"0")} / {questions.length}</span></header>
          <div className="progress"><i style={{ width:`${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
          <p className="scene-label">{question.figure}<span>{question.era} · {question.scene}</span></p>
          <div className="history-brief" aria-label={`${question.figure}的历史情境`}>
            <div><small>面对的局</small><p>{question.situation}</p></div>
            <div><small>使用的力量</small><p>{question.power}</p></div>
            <div><small>付出的代价</small><p>{question.cost}</p></div>
          </div>
          <p className="choice-kicker">轮到你作答</p>
          <h1 className="question-title">{question.prompt}</h1>
          <div className="option-list">
            {question.options.map((option, index) => <button key={option.label} className={selected === index ? "selected" : ""} type="button" onClick={() => answerQuestion(index)}><b>{option.label}.</b><span>{option.text}</span></button>)}
          </div>
        </section>
        <nav className="quiz-nav"><button type="button" disabled={questionIndex === 0} onClick={goPrevious}>上一题</button><button type="button" onClick={() => setStage("welcome")}>回到首页</button><span>选择后自动跳转</span></nav>
        {busy && <div className="result-loading">正在比对人物卷宗…</div>}{error && <p className="form-error">{error}</p>}
      </main>
    );
  }

  if (stage === "history") return (
    <main className="site-shell">
      <section className="paper-card history-card">
        <header className="section-header"><span>ARCHIVE HISTORY</span><button onClick={() => setStage("welcome")}>返回</button></header>
        <h1>你的历史档案</h1><p className="section-copy">结果只保存在当前浏览器中。</p>
        {history.length === 0 ? <div className="empty-history"><span>卷</span><p>还没有完成过测试</p></div> : history.map((entry) => <button className="history-item" key={entry.savedAt} onClick={() => { setResult(entry.result); setStage("result"); }}><span><small>{new Date(entry.savedAt).toLocaleDateString("zh-CN")}</small><strong>{entry.result.name}</strong></span><em>{entry.result.era} · {entry.result.role}　›</em></button>)}
        <button className="primary-button" onClick={startRetake}>开始一次新探索</button>
      </section>
    </main>
  );

  return result ? <ResultView result={result} shareNote={shareNote} onShare={shareResult} onRestart={startRetake} /> : null;
}

function ResultView({ result, shareNote, onShare, onRestart }:{ result:Result; shareNote:string; onShare:()=>void; onRestart:()=>void }) {
  const polygon = useMemo(() => {
    const points = result.values.map((value, index) => {
      const angle = -Math.PI / 2 + index * Math.PI / 3; const radius = (value / 100) * 43;
      return `${50 + Math.cos(angle) * radius}% ${50 + Math.sin(angle) * radius}%`;
    });
    return `polygon(${points.join(",")})`;
  }, [result.values]);
  return (
    <main className="site-shell result-shell">
      <article className="paper-card result-card" id="result-report">
        <header className="result-top"><span>HISTORIA</span><span>No.{String(result.index).padStart(2,"0")} / {result.total}</span></header>
        <p className="result-eyebrow">你的历史人物原型是</p><h1>{result.name}</h1><p className="result-role">{result.era} · {result.role}</p><blockquote>“{result.quote}”</blockquote>
        <div className="tag-list">{result.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <ResultSection title="你的核心轮廓">{result.core.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</ResultSection>
        <ResultSection title="你的行为画像">
          <div className="radar-wrap">
            <div className="radar">
              <div className="radar-grid grid-one"/><div className="radar-grid grid-two"/><div className="radar-grid grid-three"/>
              <div className="radar-shape" style={{ clipPath:polygon } as CSSProperties}/><i className="axis a1"/><i className="axis a2"/><i className="axis a3"/>
            </div>
          </div>
          <div className="dimension-grid">{result.dimensions.map((dimension, index) => <div key={dimension}><span>{dimension}<b>{result.values[index]}%</b></span><i><em style={{ width:`${result.values[index]}%` }}/></i></div>)}</div>
        </ResultSection>
        <ResultSection title={`你与${result.name}的相照之处`}>
          <ol className="strength-list">{result.strengths.map((strength, index) => <li key={strength}><span>0{index + 1}</span><div><b>{strength}</b><p>{index === 0 ? "这是你最自然调用的力量，也是局面复杂时最先出现的反应。" : index === 1 ? "当外界缺少确定答案，你会用这份能力守住自己的节奏。" : "它让你不仅看见问题，也愿意把判断变成真实行动。"}</p></div></li>)}</ol>
        </ResultSection>
        <ResultSection title="优势 · 代价 · 边界 · 建议">
          <div className="insight-stack"><div><small>优势</small><p>{result.strengths.join("；")}。</p></div><div><small>代价</small><p>{result.cost}</p></div><div><small>边界</small><p>{result.boundary}</p></div><div className="advice"><small>此刻建议</small><p>{result.advice}</p></div></div>
        </ResultSection>
        <footer className="result-actions"><button onClick={onShare}>截图 / 分享</button><button onClick={onRestart}>重新探索</button></footer>
        {shareNote && <p className="share-note">{shareNote}</p>}
        <p className="disclaimer">本结果用于自我观察与娱乐，不构成心理诊断或职业建议。</p>
      </article>
    </main>
  );
}

function ResultSection({ title, children }:{ title:string; children:React.ReactNode }) {
  return <section className="result-section"><h2><span>⌁</span>{title}</h2>{children}</section>;
}
