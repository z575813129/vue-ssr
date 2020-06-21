#!/usr/bin/python
# -!- coding: utf-8 -!-

import os,sys
import tarfile


root_dir = os.path.join(sys.path[0], '..')
root_dir = os.path.normpath(root_dir)
print(root_dir)
output_dir = os.path.join(root_dir,'output')
print(output_dir)
build_dir = os.path.join(root_dir,'.nuxt')
filename = 'wn-forum.tar.gz'
targets = ['.nuxt', 'package.json', 'server', 'nuxt.config.js', 'static']

# 当文件夹不存在时创建文件夹
def createFolder(path):
    folder = os.path.exists(path)
    if not folder:
        os.makedirs(path)
        print('文件夹' + path + '不存在，创建该文件夹')

# 初始化目录
createFolder(output_dir)

# 清除原有build并编译
print('开始编译')
command = str.format('cd {0} && npm run build', root_dir, build_dir)
print(command)
result = os.system(command)
if int(result) != 0:
  print('编译失败')
  exit(1)
print('编译成功')


# 打包
output_filename = os.path.join(output_dir, filename)
print('开始删除原安装包')
if os.path.exists(output_filename):
  os.remove(output_filename)
  print('删除成功')
else:
  print('未发现原安装包')
print('开始打包')
with tarfile.open(output_filename, 'w:gz') as tar:
  for file in targets:
    pathfile = os.path.join(root_dir, file)
    if os.path.isdir(pathfile):
      tar.add(file, arcname=file)
    else:
      tar.add(file)

print('打包成功')
print(output_filename)
