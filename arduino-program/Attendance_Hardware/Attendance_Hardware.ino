#include <Adafruit_Fingerprint.h>   //Thư viện Module Vân tay JM-101
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,16,2);

SoftwareSerial mySerial(2, 3);

#define SET 10     // Nút nhấn cài đặt
#define ADD 9     // Nút nhấn thêm
#define DEL 8     // Nút nhấn Xóa


byte Mode = 0;  // Chế độ ban đầu là 0. 0 là chế độ bình thường, 1 là chế độ chỉnh sửa
bool isMonitor = false;
bool isTimeKeeping = false;
byte id = -1;
String name = "";
byte countTimeButton = 0;
byte listID[20];
String listName[20];
byte listCong[20];
byte numList;
byte logOut = 0;

//// Số thành viên add = 0
//int addMember = 0;
//// Tên nhân viên : 16 byte, add
//int addMember0 = 10;
//int sizeName = 16;

// KHai báo cho Vân tay
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

///////////////////////////////////////// Cấu hình ///////////////////////////////////
void setup() {
  //Cấu hình chân Arduino
  pinMode(SET, INPUT_PULLUP);
  pinMode(ADD, INPUT_PULLUP);
  pinMode(DEL, INPUT_PULLUP);   // Bật chân nút nhấn là trở kéo lên

  //Cấu hình truyền thông
  Serial.begin(9600);  // Cài đặt truyền thông nối tiếp với PC

  finger.begin(57600);

  delay(5);
  lcd.init();
  lcd.backlight();
  
  if (finger.verifyPassword()) {
    lcd.setCursor(0,0);
    lcd.print("OK!");
  } else {
    Serial.println("Khong thay cam bien van tay 🙁");
    lcd.setCursor(0,0);
    lcd.print("Error! 🙁");
    while (1) { delay(1); }
  }
  delay(1000);
}
///////////////////////////////////////// Main Loop ///////////////////////////////////
void loop () {
  if (isMonitor) {
    switch(Mode){
      case 0: StartMode(); break;
      case 1: ViewMode(); break;
      case 2: SetModeF(); break;
    }
  }
  else {
    if (isTimeKeeping) {
      switch(Mode) {
        case 0: StartMode(); break;
        case 1: ViewMode(); break;
      }
    }
    else {
      StartMode();
    }
  }
}

// Mode
void StartMode(){
  logOut = 0;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Start Mode");
  if (isTimeKeeping){
    lcd.setCursor(0, 1);
    lcd.print("Hello ");
    lcd.print(name);
  }
  while(1){
    if(!digitalRead(SET)){
      delay(50);
      countTimeButton++;
      if(countTimeButton >=20 && isMonitor) {
        Mode = 2;
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Set Mode");
        while(!digitalRead(SET));
        break;
      }
    } 
    else {
      if(countTimeButton > 0){
        countTimeButton = 0;
        // Xem cong
        if (isTimeKeeping) {
          Mode = 1;
          break;
        }
        else {
          lcd.clear();
          lcd.print("Confirm first!");
          delay(1000);
          break;
        }
      }
    }
    int x = -1;
    if (!isTimeKeeping) {
      x = getFingerprintIDez();
    }       
    if(x >= 0){
      logOut = 0;
      isTimeKeeping = true;
      bool isReturn = false;  // Kiểm tra xem nhân viên điểm danh lượt về hay lượt đi
      int i = 0;
      while (1) {
        if (Serial.available() > 0) {
          String str = Serial.readStringUntil('\n');
          int pos1 = str.indexOf(":");
          int pos2 = str.indexOf(":", pos1+1);

          name = str.substring(0, pos1);
          name.trim();
          String state = str.substring(pos1+1, pos2);
          state.trim();
          String monitor = str.substring(pos2+1);
          monitor.trim();
          if (state == "0") {
            isReturn = true;
          }
          if (monitor == "1") {
            isMonitor = true;
          }
          break;    
        }
      }
      if(isReturn){
        lcd.setCursor(0,1);
        lcd.print("                              ");
        lcd.setCursor(0,1); 
        lcd.print("Bye ");
        lcd.print(name);
      }
      else {
        lcd.setCursor(0,1);
        lcd.print("                              ");
        lcd.setCursor(0,1); 
        lcd.print("Hello ");
        lcd.print(name);
      }
      while (1) {
        if (Serial.available() > 0) {
          String str = Serial.readStringUntil('\n');
          Serial.println(str);
          if (str == "end") {
            numList = i;
            break;
          };
          int pos1 = str.indexOf(":");
          int pos2 = str.indexOf(":", pos1+1);
          listID[i] = (byte) str.substring(0, pos1).toInt();
          listName[i] = str.substring(pos1+1, pos2);
          listCong[i] = (byte) str.substring(pos2 + 1).toInt();
          Serial.println(listName[i]);
          i ++;
        }
      }
    }
    if (digitalRead(SET)) {
        delay(50);
        logOut ++;
        if (logOut > 100) {
          LogOut();
          break;
        }
      }
      if (!digitalRead(DEL)) {
        LogOut();
        break;
      }
  }
}

