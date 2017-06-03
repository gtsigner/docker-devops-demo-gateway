#!/usr/bin/env bash
task_url="http://nginx/index/api/run_task.html"
while true
do
   curl $task_url  >> /server/logs/task.log
   sleep 10
done