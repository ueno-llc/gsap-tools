function round(number) {
  if (!number) {
    return '0.00';
  }

  const nbr = Math.round(`${number}e2`) + 'e-2'; // eslint-disable-line
  const { length } = nbr.toString();

  let val;

  if (length === 3) {
    val = `${nbr}0`;
  } else if (length === 1) {
    val = `${nbr}.00`;
  } else {
    val = nbr;
  }

  return Number(val);
}

export default round;
