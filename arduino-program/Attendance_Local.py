import serial.tools.list_ports
import time
import datetime
import requests
import json

ports = serial.tools.list_ports.comports()
serialInst = serial.Serial()

portsList = []

for onePort in ports:
    portsList.append(str(onePort))
    print(str(onePort))

val = input("Select Port: COM")

for x in range(0,len(portsList)):
    if portsList[x].startswith("COM" + str(val)):
        portVar = "COM" + str(val)
        print(portVar)

serialInst.baudrate = 9600
serialInst.port = portVar
serialInst.open()
time.sleep(2)

link = "https://iot-attendance-system-be.vercel.app/"
 
while True:
    if serialInst.in_waiting:
        packet = serialInst.readline().decode().rstrip('\n')
        print(packet)
        if (packet.startswith("ID:")):
            id = int(packet.replace("ID:", "").strip())
            response = requests.get(link + "users/" + str(id))
            response_json = json.loads(response.text)
            role = 1
            if (response_json['role'] == "user"):
                role = 0
            if (response_json['role'] == "admin"):
                role = 1
            serialInst.write(str.encode(response_json['username'] + ':' + str(1) + ':' + str(role) + '\n'))
            request = requests.post(link + "/attendances", data = {'userId':str(id), 'time':datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")})
            if (role == 1):
                list_user_response = requests.get(link + "attendances/month")
                list_user_json = json.loads(list_user_response.text)
                for user_json in list_user_json:
                    serialInst.write(str.encode(user_json['id'] + ':' + user_json['username'] + ':' + str(user_json['numDay']) + '\n'))
                    time.sleep(0.2)
            else:
                user_response = requests.get(link + "attendances/user/" + str(id) + "/month")
                user_json = json.loads(user_response.text)
                serialInst.write(str.encode(user_json['id'] + ':' + user_json['username'] + ':' + str(user_json['numDay']) + '\n'))
            serialInst.write(str.encode('end' + '\n'))