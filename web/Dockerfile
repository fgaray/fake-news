FROM debian:testing

RUN apt-get update && apt-get install nodejs npm tesseract-ocr tesseract-ocr-spa make -y

WORKDIR /web

EXPOSE 8080 8080

CMD ["make", "run"]
