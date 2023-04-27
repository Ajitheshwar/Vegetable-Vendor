export type DayDashboard = {
  revenue: number,
  profit: number,
  loss: number,
  customers: number,
  orders: number
}

export type ProductDashboard = {
  _id: string,
  product: string,
  date: string,
  category: string,
  quantity: number,
  costPrice: number,
  sellingPrice: number,
  wasted: number,
  image: string
}

export type BarVertical2dType = {
  name: string,
  series: {
    name: string,
    value: number
  }[]
}

export type TotalDashboard = {
  totalRevenue: number,
  totalLoss: number,
  totalProfit: number,
  netIncome: number
}

export type MonthDashboard = {
  profit: number,
  loss: number,
  date: string,
}

export type CategoryDashboard = {
  _id : string,
  profit : number,
  loss : number,
  revenue : number
}