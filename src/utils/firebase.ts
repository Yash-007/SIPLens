import { db, ref, update, increment } from "../lib/firebase";

export const incrementTabClickedCount = async () => {
  const countRef = ref(db, "counts/tab_clicked");
  await update(countRef, { value: increment(1) });
};
