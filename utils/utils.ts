import dayjs from 'dayjs'

export const formatReadableDate = (dateString: string): string => {
  return dayjs(dateString).fromNow()
}

export const formatDate = (dateString: Date): string => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('de-AT', options).format(date)
}

export const formatPrice = (price: number): string => {
  return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}