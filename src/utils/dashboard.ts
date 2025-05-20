
// Check if this is the first login
export const isFirstLogin = () => {
  const visited = localStorage.getItem('hasVisitedBefore');
  if (!visited) {
    localStorage.setItem('hasVisitedBefore', 'true');
    return true;
  }
  return false;
};
