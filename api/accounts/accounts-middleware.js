const Accounts = require('./accounts-model');

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;

  if (!name || !budget && budget === undefined) {
    res.status(400).json({ message: "name and budget are required" })
    return;
  }else if (typeof name !== "string") {
    res.status(400).json({ message: "name of account must be a string" })
    return;
  }else if (name.trim().length < 3 || name.trim().length > 100) {
    res.status(400).json({ message: "name of account must be between 3 and 100" })
    return;
  }else if (budget < 0 || budget > 1000000) {
    res.status(400).json({ message: "budget of account is too large or too small" })
    return;
  }else if (typeof budget !== "number" || budget === NaN) {
    res.status(400).json({ message: "must be a number" })
    return;
  }

  next();
}

exports.checkAccountNameUnique = async (req, res, next) => {
  const listOfAccounts = await Accounts.getAll();
  const existingAccount = listOfAccounts.filter(account => account.name === req.body.name);

  if (existingAccount[0]) {
    res.status(400).json({ message: "that name is taken" })
    return;
  }
  next();
}

exports.checkAccountId = (req, res, next) => {
  if (!req.user) {
    res.status(404).json({ message: "account not found" })
    return;
  }
  next();
}
