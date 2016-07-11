FROM node:5.11

RUN echo Asia/Hong_Kong | tee /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata

RUN apt-get update && apt-get install -y vim rsyslog

COPY . /trello_report_schedule

WORKDIR /trello_report_schedule

RUN npm install

ADD files/bin/start-cron.sh /usr/bin/start-cron.sh

RUN chmod +x /usr/bin/start-cron.sh

RUN touch /var/log/cron.log

CMD /usr/bin/start-cron.sh
