// Main idea: Resize về size numCols x numRows. 

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

let poemCorpus = [];
let poemDict = {};
let cauTrucBtn;
let countCauTruc = -1;


function preload() {
  sun = createVideo("assets/video.mp4");
  displaySun = createVideo("assets/video.mp4");
}

function setup() {

  // Calculate the ratio of original capture video
  vidRatio = sun.width/sun.height;
  numRows = int(numCols / vidRatio);
  sun.size(numCols, numRows);
  
  // Calculate display window
  displayH = displayW / vidRatio;
  createCanvas(displayW, displayH).elt.getContext('2d', { willReadFrequently: true });

  // Calculate grid
  gridW = width / numCols;
  gridH = height / numRows;

  sun.hide();
  sun.loop();

  displaySun.hide();
  displaySun.loop();

  // Từ nguồn chữ ban đầu, chọn ra 7 chữ ngẫu nhiên
  // Để dùng làm thơ
  shuffle(poems, true);
  for (let i=0; i<poems.length; i++) {
    poemCorpus.push(`${i}_${poems[int(random(0, 7))]}`);
  }

  for (let i=0; i<poemCorpus.length; i++) {
    poemDict[poemCorpus[i]] = 0;
  }

  textFont("Times New Roman");

  // cauTrucBtn = createSelect();
  // cauTrucBtn.position(10, windowHeight-30);
  // cauTrucBtn.option('sẽ _ để _');
  // cauTrucBtn.option('để _ sẽ _');
  // cauTrucBtn.option('để chúng tôi _');
  // cauTrucBtn.selected('sẽ _ để _');
  // cauTrucBtn.changed(function(){baiTho=[]});
}

function draw() {
  image(displaySun, 0, 0, width, height);

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
        
        // Ke grid
        // noFill();
        // rect(j*gridW, i*gridH, gridW, gridH);

        poemCharLookUp = poemCorpus[idx/4]; // return e.g: 34_xanh la
        poemChar = poemCharLookUp.split("_")[1];
        poemDict[poemCharLookUp] = grayScale; // update the word's grayscale

        if (grayScale>200) {
          stroke(200);
          strokeWeight(0.1);
          fill(255, 255, 0, 50);
          rect(j*gridW, i*gridH, gridW, gridH);

          textSize(12);
          textAlign(CENTER, CENTER);
          fill(0);
          text(poemChar, j*gridW + gridW/2, i*gridH+gridH/2)
        } else {
          textSize(11);
          textAlign(CENTER, CENTER);
          fill(150);
          text(poemChar, j*gridW + gridW/2, i*gridH+gridH/2)
        }
    }
  }

  // let c = cauTrucBtn.selected();

  // Tạo một bài thơ mới mỗi khi hết bài thơ cũ
  if (baiTho.length == 0) {
    countCauTruc+=1
    if (countCauTruc%3==0) {
      baiTho = placeholder1();
    } else if (countCauTruc%3==1) {
      baiTho = placeholder2();
    } else if (countCauTruc%3==2) {
      baiTho = placeholder3();
    } 
  }
  
  // làm thơ mỗi 3 giây (1 sec = 60 frames)
  if (frameCount % (3*60) == 0) {
      // Thông số độ sáng các ô được lưu dưới dạng dictionary (key-value)
      // Vdu: {"bất khả kháng": 50}
      // Truy cập và lấy 5 ô có độ sáng lớn nhất
      const sortedArray = Object.entries(poemDict)
      .sort(([, value1], [, value2]) => value2 - value1) 
      .slice(0, 5); 

      // Mỗi ô tương ứng một chữ. Tạo array của 5 chữ đó
      const top5Dict = Object.fromEntries(sortedArray);
      let top5Words = Object.keys(top5Dict);
      shuffle(top5Words, true);

      // Chọn lấy câu thơ placeholder tiếp theo
      cauThoMau = baiTho.shift()
      // Lấy thông tin số ô trống cần điền
      soChu = int(cauThoMau.split(" ")[0])
      cauThoMau = cauThoMau.split(" ").slice(1).join(" ");
      // Làm thơ: đi qua từng ô trống 
      // Thay số thứ tự chỗ trống (0, 1, 2, ...) bằng các chữ. 
      for (let r=0; r<soChu; r++) {
        cauThoMau = cauThoMau.replace(`${r}`, top5Words[r].split("_")[1])
      } 
      // Hiển thị bài thơ trên console
      console.log(cauThoMau);
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


// Cấu trúc 1: ___ sẽ ____ để
function placeholder1() {
    // tạo array trống để lưu thơ
    let baiTho = [];
    // câu đầu tiên có 2 chỗ trống: chúng tôi sẽ _ để _ 
    // 0, 1 tương ứng với thứ tự chỗ trống
    baiTho.push("2 chúng tôi sẽ 0 để 1")
    // tạo 6 câu trống tiếp theo 
    for (let i=0; i<6; i++) {
      // xác định xem bài thơ có bao nhiêu chỗ trống
      soChu = int(random(1, 6));
      dongTho = `${soChu} `
      for (let j=0; j<soChu; j++) {
        // các chỗ trống vị trí chẵn đi cùng vế "sẽ _"
        // các chỗ trống vị trí lẻ đi cùng vế "để _"
        if (j%2==0) {
          dongTho += `sẽ ${j} `
        } else {
          dongTho += `để ${j} `
        }
      }
      // thêm câu thơ vào array
      baiTho.push(dongTho);
    }

    return baiTho
}


// Cấu trúc 2: để _____ sẽ _____
function placeholder2() {
    // tạo array trống để lưu thơ
    let baiTho = [];
    // câu đầu tiên có 2 chỗ trống, để _ chúng tôi sẽ _
    // 0, 1 tương ứng với thứ tự chỗ trống
    baiTho.push("2 để 0 chúng tôi sẽ 1")
    // tạo 6 câu trống tiếp theo 
    for (let i=0; i<6; i++) {
      // xác định xem bài thơ có bao nhiêu chỗ trống
      soChu = int(random(1, 6));
      dongTho = `${soChu} `
      for (let j=0; j<soChu; j++) {
        // các chỗ trống vị trí chẵn đi cùng vế "để _"
        // các chỗ trống vị trí lẻ đi cùng vế "sẽ _"
        if (j%2!=0) {
          dongTho += `sẽ ${j} `
        } else {
          dongTho += `để ${j} `
        }
      }
      // thêm câu thơ vào array
      baiTho.push(dongTho);
    }

    return baiTho
}

// Cấu trúc 3: Để chúng tôi _______
function placeholder3() {
    let baiTho = [];
    // Mỗi câu chỉ có 1 chỗ trống duy nhất
    // chỗ trống ở vị trí 0
    baiTho.push("1 để chúng tôi 0");
    for (let i=0; i<6; i++) {
      baiTho.push("1 để chúng tôi 0");
    }
    return baiTho
}