void ViewMode() {
  int i = 0;
  lcd.clear(); 
  lcd.print("View Mode");
  lcd.setCursor(0,1);
  lcd.print(listName[i]);
  lcd.setCursor(13,1);
  lcd.print(listCong[i]);
  while(1){
    logOut = 0;
    while (digitalRead(SET) && digitalRead(ADD) && digitalRead(DEL)) {
      delay(25);
      logOut ++;
      if (logOut > 200) {
        LogOut();
        break;
      }
    }
    if (logOut > 200) break;
    if(!digitalRead(SET)){
      Mode = 0;
      while(!digitalRead(SET));
      delay(100);
      break;
    }
    if(!digitalRead(ADD)){
      i ++;
      if(i == numList) i = 0;
      lcd.setCursor(0,1); 
      lcd.print("                ");
      lcd.setCursor(0,1);
      lcd.print(listName[i]);
      lcd.setCursor(13,1);
      lcd.print(listCong[i]);
      while(!digitalRead(ADD));
      delay(100);
    }
    if(!digitalRead(DEL)){
      i--;
      if (i < 0) i = numList - 1;
      lcd.setCursor(0,1); 
      lcd.print("                ");
      lcd.setCursor(0,1);
      lcd.print(listName[i]);
      lcd.setCursor(13,1);
      lcd.print(listCong[i]);
      while(!digitalRead(DEL));
      delay(100);
    }
  }
}

void SetModeF(){
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Set Mode");
  int id = -1;
  delay(100);
  while(1){
    logOut = 0;
    while(digitalRead(SET) && digitalRead(ADD) && digitalRead(DEL)) {
      delay(25);
      logOut ++;
      if (logOut > 200) {
        LogOut();
        break;
      }
    }
    if (logOut > 200) break;
    if(!digitalRead(SET)){
      delay(100);
      countTimeButton++;
      if(countTimeButton >=20){
        Mode = 0;
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Start Mode");
        while(!digitalRead(SET));
        break;
      }
    }
    else {
      if(countTimeButton > 0){
        countTimeButton = 0;
        id ++;
        if (id == numList) id = 0;
        lcd.setCursor(0,1);
        lcd.print("                ");
        lcd.setCursor(4,1);
        lcd.print(listID[id]);
        lcd.setCursor(6,1);
        lcd.print(listName[id]);
      }
    }
    if(!digitalRead(ADD)){
      while (!getFingerprintEnroll(id));
      delay(500);
      break;
    }
    if(!digitalRead(DEL)){
      lcd.clear();
      lcd.print("Sure to delete");
      lcd.setCursor(0, 1);
      lcd.print(listID[id] + "-" + listName[id]);
      int count = 0;
      while(digitalRead(SET) && digitalRead(ADD)) {
        delay(50);
        count ++;
        if (count > 40) break;
      }
      if (count > 40) break;
      if(!digitalRead(SET)) {
        deleteFingerprint(id);
      }
      if(!digitalRead(ADD)) {
        break;
      }
      delay(1000);
    }
  }
}
// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) {
   lcd.setCursor(0,1); 
   lcd.print("Finger not found");
   delay(2000);
   lcd.setCursor(0,1);
   lcd.print("                              ");
   return -1;
  }  

  // found a match!
  Serial.print("ID:");   Serial.println(finger.fingerID);
  id = finger.fingerID;
  return finger.fingerID;
}

uint8_t getFingerprintEnroll(uint8_t id) {
  int p = -1;
  lcd.setCursor(0, 0);
  lcd.print("                ");
  lcd.setCursor(0, 0);
  lcd.print("Add new");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      lcd.setCursor(10,0);
      lcd.print("OK!");
      delay(100);
      lcd.print("   ");
      break;
    case FINGERPRINT_NOFINGER:
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Imaging error");
      break;
    default:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      break;
    case FINGERPRINT_IMAGEMESS:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Feature fail");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Feature fail");
      return p;
    default:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Unknown error");
      return p;
  }
  
  lcd.setCursor(10,0);
  lcd.print("MOVE");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }

  p = -1;
  lcd.setCursor(10,0);
  lcd.print("AGAIN");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      lcd.setCursor(0, 1);
      lcd.print("Image taken");
      delay(100);
      lcd.print("           ");
      break;
    case FINGERPRINT_NOFINGER:
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Imaging error");
      break;
    default:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Unknown error");
      break;
    }
  }

  // OK success!
  lcd.setCursor(10,0);
  lcd.print("      ");
  lcd.print("OK!");
  delay(100);
  lcd.print("   ");
  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      lcd.setCursor(0, 1);
      lcd.print("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Feature fail");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Feature fail");
      return p;
    default:
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.print("Unknown error");
      return p;
  }

  // OK converted!
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("Prints matched!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("Communication error");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("FPs not match");
    return p;
  } else {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("Unknown error");
    return p;
  }

  p = finger.storeModel(listID[id]);
  if (p == FINGERPRINT_OK) {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("Stored!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("Error writing to flash");
    return p;
  } else {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.print("Unknown error");
    return p;
  }
  lcd.setCursor(10,0);
  lcd.print("FINISH");
  delay(1000);
  return true;
}

uint8_t deleteFingerprint(uint8_t id) {
  uint8_t p = -1;

  p = finger.deleteModel(id);

  if (p == FINGERPRINT_OK) {
    Serial.println("Delete:id");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not delete in that location");
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
  } else {
    Serial.print("Unknown error: 0x"); Serial.println(p, HEX);
  }
  lcd.clear();
  lcd.print("Delete success");
  return p;
}

void LogOut() {
  Mode = 0;
  isMonitor = false;
  isTimeKeeping = false;
}