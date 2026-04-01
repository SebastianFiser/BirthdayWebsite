// Simple confetti effect on page load
(function () {
  const colors = ['#ff6b9d', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6348'];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const rotation = Math.round(Math.random() * 720);
    const keyframeName = `fall-${i}`;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${keyframeName} {
        to {
          transform: translateY(110vh) rotate(${rotation}deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    const piece = document.createElement('div');
    piece.style.cssText = `
      position: fixed;
      width: ${Math.random() * 8 + 6}px;
      height: ${Math.random() * 8 + 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      top: -10px;
      left: ${Math.random() * 100}vw;
      opacity: ${Math.random() * 0.8 + 0.2};
      pointer-events: none;
      z-index: 999;
      animation: ${keyframeName} ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s forwards;
    `;
    document.body.appendChild(piece);
  }
})();
