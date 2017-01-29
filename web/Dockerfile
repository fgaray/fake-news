FROM debian:testing

RUN apt-get update && apt-get install nodejs npm tesseract-ocr tesseract-ocr-spa -y

COPY ./ /web
WORKDIR /web
RUN npm install

EXPOSE 8080 8080

CMD ["nodejs", "main.js"]
