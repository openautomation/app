import rospy
from std_msgs.msg import String
from geometry_msgs.msg import Twist
from std_msgs.msg import String

def cmd_move_callback(msg):
    rospy.loginfo(rospy.get_name() + ": " + str(msg))
    print msg.linear.x, msg.linear.y, msg.linear.z
    #xyz.move_to(msg.linear.x, msg.linear.y, msg.linear.z, block_until_complete=True)

def textcb(msg):
    print msg
    rospy.loginfo(rospy.get_name() + ": " + str(msg))

def init_ros_listener():
    rospy.init_node('xyz_listener', anonymous=True)
    rospy.Subscriber('/cmd_move_xyz', Twist, cmd_move_callback)
    rospy.Subscriber('/text', String, textcb)    
    rospy.spin()

init_ros_listener()

