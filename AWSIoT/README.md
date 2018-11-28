Command line to install certificate/package - NODEJS
 #download ca certificate 
wget https://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem 
# install packages
sudo apt-get install -y nodejs npm
npm install aws-iot-device-sdk