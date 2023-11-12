const notFound = (req, res, next) => {
  res.status(404).send('route does not exist')
}

export { notFound }
