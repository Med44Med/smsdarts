export const offers: {
  name: string;
  message: string;
  price: number;
  period: string;
  sale?: string;
}[] = [
  {
    name: "Pro Plan - Month",
    message: "1000 message/Month",
    price: 1500,
    period: "Month",
  },
  {
    name: "Pro Max Plan - Month",
    message: "5000 message/Month",
    price: 5000,
    period: "Month",
  },
  {
    name: "Pro Plan - Year",
    message: "1000 message/Month",
    sale: "2 Months Free",
    price: 15000,
    period: "Year",
  },
  {
    name: "Pro Max Plan - Year",
    message: "5000 message/Month",
    sale: "2 Months Free",
    price: 50000,
    period: "Year",
  },
];
