import { db, ref, update, increment } from "../lib/firebase";

export const incrementTabClickedCount = async () => {
  const countRef = ref(db, "counts/tab_clicked");
  await update(countRef, { value: increment(1) });
};

export const incrementWhyModalOpenCount = async () => {
  const countRef = ref(db, "counts/why_modal_open");
  await update(countRef, {value: increment(1)});
}