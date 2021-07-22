const router = require('express').Router();
const Accounts = require('./accounts-model');
const {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique
} = require('./accounts-middleware');

router.get('/', async (req, res, next) => {
  await Accounts.getAll()
    .then(accounts => {
      accounts
      ? res.status(200).json(accounts)
      : next()
    })
    .catch(err => next(err))
})

router.get('/:id', async (req, res, next) => {
  await Accounts.getById(req.params.id)
    .then(account => {
      req.user = account;
      account
      ? res.status(200).json(account)
      : next()
    })
    .catch(err => next(err))
}, checkAccountId)

router.post('/', checkAccountNameUnique, checkAccountPayload, async (req, res, next) => {
  const trimmedName = req.body;
  trimmedName.name = trimmedName.name.trim();
  console.log(trimmedName)
  await Accounts.create(trimmedName)
    .then(newAccount => {
      newAccount
      ? res.status(201).json(newAccount)
      : next()
    })
    .catch(err => next(err))
})

router.put('/:id', checkAccountPayload, async (req, res, next) => {
  await Accounts.updateById(req.params.id, req.body)
    .then(updatedAccount => {
      updatedAccount
      ? res.status(200).json(updatedAccount)
      : next()
    })
    .catch(err => next(err))
}, checkAccountId);

router.delete('/:id', async (req, res, next) => {
  await Accounts.deleteById(req.params.id)
    .then(deletedAccount => {
      deletedAccount
      ? res.status(200).json(deletedAccount)
      : next()
    })
    .catch(err => next(err))
}, checkAccountId)

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(500).json({ message: err.message, stack: err.stack })
})

module.exports = router;
