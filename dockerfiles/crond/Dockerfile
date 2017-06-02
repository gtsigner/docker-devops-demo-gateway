FROM centos
MAINTAINER zhaojunlike<zhaojunlike@gmail.com>
ADD ./crond/task.sh /server/task.sh
##安装并添加任务到crontab
RUN yum install crontabs -y \
    && (crontab -l; echo "*/1 * * * * /server/task.sh >>/var/log/task.log" ) | crontab
CMD crond
