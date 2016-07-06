FROM node:5.11
COPY . /xmo_booking_system_approval_bot
WORKDIR /xmo_booking_system_approval_bot
RUN npm install
RUN apt-get update \
    && apt-get install -y vim \
    && apt-get -y install rsyslog
ADD files/bin/start-cron.sh /usr/bin/start-cron.sh
RUN chmod +x /usr/bin/start-cron.sh
RUN touch /var/log/cron.log
CMD /usr/bin/start-cron.sh
