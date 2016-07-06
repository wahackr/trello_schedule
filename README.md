##Setup:
-install docker
-sudo docker build -t trello_report_schedule_nodeapp .
-sudo docker run -d --name trello_report_schedule_nodeapp --restart=always -v /home/ubuntu/trello_report_schedule_docker/logs:/trello_report_schedule/logs trello_report_schedule_nodeapp

##Set Timezone
-dpkg-reconfigure tzdata

##Setup Cornjob
-1 0 * * * /usr/local/bin/node /trello_report_schedule/app.js >> /trello_report_schedule/logs/run.log

##other useful commands:

   -List all images
   -`sudo docker images`

   -Remove image
   -`sudo docker rmi IMAGE_ID`

   -List all containers
   -`sudo docker ps -a`

   -Stop container
   -`sudo docker stop CONTAINER_ID`

   -Remove container
   -`sudo docker rm CONTAINER_ID`
