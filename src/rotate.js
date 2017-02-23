
export default function rotate(canvas, width, height, orientation = 1) {
  /* eslint no-param-reassign: 0*/
  const ctx = canvas.getContext('2d');
  if ([5, 6, 7, 8].indexOf(orientation) > -1) {
    canvas.width = height;
    canvas.height = width;
  } else {
    canvas.width = width;
    canvas.height = height;
  }
  switch (orientation) {
    default:
      break;
    case 2:
           // horizontal flip
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
           // 180° rotate left
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4:
           // vertical flip
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5:
           // vertical flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
           // 90° rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7:
           // horizontal flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8:
           // 90° rotate left
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
  }
}
