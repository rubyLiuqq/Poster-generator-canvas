const qrcode = require('qrcode');

const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const storeImg = document.getElementById('storeImg');
const storeName = document.getElementById('storeName');
const storePrice = document.getElementById('storePrice');
const peopleNum = document.getElementById('peopleNum');
const peopleTotal = document.getElementById('peopleTotal');
const imgBox = document.getElementById('img');
const canvasWidth = 828;
const canvasHeight = 680;
const tips = '发现一个好物，推荐给你呀';

class PosterGenerator {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.cWidth = this.canvas.widht = canvasWidth;
    this.cHeight = this.canvas.height = canvasHeight;
    this.storeImgWidth = 200;
    this.avatarSize = 50;
    this.padding = 10;
    this.margin = 20;
    this.qrcodeWidth = 200;
    this.radius = this.avatarSize / 2;
  }
  create(options) {
    return Promise.all([
      this._downImage(options.storeImg),
      this._downImage(options.userAvatar)
    ]).then(([store, user, qrcode]) => {
      console.log(options);

      // userAvatar
      const avatarCenter = this.padding + this.radius;
      const tmpImage = this._resizeImage(user, this.padding, this.padding, this.avatarSize, this.avatarSize);
      const pattern = this.ctx.createPattern(tmpImage, 'no-repeat');
      this.ctx.fillStyle = pattern;
      this.ctx.beginPath();
      this.ctx.arc(avatarCenter, avatarCenter, this.radius, 0, 2 * Math.PI, false);
      this.ctx.fill();

      // userName
      const avatarEndX = this.padding + this.avatarSize + this.margin / 2;
      const userNameTop = this.padding + (this.avatarSize / 2);
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = '#999';
      this.ctx.fillText(options.userName, avatarEndX, userNameTop);

      // tips
      const tipsStartY = this.padding + this.avatarSize + this.margin;
      this.ctx.font = '16px sans-serif';
      this.ctx.fillStyle = '#000';
      this.ctx.fillText(tips, this.padding, tipsStartY);

      // _drawRadiusRect
      const rectStartY = this.tipsStartY + this.margin * 3;
      this._drawRadiusRect(this.padding, rectStartY, this.cWidth - this.padding * 2, this.cHeight - this.padding * 2, this.radius);
      this.ctx.clip();
      // store
      this.ctx.drawImage(store, this.padding, avatarEndX + this.margin, this.storeImgWidth, this.storeImgWidth);
      this.ctx.strokeStyle = '#49f';
      this.ctx.lineWidth = '2';
      this.ctx.stroke();

      const storeImgEndY = this.padding + this.margin + this.avatarSize + this.storeImgWidth;

      // store Title
      // let lineWidth = this._getTextWidth(options.storeName);
      // this.ctx.fillStyle = '#bbb';
      // this.ctx.fillText(options.storeName, this.padding + 20, storeImgEndY - 50);

      // 价格，几人拼
      return this.canvas;
    });
  }
  /**
   * 画圆弧
   */
  _drawRadiusRect(x, y, w, h, r) {
    const br = r / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + br, y);   // 移动到左上角的点
    this.ctx.lineTo(x + w - br, y); // 画上边的线
    this.ctx.arcTo(x + w, y, x + w, y + br, br);  // 画右上角的弧
    this.ctx.lineTo(x + w, y + h - br); // 画右边的线
    this.ctx.arcTo(x + w, y + h, x + w - br, y + h, br);  // 画右下角的弧
    this.ctx.lineTo(x + br, y + h); // 画下边的线
    this.ctx.arcTo(x, y + h, x, y + h - br, br);// 画左下角的弧
    this.ctx.lineTo(x, y + br);// 画左边的线
    this.ctx.arcTo(x, y, x + br, y, br);// 画左上角的弧
  }
  /**
   * 计算文本长度
   * @param {Array|Object}} text
   */
  _getTextWidth(text) {
    let texts = [];
    console.log(Object.prototype.toString.call(text) === '[object Object]');
    if (Object.prototype.toString.call(text) === '[object Object]') {
      texts.push(text);
    } else {
      texts = text;
    }
    console.log(texts);
    let width = 0;
    texts.forEach(({ fontSize, text, marginLeft = 0, marginRight = 0 }) => {
      this.ctx.setFontSize(fontSize);
      width += this.ctx.measureText(text).width + marginLeft + marginRight;
    })

    return width;
  }

  _downImage(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      }
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
    });
  }

  _resizeImage(img, startX, startY, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width + startX;
    canvas.height = height + startY;
    ctx.drawImage(img, startX, startY, width, height);
    return canvas;
  }

}

button.addEventListener('click', () => {
  const posterGenerator = new PosterGenerator();

  const imgPromise = posterGenerator.create({
    userAvatar: userAvatar.value,
    userName: userName.value,
    storeImg: storeImg.value,
    storeName: storeName.value,
    storePrice: storePrice.value,
    peopleNum: peopleNum.value,
    peopleTotal: peopleTotal.value
  });

  imgPromise.then((canvas) => {
    var img = document.createElement('img');
    img.setAttribute('class', 'display');
    img.onload = () => {
      imgBox.innerHTML = '';
      imgBox.appendChild(img);
    }
    img.src = canvas.toDataURL();
  });
});
