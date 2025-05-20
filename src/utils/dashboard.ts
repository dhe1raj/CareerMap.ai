
// Check if this is the first login
export const isFirstLogin = () => {
  const visited = localStorage.getItem('hasVisitedBefore');
  if (!visited) {
    localStorage.setItem('hasVisitedBefore', 'true');
    return true;
  }
  return false;
};

// Get user initials from name
export const getUserInitials = (name?: string | null) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};
