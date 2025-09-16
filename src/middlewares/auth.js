const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("Check your credentials and try again");
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xyzr";
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("Check your credentials and try again");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
