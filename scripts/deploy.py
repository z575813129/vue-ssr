#!/usr/bin/python
# -!- coding: utf-8 -!-

import os,sys


root_dir = os.path.join(sys.path[0], '..')
root_dir = os.path.normpath(root_dir)
print(root_dir)
output_dir = os.path.join(root_dir,'output/')
print(output_dir)
build_dir = os.path.join(root_dir,'.next/')
filename = 'wn-forum.tar.gz'

output_filename = os.path.join(output_dir+filename)
print(output_filename)


servers = {
    "sit": {
        'addr': 'root@47.99.207.9',
        'work_dir': '/srv/docker/wn-forum/',
        'script': 'deploy.py'
    },
    "prod": {
        'addr': 'root@47.96.135.188',
        'work_dir': '/srv/docker/wn-forum/',
        'script': 'deploy.py'
    },
}

if not os.path.isfile(output_filename):
  print('文件不存在')
  exit(1)


def deploy(server_name):
    print("部署[{0}]到环境：{1}".format(output_filename,server_name))
    server = servers.get(server_name)
    if server is None:
        print('服务器不存在')
        exit(0)
    command = 'scp {0} {1}:{2}'.format(output_filename, server['addr'], server['work_dir'])
    print(command)
    res = os.system(command)
    if int(res) != 0:
        print('上传文件失败')
        exit(1)
    print('上传文件成功')
    # command = 'ssh ' + server['addr'] + ' "' + server['work_dir'] + server['script'] + '"'
    command = 'ssh {0} "{1}"'.format(server['addr'], server['work_dir']+server['script'])
    print(command)
    res = os.system(command)
    if int(res) != 0:
        print('部署失败')
        exit(1)
    print('部署成功')

if __name__ == "__main__":
    argv= sys.argv

    if len(argv) < 2:
        print("请输入要发布的环境")
        exit(1)
    deploy(argv[1])