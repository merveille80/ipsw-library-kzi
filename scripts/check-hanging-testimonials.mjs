import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

// Exercise the shipped controller without requiring a browser or dependencies.
class Element {
  constructor() {
    this.listeners = new Map();
    this.attributes = new Map();
    this.classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(name => this.classes.add(name)),
      remove: (...names) => names.forEach(name => this.classes.delete(name)),
      toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name),
    };
    this.style = {};
    this.captured = new Set();
  }
  addEventListener(name, handler) {
    const handlers = this.listeners.get(name) || [];
    handlers.push(handler);
    this.listeners.set(name, handlers);
  }
  emit(name, props = {}) {
    const event = { isPrimary: true, button: 0, pointerId: 1, pointerType: "mouse", clientX: 140, clientY: 250, timeStamp: 0, detail: 1, preventDefault() {}, ...props };
    for (const handler of this.listeners.get(name) || []) handler(event);
  }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name); }
  getBoundingClientRect() { return { left: 0, top: 0, width: 280, height: 500 }; }
  setPointerCapture(id) { this.captured.add(id); }
  hasPointerCapture(id) { return this.captured.has(id); }
  releasePointerCapture(id) { this.captured.delete(id); this.emit("lostpointercapture", { pointerId: id }); }
}

const source = await readFile(new URL("../hanging-testimonials.js", import.meta.url), "utf8");

function setup({ reduced = false, fine = true } = {}) {
  const section = new Element();
  const card = new Element();
  const pendulum = new Element();
  const button = new Element();
  const front = new Element();
  const back = new Element();
  back.id = "review-jean-marc";
  card.dataset = { person: "Jean-Marc K." };
  const children = { ".hanging-card__pendulum": pendulum, ".hanging-card__toggle": button, ".hanging-card__front": front, ".hanging-card__back": back };
  card.querySelector = selector => children[selector];
  section.querySelectorAll = () => [card];
  const document = new Element();
  document.hidden = false;
  document.querySelector = () => section;
  const reducedMotion = new Element();
  reducedMotion.matches = reduced;
  const finePointer = new Element();
  finePointer.matches = fine;
  const frames = new Map();
  let id = 0;
  let now = 0;
  const context = {
    document,
    window: { matchMedia: query => query.includes("reduced-motion") ? reducedMotion : finePointer },
    getComputedStyle: () => ({ getPropertyValue: () => "-3deg" }),
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: frame => frames.delete(frame),
  };
  vm.runInNewContext(source, context);
  function step(milliseconds = 16.67) {
    now += milliseconds;
    const current = [...frames.values()];
    frames.clear();
    current.forEach(callback => callback(now));
  }
  function settle() {
    for (let count = 0; frames.size && count < 400; count++) step();
    assert.equal(frames.size, 0, "pendulum must stop scheduling frames at rest");
    assert.ok(Math.abs(parseFloat(pendulum.style.transform.slice(7)) + 3) < .02, "pendulum returns to its suspension angle");
  }
  return { section, card, pendulum, button, front, back, frames, document, reducedMotion, finePointer, step, settle };
}

const ui = setup();
assert.ok(ui.section.classes.has("hanging-ready"));
assert.equal(ui.frames.size, 0, "no perpetual idle animation");
assert.equal(ui.back.inert, true);
ui.button.emit("click", { detail: 0 });
assert.equal(ui.button.getAttribute("aria-expanded"), "true");
assert.equal(ui.front.inert, true);
assert.equal(ui.back.inert, false);
assert.equal(ui.button.getAttribute("aria-describedby"), ui.back.id);
ui.button.emit("keydown", { key: "Escape" });
assert.equal(ui.button.getAttribute("aria-expanded"), "false");

// Drag, interrupt the return, then release: no jump at the new grab and no
// accidental flip from the browser's synthetic click after the drag.
ui.button.emit("pointerdown", { timeStamp: 10 });
ui.button.emit("pointermove", { clientX: 175, timeStamp: 35 });
ui.button.emit("pointermove", { clientX: 190, timeStamp: 60 });
assert.ok(ui.card.classes.has("is-dragging"));
ui.button.emit("pointerup", { timeStamp: 65 });
ui.button.emit("click");
assert.equal(ui.button.getAttribute("aria-expanded"), "false");
ui.step();
const interruptedAngle = ui.pendulum.style.transform;
ui.button.emit("pointerdown", { clientX: 180, timeStamp: 80 });
assert.equal(ui.pendulum.style.transform, interruptedAngle);
assert.equal(ui.frames.size, 0);
ui.button.emit("pointermove", { clientX: 180, timeStamp: 90 });
assert.equal(ui.pendulum.style.transform, interruptedAngle);
ui.button.emit("pointercancel", { timeStamp: 95 });
assert.equal(ui.button.captured.size, 0);
ui.settle();

// Pointer capture loss and a long frame cannot leave a stuck gesture or NaN.
ui.button.emit("pointerdown", { timeStamp: 100 });
ui.button.emit("pointermove", { clientX: 210, timeStamp: 120 });
ui.button.releasePointerCapture(1);
ui.step(10000);
assert.ok(!ui.pendulum.style.transform.includes("NaN"));
ui.settle();
ui.button.emit("click", { detail: 0 });
assert.equal(ui.button.getAttribute("aria-expanded"), "true", "keyboard remains available after cancellation");

const touch = setup({ fine: false });
touch.button.emit("pointerdown", { pointerType: "touch" });
touch.button.emit("pointermove", { pointerType: "touch", clientX: 220 });
assert.equal(touch.button.captured.size, 0, "leave touch scrolling to the scroll container");
assert.equal(touch.frames.size, 0);
touch.button.emit("pointerup", { pointerType: "touch" });
assert.ok(!touch.card.classes.has("is-pressed"));
touch.button.emit("click");
assert.equal(touch.button.getAttribute("aria-expanded"), "true");

const quiet = setup({ reduced: true });
quiet.button.emit("pointermove", { clientX: 220 });
quiet.button.emit("click");
assert.equal(quiet.frames.size, 0);
assert.equal(quiet.pendulum.style.transform, "rotate(0deg)");
assert.equal(quiet.back.inert, false, "reduced motion still exposes the selected review");
ui.button.emit("pointermove", { clientX: 220 });
ui.reducedMotion.matches = true;
ui.reducedMotion.emit("change");
assert.equal(ui.frames.size, 0);
assert.equal(ui.pendulum.style.transform, "rotate(0deg)");
ui.reducedMotion.matches = false;
ui.reducedMotion.emit("change");
ui.button.emit("pointermove", { clientX: 220 });
ui.document.hidden = true;
ui.document.emit("visibilitychange");
assert.equal(ui.frames.size, 0, "hidden tabs do no animation work");
console.log("Hanging testimonials: keyboard, flip state, drag interruption, cancellation, spring settling, touch scrolling and reduced motion passed.");
