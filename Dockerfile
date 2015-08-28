FROM	ubuntu:15.04
MAINTAINER	Anton Antonov <anton.synd.antonov@gmail.com>

ENV PYTHONUNBUFFERED 1

# refresh package sources
RUN apt-get update
# install apt-dependencies
RUN apt-get install -y python3 python3-pip

RUN mkdir /app
WORKDIR /app

# copy app code
ADD . /app
# install python dependencies
pip3 install -r requirements.pip
