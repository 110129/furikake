var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// 画像使うパターン
// @see https://www.otwo.jp/blog/canvas_sakura/
var flakeCount = 20;      // 描画する画像の数
var imgArray = [];        // 画像の情報を格納
var canvasWidth = 800;    // canvasタグに指定したwidth
var canvasHeight = 500;   // canvasタグに指定したheight
var imgBaseWidth = 15;    // 画像の基本サイズ横幅
var imgBaseHeight = 18.5; // 画像の基本サイズ立幅
var aspectMax = 1.5;      // アスペクト比計算時の最大値
var aspectMin = 0.5;      // アスペクト比計算時の最小値
var speedMax = 2.5;       // 落下速度の最大値
var speedMin = 0.5;       // 落下速度の最小値
var angleAdd = 4;         // 画像角度への加算値

var flake = new Image();
flake.src = "./sakura01.png";

document.getElementById("file").addEventListener("change", function (e) {
  canvas.style.display = 'block';
  var file = e.target.files;
  var reader = new FileReader();

  reader.readAsDataURL(file[0]);

  reader.onload = function () {
    if (typeof drawUpToCount !== 'undefined') clearTimeout(drawUpToCount);
    var src = reader.result;
    var img = new Image();
    img.src = src;
    img.onload = function () {
      // キャンバスサイズをアップロードした画像に合わせる
      // canvas.width = img.width;
      // canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    setImages();
    // 画像変わったらちゃんと更新したいのでここで読んでる プレビュー出したい
    encoder = new GIFEncoder();
    encoder.setRepeat(0); //0  -> loop forever
    encoder.setDelay(3); //go to next frame every n milliseconds
    encoder.start();
    var count = 0; // addFrameを永遠に繰り返しちゃうので回数決める

    drawUpToCount = setInterval(function(){
      ctx.globalAlpha = 1.0;
      ctx.clearRect(0,0,canvasWidth,canvasHeight);
      ctx.drawImage(img, 0,0)
      ctx.globalAlpha = 0.4;
      // draw petal randomly on canvas up to flakeCount
      for(index = 0;index < flakeCount;index++){
        imgArray[index].posy += imgArray[index].speedy;
        imgArray[index].angle += Math.random()*angleAdd;
        cos = Math.cos(imgArray[index].angle * rad);
        sin = Math.sin(imgArray[index].angle * rad);
        ctx.setTransform(cos, sin, sin, cos, imgArray[index].posx, imgArray[index].posy);
        ctx.drawImage(flake, 0, 0 , imgArray[index].sizew , imgArray[index].sizeh);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // 範囲外に描画された画像を上に戻す
        if(imgArray[index].posy >= canvasHeight){
          imgArray[index].posy = -imgArray[index].sizeh;
        }
      }
      // 必要数が揃った状態でフレームに収める GIFはコマを少し飛ばす
      if (count < 200 && (count % 5 == 0)) {
        console.log(count + '回目のloop')
        encoder.addFrame(ctx)
        count++;
      } else if (count > 500) {
        // canvasの描画は実行し続けるがキャプチャはここで終わり
        encoder.finish();
      } else {
        count++;
      }
    },10);
    // flow_start();
  };
}, false);

// 画像のパラメーターを設定
function setImages(){
  var aspect = 0;
  for(var i = 0;i < flakeCount;i++){
    // 画像サイズに掛けるアスペクト比を0.5~1.5倍でランダムで生成
    aspect = Math.random()*(aspectMax-aspectMin)+aspectMin;
    imgArray.push({
      "posx": Math.random()*canvasWidth,
      "posy": Math.random()*canvasHeight,
      "sizew": imgBaseWidth*aspect,
      "sizeh": imgBaseHeight*aspect,
      "speedy": Math.random()*(speedMax-speedMin)+speedMin,
      "angle": Math.random()*360,
    });
  }
}

// 描画、パラメーターの更新
var index = 0;
var cos = 0;
var sin = 0;
var rad = Math.PI / 180;
function flow(){
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  ctx.drawImage(img, 0,0)
  for(index = 0;index < flakeCount;index++){
    imgArray[index].posy += imgArray[index].speedy;
    imgArray[index].angle += Math.random()*angleAdd;
    cos = Math.cos(imgArray[index].angle * rad);
    sin = Math.sin(imgArray[index].angle * rad);
    ctx.setTransform(cos, sin, sin, cos, imgArray[index].posx, imgArray[index].posy);
    ctx.drawImage(flake, 0, 0 , imgArray[index].sizew , imgArray[index].sizeh);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 範囲外に描画された画像を上に戻す
    if(imgArray[index].posy >= canvasHeight){
      imgArray[index].posy = -imgArray[index].sizeh;
    }
  }
}

// https://github.com/antimatter15/jsgif
function convertToGif() {
  // var binary_gif = encoder.stream().getData() //notice this is different from the as3gif package!
  // var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
  // ダウンロード
  encoder.download("download.gif");
}