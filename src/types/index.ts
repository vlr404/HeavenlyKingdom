export interface Product {
  id: number
  name: string
  price: number
  cat: string
  img: string
  isNew?: boolean
}

export interface Father {
  id: number
  name: string
  rank: string
  img: string
  socials: { instagram?: string, facebook?: string, youtube?: string, telegram?: string, gmail?: string }
  bio: string
  schedule?: { date: string, times: string[] }[]
}