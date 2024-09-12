// Main idea: Resize về size numCols x numRows. 
console.warn = () => {};
let sun;
let displaySun;

let vidRatio;
let displayW = 900;
let displayH; // Calculate later to match ratio of capture video

let numCols = 900/60;
let numRows;

let gridW;
let gridH;

let playing = false;
let baiTho = [];
let isMode1 = true;

const poems = [
  "ngóng", "tiếc nuối", "thống khổ", "bức xúc", "đau đáu", "ngao ngán", "ngột ngạt", "mơ",
  "bất khả kháng", "điều tất yếu", "bất đắc dĩ", "sắp", "nhưng", "tạm", "mỹ quan", "xót xa",
  "tăng", "phủ", "mở", "bổ sung", "tái lập", "giải cứu", "bù", "hy sinh", "trách nhiệm",
  "đề án", "phạt", "chính sách", "mảng xanh", "quyết liệt", "ban hành", "kế hoạch",
  "đảm bảo", "ươm", "dời", "giải tỏa", "loay hoay", "dịch chuyển", "trụi", "phương án",
  "chặt", "bứng", "đốn", "bức từ", "tia", "trên giấy", "khai tử",
  "nghèo", "ngóng", "tiếc nuối", "thống khổ", "bức xúc", "đau đáu", "ngao ngán", "ngột ngạt", "mơ",
  "bất khả kháng", "điều tất yếu", "bất đắc dĩ", "sắp", "nhưng", "tạm", "mỹ quan", "xót xa",
  "tăng", "phủ", "mở", "bổ sung", "tái lập", "giải cứu", "bù", "hy sinh", "trách nhiệm",
  "đề án", "phạt", "chính sách", "mảng xanh", "quyết liệt", "ban hành", "kế hoạch",
  "đảm bảo", "ươm", "dời", "giải tỏa", "loay hoay", "dịch chuyển", "trụi", "phương án",
  "chặt", "bứng", "đốn", "bức từ", "tia", "trên giấy", "khai tử",
  "nghèo", "tiếc nuối", "thống khổ", "bức xúc", "đau đáu", "ngao ngán", "ngột ngạt", "mơ",
  "bất khả kháng", "điều tất yếu", "bất đắc dĩ", "sắp", "nhưng", "tạm", "mỹ quan", "xót xa",
  "tăng"
];

let poemDict = {};


function preload() {
  sun = createCapture(VIDEO);
  displaySun = createCapture(VIDEO);
  // sun = createVideo("assets/hẻm dưới cầu tham lương.mp4");
  // displaySun = createVideo("assets/hẻm dưới cầu tham lương.mp4");
  // sun = loadImage("/assets/Sun (1).png");
}

function setup() {

  // Calculate the ratio of original capture video
  vidRatio = sun.width/sun.height;
  numRows = int(numCols / vidRatio);
  sun.size(numCols, numRows);
  
  // Calculate display window
  displayH = displayW / vidRatio;
  // console.log(displayH);
  createCanvas(displayW, displayH);

  // Calculate grid
  gridW = width / numCols;
  gridH = height / numRows;

  sun.hide();
  sun.loop();

  displaySun.hide();
  displaySun.loop();

  for (let i=0; i<poems.length; i++) {
    poemDict[poems[i]] = 0;
  }

  // console.log(gridW, gridH);
}

function draw() {
  // background(10);
  image(displaySun, 0, 0, width, height);
  // image(sun, 0, 0, width, height);

  // load Pixels
  sun.loadPixels();

  // Di qua hinh
  for (let i=0; i<sun.height; i++) {
    for (let j=0; j<sun.width; j++) {
      
        // Tinh index tuong duong trong array anh
        idx = (i*sun.width+j) * 4;
      
        // Truy cap va lay ra thong tin ve pixel tu array anh
        let r = sun.pixels[idx];
        let g = sun.pixels[idx+1];
        let b = sun.pixels[idx+2];
        
        // Tinh trung binh
        let grayScale = (r+g+b)/3;
        
        fill(grayScale);
        textSize(9);
        textAlign(CENTER, CENTER);
        // text(int(grayScale), j*gridW, i*gridH, gridW, gridH);

        stroke(200);
        strokeWeight(0.1);
        noFill();
        rect(j*gridW, i*gridH, gridW, gridH);

        if (grayScale>200) {
          stroke(200);
          strokeWeight(0.1);
          fill(255, 255, 0, 50);

          rect(j*gridW, i*gridH, gridW, gridH);
        } 
    
        poemChar = poems[idx/4];
        poemDict[poemChar] = grayScale;
        textSize(8);
        textAlign(CENTER, CENTER);
        fill(0);
        stroke(0)
        text(poemChar, j*gridW + gridW/2, i*gridH+gridH/2)
    }
  }

  if (baiTho.length == 0) {
    // baiTho = placeholder1();
    isMode1 = !isMode1;
    if (isMode1) {
      baiTho = placeholder1();
    } else {
      baiTho = placeholder2();
    }
  }
  
  if (frameCount % (3*60) == 0) {
      // chuyển từ obj dict sang ary của các cặp key-value
      // Convert the dictionary to an array of key-value pairs
      const sortedArray = Object.entries(poemDict)
      .sort(([, value1], [, value2]) => value2 - value1) // Lựa value theo thứ tự giảm dần
      .slice(0, 5); // chọn 5 cái lớn nhất

      // chuyển top 5 elements trở lại thành object
      const top5Dict = Object.fromEntries(sortedArray);
      let top5Words = Object.keys(top5Dict);
      // console.log(top5Dict);

      cauThoMau = baiTho.shift()
      soChu = int(cauThoMau.split(" ")[0])
      cauThoMau = cauThoMau.split(" ").slice(1).join(" ");
      
      for (let r=0; r<soChu; r++) {
        cauThoMau = cauThoMau.replace(`${r}`, top5Words[r])
      } 
      
      console.log(cauThoMau);
      // console.log(baiTho);
      // console.log(isMode1);
  }
  
}


function getSum(obj) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

function mousePressed() {
  if (playing) {
    sun.pause();
    displaySun.pause();
  }
   else {
    sun.play();
    displaySun.play();
   }
   playing = !playing;
 }

// function createPlaceholder(isMode1) {
//   baiTho = placeholder1();
//   return baiTho;
// }

function placeholder1() {
    let baiTho = [];
    baiTho.push("2 chúng tôi sẽ 0 để 1")
    for (let i=0; i<6; i++) {
      soChu = int(random(1, 6));
      dongTho = `${soChu} `
      for (let j=0; j<soChu; j++) {
        if (j%2==0) {
          dongTho += `sẽ ${j} `
        } else {
          dongTho += `để ${j} `
        }
      }
      baiTho.push(dongTho);
    }

    return baiTho
}

function placeholder2() {
    let baiTho = [];
    baiTho.push("2 để 0 chúng tôi sẽ 1")
    for (let i=0; i<6; i++) {
      soChu = int(random(1, 6));
      dongTho = `${soChu} `
      for (let j=0; j<soChu; j++) {
        if (j%2!=0) {
          dongTho += `sẽ ${j} `
        } else {
          dongTho += `để ${j} `
        }
      }
      baiTho.push(dongTho);
    }

    return baiTho
}