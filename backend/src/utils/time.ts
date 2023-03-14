export const addOneDay = (date = new Date()) => {
  date.setDate(date.getDate() + 1);
  return date;
};

export const firstDayOfMonth = () => {
  const currentDate = new Date();

  // Đặt ngày là 1 để lấy ngày đầu tiên của tháng
  currentDate.setDate(1);

  // Lấy ngày đầu tiên của tháng
  const firstDayOfMonth = currentDate.toISOString().slice(0, 10);
  return firstDayOfMonth;
};

export const lastDayOfMonth = () => {
  // Lấy ngày hiện tại
  const currentDate = new Date();

  // Lấy ngày đầu tiên của tháng tiếp theo
  const firstDayOfNextMonth: any = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  // Trừ đi 1 ngày để lấy ngày cuối cùng của tháng hiện tại
  const lastDayOfMonth = new Date(firstDayOfNextMonth - 1)
    .toISOString()
    .slice(0, 10);

  return lastDayOfMonth;
};
