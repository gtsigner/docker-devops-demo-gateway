FROM centos
MAINTAINER zhaojunlike<zhaojunlike@gmail.com>
VOLUME ./task.sh /server/task.sh
###安装并添加任务到crontab
#RUN yum install crontabs -y \
#    && (crontab -l; echo "*/1 * * * * /server/task.sh" ) | crontab
##挂掉了
CMD /bin/bash /server/task.sh
