import { formatISO9075 } from 'date-fns'

export const formatDate = (rawString) => {
  return new Date(formatISO9075(new Date(rawString))).toDateString()
}
