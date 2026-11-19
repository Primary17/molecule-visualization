import { useEffect, useRef, useState } from "react";

const OPEN_MS = 3500;
const FADE_MS = 1400;

const MOUSE_HINTS = [
  ["Ліва кнопка", "обертання"],
  ["Права кнопка", "зсув камери"],
  ["Колесо", "масштаб"],
  ["Затиснуте колесо", "масштаб рухом угору або вниз"],
];

const TOUCH_HINTS = [
  ["Один палець", "обертання"],
  ["Щипок", "масштаб"],
  ["Два пальці", "зсув камери"],
];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePointerKind() {
  const [kind, setKind] = useState("mouse");

  useEffect(() => {
    const fine = window.matchMedia("(any-pointer: fine)");
    const coarse = window.matchMedia("(any-pointer: coarse)");
    const update = () => {
      if (fine.matches && coarse.matches) setKind("both");
      else if (coarse.matches) setKind("touch");
      else setKind("mouse");
    };
    update();
    fine.addEventListener("change", update);
    coarse.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);

  return kind;
}

function HintList({ title, hints }) {
  return (
    <div className="stage-help__group">
      {title ? <p className="stage-help__group-title">{title}</p> : null}
      <dl>
        {hints.map(([name, action]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{action}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function stageIsReadable(entry) {
  if (!entry.isIntersecting) return false;
  const needed = Math.min(160, entry.boundingClientRect.height * 0.4);
  return entry.intersectionRect.height >= needed;
}

export default function ViewerHelp() {
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [dimmed, setDimmed] = useState(false);
  const openedOnce = useRef(false);
  const fadeTimer = useRef(0);
  const helpRef = useRef(null);
  const kind = usePointerKind();

  useEffect(() => {
    if (!mounted || openedOnce.current) return undefined;
    const stage = helpRef.current?.closest(".stage");
    if (!stage) return undefined;

    let collapseTimer = 0;
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some(stageIsReadable)) return;
        started = true;
        observer.disconnect();
        collapseTimer = window.setTimeout(() => {
          openedOnce.current = true;
          if (prefersReducedMotion()) setMounted(false);
          else setLeaving(true);
        }, OPEN_MS);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    observer.observe(stage);
    return () => {
      observer.disconnect();
      window.clearTimeout(collapseTimer);
    };
  }, [mounted]);

  useEffect(() => {
    if (mounted || prefersReducedMotion()) return undefined;
    fadeTimer.current = window.setTimeout(() => setDimmed(true), FADE_MS);
    return () => window.clearTimeout(fadeTimer.current);
  }, [mounted]);

  useEffect(() => () => window.clearTimeout(fadeTimer.current), []);

  function scheduleFade() {
    window.clearTimeout(fadeTimer.current);
    if (prefersReducedMotion()) {
      setDimmed(false);
      return;
    }
    fadeTimer.current = window.setTimeout(() => setDimmed(true), FADE_MS);
  }

  function reveal() {
    window.clearTimeout(fadeTimer.current);
    setDimmed(false);
  }

  function collapse() {
    openedOnce.current = true;
    if (prefersReducedMotion()) {
      setLeaving(false);
      setMounted(false);
      return;
    }
    setLeaving(true);
  }

  function finishLeave(event) {
    if (event.target !== event.currentTarget || event.animationName !== "help-out") return;
    setLeaving(false);
    setMounted(false);
  }

  function expand() {
    reveal();
    setLeaving(false);
    setMounted(true);
  }

  if (mounted) {
    return (
      <div
        ref={helpRef}
        className={leaving ? "stage-help is-leaving" : "stage-help"}
        role="dialog"
        aria-label="Керування моделлю"
        onAnimationEnd={finishLeave}
      >
        <div className="stage-help__card">
          <p className="stage-help__title">Керування моделлю</p>
          <div className={kind === "both" ? "stage-help__columns" : "stage-help__columns is-single"}>
            {kind === "touch" ? null : <HintList title={kind === "both" ? "Миша" : null} hints={MOUSE_HINTS} />}
            {kind === "mouse" ? null : <HintList title={kind === "both" ? "Дотик" : null} hints={TOUCH_HINTS} />}
          </div>
          <button type="button" className="stage-help__close" onClick={collapse}>
            Згорнути
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={dimmed ? "stage-help__toggle is-dim" : "stage-help__toggle"}
      aria-label="Підказка керування моделлю"
      onMouseEnter={reveal}
      onMouseLeave={scheduleFade}
      onFocus={reveal}
      onBlur={scheduleFade}
      onClick={expand}
    >
      ⓘ
    </button>
  );
}
