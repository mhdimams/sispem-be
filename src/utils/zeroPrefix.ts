export default function padLeadingZeros(num: number, size: number): string {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}
