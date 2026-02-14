const PhoneFormat = (phone: string | number | undefined) => {
  const phoneStr = phone?.toString();
  if (!phoneStr) return ""; 
  if (phoneStr.startsWith("+213") && phoneStr.length === 13) {
    const inter = phoneStr.slice(0, 4);
    const local = phoneStr.slice(4, 7);
    const num1 = phoneStr.slice(7, 9);
    const num2 = phoneStr.slice(9, 11);
    const num3 = phoneStr.slice(11, 13);
    return `${inter} ${local} ${num1} ${num2} ${num3}`;
  }
  if (phoneStr.startsWith("00213") && phoneStr.length === 14) {
    const zeros = phoneStr.slice(0, 2);
    const inter = phoneStr.slice(2, 5);
    const local = phoneStr.slice(5, 8);
    const num1 = phoneStr.slice(8, 10);
    const num2 = phoneStr.slice(10, 12);
    const num3 = phoneStr.slice(12, 14);
    return `${zeros} ${inter} ${local} ${num1} ${num2} ${num3}`;
  }
  return phoneStr;
};

export default PhoneFormat;
