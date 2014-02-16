ffmpeg -s 640x480 -f video4linux2 -i /dev/video0 -f ogg -b 800k -r 30 -vf scale=1024:768 http://localhost:8082/password/1024/768/
