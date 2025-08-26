export function calculateScore(correct, total) {
  if (total === 0) return "0%";
  return ((correct / total) * 100).toFixed(2) + "%";
}
